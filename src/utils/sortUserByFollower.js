const sortUserByFollower = (userList) => {
    //Sắp xếp user có số lượng follow giảm dần (quick sort)
    if (userList.length <= 1) {
      return userList;
    }
    let pivot = userList[userList.length - 1];
    let left = [];
    let right = [];
    for (let i = 0; i < userList.length - 1; i++) {
      if (userList[i].followers.length > pivot.followers.length) {
        left.push(userList[i]);
      } else {
        right.push(userList[i]);
      }
    }
    return sortUserByFollower(left).concat(pivot, sortUserByFollower(right));
  };
  
  export default sortUserByFollower;
  