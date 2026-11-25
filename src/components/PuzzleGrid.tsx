import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Undo2, X } from 'lucide-react';
import { ROW_THEMES, getTileName, getTileShortLabel } from '../data/themes';
import { BoardState, LogicStepHint, TileRef } from '../types/sherlock';
import { TileIcon } from './TileIcon';

interface PuzzleGridProps {
  board: BoardState;
  width: number;
  height: number;
  highlightedTiles: TileRef[];
  activeHint: LogicStepHint | null;
  errorCells: { row: number; col: number }[];
  canUndo: boolean;
  onUndo: () => void;
  onEliminateCandidate: (row: number, col: number, item: number) => void;
  onSelectCandidate: (row: number, col: number, item: number) => void;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  board,
  width,
  height,
  highlightedTiles,
  activeHint,
  errorCells,
  canUndo,
  onUndo,
  onEliminateCandidate,
  onSelectCandidate,
}) => {
  const clickTimerRef = useRef<{ key: string; timer: number } | null>(null);
  const [mobileCell, setMobileCell] = useState<{ row: number; col: number } | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current.timer);
      }
    };
  }, []);

  // Automatically close the mobile popup if the cell gets solved or board resets
  useEffect(() => {
    if (!mobileCell) return;
    const cell = board[mobileCell.row]?.[mobileCell.col];
    if (!cell || cell.solved) {
      setMobileCell(null);
    }
  }, [board, mobileCell]);

  // Close mobile popup on Escape
  useEffect(() => {
    if (!mobileCell) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileCell(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileCell]);

  const handleCandidateClick = (row: number, col: number, item: number) => {
    const key = `${row}-${col}-${item}`;

    if (clickTimerRef.current && clickTimerRef.current.key === key) {
      window.clearTimeout(clickTimerRef.current.timer);
      clickTimerRef.current = null;
      onSelectCandidate(row, col, item);
      return;
    }

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current.timer);
      clickTimerRef.current = null;
    }

    const timer = window.setTimeout(() => {
      clickTimerRef.current = null;
      onEliminateCandidate(row, col, item);
    }, 200);

    clickTimerRef.current = { key, timer };
  };

  const handleCandidateContextMenu = (
    e: React.MouseEvent,
    row: number,
    col: number,
    item: number
  ) => {
    e.preventDefault();
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current.timer);
      clickTimerRef.current = null;
    }
    onEliminateCandidate(row, col, item);
  };

  const candidateCols = width <= 4 ? 2 : 3;
  const candidateRows = Math.ceil(width / candidateCols);
  const desktopCellSize =
    width <= 5
      ? 'sm:w-[88px] sm:h-[88px]'
      : width <= 7
        ? 'sm:w-[80px] sm:h-[80px]'
        : 'sm:w-[74px] sm:h-[74px]';

  const isTileHighlighted = (row: number, item: number) =>
    highlightedTiles.some((t) => t.row === row && t.item === item);

  const isErrorCell = (row: number, col: number) =>
    errorCells.some((e) => e.row === row && e.col === col);

  const isHintTargetCell = (row: number, col: number) =>
    activeHint?.targetCells.some((c) => c.row === row && c.col === col) ?? false;

  const activeMobileCellData = mobileCell
    ? board[mobileCell.row]?.[mobileCell.col]
    : undefined;

  return (
    <section
      aria-label="Sherlock puzzle grid"
      className="rounded-xl border border-hairline bg-card p-2 sm:p-4 shadow-xs"
    >
      <div
        className="grid w-full gap-1 sm:w-fit sm:mx-auto select-none"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: height }, (_, rowIdx) =>
          Array.from({ length: width }, (_, colIdx) => {
            const cell = board[rowIdx]?.[colIdx];
            const hasError = isErrorCell(rowIdx, colIdx);
            const isHintCell = isHintTargetCell(rowIdx, colIdx);

            const borderClass = hasError
              ? 'border-vermilion bg-vermilion/8 ring-2 ring-vermilion/40'
              : isHintCell
                ? 'border-emerald-accent bg-emerald-accent/8 ring-2 ring-emerald-accent/40'
                : cell?.solved && cell.isGiven
                  ? 'border-hairline bg-parchment/70'
                  : 'border-hairline bg-card';

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`relative aspect-square w-full overflow-hidden rounded-lg border transition-colors duration-150 ${desktopCellSize} ${borderClass}`}
              >
                {hasError && (
                  <span
                    title="Mistake in this cell"
                    className="pointer-events-none absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10 text-vermilion"
                  >
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  </span>
                )}

                {cell?.solved ? (
                  <div
                    title={`${getTileName({ row: rowIdx, item: cell.item })}${
                      cell.isGiven ? ' (Starter tile)' : ''
                    } — ${ROW_THEMES[rowIdx]?.title ?? `Row ${rowIdx + 1}`}, Col ${colIdx + 1}`}
                    className={`flex h-full w-full items-center justify-center rounded-lg p-0.5 transition-transform duration-150 ${
                      isTileHighlighted(rowIdx, cell.item)
                        ? 'ring-2 ring-inset ring-amber-spotlight bg-amber-spotlight/10'
                        : ''
                    }`}
                  >
                    <TileIcon
                      row={rowIdx}
                      item={cell.item}
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <>
                    {/* Mobile tap overlay to open the magnified cell popup */}
                    <button
                      type="button"
                      onClick={() => setMobileCell({ row: rowIdx, col: colIdx })}
                      aria-label={`Open options for ${
                        ROW_THEMES[rowIdx]?.title ?? `Row ${rowIdx + 1}`
                      } Column ${colIdx + 1}`}
                      className="absolute inset-0 z-10 sm:hidden focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ink"
                    />

                    <div
                      className="grid h-full w-full gap-0.5 p-0.5 sm:p-1"
                      style={{
                        gridTemplateColumns: `repeat(${candidateCols}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${candidateRows}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({ length: width }, (_, itemIdx) => {
                        const isPossible = cell?.candidates[itemIdx] ?? false;
                        const isSpotlit =
                          isPossible && isTileHighlighted(rowIdx, itemIdx);
                        const isHintItem =
                          isPossible &&
                          activeHint?.targetRow === rowIdx &&
                          activeHint?.targetCol === colIdx &&
                          activeHint?.targetItem === itemIdx;

                        if (!isPossible) {
                          return <span key={itemIdx} aria-hidden="true" />;
                        }

                        return (
                          <button
                            key={itemIdx}
                            type="button"
                            onClick={() =>
                              handleCandidateClick(rowIdx, colIdx, itemIdx)
                            }
                            onContextMenu={(e) =>
                              handleCandidateContextMenu(
                                e,
                                rowIdx,
                                colIdx,
                                itemIdx
                              )
                            }
                            title={`${getTileName({
                              row: rowIdx,
                              item: itemIdx,
                            })} — Click to remove · Double-click to select`}
                            aria-label={`${getTileName({
                              row: rowIdx,
                              item: itemIdx,
                            })} in row ${rowIdx + 1} column ${colIdx + 1}`}
                            className={`flex h-full w-full items-center justify-center rounded p-0.5 transition-transform duration-150 hover:scale-115 hover:bg-parchment focus-visible:outline-2 focus-visible:outline-ink ${
                              isHintItem
                                ? activeHint?.actionType === 'select'
                                  ? 'ring-2 ring-emerald-accent bg-emerald-accent/15'
                                  : 'ring-2 ring-vermilion bg-vermilion/15'
                                : isSpotlit
                                  ? 'ring-2 ring-amber-spotlight bg-amber-spotlight/15'
                                  : ''
                            }`}
                          >
                            <TileIcon
                              row={rowIdx}
                              item={itemIdx}
                              className="h-full w-full"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="mt-1.5 text-center text-[11px] text-ink-muted sm:hidden">
        Tap a cell to eliminate or select options
      </p>
      <p className="mt-2.5 hidden text-center text-xs text-ink-muted sm:block">
        Click an option to eliminate it · Double-click (or single-option remaining) to place it
      </p>

      {/* Mobile Cell Deduction Popup */}
      {mobileCell && activeMobileCellData && !activeMobileCellData.solved && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px] sm:hidden"
          onClick={() => setMobileCell(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-cell-title"
        >
          <div
            className="w-full max-w-sm rounded-xl border border-hairline bg-card p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <div>
                <h2
                  id="mobile-cell-title"
                  className="font-display text-lg font-bold text-ink"
                >
                  {ROW_THEMES[mobileCell.row]?.title ?? `Row ${mobileCell.row + 1}`} · Col{' '}
                  {mobileCell.col + 1}
                </h2>
                <p className="text-xs text-ink-muted">
                  Tap an icon to eliminate it, or tap Select to place it
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileCell(null)}
                aria-label="Close cell options"
                className="rounded-lg p-1.5 text-ink-muted hover:bg-parchment hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className="mt-3.5 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${candidateCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${candidateRows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: width }, (_, itemIdx) => {
                const isPossible = activeMobileCellData.candidates[itemIdx];
                if (!isPossible) {
                  return (
                    <div
                      key={itemIdx}
                      aria-hidden="true"
                      className="rounded-lg border border-dashed border-hairline/45 bg-paper/20"
                    />
                  );
                }

                const isSpotlit = isTileHighlighted(mobileCell.row, itemIdx);
                const isHintItem =
                  activeHint?.targetRow === mobileCell.row &&
                  activeHint?.targetCol === mobileCell.col &&
                  activeHint?.targetItem === itemIdx;

                return (
                  <div
                    key={itemIdx}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 ${
                      isHintItem
                        ? activeHint?.actionType === 'select'
                          ? 'border-emerald-accent bg-emerald-accent/10'
                          : 'border-vermilion bg-vermilion/10'
                        : isSpotlit
                          ? 'border-amber-spotlight bg-amber-spotlight/10'
                          : 'border-hairline bg-paper/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onEliminateCandidate(mobileCell.row, mobileCell.col, itemIdx)
                      }
                      aria-label={`Eliminate ${getTileName({
                        row: mobileCell.row,
                        item: itemIdx,
                      })}`}
                      className="flex h-14 w-14 items-center justify-center rounded-lg bg-card p-1 border border-hairline active:scale-95 transition-transform"
                    >
                      <TileIcon
                        row={mobileCell.row}
                        item={itemIdx}
                        size={46}
                      />
                    </button>
                    <span className="max-w-full truncate text-[11px] font-medium text-ink">
                      {getTileShortLabel({ row: mobileCell.row, item: itemIdx })}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSelectCandidate(mobileCell.row, mobileCell.col, itemIdx)
                      }
                      className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-ink px-2 py-1.5 text-[11px] font-semibold text-paper active:opacity-85"
                    >
                      <Check className="h-3 w-3" aria-hidden="true" />
                      <span>Select</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40"
              >
                <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileCell(null)}
                className="rounded-lg bg-ink px-4 py-1.5 text-xs font-semibold text-paper"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
