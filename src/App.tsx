import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  HorizontalCluesPanel,
  VerticalCluesPanel,
} from './components/CluePanels';
import { ControlPanel } from './components/ControlPanel';
import { PuzzleGrid } from './components/PuzzleGrid';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { TopBar } from './components/TopBar';
import { VictoryModal } from './components/VictoryModal';
import {
  applyEliminateMove,
  applySelectMove,
  checkBoardErrors,
  cloneBoard,
  findNextLogicalStep,
  generatePuzzle,
  isBoardCompletelyFilled,
  isBoardSolvedCorrectly,
} from './engine/sherlockEngine';
import {
  BestTimesMap,
  BoardState,
  CheckResult,
  GameSettings,
  LogicStepHint,
  PuzzleData,
  TileRef,
} from './types/sherlock';
import { playSound } from './utils/sound';

const SETTINGS_STORAGE_KEY = 'sherlock-settings-v1';
const BEST_TIMES_STORAGE_KEY = 'sherlock-best-times-v1';

const DEFAULT_SETTINGS: GameSettings = {
  width: 5,
  height: 4,
  autoCascade: true,
  soundEnabled: true,
};

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      width:
        typeof parsed.width === 'number' && parsed.width >= 3 && parsed.width <= 9
          ? parsed.width
          : DEFAULT_SETTINGS.width,
      height:
        typeof parsed.height === 'number' && parsed.height >= 3 && parsed.height <= 6
          ? parsed.height
          : DEFAULT_SETTINGS.height,
      autoCascade:
        typeof parsed.autoCascade === 'boolean'
          ? parsed.autoCascade
          : DEFAULT_SETTINGS.autoCascade,
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean'
          ? parsed.soundEnabled
          : DEFAULT_SETTINGS.soundEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadBestTimes(): BestTimesMap {
  try {
    const raw = localStorage.getItem(BEST_TIMES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as BestTimesMap;
  } catch {
    return {};
  }
}

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [bestTimes, setBestTimes] = useState<BestTimesMap>(loadBestTimes);

  const [puzzle, setPuzzle] = useState<PuzzleData>(() =>
    generatePuzzle(settings.width, settings.height)
  );
  const [history, setHistory] = useState<BoardState[]>(() => [
    cloneBoard(puzzle.initialBoard),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [hiddenHorizontalIds, setHiddenHorizontalIds] = useState<Set<string>>(
    () => new Set()
  );
  const [hiddenVerticalIds, setHiddenVerticalIds] = useState<Set<string>>(
    () => new Set()
  );
  const [selectedClue, setSelectedClue] = useState<{
    id: string;
    tiles: TileRef[];
  } | null>(null);
  const [activeHint, setActiveHint] = useState<LogicStepHint | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  const [movesCount, setMovesCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);

  const currentBoard = history[historyIndex];

  // Elapsed timer
  useEffect(() => {
    if (isGameFinished) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isGameFinished]);

  const startFreshPuzzle = useCallback(
    (nextWidth: number, nextHeight: number) => {
      const fresh = generatePuzzle(nextWidth, nextHeight);
      setPuzzle(fresh);
      setHistory([cloneBoard(fresh.initialBoard)]);
      setHistoryIndex(0);
      setHiddenHorizontalIds(new Set());
      setHiddenVerticalIds(new Set());
      setSelectedClue(null);
      setActiveHint(null);
      setCheckResult(null);
      setMovesCount(0);
      setHintsUsed(0);
      setElapsedSeconds(0);
      setIsGameFinished(false);
      setIsNewBest(false);
      setIsVictoryOpen(false);
    },
    []
  );

  const commitMove = useCallback(
    (nextBoard: BoardState, soundEffect: 'eliminate' | 'select') => {
      if (isGameFinished) return;

      const sliced = history.slice(0, historyIndex + 1);
      const updatedHistory = [...sliced, nextBoard];
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
      setMovesCount((m) => m + 1);
      setActiveHint(null);
      setCheckResult(null);

      if (isBoardSolvedCorrectly(nextBoard, puzzle.solution)) {
        setIsGameFinished(true);
        setIsVictoryOpen(true);
        playSound('victory', settings.soundEnabled);

        const sizeKey = `${puzzle.width}x${puzzle.height}`;
        setBestTimes((prev) => {
          const existing = prev[sizeKey];
          if (existing === undefined || elapsedSeconds < existing) {
            setIsNewBest(true);
            const updated = { ...prev, [sizeKey]: elapsedSeconds };
            try {
              localStorage.setItem(
                BEST_TIMES_STORAGE_KEY,
                JSON.stringify(updated)
              );
            } catch {
              // Ignore storage quota errors
            }
            return updated;
          }
          return prev;
        });
      } else {
        playSound(soundEffect, settings.soundEnabled);
      }
    },
    [
      elapsedSeconds,
      history,
      historyIndex,
      isGameFinished,
      puzzle.height,
      puzzle.solution,
      puzzle.width,
      settings.soundEnabled,
    ]
  );

  const handleEliminateCandidate = useCallback(
    (row: number, col: number, item: number) => {
      const cell = currentBoard[row]?.[col];
      if (!cell || cell.solved || !cell.candidates[item]) return;
      const nextBoard = applyEliminateMove(
        currentBoard,
        row,
        col,
        item,
        settings.autoCascade
      );
      const becameSolved = nextBoard[row][col].solved;
      commitMove(nextBoard, becameSolved ? 'select' : 'eliminate');
    },
    [commitMove, currentBoard, settings.autoCascade]
  );

  const handleSelectCandidate = useCallback(
    (row: number, col: number, item: number) => {
      const cell = currentBoard[row]?.[col];
      if (!cell || cell.solved || !cell.candidates[item]) return;
      const nextBoard = applySelectMove(
        currentBoard,
        row,
        col,
        item,
        settings.autoCascade
      );
      commitMove(nextBoard, 'select');
    },
    [commitMove, currentBoard, settings.autoCascade]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0 || isGameFinished) return;
    setHistoryIndex((i) => i - 1);
    setActiveHint(null);
    setCheckResult(null);
    playSound('undo', settings.soundEnabled);
  }, [historyIndex, isGameFinished, settings.soundEnabled]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1 || isGameFinished) return;
    setHistoryIndex((i) => i + 1);
    setActiveHint(null);
    setCheckResult(null);
    playSound('undo', settings.soundEnabled);
  }, [history.length, historyIndex, isGameFinished, settings.soundEnabled]);

  const handleUndoUntilCorrect = useCallback(() => {
    if (historyIndex <= 0 || isGameFinished) return;
    let targetIdx = 0;
    for (let i = historyIndex - 1; i >= 0; i--) {
      if (!checkBoardErrors(history[i], puzzle.solution).hasErrors) {
        targetIdx = i;
        break;
      }
    }
    const revertedSteps = historyIndex - targetIdx;
    setHistoryIndex(targetIdx);
    setActiveHint(null);
    setCheckResult({
      hasErrors: false,
      errorCells: [],
      message: `Reverted ${revertedSteps} ${
        revertedSteps === 1 ? 'move' : 'moves'
      } back to the last error-free board.`,
    });
    playSound('undo', settings.soundEnabled);
  }, [history, historyIndex, isGameFinished, puzzle.solution, settings.soundEnabled]);

  const handleResetBoard = useCallback(() => {
    setHistory([cloneBoard(puzzle.initialBoard)]);
    setHistoryIndex(0);
    setHiddenHorizontalIds(new Set());
    setHiddenVerticalIds(new Set());
    setSelectedClue(null);
    setActiveHint(null);
    setCheckResult(null);
    setMovesCount(0);
    setIsGameFinished(false);
    setIsVictoryOpen(false);
    playSound('undo', settings.soundEnabled);
  }, [puzzle.initialBoard, settings.soundEnabled]);

  const handleSelectClue = useCallback((id: string, tiles: TileRef[]) => {
    setSelectedClue({ id, tiles });
  }, []);

  const handleHideHorizontal = useCallback((id: string) => {
    setHiddenHorizontalIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSelectedClue((prev) => (prev?.id === id ? null : prev));
  }, []);

  const handleHideVertical = useCallback((id: string) => {
    setHiddenVerticalIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSelectedClue((prev) => (prev?.id === id ? null : prev));
  }, []);

  const handleRestoreHorizontal = useCallback(() => {
    setHiddenHorizontalIds(new Set());
  }, []);

  const handleRestoreVertical = useCallback(() => {
    setHiddenVerticalIds(new Set());
  }, []);

  const handleCheckBoard = useCallback(() => {
    const result = checkBoardErrors(currentBoard, puzzle.solution);
    setCheckResult(result);
    setActiveHint(null);
    playSound(result.hasErrors ? 'error' : 'hint', settings.soundEnabled);
  }, [currentBoard, puzzle.solution, settings.soundEnabled]);

  const handleRequestHint = useCallback(() => {
    if (isGameFinished) return;
    const hint = findNextLogicalStep(
      currentBoard,
      puzzle.solution,
      puzzle.horizontalClues,
      puzzle.verticalClues
    );
    if (!hint) {
      setCheckResult({
        hasErrors: false,
        errorCells: [],
        message: 'No further single-step deductions found — board may already be complete.',
      });
      return;
    }

    // Automatically unhide the clue referenced by the hint so the player can see it
    if (hint.clueSource === 'horizontal' && hint.clueId) {
      setHiddenHorizontalIds((prev) => {
        if (!prev.has(hint.clueId!)) return prev;
        const next = new Set(prev);
        next.delete(hint.clueId!);
        return next;
      });
    } else if (hint.clueSource === 'vertical' && hint.clueId) {
      setHiddenVerticalIds((prev) => {
        if (!prev.has(hint.clueId!)) return prev;
        const next = new Set(prev);
        next.delete(hint.clueId!);
        return next;
      });
    }

    if (
      !activeHint ||
      activeHint.explanation !== hint.explanation
    ) {
      setHintsUsed((h) => h + 1);
    }

    setCheckResult(null);
    setActiveHint(hint);
    playSound(hint.actionType === 'error' ? 'error' : 'hint', settings.soundEnabled);
  }, [
    activeHint,
    currentBoard,
    isGameFinished,
    puzzle.horizontalClues,
    puzzle.solution,
    puzzle.verticalClues,
    settings.soundEnabled,
  ]);

  const handleApplyHint = useCallback(() => {
    if (
      !activeHint ||
      activeHint.actionType === 'error' ||
      activeHint.targetRow === undefined ||
      activeHint.targetCol === undefined ||
      activeHint.targetItem === undefined
    ) {
      return;
    }

    if (activeHint.actionType === 'select') {
      handleSelectCandidate(
        activeHint.targetRow,
        activeHint.targetCol,
        activeHint.targetItem
      );
    } else {
      handleEliminateCandidate(
        activeHint.targetRow,
        activeHint.targetCol,
        activeHint.targetItem
      );
    }
  }, [activeHint, handleEliminateCandidate, handleSelectCandidate]);

  const handleApplySettings = useCallback(
    (nextSettings: GameSettings, startNew: boolean) => {
      setSettings(nextSettings);
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
      } catch {
        // Ignore storage errors
      }
      setIsSettingsOpen(false);
      if (startNew) {
        startFreshPuzzle(nextSettings.width, nextSettings.height);
      }
    },
    [startFreshPuzzle]
  );

  // Keyboard shortcuts for Undo / Redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isSettingsOpen || isRulesOpen || isVictoryOpen) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleRedo, handleUndo, isRulesOpen, isSettingsOpen, isVictoryOpen]);

  const solvedCount = useMemo(
    () =>
      currentBoard.reduce(
        (acc, row) => acc + row.filter((cell) => cell.solved).length,
        0
      ),
    [currentBoard]
  );

  const totalCells = puzzle.width * puzzle.height;

  const isBoardFilledWithErrors = useMemo(() => {
    if (!isBoardCompletelyFilled(currentBoard)) return false;
    return !isBoardSolvedCorrectly(currentBoard, puzzle.solution);
  }, [currentBoard, puzzle.solution]);

  const mistakeCount = useMemo(() => {
    if (!isBoardFilledWithErrors) return 0;
    return checkBoardErrors(currentBoard, puzzle.solution).errorCells.length;
  }, [currentBoard, isBoardFilledWithErrors, puzzle.solution]);

  const errorCells = useMemo(() => {
    if (checkResult?.hasErrors) return checkResult.errorCells;
    if (activeHint?.actionType === 'error') return activeHint.targetCells;
    return [];
  }, [activeHint, checkResult]);

  const sizeKey = `${puzzle.width}x${puzzle.height}`;
  const bestTimeForSize = bestTimes[sizeKey];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <TopBar
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onCheckBoard={handleCheckBoard}
        onRequestHint={handleRequestHint}
        onNewPuzzle={() => startFreshPuzzle(settings.width, settings.height)}
        isGameFinished={isGameFinished}
      />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-3 py-3 sm:px-6 sm:py-5">
        <div className="grid grid-cols-1 gap-2.5 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px] items-start">
          {/* Mobile: 2nd (center), Desktop: Top-Left */}
          <div className="order-2 lg:order-1">
            <PuzzleGrid
              board={currentBoard}
              width={puzzle.width}
              height={puzzle.height}
              highlightedTiles={selectedClue?.tiles ?? []}
              activeHint={activeHint}
              errorCells={errorCells}
              canUndo={historyIndex > 0 && !isGameFinished}
              onUndo={handleUndo}
              onEliminateCandidate={handleEliminateCandidate}
              onSelectCandidate={handleSelectCandidate}
            />
          </div>

          {/* Mobile: 1st (above board), Desktop: Top-Right */}
          <div className="order-1 lg:order-2">
            <HorizontalCluesPanel
              clues={puzzle.horizontalClues}
              hiddenIds={hiddenHorizontalIds}
              selectedClueId={selectedClue?.id}
              activeHintClueId={
                activeHint?.clueSource === 'horizontal' ? activeHint.clueId : undefined
              }
              onSelectClue={handleSelectClue}
              onHideClue={handleHideHorizontal}
              onRestoreAll={handleRestoreHorizontal}
            />
          </div>

          {/* Mobile: 3rd (below board), Desktop: Bottom-Left */}
          <div className="order-3 lg:order-3">
            <VerticalCluesPanel
              clues={puzzle.verticalClues}
              hiddenIds={hiddenVerticalIds}
              selectedClueId={selectedClue?.id}
              activeHintClueId={
                activeHint?.clueSource === 'vertical' ? activeHint.clueId : undefined
              }
              onSelectClue={handleSelectClue}
              onHideClue={handleHideVertical}
              onRestoreAll={handleRestoreVertical}
            />
          </div>

          {/* Mobile: 4th, Desktop: Bottom-Right */}
          <div className="order-4 lg:order-4">
            <ControlPanel
            width={puzzle.width}
            height={puzzle.height}
            solvedCount={solvedCount}
            totalCells={totalCells}
            movesCount={movesCount}
            elapsedSeconds={elapsedSeconds}
            bestTimeSeconds={bestTimeForSize}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            isGameFinished={isGameFinished}
            isBoardFilledWithErrors={isBoardFilledWithErrors}
            mistakeCount={mistakeCount}
            activeHint={activeHint}
            checkResult={checkResult}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onUndoUntilCorrect={handleUndoUntilCorrect}
            onResetBoard={handleResetBoard}
            onApplyHint={handleApplyHint}
              onDismissHint={() => setActiveHint(null)}
              onDismissCheck={() => setCheckResult(null)}
            />
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onApplySettings={handleApplySettings}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        width={puzzle.width}
        height={puzzle.height}
        elapsedSeconds={elapsedSeconds}
        movesCount={movesCount}
        hintsUsed={hintsUsed}
        isNewBest={isNewBest}
        onPlayAgain={() => startFreshPuzzle(settings.width, settings.height)}
        onClose={() => setIsVictoryOpen(false)}
      />
    </div>
  );
}
