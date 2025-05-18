import api from "../lib/axios";
import type { AuthRequestDto, RegistrationDto } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const login = async (data: AuthRequestDto) => {
    const response = await api.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
};


export const register = async (data: RegistrationDto) => {
  const response = await api.post(`${API_BASE_URL}/auth/register`, data);
  return response.data;
};