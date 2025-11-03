import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_BACKEND_URL ||
    "https://agrisathi-fjls.onrender.com/api",
  timeout: 120000,
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration and auto-refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(
            `${
              process.env.REACT_APP_BACKEND_URL ||
              "https://agrisathi-fjls.onrender.com/api"
            }/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const newToken = response.data.token;
          localStorage.setItem("token", newToken);

          processQueue(null, newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem("token");

        // Only redirect if not already on auth pages
        if (
          window.location.pathname !== "/join" &&
          window.location.pathname !== "/signup"
        ) {
          window.location.href = "/join";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
