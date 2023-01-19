import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPostById } from '~/services/firebaseServices'
import './PostPage.scss'

function PostPage() {
    const { docId } = useParams()
    const [data, setData] = useState(null)
    console.log(docId);

  useEffect(() => {
    const getData = async () => {
      const response = await getPostById(docId)

      console.log(response);
    }

    getData()
  }, [])
  

  return (
    <div>PostPage</div>
  )
}

export default PostPage