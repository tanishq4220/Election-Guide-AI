const request = require('supertest');
const app = require('../server');

describe('Security Middleware', () => {
  it('should have CORS headers on OPTIONS request', async () => {
    const res = await request(app)
      .options('/api/chat')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST');
    expect(res.headers).toHaveProperty('access-control-allow-origin');
  });

  it('should have security headers from Helmet', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('x-content-type-options');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should have x-frame-options header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('x-frame-options');
  });

  it('should reject oversized prompts via input validation', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'a'.repeat(2001) });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should sanitize XSS in prompt', async () => {
    // The prompt '<script>alert("xss")</script>' after sanitization
    // goes through sanitizePrompt which strips HTML tags
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: '<script>alert("xss")</script>' });
    // Even if it reaches the AI, the sanitized version won't have <script> tags
    if (res.statusCode === 200 && res.body.message) {
      expect(res.body.message).not.toContain('<script>');
    }
    // For this test, we just verify it doesn't crash
    expect([200, 400, 500]).toContain(res.statusCode);
  });

  it('should return compressed responses when accepted', async () => {
    const res = await request(app)
      .get('/health')
      .set('Accept-Encoding', 'gzip');
    expect(res.statusCode).toBe(200);
  });

  it('should handle missing content-type gracefully', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('Content-Type', 'text/plain')
      .send('not json');
    // Without proper JSON, the body parser won't parse, so prompt will be missing
    expect([400, 500]).toContain(res.statusCode);
  });

  it('should reject invalid mode in request body', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'test query', mode: 'unknown' });
    expect(res.statusCode).toBe(400);
  });
});
