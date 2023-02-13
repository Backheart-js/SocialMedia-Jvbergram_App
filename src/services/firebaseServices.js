import { firebase, FieldValue } from "~/lib/firebase";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  deleteDoc,
  updateDoc,
  deleteField,
  getDocs,
  collection,
  query,
  limit,
  startAt,
  orderBy,
} from "firebase/firestore";
import sortUserByFollower from "~/utils/sortUserByFollower";
import { v4 } from "uuid";
import { openNoti } from "~/redux/slice/notificationSlice";
import { useDispatch } from "react-redux";

var _ = require("lodash");
const db = firebase.firestore();

// GET
export async function getRandomPost() {
  const totalDocs = await getDocs(collection(db, "posts"));
  const randomOffset = Math.floor(Math.random() * totalDocs.size);
  const q = query(collection(db, "posts"), orderBy('dateCreated'), startAt(randomOffset), limit(10));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    return {...doc.data(), docId: doc.id}
  });
}



export async function checkUserNameExist(username) {
  //Check tên user đã có trong firestore chưa
  const responses = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  return responses.docs.length; //Trả về độ dài mảng dữ liệu. 0: Chưa tồn tại | 1: Đã có
}

export async function checkChatRoom(loggedInUserId, receiverIds) {
  const promises = [];
  const chatRooms = [];
  receiverIds.forEach((receiverId) => {
    const combinedId =
      loggedInUserId > receiverId
        ? loggedInUserId.concat(receiverId)
        : receiverId.concat(loggedInUserId);
    const getRoom = db.collection("conversations").doc(combinedId).get();
    promises.push(getRoom);
  });

  const result = await Promise.all(promises);

  for (const chatRoom of result) {
    chatRooms.push(chatRoom);
  }

  return chatRooms;
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
  const { avatarUrl, username, fullname } = ownerInfo[0];
  return {
    avatarUrl,
    username,
    fullname,
    ...postInfo.data(),
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
    const getAllUser =
      following.length > 0
        ? await userRef
            .where("userId", "not-in", following)
            .get()
            .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
        : await userRef
            .get()
            .then((snapshot) => snapshot.docs.map((doc) => doc.data()));
    //limit*2 tránh trường hợp trùng với tất cả người dùng đã lấy trước đó / +1 trùng người dùng hiện tại
    const popularUsers = sortUserByFollower(getAllUser).slice(0, limit * 2 - 1);

    for (const popularUser of popularUsers) {
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
  await db.collection("posts").add({
    photos,
    userId,
    likes: [],
    comments: [],
    caption,
    dateCreated: Date.now(),
  });
}

export async function createNewChatRoom(
  loggedInUserId,
  loggedInUsername,
  receiverId,
  username,
  content
) {
  const combinedId =
    loggedInUserId > receiverId
      ? loggedInUserId.concat(receiverId)
      : receiverId.concat(loggedInUserId);
  await updateDoc(doc(db, "userChats", loggedInUserId), {
    [combinedId + ".partnerId"]: receiverId,
    [combinedId + ".username"]: username,
    [combinedId + ".date"]: Date.now(),
    [combinedId + ".lastMessage"]: content,
    [combinedId + ".lastSender"]: loggedInUserId,
    [combinedId + ".seen"]: {
      time: Date.now(),
      status: true,
    },
  });
  await updateDoc(doc(db, "userChats", receiverId), {
    [combinedId + ".partnerId"]: loggedInUserId,
    [combinedId + ".username"]: loggedInUsername,
    [combinedId + ".date"]: Date.now(),
    [combinedId + ".lastMessage"]: content,
    [combinedId + ".lastSender"]: loggedInUserId,
    [combinedId + ".seen"]: {
      time: Date.now(),
      status: false,
    },
  });

  return combinedId;
}

export async function createNewConversation(chatroomId, newMessage) {
  //Tạo tin nhắn mới trong collection hội thoại, nếu có newMessage thì thêm vào, còn không thì để mảng rỗng
  const conversationRef = db.collection("conversations");

  return conversationRef
    .doc(chatroomId)
    .set({ messages: newMessage ? [newMessage] : [] });
}

export async function createNewMessage(
  loggedInUserId,
  loggedInUsername,
  receiverIds,
  receiverUsernames,
  content
) {
  /*
    Gửi message khi click vào button, xảy ra 2 trường hợp
    - Trước đó chưa nhắn tin -> tạo chatroom mới 
    - Đã từng nhắn -> Thêm message vào collection "conversation" có id tương ứng
  */
  //biến receiverIds: người nhận là mảng vì có thể gửi 1 tin cho nhiều người
  const chatRoomSnapshot = await checkChatRoom(loggedInUserId, receiverIds);
  chatRoomSnapshot.forEach(async (room, index) => {
    if (!room.exists) {
      //Chưa từng gửi tin nhắn trước đó
      const newMessage = {
        messageId: v4(),
        content,
        sender: loggedInUserId,
        date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
      };

      const newChatRoomId = await createNewChatRoom(
        loggedInUserId,
        loggedInUsername,
        receiverIds[index],
        receiverUsernames[index],
        content
      ); //Tạo room mới/Lấy RoomId
      await createNewConversation(newChatRoomId, newMessage); //Tạo document mới trong conversation collection
    } else {
      //Đã từng nhắn tin rồi
      const chatRoomId = room.id;
      sentMessage(chatRoomId, content, receiverIds[index], loggedInUserId);
    }
  });
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

export async function updateDefaultAvatar(loggedInUserId) {
  return db
  .collection("users")
  .where("userId", "==", loggedInUserId)
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach((doc) => {
      doc.ref.update({ "avatarUrl.current": "" });
    });
  });
}

export async function reuseAvatar(loggedInUserId, avatarUrl) {
  const snapshot = await db
    .collection("users")
    .where("userId", "==", loggedInUserId)
    .get();

  snapshot.forEach((doc) => {
    doc.ref.update({ "avatarUrl.current": avatarUrl });
  });
}

export async function sentMessage(chatRoomId, content, receiverId, senderId) {
  const newMessage = {
    messageId: v4(),
    content,
    sender: senderId,
    date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
  };
  await db
    .collection("conversations")
    .doc(chatRoomId)
    .update({
      messages: FieldValue.arrayUnion(newMessage),
    });
  await db
    .collection("userChats")
    .doc(receiverId)
    .update({
      [chatRoomId + ".date"]: Date.now(),
      [chatRoomId + ".lastMessage"]: newMessage.content,
      [chatRoomId + ".lastSender"]: senderId,
      [chatRoomId + ".seen.status"]: false,
    });
  await db
    .collection("userChats")
    .doc(senderId)
    .update({
      [chatRoomId + ".date"]: Date.now(),
      [chatRoomId + ".lastMessage"]: newMessage.content,
      [chatRoomId + ".lastSender"]: senderId,
      [chatRoomId + ".seen.time"]: Date.now(),
    });
}
export async function sentHeartIcon(chatRoomId, receiverId, senderId) {
  const newMessage = {
    messageId: v4(),
    heartIcon: true,
    sender: senderId,
    date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
  };
  await db
    .collection("conversations")
    .doc(chatRoomId)
    .update({
      messages: FieldValue.arrayUnion(newMessage),
    });
  await db
    .collection("userChats")
    .doc(receiverId)
    .update({
      [chatRoomId + ".date"]: Date.now(),
      [chatRoomId + ".lastMessage"]: { heartIcon: true },
      [chatRoomId + ".lastSender"]: senderId,
      [chatRoomId + ".seen.status"]: false,
    });
  await db
    .collection("userChats")
    .doc(senderId)
    .update({
      [chatRoomId + ".date"]: Date.now(),
      [chatRoomId + ".lastMessage"]: { heartIcon: true },
      [chatRoomId + ".lastSender"]: senderId,
      [chatRoomId + ".seen.time"]: Date.now(),
    });
}
export async function sentMessageImage(
  chatRoomId,
  image,
  receiverId,
  senderId,
  callbackReset
) {
  const storage = getStorage();
  const metadata = {
    contentType: "image/*",
  };

  const storageRef = ref(storage, `conversations/${image.name}-${v4()}`);
  const uploadTask = uploadBytesResumable(storageRef, image, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      switch (snapshot.state) {
        case "paused":
          break;
        case "running":
          break;
        default:
      }
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          break;
        case "storage/canceled":
          break;
        case "storage/unknown":
          break;
        default:
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        const newMessage = {
          messageId: v4(),
          image: downloadURL,
          sender: senderId,
          date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
        };
        await db
          .collection("conversations")
          .doc(chatRoomId)
          .update({
            messages: FieldValue.arrayUnion(newMessage),
          });
        await db
          .collection("userChats")
          .doc(receiverId)
          .update({
            [chatRoomId + ".date"]: Date.now(),
            [chatRoomId + ".lastMessage"]: { image: downloadURL },
            [chatRoomId + ".lastSender"]: senderId,
            [chatRoomId + ".seen.status"]: false,
          });
        await db
          .collection("userChats")
          .doc(senderId)
          .update({
            [chatRoomId + ".date"]: Date.now(),
            [chatRoomId + ".lastMessage"]: { image: downloadURL },
            [chatRoomId + ".lastSender"]: senderId,
            [chatRoomId + ".seen.time"]: Date.now(),
          });
        callbackReset();
      });
    }
  );

  const newMessage = {
    messageId: v4(),
    image,
    sender: senderId,
    date: Date.now(), //Không dùng được timestamp vì firebase không cho dùng trong array
  };
  await db
    .collection("conversations")
    .doc(chatRoomId)
    .update({
      messages: FieldValue.arrayUnion(newMessage),
    });
  await db
    .collection("userChats")
    .doc(receiverId)
    .update({
      [chatRoomId + ".date"]: Date.now(),
      [chatRoomId + ".lastMessage"]: newMessage.content,
      [chatRoomId + ".lastSender"]: senderId,
      [chatRoomId + ".seen.status"]: false,
    });
  await db
    .collection("userChats")
    .doc(senderId)
    .update({
      [chatRoomId + ".date"]: Date.now(),
      [chatRoomId + ".lastMessage"]: newMessage.content,
      [chatRoomId + ".lastSender"]: senderId,
      [chatRoomId + ".seen.time"]: Date.now(),
    });
}

