import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5268/api"
});

export default api;
