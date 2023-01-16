import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import SlideImages from '../SlideImages'
import UserLabel from '../UserLabel'
import './Post.scss'
import PostInteractive from './PostInteractive'

function Post({ data = {} }) {
  return (
    <div className="post__container">
        <div className="flex justify-between items-center">
            <UserLabel avatarUrl={data.avatarUrl} username={data.username} size={"small"} />
            <button className="post__option-button">
                <FontAwesomeIcon icon={faEllipsis} />
            </button>
        </div>
            <SlideImages
              imagesList={data.photos}
            />

            <PostInteractive
              docId={data.docId}
              likes={data.likes}
              youLikedThisPost={data.youLikedThisPost}
              comments={data.comments}
            >
              <div className="post__caption my-2">
                <Link className='font-semibold text-sm mr-1' to={`/profile/${data.username}`}>
                  {data.username}
                </Link>
                <span className="text-[15px] font-normal">{data.caption}</span>
              </div>
            </PostInteractive>
          </div>
  )
}

export default Post