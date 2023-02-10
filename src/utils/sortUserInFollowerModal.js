export default function quickSortUserIdList(
  loggedInUserFollow,
  loggedInUserId,
  userIdList
) {
  let countFollowing = 0;
  console.log(Array.isArray(userIdList))
  let newList = userIdList
  newList.sort((a, b) => {
    if (a === loggedInUserId) return -1;
    if (b === loggedInUserId) return 1;
    if (loggedInUserFollow.includes(a) && loggedInUserFollow.includes(b)) {
      countFollowing++;
      return 0;
    }
    if (loggedInUserFollow.includes(a)) return -1;
    if (loggedInUserFollow.includes(b)) return 1;
    return 0;
  });

  return { newList, countFollowing };

}
