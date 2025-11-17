import React from 'react';
import { JugglingMeterStatus } from '../types';

interface JugglingMeterProps {
  status: JugglingMeterStatus;
  effortLoad: number;
  onOpenModal: () => void;
}

const MAX_EFFORT_LOAD = 40; // A baseline for "max capacity" before burnout risk is high

const meterConfig = {
  GREEN: {
    label: 'In the Zone',
    color: '#64FFDA', // brand-primary
    textColor: 'text-brand-primary',
    interpretation: 'Your workload is balanced. This is a great time for deep, focused work.',
  },
  YELLOW: {
    label: 'Juggling Act',
    color: '#FFC700', // brand-accent
    textColor: 'text-brand-accent',
    interpretation: 'Your cognitive load is increasing. Stick to your top priorities and avoid taking on new tasks.',
  },
  RED: {
    label: 'Burnout Risk',
    color: '#F87171', // red-400
    textColor: 'text-red-400',
    interpretation: 'Cognitive load is critical. Prioritize rest, and consider pausing low-impact work to recover.',
  },
};

const JugglingMeter: React.FC<JugglingMeterProps> = ({ status, effortLoad, onOpenModal }) => {
  const config = meterConfig[status];
  const percentage = Math.min(100, (effortLoad / MAX_EFFORT_LOAD) * 100);
  
  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <button 
      onClick={onOpenModal}
      className="w-full p-6 bg-dark-surface rounded-2xl shadow-lg flex flex-col items-center gap-6 hover:bg-slate-800 transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle
              className="text-dark-bg"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
            <circle
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke={config.color}
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
              className="transform -rotate-90 origin-center transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${config.textColor}`}>
              {effortLoad}
            </span>
            <span className="text-sm text-dark-text-secondary">Effort Load</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-dark-text-primary">Juggling Meter</h2>
           <span className={`mt-1 text-lg font-semibold rounded-full ${config.textColor}`}>
            {config.label}
          </span>
          <p className="text-dark-text-secondary mt-2 text-sm">Click to see which tasks are contributing most to your load.</p>
        </div>
      </div>
      <div className="w-full pt-4 mt-4 border-t border-slate-700">
         <h3 className="font-semibold text-dark-text-primary text-center sm:text-left">Interpretation</h3>
         <p className="text-dark-text-secondary text-sm mt-1 text-center sm:text-left">{config.interpretation}</p>
      </div>
    </button>
  );
};

export default JugglingMeter;
