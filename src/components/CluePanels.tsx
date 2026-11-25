import React from 'react';
import { Eye } from 'lucide-react';
import { getTileName } from '../data/themes';
import { HorizontalClue, TileRef, VerticalClue } from '../types/sherlock';
import { TileIcon } from './TileIcon';

export const NotOverlay: React.FC = () => (
  <svg
    viewBox="0 0 44 44"
    className="pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  >
    <circle
      cx="22"
      cy="22"
      r="16"
      fill="none"
      stroke="#C84B31"
      strokeWidth="3.5"
    />
    <line
      x1="10.5"
      y1="33.5"
      x2="33.5"
      y2="10.5"
      stroke="#C84B31"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ClueTileBox: React.FC<{
  tile: TileRef;
  size?: number;
  isNot?: boolean;
  arrow?: 'left' | 'right';
  orTag?: boolean;
}> = ({ tile, size = 36, isNot = false, arrow, orTag = false }) => {
  return (
    <div
      title={getTileName(tile)}
      className="relative flex items-center justify-center rounded-md border border-hairline bg-paper/75 p-1"
      style={{ width: size + 10, height: size + 10 }}
    >
      <TileIcon row={tile.row} item={tile.item} size={size} />
      {isNot && <NotOverlay />}
      {arrow === 'left' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 rounded bg-card px-0.5 text-[10px] font-bold leading-none text-ink border border-hairline"
        >
          ↔
        </span>
      )}
      {arrow === 'right' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 rounded bg-card px-0.5 text-[10px] font-bold leading-none text-ink border border-hairline"
        >
          ↔
        </span>
      )}
      {orTag && (
        <span className="pointer-events-none absolute -bottom-1 -right-1 rounded bg-ink px-1 py-0.5 text-[9px] font-bold leading-none text-paper">
          OR
        </span>
      )}
    </div>
  );
};

export function getHorizontalClueTiles(clue: HorizontalClue): TileRef[] {
  switch (clue.kind) {
    case 'next_to':
      return [clue.a, clue.b];
    case 'left_of':
      return [clue.left, clue.right];
    case 'between':
      return [clue.left, clue.middle, clue.right];
    case 'not_between':
      return [clue.left, clue.notMiddle, clue.right];
  }
}

export function getVerticalClueTiles(clue: VerticalClue): TileRef[] {
  switch (clue.kind) {
    case 'same_col':
    case 'not_same_col':
      return clue.tiles;
    case 'same_or':
      return [clue.top, clue.optionA, clue.optionB];
  }
}

function describeHorizontalClue(clue: HorizontalClue): string {
  switch (clue.kind) {
    case 'next_to':
      return `${getTileName(clue.a)} is immediately next to ${getTileName(clue.b)} (left or right). Double-click to hide.`;
    case 'left_of':
      return `${getTileName(clue.left)} is somewhere to the left of ${getTileName(clue.right)}. Double-click to hide.`;
    case 'between':
      return `${getTileName(clue.middle)} is directly between ${getTileName(clue.left)} and ${getTileName(clue.right)}. Double-click to hide.`;
    case 'not_between':
      return `${getTileName(clue.left)} and ${getTileName(clue.right)} are 2 columns apart, and ${getTileName(clue.notMiddle)} is NOT between them. Double-click to hide.`;
  }
}

function describeVerticalClue(clue: VerticalClue): string {
  switch (clue.kind) {
    case 'same_col':
      return `Same column: ${clue.tiles.map(getTileName).join(', ')}. Double-click to hide.`;
    case 'not_same_col': {
      const notT = clue.tiles[clue.notIndex];
      const others = clue.tiles.filter((_, i) => i !== clue.notIndex);
      return `${getTileName(notT)} is NOT in the same column as ${others
        .map(getTileName)
        .join(' & ')}. Double-click to hide.`;
    }
    case 'same_or':
      return `${getTileName(clue.top)} is in the same column as either ${getTileName(
        clue.optionA
      )} OR ${getTileName(clue.optionB)}. Double-click to hide.`;
  }
}

interface HorizontalCluesPanelProps {
  clues: HorizontalClue[];
  hiddenIds: Set<string>;
  selectedClueId?: string;
  activeHintClueId?: string;
  onSelectClue: (id: string, tiles: TileRef[]) => void;
  onHideClue: (id: string) => void;
  onRestoreAll: () => void;
}

