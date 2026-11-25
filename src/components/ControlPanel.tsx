import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Redo2,
  RotateCcw,
  Undo2,
  X,
} from 'lucide-react';
import { CheckResult, LogicStepHint } from '../types/sherlock';

interface ControlPanelProps {
  width: number;
  height: number;
  solvedCount: number;
  totalCells: number;
  movesCount: number;
  elapsedSeconds: number;
  bestTimeSeconds?: number;
  canUndo: boolean;
  canRedo: boolean;
  isGameFinished: boolean;
  isBoardFilledWithErrors: boolean;
  mistakeCount: number;
  activeHint: LogicStepHint | null;
  checkResult: CheckResult | null;
  onUndo: () => void;
  onRedo: () => void;
  onUndoUntilCorrect: () => void;
  onResetBoard: () => void;
  onApplyHint: () => void;
  onDismissHint: () => void;
  onDismissCheck: () => void;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  width,
  height,
  solvedCount,
  totalCells,
  movesCount,
  elapsedSeconds,
  bestTimeSeconds,
  canUndo,
  canRedo,
  isGameFinished,
  isBoardFilledWithErrors,
  mistakeCount,
  activeHint,
  checkResult,
  onUndo,
  onRedo,
  onUndoUntilCorrect,
  onResetBoard,
  onApplyHint,
  onDismissHint,
  onDismissCheck,
}) => {
  return (
    <section
      aria-label="Deduction controls"
      className="flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4 shadow-xs"
    >
      {/* Clean unboxed telemetry strip */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-muted">
        <span className="font-mono font-medium text-ink tabular-nums">
          {width}×{height} Grid
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">
          {solvedCount}/{totalCells} Solved
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{movesCount} Moves</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono font-medium text-ink tabular-nums">
          {formatDuration(elapsedSeconds)}
        </span>
        {bestTimeSeconds !== undefined && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Best {formatDuration(bestTimeSeconds)}
            </span>
          </>
        )}
      </div>

      {/* Primary move controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo || isGameFinished}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-hairline bg-paper px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-40 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ink"
        >
          <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Undo</span>
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo || isGameFinished}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-hairline bg-paper px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-40 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ink"
        >
          <Redo2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Redo</span>
        </button>

        <button
          type="button"
          onClick={onResetBoard}
          disabled={!canUndo && !isBoardFilledWithErrors}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-hairline bg-paper px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-40 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Completed-with-mistakes alert */}
      {isBoardFilledWithErrors && (
        <div
          role="status"
          className="flex flex-col gap-2.5 rounded-lg border border-vermilion/40 bg-vermilion/8 p-3 text-xs text-ink"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-vermilion" aria-hidden="true" />
            <p className="leading-relaxed">
              All cells are filled, but{' '}
              <span className="font-semibold tabular-nums">
                {mistakeCount} {mistakeCount === 1 ? 'cell has' : 'cells have'}
              </span>{' '}
              a mistake. Revert to your last error-free state to fix the contradiction.
            </p>
          </div>
          {canUndo && (
            <div>
              <button
                type="button"
                onClick={onUndoUntilCorrect}
                className="inline-flex items-center gap-1.5 rounded-md bg-vermilion px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Undo until correct</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Logic Hint Coach */}
      {activeHint && (
        <div
          role="status"
          className={`flex flex-col gap-2.5 rounded-lg border p-3 text-xs ${
            activeHint.actionType === 'error'
              ? 'border-vermilion/40 bg-vermilion/8'
              : 'border-emerald-accent/40 bg-emerald-accent/8'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              {activeHint.actionType === 'error' ? (
                <AlertCircle className="h-4 w-4 text-vermilion" aria-hidden="true" />
              ) : (
                <Lightbulb className="h-4 w-4 text-emerald-accent" aria-hidden="true" />
              )}
              <span>
                {activeHint.actionType === 'error'
                  ? 'Contradiction Found'
                  : activeHint.actionType === 'select'
                    ? 'Logic Hint · Place Tile'
                    : 'Logic Hint · Eliminate Option'}
              </span>
            </div>
            <button
              type="button"
              onClick={onDismissHint}
              aria-label="Dismiss hint"
              className="rounded p-0.5 text-ink-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="leading-relaxed text-ink">{activeHint.explanation}</p>
          {activeHint.actionType === 'error' ? (
            <div className="flex items-center gap-2">
              {canUndo && (
                <button
                  type="button"
                  onClick={onUndoUntilCorrect}
                  className="inline-flex items-center gap-1.5 rounded-md bg-vermilion px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Undo until correct</span>
                </button>
              )}
              <button
                type="button"
                onClick={onDismissHint}
                className="rounded-md border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onApplyHint}
                className="rounded-md bg-emerald-accent px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Apply Step
              </button>
              <button
                type="button"
                onClick={onDismissHint}
                className="rounded-md border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Check Board Feedback */}
      {checkResult && (
        <div
          role="status"
          className={`flex flex-col gap-2.5 rounded-lg border p-3 text-xs ${
            checkResult.hasErrors
              ? 'border-vermilion/40 bg-vermilion/8'
              : 'border-emerald-accent/40 bg-emerald-accent/8'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {checkResult.hasErrors ? (
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-vermilion"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-accent"
                  aria-hidden="true"
                />
              )}
              <p className="leading-relaxed text-ink">{checkResult.message}</p>
            </div>
            <button
              type="button"
              onClick={onDismissCheck}
              aria-label="Dismiss check result"
              className="rounded p-0.5 text-ink-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {checkResult.hasErrors && canUndo && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUndoUntilCorrect}
                className="inline-flex items-center gap-1.5 rounded-md bg-vermilion px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Undo until correct</span>
              </button>
              <button
                type="button"
                onClick={onDismissCheck}
                className="rounded-md border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
