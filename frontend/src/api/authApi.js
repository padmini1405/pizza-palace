import axios from "axios";
import API_URL from "../config/api";

const API = axios.create({
  baseURL: `${API_URL}/auth`,
});

export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};