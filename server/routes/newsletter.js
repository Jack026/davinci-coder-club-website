const express = require('express');
const router = express.Router();

// POST /api/newsletter - subscribe to newsletter
router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required.' });
  }
  // TODO: Save the email to your database or third-party service here.
  return res.json({ message: 'Successfully subscribed to newsletter!', success: true });
});

// GET /api/newsletter - check API is working
router.get('/', (req, res) => {
  res.json({ message: 'Newsletter API is working!' });
});

module.exports = router;