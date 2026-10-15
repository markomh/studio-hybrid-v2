import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { t } from '../i18n';
import '../index.css';
import {
  Button,
  IconButton,
  Icon,
  Tooltip,
  Select,
  Tabs,
  Accordion,
  Slider,
  Switch,
  Dialog,
  Menu,
  Badge,
  Kbd,
} from '../ui';
import {
  Plus,
  Trash2,
  Settings,
  Download,
  Eye,
  Undo2,
  Redo2,
  Type,
  Layers,
  FileText,
  Puzzle,
  ChevronRight,
  Sun,
  Moon,
  ZoomIn,
} from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[var(--text-xl)] font-semibold text-[var(--color-text)] mb-4 pb-2 border-b border-[var(--color-border)]">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[var(--text-sm)] text-[var(--color-text-muted)] w-28 shrink-0">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function UIKitPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [switchVal, setSwitchVal] = useState(false);
  const [selectVal, setSelectVal] = useState('sans');
  const [sliderVal, setSliderVal] = useState([50]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)] p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-text)]">
          {t('uiKit.title')}
        </h1>
        <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
          Halaman ini hanya tersedia di mode pengembangan.
        </p>
      </header>

      {/* ─── Buttons ─── */}
      <Section title={t('uiKit.buttons')}>
        <Row label="Primary">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Row>
        <Row label="Secondary">
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="secondary" size="md">Medium</Button>
          <Button variant="secondary" size="lg">Large</Button>
        </Row>
        <Row label="Ghost">
          <Button variant="ghost" size="sm">Small</Button>
          <Button variant="ghost" size="md">Medium</Button>
          <Button variant="ghost" size="lg">Large</Button>
        </Row>
        <Row label="Danger">
          <Button variant="danger" size="sm">Hapus</Button>
          <Button variant="danger" size="md">Hapus Item</Button>
        </Row>
        <Row label="With Icon">
          <Button variant="primary" size="md">
            <Icon icon={Plus} size={14} /> {t('addText')}
          </Button>
          <Button variant="secondary" size="md">
            <Icon icon={Download} size={14} /> {t('header.export')}
          </Button>
        </Row>
      </Section>

      {/* ─── Icon Buttons ─── */}
      <Section title={t('uiKit.icons')}>
        <Row label="Ghost">
          <IconButton icon={Settings} label="Settings" />
          <IconButton icon={Undo2} label="Undo" />
          <IconButton icon={Redo2} label="Redo" />
          <IconButton icon={Plus} label="Add" />
          <IconButton icon={Trash2} label="Delete" />
          <IconButton icon={Eye} label="View" />
        </Row>
        <Row label="Secondary">
          <IconButton icon={Settings} label="Settings" variant="secondary" />
          <IconButton icon={ZoomIn} label="Zoom In" variant="secondary" />
        </Row>
        <Row label="Primary">
          <IconButton icon={Plus} label="Add" variant="primary" />
          <IconButton icon={Download} label="Export" variant="primary" />
        </Row>
        <Row label="Sizes">
          <IconButton icon={Settings} label="SM" size="sm" />
          <IconButton icon={Settings} label="MD" size="md" />
          <IconButton icon={Settings} label="LG" size="lg" />
        </Row>
        <Row label="Standalone Icons">
          <Icon icon={Type} size={14} />
          <Icon icon={Layers} size={16} />
          <Icon icon={FileText} size={18} />
          <Icon icon={Puzzle} size={20} />
          <Icon icon={Sun} size={24} />
          <Icon icon={Moon} size={16} label="Toggle theme" />
        </Row>
      </Section>

      {/* ─── Form Controls ─── */}
      <Section title={t('uiKit.formControls')}>
        <Row label="Select">
          <Select
            options={[
              { value: 'sans', label: 'Liberation Sans' },
              { value: 'serif', label: 'Liberation Serif' },
              { value: 'mono', label: 'Liberation Mono' },
              { value: 'comic', label: 'Comic Neue' },
            ]}
            value={selectVal}
            onChange={setSelectVal}
            label="Font Family"
          />
        </Row>
        <Row label="Slider">
          <div className="w-48">
            <Slider
              value={sliderVal}
              onChange={setSliderVal}
              min={0}
              max={100}
              step={1}
              label="Zoom"
            />
          </div>
          <span className="text-[var(--text-sm)] text-[var(--color-text-muted)]">{sliderVal[0]}%</span>
        </Row>
        <Row label="Switch">
          <Switch
            checked={switchVal}
            onChange={setSwitchVal}
            label="Guides"
          />
          <span className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
            {switchVal ? 'ON' : 'OFF'}
          </span>
        </Row>
        <Row label="Switch disabled">
          <Switch checked={true} label="Locked" disabled />
        </Row>
      </Section>

      {/* ─── Feedback ─── */}
      <Section title={t('uiKit.feedback')}>
        <Row label="Badge">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </Row>
        <Row label="Kbd">
          <Kbd>⌘</Kbd>
          <Kbd>Z</Kbd>
          <Kbd>Tab</Kbd>
          <Kbd>Ctrl+S</Kbd>
          <Kbd>Esc</Kbd>
        </Row>
        <Row label="Tooltip">
          <Tooltip content="Ini tooltip atas" side="top">
            <Button variant="secondary" size="sm">Hover me (top)</Button>
          </Tooltip>
          <Tooltip content="Ini tooltip kanan" side="right">
            <Button variant="secondary" size="sm">Hover me (right)</Button>
          </Tooltip>
        </Row>
      </Section>

      {/* ─── Overlays ─── */}
      <Section title={t('uiKit.overlays')}>
        <Row label="Dialog">
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Buka Dialog
          </Button>
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Konfirmasi Hapus"
            description="Apakah Anda yakin ingin menghapus halaman ini? Tindakan ini tidak dapat dibatalkan."
          >
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button variant="danger" onClick={() => setDialogOpen(false)}>Hapus</Button>
            </div>
          </Dialog>
        </Row>
        <Row label="Menu">
          <Menu
            trigger={<Button variant="secondary"><Icon icon={ChevronRight} size={14} /> Menu</Button>}
            items={[
              { label: 'Dokumen Baru', shortcut: 'Ctrl+N' },
              { label: 'Buka...', shortcut: 'Ctrl+O' },
              { label: 'Simpan', shortcut: 'Ctrl+S' },
              { label: 'Ekspor PDF', shortcut: 'Ctrl+E' },
              { label: 'Hapus', disabled: true },
            ]}
            label="File menu"
          />
        </Row>
      </Section>

      {/* ─── Navigation ─── */}
      <Section title={t('uiKit.navigation')}>
        <Row label="Tabs">
          <div className="w-full border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
            <Tabs
              items={[
                { value: 'elements', label: 'Elemen', content: <p className="text-[var(--text-sm)]">Konten tab Elemen</p> },
                { value: 'pages', label: 'Halaman', content: <p className="text-[var(--text-sm)]">Konten tab Halaman</p> },
                { value: 'frame', label: 'Bingkai', content: <p className="text-[var(--text-sm)]">Konten tab Bingkai</p> },
              ]}
            />
          </div>
        </Row>
        <Row label="Accordion">
          <div className="w-full border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
            <Accordion
              items={[
                { value: 'setup', title: 'Format & Page Setup', content: 'Ukuran potong: 152.4 × 228.6 mm' },
                { value: 'context', title: 'Konteks Lembar', content: 'Body — Nomor Lembar: 3' },
                { value: 'frame', title: 'Bingkai Lembar', content: 'Tanpa bingkai (Polos)' },
              ]}
              defaultValue={['setup']}
            />
          </div>
        </Row>
      </Section>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<UIKitPage />);
}
