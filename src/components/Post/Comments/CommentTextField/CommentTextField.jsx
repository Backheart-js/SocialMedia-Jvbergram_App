import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import Dropdown from "~/components/Dropdown/Dropdown";
import DropdownEmoji from "~/components/Emoji/Emoji";
import Loader from "~/components/Loader";
import { FirebaseContext } from "~/context/firebase";
import { UserContext } from "~/context/user";
import { openNoti } from "~/redux/slice/notificationSlice";
import { autoGrowTextarea } from "~/utils/autoGrowTextarea";
import "../Comments.scss";

function CommentTextField({
  docId,
  commentFieldRef,
  setUserCommentList,
  setAllCommentsQuantity,
}) {
  const dispatch = useDispatch();
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const { userId, username } = useContext(UserContext);
  const [toggleDropdownEmoji, setToggleDropdownEmoji] = useState(false);
  const [loadingSubmitComment, setLoadingSubmitComment] = useState(false);

  const [commentValues, setCommentValues] = useState("");

  const handleCommentChange = (e) => {
    setCommentValues(e.target.value.trimStart());
  };

  const handleSubmitComment = async () => {
    if (!commentValues.trim()) {
      return;
    }
    setLoadingSubmitComment(true);
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
      await firebase
        .firestore()
        .collection("posts")
        .doc(docId)
        .update({
          comments: FieldValue.arrayUnion(comment),
        });
      setUserCommentList((prev) => [...prev, comment]);
      setAllCommentsQuantity && setAllCommentsQuantity((prev) => prev + 1);
      setCommentValues("");
    } catch (error) {
      dispatch(openNoti({ content: `Đã có lỗi xảy ra, vui lòng thử lại` }));
    } finally {
      setLoadingSubmitComment(false);
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
      {
        loadingSubmitComment &&
        <div className="absolute h-[210px] w-full flex justify-center items-center">
          <RotatingLines
            display
            strokeColor="gray"
            strokeWidth="5"
            animationDuration="0.75"
            width="30"
            visible
          />
        </div>
      }
    </form>
  );
}

export default CommentTextField;
