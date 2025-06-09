import api from "../lib/axios";
import type { AuthRequestDto, RegistrationDto } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "auth_token";

export const login = async (data: AuthRequestDto) => {
    const response = await api.post(`${API_BASE_URL}/auth/login`, data);
    const token = response.data.token;

    // Sauvegarde du token pour les futures requêtes
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return response.data;
};

export const register = async (data: RegistrationDto) => {
  const response = await api.post(`${API_BASE_URL}/auth/register`, data);
  return response.data;
};

export const logout = async () => {
  const token = getAuthToken();

  try {
    if (token) {
      await api.post(`${API_BASE_URL}/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.warn("Erreur de logout serveur :", error);
  }

  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common["Authorization"];
  window.location.href = "/login";
};


// Fonction utilitaire pour récupérer le token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Fonction pour initialiser l'en-tête Authorization au lancement
export const initializeAuthHeader = () => {
  const token = getAuthToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};