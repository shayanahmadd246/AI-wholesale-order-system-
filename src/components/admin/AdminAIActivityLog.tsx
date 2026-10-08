import React, { useState, useEffect } from 'react';
import { AIActivityLog } from '../../types';
import { getAIActivityLogsApi } from '../../api/reports';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Bot, Mic, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdminAIActivityLog: React.FC = () => {
  const [logs, setLogs] = useState<AIActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAIActivityLogsApi();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load AI activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-500" />
            <span>AI System Audit Trail Log</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time automated record of AI voice transcriptions, drafted orders, and language interactions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          Refresh Audit Logs
        </button>
      </div>

      {loading && <LoadingSpinner label="Fetching AI system audit trail..." />}
      {error && <ErrorMessage message={error} onRetry={fetchLogs} />}

      {!loading && !error && logs.length === 0 && (
        <EmptyState title="No AI Activity Recorded" description="AI system events will appear here." />
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="space-y-2">
          {logs.map(log => (
            <div
              key={log.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-start gap-3"
            >
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0 mt-0.5">
                {log.action.includes('Voice') ? <Mic className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md">
                      {log.actor}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    {log.language && (
                      <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 font-bold uppercase rounded text-[10px]">
                        {log.language}
                      </span>
                    )}
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {log.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
