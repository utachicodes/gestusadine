import { describe, it, expect } from 'vitest';
import { isGreeting, greetingReply, buildCouncilSystemPrompt } from '../../convex/prompts';

describe('isGreeting', () => {
  it('detects Arabic greeting', () => {
    expect(isGreeting('As-salamu alaykum')).toBe(true);
  });

  it('detects full Arabic greeting with rahmatullah', () => {
    expect(isGreeting('Assalamu alaykum wa rahmatullahi wa barakatuh')).toBe(true);
  });

  it('detects short salam', () => {
    expect(isGreeting('salam')).toBe(true);
  });

  it('detects salaam', () => {
    expect(isGreeting('salaam')).toBe(true);
  });

  it('detects English hi', () => {
    expect(isGreeting('hi')).toBe(true);
  });

  it('detects hello', () => {
    expect(isGreeting('hello')).toBe(true);
  });

  it('detects French bonjour', () => {
    expect(isGreeting('bonjour')).toBe(true);
  });

  it('detects French bonsoir', () => {
    expect(isGreeting('bonsoir')).toBe(true);
  });

  it('detects French salut', () => {
    expect(isGreeting('salut')).toBe(true);
  });

  it('detects thank you in English', () => {
    expect(isGreeting('thank you')).toBe(true);
  });

  it('detects shukran', () => {
    expect(isGreeting('shukran')).toBe(true);
  });

  it('detects jazakallahu khairan', () => {
    expect(isGreeting('jazakallahu khairan')).toBe(true);
  });

  it('detects how are you', () => {
    expect(isGreeting('how are you')).toBe(true);
  });

  it('detects French ça va', () => {
    expect(isGreeting('ça va')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isGreeting('')).toBe(false);
  });

  it('rejects questions', () => {
    expect(isGreeting('what is prayer?')).toBe(false);
  });

  it('rejects long messages', () => {
    expect(isGreeting('hi there I have a question about prayer times and fasting in Ramadan')).toBe(false);
  });

  it('rejects real Islamic questions', () => {
    expect(isGreeting('What are the conditions for valid wudu?')).toBe(false);
  });

  it('rejects "salam" followed by a question', () => {
    expect(isGreeting('salam, what is zakat?')).toBe(false);
  });
});

describe('greetingReply', () => {
  it('returns English reply by default', () => {
    const reply = greetingReply();
    expect(reply).toContain('Wa alaykum assalam');
    expect(reply).toContain('How can I help');
  });

  it('returns French reply for fr', () => {
    const reply = greetingReply('fr');
    expect(reply).toContain('Wa alaykum salam');
    expect(reply).toContain('Comment puis-je');
  });

  it('returns Arabic reply for ar', () => {
    const reply = greetingReply('ar');
    expect(reply).toContain('وعليكم السلام');
  });

  it('returns English for unknown language', () => {
    const reply = greetingReply('de');
    expect(reply).toContain('How can I help');
  });
});

describe('buildCouncilSystemPrompt', () => {
  it('includes core methodology', () => {
    const prompt = buildCouncilSystemPrompt({});
    expect(prompt).toContain('GëstuSaDine');
    expect(prompt).toContain('Hierarchy of evidence');
    expect(prompt).toContain('Quran');
    expect(prompt).toContain('Hadith');
  });

  it('sets language to English by default', () => {
    const prompt = buildCouncilSystemPrompt({});
    expect(prompt).toContain('English');
  });

  it('sets language to French', () => {
    const prompt = buildCouncilSystemPrompt({ language: 'fr' });
    expect(prompt).toContain('French');
  });

  it('sets language to Arabic', () => {
    const prompt = buildCouncilSystemPrompt({ language: 'ar' });
    expect(prompt).toContain('Arabic');
  });

  it('includes madhab when specified', () => {
    const prompt = buildCouncilSystemPrompt({ madhab: 'hanafi' });
    expect(prompt).toContain('hanafi');
    expect(prompt).toContain('Foreground that school');
  });

  it('uses majority position when no madhab', () => {
    const prompt = buildCouncilSystemPrompt({});
    expect(prompt).toContain('No madhab is specified');
  });

  it('includes security rules', () => {
    const prompt = buildCouncilSystemPrompt({});
    expect(prompt).toContain('untrusted');
    expect(prompt).toContain('Silence Rule');
  });
});
