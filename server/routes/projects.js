const express = require('express');
const router = express.Router();

// Sample GET endpoint for projects
router.get('/', (req, res) => {
  res.json({ message: 'Projects API is working!' });
});

// You can add more endpoints here as needed

module.exports = router;