import { createContext, useContext, useEffect, useState } from "react";

// Définition du type de contexte
export type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isAuthReady: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook custom
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé avec un AuthProvider");
    }
    return context;
};

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp && payload.exp > now) {
                    setIsAuthenticated(true);
                } else {
                    // Token expiré
                    console.warn("Token expiré");
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error("Token JWT invalide", err);
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }

        setIsAuthReady(true);
    }, []);


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAuthReady }}>
            {children}
        </AuthContext.Provider>
    );
};
