// frontend/src/pages/dashboard/Metrics.tsx
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, ArrowUp, ArrowDown } from 'lucide-react';
import { tunnelApi } from '../../services/api';

interface Period { rx: { bytes: number; opCnt: number }; tx: { bytes: number; opCnt: number }; timestamp: string }
interface Metrics { periods?: Period[] }

function fmt(bytes: number): string {
  if (bytes > 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes > 1_048_576)     return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes > 1_024)         return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tunnelApi.metrics().then(r => setMetrics(r.data.data as Metrics)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const periods = metrics?.periods ?? [];
  const chartData = periods.map(p => ({
    time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rx: Math.round(p.rx.bytes / 1024),
    tx: Math.round(p.tx.bytes / 1024),
    requests: p.rx.opCnt,
  }));

  const totalRx = periods.reduce((a, p) => a + p.rx.bytes, 0);
  const totalTx = periods.reduce((a, p) => a + p.tx.bytes, 0);
  const totalReq = periods.reduce((a, p) => a + p.rx.opCnt, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Metrics</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Bandwidth and request activity for your account</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total received', value: fmt(totalRx), icon: ArrowDown, color: 'text-green-400' },
          { label: 'Total sent', value: fmt(totalTx), icon: ArrowUp, color: 'text-blue-400' },
          { label: 'Total requests', value: totalReq.toLocaleString(), icon: BarChart2, color: 'text-violet-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : chartData.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <BarChart2 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No metrics yet. Create a tunnel and send some traffic!</p>
        </div>
      ) : (
        <>
          {/* Bandwidth chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
            <h2 className="text-sm font-medium text-white mb-4">Bandwidth (KB)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="rx" name="Received" stroke="#4ade80" fill="url(#rx)" strokeWidth={2} />
                <Area type="monotone" dataKey="tx" name="Sent"     stroke="#60a5fa" fill="url(#tx)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Requests chart */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-white mb-4">Requests</h2>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="req" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#a78bfa" fill="url(#req)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