export async function updateSeenMessage(chatRoomId, userId) {
  await db
    .collection("userChats")
    .doc(userId)
    .update({
      [chatRoomId + ".seen"]: {
        time: Date.now(),
        status: true,
      },
    });
}

export async function updateChatRoomOfUser(userId, chatroomId, isAddRoom) {
  //Thêm/Xóa chatroomId của user trong Users collection
  return db
    .collection("users")
    .where("userId", "==", userId)
    .get()
    .then((snapshot) => {
      //Thêm roomId vào người gửi
      snapshot.forEach((doc) => {
        doc.ref.update({
          chatroomId: isAddRoom
            ? FieldValue.arrayUnion(chatroomId)
            : FieldValue.arrayRemove(chatroomId),
        });
      });
    });
}

export async function updateUserInfo(loggedInUserId, newData) {
  /*
    newData: object chứa các trường có thể update (fullname, birthday, gender)
    {
      fullname: string,
      birthday: string,
      gender: number,
      story: string
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
          story: newData.story,
        });
      });
    });
}

export async function updateFirstTime(userId) {
  return db.collection('users').where("userId", "==", userId)
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach((doc) => {
      doc.ref.update({
        firstTime: false,
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

export async function deleteChatRoom(userId, chatRoomId) {
  await updateDoc(doc(db, "userChats", userId), {
    [chatRoomId]: deleteField(),
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
    }
  };

  sentVerificationEmail();
}

// SEARCH USER
export async function searchUserByFullname(searchKeyword) {
  return db
    .collection("users")
    .where("fullname", ">=", searchKeyword)
    .where("fullname", "<=", searchKeyword + "\uf8ff")
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
    });
}
