export default function quickSortUserIdList(
  loggedInUserFollow,
  loggedInUserId,
  userList
) {
  let countFollowing = 0;
  console.log(userList);
  console.log(loggedInUserFollow)
  let data = [...userList] //Chú ý gán mảng là tham chiếu -> không sắp xếp trực tiếp vào mảng ban đầu -> error
  data.sort((a, b) => {
    if (a.userId === loggedInUserId) return -1;
    if (b.userId === loggedInUserId) return 1;
    if (loggedInUserFollow.includes(a.userId) && loggedInUserFollow.includes(b)) {
      return 0;
    }
    if (loggedInUserFollow.includes(a.userId)) return -1;
    if (loggedInUserFollow.includes(b.userId)) return 1;
    return 0;
  });

  let hashTable = {};
  for (let i = 0; i < loggedInUserFollow.length; i++) {
    hashTable[loggedInUserFollow[i]] = true;
  }

  for (let i = 0; i < data.length; i++) {
    if (hashTable[data[i].userId]) {
      countFollowing++;
    }
  }

  return { data, countFollowing };
}
