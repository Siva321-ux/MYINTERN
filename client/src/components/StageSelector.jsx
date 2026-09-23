import React from 'react';
import { STAGES, getStageBadgeClass } from '../utils/helpers';
import { ChevronRight } from 'lucide-react';

export default function StageSelector({ currentStage, onStageChange, disabled = false }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {STAGES.map((stage) => {
        const isCurrent = stage === currentStage;
        return (
          <button
            key={stage}
            disabled={disabled}
            onClick={() => onStageChange(stage)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border flex items-center gap-1 ${
              isCurrent
                ? `${getStageBadgeClass(stage)} shadow-sm ring-1 ring-white/20 scale-105`
                : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-200'
            }`}
          >
            <span>{stage}</span>
            {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
}
