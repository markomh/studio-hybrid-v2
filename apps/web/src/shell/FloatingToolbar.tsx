import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  getElementDefinition,
  deriveSeed,
  PropertyField,
  Element,
} from '@studio-hybrid/core';
import { Icon } from '../ui/Icon';
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoreHorizontal,
  FlipHorizontal,
  Sparkles,
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
} from 'lucide-react';
import { i18n, t } from '../i18n';
import { useDocumentStore } from '../store/documentStore';

export interface FloatingToolbarProps {
  selectedElementId?: string | null;
  activePageId?: string;
  document?: Document;
  element?: Element;
  onLock?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

/**
 * FloatingToolbar: Capability and schema-driven toolbar positioned over canvas.
 * - Contents determined purely by registry (no type branching per Invariant I-3)
 * - Maximum 6 type-specific controls
 * - Universal capsule: Lock/Unlock, Duplicate, Layer Order (•••), Delete
 * - Fixed size across zoom levels, flips below if overflowing top, clamped inside viewport
 * - Closes ••• menu on Escape
 */
export function FloatingToolbar({
  selectedElementId,
  activePageId,
  document: propDocument,
  element: propElement,
  onLock,
  onDuplicate,
  onDelete,
}: FloatingToolbarProps) {
  const hookDoc = useDocumentStore((state) => state.document);
  const currentDoc =
    propDocument ||
    (typeof window === 'undefined' ? useDocumentStore.getState().document : hookDoc);

  const toggleLock = useDocumentStore((state) => state.toggleLock);
  const duplicateElement = useDocumentStore((state) => state.duplicateElement);
  const reorderElement = useDocumentStore((state) => state.reorderElement);
  const deleteElement = useDocumentStore((state) => state.deleteElement);
  const updateElement = useDocumentStore((state) => state.updateElement);

  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Locate the element and its page
  const selectionInfo = useMemo(() => {
    if (propElement) {
      return { element: propElement, pageId: activePageId || 'page-1' };
    }
    if (!selectedElementId) return null;
    if (activePageId) {
      const page = currentDoc.pages.find((p) => p.id === activePageId);
      const el = page?.elements.find((e) => e.id === selectedElementId);
      if (el) return { element: el, pageId: activePageId };
    }
    for (const page of currentDoc.pages) {
      const el = page.elements.find((e) => e.id === selectedElementId);
      if (el) return { element: el, pageId: page.id };
    }
    return null;
  }, [propElement, currentDoc.pages, selectedElementId, activePageId]);

  const definition = useMemo(() => {
    if (!selectionInfo) return undefined;
    return getElementDefinition(selectionInfo.element);
  }, [selectionInfo]);

  const isLocked = Boolean(selectionInfo?.element.locked);

  // Position calculation: coordinates in screen/viewport space
  useEffect(() => {
    if (!selectedElementId || !selectionInfo) {
      setPos(null);
      return;
    }

    const updatePosition = () => {
      const doc = typeof window !== 'undefined' ? window.document : null;
      const workspace = doc ? doc.querySelector('[data-testid="shell-canvas-workspace"]') : null;
      const elementDom = doc ? doc.querySelector(`[data-element-id="${selectedElementId}"]`) : null;
      const toolbar = toolbarRef.current;

      if (!workspace || !toolbar) {
        setPos({ top: 16, left: 200 });
        return;
      }

      const workspaceRect = workspace.getBoundingClientRect();
      const toolbarRect = toolbar.getBoundingClientRect();

      let targetRect: { top: number; bottom: number; left: number; right: number; width: number; height: number };

      if (elementDom) {
        targetRect = elementDom.getBoundingClientRect();
      } else {
        targetRect = {
          top: workspaceRect.top + 60,
          bottom: workspaceRect.top + 100,
          left: workspaceRect.left + workspaceRect.width / 2 - 50,
          right: workspaceRect.left + workspaceRect.width / 2 + 50,
          width: 100,
          height: 40,
        };
      }

      const GAP = 8;
      const elTopRel = targetRect.top - workspaceRect.top + workspace.scrollTop;
      const elBottomRel = targetRect.bottom - workspaceRect.top + workspace.scrollTop;
      const elCenterRel = targetRect.left - workspaceRect.left + workspace.scrollLeft + targetRect.width / 2;

      // Default: above selection
      let top = elTopRel - toolbarRect.height - GAP;

      // Flip below if it overflows above workspace
      if (top < workspace.scrollTop + GAP) {
        top = elBottomRel + GAP;
      }

      // Clamp inside workspace viewport
      const minTop = workspace.scrollTop + GAP;
      const maxTop = Math.max(minTop, workspace.scrollTop + workspaceRect.height - toolbarRect.height - GAP);
      top = Math.max(minTop, Math.min(top, maxTop));

      let left = elCenterRel - toolbarRect.width / 2;
      const minLeft = workspace.scrollLeft + GAP;
      const maxLeft = Math.max(minLeft, workspace.scrollLeft + workspaceRect.width - toolbarRect.width - GAP);
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setPos({ top: Math.round(top), left: Math.round(left) });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    const workspace = window.document.querySelector('[data-testid="shell-canvas-workspace"]');
    workspace?.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      workspace?.removeEventListener('scroll', updatePosition);
    };
  }, [
    selectedElementId,
    selectionInfo?.element.x,
    selectionInfo?.element.y,
    selectionInfo?.element.w,
    selectionInfo?.element.h,
    currentDoc.pages,
  ]);

  // Keyboard navigation: Close layer menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Click outside to close menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Handlers for universal actions
  const handleToggleLock = () => {
    if (onLock) {
      onLock();
      return;
    }
    if (selectionInfo) {
      toggleLock(selectionInfo.element.id);
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
      return;
    }
    if (selectionInfo && !isLocked) {
      duplicateElement(selectionInfo.pageId, selectionInfo.element.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      return;
    }
    if (selectionInfo && !isLocked) {
      deleteElement(selectionInfo.pageId, selectionInfo.element.id);
    }
  };

  const handleReorder = (direction: 'front' | 'forward' | 'backward' | 'back') => {
    if (selectionInfo && !isLocked) {
      reorderElement(selectionInfo.pageId, selectionInfo.element.id, direction);
      setIsMenuOpen(false);
    }
  };

  // Build type-specific controls: Quick fields + Derived capability controls (max 6)
  const typeSpecificControls = useMemo(() => {
    if (!selectionInfo || !definition) return [];

    const controls: React.ReactNode[] = [];
    const caps = definition.capabilities;

    // 1. Quick fields from propertySchema
    const quickFields: PropertyField[] = definition.propertySchema
      .filter((f) => f.quick !== undefined)
      .sort((a, b) => (a.quick ?? 0) - (b.quick ?? 0));

    for (const field of quickFields) {
      const fieldVal = (selectionInfo.element as Record<string, unknown>)[field.key];
      const fieldLabel = t(field.labelKey);

      if (field.kind === 'select') {
        controls.push(
          <select
            key={`quick-${field.key}`}
            data-testid={`quick-field-${field.key}`}
            data-type-specific="true"
            disabled={isLocked}
            aria-label={fieldLabel}
            title={fieldLabel}
            value={String(fieldVal ?? '')}
            onChange={(e) => {
              updateElement(selectionInfo.pageId, selectionInfo.element.id, {
                [field.key]: e.target.value,
              } as Partial<Element>);
            }}
            className="h-7 px-2 text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        );
      } else if (field.kind === 'color') {
        controls.push(
          <input
            key={`quick-${field.key}`}
            type="color"
            data-testid={`quick-field-${field.key}`}
            data-type-specific="true"
            disabled={isLocked}
            aria-label={fieldLabel}
            title={fieldLabel}
            value={String(fieldVal ?? '#000000')}
            onChange={(e) => {
              updateElement(selectionInfo.pageId, selectionInfo.element.id, {
                [field.key]: e.target.value,
              } as Partial<Element>);
            }}
            className="w-7 h-7 p-0.5 rounded-[var(--radius-md)] border border-[var(--color-border)] cursor-pointer disabled:opacity-40 disabled:pointer-events-none bg-transparent"
          />
        );
      } else if (field.kind === 'switch') {
        const isActive = Boolean(fieldVal);
        controls.push(
          <button
            key={`quick-${field.key}`}
            type="button"
            data-testid={`quick-field-${field.key}`}
            data-type-specific="true"
            disabled={isLocked}
            aria-label={fieldLabel}
            title={fieldLabel}
            onClick={() => {
              updateElement(selectionInfo.pageId, selectionInfo.element.id, {
                [field.key]: !isActive,
              } as Partial<Element>);
            }}
            className={`w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] border transition duration-[var(--transition-fast)] disabled:opacity-40 disabled:pointer-events-none ${
              isActive
                ? 'bg-[var(--color-primary-subtle,#e0e7ff)] text-[var(--color-primary,#4338ca)] border-[var(--color-primary,#6366f1)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <span className="text-[12px] font-bold">B</span>
          </button>
        );
      } else if (field.kind === 'slider' || field.kind === 'number') {
        controls.push(
          <input
            key={`quick-${field.key}`}
            type="number"
            data-testid={`quick-field-${field.key}`}
            data-type-specific="true"
            disabled={isLocked}
            aria-label={fieldLabel}
            title={fieldLabel}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={Number(fieldVal ?? field.min ?? 0)}
            onChange={(e) => {
              updateElement(selectionInfo.pageId, selectionInfo.element.id, {
                [field.key]: Number(e.target.value),
              } as Partial<Element>);
            }}
            className="w-14 h-7 px-1.5 text-[12px] text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        );
      } else {
        controls.push(
          <input
            key={`quick-${field.key}`}
            type="text"
            data-testid={`quick-field-${field.key}`}
            data-type-specific="true"
            disabled={isLocked}
            aria-label={fieldLabel}
            title={fieldLabel}
            value={String(fieldVal ?? '')}
            onChange={(e) => {
              updateElement(selectionInfo.pageId, selectionInfo.element.id, {
                [field.key]: e.target.value,
              } as Partial<Element>);
            }}
            className="w-24 h-7 px-2 text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        );
      }
    }

    // 2. Derived capability: flipH
    if (caps.flipH) {
      controls.push(
        <button
          key="cap-flipH"
          type="button"
          data-testid="control-flip-h"
          data-type-specific="true"
          disabled={isLocked}
          aria-label={i18n.toolbar.flipH}
          title={i18n.toolbar.flipH}
          onClick={() => {
            const current = Boolean((selectionInfo.element as Record<string, unknown>).flipH);
            updateElement(selectionInfo.pageId, selectionInfo.element.id, {
              flipH: !current,
            } as Partial<Element>);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
        >
          <Icon icon={FlipHorizontal} size={14} label={i18n.toolbar.flipH} />
        </button>
      );
    }

    // 3. Derived capability: opacity (stepped 25%)
    if (caps.opacity) {
      const currentOpacity = selectionInfo.element.opacity ?? 1;
      controls.push(
        <button
          key="cap-opacity"
          type="button"
          data-testid="control-opacity"
          data-type-specific="true"
          disabled={isLocked}
          aria-label={i18n.toolbar.opacity}
          title={i18n.toolbar.opacity}
          onClick={() => {
            let next = Math.round((currentOpacity - 0.25) * 100) / 100;
            if (next < 0.25) next = 1;
            updateElement(selectionInfo.pageId, selectionInfo.element.id, {
              opacity: next,
            });
          }}
          className="h-7 px-1.5 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
        >
          <span className="text-[11px] font-medium leading-none">
            {Math.round(currentOpacity * 100)}%
          </span>
        </button>
      );
    }

    // 4. Derived capability: engine
    if (caps.engine) {
      const engineLabel = caps.engine.label;
      controls.push(
        <button
          key="cap-engine"
          type="button"
          data-testid="control-engine"
          data-type-specific="true"
          disabled={isLocked}
          aria-label={engineLabel}
          title={engineLabel}
          onClick={() => {
            const currentParams = (selectionInfo.element as Record<string, unknown>).params as
              | Record<string, unknown>
              | undefined;
            const currentSeed = Number(currentParams?.seed ?? 1000);
            const nextSeed = deriveSeed(currentSeed + 1);
            updateElement(selectionInfo.pageId, selectionInfo.element.id, {
              params: { ...(currentParams || {}), seed: nextSeed },
            } as Partial<Element>);
          }}
          className="h-7 px-2 flex items-center justify-center space-x-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] hover:bg-[var(--color-border)] text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
        >
          <Icon icon={Sparkles} size={13} label={engineLabel} />
          <span className="text-[11px] font-medium leading-none">{engineLabel}</span>
        </button>
      );
    }

    // Guaranteed <= 6 type-specific controls
    return controls.slice(0, 6);
  }, [selectionInfo, definition, isLocked, updateElement]);

  const hasSelection = Boolean(selectedElementId && selectionInfo);

  const stylePosition: React.CSSProperties = pos
    ? {
        position: 'absolute',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        display: hasSelection ? 'flex' : 'none',
      }
    : {
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: hasSelection ? 'flex' : 'none',
      };

  return (
    <div
      ref={toolbarRef}
      data-testid="floating-toolbar"
      role="toolbar"
      aria-label="Floating Toolbar"
      style={stylePosition}
      className="z-[var(--z-panel,20)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-1 flex items-center space-x-1.5 shadow-[var(--shadow-md)] text-[var(--color-text)] select-none whitespace-nowrap"
    >
      {/* Type-Specific Controls (Max 6) */}
      {typeSpecificControls.length > 0 && (
        <>
          <div className="flex items-center space-x-1">{typeSpecificControls}</div>
          <div className="w-px h-4 bg-[var(--color-border)] mx-0.5" />
        </>
      )}

      {/* Universal Capsule: Lock/Unlock, Duplicate, Layer Order, Delete */}
      <div className="flex items-center space-x-1">
        {/* Lock / Unlock */}
        <button
          type="button"
          data-testid="toolbar-btn-lock"
          onClick={handleToggleLock}
          disabled={!hasSelection}
          aria-label={isLocked ? i18n.toolbar.unlock : i18n.toolbar.lock}
          title={isLocked ? i18n.toolbar.unlock : i18n.toolbar.lock}
          className={`w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] transition duration-[var(--transition-fast)] ${
            isLocked
              ? 'bg-[var(--color-warning-subtle,#fef3c7)] text-[var(--color-warning,#d97706)] hover:bg-[var(--color-warning-subtle,#fef3c7)]/80'
              : 'hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          } disabled:opacity-40 disabled:pointer-events-none`}
        >
          <Icon
            icon={isLocked ? Unlock : Lock}
            size={14}
            label={isLocked ? i18n.toolbar.unlock : i18n.toolbar.lock}
          />
        </button>

        {/* Duplicate */}
        <button
          type="button"
          data-testid="toolbar-btn-duplicate"
          onClick={handleDuplicate}
          disabled={!hasSelection || isLocked}
          aria-label={i18n.toolbar.duplicate}
          title={i18n.toolbar.duplicate}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
        >
          <Icon icon={Copy} size={14} label={i18n.toolbar.duplicate} />
        </button>

        {/* Layer Order Menu ("•••") */}
        <div className="relative">
          <button
            type="button"
            data-testid="toolbar-btn-layer-order"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            disabled={!hasSelection || isLocked}
            aria-label={i18n.toolbar.layerOrder}
            title={i18n.toolbar.layerOrder}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
          >
            <Icon icon={MoreHorizontal} size={14} label={i18n.toolbar.layerOrder} />
          </button>

          {isMenuOpen && (
            <div
              data-testid="layer-order-menu"
              role="menu"
              aria-label={i18n.toolbar.layerOrder}
              className="absolute left-0 top-full mt-1.5 w-44 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] p-1 z-30 flex flex-col space-y-0.5"
            >
              <button
                type="button"
                data-testid="toolbar-btn-reorder-front"
                role="menuitem"
                aria-label={i18n.toolbar.bringToFront}
                onClick={() => handleReorder('front')}
                className="w-full flex items-center space-x-2 px-2 py-1.5 text-[12px] text-left text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] transition duration-[var(--transition-fast)]"
              >
                <Icon icon={ArrowUpToLine} size={14} label={i18n.toolbar.bringToFront} />
                <span>{i18n.toolbar.bringToFront}</span>
              </button>
              <button
                type="button"
                data-testid="toolbar-btn-reorder-forward"
                role="menuitem"
                aria-label={i18n.toolbar.bringForward}
                onClick={() => handleReorder('forward')}
                className="w-full flex items-center space-x-2 px-2 py-1.5 text-[12px] text-left text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] transition duration-[var(--transition-fast)]"
              >
                <Icon icon={ArrowUp} size={14} label={i18n.toolbar.bringForward} />
                <span>{i18n.toolbar.bringForward}</span>
              </button>
              <button
                type="button"
                data-testid="toolbar-btn-reorder-backward"
                role="menuitem"
                aria-label={i18n.toolbar.sendBackward}
                onClick={() => handleReorder('backward')}
                className="w-full flex items-center space-x-2 px-2 py-1.5 text-[12px] text-left text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] transition duration-[var(--transition-fast)]"
              >
                <Icon icon={ArrowDown} size={14} label={i18n.toolbar.sendBackward} />
                <span>{i18n.toolbar.sendBackward}</span>
              </button>
              <button
                type="button"
                data-testid="toolbar-btn-reorder-back"
                role="menuitem"
                aria-label={i18n.toolbar.sendToBack}
                onClick={() => handleReorder('back')}
                className="w-full flex items-center space-x-2 px-2 py-1.5 text-[12px] text-left text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] transition duration-[var(--transition-fast)]"
              >
                <Icon icon={ArrowDownToLine} size={14} label={i18n.toolbar.sendToBack} />
                <span>{i18n.toolbar.sendToBack}</span>
              </button>
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          type="button"
          data-testid="toolbar-btn-delete"
          onClick={handleDelete}
          disabled={!hasSelection || isLocked}
          aria-label={i18n.toolbar.delete}
          title={i18n.toolbar.delete}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] disabled:opacity-40 disabled:pointer-events-none transition duration-[var(--transition-fast)]"
        >
          <Icon icon={Trash2} size={14} label={i18n.toolbar.delete} />
        </button>
      </div>
    </div>
  );
}

export default FloatingToolbar;
