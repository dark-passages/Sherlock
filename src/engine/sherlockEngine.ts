import { getTileName } from '../data/themes';
import {
  BoardState,
  CellState,
  CheckResult,
  HorizontalClue,
  LogicStepHint,
  PuzzleData,
  TileRef,
  VerticalClue,
} from '../types/sherlock';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createEmptyBoard(width: number, height: number): BoardState {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, (): CellState => ({
      solved: false,
      candidates: Array(width).fill(true),
    }))
  );
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map((row) =>
    row.map((cell) =>
      cell.solved
        ? { ...cell }
        : { solved: false, candidates: [...cell.candidates] }
    )
  );
}

export function isItemPossible(
  board: BoardState,
  row: number,
  col: number,
  item: number
): boolean {
  if (col < 0 || col >= board[0].length || row < 0 || row >= board.length) {
    return false;
  }
  const cell = board[row][col];
  if (cell.solved) return cell.item === item;
  return Boolean(cell.candidates[item]);
}

export function isItemSolvedAt(
  board: BoardState,
  row: number,
  col: number,
  item: number
): boolean {
  if (col < 0 || col >= board[0].length || row < 0 || row >= board.length) {
    return false;
  }
  const cell = board[row][col];
  return cell.solved && cell.item === item;
}

export function findSolvedCol(
  board: BoardState,
  row: number,
  item: number
): number {
  const rowCells = board[row];
  for (let c = 0; c < rowCells.length; c++) {
    const cell = rowCells[c];
    if (cell.solved && cell.item === item) return c;
  }
  return -1;
}

export function countRemainingCandidates(board: BoardState): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.solved) count += 1;
      else {
        for (const c of cell.candidates) {
          if (c) count += 1;
        }
      }
    }
  }
  return count;
}

export function isBoardCompletelyFilled(board: BoardState): boolean {
  return board.every((row) => row.every((cell) => cell.solved));
}

export function isBoardSolvedCorrectly(
  board: BoardState,
  solution: number[][]
): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const cell = board[r][c];
      if (!cell.solved || cell.item !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Mutates a cloned board in-place for a single candidate elimination.
 * Always resolves a cell if only 1 candidate remains.
 * When autoCascade is true, also resolves unique row candidates and cascades selections.
 */
function eliminateInPlace(
  board: BoardState,
  row: number,
  col: number,
  item: number,
  width: number,
  autoCascade: boolean
): boolean {
  const cell = board[row][col];
  if (cell.solved || !cell.candidates[item]) return false;

  cell.candidates[item] = false;

  // Check if only 1 candidate remains in this cell
  let remainingCount = 0;
  let lastIdx = -1;
  for (let i = 0; i < width; i++) {
    if (cell.candidates[i]) {
      remainingCount++;
      lastIdx = i;
    }
  }
  if (remainingCount === 1 && lastIdx !== -1) {
    selectInPlace(board, row, col, lastIdx, width, autoCascade);
  }

  // If autoCascade, check if `item` now only has 1 possible column in `row`
  if (autoCascade) {
    let possibleColCount = 0;
    let onlyCol = -1;
    let alreadySolved = false;
    for (let c = 0; c < width; c++) {
      const cCell = board[row][c];
      if (cCell.solved) {
        if (cCell.item === item) {
          alreadySolved = true;
          break;
        }
      } else if (cCell.candidates[item]) {
        possibleColCount++;
        onlyCol = c;
      }
    }
    if (!alreadySolved && possibleColCount === 1 && onlyCol !== -1) {
      selectInPlace(board, row, onlyCol, item, width, true);
    }
  }

  return true;
}

function selectInPlace(
  board: BoardState,
  row: number,
  col: number,
  item: number,
  width: number,
  autoCascade: boolean,
  isGiven = false
): boolean {
  const cell = board[row][col];
  if (cell.solved && cell.item === item) return false;
  if (cell.solved && cell.item !== item) return false;

  board[row][col] = {
    solved: true,
    item,
    isGiven: isGiven || undefined,
  };

  if (autoCascade) {
    for (let c = 0; c < width; c++) {
      const otherCell = board[row][c];
      if (c !== col && !otherCell.solved && otherCell.candidates[item]) {
        eliminateInPlace(board, row, c, item, width, true);
      }
    }
  }

  return true;
}

export function applyEliminateMove(
  board: BoardState,
  row: number,
  col: number,
  item: number,
  autoCascade: boolean
): BoardState {
  const next = cloneBoard(board);
  const width = next[0].length;
  eliminateInPlace(next, row, col, item, width, autoCascade);
  return next;
}

export function applySelectMove(
  board: BoardState,
  row: number,
  col: number,
  item: number,
  autoCascade: boolean
): BoardState {
  const next = cloneBoard(board);
  const width = next[0].length;
  selectInPlace(next, row, col, item, width, autoCascade);
  return next;
}

export function checkBoardErrors(
  board: BoardState,
  solution: number[][]
): CheckResult {
  const errorCells: { row: number; col: number }[] = [];

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const cell = board[r][c];
      const correctItem = solution[r][c];
      if (cell.solved) {
        if (cell.item !== correctItem) {
          errorCells.push({ row: r, col: c });
        }
      } else if (!cell.candidates[correctItem]) {
        errorCells.push({ row: r, col: c });
      }
    }
  }

  if (errorCells.length === 0) {
    return {
      hasErrors: false,
      errorCells: [],
      message: 'No mistakes detected — every remaining possibility is consistent.',
    };
  }

  return {
    hasErrors: true,
    errorCells,
    message: `${errorCells.length} ${
      errorCells.length === 1 ? 'cell has' : 'cells have'
    } an incorrect selection or eliminated answer.`,
  };
}

