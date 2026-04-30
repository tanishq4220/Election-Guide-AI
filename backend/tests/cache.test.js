const { getCachedResponse, setCachedResponse, clearCache, getCacheStats } = require('../middleware/cache');

describe('Cache Module', () => {
  beforeEach(() => {
    clearCache();
  });

  it('should return undefined for uncached prompts', () => {
    expect(getCachedResponse('unknown')).toBeUndefined();
  });

  it('should cache and retrieve AI responses', () => {
    setCachedResponse('how to vote', 'You can vote by...');
    expect(getCachedResponse('how to vote')).toBe('You can vote by...');
  });

  it('should be case-insensitive for cache keys', () => {
    setCachedResponse('HOW TO VOTE', 'response');
    expect(getCachedResponse('how to vote')).toBe('response');
  });

  it('should trim whitespace for cache keys', () => {
    setCachedResponse('  vote  ', 'response');
    expect(getCachedResponse('vote')).toBe('response');
  });

  it('should clear all cache entries', () => {
    setCachedResponse('test1', 'r1');
    setCachedResponse('test2', 'r2');
    clearCache();
    expect(getCachedResponse('test1')).toBeUndefined();
    expect(getCachedResponse('test2')).toBeUndefined();
  });

  it('should return cache stats', () => {
    const stats = getCacheStats();
    expect(stats).toHaveProperty('hits');
    expect(stats).toHaveProperty('misses');
    expect(stats).toHaveProperty('keys');
    expect(typeof stats.keys).toBe('number');
  });

  it('should overwrite existing cache entries', () => {
    setCachedResponse('query', 'old');
    setCachedResponse('query', 'new');
    expect(getCachedResponse('query')).toBe('new');
  });
});
