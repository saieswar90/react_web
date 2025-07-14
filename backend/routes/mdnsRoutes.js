const express = require('express');
const router = express.Router();
const { discoverDevices } = require('../controllers/mdnsController');

// Route for discovering devices
router.get('/discover', discoverDevices);

module.exports = router; 