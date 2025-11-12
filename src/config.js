import axios from "axios";

export const IMAGE_BASE_URL = "https://api.gripforum.com/api/public/";
export const BASE_URL = "https://api.gripforum.com/api/mobile";
export const server = "https://api.gripforum.com/"

// muges wifi
// export const IMAGE_BASE_URL = "http://192.168.230.114:3004/api/public";
// export const BASE_URL = "http://192.168.230.114:3004/api/mobile";
// export const server = "http://192.168.230.114:3004"

// kesavan wifi
// export const IMAGE_BASE_URL = "http://192.168.170.114:3004/api/public";
// export const BASE_URL = "http://192.168.170.114:3004/api/mobile";
// export const server = "http://192.168.170.114:3004"

// office wifi
// export const IMAGE_BASE_URL = "http://192.168.29.44:3004/api/public";
// export const BASE_URL = "http://192.168.29.44:3004/api/mobile";
// export const server = "http://192.168.29.44:3004"


// export const IMAGE_BASE_URL = "http://localhost:3004/api/public";
// export const BASE_URL = "http://localhost:3004/api/mobile";
// export const server = "http://localhost:3004"

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("userToken")}`;
    config.headers["Content-Type"] = "application/json";

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default apiClient;
