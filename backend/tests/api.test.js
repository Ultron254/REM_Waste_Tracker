// backend/tests/api.test.js
const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  it('should reject invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'wronguser', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Invalid username or password");
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('message', 'Login successful');
  });
});

describe('Pickup CRUD Endpoints', () => {
  let createdId;
  const db = app.get('db');

  beforeAll(() => {
    db.set('pickups', []).write();
  });

  it('GET /api/pickups should return empty list initially', async () => {
    const res = await request(app).get('/api/pickups');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /api/pickups should create a new pickup', async () => {
    const newItem = { description: 'Test Pickup', weight: '10' };
    const res = await request(app)
      .post('/api/pickups')
      .send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.description).toBe(newItem.description);
    expect(res.body.weight).toBe(newItem.weight);
    createdId = res.body.id;
  });

  it('GET /api/pickups should now include the new item', async () => {
    const res = await request(app).get('/api/pickups');
    expect(res.statusCode).toBe(200);
    const items = res.body;
    const added = items.find(p => p.id === createdId);
    expect(added).toBeDefined();
    expect(added.description).toBe('Test Pickup');
  });

  it('PUT /api/pickups/:id should update the item', async () => {
    const updates = { description: 'Updated Pickup' };
    const res = await request(app)
      .put(`/api/pickups/${createdId}`)
      .send(updates);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdId);
    expect(res.body.description).toBe('Updated Pickup');
  });

  it('GET /api/pickups should get the updated item', async () => {
    const res = await request(app).get(`/api/pickups`);
    const item = res.body.find(p => p.id === createdId);
    expect(item).toBeDefined();
    expect(item.description).toBe('Updated Pickup');
  });

  it('DELETE /api/pickups/:id should delete the item', async () => {
    const res = await request(app).delete(`/api/pickups/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('GET /api/pickups should return empty list after deletion', async () => {
    const res = await request(app).get('/api/pickups');
    expect(res.statusCode).toBe(200);
    expect(res.body.find(p => p.id === createdId)).toBeUndefined();
  });

  it('DELETE /api/pickups/:id on non-existent item should return 404', async () => {
    const res = await request(app).delete(`/api/pickups/999999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
