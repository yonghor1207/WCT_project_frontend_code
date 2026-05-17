import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/users`,
                method: "GET",
            }),
            providesTags: ['User']
        }),

        createUser: builder.mutation({
            query: (data) => ({
                url: `${BASE_ADMIN_URL}/users`,
                method: "POST",
                body: data,
            })
        }),

        getUserById: builder.query({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/users/${id}`,
                method: "GET"
            })
        }),

        deactivateUser: builder.mutation({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/users/${id}/deactivate`,
                method: "PATCH"
            })
        }),

        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_ADMIN_URL}/users/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
            invalidatesTags: ['User']
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/users/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['User']
        }),

        updatePaymentStatus: builder.mutation({
            query: ({ id, payment_status }) => ({
                url: `${BASE_ADMIN_URL}/users/${id}/payment-status`,
                method: "PATCH",
                body: { payment_status }
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
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdatePaymentStatusMutation
} = userApiSlice;