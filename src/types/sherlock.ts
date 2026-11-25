export interface TileRef {
  row: number;
  item: number;
}

export type CellState =
  | {
      solved: true;
      item: number;
      isGiven?: boolean;
    }
  | {
      solved: false;
      candidates: boolean[];
    };

export type BoardState = CellState[][];

export type HorizontalClue =
  | {
      id: string;
      kind: 'next_to';
      a: TileRef;
      b: TileRef;
    }
  | {
      id: string;
      kind: 'left_of';
      left: TileRef;
      right: TileRef;
    }
  | {
      id: string;
      kind: 'between';
      left: TileRef;
      middle: TileRef;
      right: TileRef;
    }
  | {
      id: string;
      kind: 'not_between';
      left: TileRef;
      notMiddle: TileRef;
      right: TileRef;
    };

export type VerticalClue =
  | {
      id: string;
      kind: 'same_col';
      tiles: TileRef[];
    }
  | {
      id: string;
      kind: 'not_same_col';
      tiles: TileRef[];
      notIndex: number;
    }
  | {
      id: string;
      kind: 'same_or';
      top: TileRef;
      optionA: TileRef;
      optionB: TileRef;
    };

export interface PuzzleData {
  width: number;
  height: number;
  solution: number[][];
  initialBoard: BoardState;
  horizontalClues: HorizontalClue[];
  verticalClues: VerticalClue[];
}

export interface LogicStepHint {
  clueSource: 'horizontal' | 'vertical' | 'row_rule' | 'cell_rule' | 'error';
  clueId?: string;
  targetCells: { row: number; col: number }[];
  actionType: 'eliminate' | 'select' | 'error';
  targetRow?: number;
  targetCol?: number;
  targetItem?: number;
  explanation: string;
}

export interface CheckResult {
  hasErrors: boolean;
  errorCells: { row: number; col: number }[];
  message: string;
}

export interface GameSettings {
  width: number;
  height: number;
  autoCascade: boolean;
  soundEnabled: boolean;
}

export type BestTimesMap = Record<string, number>;

export interface ThemeItemMeta {
  name: string;
  shortLabel: string;
}

export interface ThemeRowMeta {
  id: string;
  title: string;
  items: ThemeItemMeta[];
}
