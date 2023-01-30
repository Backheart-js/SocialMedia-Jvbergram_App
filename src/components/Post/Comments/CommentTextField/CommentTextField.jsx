import React, { useContext, useState } from 'react'
import { v4 } from 'uuid';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from "~/context/user";
import '../Comments.scss'

function CommentTextField({ docId, commentFieldRef, setUserCommentList, setAllCommentsQuantity }) {
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const [commentValues, setCommentValues] = useState("");
  const { userId, username } = useContext(UserContext);

  const handleCommentChange = (e) => {
    setCommentValues(e.target.value.trimStart());
  };

  const handleSubmitComment = async () => {
    if (!commentValues.trim()) {
      return;
    }
    const comment = {
      content: commentValues.replace(/\s+$/g, ""), //Loại bỏ khoảng trắng ở cuối comment
      dateCreated: Date.now(),
      displayName: username,
      likes: [],
      userId: userId,
      commentId: v4()
    }

    try {
      setUserCommentList((prev) => [...prev, comment])
      setAllCommentsQuantity && setAllCommentsQuantity(prev => prev+1)
      setCommentValues("")

      await firebase.firestore().collection("posts").doc(docId).update({
        comments: FieldValue.arrayUnion(comment)
      });

    } catch (error) {
      throw error;
    }

  }

  function auto_grow(e) {
    //auto grow cho textarea
    e.target.style.height = "5px";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  return (
    <form className="comment__input-wrapper flex items-center mt-2">
        <textarea
          ref={commentFieldRef}
          value={commentValues}
          type="text"
          className="comment__input w-full"
          placeholder="Viết bình luận..."
          onInput={auto_grow}
          onChange={handleCommentChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmitComment()
            }
          }}
        />
        <button className={`pl-2 text-[#219ebc] font-semibold text-sm ${commentValues ? "" : "hidden"}`} onClick={(e) => {
          e.preventDefault();
          handleSubmitComment();
        }}>
            Đăng
        </button>
      </form>
  )
}

export default CommentTextField