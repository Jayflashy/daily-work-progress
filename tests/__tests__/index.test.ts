
import request from 'supertest';
import app from '../../src/index'; 

describe('Test Express routes', () => {
  it('should return 200 and Hello message on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, How are you doing today?');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Endpoint not found.');
  });

  it('should return integration JSON for GET /integration.json', async () => {
    const response = await request(app).get('/integration.json');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data"); // assuming your JSON file has 'data'
  });
});
