import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getInitialAuthState = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    let isAuthenticated = false;

    if (token && user) {
        try {
            const decoded = jwtDecode(token);
            isAuthenticated = decoded.exp * 1000 > Date.now();
        } catch (error) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("tokenExpiration");
        }
    }

    return {
        user: user ? user : null,
        token: token ? token : null,
        role: role ? role : null,
        isAuthenticated,
        isLoading: false,
        error: null,
    };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialAuthState(),
    reducers: {
        loginSuccess: (state, action) => {
            const decoded = jwtDecode(action.payload.token);

            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role;
            state.isAuthenticated = true;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.user.role);
            localStorage.setItem("tokenExpiration", decoded.exp * 1000);
        },

        refreshTokenSuccess: (state, action) => {
            const decoded = jwtDecode(action.payload.token);

            state.token = action.payload.token;
            state.tokenExpiration = decoded.exp * 1000;
            state.isAuthenticated = true;

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("tokenExpiration", decoded.exp * 1000);
        },

        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.tokenExpiration = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("tokenExpiration");
        }
    },
});

export const { loginSuccess, logoutSuccess, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;