import { useState } from 'react';
import { useDlq } from '../hooks/useDlq';
import { Button } from '../components/ui/button';

export const DlqDashboard = () => {

    const { dlqEvents, isLoading, error, replayDlq } = useDlq();
    const [expandedId, setExpandedId ] = useState<string | null>(null);
    const [replayingId, setReplayingId ] = useState<string | null>(null);
    const [notification, setNotification ] = useState<{ type: 'success' | 'error', msg: string} | null>(null);

    const handleReplay = async (id: string) => {
        setReplayingId(id);

        const success = await replayDlq(id);

        setReplayingId(null);

        if (success) {
            setNotification({ type: 'success', msg: `Event ${id} successfully replayed and moved to the Live Events queue`});
        }
        else {
            setNotification({ type: 'error', msg: `Failed to replay Event ${id}`});
        }

        setTimeout(() => setNotification(null), 5000);
    };

    if (isLoading)
        return <div className="p-8 text-slate-500 animate-pulse">Scanning Dead Letter Queue...</div>;

    if (error)
        return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight"> Dead Letter Queue</h1>

            {notification && (
                <div className={`p-4 rounded-md font-medium ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {notification.msg}
                    </div>
            )}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 w-10"></th>
                            <th className="px-6 py-3">Event ID</th>
                            <th className="px-6 py-3"> Path </th>
                            <th className="px-6 py-3"> Timestamp</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {dlqEvents.map((event) => (
                            <div key={event.id} className="contents">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <button onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} className="text-slate-500 hover:text-slate-900 font-bold">
                                            {expandedId === event.id ? '-' : '+'}
                                        </button>

                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600">{event.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900"><span className="font-normal text-slate-500">{event.path}</span></td>
                                    <td className="px-6 py-4 text-slate-600">{new Date(event.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={replayingId === event.id}
                                            onClick={() => handleReplay(event.id)}
                                            >
                                                {replayingId === event.id ? 'Replaying...' : 'Replay'}
                                            </Button>
                                    </td>
                                </tr>

                                {expandedId === event.id && (
                                    <tr className="bg-slate-900 text-slate-300">
                                        <td colSpan={4} className="px-6 py-6">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <h3 className="text-slate-400 font-bold text-xs uppercase mb-2">Original Payload</h3>
                                                    <pre className="text-xs text-green-300 overflow-x-auto">{JSON.stringify(event.payload, null, 2)}</pre>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </div>
                        ))}
                    </tbody>
                </table>
                {dlqEvents.length === 0 && <div className="p-8 text-center text-slate-500">Queue is Clear.</div>}
            </div>
        </div>

    );
};