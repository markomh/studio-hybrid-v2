import React from 'react';
import { i18n } from '../i18n';

export interface FooterProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function Footer({ zoom, onZoomChange }: FooterProps) {
  return (
    <footer
      data-testid="shell-footer"
      className="h-12 bg-[#0e1526] border-t border-[#1e2a3f] px-4 flex items-center justify-between text-slate-300 text-xs select-none z-20 shrink-0"
    >
      {/* Left: Page Navigator */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#141d2e] border border-[#202d46] hover:bg-[#1a253a] text-slate-400 hover:text-white transition"
        >
          ‹
        </button>

        <div className="flex flex-col text-center">
          <div className="flex items-center space-x-1 font-semibold text-white">
            <span className="text-slate-400 font-normal">{i18n.footer.pageLabel}</span>
            <span>1</span>
            <span className="text-slate-500 font-normal">{i18n.footer.of}</span>
            <span>50</span>
          </div>
          <span className="text-[10px] text-slate-400 leading-none">
            {i18n.footer.recto}
          </span>
        </div>

        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#141d2e] border border-[#202d46] hover:bg-[#1a253a] text-slate-400 hover:text-white transition"
        >
          ›
        </button>
      </div>

      {/* Center & Right: Toggles & Zoom */}
      <div className="flex items-center space-x-4">
        {/* Toggle Garis Bantu ON */}
        <button
          type="button"
          className="flex items-center space-x-1.5 bg-[#4f46e5] text-white px-3 py-1 rounded-xl font-medium text-xs shadow-md shadow-indigo-600/20"
        >
          <span>📐</span>
          <span>{i18n.footer.guides}</span>
          <span className="bg-indigo-700 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
            {i18n.footer.on}
          </span>
        </button>

        {/* Toggle Monokrom OFF */}
        <button
          type="button"
          className="flex items-center space-x-1.5 bg-[#141d2e] border border-[#202d46] hover:bg-[#1a253a] text-slate-300 px-3 py-1 rounded-xl font-medium text-xs transition"
        >
          <span>{i18n.footer.monochrome}</span>
          <span className="bg-[#1f2c42] text-slate-400 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
            {i18n.footer.off}
          </span>
        </button>

        {/* Zoom Slider and Percentage */}
        <div className="flex items-center space-x-2">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-24 accent-indigo-500 cursor-pointer"
          />
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="w-10 text-right font-semibold text-slate-200 text-xs">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Fit View Button */}
        <button
          type="button"
          onClick={() => onZoomChange(1)}
          className="bg-[#141d2e] hover:bg-[#1a253a] border border-[#202d46] px-3 py-1 rounded-xl font-medium text-slate-200 transition text-xs shadow-sm"
        >
          {i18n.footer.fit}
        </button>
      </div>
    </footer>
  );
}

export default Footer;
