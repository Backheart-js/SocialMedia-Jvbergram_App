import { createSlice } from "@reduxjs/toolkit"

const initialState = {}

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        addId: (state, action) => {
            return {
                uid: action.payload
            }
        }
    }
})

export default authSlice;