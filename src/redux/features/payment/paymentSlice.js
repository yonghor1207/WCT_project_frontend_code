import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    payments: [],
    isLoading: false,
    error: null,
}

const paymentSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {
        getPaymentStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getPaymentSuccess: (state, action) => {
            state.isLoading = false;
            state.payments = action.payload;
        },
        getPaymentFailure: (state) => {
            state.isLoading = false;
            state.error = null;
        }
    }
})

export const { getPaymentStart, getPaymentSuccess, getPaymentFailure } = paymentSlice.actions;
export default paymentSlice.reducer;