const request = require('supertest');
const app = require('../server/index');

describe('Paper Stream API', () => {
  test('Health endpoint returns OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.cache).toBeDefined();
  });

  test('Papers endpoint returns papers for valid tags', async () => {
    const res = await request(app)
      .get('/api/papers?tags=machine%20learning&includePreprints=true');
    expect(res.statusCode).toBe(200);
    expect(res.body.papers).toBeDefined();
    expect(Array.isArray(res.body.papers)).toBe(true);
    expect(res.body.timestamp).toBeDefined();
  });

  test('Papers endpoint requires tags parameter', async () => {
    const res = await request(app).get('/api/papers');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Tags parameter is required');
  });
});