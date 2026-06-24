import { useState, useEffect } from 'react';
import { fetchEvents, type TelemetryEndpoint } from '../lib/api';

export const useEvents = () => {

    const [data, setData] = useState<TelemetryEndpoint[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {


        const loadData = async () => {
            try {
                setIsLoading(true);

                const result = await fetchEvents();
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
    }, []);

    return { data, isLoading, error };
};