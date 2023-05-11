const express = require('express');
const router = express.Router();
const assert = require('assert');
const userController = require('../controllers/user.controllers');

router.get('/api/info', userController.userInfo);
// UC-201 Registreren als nieuwe user
router.post('/api/register',userController.validateUser, userController.addRegister);
// UC-202 Opvragen van overzicht van users
router.get('/api/user', userController.getAllUsers);

router.get('/api/meal', userController.getAllMeals);

router.put('/api/user/:id', userController.userPut);

router.delete('/api/user/:id', userController.userDelete);

router.get('/api/user/:id', /*userController.validateUser,*/ userController.getUserById);

router.get('/api/meal/:id',  userController.getMealById);

module.exports = router;
