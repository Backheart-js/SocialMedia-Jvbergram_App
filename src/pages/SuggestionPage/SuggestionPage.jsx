import React, { useContext } from 'react'
import Suggestion from '~/components/Suggestion'
import { UserContext } from '~/context/user'

function SuggestionPage() {
  const { userId: LoggedInUserId, following: LoggedInUserFollowing } = useContext(UserContext)

  return (
    <div className="lg:max-w-[600px] mx-auto pt-20">
      <div className='ml-3 py-2'>
        <p className="font-semibold text-sm dark:text-[#FAFAFA]">
          Gợi ý
        </p>
      </div>
      <div className="py-5 px-4 bg-white rounded-lg dark:bg-black">
        <Suggestion userId={LoggedInUserId} following={LoggedInUserFollowing} />
      </div>
    </div>
  )
}

export default SuggestionPage