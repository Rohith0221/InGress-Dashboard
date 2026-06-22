import { useEvents } from "../hooks/useEvents";

export const EventsDashboard = () => 
{

  const { data, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium animate-pulse">Establishing secure connection to InGress Engine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="font-bold">Telemetry Connection Failed</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Live Telemetry Events</h1>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Event ID</th>
                <th className="px-6 py-3">Path</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-600">{event.id}</td>
                  <td className="px-6 py-4">{event.path}</td>
                  <td className="px-6 py-4">
                    {event.status === 200 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Processed (200)
                    </span>
                    ) : event.status === 202 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Pending (202)                      
                   </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Error ({event.status})
                      </span>                      
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{event.payload ? JSON.stringify(event.payload) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No telemetry data found.
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

