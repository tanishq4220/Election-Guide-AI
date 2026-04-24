const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  it('should return error for chat without prompt', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({});
    expect(res.statusCode).toEqual(400);
  });
});