interface SolverStep {
  clueSource: 'horizontal' | 'vertical' | 'row_rule' | 'cell_rule';
  clueId?: string;
  actionType: 'eliminate' | 'select';
  row: number;
  col: number;
  item: number;
  targetCells: { row: number; col: number }[];
  explanation: string;
}

function findBasicBoardSteps(board: BoardState, width: number): SolverStep | null {
  // 1. Check if any solved cell's item still appears as a candidate elsewhere in the same row
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < width; c++) {
      const cell = board[r][c];
      if (cell.solved) {
        for (let otherC = 0; otherC < width; otherC++) {
          if (otherC !== c) {
            const other = board[r][otherC];
            if (!other.solved && other.candidates[cell.item]) {
              return {
                clueSource: 'row_rule',
                actionType: 'eliminate',
                row: r,
                col: otherC,
                item: cell.item,
                targetCells: [
                  { row: r, col: c },
                  { row: r, col: otherC },
                ],
                explanation: `${getTileName({
                  row: r,
                  item: cell.item,
                })} is already placed in Column ${c + 1}, so it can be removed from Column ${
                  otherC + 1
                }.`,
              };
            }
          }
        }
      }
    }
  }

  // 2. Check if any item has only 1 possible column left in a row
  for (let r = 0; r < board.length; r++) {
    for (let item = 0; item < width; item++) {
      if (findSolvedCol(board, r, item) !== -1) continue;
      let count = 0;
      let onlyCol = -1;
      for (let c = 0; c < width; c++) {
        const cCell = board[r][c];
        if (!cCell.solved && cCell.candidates[item]) {
          count++;
          onlyCol = c;
        }
      }
      if (count === 1 && onlyCol !== -1) {
        return {
          clueSource: 'row_rule',
          actionType: 'select',
          row: r,
          col: onlyCol,
          item,
          targetCells: [{ row: r, col: onlyCol }],
          explanation: `${getTileName({
            row: r,
            item,
          })} has only one remaining possible location in this row: Column ${onlyCol + 1}.`,
        };
      }
    }
  }

  return null;
}

