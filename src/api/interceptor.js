import { toast } from "sonner";

import axios from "axios";

export const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

apiRequest.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`   ;
  return req;
});

apiRequest.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = "An unexpected error occurred.";
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          window.location.pathname = "/login";
        }
      }
    } else {
      errorMessage = "Network error: Server is unreachable. Please check if the server is running.";
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.pathname = "/login";
      }
    }

    toast.error(
      Array.isArray(errorMessage) ? errorMessage.join("\n") : errorMessage,
      { position: "bottom-center" }
    );
    return Promise.reject(error);
  },
);
