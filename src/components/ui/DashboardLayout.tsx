import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { Activity, AlertOctagon, LogOut, Loader2, Webhook } from 'lucide-react';

export const DashboardLayout = ({children}: { children: React.ReactNode }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut ] = useState(false);

    const handleLogout = async () => {

        setIsLoggingOut(true);

        await new Promise(resolve => setTimeout(resolve, 600));
        await logout();

        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full bg-slate-50">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h1 className="text-xl font-bold text-white tracking-tight">InGress Engine</h1>
                    </div>

                    <nav className="px-4 space-y-2 mt-4">

                        <Link to="/events" className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/events' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
                            <Activity className="w-5 h-5" />
                            <span className="font-medium">Live Events</span>
                        </Link>

                        <Link 
                            to="/dlq"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dlq' ? 'bg-red-600 text-white' : 'hover:bg-slate-800'}`}
                            >
                                <AlertOctagon className="w-5 h-5" />
                                <span className="font-medium">Dead Letter Queue (DLQ) </span>
                            </Link>
                        
                        <Link 
                            to="/endpoints"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/endpoints' ? 'bg-black text-white' : 'hover:bg-slate-950'}`}
                            >
                                <Webhook className="w-5 h-5" />
                                <span className="font-medium">Endpoints</span>
                            </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center space-x-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50">
                            {isLoggingOut ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />

                            ) : (
                                <LogOut className="w-5 h-5 text-slate-500" />
                            )}
                            <span className="font-medium text-slate-400">
                                {isLoggingOut ? 'Disconnecting...' : 'Disconnect'}
                            </span>
                        </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );

    };