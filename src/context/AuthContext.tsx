import { createContext, useContext, useState, ReactNode, useEffect} from 'react';

interface AuthContextType {

    isAuthenticated: boolean,
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
                const response = await fetch('http://localhost:3000/api/v1/verify', {
                    credentials: 'include'
                });

                if (response.ok)
                    setIsAuthenticated(true);
                else
                    setIsAuthenticated(false);
            }
            catch (error) {
                setIsAuthenticated(false);
            }
            finally {
                setIsInitializing(false);
            }
        };

        checkSession();
    }, []);

    const login = async (password: string) => {

        const response = await fetch('http://localhost:3000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ secretKey: password }),
            credentials: 'include'
        });


        if (!response.ok) {
            throw new Error("Invalid Admin Credentials");
        }

        setIsAuthenticated(true);
    };

    const logout = async () => {
        
        setIsAuthenticated(false);

        const response = await fetch('http://localhost:3000/api/v1/logout',{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(" Failed to logout user");
        }
    };

    if (isInitializing)
        return <div className="h-screen w-screen flex items-center justify-center text-slate-500 animate-spin">Verifying secure session...</div>;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


/*
        Needs to be moved to its individual file under src/hooks
*/
// export const useAuth = () => {

//     const context = useContext(AuthContext);

//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// }