// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
//     withCredentials: true, // Crucial for sending/receiving cookies
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Optional: Response Interceptor to handle global errors (like 401 Unauthorized)
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Redirect to login or clear local state
//             console.error("Unauthorized! Redirecting...");
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;








import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1. Call your refresh-token endpoint
                // We use the base axios here to avoid an infinite loop
                await axios.post(
                    `${api.defaults.baseURL}/auth/refresh-token`, 
                    {}, 
                    { withCredentials: true }
                );

                // 2. If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // 3. If refresh fails, the user is truly logged out
                console.error("Refresh token expired. Redirecting to login...");
                window.location.href = "/signin"; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;