import { apiSlice } from "../api/apiSlice";
import { BASE_URL_LOCAL, BASE_PRIVATE_URL } from "../constants";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL_LOCAL}/login`,
                method: "POST",
                body: data,
            })
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL_LOCAL}/register`,
                method: "POST",
                body: data,
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${BASE_PRIVATE_URL}/logout`,
                method: "POST",
            }),
        }),

        refreshToken: builder.mutation({
            query: () => ({
                url: `${BASE_PRIVATE_URL}/refresh-token`,
                method: "POST",
            }),
        }),
    })

})


export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useRefreshTokenMutation } = authApiSlice;
