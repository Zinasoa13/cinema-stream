import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const API = axios.create({
  baseURL: API_URL,
});


// Interceptor pour ajouter le token dans l'entête Authorization
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserDto {
  username: string;
  password: string;
}

export async function register(user: UserDto) {
  const res = await API.post("/register", user);
  return res.data; // { message: "User created" }
}

export async function login(user: UserDto) {
  const res = await API.post("/login", user);
  return res.data; // { token: "..." }
}

export default API;
