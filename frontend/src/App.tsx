import { useEffect, useState } from 'react';

interface Status {
  version: string;
  uptime: number;
  timestamp: string;
}

function App() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3667/api/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch status:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <span className="bg-violet-600 text-white px-3 py-2 rounded-lg text-2xl font-bold">⚡</span>
          <h1 className="text-3xl font-bold">zrokui</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Backend Status</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : status ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Version</span>
                <span className="text-white font-mono">{status.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Uptime</span>
                <span className="text-white font-mono">{Math.floor(status.uptime)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className="text-green-400 font-semibold">● Online</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-400">Failed to connect to backend</p>
              <p className="text-zinc-500 text-sm mt-2">Make sure backend is running on port 3666</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-zinc-500 text-sm">
          <p>Frontend: <span className="text-violet-400">localhost:3555</span></p>
          <p>Backend: <span className="text-violet-400">localhost:3667</span></p>
        </div>
      </div>
    </div>
  );
}

export default App;
