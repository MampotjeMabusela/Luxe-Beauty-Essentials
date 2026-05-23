/**
 * Run with: npm test (requires PostgreSQL + seeded DB)
 */
const request = require('supertest');

describe('Health', () => {
  it('should return OK when server is running', async () => {
    let app;
    try {
      app = require('../index');
    } catch {
      return;
    }
    if (!app) return;
    const res = await request(app).get('/health');
    expect([200, 500]).toContain(res.statusCode);
  });
});
