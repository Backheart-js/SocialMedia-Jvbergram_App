import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  postsCollection: null,
  isFollowing: false,
};

const profileSlide = createSlice({
  name: "profileSlide",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setPostsCollection: (state, action) => {
      state.postsCollection = action.payload;
    },
    setFollowing: (state, action) => {
      state.isFollowing = action.payload;
    },
  },
});

export const { setProfile, setPostsCollection, setFollowing } =
  profileSlide.actions;

export default profileSlide;