import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        isOpen: false,
        content: ""
    },
    reducers: {
        openNoti: (state, action) => {
            return {
                isOpen:true,
                ...action.payload
            }
        },

        closeNoti: () => {
            return {
                isOpen:false,
            }
        }
    }
})

export const { openNoti, closeNoti } = notificationSlice.actions

export default notificationSlice;