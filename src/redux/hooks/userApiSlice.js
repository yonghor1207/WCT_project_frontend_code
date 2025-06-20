import { apiSlice } from "../api/apiSlice";
import { BASE_PRIVATE_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => ({
                url: `${BASE_PRIVATE_URL}/users`,
                method: "GET",
            })
        }),

        createUser: builder.mutation({
            query: (data) => ({
                url: `${BASE_PRIVATE_URL}/users`,
                method: "POST",
                body: data,
            })
        }),

        getUserById: builder.query({
            query: (id) => ({
                url: `${BASE_PRIVATE_URL}/users/${id}`,
                method: "GET"
            })
        }),

        deactivateUser: builder.mutation({
            query: (id) => ({
                url: `${BASE_PRIVATE_URL}/users/${id}/deactivate`,
                method: "PATCH"
            })
        }),

        // updateUser: builder.mutation({
        //     query: ({ id, data }) => ({
        //         url: `${BASE_PRIVATE_URL}/users/${id}`,
        //         method: "PUT",
        //         body: data,
        //         credentials: "include",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }),

        // })
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_PRIVATE_URL}/users/${id}`, // Remove BASE_PRIVATE_URL
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include' // Add this line
            }),
            invalidatesTags: ['User']
        })
    })
})

export const {
    useGetUserQuery,
    useCreateUserMutation,
    useGetUserByIdQuery,
    useDeactivateUserMutation,
    useUpdateUserMutation
} = userApiSlice;