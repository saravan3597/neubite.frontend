import React from 'react';
import { ClockIcon } from '../../../shared/components/icons';

// ── Props ─────────────────────────────────────────────────────────────────────

interface PrepTimeSliderProps {
  value: number;
  onChange: (minutes: number) => void;
}

// ── Build step options ────────────────────────────────────────────────────────

const STEPS: number[] = [20, 30, 60];

// ── Component ─────────────────────────────────────────────────────────────────

export const PrepTimeSlider: React.FC<PrepTimeSliderProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-text-primary uppercase tracking-widest shrink-0">
        <ClockIcon className="w-3.5 h-3.5 text-accent-primary" />
        Prep under
      </span>

      <div className="flex items-center p-1 bg-bg-secondary rounded-xl border border-bg-secondary/50">
        {STEPS.map((step) => {
          const isActive = step === value;
          return (
            <button
              key={step}
              id={`prep-time-${step}`}
              onClick={() => onChange(step)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-bg-primary text-accent-primary shadow-sm shadow-black/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/40'
              }`}
            >
              {step} min
            </button>
          );
        })}
      </div>
    </div>
  );
};
