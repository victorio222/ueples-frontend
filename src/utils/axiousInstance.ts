import axios from 'axios';

const api = axios.create({
    // Use the .env variable for your laptop .202 IP
    baseURL: import.meta.env.API_BASE_URL,
    withCredentials: true, // Required to send/receive HttpOnly cookies across IPs
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token using the HttpOnly refresh cookie
                await axios.post(
                    `${api.defaults.baseURL}/auth/refresh-token`, 
                    {}, 
                    { withCredentials: true }
                );

                // Retry the original request that failed
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the session cookie is gone (Browser was closed)
                console.error("Session expired. Redirecting to login...");
                
                // CLEANUP: Wipe the shared UI state
                localStorage.removeItem("user_role");
                localStorage.removeItem("user_id");

                // Only redirect if we aren't already on the signin page
                if (!window.location.pathname.includes('/signin')) {
                    window.location.href = "/signin"; 
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;