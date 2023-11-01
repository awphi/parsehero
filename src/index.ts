import { mid2Chart } from "./mid2chart";
import { parseChartString, difficulties, instruments } from "./parser";

export interface TickEvent {
  tick: number;
}

export interface SimpleEvent extends TickEvent {
  type: "event";
  value: string;
}

export interface Bpm extends TickEvent {
  type: "bpm";
  bpm: number;
}

export interface TimeSignature extends TickEvent {
  type: "ts";
  numerator: number;
  denominator: number;
}

export type Timed<T> = T & { assignedTime: number };
export type TimedTrack<T> = T extends Array<any>
  ? Timed<T[number]>[]
  : Timed<T>;
export type TimedTracks<T> = {
  [P in keyof T]: TimedTrack<T[P]>;
};

export interface SongSection {
  resolution: number;
  name?: string;
  artist?: string;
  album?: string;
  charter?: string;
  player2?: string;
  genre?: string;
  mediaType?: string;
  year?: string;
  offset?: number;
  difficulty?: number;
  previewstart?: number;
  previewend?: number;
}

export interface NoteEvent extends TickEvent {
  type: "note";
  note: number;
  isHOPO: boolean;
  isChord: boolean;
  forced: boolean;
  tap: boolean;
  duration: number;
}

export interface StarPowerEvent extends TickEvent {
  type: "starpower";
  duration: number;
}

export type PlayEvent = NoteEvent | SimpleEvent | StarPowerEvent;

export type ChartTrack = `${Difficulty}${Instrument}`;

export type ParsedChart = {
  Song: SongSection;
  SyncTrack: TimedTracks<SyncTrack>;
  Events?: Timed<SimpleEvent>[];
} & {
  [instrument in ChartTrack]?: Timed<PlayEvent>[];
};

export interface SyncTrack {
  bpms: Bpm[];
  timeSignatures: TimeSignature[];
  allEvents: SyncTrackEvent[];
}
export type SyncTrackEvent = Bpm | TimeSignature;

export type Difficulty = (typeof difficulties)[number];

export type Instrument = (typeof instruments)[number];

// export a couple of useful utility methods and the parse function wrapper
export { timeToTick, tickToTime } from "./utils";
export function parseChart(input: string | ArrayBufferLike): {
  chart: ParsedChart;
  warnings: string[];
} {
  const warnings: string[] = [];
  const chartString =
    typeof input === "string" ? input : mid2Chart(input, warnings);
  const chart = parseChartString(chartString, warnings);

  return {
    chart,
    warnings,
  };
}
