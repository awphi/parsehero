import type { Bpm, TickEvent, Timed } from "./index";

export const difficulties = ["Easy", "Medium", "Hard", "Expert"] as const;
// TODO add support for more instrument types
export const instruments = [
  "Single",
  "DoubleBass",
  "DoubleRhythm",
  "Keyboard",
  "DoubleGuitar",
  "Vocals",
] as const;

export function disToTime(
  tickStart: number,
  tickEnd: number,
  resolution: number,
  bpm: number
) {
  return (((tickEnd - tickStart) / resolution) * 60) / bpm;
}

export function getTimedBpms(bpms: Bpm[], resolution: number): Timed<Bpm>[] {
  const result: Timed<Bpm>[] = [];
  let time = 0;
  let prevBpm = bpms[0];
  for (const ev of bpms) {
    time += disToTime(prevBpm.tick, ev.tick, resolution, prevBpm.bpm);
    result.push({
      ...ev,
      assignedTime: time,
    });
    prevBpm = ev;
  }

  return result;
}

export function timeToDis(
  timeStart: number,
  timeEnd: number,
  resolution: number,
  bpm: number
) {
  return Math.round((((timeEnd - timeStart) * bpm) / 60) * resolution);
}

export function findClosestPosition(tick: number, events: TickEvent[]): number {
  let lowerBound = 0;
  let upperBound = events.length - 1;
  let index = -1;

  let midPoint = -1;

  while (lowerBound <= upperBound) {
    midPoint = Math.floor((lowerBound + upperBound) / 2);
    index = midPoint;

    if (events[midPoint].tick == tick) {
      break;
    } else {
      if (events[midPoint].tick < tick) {
        // data is in upper half
        lowerBound = midPoint + 1;
      } else {
        // data is in lower half
        upperBound = midPoint - 1;
      }
    }
  }

  return index;
}

export function tickToTime(
  tick: number,
  resolution: number,
  bpms: Timed<Bpm>[]
) {
  let previousBPMPos = findClosestPosition(tick, bpms);
  if (bpms[previousBPMPos].tick > tick) --previousBPMPos;

  const prevBPM = bpms[previousBPMPos];
  let time = prevBPM.assignedTime;
  time += disToTime(prevBPM.tick, tick, resolution, prevBPM.bpm);

  return time;
}

export function getTimedTrack<T extends TickEvent>(
  arr: T[],
  resolution: number,
  bpms: Timed<Bpm>[]
): Timed<T>[] {
  return arr.map((a) => ({
    ...a,
    assignedTime: tickToTime(a.tick, resolution, bpms),
  }));
}

export function findLastTimeEvent<T>(
  time: number,
  events: Timed<T>[],
  equal: boolean = true
): Timed<T> {
  let last = events[0];
  // Search for the last bpm
  for (let i = 0; i < events.length; ++i) {
    const ev = events[i];
    if ((equal && ev.assignedTime >= time) || ev.assignedTime > time) break;
    else last = ev;
  }

  return last;
}

export function timeToTick(
  time: number,
  resolution: number,
  bpms: Timed<Bpm>[]
) {
  if (time < 0) time = 0;

  const prevBPM = findLastTimeEvent(time, bpms);

  let position = 0;
  position = prevBPM.tick;
  position += timeToDis(prevBPM.assignedTime, time, resolution, prevBPM.bpm);

  return position;
}

export function findLastTickEvent<T extends TickEvent>(
  tick: number,
  arr: T[]
): number {
  let idx = findClosestPosition(tick, arr);
  if (arr[idx].tick > tick) {
    idx--;
  }
  return idx;
}
