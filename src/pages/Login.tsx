import { useState } from 'react';
import { useAuth } from '../hooks/auth/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Shield, Loader2 } from 'lucide-react';

export const Login = () => {

    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const {  login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const origin = location.state?.from?.pathname || '/endpoints';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (secretKey.length < 5) {
            setError("Admin password is too short.");
            return;

        } 
        
        try {
            setIsAuthenticating(true);

            await new Promise(resolve => setTimeout(resolve, 800));

            await login(secretKey);

            navigate(origin, { replace: true });

        }
        catch (error: any) {

            setError(error.message || "Failed to authenticate with server. Try again later");
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 space-y-6">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-center items-center space-y-2">
                    <Shield className="w-10 h-10 text-black" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight">System Admin</h1>
                <p className="text-sm text-slate-500">Enter your telemetry access key.</p>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Input
                    type="password"
                    placeholder="eefKk..."
                    value={secretKey}
                    onChange={(e) => {
                        setSecretKey(e.target.value);
                        setError('');
                    }}
                    className="w-full"/>

                    {error && (
                        <p className="text-sm font-medium text-red-500">
                            {error}
                        </p>
                    )}
                    </div>

                    <Button type="submit" disabled={isAuthenticating} className="w-full flex items-center justify-center text-white py-2 rounded-md hover:bg-grey-500 disabled:opacity-70 transition-all">
                        {isAuthenticating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Decrypting Session...
                            </>
                        ): (
                            "Access Engine"
                        )}
                    </Button>
            </form>
        </div>
     </div>
    );
};
