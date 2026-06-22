import { useState, useEffect } from 'react';
import { fetchEvents, type TelemetryEndpoint } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const useEvents = () => {

    const { token } = useAuth();
    const [data, setData] = useState<TelemetryEndpoint[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!token) {
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                setIsLoading(true);

                const result = await fetchEvents(token);
                setData(result);
                setError(null);
            }
            catch (err: any) {
                setError(err.message || "An unknown error occurred");
            }
            finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [token]);

    return { data, isLoading, error };
};