import { firebase, FieldValue } from "~/lib/firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";

var _ = require("lodash");

const db = firebase.firestore();

// GET
export async function checkUserNameExist(username) {
  //Check tên user đã có trong firestore chưa
  const responses = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  return responses.docs.length; //Trả về độ dài mảng dữ liệu. 0: Chưa tồn tại | 1: Đã có
}

export async function getUser(data) {
  //Lấy data theo id hoặc username (data là 1 Object)
  const responses = await db
    .collection("users")
    .where(`${Object.keys(data)[0]}`, "in", Object.values(data)[0])
    .get();

  const user = responses.docs.map((item) => {
    return {
      ...item.data(),
      docId: item.id,
    };
  });

  return user; //Trả ra 1 mảng có 1 phần tử là thông tin của user
}

export async function getPostOfUser(userId) {
  const response = await db
    .collection("posts")
    .where("userId", "==", userId)
    .get();
  const posts = response.docs.map((post) => ({
    ...post.data(),
    docId: post.id,
  }));

  return posts;
}

export async function getPostWithOwnerById(docId) {
  const postInfo = await db.collection("posts").doc(docId).get();
  const ownerInfo = await getUser({
    userId: [postInfo.data().userId],
  });
  const { avatarUrl, username } = ownerInfo[0];
  return {
    ...postInfo.data(),
    avatarUrl,
    username,
  };
}

export async function getSuggestionsProfilesByFollowing(
  LoggedInUserId,
  following,
  limit
) {
  let suggestion = [];
  const counts = {};
  const userRef = db.collection("users");

  for (const userId of following) {
    const query = userRef.where("followers", "array-contains", userId);
    const getSuggestionsProfiles = await query.get(); //Trả về 1 mảng người dùng được following của mình (bên thứ 2) theo dõi

    for (const profileDoc of getSuggestionsProfiles.docs) {
      const profile = profileDoc.data();
      const profileId = profile.userId;

      if (following.includes(profileId) || profileId === LoggedInUserId)
        continue;

      if (!counts[profileId]) {
        counts[profileId] = { profile, count: 0 };
      }

      counts[profileId].count++;
    }
  }

  // sort the profiles based on the count
  const profiles = Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.profile);

  suggestion = [...profiles];

  if (profiles.length < limit) {
    //Nếu số người được gợi ý ít thì sẽ gợi ý thêm những users có nhiều lượt follow nhất
    const getPopularUsers =
      following.length > 0
        ? await userRef
            .where("userId", "not-in", following)
            .limit(limit * 2 + 1)
            .get()
        : await userRef.limit(limit * 2 + 1).get();
    //limit*2 tránh trường hợp trùng với tất cả người dùng đã lấy trước đó / +1 trùng người dùng hiện tại

    for (const popularUserDoc of getPopularUsers.docs) {
      const popularUser = popularUserDoc.data();
      let isExist = false;

      if (
        popularUser.userId === LoggedInUserId ||
        profiles.includes(popularUser)
      )
        continue;

      for (const prevProfile of suggestion) {
        if (_.isEqual(prevProfile, popularUser)) {
          //Check xem profile phổ biến đã có trong mảng trước đó chưa
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        suggestion = [...suggestion, popularUser];
      }
    }
  }
  // return the top 'limit' profiles
  return suggestion.slice(0, limit);
}

// CREATE
export async function createNewPost(photos, userId, caption) {
  try {
    await db.collection("posts").add({
      photos,
      userId,
      likes: [],
      comments: [],
      caption,
      dateCreated: Date.now(),
    });
  } catch (error) {
    console.log(error);
  }
}

// UPDATE
export async function updateLikePost(postId, userIdLiked, isLiked) {
  return db
    .collection("posts")
    .doc(postId)
    .update({
      likes: !isLiked
        ? FieldValue.arrayUnion(userIdLiked)
        : FieldValue.arrayRemove(userIdLiked),
    });
}

export async function updateCurrentUserFolling(
  currentUser,
  profileId,
  isFollowing //true, false
) {
  return db
    .collection("users")
    .where("userId", "==", currentUser)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.update({
          following: isFollowing
            ? FieldValue.arrayRemove(profileId) //Nếu đã follow -> hủy follow: xóa userId khỏi mảng following
            : FieldValue.arrayUnion(profileId), //Ngược lại });
        });
      });
    });
}

export async function updateFollower(currentUser, profileId, isFollowing) {
  return db
    .collection("users")
    .where("userId", "==", profileId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.update({
          followers: isFollowing
            ? FieldValue.arrayRemove(currentUser) //Nếu đã follow -> hủy follow: xóa userId khỏi mảng following
            : FieldValue.arrayUnion(currentUser), //Ngược lại });
        });
      });
    });
}

export async function updateAvatar(loggedInUserId, newAvatarUrl) {
  return db
    .collection("users")
    .where("userId", "==", loggedInUserId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        doc.ref.update({ avatarUrl: newAvatarUrl });
      });
    });
}

export async function updateUserInfo(loggedInUserId, newData) {
  /*
    newData: object chứa các trường có thể update (fullname, birthday, gender)
    {
      fullname: string,
      birthday: string,
      gender: number
    }
  */
  return db
    .collection("users")
    .where("userId", "==", loggedInUserId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          fullname: newData.fullname,
          birthday: newData.birthday,
          gender: newData.gender,
        });
      });
    });
}

// DELETE
export async function deletePost(postId, imageUrls) {
  const storage = getStorage();

  await deleteDoc(doc(db, "posts", postId));

  const promises = [];
  imageUrls.forEach((imageUrl) => {
    const desertRef = ref(storage, imageUrl);
    promises.push(deleteObject(desertRef));
  });
  await Promise.all(promises);
}

export async function deleteComment(postId, commentId) {
  const postRef = db.collection("posts").doc(postId);

  return postRef.get().then((doc) => {
    let comments = doc.data().comments;
    let comment = comments.find((x) => x.commentId === commentId);
    postRef.update({
      comments: FieldValue.arrayRemove(comment),
    });
  });
}

// SENT EMAIL VERIFY  ACCOUNT
export async function verifyAccout() {
  //Thực hiện gửi email xác minh tài khoản
  firebase.auth().useDeviceLanguage(); //Sử dụng ngôn ngữ của máy tính đang dùng

  const sentVerificationEmail = async function () {
    try {
      await firebase.auth().currentUser.sendEmailVerification();
    } catch (error) {
      console.log(error);
    }
  };

  sentVerificationEmail();
}

// SEARCH USER
export async function searchUserByUsernameOrFullname(searchKeyword) {
  const querySnapshot = await db
    .collection("users")
    .where("fullname", "==", searchKeyword)
    .get();
  const results = querySnapshot.docs.map((doc) => doc.data());

  return results;
}
