import { useState, useEffect, useContext } from 'react'
import { UserContext } from '~/layouts/DefaultLayout/DefaultLayout'
import { getPosts } from '~/services/firebaseServices';


function usePosts() {
    const [post, setPost] = useState(null);
    
    const { userId, following } = useContext(UserContext)
    

    useEffect(() => {
      const getTimeline = async () => {
        const followedPosts = await getPosts(userId, following)

        followedPosts.sort((a, b) => b.dateCreated - a.dateCreated) //Số nào lớn hơn thì đứng đầu -> Sắp xếp thời gian 
        setPost(followedPosts);
      }  
    
      userId && getTimeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])
    

    return post;
}

export default usePosts