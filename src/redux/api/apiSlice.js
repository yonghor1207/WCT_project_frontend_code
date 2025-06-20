import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // ✅ correct import
import { BASE_PRIVATE_URL, BASE_URL_LOCAL } from '../constants';
import { logoutSuccess, refreshTokenSuccess } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_PRIVATE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// const baseQueryWithReauth = async (args, api, extraOptions = {}) => {
//     let result = await baseQuery(args, api, extraOptions);

//     if (result.error && result.error.status === 401) {
//         const refreshResult = await baseQuery(
//             { url: "/refresh-token", method: "POST" },
//             api,
//             extraOptions
//         );

//         if (refreshResult.data) {
//             const newToken = refreshResult.data.token;
//             api.dispatch(refreshTokenSuccess({ token: newToken }));
//             localStorage.setItem("token", newToken);

//             // 🔥 Let baseQuery handle headers via prepareHeaders again
//             result = await baseQuery(args, api, extraOptions);
//         } else {
//             console.log("❌ Refresh failed. Logging out...");
//             api.dispatch(logoutSuccess());
//         }
//     }

//     return result;
// };

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User"],
    endpoints: () => ({}),
});
