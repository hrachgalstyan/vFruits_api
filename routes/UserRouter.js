const express = require('express');
const UsersController = require('../controllers/UsersController');
const AuthUserController = require('../controllers/AuthUserController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router.post('/signup', AuthUserController.signup);
router.post('/login', AuthUserController.login);
router.get('/logout', AuthUserController.logout);
router.post('/forgotPassword', AuthUserController.forgotPassword);
router.patch('/resetPassword/:token', AuthUserController.resetPassword);

router.patch('/updateMyPassword', AuthUserController.protect, AuthUserController.updatePassword);
router.get('/me', AuthUserController.protect, UsersController.getMe, UsersController.getOne);
router.patch('/updateMe', AuthUserController.protect, UsersController.updateMe);
router.delete('/deleteMe', AuthUserController.protect, UsersController.deleteMe);

router.use(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'));

router
  .route('/')
  .get(UsersController.getAll)
  .post(UsersController.createUser);

router
  .route('/:id')
  .get(UsersController.getOne)
  .patch(UsersController.updateUser)
  .delete(UsersController.deleteUser);

module.exports = router;