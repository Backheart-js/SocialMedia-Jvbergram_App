import { configureStore } from '@reduxjs/toolkit'
import firebaseSlice from './slice/firebaseSlice';

const store = configureStore({
    reducer: {
        firebase: firebaseSlice.reducer
    }
})

export default store;