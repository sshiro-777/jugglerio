import React from 'react';

interface ChartData {
  day: string;
  load: number;
}

interface CognitiveLoadChartProps {
  data: ChartData[];
}

const MAX_LOAD_HEIGHT = 40; // Corresponds to MAX_EFFORT_LOAD for scaling

const CognitiveLoadChart: React.FC<CognitiveLoadChartProps> = ({ data }) => {
  const getBarColor = (load: number) => {
    if (load >= 30) return 'bg-red-400';
    if (load >= 15) return 'bg-yellow-400';
    return 'bg-brand-primary';
  };

  return (
    <div className="p-6 bg-dark-surface rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-dark-text-primary mb-1">Cognitive Load Trend</h3>
      <p className="text-sm text-dark-text-secondary mb-6">Your effort load over the last 7 days.</p>
      <div className="w-full h-48 flex justify-around items-end gap-2">
        {data.map(({ day, load }) => {
          const barHeight = Math.max(5, (load / MAX_LOAD_HEIGHT) * 100);
          return (
            <div key={day} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${getBarColor(load)} group-hover:opacity-80`}
                style={{ height: `${barHeight}%` }}
              >
                 <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-bold text-dark-bg p-1">{load}</div>
              </div>
              <span className="text-xs text-dark-text-secondary mt-2">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CognitiveLoadChart;