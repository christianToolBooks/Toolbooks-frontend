import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", 
  },
});

const getCookie = (name: string): string | null => {
  if (typeof window !== 'undefined') {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};


apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie('accessToken');
       
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      
      const isAuthRelated = error.config?.url?.includes('/auth/') || 
                           error.config?.url?.includes('/login') || 
                           error.config?.url?.includes('/register');
      
      if (!isAuthRelated && currentPath !== '/auth') {
        console.log('Clearing cookies due to unrelated 401 error not related to authentication');
       } else {
        console.log('Error 401 in authentication operation - not clearing cookies');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;