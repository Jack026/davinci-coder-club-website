const express = require('express');
const router = express.Router();

// Example admin GET endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Admin API is working!',
    success: true
  });
});

// Example admin authentication endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Replace this with your actual admin authentication logic!
  if (username === 'jack026' && password === 'DaVinci2025@Jack026') {
    return res.json({ message: 'Login successful!', success: true });
  }
  return res.status(401).json({ error: 'Invalid credentials', success: false });
});

module.exports = router; // <-- this is correct!