import { createSlice } from "@reduxjs/toolkit"

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        avatarUrl: {},
        fullname: "",
        partnerId: "",
        chatroomId: "",
    },
    reducers: {
        add: (state, action) => {
            return {
                ...action.payload
            }
        },
    }
})

export default conversationSlice;