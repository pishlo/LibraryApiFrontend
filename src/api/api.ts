import axios from "axios";

const api = axios.create({
  baseURL: "https://libraryapi-1-amee.onrender.com/api"
});

export default api;
