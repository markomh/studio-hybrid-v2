import React from 'react';
import { i18n } from '../i18n';
import { Document } from '@studio-hybrid/core';

export interface InspectorProps {
  document: Document;
  isOpen: boolean;
  onClose?: () => void;
}

export function Inspector({ document, isOpen, onClose }: InspectorProps) {
  if (!isOpen) return null;

  const trim = document.meta.trim;

  return (
    <aside
      data-testid="shell-inspector"
      className="w-80 bg-[#0e1526] border-l border-[#1e2a3f] flex flex-col text-slate-200 select-none z-10 shadow-2xl shrink-0"
    >
      {/* Inspector Header */}
      <div className="h-14 border-b border-[#1e2a3f] px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-xs text-slate-100">{i18n.inspector.pageProps}</h2>
            <span className="text-[10px] text-slate-400">{i18n.inspector.page1}</span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section 1: Page Setup Card */}
        <div className="bg-[#141d2e] border border-[#202d46] rounded-2xl p-4 shadow-sm">
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.trimSize}</span>
              <span className="font-semibold text-white">
                {trim.widthMm} × {trim.heightMm} mm
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.bleed}</span>
              <span className="text-emerald-400 font-semibold">{i18n.inspector.bleedActive}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.gutter}</span>
              <span className="font-semibold text-white">
                {document.meta.margins.insideMm} mm
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.totalPages}</span>
              <span className="font-semibold text-white">{i18n.inspector.pagesTotal}</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 w-full bg-[#1b253b] hover:bg-[#23314d] text-amber-400 border border-amber-500/40 rounded-xl py-2.5 text-xs font-semibold transition shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>{i18n.inspector.changePageSetup}</span>
          </button>
        </div>

        {/* Section 2: Konteks Lembar Card */}
        <div className="bg-[#141d2e] border border-[#202d46] rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-200">{i18n.inspector.pageContext}</span>
            <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
              {i18n.inspector.bodyRole}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.sheetNo}</span>
              <span className="font-semibold text-white">{i18n.inspector.page1}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.spreadPos}</span>
              <span className="font-semibold text-white flex items-center space-x-1">
                <span className="text-amber-400 text-xs">●</span>
                <span>{i18n.inspector.rectoRight}</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{i18n.inspector.gutterSide}</span>
              <span className="font-semibold text-white">{i18n.inspector.leftEdge}</span>
            </div>
          </div>

          <div className="mt-4 bg-[#0a0f1d] p-3 rounded-xl border border-[#1e2a3f] flex items-start space-x-2">
            <span className="text-amber-400 text-xs">💡</span>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              {i18n.inspector.selectHint}
            </p>
          </div>
        </div>

        {/* Section 3: Bingkai Lembar Halaman Accordion */}
        <div className="bg-[#141d2e] border border-[#202d46] rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3 cursor-pointer">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
              </svg>
              <span className="text-xs font-bold text-slate-200">
                {i18n.inspector.pageFrameSection}
              </span>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="mt-2">
            <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              {i18n.inspector.borderStyle}
            </label>
            <div className="w-full bg-[#0a0f1d] border border-[#202d46] rounded-xl px-3 py-2 text-xs text-slate-200 flex justify-between items-center cursor-pointer">
              <span>{i18n.inspector.plainBorder}</span>
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Inspector;
