import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
    isLoading: false,
    error: null,
}

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        getCourseStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getCourseSuccess: (state, action) => {
            state.courses = action.payload;
            state.isLoading = false;
        },
        getCourseFailure: (state, action) => {
            state.isLoading = false;
            state.error = null;
        }
    }
})

export const { getCourseStart, getCourseSuccess, getCourseFailure } = courseSlice.actions;
export default courseSlice.reducer;