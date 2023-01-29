import { firebase, FieldValue } from "~/lib/firebase";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const db = firebase.firestore();

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

export async function getComments(docId) {}

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

export async function getSuggestionsProfilesById(userId, following) {
  let responses = [];

  try {
    if (following.length >= 10) {
      responses = await db.collection("users").limit(10).get();
    } else {
      responses = await db.collection("users");
    }
  } catch (error) {}

  return responses;
}

export async function updateLikePost(postId, userIdLiked, isLiked) {
  console.log(userIdLiked);
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
