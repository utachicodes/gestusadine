import { describe, it, expect } from 'vitest';
import {
  toHijri,
  hijriMonthName,
  hijriMonthNameAr,
  isWhiteDay,
  HIJRI_MONTHS,
  HIJRI_EVENTS,
  eventOn,
  eventsInHijriMonth,
} from '../lib/hijri';

describe('toHijri', () => {
  it('converts a known Gregorian date to Hijri', () => {
    // January 1, 2024 is approximately 19 Jumada al-Awwal 1445
    const result = toHijri(new Date(2024, 0, 1));
    expect(result.year).toBe(1445);
    expect(result.month).toBeGreaterThanOrEqual(5);
    expect(result.month).toBeLessThanOrEqual(6);
    expect(result.day).toBeGreaterThanOrEqual(1);
    expect(result.day).toBeLessThanOrEqual(30);
  });

  it('returns valid Hijri parts', () => {
    const result = toHijri(new Date());
    expect(result.day).toBeGreaterThanOrEqual(1);
    expect(result.day).toBeLessThanOrEqual(30);
    expect(result.month).toBeGreaterThanOrEqual(1);
    expect(result.month).toBeLessThanOrEqual(12);
    expect(result.year).toBeGreaterThan(1400);
  });
});

describe('hijriMonthName', () => {
  it('returns English name for Muharram', () => {
    expect(hijriMonthName(1, 'en')).toBe('Muharram');
  });

  it('returns French name for Muharram', () => {
    expect(hijriMonthName(1, 'fr')).toBe('Mouharram');
  });

  it('returns English name for Ramadan', () => {
    expect(hijriMonthName(9, 'en')).toBe('Ramadan');
  });

  it('returns French name for Ramadan', () => {
    expect(hijriMonthName(9, 'fr')).toBe('Ramadan');
  });

  it('returns empty string for invalid month', () => {
    expect(hijriMonthName(13, 'en')).toBe('');
    expect(hijriMonthName(0, 'en')).toBe('');
  });
});

describe('hijriMonthNameAr', () => {
  it('returns Arabic name for Ramadan', () => {
    expect(hijriMonthNameAr(9)).toBe('رمضان');
  });

  it('returns Arabic name for Muharram', () => {
    expect(hijriMonthNameAr(1)).toBe('محرّم');
  });

  it('returns empty string for invalid month', () => {
    expect(hijriMonthNameAr(13)).toBe('');
  });
});

describe('isWhiteDay', () => {
  it('returns true for day 13', () => {
    expect(isWhiteDay(13)).toBe(true);
  });

  it('returns true for day 14', () => {
    expect(isWhiteDay(14)).toBe(true);
  });

  it('returns true for day 15', () => {
    expect(isWhiteDay(15)).toBe(true);
  });

  it('returns false for other days', () => {
    expect(isWhiteDay(1)).toBe(false);
    expect(isWhiteDay(12)).toBe(false);
    expect(isWhiteDay(16)).toBe(false);
    expect(isWhiteDay(27)).toBe(false);
  });
});

describe('HIJRI_MONTHS', () => {
  it('has 12 months', () => {
    expect(Object.keys(HIJRI_MONTHS)).toHaveLength(12);
  });

  it('each month has en, ar, and fr names', () => {
    for (let i = 1; i <= 12; i++) {
      const month = HIJRI_MONTHS[i];
      expect(month).toBeDefined();
      expect(month.en).toBeTruthy();
      expect(month.ar).toBeTruthy();
      expect(month.fr).toBeTruthy();
    }
  });
});

describe('HIJRI_EVENTS', () => {
  it('includes Islamic New Year', () => {
    const event = HIJRI_EVENTS.find(e => e.id === 'islamic-new-year');
    expect(event).toBeDefined();
    expect(event!.month).toBe(1);
    expect(event!.day).toBe(1);
  });

  it('includes Eid al-Fitr', () => {
    const event = HIJRI_EVENTS.find(e => e.id === 'eid-al-fitr');
    expect(event).toBeDefined();
    expect(event!.month).toBe(10);
    expect(event!.day).toBe(1);
  });

  it('includes Eid al-Adha', () => {
    const event = HIJRI_EVENTS.find(e => e.id === 'eid-al-adha');
    expect(event).toBeDefined();
    expect(event!.month).toBe(12);
    expect(event!.day).toBe(10);
  });

  it('includes Laylat al-Qadr', () => {
    const event = HIJRI_EVENTS.find(e => e.id === 'laylat-al-qadr');
    expect(event).toBeDefined();
    expect(event!.month).toBe(9);
    expect(event!.day).toBe(27);
  });

  it('each event has en and fr names and descriptions', () => {
    for (const event of HIJRI_EVENTS) {
      expect(event.name.en).toBeTruthy();
      expect(event.name.fr).toBeTruthy();
      expect(event.description.en).toBeTruthy();
      expect(event.description.fr).toBeTruthy();
    }
  });
});

describe('eventOn', () => {
  it('finds Islamic New Year on 1/1', () => {
    const event = eventOn(1, 1);
    expect(event).toBeDefined();
    expect(event!.id).toBe('islamic-new-year');
  });

  it('finds Eid al-Fitr on 10/1', () => {
    const event = eventOn(10, 1);
    expect(event).toBeDefined();
    expect(event!.id).toBe('eid-al-fitr');
  });

  it('returns undefined for non-event day', () => {
    expect(eventOn(5, 15)).toBeUndefined();
  });
});

describe('eventsInHijriMonth', () => {
  it('returns events for month 1 (Muharram)', () => {
    const events = eventsInHijriMonth(1);
    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events[0].day).toBeLessThanOrEqual(events[1].day);
  });

  it('returns empty array for month with no events', () => {
    const events = eventsInHijriMonth(6);
    expect(events).toHaveLength(0);
  });

  it('returns events sorted by day', () => {
    const events = eventsInHijriMonth(12);
    for (let i = 1; i < events.length; i++) {
      expect(events[i].day).toBeGreaterThanOrEqual(events[i - 1].day);
    }
  });
});