function findStepFromHorizontalClue(
  board: BoardState,
  clue: HorizontalClue,
  width: number
): SolverStep | null {
  const checkDistancePair = (
    tileA: TileRef,
    tileB: TileRef,
    dist: number,
    clueLabel: string
  ): SolverStep | null => {
    for (let c = 0; c < width; c++) {
      if (!board[tileA.row][c].solved && isItemPossible(board, tileA.row, c, tileA.item)) {
        const matchLeft = isItemPossible(board, tileB.row, c - dist, tileB.item);
        const matchRight = isItemPossible(board, tileB.row, c + dist, tileB.item);
        if (!matchLeft && !matchRight) {
          return {
            clueSource: 'horizontal',
            clueId: clue.id,
            actionType: 'eliminate',
            row: tileA.row,
            col: c,
            item: tileA.item,
            targetCells: [{ row: tileA.row, col: c }],
            explanation: `${clueLabel}: ${getTileName(tileA)} cannot be in Column ${
              c + 1
            } because ${getTileName(tileB)} is not possible ${
              dist === 1 ? 'in an adjacent column' : '2 columns away'
            }.`,
          };
        }
      }
    }
    return null;
  };

  switch (clue.kind) {
    case 'next_to': {
      const label = `Next-To clue`;
      return (
        checkDistancePair(clue.a, clue.b, 1, label) ||
        checkDistancePair(clue.b, clue.a, 1, label)
      );
    }

    case 'left_of': {
      let minLeft = width;
      let maxRight = -1;
      for (let c = 0; c < width; c++) {
        if (isItemPossible(board, clue.left.row, c, clue.left.item)) {
          if (c < minLeft) minLeft = c;
        }
        if (isItemPossible(board, clue.right.row, c, clue.right.item)) {
          if (c > maxRight) maxRight = c;
        }
      }
      for (let c = 0; c < width; c++) {
        if (
          c >= maxRight &&
          !board[clue.left.row][c].solved &&
          isItemPossible(board, clue.left.row, c, clue.left.item)
        ) {
          return {
            clueSource: 'horizontal',
            clueId: clue.id,
            actionType: 'eliminate',
            row: clue.left.row,
            col: c,
            item: clue.left.item,
            targetCells: [{ row: clue.left.row, col: c }],
            explanation: `Left-Of clue: ${getTileName(
              clue.left
            )} must be to the left of ${getTileName(
              clue.right
            )}, so ${getTileName(clue.left)} cannot be in Column ${c + 1}.`,
          };
        }
        if (
          c <= minLeft &&
          !board[clue.right.row][c].solved &&
          isItemPossible(board, clue.right.row, c, clue.right.item)
        ) {
          return {
            clueSource: 'horizontal',
            clueId: clue.id,
            actionType: 'eliminate',
            row: clue.right.row,
            col: c,
            item: clue.right.item,
            targetCells: [{ row: clue.right.row, col: c }],
            explanation: `Left-Of clue: ${getTileName(
              clue.right
            )} must be to the right of ${getTileName(
              clue.left
            )}, so ${getTileName(clue.right)} cannot be in Column ${c + 1}.`,
          };
        }
      }
      return null;
    }

    case 'between': {
      // Middle cannot be on outer edges
      for (const edgeCol of [0, width - 1]) {
        if (
          !board[clue.middle.row][edgeCol].solved &&
          isItemPossible(board, clue.middle.row, edgeCol, clue.middle.item)
        ) {
          return {
            clueSource: 'horizontal',
            clueId: clue.id,
            actionType: 'eliminate',
            row: clue.middle.row,
            col: edgeCol,
            item: clue.middle.item,
            targetCells: [{ row: clue.middle.row, col: edgeCol }],
            explanation: `Is-Between clue: ${getTileName(
              clue.middle
            )} is between two other tiles, so it cannot be on the outer edge (Column ${
              edgeCol + 1
            }).`,
          };
        }
      }

      const label = 'Is-Between clue';
      return (
        checkDistancePair(clue.left, clue.middle, 1, label) ||
        checkDistancePair(clue.middle, clue.left, 1, label) ||
        checkDistancePair(clue.middle, clue.right, 1, label) ||
        checkDistancePair(clue.right, clue.middle, 1, label) ||
        checkDistancePair(clue.left, clue.right, 2, label) ||
        checkDistancePair(clue.right, clue.left, 2, label)
      );
    }

    case 'not_between': {
      const validPairs: { cLeft: number; cRight: number; mid: number }[] = [];
      for (let c = 0; c < width - 2; c++) {
        const mid = c + 1;
        // Order 1: left at c, right at c+2
        if (
          isItemPossible(board, clue.left.row, c, clue.left.item) &&
          isItemPossible(board, clue.right.row, c + 2, clue.right.item) &&
          !isItemSolvedAt(board, clue.notMiddle.row, mid, clue.notMiddle.item)
        ) {
          validPairs.push({ cLeft: c, cRight: c + 2, mid });
        }
        // Order 2: right at c, left at c+2
        if (
          isItemPossible(board, clue.right.row, c, clue.right.item) &&
          isItemPossible(board, clue.left.row, c + 2, clue.left.item) &&
          !isItemSolvedAt(board, clue.notMiddle.row, mid, clue.notMiddle.item)
        ) {
          validPairs.push({ cLeft: c + 2, cRight: c, mid });
        }
      }

      if (validPairs.length > 0) {
        // Check if all valid pairs force the same midpoint
        const firstMid = validPairs[0].mid;
        if (validPairs.every((p) => p.mid === firstMid)) {
          if (
            !board[clue.notMiddle.row][firstMid].solved &&
            isItemPossible(board, clue.notMiddle.row, firstMid, clue.notMiddle.item)
          ) {
            return {
              clueSource: 'horizontal',
              clueId: clue.id,
              actionType: 'eliminate',
              row: clue.notMiddle.row,
              col: firstMid,
              item: clue.notMiddle.item,
              targetCells: [{ row: clue.notMiddle.row, col: firstMid }],
              explanation: `Is-Not-Between clue: ${getTileName(
                clue.left
              )} and ${getTileName(clue.right)} span Column ${firstMid + 1}, so ${getTileName(
                clue.notMiddle
              )} cannot be in Column ${firstMid + 1}.`,
            };
          }
        }

        // Check if left or right can be pruned because no valid pair uses that column
        for (let c = 0; c < width; c++) {
          if (
            !board[clue.left.row][c].solved &&
            isItemPossible(board, clue.left.row, c, clue.left.item) &&
            !validPairs.some((p) => p.cLeft === c)
          ) {
            return {
              clueSource: 'horizontal',
              clueId: clue.id,
              actionType: 'eliminate',
              row: clue.left.row,
              col: c,
              item: clue.left.item,
              targetCells: [{ row: clue.left.row, col: c }],
              explanation: `Is-Not-Between clue: ${getTileName(
                clue.left
              )} cannot be in Column ${c + 1} given the positions of ${getTileName(
                clue.right
              )} and ${getTileName(clue.notMiddle)}.`,
            };
          }
          if (
            !board[clue.right.row][c].solved &&
            isItemPossible(board, clue.right.row, c, clue.right.item) &&
            !validPairs.some((p) => p.cRight === c)
          ) {
            return {
              clueSource: 'horizontal',
              clueId: clue.id,
              actionType: 'eliminate',
              row: clue.right.row,
              col: c,
              item: clue.right.item,
              targetCells: [{ row: clue.right.row, col: c }],
              explanation: `Is-Not-Between clue: ${getTileName(
                clue.right
              )} cannot be in Column ${c + 1} given the positions of ${getTileName(
                clue.left
              )} and ${getTileName(clue.notMiddle)}.`,
            };
          }
        }
      }

      return null;
    }
  }
}

