import { apiSlice } from "../api/apiSlice";
import { BASE_ADMIN_URL } from "../constants";

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/dashboard/stats`,
                method: "GET"
            })
        }),
        getDashboardCharts: builder.query({
            query: () => ({
                url: `${BASE_ADMIN_URL}/dashboard/charts`,
                method: "GET"
            })
        }),
    })
})

export const {
    useGetDashboardStatsQuery,
    useGetDashboardChartsQuery,
} = dashboardApiSlice;
