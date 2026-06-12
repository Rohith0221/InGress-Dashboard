import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Shield } from 'lucide-react';

export const Login = () => {

    const [secretKey, setSecretKey] = useState('');
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (secretKey.length > 20) {
            login(secretKey);
        } else {
            alert("Invalid Admin Key Format");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col items-center space-y-2">
                    <Shield className="w-6 h-6 text-white" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight">System Admin</h1>
                <p className="text-sm text-slate-500">Enter your telemetry access key.</p>

            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <Input
                    type="password"
                    placeholder="eefKk..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full"/>

                    <Button type="submit" className="w-full">
                        Authenticate
                    </Button>
            </form>
        </div>
    );
};
