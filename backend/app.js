// backend/app.js
const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Initialize database
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default structure of the database if it's empty
db.defaults({ users: [], pickups: [] }).write();

// Ensure a default user exists for login (username: admin, password: password)
const defaultUser = { username: 'admin', password: 'password' };
const userExists = db.get('users').find({ username: defaultUser.username }).value();
if (!userExists) {
  db.get('users').push(defaultUser).write();
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Expose db to tests
app.set('db', db);

// POST /login - validate user credentials
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.get('users').find({ username }).value();
  if (user && user.password === password) {
    return res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

// GET /api/pickups - retrieve all pickups
app.get('/api/pickups', (req, res) => {
  const pickups = db.get('pickups').value();
  res.json(pickups);
});

// POST /api/pickups - create a new pickup record
app.post('/api/pickups', (req, res) => {
  const newPickup = req.body;
  if (!newPickup || !newPickup.description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  newPickup.id = Date.now();
  db.get('pickups').push(newPickup).write();
  res.status(201).json(newPickup);
});

// PUT /api/pickups/:id - update an existing pickup
app.put('/api/pickups/:id', (req, res) => {
  const pickupId = Number(req.params.id);
  const updates = req.body;
  const pickup = db.get('pickups').find({ id: pickupId });
  if (pickup.value()) {
    pickup.assign(updates).write();
    const updatedRecord = db.get('pickups').find({ id: pickupId }).value();
    res.json(updatedRecord);
  } else {
    res.status(404).json({ error: 'Pickup not found' });
  }
});

// DELETE /api/pickups/:id - delete a pickup record
app.delete('/api/pickups/:id', (req, res) => {
  const pickupId = Number(req.params.id);
  const removed = db.get('pickups').remove({ id: pickupId }).write();
  if (removed.length > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Pickup not found' });
  }
});

module.exports = app;
