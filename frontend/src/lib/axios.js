import axios from "axios";

export const axiosInstance = axios.create({
  // ... existing code ...
baseURL: import.meta.env.MODE === "development" 
? "http://localhost:5001/api" 
: `${import.meta.env.VITE_API_URL}/api`,
// ... existing code ...
  withCredentials: true,
});