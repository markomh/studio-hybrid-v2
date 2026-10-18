import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Document, layout, PageLayoutResult, LayoutPrimitive, computeMargins } from '@studio-hybrid/core';

export interface PageSvgProps {
  document: Document;
  pageId: string;
  zoom?: number;
  showGuides?: boolean;
  isMonochrome?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onMoveElement?: (elementId: string, x: number, y: number) => void;
}

const FONT_MAP: Record<string, string> = {
  sans: 'Liberation Sans, sans-serif',
  serif: 'Liberation Serif, serif',
  comic: 'Comic Neue, cursive, sans-serif',
  mono: 'Liberation Mono, monospace',
};

export function PageSvg({
  document,
  pageId,
  zoom = 1,
  showGuides = true,
  isMonochrome = false,
  selectedElementId = null,
  onSelectElement,
  onMoveElement,
}: PageSvgProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Layout is calculated purely by core.layout (I-6)
  const layoutResult: PageLayoutResult = useMemo(() => {
    return layout(document, pageId);
  }, [document, pageId]);

  const pageIndex = Math.max(0, document.pages.findIndex((p) => p.id === pageId));
  const margins = computeMargins(document, pageIndex);
  const bleedMm = document.meta.bleedMm;
  const widthMm = layoutResult.widthMm;
  const heightMm = layoutResult.heightMm;
  const targetPage = document.pages.find((p) => p.id === pageId);
  const isEmpty = !targetPage || targetPage.elements.length === 0;

  // Dragging state
  const [dragState, setDragState] = useState<{
    elementId: string;
    startClientX: number;
    startClientY: number;
    initialX: number;
    initialY: number;
    pixelsPerMm: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId?: string) => {
      if (!elementId) {
        onSelectElement?.(null);
        return;
      }

      e.stopPropagation();
      onSelectElement?.(elementId);

      const targetElement = targetPage?.elements.find((el) => el.id === elementId);

      if (targetElement && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const pixelsPerMm = svgRect.width / widthMm;

        setDragState({
          elementId,
          startClientX: e.clientX,
          startClientY: e.clientY,
          initialX: targetElement.x,
          initialY: targetElement.y,
          pixelsPerMm,
        });
      }
    },
    [targetPage, widthMm, onSelectElement]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState) return;

      const deltaPxX = e.clientX - dragState.startClientX;
      const deltaPxY = e.clientY - dragState.startClientY;

      const deltaMmX = deltaPxX / dragState.pixelsPerMm;
      const deltaMmY = deltaPxY / dragState.pixelsPerMm;

      const nextX = Number((dragState.initialX + deltaMmX).toFixed(4));
      const nextY = Number((dragState.initialY + deltaMmY).toFixed(4));

      onMoveElement?.(dragState.elementId, nextX, nextY);
    },
    [dragState, onMoveElement]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  // Total viewBox includes bleed area if guides are shown or standard trim
  const viewBoxX = showGuides ? -bleedMm : 0;
  const viewBoxY = showGuides ? -bleedMm : 0;
  const viewBoxWidth = showGuides ? widthMm + 2 * bleedMm : widthMm;
  const viewBoxHeight = showGuides ? heightMm + 2 * bleedMm : heightMm;

  return (
    <div
      className="relative inline-block shadow-md border border-slate-300 bg-white select-none transition-all"
      style={{ filter: isMonochrome ? 'grayscale(100%)' : 'none' }}
    >
      <svg
        ref={svgRef}
        data-testid="page-svg"
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        style={{
          width: `${viewBoxWidth * zoom}mm`,
          height: `${viewBoxHeight * zoom}mm`,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render primitives (background paper and elements) */}
        {layoutResult.primitives.map((p: LayoutPrimitive, index: number) => {
          if (p.kind === 'rect') {
            return (
              <rect
                key={index}
                x={p.x}
                y={p.y}
                width={p.width}
                height={p.height}
                fill={p.fill || 'none'}
                stroke={p.stroke || 'none'}
                strokeWidth={p.strokeWidth || 0}
                strokeDasharray={p.strokeDasharray}
              />
            );
          }

          if (p.kind === 'text') {
            const isSelected = selectedElementId === p.elementId;
            return (
              <text
                key={index}
                data-testid={`text-primitive-${index}`}
                data-element-id={p.elementId}
                x={p.x}
                y={p.y}
                fontSize={`${p.fontSizePt * (25.4 / 72)}mm`}
                fill={p.color}
                fontFamily={FONT_MAP[p.fontFamily] || 'sans-serif'}
                className="cursor-move select-none"
                style={{
                  outline: isSelected ? '1px dashed #3b82f6' : 'none',
                }}
                onMouseDown={(e) => handleMouseDown(e, p.elementId)}
              >
                {p.text}
              </text>
            );
          }

          return null;
        })}

        {/* Guides overlay inside SVG */}
        {showGuides && (
          <>
            {/* Bleed line (Red dashed) */}
            <rect
              x={0}
              y={0}
              width={widthMm}
              height={heightMm}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth={0.25}
            />
            <rect
              x={-bleedMm}
              y={-bleedMm}
              width={widthMm + 2 * bleedMm}
              height={heightMm + 2 * bleedMm}
              fill="none"
              stroke="#ef4444"
              strokeWidth={0.25}
              strokeDasharray="2 2"
            />
            {/* Safe margin boundary (Blue dashed) */}
            <rect
              x={margins.leftMm}
              y={margins.topMm}
              width={widthMm - (margins.leftMm + margins.rightMm)}
              height={heightMm - (margins.topMm + margins.bottomMm)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={0.25}
              strokeDasharray="2 2"
            />
          </>
        )}
      </svg>

      {/* Empty page hint overlay */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-md shadow-md backdrop-blur-sm">
            Tambah elemen dari panel kiri
          </div>
        </div>
      )}
    </div>
  );
}

export default PageSvg;
