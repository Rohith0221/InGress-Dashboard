import { useState, useEffect } from 'react';
import { fetchEndpoints, createEndpoint } from '../lib/api';
import { Plus, Server, Copy, CheckCircle2 } from 'lucide-react';

interface Endpoint {
    id: number;
    slug: string;
    created_at: string;
}

export const EndpointsPage = () => {

    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [newSlug, setNewSlug] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const loadEndpoints = async () => {
        
        try {
            setIsLoading(true);
            const data = await fetchEndpoints();

            setEndpoints(data);

        }
        catch (error) {
            console.error(`Failed to load endpoints: ${error}`);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEndpoints();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!newSlug.trim())
            return;

        try {
            setIsCreating(true);

            await createEndpoint(newSlug);
            setNewSlug('');
            await loadEndpoints();
        }
        catch (error) {
            console.error(`Failed to create endpoint: ${error}`);
            setNewSlug('');
            alert(`Failed to create endpoint. Check console for details.`);
        }
        finally {
            setIsCreating(false);
        }

    };

    const copyToClipboard = (slug: string, id: number) => {

        const fullUrl = `${window.location.origin}/ingress/${slug}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading)
        return <div className="p-8 text-slate-800 animate-bounce">Loading Routing Table...</div>;

    return (
        <div className="space-y-6">
            <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-slate-900">Routing Control Center</h1>
                <p className="text-slate-600 mt-1">Manage dynamic ingestion endpoints for third party webhooks.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-800">
                <form onSubmit={handleCreate} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Endpoint Slug</label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 text-slate-500 px-3 py-2 rounded-l-md border border-r-0 border-slate-300">
                                /ingress/
                            </span>
                            <input
                                type="text"
                                value={newSlug}
                                onChange = {(e) => setNewSlug(e.target.value)}
                                placeholder="e.g., stripe-payments"
                                className="flex-1 border border-slate-300 py-2 px-3 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isCreating || !newSlug}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{isCreating ? 'Deploying...' : 'Deploy Route'} </span>
                        </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                            <th className="p-4 font-medium">Endpoint Configuration</th>
                            <th className="p-4 font-medium">Created At</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {endpoints.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-500">
                                    No active endpoints found. Create one above to start ingesting webhooks.
                                </td>
                            </tr>
                        ) : (
                            endpoints.map((endpoint) => (
                                <tr key={endpoint.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-indigo-100 p-2 rounded-md">
                                                <Server className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm text-slate-900">
                                                    /ingress/{endpoint.slug}
                                                </p>
                                                <p className="text-xs text-slate-500"> ID:  {endpoint.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {new Date(endpoint.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => copyToClipboard(endpoint.slug, endpoint.id)}
                                            className="inline-flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                                {copiedId === endpoint.id ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        <span>Copy URL</span>

                                                    </>
                                                )}
                                            </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}