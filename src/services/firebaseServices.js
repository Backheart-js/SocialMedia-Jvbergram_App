import { firebase } from "~/lib/firebase";
import { v4 } from "uuid";

export async function checkUserNameExist(username) {
  //Check tên user đã có trong firestore chưa
  const response = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return response.docs.length; //Trả về độ dài mảng dữ liệu. 0: Chưa tồn tại | 1: Đã có
}

export async function getUserById(userId) {
  const response = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  const user = response.docs.map((item) => {
    return {
      ...item.data(),
      docId: item.id,
    };
  });

  return user; //Trả ra 1 mảng có 1 phần tử là thông tin của user
}

export async function createNewPost(photos, userId, caption) {
  try {
    await firebase.firestore().collection("posts").add({
      photos,
      userId,
      postId: v4(),
      likes: {
        userId: [],
        quantity: 0
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
      dateCreated: Date.now()
    })
  } catch (error) {
    console.log(error);
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

