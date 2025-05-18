import { createContext, useContext, useState } from "react";



export type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé avec un AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    return(
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

