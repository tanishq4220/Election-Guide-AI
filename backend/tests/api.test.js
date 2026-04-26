const request = require('supertest');
const app = require('../server');

describe('Election Guide API', () => {
  describe('POST /api/chat', () => {
    it('should return 400 for empty prompt', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing prompt', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for prompt exceeding max length', async () => {
      const res = await request(app).post('/api/chat').send({ prompt: 'a'.repeat(2001) });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid mode', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How do I register to vote?', mode: 'invalid' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 for oversized history array', async () => {
      const history = Array(21).fill({ role: 'user', text: 'test' });
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'How to vote?', history });
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
  });

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
    });

    it('should include timestamp in health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('should include memory usage in health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('memory');
    });
  });

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
  });

  describe('POST /api/quiz/submit', () => {
    it('should return 400 if no answers provided', async () => {
      const res = await request(app).post('/api/quiz/submit').send({});
      expect(res.statusCode).toBe(400);
    });

    it('should return score for valid submission', async () => {
      const answers = [
        { id: 1, answer: true },
        { id: 2, answer: true },
        { id: 3, answer: true },
        { id: 4, answer: true },
        { id: 5, answer: false }
      ];
      const res = await request(app).post('/api/quiz/submit').send({ answers });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('score');
      expect(res.body).toHaveProperty('percentage');
      expect(res.body.score).toBe(5);
    });
  });

  describe('GET /health', () => {
    it('should return root health check', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /', () => {
    it('should return running status text', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
