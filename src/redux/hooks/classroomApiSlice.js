import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

export const classroomApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClassroom: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/classrooms`,
                method: "GET"
            })
        }),
        createClassroom: builder.mutation({
            query: (data) => ({
                url: `${BASE_ADMIN_URL}/classrooms`,
                method: "POST",
                body: data
            })
        }),
        getClassroomById: builder.query({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/classrooms/${id}`,
                method: "GET"
            })
        }),
        updateClassroom: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_ADMIN_URL}/classrooms/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
            invalidatesTags: ['Classroom']
        }),
    })
})

export const {
    useGetClassroomQuery,
    useCreateClassroomMutation,
    useGetClassroomByIdQuery,
    useUpdateClassroomMutation,
} = classroomApiSlice;