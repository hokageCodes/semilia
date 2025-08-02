const request = require('supertest');
const app = require('../../app');

describe('Health Check', () => {
  it('should return API is healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('API is healthy 🚀');
  });
});
