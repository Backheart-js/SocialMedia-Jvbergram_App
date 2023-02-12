import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { v4 } from "uuid";
import Dropdown from "~/components/Dropdown/Dropdown";
import DropdownEmoji from "~/components/Emoji/Emoji";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import { autoGrowTextarea } from "~/utils/autoGrowTextarea";
import "../Comments.scss";

function CommentTextField({
  docId,
  commentFieldRef,
  setUserCommentList,
  setAllCommentsQuantity,
}) {
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { userId, username } = useContext(UserContext);
  const [toggleDropdownEmoji, setToggleDropdownEmoji] = useState(false);

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
      commentId: v4(),
    };
    commentFieldRef.current.style.height = "22px";
    try {
      setUserCommentList((prev) => [...prev, comment]);
      setAllCommentsQuantity && setAllCommentsQuantity((prev) => prev + 1);
      setCommentValues("");

      await firebase
        .firestore()
        .collection("posts")
        .doc(docId)
        .update({
          comments: FieldValue.arrayUnion(comment),
        });
    } catch (error) {
      throw error;
    }
  };

  return (
    <form
      className="comment__input-wrapper relative flex items-center mt-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <Dropdown
        visible={toggleDropdownEmoji}
        interactive
        placement="top-start"
        className="w-[335px] h-[325px]"
        onClickOutside={() => setToggleDropdownEmoji(false)}
        content={<DropdownEmoji setValue={setCommentValues} />}
      >
        <button
          className="flex justify-center items-center pr-3 py-2"
          onClick={() => setToggleDropdownEmoji((prev) => !prev)}
        >
          <FontAwesomeIcon
            icon={faFaceSmile}
            className="text-2xl text-[#262626] icon"
          />
        </button>
      </Dropdown>
      <textarea
        ref={commentFieldRef}
        value={commentValues}
        type="text"
        className="comment__input w-full dark:text-[#FAFAFA] dark:bg-transparent"
        placeholder="Viết bình luận..."
        onInput={(e) => autoGrowTextarea(e)}
        onChange={handleCommentChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
          }
        }}
      />
      <button
        className={`pl-2 text-[#219ebc] font-semibold text-sm ${
          commentValues ? "" : "hidden"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleSubmitComment();
        }}
      >
        Đăng
      </button>
    </form>
  );
}

export default CommentTextField;