function findStepFromVerticalClue(
  board: BoardState,
  clue: VerticalClue,
  width: number
): SolverStep | null {
  const checkSamePair = (a: TileRef, b: TileRef, label: string): SolverStep | null => {
    for (let c = 0; c < width; c++) {
      if (isItemSolvedAt(board, a.row, c, a.item) && !board[b.row][c].solved) {
        return {
          clueSource: 'vertical',
          clueId: clue.id,
          actionType: 'select',
          row: b.row,
          col: c,
          item: b.item,
          targetCells: [
            { row: a.row, col: c },
            { row: b.row, col: c },
          ],
          explanation: `${label}: Since ${getTileName(a)} is in Column ${
            c + 1
          }, ${getTileName(b)} must also be in Column ${c + 1}.`,
        };
      }
      if (
        !isItemPossible(board, a.row, c, a.item) &&
        !board[b.row][c].solved &&
        isItemPossible(board, b.row, c, b.item)
      ) {
        return {
          clueSource: 'vertical',
          clueId: clue.id,
          actionType: 'eliminate',
          row: b.row,
          col: c,
          item: b.item,
          targetCells: [{ row: b.row, col: c }],
          explanation: `${label}: Since ${getTileName(
            a
          )} cannot be in Column ${c + 1}, ${getTileName(b)} cannot be in Column ${
            c + 1
          } either.`,
        };
      }
    }
    return null;
  };

  const checkNotSamePair = (a: TileRef, b: TileRef, label: string): SolverStep | null => {
    for (let c = 0; c < width; c++) {
      if (
        isItemSolvedAt(board, a.row, c, a.item) &&
        !board[b.row][c].solved &&
        isItemPossible(board, b.row, c, b.item)
      ) {
        return {
          clueSource: 'vertical',
          clueId: clue.id,
          actionType: 'eliminate',
          row: b.row,
          col: c,
          item: b.item,
          targetCells: [
            { row: a.row, col: c },
            { row: b.row, col: c },
          ],
          explanation: `${label}: Since ${getTileName(a)} is in Column ${
            c + 1
          }, ${getTileName(b)} cannot be in Column ${c + 1}.`,
        };
      }
      if (
        isItemSolvedAt(board, b.row, c, b.item) &&
        !board[a.row][c].solved &&
        isItemPossible(board, a.row, c, a.item)
      ) {
        return {
          clueSource: 'vertical',
          clueId: clue.id,
          actionType: 'eliminate',
          row: a.row,
          col: c,
          item: a.item,
          targetCells: [
            { row: b.row, col: c },
            { row: a.row, col: c },
          ],
          explanation: `${label}: Since ${getTileName(b)} is in Column ${
            c + 1
          }, ${getTileName(a)} cannot be in Column ${c + 1}.`,
        };
      }
    }
    return null;
  };

  switch (clue.kind) {
    case 'same_col': {
      for (let i = 0; i < clue.tiles.length; i++) {
        for (let j = 0; j < clue.tiles.length; j++) {
          if (i === j) continue;
          const step = checkSamePair(clue.tiles[i], clue.tiles[j], 'Same-Column clue');
          if (step) return step;
        }
      }
      return null;
    }

    case 'not_same_col': {
      const notTile = clue.tiles[clue.notIndex];
      const sameTiles = clue.tiles.filter((_, idx) => idx !== clue.notIndex);

      if (sameTiles.length === 2) {
        const s1 = checkSamePair(sameTiles[0], sameTiles[1], 'Not-In-Same-Column clue');
        if (s1) return s1;
        const s2 = checkSamePair(sameTiles[1], sameTiles[0], 'Not-In-Same-Column clue');
        if (s2) return s2;
      }

      for (const t of sameTiles) {
        const step = checkNotSamePair(t, notTile, 'Not-In-Same-Column clue');
        if (step) return step;
      }
      return null;
    }

    case 'same_or': {
      const { top, optionA, optionB } = clue;
      const colTop = findSolvedCol(board, top.row, top.item);
      const colA = findSolvedCol(board, optionA.row, optionA.item);
      const colB = findSolvedCol(board, optionB.row, optionB.item);

      // Neither option possible in column c -> top cannot be in column c
      for (let c = 0; c < width; c++) {
        if (
          !isItemPossible(board, optionA.row, c, optionA.item) &&
          !isItemPossible(board, optionB.row, c, optionB.item) &&
          !board[top.row][c].solved &&
          isItemPossible(board, top.row, c, top.item)
        ) {
          return {
            clueSource: 'vertical',
            clueId: clue.id,
            actionType: 'eliminate',
            row: top.row,
            col: c,
            item: top.item,
            targetCells: [{ row: top.row, col: c }],
            explanation: `Either-Or clue: Neither ${getTileName(
              optionA
            )} nor ${getTileName(optionB)} can be in Column ${
              c + 1
            }, so ${getTileName(top)} cannot be in Column ${c + 1}.`,
          };
        }
      }

      // Both options solved -> top can only be in colA or colB
      if (colA !== -1 && colB !== -1) {
        for (let c = 0; c < width; c++) {
          if (
            c !== colA &&
            c !== colB &&
            !board[top.row][c].solved &&
            isItemPossible(board, top.row, c, top.item)
          ) {
            return {
              clueSource: 'vertical',
              clueId: clue.id,
              actionType: 'eliminate',
              row: top.row,
              col: c,
              item: top.item,
              targetCells: [{ row: top.row, col: c }],
              explanation: `Either-Or clue: ${getTileName(
                top
              )} must share a column with either ${getTileName(
                optionA
              )} (Col ${colA + 1}) or ${getTileName(optionB)} (Col ${colB + 1}).`,
            };
          }
        }
      }

      if (colTop !== -1 && colA !== -1) {
        if (colTop === colA) {
          if (
            !board[optionB.row][colTop].solved &&
            isItemPossible(board, optionB.row, colTop, optionB.item)
          ) {
            return {
              clueSource: 'vertical',
              clueId: clue.id,
              actionType: 'eliminate',
              row: optionB.row,
              col: colTop,
              item: optionB.item,
              targetCells: [{ row: optionB.row, col: colTop }],
              explanation: `Either-Or clue: Since ${getTileName(
                top
              )} and ${getTileName(optionA)} are both in Column ${
                colTop + 1
              }, ${getTileName(optionB)} cannot be in Column ${colTop + 1}.`,
            };
          }
        } else if (!board[optionB.row][colTop].solved) {
          return {
            clueSource: 'vertical',
            clueId: clue.id,
            actionType: 'select',
            row: optionB.row,
            col: colTop,
            item: optionB.item,
            targetCells: [{ row: optionB.row, col: colTop }],
            explanation: `Either-Or clue: ${getTileName(top)} is in Column ${
              colTop + 1
            } and ${getTileName(optionA)} is in Column ${
              colA + 1
            }, so ${getTileName(optionB)} must be in Column ${colTop + 1}.`,
          };
        }
      }

      if (colTop !== -1 && colB !== -1) {
        if (colTop === colB) {
          if (
            !board[optionA.row][colTop].solved &&
            isItemPossible(board, optionA.row, colTop, optionA.item)
          ) {
            return {
              clueSource: 'vertical',
              clueId: clue.id,
              actionType: 'eliminate',
              row: optionA.row,
              col: colTop,
              item: optionA.item,
              targetCells: [{ row: optionA.row, col: colTop }],
              explanation: `Either-Or clue: Since ${getTileName(
                top
              )} and ${getTileName(optionB)} are both in Column ${
                colTop + 1
              }, ${getTileName(optionA)} cannot be in Column ${colTop + 1}.`,
            };
          }
        } else if (!board[optionA.row][colTop].solved) {
          return {
            clueSource: 'vertical',
            clueId: clue.id,
            actionType: 'select',
            row: optionA.row,
            col: colTop,
            item: optionA.item,
            targetCells: [{ row: optionA.row, col: colTop }],
            explanation: `Either-Or clue: ${getTileName(top)} is in Column ${
              colTop + 1
            } and ${getTileName(optionB)} is in Column ${
              colB + 1
            }, so ${getTileName(optionA)} must be in Column ${colTop + 1}.`,
          };
        }
      }

      // If optionA is known in colA and top is impossible in colA -> top must match optionB
      if (colA !== -1 && !isItemPossible(board, top.row, colA, top.item)) {
        const s = checkSamePair(top, optionB, 'Either-Or clue');
        if (s) return s;
      }
      if (colB !== -1 && !isItemPossible(board, top.row, colB, top.item)) {
        const s = checkSamePair(top, optionA, 'Either-Or clue');
        if (s) return s;
      }

      return null;
    }
  }
}

