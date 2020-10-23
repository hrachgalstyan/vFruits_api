const express = require('express');
const AdminsController = require('../controllers/AdminsController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router.post('/login', AuthAdminController.login);
router.get('/logout', AuthAdminController.logout);

router.use(AuthAdminController.protect);

router.patch('/updateMyPassword', AuthAdminController.updatePassword);
router.get('/me', AdminsController.getMe, AdminsController.getOne);
router.patch('/updateMe', AdminsController.updateMe);

router.use(AuthAdminController.restrictTo('super_admin'));

router
  .route('/')
  .get(AdminsController.getAll)
  .post(AdminsController.createAdmin);

router
  .route('/:id')
  .get(AdminsController.getOne)
  .patch(AdminsController.updateAdmin)
  .delete(AdminsController.deleteAdmin);

module.exports = router;