import { describe, it, expect } from "vitest";
import { toMinutes, to12h, stripTimeSuffix, addMinutes } from "../lib/prayerHelpers";

describe("toMinutes", () => {
  it("converts midnight to 0", () => {
    expect(toMinutes("00:00")).toBe(0);
  });

  it("converts 14:30 to 870", () => {
    expect(toMinutes("14:30")).toBe(870);
  });

  it("converts 23:59 to 1439", () => {
    expect(toMinutes("23:59")).toBe(1439);
  });

  it("converts 01:00 to 60", () => {
    expect(toMinutes("01:00")).toBe(60);
  });

  it("converts 12:00 to 720", () => {
    expect(toMinutes("12:00")).toBe(720);
  });
});

describe("to12h", () => {
  it("converts 00:00 to 12:00 AM", () => {
    expect(to12h("00:00")).toBe("12:00 AM");
  });

  it("converts 14:30 to 2:30 PM", () => {
    expect(to12h("14:30")).toBe("2:30 PM");
  });

  it("converts 12:00 to 12:00 PM", () => {
    expect(to12h("12:00")).toBe("12:00 PM");
  });

  it("converts 11:59 to 11:59 AM", () => {
    expect(to12h("11:59")).toBe("11:59 AM");
  });

  it("converts 01:15 to 1:15 AM", () => {
    expect(to12h("01:15")).toBe("1:15 AM");
  });

  it("converts 23:59 to 11:59 PM", () => {
    expect(to12h("23:59")).toBe("11:59 PM");
  });
});

describe("stripTimeSuffix", () => {
  it("strips timezone suffix", () => {
    expect(stripTimeSuffix("14:30 (GMT+0:00)")).toBe("14:30");
  });

  it("returns time unchanged when no suffix", () => {
    expect(stripTimeSuffix("05:19")).toBe("05:19");
  });

  it("strips GMT suffix", () => {
    expect(stripTimeSuffix("06:45 (GMT)")).toBe("06:45");
  });

  it("handles short suffix", () => {
    expect(stripTimeSuffix("10:00 +1")).toBe("10:00");
  });
});

describe("addMinutes", () => {
  it("adds 30 minutes to 14:30 → 15:00", () => {
    expect(addMinutes("14:30", 30)).toBe("15:00");
  });

  it("wraps around midnight", () => {
    expect(addMinutes("23:30", 60)).toBe("00:30");
  });

  it("handles negative delta (subtraction)", () => {
    expect(addMinutes("14:30", -30)).toBe("14:00");
  });

  it("wraps backward past midnight", () => {
    expect(addMinutes("00:30", -60)).toBe("23:30");
  });

  it("adds zero minutes (identity)", () => {
    expect(addMinutes("10:15", 0)).toBe("10:15");
  });

  it("handles large forward delta", () => {
    expect(addMinutes("00:00", 1440)).toBe("00:00");
  });

  it("handles 15 minutes before dhuhr for zawal", () => {
    expect(addMinutes("12:00", -15)).toBe("11:45");
  });
});
