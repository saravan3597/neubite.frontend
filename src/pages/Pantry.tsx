import React from 'react';

export const Pantry: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900">Your Pantry</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your available groceries to get the best recipe matches.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-surface-50">
          <h2 className="text-lg font-semibold text-surface-900">Inventory Status</h2>
          <button className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors">
            + Add Items
          </button>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-surface-900 mb-1">Your pantry is empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Start adding ingredients you have at home to unlock personalized recipe recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};