export function solveWithPropagation(
  initialBoard: BoardState,
  horizontalClues: HorizontalClue[],
  verticalClues: VerticalClue[],
  width: number
): BoardState {
  const board = cloneBoard(initialBoard);

  let changed = true;
  let guard = 0;
  while (changed && guard < 400) {
    changed = false;
    guard++;

    const basic = findBasicBoardSteps(board, width);
    if (basic) {
      if (basic.actionType === 'select') {
        selectInPlace(board, basic.row, basic.col, basic.item, width, true);
      } else {
        eliminateInPlace(board, basic.row, basic.col, basic.item, width, true);
      }
      changed = true;
      continue;
    }

    for (const hClue of horizontalClues) {
      const step = findStepFromHorizontalClue(board, hClue, width);
      if (step) {
        if (step.actionType === 'select') {
          selectInPlace(board, step.row, step.col, step.item, width, true);
        } else {
          eliminateInPlace(board, step.row, step.col, step.item, width, true);
        }
        changed = true;
        break;
      }
    }
    if (changed) continue;

    for (const vClue of verticalClues) {
      const step = findStepFromVerticalClue(board, vClue, width);
      if (step) {
        if (step.actionType === 'select') {
          selectInPlace(board, step.row, step.col, step.item, width, true);
        } else {
          eliminateInPlace(board, step.row, step.col, step.item, width, true);
        }
        changed = true;
        break;
      }
    }
  }

  return board;
}

