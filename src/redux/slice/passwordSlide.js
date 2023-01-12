import { createSlice } from "@reduxjs/toolkit"

const initialState = false

const passwordSlide = createSlice({
    name: 'remember_password',
    initialState,
    reducers: {
        addState: (state, action) =>  action.payload
    }
})

export default passwordSlide;