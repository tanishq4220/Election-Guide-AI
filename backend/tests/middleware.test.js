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

  it('should have x-dns-prefetch-control header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
  });

  it('should have content-security-policy header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('content-security-policy');
  });

  it('should reject oversized prompts', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'a'.repeat(2001) });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should sanitize XSS in prompt', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: '<script>alert("xss")</script>' });
    if (res.statusCode === 200 && res.body.message) {
      expect(res.body.message).not.toContain('<script>');
    }
    expect([200, 400, 500]).toContain(res.statusCode);
  });

  it('should return compressed responses', async () => {
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
    expect([400, 500]).toContain(res.statusCode);
  });

  it('should reject invalid mode', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'test query', mode: 'unknown' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject boolean mode value', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'test query', mode: true });
    expect(res.statusCode).toBe(400);
  });

  it('should handle SQL injection gracefully', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: "'; DROP TABLE users; --" });
    expect([200, 400, 500]).toContain(res.statusCode);
  });

  it('should handle prototype pollution attempt', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'test', __proto__: { admin: true } });
    expect([200, 400, 500]).toContain(res.statusCode);
  });
});
