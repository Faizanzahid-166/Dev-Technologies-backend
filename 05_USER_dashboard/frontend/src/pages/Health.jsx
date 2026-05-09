import { useEffect, useState } from 'react';
import { checkHealth } from '../api/APIs.js';

export default function Health() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await checkHealth();
        setConnected(Boolean(res?.success));
      } catch (err) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-slate-50 mb-2">Backend Health</h1>
        {loading ? (
          <p className="text-sm text-slate-400">Checking connection…</p>
        ) : connected ? (
          <p className="text-sm text-emerald-300">⚡ MERN Connected Successfully!</p>
        ) : (
          <p className="text-sm text-rose-400">❌ Backend not connected</p>
        )}
      </div>
    </div>
  );
}