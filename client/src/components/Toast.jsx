import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';

export default function Toast() {
  const { toast } = useApplications();

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${
          isError
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
            : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
