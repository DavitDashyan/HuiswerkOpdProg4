const express = require('express');
const router = express.Router();
const assert = require('assert');
const userController = require('../controllers/user.controllers');

router.get('/api/info', userController.userInfo);

// UC-201 Registreren als nieuwe user
router.post('/api/register', userController.addRegister);
// UC-202 Opvragen van overzicht van users
router.get('/api/user', userController.getAllUsers);

router.put('/api/user/:id', userController.userPut);

router.delete('/api/user/:id', userController.userDelete);

module.exports = router;
