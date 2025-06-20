import { jwtDecode } from 'jwt-decode';
import { logoutSuccess } from './authSlice'; // Import your logout action


export const authMiddleware = (store) => (next) => (action) => {
    // Skip token check for logout action to avoid infinite loop
    if (action.type === logoutSuccess.type) {
        return next(action);
    }

    const state = store.getState();
    if (state.auth.token) {
        try {
            const decodedToken = jwtDecode(state.auth.token);

            // Check if token is expired (JWT exp is in seconds, Date.now() is milliseconds)
            if (decodedToken.exp * 1000 < Date.now()) {
                store.dispatch(logoutSuccess());
                // You can redirect here if needed
                store.dispatch(push('/login'));
                return; // Stop the action from propagating
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
            store.dispatch(logoutSuccess());
            return;
        }
    }
    return next(action);
};