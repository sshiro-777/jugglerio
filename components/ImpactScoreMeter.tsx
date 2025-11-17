import React from 'react';

interface ImpactScoreMeterProps {
  score: number;
}

const ImpactScoreMeter: React.FC<ImpactScoreMeterProps> = ({ score }) => {
  return (
    <div className="flex items-center justify-center gap-1" title={`Impact Score: ${score} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            index < score ? 'bg-brand-primary' : 'bg-dark-bg'
          }`}
        ></span>
      ))}
    </div>
  );
};

export default ImpactScoreMeter;
