import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// TOKEN

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization =
      `Bearer ${token}`;
  }

  return req;
});

// ORDERS

export const getAllOrders = async () => {
  const response = await API.get("/orders");

  return response.data;
};

export const updateOrderStatus = async (
  id,
  status
) => {
  const response = await API.put(
    `/orders/${id}/status`,
    { status }
  );

  return response.data;
};

// PIZZAS

export const getAllPizza = async () => {
  const response = await API.get("/pizza");

  return response.data;
};

export const createPizza = async (
  pizzaData
) => {
  const response = await API.post(
    "/pizza",
    pizzaData
  );

  return response.data;
};

export const updatePizza = async (
  id,
  pizzaData
) => {
  const response = await API.put(
    `/pizza/${id}`,
    pizzaData
  );

  return response.data;
};

export const deletePizza = async (id) => {
  const response = await API.delete(
    `/pizza/${id}`
  );

  return response.data;
};