export const HorizontalCluesPanel: React.FC<HorizontalCluesPanelProps> = ({
  clues,
  hiddenIds,
  selectedClueId,
  activeHintClueId,
  onSelectClue,
  onHideClue,
  onRestoreAll,
}) => {
  const visibleClues = clues.filter((c) => !hiddenIds.has(c.id));
  const hiddenCount = clues.length - visibleClues.length;

  return (
    <section
      aria-label="Horizontal clues"
      className="flex flex-col rounded-xl border border-hairline bg-card p-3 sm:p-4 shadow-xs"
    >
      <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-hairline pb-2">
        <div>
          <h2 className="text-sm font-semibold text-ink">Horizontal Clues</h2>
          <p className="text-xs text-ink-muted">
            {visibleClues.length} visible · Tap to highlight · Double-click to hide
          </p>
        </div>
        <button
          type="button"
          onClick={onRestoreAll}
          disabled={hiddenCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-40 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-ink"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Unhide All{hiddenCount > 0 ? ` (${hiddenCount})` : ''}</span>
        </button>
      </div>

      {visibleClues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline bg-paper/60 px-4 py-5 sm:py-8 text-center">
          <p className="text-xs text-ink-muted">
            {clues.length === 0
              ? 'No horizontal clues needed for this puzzle.'
              : 'All horizontal clues are hidden.'}
          </p>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={onRestoreAll}
              className="mt-2 text-xs font-semibold text-emerald-accent hover:underline"
            >
              Restore {hiddenCount} hidden {hiddenCount === 1 ? 'clue' : 'clues'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-1 xl:grid-cols-2 max-h-[210px] sm:max-h-[280px] lg:max-h-[520px] overflow-y-auto pr-0.5">
          {visibleClues.map((clue) => {
            const isHintTarget = clue.id === activeHintClueId;
            const isSelected = clue.id === selectedClueId;
            const clueTiles = getHorizontalClueTiles(clue);
            return (
              <div
                key={clue.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectClue(clue.id, clueTiles)}
                onDoubleClick={() => onHideClue(clue.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectClue(clue.id, clueTiles);
                  } else if (e.key === 'Delete' || e.key === 'Backspace') {
                    onHideClue(clue.id);
                  }
                }}
                title={describeHorizontalClue(clue)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border px-1.5 py-1.5 sm:px-2.5 sm:py-2 transition-colors duration-150 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ink ${
                  isHintTarget
                    ? 'border-emerald-accent bg-emerald-accent/10 ring-2 ring-emerald-accent/35'
                    : isSelected
                      ? 'border-amber-spotlight bg-amber-spotlight/10 ring-2 ring-amber-spotlight/40'
                      : 'border-hairline bg-paper/45 hover:bg-parchment/70'
                }`}
              >
                {clue.kind === 'next_to' && (
                  <>
                    <ClueTileBox tile={clue.a} size={28} />
                    <ClueTileBox tile={clue.b} size={28} />
                    <ClueTileBox tile={clue.a} size={28} />
                  </>
                )}

                {clue.kind === 'left_of' && (
                  <>
                    <ClueTileBox tile={clue.left} size={28} />
                    <div
                      aria-label="is left of"
                      className="flex h-[38px] w-[30px] sm:w-[34px] items-center justify-center gap-1 rounded-md border border-dashed border-hairline bg-card"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    </div>
                    <ClueTileBox tile={clue.right} size={28} />
                  </>
                )}

                {clue.kind === 'between' && (
                  <>
                    <ClueTileBox tile={clue.left} size={28} arrow="left" />
                    <ClueTileBox tile={clue.middle} size={28} />
                    <ClueTileBox tile={clue.right} size={28} arrow="right" />
                  </>
                )}

                {clue.kind === 'not_between' && (
                  <>
                    <ClueTileBox tile={clue.left} size={28} arrow="left" />
                    <ClueTileBox tile={clue.notMiddle} size={28} isNot />
                    <ClueTileBox tile={clue.right} size={28} arrow="right" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

interface VerticalCluesPanelProps {
  clues: VerticalClue[];
  hiddenIds: Set<string>;
  selectedClueId?: string;
  activeHintClueId?: string;
  onSelectClue: (id: string, tiles: TileRef[]) => void;
  onHideClue: (id: string) => void;
  onRestoreAll: () => void;
}

export const VerticalCluesPanel: React.FC<VerticalCluesPanelProps> = ({
  clues,
  hiddenIds,
  selectedClueId,
  activeHintClueId,
  onSelectClue,
  onHideClue,
  onRestoreAll,
}) => {
  const visibleClues = clues.filter((c) => !hiddenIds.has(c.id));
  const hiddenCount = clues.length - visibleClues.length;

  return (
    <section
      aria-label="Vertical clues"
      className="flex flex-col rounded-xl border border-hairline bg-card p-3 sm:p-4 shadow-xs"
    >
      {/* Mobile: placed below the clues so clues sit right under the board; Desktop: header at top */}
      <div className="order-2 mt-2.5 flex items-center justify-between gap-3 border-t border-hairline pt-2.5 lg:order-1 lg:mt-0 lg:mb-3 lg:border-t-0 lg:border-b lg:pt-0 lg:pb-2.5">
        <div>
          <h2 className="text-sm font-semibold text-ink">Vertical Clues</h2>
          <p className="text-xs text-ink-muted">
            {visibleClues.length} visible · Tap to highlight · Double-click to hide
          </p>
        </div>
        <button
          type="button"
          onClick={onRestoreAll}
          disabled={hiddenCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-40 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-ink"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Unhide All{hiddenCount > 0 ? ` (${hiddenCount})` : ''}</span>
        </button>
      </div>

      {visibleClues.length === 0 ? (
        <div className="order-1 lg:order-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline bg-paper/60 px-4 py-5 sm:py-8 text-center">
          <p className="text-xs text-ink-muted">
            {clues.length === 0
              ? 'No vertical clues needed for this puzzle.'
              : 'All vertical clues are hidden.'}
          </p>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={onRestoreAll}
              className="mt-2 text-xs font-semibold text-emerald-accent hover:underline"
            >
              Restore {hiddenCount} hidden {hiddenCount === 1 ? 'clue' : 'clues'}
            </button>
          )}
        </div>
      ) : (
        <div className="order-1 lg:order-2 flex flex-wrap gap-2 sm:gap-2.5">
          {visibleClues.map((clue) => {
            const isHintTarget = clue.id === activeHintClueId;
            const isSelected = clue.id === selectedClueId;
            const clueTiles = getVerticalClueTiles(clue);
            return (
              <div
                key={clue.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectClue(clue.id, clueTiles)}
                onDoubleClick={() => onHideClue(clue.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectClue(clue.id, clueTiles);
                  } else if (e.key === 'Delete' || e.key === 'Backspace') {
                    onHideClue(clue.id);
                  }
                }}
                title={describeVerticalClue(clue)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors duration-150 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ink ${
                  isHintTarget
                    ? 'border-emerald-accent bg-emerald-accent/10 ring-2 ring-emerald-accent/35'
                    : isSelected
                      ? 'border-amber-spotlight bg-amber-spotlight/10 ring-2 ring-amber-spotlight/40'
                      : 'border-hairline bg-paper/45 hover:bg-parchment/70'
                }`}
              >
                {clue.kind === 'same_col' && (
                  <>
                    {clue.tiles.map((t, idx) => (
                      <ClueTileBox key={idx} tile={t} size={32} />
                    ))}
                    {clue.tiles.length === 2 && (
                      <div className="h-[42px] w-[42px]" aria-hidden="true" />
                    )}
                  </>
                )}

                {clue.kind === 'not_same_col' && (
                  <>
                    {clue.tiles.map((t, idx) => (
                      <ClueTileBox
                        key={idx}
                        tile={t}
                        size={32}
                        isNot={idx === clue.notIndex}
                      />
                    ))}
                    {clue.tiles.length === 2 && (
                      <div className="h-[42px] w-[42px]" aria-hidden="true" />
                    )}
                  </>
                )}

                {clue.kind === 'same_or' && (
                  <>
                    <ClueTileBox tile={clue.top} size={32} />
                    <ClueTileBox tile={clue.optionA} size={32} orTag />
                    <ClueTileBox tile={clue.optionB} size={32} orTag />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
