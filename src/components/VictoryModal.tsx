import React, { useEffect } from 'react';
import { Award, RotateCw } from 'lucide-react';
import { formatDuration } from './ControlPanel';

interface VictoryModalProps {
  isOpen: boolean;
  width: number;
  height: number;
  elapsedSeconds: number;
  movesCount: number;
  hintsUsed: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  width,
  height,
  elapsedSeconds,
  movesCount,
  hintsUsed,
  isNewBest,
  onPlayAgain,
  onClose,
}) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-hairline bg-card p-6 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-accent/12 text-emerald-accent">
          <Award className="h-6 w-6" aria-hidden="true" />
        </div>

        <h2
          id="victory-title"
          className="mt-4 font-display text-2xl font-bold text-ink"
        >
          Case Solved
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          You deduced every tile on the {width}×{height} board.
        </p>

        {isNewBest && (
          <p className="mt-2 text-xs font-semibold text-emerald-accent">
            New personal best time for {width}×{height}
          </p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-3 rounded-lg border border-hairline bg-paper p-3.5">
          <div>
            <span className="block text-xs text-ink-muted">Time</span>
            <span className="mt-0.5 block font-mono text-base font-semibold text-ink tabular-nums">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>
          <div>
            <span className="block text-xs text-ink-muted">Moves</span>
            <span className="mt-0.5 block font-mono text-base font-semibold text-ink tabular-nums">
              {movesCount}
            </span>
          </div>
          <div>
            <span className="block text-xs text-ink-muted">Hints</span>
            <span className="mt-0.5 block font-mono text-base font-semibold text-ink tabular-nums">
              {hintsUsed}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline bg-paper px-4 py-2 text-sm font-medium text-ink hover:bg-parchment"
          >
            Inspect Board
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-ink/85"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
