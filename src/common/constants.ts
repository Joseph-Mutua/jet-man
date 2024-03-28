export const WAITING = "WAITING";
export const RUNNING = "RUNNING";
export const ENDED = "ENDED";

const GAME_STATES = [WAITING, RUNNING, ENDED] as const;
export type IGameState = (typeof GAME_STATES)[number];
export const WAITING_DURATION = 6000;
