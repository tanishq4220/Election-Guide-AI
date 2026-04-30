const constants = require('../constants');

describe('Constants Module', () => {
  it('should export MAX_PROMPT_LENGTH as 2000', () => {
    expect(constants.MAX_PROMPT_LENGTH).toBe(2000);
  });

  it('should export MAX_HISTORY_LENGTH as 20', () => {
    expect(constants.MAX_HISTORY_LENGTH).toBe(20);
  });

  it('should export DEFAULT_TRUNCATE_LIMIT as 10', () => {
    expect(constants.DEFAULT_TRUNCATE_LIMIT).toBe(10);
  });

  it('should export valid VALID_MODES', () => {
    expect(constants.VALID_MODES).toContain('simple');
    expect(constants.VALID_MODES).toContain('detailed');
    expect(constants.VALID_MODES).toHaveLength(2);
  });

  it('should export HTTP_STATUS codes', () => {
    expect(constants.HTTP_STATUS.OK).toBe(200);
    expect(constants.HTTP_STATUS.BAD_REQUEST).toBe(400);
    expect(constants.HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(constants.HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
    expect(constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  });

  it('should export ERROR_MESSAGES', () => {
    expect(constants.ERROR_MESSAGES).toHaveProperty('PROMPT_REQUIRED');
    expect(constants.ERROR_MESSAGES).toHaveProperty('AI_FAILURE');
    expect(constants.ERROR_MESSAGES).toHaveProperty('RATE_LIMITED');
    expect(constants.ERROR_MESSAGES).toHaveProperty('ENDPOINT_NOT_FOUND');
  });

  it('should have positive rate limits', () => {
    expect(constants.GLOBAL_RATE_LIMIT).toBeGreaterThan(0);
    expect(constants.CHAT_RATE_LIMIT).toBeGreaterThan(0);
    expect(constants.RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0);
  });

  it('should have chat rate limit stricter than global', () => {
    expect(constants.CHAT_RATE_LIMIT).toBeLessThan(constants.GLOBAL_RATE_LIMIT);
  });

  it('should export BigQuery config', () => {
    expect(constants.BQ_DATASET).toBe('election_guide');
    expect(constants.BQ_TABLE).toBe('chat_events');
  });

  it('should export LOG_NAME', () => {
    expect(constants.LOG_NAME).toBe('election-guide-api');
  });

  it('should export compression settings', () => {
    expect(constants.COMPRESSION_LEVEL).toBeGreaterThanOrEqual(1);
    expect(constants.COMPRESSION_LEVEL).toBeLessThanOrEqual(9);
    expect(constants.COMPRESSION_THRESHOLD).toBeGreaterThan(0);
  });
});
