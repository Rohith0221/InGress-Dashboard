export interface TelemetryEndpoint {

    id: string;
    path: string;
    status: number;
    timestamp: string;
    payload?: any;
}

const API_BASE_URL = "http://localhost:3000/api/v1";

const secureFetch = async (endpoint: string, token: string, options: RequestInit = {}) => {

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        }
    });


    if (!response.ok) {

        if (response.status === 401 || response.status === 403) {
            throw new Error('Cryptographic signature rejected by server.');
        }
        throw new Error('Failed to fetch telemetry data from engine.');
    }

    return response.json();

};

export const fetchEvents = async (token: string) => {
    return secureFetch('events', token);
};

export const fetchDLQ = async (token: string) => {

    return secureFetch('dlq', token);
}

export const replayDlqEvent = async (token: string, eventId: string) => {
    return secureFetch('dlq/replay/${eventId}', token, { method: 'POST'});
}