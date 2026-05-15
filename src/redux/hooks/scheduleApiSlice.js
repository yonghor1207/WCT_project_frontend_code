import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

export const scheduleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSchedule: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/schedules`,
                method: "GET"
            }),
            providesTags: ["Schedule"]
        }),
        getScheduleById: builder.query({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/schedules/${id}`,
                method: "GET",
            }),
            providesTags: ["Schedule"]
        }),
        createSchedule: builder.mutation({
            query: (data) => ({
                url: `${BASE_ADMIN_URL}/schedules`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Schedule"]
        }),
        updateSchedule: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_ADMIN_URL}/schedules/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
            invalidatesTags: ["Schedule"]
        }),
        deleteSchedule: builder.mutation({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/schedules/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Schedule"]
        }),
    })
})

export const {
    useGetScheduleQuery,
    useGetScheduleByIdQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
} = scheduleApiSlice;
