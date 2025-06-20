import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    classrooms: [],
    isLoading: false,
    error: null
}
const classroomSlice = createSlice({
    name: "classrooms",
    initialState,
    reducers: {
        getClassroomStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getClassroomSuccess: (state, action) => {
            state.classrooms = action.payload;
            state.isLoading = false;
        },
        getClassroomFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
})

export const { getClassroomStart, getClassroomFailure, getClassroomSuccess } = classroomSlice.actions;
export default classroomSlice.reducer;