import { describe, it, expect } from 'vitest';
import { verifyCitations } from '../lib/verifyCitations';

describe('verifyCitations', () => {
  describe('Quran references', () => {
    it('returns no warnings for a valid reference', () => {
      const warnings = verifyCitations('In Surah Al-Fatihah (1:1), Allah says...');
      expect(warnings).toHaveLength(0);
    });

    it('warns on wrong surah number', () => {
      const warnings = verifyCitations('Al-Fatihah 5:1');
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].type).toBe('quran');
      expect(warnings[0].detail).toContain('Surah 1');
    });

    it('warns on out-of-range ayah', () => {
      const warnings = verifyCitations('Al-Fatihah 1:10');
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].type).toBe('quran');
      expect(warnings[0].detail).toContain('7 verses');
    });

    it('handles surah names with special characters', () => {
      const warnings = verifyCitations("Al-A'raf 7:1");
      expect(warnings).toHaveLength(0);
    });

    it('detects multiple Quran references', () => {
      const warnings = verifyCitations(
        'Al-Fatihah 1:1 and Al-Baqarah 2:255'
      );
      expect(warnings).toHaveLength(0);
    });

    it('warns on one valid and one invalid reference', () => {
      const warnings = verifyCitations(
        'Al-Fatihah 1:1 and Al-Fatihah 5:1'
      );
      expect(warnings.length).toBe(1);
      expect(warnings[0].detail).toContain('Surah 1');
    });
  });

  describe('Hadith references', () => {
    it('detects Sahih al-Bukhari reference', () => {
      const warnings = verifyCitations(
        'The Prophet said: "Actions are by intentions." (Sahih al-Bukhari 1)'
      );
      expect(warnings.length).toBeGreaterThanOrEqual(1);
      const hadithWarning = warnings.find(w => w.type === 'hadith');
      expect(hadithWarning).toBeDefined();
    });

    it('detects Sahih Muslim reference', () => {
      const warnings = verifyCitations(
        'According to Sahih Muslim hadith 123...'
      );
      const hadithWarning = warnings.find(w => w.type === 'hadith');
      expect(hadithWarning).toBeDefined();
    });

    it('detects Abu Dawud reference', () => {
      const warnings = verifyCitations(
        'Sunan Abu Dawud 456 narrates...'
      );
      const hadithWarning = warnings.find(w => w.type === 'hadith');
      expect(hadithWarning).toBeDefined();
    });

    it('detects Tirmidhi reference', () => {
      const warnings = verifyCitations(
        'Al-Tirmidhi 789 states...'
      );
      const hadithWarning = warnings.find(w => w.type === 'hadith');
      expect(hadithWarning).toBeDefined();
    });
  });

  describe('combined references', () => {
    it('detects both Quran and Hadith references', () => {
      const warnings = verifyCitations(
        'In Al-Fatihah (1:1) and Sahih al-Bukhari 1, we find...'
      );
      const quranWarnings = warnings.filter(w => w.type === 'quran');
      const hadithWarnings = warnings.filter(w => w.type === 'hadith');
      expect(quranWarnings.length).toBe(0);
      expect(hadithWarnings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('edge cases', () => {
    it('returns empty for text with no references', () => {
      const warnings = verifyCitations('Islam is a beautiful religion.');
      expect(warnings).toHaveLength(0);
    });

    it('handles empty string', () => {
      const warnings = verifyCitations('');
      expect(warnings).toHaveLength(0);
    });

    it('deduplicates same reference', () => {
      const warnings = verifyCitations(
        'Al-Fatihah (1:1) is great. Al-Fatihah (1:1) is powerful.'
      );
      // Should only warn once per unique reference (if any warning exists)
      const quranWarnings = warnings.filter(w => w.type === 'quran');
      expect(quranWarnings.length).toBeLessThanOrEqual(1);
    });
  });
});
