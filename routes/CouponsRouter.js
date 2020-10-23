const express = require('express');
const CouponsController = require('../controllers/CouponsController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router
  .route('/')
  .get(CouponsController.getAll)
  .post(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), CouponsController.createCoupon);

router.use(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin', 'admin'));

router
  .route('/:id')
  .get(CouponsController.getCoupon)
  .patch(CouponsController.updateCoupon)
  .delete(CouponsController.deleteCoupon);

module.exports = router;