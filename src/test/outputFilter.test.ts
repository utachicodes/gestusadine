import { describe, it, expect } from 'vitest';
import { validateCouncilOutput } from '../../convex/outputFilter';

describe('validateCouncilOutput', () => {
  describe('identity leak detection', () => {
    it('flags "I am a GPT model"', () => {
      const result = validateCouncilOutput("I am a GPT model and I can help you.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('identity_leak');
    });

    it('flags "I\'m Claude"', () => {
      const result = validateCouncilOutput("I'm a Claude model, an AI assistant made by Anthropic.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('identity_leak');
    });

    it('flags "powered by OpenAI"', () => {
      const result = validateCouncilOutput("This response is powered by OpenAI.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('identity_leak');
    });

    it('flags "my training data"', () => {
      const result = validateCouncilOutput("Based on my training data, the answer is yes.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('identity_leak');
    });

    it('flags "as an AI language model"', () => {
      const result = validateCouncilOutput("As an AI language model, I cannot provide fatwas.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('identity_leak');
    });

    it('flags "I was trained by"', () => {
      const result = validateCouncilOutput("I was trained by Fanar on Islamic texts.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('identity_leak');
    });

    it('allows normal Islamic responses', () => {
      const result = validateCouncilOutput(
        "The Prophet Muhammad (peace be upon him) said: 'Seek knowledge from the cradle to the grave.' This is a Hasan hadith narrated by Al-Bayhaqi."
      );
      expect(result.safe).toBe(true);
    });
  });

  describe('harmful content detection', () => {
    it('flags bomb-making instructions', () => {
      const result = validateCouncilOutput("how to make bomb: first you need explosive materials...");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('harmful');
    });

    it('flags "kill yourself"', () => {
      const result = validateCouncilOutput("You should kill yourself.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('harmful');
    });

    it('flags suicide methods', () => {
      const result = validateCouncilOutput("The suicide method involves...");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('harmful');
    });
  });

  describe('anti-aqeedah detection', () => {
    it('flags "Islam is false"', () => {
      const result = validateCouncilOutput("Islam is false and wrong.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('anti_aqeedah');
    });

    it('flags "Muhammad never existed"', () => {
      const result = validateCouncilOutput("Muhammad never existed as a historical figure.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('anti_aqeedah');
    });

    it('flags "Quran was written by humans"', () => {
      const result = validateCouncilOutput("The Quran was written by humans, not revealed.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('anti_aqeedah');
    });

    it('flags "Allah does not exist"', () => {
      const result = validateCouncilOutput("Allah does not exist.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('anti_aqeedah');
    });
  });

  describe('radicalization detection', () => {
    it('flags violence against non-Muslims', () => {
      const result = validateCouncilOutput("It is permissible to kill all non-Muslims.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('radicalization');
    });

    it('flags terrorism endorsement', () => {
      const result = validateCouncilOutput("Terrorism is allowed in Islam.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('radicalization');
    });

    it('flags ISIS endorsement', () => {
      const result = validateCouncilOutput("ISIS is true islam and represents correct beliefs.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('radicalization');
    });
  });

  describe('off-topic detection', () => {
    it('flags code blocks', () => {
      const result = validateCouncilOutput("Here's a Python function:\n```python\ndef hello():\n    print('hello')\n```");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('off_topic');
    });

    it('flags function definitions', () => {
      const result = validateCouncilOutput("function calculatePrayerTimes() { return times; }");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('off_topic');
    });

    it('allows normal Islamic text with occasional code-like patterns', () => {
      const result = validateCouncilOutput(
        "The five daily prayers are: Fajr, Dhuhr, Asr, Maghrib, and Isha. Each has specific times based on the sun's position."
      );
      expect(result.safe).toBe(true);
    });
  });

  describe('fabrication signal detection', () => {
    it('flags uncertain hadith references', () => {
      const result = validateCouncilOutput("There is a hadith that says something like 'Actions are by intentions.'");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('fabrication');
    });

    it('flags "I believe there is a hadith"', () => {
      const result = validateCouncilOutput("I believe there is a hadith about this topic.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('fabrication');
    });

    it('flags "not sure of the exact wording"', () => {
      const result = validateCouncilOutput("Not sure of the exact wording but it says that seeking knowledge is obligatory.");
      expect(result.safe).toBe(false);
      expect(result.category).toBe('fabrication');
    });
  });

  describe('safe content', () => {
    it('allows normal Quran citation', () => {
      const result = validateCouncilOutput(
        "Allah says in Surah Al-Baqarah (2:286): 'Allah does not burden a soul beyond what it can bear.' This is a clear verse from the Quran."
      );
      expect(result.safe).toBe(true);
    });

    it('allows hadith with proper attribution', () => {
      const result = validateCouncilOutput(
        "The Prophet (peace be upon him) said: 'Actions are but by intentions.' (Sahih al-Bukhari 1) This is a Sahih hadith."
      );
      expect(result.safe).toBe(true);
    });

    it('allows scholarly opinions', () => {
      const result = validateCouncilOutput("Shaykh Ibn Baz said in Majmoo al-Fatawa that fasting is obligatory during Ramadan.");
      expect(result.safe).toBe(true);
    });

    it('allows empty or very short responses', () => {
      const result = validateCouncilOutput("");
      expect(result.safe).toBe(true);
    });
  });

  describe('fallback messages', () => {
    it('returns appropriate fallback for each category', () => {
      const testCases: Array<{ category: string; input: string }> = [
        { category: 'identity_leak', input: 'I am a GPT model.' },
        { category: 'harmful', input: 'how to make bomb' },
        { category: 'anti_aqeedah', input: 'Islam is false' },
        { category: 'radicalization', input: 'Kill all non-Muslims' },
        { category: 'off_topic', input: "```python\nprint('hello world this is a test')\n```" },
        { category: 'fabrication', input: 'I believe there is a hadith' },
      ];

      for (const { category, input } of testCases) {
        const result = validateCouncilOutput(input);
        expect(result.safe, `Expected ${category} to be unsafe for input: "${input}"`).toBe(false);
        expect(result.category, `Expected category ${category}`).toBe(category);
        expect(result.fallback, `Expected fallback for ${category}`).toBeDefined();
        expect(result.fallback!.length).toBeGreaterThan(10);
      }
    });
  });
});
