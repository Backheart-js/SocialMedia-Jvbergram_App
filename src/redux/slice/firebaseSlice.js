import { createSlice } from "@reduxjs/toolkit"
import { firebase, FieldValue  } from "~/lib/firebase"

const initialState = {
    firebase: firebase,
    FieldValue: FieldValue
}

const firebaseSlice = createSlice({
    name: 'firebase',
    initialState,
    reducers: {
        
    }
})

export default firebaseSlice