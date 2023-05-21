const express = require('express');
const router = express.Router();
const assert = require('assert');
const userController = require('../controllers/user.controllers');
const authControllers = require('../controllers/auth.controllers');

router.get('/api/info', userController.userInfo); //ok
 
router.post('/api/user', userController.addRegister); //ok
 
router.get('/api/user', authControllers.validateToken, userController.getAllUsers); //ok and filter ok

router.get('/api/user/profile', authControllers.validateToken, userController.getProfile); // 

router.get('/api/user/:id', authControllers.validateToken, userController.getUserById); //ok 

router.put('/api/user/:id', authControllers.validateToken, userController.updateUserById); //ok

router.delete('/api/user/:id', authControllers.validateToken, userController.userDelete); //ok


//meal

router.get('/api/meal', userController.getAllMeals); //ok

router.post('/api/meal', authControllers.validateToken, userController.postMeal); //ok

router.get('/api/meal/:id', userController.getMealById); //ok

router.delete('/api/meal/:id', authControllers.validateToken, userController.deleteMeal); //ok

module.exports = router;
