import { createSlice } from "@reduxjs/toolkit"

const chatRoomListSlice = createSlice({
    name: 'chatRoomList',
    initialState: [],
    reducers: {
        add: (state, action) => {
            return action.payload
        },
    }
})

export default chatRoomListSlice;