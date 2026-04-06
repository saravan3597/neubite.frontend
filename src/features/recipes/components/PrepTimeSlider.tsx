import React from 'react';
import { PREP_TIME_MIN, PREP_TIME_MAX, PREP_TIME_STEP } from '../hooks/useRecipeSuggestions';

// ── Props ─────────────────────────────────────────────────────────────────────

interface PrepTimeSliderProps {
  value: number;
  onChange: (minutes: number) => void;
}

// ── Build step options ────────────────────────────────────────────────────────

const STEPS: number[] = [];
for (let t = PREP_TIME_MIN; t <= PREP_TIME_MAX; t += PREP_TIME_STEP) {
  STEPS.push(t);
}

// ── Component ─────────────────────────────────────────────────────────────────

export const PrepTimeSlider: React.FC<PrepTimeSliderProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Max prep time
        </span>
        <span className="text-sm font-bold text-accent-primary">
          Up to {value} min
        </span>
      </div>

      {/* Pill row — scrolls horizontally on narrow screens */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1 scrollbar-none">
        {STEPS.map((step) => {
          const isActive = step === value;
          return (
            <button
              key={step}
              id={`prep-time-${step}`}
              onClick={() => onChange(step)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                isActive
                  ? 'bg-accent-primary border-accent-primary text-white shadow-sm'
                  : 'bg-bg-secondary border-bg-secondary text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary'
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
