const { sanitizePrompt, validateElectionQuery, truncateHistory } = require('../utils');

describe('Utility Functions', () => {
  describe('sanitizePrompt', () => {
    it('should strip HTML tags', () => {
      expect(sanitizePrompt('<b>vote</b>')).toBe('vote');
    });

    it('should strip script tags', () => {
      expect(sanitizePrompt('<script>alert("xss")</script>')).toBe('alert(xss)');
    });

    it('should trim whitespace', () => {
      expect(sanitizePrompt('  how to vote  ')).toBe('how to vote');
    });

    it('should return empty string for null input', () => {
      expect(sanitizePrompt(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(sanitizePrompt(undefined)).toBe('');
    });

    it('should return empty string for empty string input', () => {
      expect(sanitizePrompt('')).toBe('');
    });

    it('should truncate to 2000 characters', () => {
      const longInput = 'a'.repeat(3000);
      expect(sanitizePrompt(longInput).length).toBe(2000);
    });

    it('should remove dangerous characters', () => {
      const result = sanitizePrompt("Hello <world> 'test' \"quote\"");
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain("'");
      expect(result).not.toContain('"');
    });

    it('should handle normal text without modification', () => {
      expect(sanitizePrompt('How do I register to vote?')).toBe('How do I register to vote?');
    });
  });

  describe('validateElectionQuery', () => {
    it('should pass valid election query', () => {
      expect(validateElectionQuery('How do I register to vote?')).toBe(true);
    });

    it('should pass Hindi query', () => {
      expect(validateElectionQuery('मतदान कैसे करें?')).toBe(true);
    });

    it('should fail empty query', () => {
      expect(validateElectionQuery('')).toBe(false);
    });

    it('should fail null query', () => {
      expect(validateElectionQuery(null)).toBe(false);
    });

    it('should fail undefined query', () => {
      expect(validateElectionQuery(undefined)).toBe(false);
    });

    it('should fail non-string query', () => {
      expect(validateElectionQuery(123)).toBe(false);
    });

    it('should fail whitespace-only query', () => {
      expect(validateElectionQuery('   ')).toBe(false);
    });

    it('should fail query exceeding 2000 chars', () => {
      expect(validateElectionQuery('a'.repeat(2001))).toBe(false);
    });

    it('should pass query at exactly 2000 chars', () => {
      expect(validateElectionQuery('a'.repeat(2000))).toBe(true);
    });
  });

  describe('truncateHistory', () => {
    it('should keep only last 10 messages by default', () => {
      const history = Array(15).fill({ role: 'user', content: 'test' });
      expect(truncateHistory(history)).toHaveLength(10);
    });

    it('should keep all messages if less than max', () => {
      const history = Array(5).fill({ role: 'user', content: 'test' });
      expect(truncateHistory(history)).toHaveLength(5);
    });

    it('should return empty array for null input', () => {
      expect(truncateHistory(null)).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      expect(truncateHistory(undefined)).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      expect(truncateHistory('not an array')).toEqual([]);
    });

    it('should respect custom maxMessages parameter', () => {
      const history = Array(20).fill({ role: 'user', content: 'test' });
      expect(truncateHistory(history, 5)).toHaveLength(5);
    });

    it('should return the most recent messages', () => {
      const history = [
        { role: 'user', content: 'old1' },
        { role: 'user', content: 'old2' },
        { role: 'user', content: 'new1' },
      ];
      const result = truncateHistory(history, 2);
      expect(result[0].content).toBe('old2');
      expect(result[1].content).toBe('new1');
    });
  });
});
