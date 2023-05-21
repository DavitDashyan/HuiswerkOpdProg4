const express = require('express');
const router = express.Router();
const assert = require('assert');
const authControllers = require('../controllers/auth.controllers');

router.post('/api/login', authControllers.validateLogin, authControllers.login);

module.exports = router;
