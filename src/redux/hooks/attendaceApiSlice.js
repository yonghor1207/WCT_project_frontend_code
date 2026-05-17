import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

export const attendanceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAttendance: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/attendances`,
                method: "GET"
            })
        }),
        getAttendanceById: builder.query({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/attendances/${id}`,
                method: "GET",
            })
        }),
        verifyAttendance: builder.mutation({
            query: ({ id, status }) => ({
                url: `${BASE_ADMIN_URL}/attendances/${id}/verify`,
                method: "PATCH",
                body: { status: status }
            })
        }),
        createAttendance: builder.mutation({
            query: (data) => ({
                url: `${BASE_ADMIN_URL}/attendances`,
                method: "POST",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
        }),
        updateAttendance: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_ADMIN_URL}/attendances/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
            invalidatesTags: ["Attendance"]
        }),
        deleteAttendance: builder.mutation({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/attendances/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Attendance"]
        }),
    })
})

export const {
    useGetAttendanceQuery,
    useGetAttendanceByIdQuery,
    useVerifyAttendanceMutation,
    useCreateAttendanceMutation,
    useUpdateAttendanceMutation,
    useDeleteAttendanceMutation
} = attendanceApiSlice;
