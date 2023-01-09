import { firebase } from "~/lib/firebase";

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

  const user = response.docs.map(item => {
    return {
      ...item.data(),
      docId: item.id
    }
  })

  return user;  //Trả ra 1 mảng có 1 phần tử là thông tin của user
}


export async function createNewPost() {
  
}


export async function verifyAccout() { //Thực hiện gửi email xác minh tài khoản
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
