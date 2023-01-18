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
                ...action.payload
            }
        },

        closeModal: () => {
            return {
                isOpen:false,
                type: ""
            }
        }
    }
})

export default modalSlice;