import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPayment: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/payments`,
                method: "GET"
            })
        }),
        getPaymentById: builder.query({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/payments/${id}`,
                method: "GET",
            })
        }),
        verifyPayment: builder.mutation({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/payments/${id}/verify`,
                method: "PATCH"
            })
        }),
        createPayment: builder.mutation({
            query: (data) => ({
                url: `${BASE_ADMIN_URL}/payments`,
                method: "POST",
                body: data
            })
        }),
        updatePayment: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_ADMIN_URL}/payments/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
            invalidatesTags: ["Payment"]
        }),
    })
})

export const {
    useGetPaymentQuery,
    useGetPaymentByIdQuery,
    useVerifyPaymentMutation,
    useCreatePaymentMutation,
    useUpdatePaymentMutation
} = paymentApiSlice;