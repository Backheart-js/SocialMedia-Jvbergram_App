import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistance, format } from "date-fns";
import vi from "date-fns/locale/vi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

import SlideImages from "../SlideImages";
import UserLabel from "../UserLabel";
import "./Post.scss";
import PostInteractive from "./PostInteractive";
import Dropdown from "../Dropdown/Dropdown";
import { UserContext } from "~/context/user";
import { useDispatch } from "react-redux";
import modalSlice from "~/redux/slice/modalSlide";
import { DELETE_POST } from "~/constants/modalTypes";

function Post({ data = {} }) {
  const navigate = useNavigate()
  const { userId } = useContext(UserContext);
  const dispatch = useDispatch()
  const [toggleOptionDropdown, setToggleOptionDropdown] = useState(false);

  const handleCloseDropdown = () => {
    setToggleOptionDropdown(false);
  };

  const handleOpenDeletePostModal = () => {
    dispatch(modalSlice.actions.openModal({
      type: DELETE_POST,
      postId: data.docId,
      imagesUrl: data.photos
    }))
  }

  const handleGoToPost = () => {
    navigate(`/p/${data.docId}`)
  }

  return (
    <div className="post__container py-3">
      <div className="flex justify-between items-center px-3">
        <div className="flex items-center">
          <UserLabel
            avatarUrl={data.avatarUrl}
            username={data.username}
            size={"small"}
          />
          <Tippy
            content={format(data.dateCreated, "dd/MM/yyyy")}
            placement="bottom-end"
            delay={["400", "200"]}
            arrow={false}
          >
            <span className="post__dateCreated text-gray-500 text-[14px] select-none">
              {formatDistance(data.dateCreated, new Date(), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
          </Tippy>
        </div>
        <Dropdown
          interactive={true}
          visible={toggleOptionDropdown}
          onClickOutside={handleCloseDropdown}
          placement="bottom-start"
          content={
            <ul className="py-2">
              {data.userId === userId ? (
                <>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                      Chỉnh sửa
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn text-[#ED4956] font-semibold" onClick={handleOpenDeletePostModal}>
                      Xóa bài viết
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn">
                      Thêm vào mục yêu thích
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn" onClick={handleGoToPost}>
                      Đi tới bài viết
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn">
                      Sao chép liên kết
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button
                      className="post__option-dropdown-btn"
                      onClick={() => {
                        setToggleOptionDropdown(false);
                      }}
                    >
                      Hủy
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                      Báo cáo
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn text-[#ED4956] font-semibold">
                      Bỏ theo dõi
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn">
                      Thêm vào mục yêu thích
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn" onClick={handleGoToPost}>
                      Đi tới bài viết
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button className="post__option-dropdown-btn">
                      Sao chép liên kết
                    </button>
                  </li>
                  <li className="post__option-dropdown--item">
                    <button
                      className="post__option-dropdown-btn"
                      onClick={() => {
                        setToggleOptionDropdown(false);
                      }}
                    >
                      Hủy
                    </button>
                  </li>
                </>
              )}
            </ul>
          }
        >
          <button
            className="post__option-button"
            onClick={() => {
              setToggleOptionDropdown((prev) => !prev);
            }}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        </Dropdown>
      </div>
      <SlideImages imagesList={data.photos} />

      <PostInteractive
        docId={data.docId}
        likes={data.likes}
        youLikedThisPost={data.youLikedThisPost}
        comments={data.comments}
      >
        <div className="post__caption mb-1 mt-3">
          <Link
            className="font-semibold text-sm mr-1"
            to={`/profile/${data.username}`}
          >
            {data.username}
          </Link>
          <span className="text-[15px] font-normal wrap-text">{data.caption}</span>
        </div>
      </PostInteractive>
    </div>
  );
}

export default memo(Post);
