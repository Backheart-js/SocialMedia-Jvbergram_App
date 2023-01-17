import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import vi from 'date-fns/locale/vi';

import SlideImages from '../SlideImages'
import UserLabel from '../UserLabel'
import './Post.scss'
import PostInteractive from './PostInteractive'

function Post({ data = {} }) {
  return (
    <div className="post__container">
        <div className="flex justify-between items-center">
            <div className='flex items-center'>
              <UserLabel avatarUrl={data.avatarUrl} username={data.username} size={"small"} />
              <span className="post__dateCreated text-gray-500 text-[14px]">
                {formatDistance(data.dateCreated, new Date(), {
                  addSuffix: true,
                  locale: vi
                })}
              </span>
            </div>
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
              <div className="post__caption my-1">
                <Link className='font-semibold text-sm mr-1' to={`/profile/${data.username}`}>
                  {data.username}
                </Link>
                <span className="text-[15px] font-normal">{data.caption}</span>
              </div>
            </PostInteractive>
          </div>
  )
}

export default memo(Post)