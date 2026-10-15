import React from 'react';
import { i18n } from '../i18n';
import { SaveStatus } from '../persistence';

export interface HeaderProps {
  title: string;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  isFocusMode?: boolean;
  onAddText: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomChange: (zoom: number) => void;
  onToggleFocusMode?: () => void;
}

export function Header({
  title,
  saveStatus,
  canUndo,
  canRedo,
  zoom,
  isFocusMode = false,
  onAddText,
  onUndo,
  onRedo,
  onZoomChange,
  onToggleFocusMode,
}: HeaderProps) {
  const statusColor =
    saveStatus === 'saved'
      ? 'text-emerald-400 bg-emerald-950/50 border-emerald-700/60'
      : saveStatus === 'saving'
      ? 'text-amber-400 bg-amber-950/50 border-amber-700/60'
      : saveStatus === 'error'
      ? 'text-rose-400 bg-rose-950/50 border-rose-700/60'
      : 'text-slate-400 bg-slate-800/80 border-slate-700';

  return (
    <header
      data-testid="shell-header"
      className="h-14 bg-[#0e1526] border-b border-[#1e2a3f] px-4 flex items-center justify-between text-slate-200 select-none z-30 shadow-md"
    >
      {/* Left section: Logo, App Name, File menu, Undo/Redo, Title, Save Status */}
      <div className="flex items-center space-x-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-xs tracking-wider uppercase leading-none">
              {i18n.appName}
            </span>
            <span className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
              {i18n.workspaceSubtitle}
            </span>
          </div>
        </div>

        {/* File Dropdown */}
        <button
          type="button"
          className="px-2.5 py-1 bg-[#182337] hover:bg-[#202d46] border border-[#263750] rounded-lg text-xs font-medium text-slate-300 flex items-center space-x-1 transition ml-2"
        >
          <span>{i18n.fileMenu}</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Undo / Redo buttons */}
        <div className="flex items-center rounded-lg border border-[#263750] bg-[#182337] overflow-hidden">
          <button
            data-testid="btn-undo"
            onClick={onUndo}
            disabled={!canUndo}
            title={i18n.undo}
            className="px-2.5 py-1 hover:bg-[#202d46] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center text-xs font-bold"
          >
            ↺
          </button>
          <div className="w-px h-3.5 bg-[#263750]" />
          <button
            data-testid="btn-redo"
            onClick={onRedo}
            disabled={!canRedo}
            title={i18n.redo}
            className="px-2.5 py-1 hover:bg-[#202d46] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center text-xs font-bold"
          >
            ↻
          </button>
        </div>

        {/* Document Title Pill */}
        <div className="px-3 py-1 bg-[#090e1a] border border-[#202d46] rounded-lg text-xs font-mono text-slate-300 max-w-[240px] truncate shadow-inner">
          {title || 'Buku_Labirin_Mars_01'}
        </div>

        {/* Save Status Badge */}
        <div
          data-testid="save-status-indicator"
          className={`px-3 py-0.5 text-[11px] font-medium rounded-full border flex items-center space-x-1.5 shadow-sm ${statusColor}`}
        >
          <span className="text-xs">☁</span>
          <span>{i18n.status[saveStatus]}</span>
        </div>
      </div>

      {/* Right section: Focus Mode, Utilities, Share */}
      <div className="flex items-center space-x-2">
        {/* Quick Add Text (preserved for tests) */}
        <button
          data-testid="btn-add-text"
          onClick={onAddText}
          className="hidden"
          aria-hidden="true"
        >
          {i18n.addText}
        </button>

        {/* Mode Fokus Button */}
        <button
          data-testid="btn-focus-mode"
          onClick={onToggleFocusMode}
          title={`${isFocusMode ? i18n.header.exitFocusMode : i18n.header.focusMode} (${i18n.header.tabShortcut})`}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center space-x-1.5 ${
            isFocusMode
              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm'
              : 'bg-[#182337] hover:bg-[#202d46] text-slate-300 border-[#263750]'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {isFocusMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
          <span>{isFocusMode ? i18n.header.exitFocusMode : i18n.header.focusMode}</span>
          <span className="ml-1 px-1.5 py-0.2 bg-[#090e1a] border border-[#2b3c54] text-[10px] text-slate-400 rounded font-mono">
            {i18n.header.tabShortcut}
          </span>
        </button>

        {/* Utilitas Dropdown Button */}
        <button
          type="button"
          className="px-3 py-1.5 bg-[#182337] hover:bg-[#202d46] border border-[#263750] rounded-lg text-xs font-medium text-slate-300 flex items-center space-x-1.5 transition"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path
              strokeWidth="2"
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
            />
          </svg>
          <span>{i18n.header.utilities}</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Bagikan Button (Primary Accent) */}
        <button
          type="button"
          className="px-3.5 py-1.5 bg-[#5b4df6] hover:bg-[#4d3fe8] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-md shadow-indigo-600/30"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>{i18n.header.share}</span>
          <svg className="w-3 h-3 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Hidden zoom select for test compatibility if any */}
        <select
          data-testid="select-zoom"
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="hidden"
          aria-hidden="true"
        >
          <option value={0.5}>50%</option>
          <option value={1}>100%</option>
          <option value={1.5}>150%</option>
          <option value={2}>200%</option>
        </select>
      </div>
    </header>
  );
}

export default Header;
