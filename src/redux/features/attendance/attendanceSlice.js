import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    attendances: [],
    isLoading: false,
    error: null,
}

const attendanceSlice = createSlice({
    name: "attendances",
    initialState,
    reducers: {
        getAttendaceStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getAttendaceSuccess: (state, action) => {
            state.attendances = action.payload;
            state.isLoading = false;
        },
        getAttendaceFailure: (state) => {
            state.isLoading = false;
            state.error = null;
        }
    }
})

export const { getAttendaceStart, getAttendaceSuccess, getAttendaceFailure } = attendanceSlice.actions;
export default attendanceSlice.reducer;

