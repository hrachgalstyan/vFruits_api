const express = require('express');
const PaymentsController = require('../controllers/PaymentsController');
const AuthAdminController = require('../controllers/AuthAdminController');
const AuthUserController = require('../controllers/AuthUserController');

const router = express.Router();

router
  .route('/')
  .get(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), PaymentsController.getAll)
  .post(AuthUserController.protect, PaymentsController.createPayment);

router
  .route('/:id')
  .get(AuthUserController.protect, PaymentsController.getPayment)
  .patch(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), PaymentsController.updatePayment)
  .delete(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), PaymentsController.deletePayment);

module.exports = router;