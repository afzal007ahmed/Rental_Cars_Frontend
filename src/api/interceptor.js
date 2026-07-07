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
    toast.error(error.response.data.message ,  { position : "bottom-center"});
    if (error.response.status === 401) {
      window.location.pathname = "/login";
    }
    return Promise.reject(error);
  },
);
