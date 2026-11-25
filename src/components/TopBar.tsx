import React from 'react';
import { CheckCircle2, HelpCircle, Lightbulb, RotateCw, SlidersHorizontal } from 'lucide-react';
import { SherlockLogoIcon } from './SherlockLogoIcon';

interface TopBarProps {
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onCheckBoard: () => void;
  onRequestHint: () => void;
  onNewPuzzle: () => void;
  isGameFinished: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenRules,
  onOpenSettings,
  onCheckBoard,
  onRequestHint,
  onNewPuzzle,
  isGameFinished,
}) => {
  return (
    <header className="border-b border-hairline bg-card/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Brand mark & wordmark */}
        <a
          href="#top"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          <SherlockLogoIcon size={32} />
          <span>Sherlock</span>
        </a>

        {/* Zone 2: Clean single-line text links / actions */}
        <nav
          aria-label="Game controls"
          className="flex flex-wrap items-center gap-5 text-sm font-medium text-ink-muted"
        >
          <button
            type="button"
            onClick={onOpenRules}
            className="inline-flex items-center gap-1.5 py-1 hover:text-ink transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>How to Play</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 py-1 hover:text-ink transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onCheckBoard}
            disabled={isGameFinished}
            className="inline-flex items-center gap-1.5 py-1 hover:text-ink disabled:opacity-45 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>Check Board</span>
          </button>

          <button
            type="button"
            onClick={onRequestHint}
            disabled={isGameFinished}
            className="inline-flex items-center gap-1.5 py-1 text-emerald-accent hover:text-ink disabled:opacity-45 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            <span>Logic Hint</span>
          </button>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onNewPuzzle}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink/85 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>New Puzzle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
