import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    isLoading: false,
    error: null,
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        getUserStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getUserSuccess: (state, action) => {
            state.users = action.payload;
            state.isLoading = false;
        },
        getUserFailure: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    }
})

export const { getUserStart, getUserSuccess, getUserFailure } = userSlice.actions;
export default userSlice.reducer;