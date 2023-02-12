import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import Button from '~/components/Button'
import { CREATE_MESSAGE } from '~/constants/modalTypes'
import { UserContext } from '~/context/user'
import modalSlice from '~/redux/slice/modalSlide'

function CreateDirect() {
  const loggedInUser = useContext(UserContext);
  const dispatch = useDispatch()

  const handleCreateMessageModal = () => {
    dispatch(modalSlice.actions.openModal({
      type: CREATE_MESSAGE
    }))
  }

  return (
    <div className='flex flex-col justify-center items-center h-full w-full'>
      <div className="flex justify-center items-center p-6 rounded-full border-gray-800 dark:border-gray-200 border-2">
      <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="text-5xl text-gray-800 dark:text-gray-200"
                />
      </div>
      <div className="text-center my-4">
        <p className="font-medium text-gray-800 dark:text-gray-100 text-lg">Tin nhắn của bạn</p>
        <p className="font-normal text-gray-500 dark:text-gray-400 text-sm">
          Gửi ảnh và tin nhắn riêng tư cho bạn bè
        </p>
      </div>
      <div className="">
        <Button className={"px-3 py-1"} btnPrimary onClick={handleCreateMessageModal}>
          Gửi tin nhắn
        </Button>
      </div>
    </div>
  )
}

export default CreateDirect