import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8080/", // URL Back-end
  withCredentials: true,
});

export default api;