export function findNextLogicalStep(
  board: BoardState,
  solution: number[][],
  horizontalClues: HorizontalClue[],
  verticalClues: VerticalClue[]
): LogicStepHint | null {
  const check = checkBoardErrors(board, solution);
  if (check.hasErrors) {
    return {
      clueSource: 'error',
      targetCells: check.errorCells,
      actionType: 'error',
      explanation: `${check.message} Revert back to the last valid move to continue.`,
    };
  }

  const width = board[0].length;

  const basic = findBasicBoardSteps(board, width);
  if (basic) {
    return {
      clueSource: basic.clueSource,
      targetCells: basic.targetCells,
      actionType: basic.actionType,
      targetRow: basic.row,
      targetCol: basic.col,
      targetItem: basic.item,
      explanation: basic.explanation,
    };
  }

  for (const hClue of horizontalClues) {
    const step = findStepFromHorizontalClue(board, hClue, width);
    if (step) {
      return {
        clueSource: 'horizontal',
        clueId: hClue.id,
        targetCells: step.targetCells,
        actionType: step.actionType,
        targetRow: step.row,
        targetCol: step.col,
        targetItem: step.item,
        explanation: step.explanation,
      };
    }
  }

  for (const vClue of verticalClues) {
    const step = findStepFromVerticalClue(board, vClue, width);
    if (step) {
      return {
        clueSource: 'vertical',
        clueId: vClue.id,
        targetCells: step.targetCells,
        actionType: step.actionType,
        targetRow: step.row,
        targetCol: step.col,
        targetItem: step.item,
        explanation: step.explanation,
      };
    }
  }

  return null;
}

function tileKey(t: TileRef): string {
  return `${t.row}:${t.item}`;
}

function horizontalClueSignature(c: HorizontalClue): string {
  switch (c.kind) {
    case 'next_to': {
      const k1 = tileKey(c.a);
      const k2 = tileKey(c.b);
      return `nt:${k1 < k2 ? `${k1}-${k2}` : `${k2}-${k1}`}`;
    }
    case 'left_of':
      return `lo:${tileKey(c.left)}-${tileKey(c.right)}`;
    case 'between': {
      const k1 = tileKey(c.left);
      const k2 = tileKey(c.right);
      return `bw:${tileKey(c.middle)}:${k1 < k2 ? `${k1}-${k2}` : `${k2}-${k1}`}`;
    }
    case 'not_between': {
      const k1 = tileKey(c.left);
      const k2 = tileKey(c.right);
      return `nb:${tileKey(c.notMiddle)}:${k1 < k2 ? `${k1}-${k2}` : `${k2}-${k1}`}`;
    }
  }
}

function verticalClueSignature(c: VerticalClue): string {
  switch (c.kind) {
    case 'same_col':
      return `sc:${c.tiles.map(tileKey).sort().join('|')}`;
    case 'not_same_col': {
      const notK = tileKey(c.tiles[c.notIndex]);
      const others = c.tiles
        .filter((_, i) => i !== c.notIndex)
        .map(tileKey)
        .sort()
        .join('|');
      return `nsc:${notK}!${others}`;
    }
    case 'same_or': {
      const o1 = tileKey(c.optionA);
      const o2 = tileKey(c.optionB);
      return `so:${tileKey(c.top)}=${o1 < o2 ? `${o1}|${o2}` : `${o2}|${o1}`}`;
    }
  }
}

