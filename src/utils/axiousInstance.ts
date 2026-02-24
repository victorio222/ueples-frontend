// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // If error is 401 and we haven't tried to refresh yet
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 // 1. Call your refresh-token endpoint
//                 // We use the base axios here to avoid an infinite loop
//                 await axios.post(
//                     `${api.defaults.baseURL}/auth/refresh-token`, 
//                     {}, 
//                     { withCredentials: true }
//                 );

//                 // 2. If successful, retry the original request
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 // 3. If refresh fails, the user is truly logged out
//                 console.error("Refresh token expired. Redirecting to login...");
//                 window.location.href = "/signin"; 
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;








import axios from 'axios';

const api = axios.create({
    // Use the .env variable for your laptop .202 IP
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
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