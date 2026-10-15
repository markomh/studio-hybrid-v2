import React from 'react';
import { i18n } from '../i18n';

export interface LeftRailProps {
  activeTab: 'elements' | 'frame' | 'pages';
  onSelectTab: (tab: 'elements' | 'frame' | 'pages') => void;
  isOpen: boolean;
}

export function LeftRail({ activeTab, onSelectTab, isOpen }: LeftRailProps) {
  return (
    <aside
      data-testid="shell-left-rail"
      className="w-16 bg-[#0c121e] border-r border-[#1e2a3f] flex flex-col items-center py-4 text-slate-400 select-none z-20 shrink-0"
    >
      {/* Top tabs */}
      <div className="flex flex-col items-center space-y-5 w-full px-2">
        {/* Tab 1: Elemen */}
        <button
          type="button"
          onClick={() => onSelectTab('elements')}
          className={`w-full flex flex-col items-center py-2.5 px-1 rounded-2xl transition relative ${
            isOpen && activeTab === 'elements'
              ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30 font-semibold'
              : 'hover:bg-[#182337] hover:text-slate-200 text-slate-400'
          }`}
          title={i18n.rail.elements}
        >
          <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span className="text-[10px] tracking-tight">{i18n.rail.elements}</span>
        </button>

        {/* Tab 2: Bingkai */}
        <button
          type="button"
          onClick={() => onSelectTab('frame')}
          className={`w-full flex flex-col items-center py-2.5 px-1 rounded-2xl transition relative ${
            isOpen && activeTab === 'frame'
              ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30 font-semibold'
              : 'hover:bg-[#182337] hover:text-slate-200 text-slate-400'
          }`}
          title={i18n.rail.frame}
        >
          <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <span className="text-[10px] tracking-tight">{i18n.rail.frame}</span>
        </button>

        {/* Tab 3: Halaman */}
        <button
          type="button"
          onClick={() => onSelectTab('pages')}
          className={`w-full flex flex-col items-center py-2.5 px-1 rounded-2xl transition relative ${
            isOpen && activeTab === 'pages'
              ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30 font-semibold'
              : 'hover:bg-[#182337] hover:text-slate-200 text-slate-400'
          }`}
          title={i18n.rail.pages}
        >
          <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="text-[10px] tracking-tight">{i18n.rail.pages}</span>
        </button>
      </div>

      {/* Spacer to push '+' button to bottom */}
      <div className="flex-1" />

      {/* Bottom '+' Button */}
      <div className="pb-2">
        <button
          type="button"
          title={i18n.rail.add}
          className="w-10 h-10 rounded-xl bg-[#182337] hover:bg-[#202d46] border border-[#263750] text-slate-300 flex items-center justify-center text-lg font-medium transition shadow-sm"
        >
          +
        </button>
      </div>
    </aside>
  );
}

export default LeftRail;