function pickDistinctRows(height: number, count: number): number[] {
  const rows = shuffleArray(Array.from({ length: height }, (_, i) => i));
  return rows.slice(0, count);
}

function randomHorizontalClue(
  solution: number[][],
  width: number,
  height: number,
  id: string
): HorizontalClue {
  const kindIdx = Math.floor(Math.random() * 4);
  const r1 = Math.floor(Math.random() * height);
  let r2 = Math.floor(Math.random() * height);
  if (height > 1 && r2 === r1 && Math.random() < 0.7) {
    r2 = (r1 + 1 + Math.floor(Math.random() * (height - 1))) % height;
  }
  const r3 = Math.floor(Math.random() * height);

  if (kindIdx === 0) {
    const c1 = Math.floor(Math.random() * (width - 1));
    const c2 = c1 + 1;
    const swap = Math.random() < 0.5;
    const a: TileRef = {
      row: swap ? r2 : r1,
      item: solution[swap ? r2 : r1][swap ? c2 : c1],
    };
    const b: TileRef = {
      row: swap ? r1 : r2,
      item: solution[swap ? r1 : r2][swap ? c1 : c2],
    };
    return { id, kind: 'next_to', a, b };
  }

  if (kindIdx === 1) {
    const c1 = Math.floor(Math.random() * (width - 1));
    const c2 = c1 + 1 + Math.floor(Math.random() * (width - 1 - c1));
    return {
      id,
      kind: 'left_of',
      left: { row: r1, item: solution[r1][c1] },
      right: { row: r2, item: solution[r2][c2] },
    };
  }

  if (kindIdx === 2) {
    const c1 = Math.floor(Math.random() * (width - 2));
    const c2 = c1 + 1;
    const c3 = c1 + 2;
    const swapOuter = Math.random() < 0.5;
    const leftCol = swapOuter ? c3 : c1;
    const rightCol = swapOuter ? c1 : c3;
    return {
      id,
      kind: 'between',
      left: { row: r1, item: solution[r1][leftCol] },
      middle: { row: r2, item: solution[r2][c2] },
      right: { row: r3, item: solution[r3][rightCol] },
    };
  }

  // kindIdx === 3: not_between
  const c1 = Math.floor(Math.random() * (width - 2));
  const cMid = c1 + 1;
  const c3 = c1 + 2;
  let notMidItem = Math.floor(Math.random() * width);
  if (notMidItem === solution[r2][cMid]) {
    notMidItem = (notMidItem + 1) % width;
  }
  const swapOuter = Math.random() < 0.5;
  return {
    id,
    kind: 'not_between',
    left: { row: r1, item: solution[r1][swapOuter ? c3 : c1] },
    notMiddle: { row: r2, item: notMidItem },
    right: { row: r3, item: solution[r3][swapOuter ? c1 : c3] },
  };
}

function randomVerticalClue(
  solution: number[][],
  width: number,
  height: number,
  id: string
): VerticalClue {
  const kindRoll = Math.floor(Math.random() * 7);
  const col = Math.floor(Math.random() * width);
  const otherCol = (col + 1 + Math.floor(Math.random() * (width - 1))) % width;

  if (kindRoll === 0) {
    const rows = pickDistinctRows(height, 2).sort((a, b) => a - b);
    return {
      id,
      kind: 'same_col',
      tiles: rows.map((r) => ({ row: r, item: solution[r][col] })),
    };
  }

  if (kindRoll === 1 && height >= 3) {
    const rows = pickDistinctRows(height, 3).sort((a, b) => a - b);
    return {
      id,
      kind: 'same_col',
      tiles: rows.map((r) => ({ row: r, item: solution[r][col] })),
    };
  }

  if (kindRoll === 2 || height < 3) {
    const rows = pickDistinctRows(height, 2).sort((a, b) => a - b);
    const notIdx = Math.random() < 0.5 ? 0 : 1;
    return {
      id,
      kind: 'not_same_col',
      tiles: rows.map((r, idx) => ({
        row: r,
        item: solution[r][idx === notIdx ? otherCol : col],
      })),
      notIndex: notIdx,
    };
  }

  if (kindRoll >= 3 && kindRoll <= 5) {
    const rows = pickDistinctRows(height, 3).sort((a, b) => a - b);
    const notIdx = kindRoll - 3; // 0, 1, or 2
    const tiles = rows.map((r, idx) => ({
      row: r,
      item: solution[r][idx === notIdx ? otherCol : col],
    }));
    return {
      id,
      kind: 'not_same_col',
      tiles,
      notIndex: notIdx,
    };
  }

  // kindRoll === 6: same_or
  const rows = pickDistinctRows(height, 3).sort((a, b) => a - b);
  const topInColA = Math.random() < 0.5;
  return {
    id,
    kind: 'same_or',
    top: {
      row: rows[0],
      item: solution[rows[0]][topInColA ? col : otherCol],
    },
    optionA: { row: rows[1], item: solution[rows[1]][col] },
    optionB: { row: rows[2], item: solution[rows[2]][otherCol] },
  };
}

