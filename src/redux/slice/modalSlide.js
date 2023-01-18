import { createSlice } from "@reduxjs/toolkit"

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isOpen: false,
        type: ""
    },
    reducers: {
        openModal: (state, action) => {
            return {
                isOpen:true,
                type: action.payload.type
            }
        },
        closeModal: (state, action) => {
            return {
                isOpen:false,
                type: action.payload.type
            }
        }
    }
})

export default modalSlice;