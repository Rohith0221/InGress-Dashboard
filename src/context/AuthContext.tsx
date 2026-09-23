import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { verifySession, loginUser, logoutUser } from '../lib/api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const valid = await verifySession();
                setIsAuthenticated(valid);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsInitializing(false);
            }
        };

        checkSession();
    }, []);

    const login = async (password: string) => {
        await loginUser(password);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        setIsAuthenticated(false);
        await logoutUser();
    };

    if (isInitializing)
        return (
            <div className="h-screen w-screen flex items-center justify-center text-slate-500">
                Verifying secure session...
            </div>
        );

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};