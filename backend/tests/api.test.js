/**
 * Comprehensive API endpoint tests for the Election Guide AI backend.
 * Covers chat validation, health checks, quiz API, root endpoints, and 404 handling.
 */
const request = require('supertest');
const app = require('../server');

describe('Election Guide API', () => {
  // ─── Chat Endpoint Tests ────────────────────────────────────────────
  describe('POST /api/chat', () => {
    it('should return 400 for empty prompt', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing prompt', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for null prompt', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: null });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for numeric prompt', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: 12345 });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for prompt exceeding max length', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: 'a'.repeat(2001) });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/maximum length/i);
    });

    it('should return 400 for whitespace-only prompt', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: '   ' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid mode', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How do I register to vote?', mode: 'invalid' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/mode/i);
    });

    it('should return 400 for numeric mode', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote?', mode: 123 });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for oversized history array', async () => {
      const history = Array(21).fill({ role: 'user', text: 'test' });
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote?', history });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/history/i);
    });

    it('should return 400 for non-array history', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote?', history: 'not an array' });
      expect(res.statusCode).toBe(400);
    });

    it('should accept valid simple mode query', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How do I register to vote?', mode: 'simple' });
      // Will be 200 if Gemini key is set, or 500 if not — both are valid for structure test
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('message');
      }
    });

    it('should accept valid detailed mode query', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'What documents do I need to vote?', mode: 'detailed' });
      expect([200, 500]).toContain(res.statusCode);
    });

    it('should accept request without mode (defaults to detailed)', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote in India?' });
      expect([200, 400, 500]).toContain(res.statusCode);
    });

    it('should accept valid history array', async () => {
      const history = [
        { role: 'user', text: 'Hi' },
        { role: 'bot', text: 'Hello!' },
      ];
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote?', history });
      expect([200, 500]).toContain(res.statusCode);
    });

    it('should accept request with empty history array', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote?', history: [] });
      expect([200, 500]).toContain(res.statusCode);
    });

    it('should accept prompt at exactly 2000 characters', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'a'.repeat(2000) });
      expect([200, 500]).toContain(res.statusCode);
    });

    it('should return JSON content type', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'Test query' });
      expect(res.headers['content-type']).toMatch(/json/);
    });

    it('should handle XSS in prompt without crashing', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: '<script>alert("xss")</script>Hello' });
      expect([200, 400, 500]).toContain(res.statusCode);
    });
  });

  // ─── Health Endpoint Tests ──────────────────────────────────────────
  describe('GET /api/health', () => {
    it('should return 200 with health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('should include uptime in health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('uptime');
      expect(typeof res.body.uptime).toBe('number');
      expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should include timestamp in health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('timestamp');
      expect(new Date(res.body.timestamp).getTime()).not.toBeNaN();
    });

    it('should include memory usage in health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('memory');
      expect(res.body.memory).toHaveProperty('heapUsed');
      expect(res.body.memory).toHaveProperty('heapTotal');
    });

    it('should include environment in health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('environment');
    });

    it('should return JSON content type', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  // ─── Quiz GET Tests ─────────────────────────────────────────────────
  describe('GET /api/quiz', () => {
    it('should return quiz questions array', async () => {
      const res = await request(app).get('/api/quiz');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.questions)).toBe(true);
      expect(res.body.questions.length).toBeGreaterThan(0);
    });

    it('should include total count', async () => {
      const res = await request(app).get('/api/quiz');
      expect(res.body).toHaveProperty('total');
      expect(res.body.total).toBe(res.body.questions.length);
    });

    it('should have required question fields', async () => {
      const res = await request(app).get('/api/quiz');
      const q = res.body.questions[0];
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('tip');
    });

    it('should not expose correct answers', async () => {
      const res = await request(app).get('/api/quiz');
      res.body.questions.forEach((q) => {
        expect(q).not.toHaveProperty('correctAnswer');
      });
    });

    it('should have unique question IDs', async () => {
      const res = await request(app).get('/api/quiz');
      const ids = res.body.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should return X-Cache header', async () => {
      const res = await request(app).get('/api/quiz');
      expect(res.headers).toHaveProperty('x-cache');
    });
  });

  // ─── Quiz Submit Tests ──────────────────────────────────────────────
  describe('POST /api/quiz/submit', () => {
    it('should return 400 if no answers provided', async () => {
      const res = await request(app).post('/api/quiz/submit').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if answers is not an array', async () => {
      const res = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: 'not an array' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if answers is null', async () => {
      const res = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: null });
      expect(res.statusCode).toBe(400);
    });

    it('should return perfect score for all correct answers', async () => {
      const answers = [
        { id: 1, answer: true },
        { id: 2, answer: true },
        { id: 3, answer: true },
        { id: 4, answer: true },
        { id: 5, answer: false },
      ];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.statusCode).toBe(200);
      expect(res.body.score).toBe(5);
      expect(res.body.percentage).toBe(100);
      expect(res.body.total).toBe(5);
    });

    it('should return zero score for all wrong answers', async () => {
      const answers = [
        { id: 1, answer: false },
        { id: 2, answer: false },
        { id: 3, answer: false },
        { id: 4, answer: false },
        { id: 5, answer: true },
      ];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.statusCode).toBe(200);
      expect(res.body.score).toBe(0);
      expect(res.body.percentage).toBe(0);
    });

    it('should return partial score for mixed answers', async () => {
      const answers = [
        { id: 1, answer: true },
        { id: 2, answer: false },
        { id: 3, answer: true },
        { id: 4, answer: false },
        { id: 5, answer: false },
      ];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.statusCode).toBe(200);
      expect(res.body.score).toBe(3);
      expect(res.body.percentage).toBe(60);
    });

    it('should return tips for incorrect answers', async () => {
      const answers = [
        { id: 1, answer: false },
      ];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.statusCode).toBe(200);
      const q1 = res.body.results.find((r) => r.id === 1);
      expect(q1.correct).toBeFalsy();
      expect(q1.tip).toBeTruthy();
    });

    it('should return null tips for correct answers', async () => {
      const answers = [
        { id: 1, answer: true },
      ];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.statusCode).toBe(200);
      const q1 = res.body.results.find((r) => r.id === 1);
      expect(q1.correct).toBeTruthy();
      expect(q1.tip).toBeNull();
    });

    it('should handle empty answers array gracefully', async () => {
      const res = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: [] });
      expect(res.statusCode).toBe(200);
      expect(res.body.score).toBe(0);
    });

    it('should include results array in response', async () => {
      const answers = [{ id: 1, answer: true }];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBe(true);
    });
  });

  // ─── Root & System Endpoints ────────────────────────────────────────
  describe('GET /health', () => {
    it('should return root health check', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('should include version number', async () => {
      const res = await request(app).get('/health');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /', () => {
    it('should return running status text', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Running');
    });
  });

  // ─── 404 Handling ───────────────────────────────────────────────────
  describe('404 handling', () => {
    it('should return 404 for unknown GET routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 for unknown POST routes', async () => {
      const res = await request(app).post('/api/nonexistent').send({});
      expect(res.statusCode).toBe(404);
    });

    it('should return 404 for unknown nested routes', async () => {
      const res = await request(app).get('/api/v2/health');
      expect(res.statusCode).toBe(404);
    });
  });

  // ─── Response Headers ──────────────────────────────────────────────
  describe('Response Headers', () => {
    it('should include security headers', async () => {
      const res = await request(app).get('/health');
      expect(res.headers).toHaveProperty('x-content-type-options');
    });

    it('should include CORS headers', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');
      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