export function generatePuzzle(width: number, height: number): PuzzleData {
  const baseItems = Array.from({ length: width }, (_, i) => i);
  const solution = Array.from({ length: height }, () => shuffleArray(baseItems));

  const initialBoard = createEmptyBoard(width, height);
  let horizontalClues: HorizontalClue[] = [];
  let verticalClues: VerticalClue[] = [];
  const seenSignatures = new Set<string>();

  let currentSolvedBoard = solveWithPropagation(
    initialBoard,
    horizontalClues,
    verticalClues,
    width
  );
  let currentScore = countRemainingCandidates(currentSolvedBoard);

  let clueCounter = 0;
  let attempts = 0;

  while (!isBoardCompletelyFilled(currentSolvedBoard) && attempts < 360) {
    attempts++;
    const roll = Math.floor(Math.random() * 9);

    if (roll === 0) {
      // Pick an unsolved cell on currentSolvedBoard to reveal as a given
      const unsolved: { r: number; c: number }[] = [];
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (!currentSolvedBoard[r][c].solved) {
            unsolved.push({ r, c });
          }
        }
      }
      if (unsolved.length > 0) {
        const pick = unsolved[Math.floor(Math.random() * unsolved.length)];
        selectInPlace(
          initialBoard,
          pick.r,
          pick.c,
          solution[pick.r][pick.c],
          width,
          true,
          true
        );
        currentSolvedBoard = solveWithPropagation(
          initialBoard,
          horizontalClues,
          verticalClues,
          width
        );
        currentScore = countRemainingCandidates(currentSolvedBoard);
      }
      continue;
    }

    if (roll % 2 === 1) {
      const id = `h-${++clueCounter}`;
      const clue = randomHorizontalClue(solution, width, height, id);
      const sig = horizontalClueSignature(clue);
      if (seenSignatures.has(sig)) continue;

      horizontalClues.push(clue);
      const candidateBoard = solveWithPropagation(
        initialBoard,
        horizontalClues,
        verticalClues,
        width
      );
      const nextScore = countRemainingCandidates(candidateBoard);
      if (nextScore < currentScore) {
        seenSignatures.add(sig);
        currentSolvedBoard = candidateBoard;
        currentScore = nextScore;
      } else {
        horizontalClues.pop();
      }
    } else {
      const id = `v-${++clueCounter}`;
      const clue = randomVerticalClue(solution, width, height, id);
      const sig = verticalClueSignature(clue);
      if (seenSignatures.has(sig)) continue;

      verticalClues.push(clue);
      const candidateBoard = solveWithPropagation(
        initialBoard,
        horizontalClues,
        verticalClues,
        width
      );
      const nextScore = countRemainingCandidates(candidateBoard);
      if (nextScore < currentScore) {
        seenSignatures.add(sig);
        currentSolvedBoard = candidateBoard;
        currentScore = nextScore;
      } else {
        verticalClues.pop();
      }
    }
  }

  // Fallback if any cell remained unsolved after max attempts
  if (!isBoardCompletelyFilled(currentSolvedBoard)) {
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        if (!currentSolvedBoard[r][c].solved) {
          selectInPlace(initialBoard, r, c, solution[r][c], width, true, true);
          currentSolvedBoard = solveWithPropagation(
            initialBoard,
            horizontalClues,
            verticalClues,
            width
          );
        }
      }
    }
  }

  // Pruning pass: remove redundant clues that are no longer needed for a full solve
  const prunedHorizontal: HorizontalClue[] = [];
  for (let i = 0; i < horizontalClues.length; i++) {
    const without = [
      ...prunedHorizontal,
      ...horizontalClues.slice(i + 1),
    ];
    const test = solveWithPropagation(initialBoard, without, verticalClues, width);
    if (!isBoardCompletelyFilled(test)) {
      prunedHorizontal.push(horizontalClues[i]);
    }
  }
  horizontalClues = prunedHorizontal;

  const prunedVertical: VerticalClue[] = [];
  for (let i = 0; i < verticalClues.length; i++) {
    const without = [
      ...prunedVertical,
      ...verticalClues.slice(i + 1),
    ];
    const test = solveWithPropagation(initialBoard, horizontalClues, without, width);
    if (!isBoardCompletelyFilled(test)) {
      prunedVertical.push(verticalClues[i]);
    }
  }
  verticalClues = prunedVertical;

  return {
    width,
    height,
    solution,
    initialBoard,
    horizontalClues,
    verticalClues,
  };
}
