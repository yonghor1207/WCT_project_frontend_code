import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

export const courseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourse: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/courses`,
                method: "GET"
            })
        }),
        getCourseById: builder.query({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/courses/${id}`,
                method: "GET",
            })
        }),
        deactivatedCourse: builder.mutation({
            query: (id) => ({
                url: `${BASE_ADMIN_URL}/courses/${id}/deactivate`,
                method: "PATCH"
            })
        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: `${BASE_ADMIN_URL}/courses`,
                method: "POST",
                body: data
            })
        }),
        updateCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `${BASE_ADMIN_URL}/courses/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            }),
            invalidatesTags: ["Course"]
        }),
    })
})

export const {
    useGetCourseQuery,
    useGetCourseByIdQuery,
    useDeactivatedCourseMutation,
    useCreateCourseMutation,
    useUpdateCourseMutation,
} = courseApiSlice;
