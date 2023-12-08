import { expect, test } from "vitest";
import { disToTime, getTimedBpms } from "../src/utils";
import { describe } from "vitest";
import { Bpm, Timed } from "../src";

describe("disToTime", () => {
  test.each([
    [1, 100, 192, 60, 0.515625],
    [100, 0, 192, 60, -0.5208333333333334],
    [1, 1, 1, 120, 0],
    [1, 1, 1, 0, NaN],
  ])(
    "disToTime(%i, %i, %i, %i) === %i",
    (tickStart, tickEnd, resolution, bpm, result) => {
      expect(disToTime(tickStart, tickEnd, resolution, bpm)).toBe(result);
    }
  );
});

describe("getTimedBpms", () => {
  const bpms: Bpm[] = [
    { type: "bpm", tick: 0, bpm: 60 },
    { type: "bpm", tick: 19, bpm: 120 },
    { type: "bpm", tick: 400, bpm: 6 },
    { type: "bpm", tick: 3000, bpm: 17 },
  ];

  test("doesn't mutate input", () => {
    const result = getTimedBpms(bpms, 192);
    expect(result).not.toBe(bpms);
  });

  test("assigns finite times to bpm events", () => {
    const result = getTimedBpms(bpms, 192);
    result.forEach((v) => {
      expect(v).toHaveProperty("assignedTime");
      expect(Number.isFinite(v.assignedTime)).toBe(true);
    });
  });

  test.each([1, 2, 3, 4])(
    "correctly calculates relationship between tick and resolution (d = %i)",
    (divisor) => {
      const result1 = getTimedBpms(bpms, 192);
      const result2 = getTimedBpms(bpms, 192 / divisor);
      for (let i = 0; i < result1.length; i++) {
        expect(result1[i].assignedTime).toBe(result2[i].assignedTime / divisor);
      }
    }
  );
});
