import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ClueTileBox } from './CluePanels';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
    >
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-hairline bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <h2 id="rules-title" className="font-display text-xl font-bold text-ink">
            How to Play Sherlock
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close rules"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-parchment hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-6 text-sm leading-relaxed text-ink">
          <div>
            <h3 className="font-semibold text-ink">Goal & Controls</h3>
            <p className="mt-1 text-ink-muted">
              Every row represents a theme (People, Houses, Numbers, Signs, Pets,
              Flags). Each column contains a unique item from every row—no item
              appears twice in the same row.
            </p>
            <ul className="mt-2.5 list-disc space-y-1 pl-5 text-ink-muted">
              <li>
                <strong className="text-ink">Click</strong> (or right-click) a
                mini option in a cell to eliminate it.
              </li>
              <li>
                <strong className="text-ink">Double-click</strong> a mini option
                to select it and remove all other options in that cell.
              </li>
              <li>
                <strong className="text-ink">Click</strong> any clue card
                to keep its referenced items highlighted on the grid until you
                select another clue.
              </li>
              <li>
                <strong className="text-ink">Double-click</strong> any clue card
                to hide it once you have finished using it.
              </li>
            </ul>
          </div>

          <div className="border-t border-hairline pt-4">
            <h3 className="mb-3 font-semibold text-ink">Horizontal Clues (Right Panel)</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-lg border border-hairline bg-paper/60 p-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <ClueTileBox tile={{ row: 4, item: 0 }} size={28} />
                  <ClueTileBox tile={{ row: 5, item: 1 }} size={28} />
                  <ClueTileBox tile={{ row: 4, item: 0 }} size={28} />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Next-To:</strong> The Cat and
                  Japanese Flag are in immediately adjacent columns (left or right).
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-hairline bg-paper/60 p-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <ClueTileBox tile={{ row: 1, item: 0 }} size={28} />
                  <div className="flex h-[38px] w-[30px] items-center justify-center gap-0.5 rounded-md border border-dashed border-hairline bg-card">
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-ink" />
                  </div>
                  <ClueTileBox tile={{ row: 3, item: 0 }} size={28} />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Left-Of:</strong> The Green House
                  is somewhere to the left of the Stop Sign (not necessarily next
                  to it).
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-hairline bg-paper/60 p-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <ClueTileBox tile={{ row: 0, item: 0 }} size={28} arrow="left" />
                  <ClueTileBox tile={{ row: 2, item: 4 }} size={28} />
                  <ClueTileBox tile={{ row: 5, item: 0 }} size={28} arrow="right" />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Is-Between:</strong> The 3 items
                  are in 3 consecutive columns with House #5 in the middle (the
                  outer 2 may swap sides).
                </p>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-hairline bg-paper/60 p-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <ClueTileBox tile={{ row: 0, item: 0 }} size={28} arrow="left" />
                  <ClueTileBox tile={{ row: 2, item: 4 }} size={28} isNot />
                  <ClueTileBox tile={{ row: 5, item: 0 }} size={28} arrow="right" />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Is-Not-Between:</strong> The outer
                  two items are 2 columns apart (in either order), and the
                  slashed middle item is NOT in the column between them.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-hairline pt-4">
            <h3 className="mb-3 font-semibold text-ink">Vertical Clues (Bottom Panel)</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-hairline bg-paper/60 p-3 text-center">
                <div className="flex flex-col gap-1">
                  <ClueTileBox tile={{ row: 5, item: 0 }} size={26} />
                  <ClueTileBox tile={{ row: 2, item: 4 }} size={26} />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Same Column:</strong> All stacked
                  items share the same column.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-lg border border-hairline bg-paper/60 p-3 text-center">
                <div className="flex flex-col gap-1">
                  <ClueTileBox tile={{ row: 1, item: 0 }} size={26} />
                  <ClueTileBox tile={{ row: 0, item: 0 }} size={26} isNot />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Not Same Column:</strong> The
                  slashed item cannot share a column with the others.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-lg border border-hairline bg-paper/60 p-3 text-center">
                <div className="flex flex-col gap-1">
                  <ClueTileBox tile={{ row: 0, item: 1 }} size={26} />
                  <ClueTileBox tile={{ row: 1, item: 2 }} size={26} orTag />
                  <ClueTileBox tile={{ row: 4, item: 1 }} size={26} orTag />
                </div>
                <p className="text-xs text-ink-muted">
                  <strong className="text-ink">Either-Or:</strong> Top item is in
                  the same column as either the 2nd OR 3rd item (not both).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-hairline pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-ink/85"
          >
            Back to Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};
