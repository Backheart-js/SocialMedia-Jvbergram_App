import { createSlice } from "@reduxjs/toolkit"

const modalSlice = createSlice({
    name: 'modal',
    initialState: {},
    reducers: {
        addOpen: (state, action) => {
            return {
                ...state,
                openModalFunc: action.payload
            }
        }
    }
})

export default modalSlice;