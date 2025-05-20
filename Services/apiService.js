import axios from "axios";

const apiService = axios.create({
  baseURL: "http://localhost:5000/api", // Thay đổi URL theo thực tế
});

export default apiService;
