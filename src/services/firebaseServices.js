import { firebase } from "~/lib/firebase";
import {
  getStorage,
  ref,
  deleteObject
} from "firebase/storage";
import { v4 } from "uuid";
import { doc, deleteDoc } from "firebase/firestore";

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

  await deleteDoc(doc(db, "posts", postId))

  const promises = [];
  imageUrls.forEach((imageUrl) => {
    const desertRef = ref(storage, imageUrl);
    promises.push(deleteObject(desertRef));
  });
  await Promise.all(promises); 
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
