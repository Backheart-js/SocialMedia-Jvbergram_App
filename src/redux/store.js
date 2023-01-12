import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slice/authSlice';
import firebaseSlice from './slice/firebaseSlice';
import passwordSlide from './slice/passwordSlide';

const store = configureStore({
    reducer: {
        firebase: firebaseSlice.reducer,
        authentication: authSlice.reducer,
        remember_password: passwordSlide.reducer,
    }
})

export default store;