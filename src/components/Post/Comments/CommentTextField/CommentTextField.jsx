import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmojiPicker from 'emoji-picker-react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from "~/context/user";
import { autoGrowTextarea } from '~/utils/autoGrowTextarea';
import '../Comments.scss'

function CommentTextField({ docId, commentFieldRef, setUserCommentList, setAllCommentsQuantity }) {
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { userId, username } = useContext(UserContext);
  const emojiDropdownRef = useRef(null)

  const [commentValues, setCommentValues] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);

  const handleCommentChange = (e) => {
    setCommentValues(e.target.value.trimStart());
  };

  // const addEmoji = (emoji) => {
  //   setCommentValues(commentValues + emoji.native);
  // };

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

  // useEffect(() => {
  //   console.log(emojiDropdownRef.current);
  //   if (emojiDropdownRef.current) {
  //     emojiDropdownRef.current.style.bottom = `${commentFieldRef.current.offsetHeight + 10}px`;
  //   }

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [openEmoji, commentFieldRef.current])
  
  useEffect(() => {
    console.log(commentFieldRef.current.height);
  }, [commentFieldRef.current?.height])
  

  return (
    <form className="comment__input-wrapper relative flex items-center mt-2" onSubmit={(e) => e.preventDefault()}>
        {/* <button className="" onClick={() => setOpenEmoji(true)}>
          <FontAwesomeIcon icon={faFaceSmile} />
        </button>
        {
          openEmoji && <div ref={emojiDropdownRef} className="dropdown-comment-emoji"><EmojiPicker searchDisabled	height={340} width={300} onEmojiClick={(emoji) => addEmoji(emoji)} lazyLoadEmojis	/></div>
        } */}
        <textarea
          ref={commentFieldRef}
          value={commentValues}
          type="text"
          className="comment__input w-full"
          placeholder="Viết bình luận..."
          onInput={(e) => autoGrowTextarea(e)}
          onChange={handleCommentChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
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