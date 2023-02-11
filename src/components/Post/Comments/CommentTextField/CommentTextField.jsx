import React, { useContext,  useState } from 'react'
import { v4 } from 'uuid';
import Dropdown from '~/components/Dropdown/Dropdown';
import DropdownEmoji from '~/components/Emoji/Emoji';
import { FirebaseContext } from '~/context/firebase';
import { UserContext } from "~/context/user";
import { autoGrowTextarea } from '~/utils/autoGrowTextarea';
import '../Comments.scss'

function CommentTextField({ docId, commentFieldRef, setUserCommentList, setAllCommentsQuantity }) {
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { userId, username } = useContext(UserContext);
  const [toggleDropdownEmoji, setToggleDropdownEmoji] = useState(false)

  const [commentValues, setCommentValues] = useState("");

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
    commentFieldRef.current.style.height = "22px";
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

  return (
    <form className="comment__input-wrapper relative flex items-center mt-2" onSubmit={(e) => e.preventDefault()}>
        <Dropdown 
          visible={toggleDropdownEmoji}
          interactive
          placement="top-start"
          className="w-[335px] h-[325px]"
          onClickOutside={() => setToggleDropdownEmoji(false)}
          content={
            <DropdownEmoji setValue={setCommentValues}/>
          }
        >
        <button
            className="flex justify-center items-center pr-3 py-2"
            onClick={() => setToggleDropdownEmoji(prev => !prev)}
          >
            <svg
              aria-label="Biểu tượng cảm xúc"
              className="_ab6-"
              color="#262626"
              fill="#262626"
              height={24}
              role="img"
              viewBox="0 0 24 24"
              width={24}
            >
              <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" />
            </svg>
          </button>
        </Dropdown>
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