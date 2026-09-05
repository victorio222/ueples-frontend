// import axios from 'axios';

// const api = axios.create({
//     // Use the .env variable for your laptop .202 IP
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     withCredentials: true, // Required to send/receive HttpOnly cookies across IPs
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // api.interceptors.response.use(
// //     (response) => response,
// //     async (error) => {
// //         const originalRequest = error.config;

// //         // If error is 401 (Unauthorized) and we haven't retried yet
// //         if (error.response?.status === 401 && !originalRequest._retry) {
// //             originalRequest._retry = true;

// //             try {
// //                 // Attempt to refresh the access token using the HttpOnly refresh cookie
// //                 await axios.post(
// //                     `${api.defaults.baseURL}/auth/refresh-token`, 
// //                     {}, 
// //                     { withCredentials: true }
// //                 );

// //                 // Retry the original request that failed
// //                 return api(originalRequest);
// //             } catch (refreshError) {
// //                 // If refresh fails, the session cookie is gone (Browser was closed)
// //                 console.error("Session expired. Redirecting to login...");
                
// //                 // CLEANUP: Wipe the shared UI state
// //                 localStorage.removeItem("user_role");
// //                 localStorage.removeItem("user_id");

// //                 // Only redirect if we aren't already on the signin page
// //                 if (!window.location.pathname.includes('/signin')) {
// //                     window.location.href = "/signin"; 
// //                 }
                
// //                 return Promise.reject(refreshError);
// //             }
// //         }

// //         return Promise.reject(error);
// //     }
// // );

// export default api;










import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR: Sends both Access and Refresh tokens in headers for iOS
api.interceptors.request.use((config) => {
    const localToken = localStorage.getItem('token');
    const localRefreshToken = localStorage.getItem('remember_token');

    // Attach Access Token
    if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
    }

    // Attach Refresh Token as a custom header backup for iOS auto-refresh middleware
    if (localRefreshToken) {
        config.headers['X-Refresh-Token'] = localRefreshToken;
    }

    return config;
}, (error) => Promise.reject(error));


// 2. RESPONSE INTERCEPTOR: Catches the mid-flight refreshed tokens from the backend
api.interceptors.response.use((response) => {
    // Check if the backend auto-refresh middleware attached a fresh token to the headers
    const newAccessToken = response.headers['x-new-access-token'];
    
    if (newAccessToken) {
        // Update localStorage instantly so subsequent iOS requests remain authenticated
        localStorage.setItem('token', newAccessToken);
    }

    return response;
}, async (error) => {
    const originalRequest = error.config;

    // If both access and refresh tokens are entirely dead (401), boot user to login
    if (error.response?.status === 401) {
        console.error("Session expired completely. Cleaning storage...");
        
        localStorage.removeItem("token");
        localStorage.removeItem("remember_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");

        if (!window.location.pathname.includes('/signin')) {
            window.location.href = "/signin"; 
        }
    }

    return Promise.reject(error);
});

export default api;
