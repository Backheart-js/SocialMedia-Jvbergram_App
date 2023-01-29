const sortComments = (commentList) => {
  //Sắp xếp cmt thời gian giảm dần (quick sort)
  if (commentList.length <= 1) {
    return commentList;
  }
  let pivot = commentList[commentList.length - 1];
  let left = [];
  let right = [];
  for (let i = 0; i < commentList.length - 1; i++) {
    if (commentList[i].dataCreate > pivot.dataCreate) {
      left.push(commentList[i]);
    } else {
      right.push(commentList[i]);
    }
  }
  return sortComments(left).concat(pivot, sortComments(right));
};

export default sortComments;
