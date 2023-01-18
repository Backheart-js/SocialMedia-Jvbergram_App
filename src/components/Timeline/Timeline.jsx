import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { usePosts } from "~/hooks";
import Post from "../Post";
import "./Timeline.scss";

function Timeline() {
  const posts = usePosts();

  return !posts ? (
    <>
      {[...new Array(1)].map((_, index) => (
        <div className="timeline-skeleton-wrapper" key={index}>
          <div className="flex items-center mb-2">
            <Skeleton circle={true} width={42} height={42}/>
            <div className="ml-2">
              <Skeleton width={100} height={12} />
              <Skeleton width={140} height={12} />
            </div>
          </div>
          <Skeleton height={480} />
        </div>
      ))}
    </>
  ) : (
    <div>
      {posts.map((post) => {
        return <Post data={post} key={post.docId}/>
      })}
    </div>
  );
}

export default Timeline;
