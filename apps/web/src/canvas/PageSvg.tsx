import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Document, layout, PageLayoutResult, LayoutPrimitive } from '@studio-hybrid/core';

export interface PageSvgProps {
  document: Document;
  pageId: string;
  zoom?: number;
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
  selectedElementId = null,
  onSelectElement,
  onMoveElement,
}: PageSvgProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Layout is calculated purely by core.layout (I-6)
  const layoutResult: PageLayoutResult = useMemo(() => {
    return layout(document, pageId);
  }, [document, pageId]);

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

      const targetPage = document.pages.find((p) => p.id === pageId);
      const targetElement = targetPage?.elements.find((el) => el.id === elementId);

      if (targetElement && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const pixelsPerMm = svgRect.width / layoutResult.widthMm;

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
    [document.pages, pageId, layoutResult.widthMm, onSelectElement]
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

  return (
    <div className="relative inline-block shadow-md border border-slate-300 bg-white select-none">
      <svg
        ref={svgRef}
        data-testid="page-svg"
        viewBox={`0 0 ${layoutResult.widthMm} ${layoutResult.heightMm}`}
        style={{
          width: `${layoutResult.widthMm * zoom}mm`,
          height: `${layoutResult.heightMm * zoom}mm`,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
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
      </svg>
    </div>
  );
}

export default PageSvg;
