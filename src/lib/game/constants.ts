import type { PlayerColor } from "./types";

export const BOARD_SIZE = 7;

export const START_ROW: Record<PlayerColor, number> = {
  orange: 0,
  purple: BOARD_SIZE - 1,
};

export const WIN_CAPTURE_COUNT = 4;

export const DIRECTIONS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
] as const;

export const LINE_AXES = [
  { dr: 1, dc: 0 },
  { dr: 0, dc: 1 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
] as const;
