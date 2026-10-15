import React from 'react';
import { i18n } from '../i18n';

export interface LeftPanelProps {
  isOpen: boolean;
  activeTab: 'elements' | 'frame' | 'pages';
  onClose: () => void;
  onAddText: () => void;
}

export function LeftPanel({ isOpen, activeTab, onClose, onAddText }: LeftPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="shell-left-panel"
      className="w-80 bg-[#0e1526] border-r border-[#1e2a3f] flex flex-col text-slate-200 select-none z-10 shadow-2xl shrink-0"
    >
      {/* Panel Header */}
      <div className="h-14 border-b border-[#1e2a3f] px-4 flex items-center justify-between">
        <h2 className="font-semibold text-sm text-slate-100 tracking-tight">
          {activeTab === 'elements'
            ? i18n.panel.canvasElements
            : activeTab === 'frame'
            ? i18n.rail.frame
            : i18n.rail.pages}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded transition text-sm"
        >
          ✕
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'elements' && (
          <>
            {/* Section 1: Puzzles */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold tracking-wider text-slate-300">
                  {i18n.panel.puzzles}
                </span>
                <span className="text-[10px] text-blue-400 font-medium">
                  {i18n.panel.clickOrDragCanvas}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Labirin */}
                <div className="bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-2xl p-3 cursor-pointer transition shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-sm font-bold">
                      🧩
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{i18n.panel.labirin}</div>
                    <div className="text-[10px] text-slate-400">{i18n.panel.vectorMaze}</div>
                  </div>
                </div>

                {/* Sudoku */}
                <div className="bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-2xl p-3 cursor-pointer transition shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm font-bold">
                      🔢
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{i18n.panel.sudoku}</div>
                    <div className="text-[10px] text-slate-400">{i18n.panel.grid9x9}</div>
                  </div>
                </div>

                {/* Word Search */}
                <div className="bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-2xl p-3 cursor-pointer transition shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center text-sm font-bold">
                      🔍
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{i18n.panel.wordSearch}</div>
                    <div className="text-[10px] text-slate-400">{i18n.panel.searchWord}</div>
                  </div>
                </div>

                {/* Worksheet */}
                <div className="bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-2xl p-3 cursor-pointer transition shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-7 h-7 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center text-sm font-bold">
                      📄
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{i18n.panel.worksheet}</div>
                    <div className="text-[10px] text-slate-400">{i18n.panel.mathWorksheet}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Tipografi & Teks */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold tracking-wider text-slate-300">
                  {i18n.panel.typography}
                </span>
                <span className="text-[10px] text-blue-400 font-medium">
                  {i18n.panel.clickOrDragText}
                </span>
              </div>
              <div className="space-y-2.5">
                <div
                  onClick={onAddText}
                  className="bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-2xl p-3 cursor-pointer transition shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-sm">
                      🚀
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{i18n.panel.headingTitle}</div>
                      <div className="text-[10px] text-slate-400">{i18n.panel.headingSubtitle}</div>
                    </div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>

                <div
                  onClick={onAddText}
                  className="bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-2xl p-3 cursor-pointer transition shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm">
                      💬
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{i18n.panel.instruction}</div>
                      <div className="text-[10px] text-slate-400">{i18n.panel.instructionSubtitle}</div>
                    </div>
                  </div>
                  <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm6-12a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Section 3: Clipart & Maskot */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold tracking-wider text-slate-300">
                  {i18n.panel.clipart}
                </span>
                <span className="text-[10px] text-blue-400 font-medium">
                  {i18n.panel.clickOrDragStickers}
                </span>
              </div>

              {/* Sub-section: Mascots & Characters */}
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                {i18n.panel.mascotsCharacters}
              </div>
              <div className="flex items-center justify-between gap-1.5 mb-4">
                {['🚀', '🪐', '🐱', '😎', '✈️'].map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-11 h-11 bg-[#141d2e] border border-[#202d46] hover:border-blue-500 rounded-xl flex items-center justify-center text-lg transition shadow-sm hover:scale-105"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Sub-section: Start & Goal Icons */}
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                {i18n.panel.startGoalIcons}
              </div>
            </div>
          </>
        )}

        {activeTab === 'frame' && (
          <div className="text-sm text-slate-400 text-center py-8">
            {i18n.panel.frameSettingsPlaceholder}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-2">
            <div className="bg-blue-600/25 border border-blue-500 rounded-lg p-3 text-sm text-white font-medium flex justify-between items-center">
              <span>{i18n.panel.page1Cover}</span>
              <span className="text-xs text-blue-300">{i18n.panel.activeStatus}</span>
            </div>
            <div className="bg-[#141d2e] border border-[#202d46] rounded-lg p-3 text-sm text-slate-300 hover:bg-[#1a253a] cursor-pointer transition">
              {i18n.panel.page2FrontMatter}
            </div>
            <div className="bg-[#141d2e] border border-[#202d46] rounded-lg p-3 text-sm text-slate-300 hover:bg-[#1a253a] cursor-pointer transition">
              {i18n.panel.page3Body}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftPanel;
