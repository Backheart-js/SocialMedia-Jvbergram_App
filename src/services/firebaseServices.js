import { firebase } from "~/lib/firebase";
import { v4 } from "uuid";

const db = firebase.firestore();

export async function checkUserNameExist(username) {
  //Check tên user đã có trong firestore chưa
  const responses = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return responses.docs.length; //Trả về độ dài mảng dữ liệu. 0: Chưa tồn tại | 1: Đã có
}

export async function getUserById(userId) {
  const responses = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  const user = responses.docs.map((item) => {
    return {
      ...item.data(),
      docId: item.id,
    };
  });

  return user; //Trả ra 1 mảng có 1 phần tử là thông tin của user
}

export async function createNewPost(photos, userId, caption) {
  try {
    await firebase
      .firestore()
      .collection("posts")
      .add({
        photos,
        userId,
        postId: v4(),
        likes: {
          userId: [],
        },
        comments: [
          // {
          //   userId: "nz0inbDI6NWnNhQgMvRBXJhM3Ho1",
          //   displayName: "bn29122001",
          //   content: "Nice pic bro!",
          //   likes: 0,
          //   dateCreated: Date.now(),
          // }
        ],
        caption,
        dateCreated: Date.now(),
      });
  } catch (error) {
    console.log(error);
  }
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

export async function getPosts(userId, following) {
  try {
    const responses = await db
      .collection("posts")
      .where("userId", "in", following.concat(userId))
      .get();

    const userFollowedPhotos = responses.docs.map((photo) => ({
      ...photo.data(),
      docId: photo.id
    }))

    const photosWithUserInfo = await Promise.all(
      userFollowedPhotos.map(async (photo) => {
        let youLikedThisPost = false;
        if (photo.likes.userId.includes(userId)) {
          youLikedThisPost=true;
        }
        const userInfo = await getUserById(photo.userId); //Trả về 1 mảng nhưng chỉ chứ 1 phần tử
        const { avatarUrl, username } = userInfo[0];

        return {
          avatarUrl,
          username,
          ...photo,
          youLikedThisPost
        }
      })
    )

    return photosWithUserInfo;
  } catch (error) {
    console.error(error);
  }
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
