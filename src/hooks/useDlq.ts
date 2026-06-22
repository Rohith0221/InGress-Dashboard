import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { fetchDLQ, replayDlqEvent, type TelemetryEndpoint } from "../lib/api";

export interface DlqEndpoint extends TelemetryEndpoint {
    error_message: string;
}

export const useDlq = () => {

    const { token } = useAuth();
    const [dlqEvents, setDlqEvents] = useState<DlqEndpoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!token)
            return;

        const loadData = async () => {

            try {
                setIsLoading(true);
                const data = await fetchDLQ(token);

                setDlqEvents(data);
            } 
            catch(err: any) {
                setError(err.message);
            }
            finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [token]);

    const replayDlq = async (eventId: string): Promise<boolean> => {

        if (!token)
            return false;

        try {
            const response = await replayDlqEvent(token, eventId);

            if (!response.ok)
                throw new Error("Replay failed on server!");

            setDlqEvents(current => current.filter(event => event.id !== eventId));
            return true;
        }
        catch(err: any) {
            console.error("Replay execution failed:", err);
            return false;
        }
    };

    return { dlqEvents, isLoading, error, replayDlq};
};