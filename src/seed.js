import avatars from "./assets/avatar";

export function seedDatabase(firebase) {
    const users = [
      {
        userId: '1Mv0PpzvIqZPxPiyDjbvdpBOtYr2',
        username: 'binhnguyen',
        fullname: 'binhnguyen_2912',
        emailAddress: 'nguyenngocbinh.jvb@gmail.com',
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