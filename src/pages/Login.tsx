import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Shield } from 'lucide-react';

export const Login = () => {

    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const origin = location.state?.from?.pathname || '/endpoints';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (secretKey.length > 20) {
            login(secretKey);
            navigate(origin, { replace: true });
        } else {
            alert("Invalid Admin Key Format");
            setError("Admin key must be at least 20 characters long!");
            return;
        }
    };

    return (
        <div className="min-h-screen w-full max-w-screen-md flex flex-col items-center justify-center bg-slate-50 space-y-6">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-slate-200">
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

                    <Button type="submit" className="w-full">
                        Authenticate
                    </Button>
            </form>
        </div>
     </div>
    );
};
