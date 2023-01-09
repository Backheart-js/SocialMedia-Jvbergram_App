import avatars from "./assets/avatar";

// NOTE: replace '1Mv0PpzvIqZPxPiyDjbvdpBOtYr2' with your Firebase auth user id (can be taken from Firebase)
export function seedDatabase(firebase) {
    const users = [
      {
        userId: '1Mv0PpzvIqZPxPiyDjbvdpBOtYr2',
        username: 'binhnguyen',
        fullname: 'binhnguyen_2912',
        email: 'nguyenngocbinh.jvb@gmail.com',
        gender: 0, //0: male, 1: female, 2: Không tiết lộ
        birthday: new Date("12/29/2001"),
        avatarUrl: {
          default: avatars.default,
          history: [],
          current: ""
        },
        following: [],
        followers: [],
        dateCreated: Date.now()
      }
    ];
  
    // eslint-disable-next-line prefer-const
    for (let k = 0; k < users.length; k++) {
      firebase.firestore().collection('users').add(users[k]);
    }
  }