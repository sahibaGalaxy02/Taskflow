const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow API running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
