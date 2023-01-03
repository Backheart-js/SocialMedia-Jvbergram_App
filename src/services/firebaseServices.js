import { firebase } from "~/lib/firebase";

export async function checkUserNameExist(username) {    //Check tên user đã có trong firestore chưa
    const response = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return response.docs.length; //Trả về độ dài mảng dữ liệu. 0: Chưa tồn tại | 1: Đã có 
}

export async function signupWithEmailAndPassword( info, email, password) {
    //Chức năng đăng nhập với Email/Pass
    try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email.toLowerCase(), password); //Tạo 1 auth mới lên firebase
        const user = res.user; //Response trả về thông tin của auth vừa tạo
        await firebase.firestore().collection('users').add({ //Đồng thời tạo 1 bản ghi dữ liệu mới vào users
          userId: user.uid,
          fullname: info.fullname,
          username: info.username,
          email: email.toLowerCase(),
          dateCreated: Date.now(),
          followers: [],
          following: [],
        });

      } catch (err) {
        console.error(err);
        alert(err.message);
      }
}