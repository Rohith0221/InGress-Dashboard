import { useState, useEffect } from "react";
import { fetchDLQ, replayDlqEvent, type TelemetryEndpoint } from "../lib/api";


export interface DlqEndpoint extends TelemetryEndpoint {
    error_message: string;
}

export const useDlq = () => {

    const [dlqEvents, setDlqEvents] = useState<DlqEndpoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const loadData = async () => {

            try {
                setIsLoading(true);
                const data = await fetchDLQ();

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
    }, []);

    const replayDlq = async (eventId: string): Promise<boolean> => {

        try {
            const response = await replayDlqEvent(eventId);

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