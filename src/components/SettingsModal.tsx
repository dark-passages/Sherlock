import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { GameSettings } from '../types/sherlock';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onClose: () => void;
  onApplySettings: (next: GameSettings, startNewPuzzle: boolean) => void;
}

const WIDTH_OPTIONS = [3, 4, 5, 6, 7, 8, 9];
const HEIGHT_OPTIONS = [3, 4, 5, 6];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onApplySettings,
}) => {
  const [draft, setDraft] = useState<GameSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dimensionsChanged =
    draft.width !== settings.width || draft.height !== settings.height;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-hairline bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <h2 id="settings-title" className="font-display text-xl font-bold text-ink">
            Puzzle Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-parchment hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Grid Width */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">
                Grid Width (Columns)
              </label>
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                {draft.width} columns (max 9)
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {WIDTH_OPTIONS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, width: w }))}
                  className={`rounded-lg border py-2 font-mono text-sm font-semibold tabular-nums transition-colors ${
                    draft.width === w
                      ? 'border-ink bg-ink text-paper'
                      : 'border-hairline bg-paper text-ink hover:bg-parchment'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Height */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">
                Grid Height (Rows)
              </label>
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                {draft.height} themes (max 6)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {HEIGHT_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, height: h }))}
                  className={`rounded-lg border py-2 font-mono text-sm font-semibold tabular-nums transition-colors ${
                    draft.height === h
                      ? 'border-ink bg-ink text-paper'
                      : 'border-hairline bg-paper text-ink hover:bg-parchment'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 border-t border-hairline pt-4">
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <span className="block text-sm font-semibold text-ink">
                  Auto-cascade row deductions
                </span>
                <span className="block text-xs text-ink-muted">
                  Placing a tile removes it from other cells in that row automatically.
                </span>
              </div>
              <input
                type="checkbox"
                checked={draft.autoCascade}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, autoCascade: e.target.checked }))
                }
                className="mt-1 h-4 w-4 accent-emerald-accent"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <span className="block text-sm font-semibold text-ink">
                  Sound effects
                </span>
                <span className="block text-xs text-ink-muted">
                  Subtle audio cues for eliminations, placements, and victories.
                </span>
              </div>
              <input
                type="checkbox"
                checked={draft.soundEnabled}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, soundEnabled: e.target.checked }))
                }
                className="mt-1 h-4 w-4 accent-emerald-accent"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-hairline pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-paper px-4 py-2 text-sm font-medium text-ink hover:bg-parchment"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApplySettings(draft, dimensionsChanged)}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink/85"
          >
            {dimensionsChanged
              ? `Generate ${draft.width}×${draft.height} Puzzle`
              : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
