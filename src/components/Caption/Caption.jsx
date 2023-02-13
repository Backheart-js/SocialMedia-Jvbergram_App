import { Link } from "react-router-dom";
import checklink from "~/utils/checklink";

function Caption({ username, content }) {
    
  return (
    <div className="post__caption mb-1">
        <Link className="font-semibold text-sm mr-1 inline dark:text-[#FAFAFA]" to={`/${username}`}> 
            {username}
        </Link>
        <pre className="caption-text text-[14px] font-normal dark:text-[#FAFAFA]">
            {
                content ? checklink(content) : content
            }
        </pre>
      
    </div>
  );
}

export default Caption