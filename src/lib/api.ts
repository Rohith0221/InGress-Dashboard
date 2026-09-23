export interface TelemetryEndpoint {

    id: string;
    path: string;
    status: number;
    timestamp: string;
    payload?: any;
}

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"}/api/v1`;

const secureFetch = async (endpoint: string, options: RequestInit = {}) => {

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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

export const fetchEvents = async () => {
    return secureFetch('events');
};

export const fetchDLQ = async () => {

    return secureFetch('dlq');
}

export const replayDlqEvent = async (eventId: string) => {
    return secureFetch(`dlq/replay/${eventId}`, { method: 'POST'});
}

export const fetchEndpoints = async () => {
    return secureFetch('endpoints');
}

export const createEndpoint = async (slug: string) => {

    return secureFetch('endpoints', {
        method: 'POST',
        body: JSON.stringify({ slug })
    })
}

export const verifySession = async (): Promise<boolean> => {
    try {
        await secureFetch('verify');
        return true;
    } catch {
        return false;
    }
};

export const loginUser = async (password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: password }),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error("Invalid admin credentials");
    }
};

export const logoutUser = async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
};