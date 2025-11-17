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
  // Ensure percentage doesn't exceed 100, but allow effortLoad to display its real value
  const percentage = Math.min(100, (effortLoad / MAX_EFFORT_LOAD) * 100);

  // SVG Gauge constants
  const angle = 180; // Semi-circle
  const strokeWidth = 12;
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * radius; // Circumference of a semi-circle

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const needleRotation = (percentage / 100) * angle - 90; // -90 to start from the left

  // Path for the arc
  const arc = `M ${cx - radius},${cy} a ${radius},${radius} 0 0 1 ${radius * 2},0`;

  return (
    <button 
      onClick={onOpenModal}
      className="w-full p-6 bg-dark-surface rounded-2xl shadow-lg flex flex-col items-center gap-4 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
      aria-label={`Juggling Meter. Current status: ${config.label}. Effort load: ${effortLoad}. Click for details.`}
    >
      <div className="w-full flex flex-col items-center">
         <h2 className="text-xl font-bold text-dark-text-primary">Juggling Meter</h2>
         <span className={`mt-1 text-lg font-semibold rounded-full ${config.textColor}`}>
            {config.label}
         </span>
      </div>
      
      <div className="relative w-[180px] h-[90px] overflow-hidden mt-2">
        <svg className="w-full h-full" viewBox="0 0 180 90">
          {/* Background Arc */}
          <path
            d={arc}
            strokeWidth={strokeWidth}
            stroke="#0A192F" // dark-bg
            fill="none"
          />
          {/* Foreground Arc */}
           <path
            d={arc}
            strokeWidth={strokeWidth}
            stroke={config.color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
          />
           {/* Needle */}
           <g transform={`rotate(${needleRotation} ${cx} ${cy})`} style={{ transition: 'transform 0.5s ease-in-out' }}>
              <line 
                x1={cx}
                y1={cy}
                x2={cx - radius + strokeWidth/2}
                y2={cy}
                stroke="#E6F1FF" // dark-text-primary
                strokeWidth="2"
              />
              <circle cx={cx} cy={cy} r="4" fill="#E6F1FF" />
           </g>
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${config.textColor}`}>
              {effortLoad}
            </span>
            <span className="text-sm text-dark-text-secondary -mt-1">Effort Load</span>
        </div>
      </div>
      <div className="flex justify-between w-full text-xs text-dark-text-secondary px-2">
        <span>0</span>
        <span>{MAX_EFFORT_LOAD}+</span>
      </div>

      <div className="w-full pt-4 mt-2 border-t border-slate-700 text-center">
         <h3 className="font-semibold text-dark-text-primary">Interpretation</h3>
         <p className="text-dark-text-secondary text-sm mt-1">{config.interpretation}</p>
      </div>
    </button>
  );
};

export default JugglingMeter;