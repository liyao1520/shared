import axios from "axios";
const isDevelopment = import.meta.env.MODE === "development";
const instance = axios.create({
  baseURL: isDevelopment ? "http://localhost:3000/api" : "/api",
});
instance.defaults.timeout = 10000;

export default instance;
