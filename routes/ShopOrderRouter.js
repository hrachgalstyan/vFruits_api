const express = require('express');
const ShopOrderController = require('../controllers/ShopOrderController');
const AuthAdminController = require('../controllers/AuthAdminController');
const AuthUserController = require('../controllers/AuthUserController');

const router = express.Router();

router
  .route('/')
  .get(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), ShopOrderController.getAll)
  .post(AuthUserController.protect, ShopOrderController.createShopOrder);

router.use(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'));

router
  .route('/:id')
  .get(ShopOrderController.getShopOrder)
  .patch(ShopOrderController.updateShopOrder)
  .delete(ShopOrderController.deleteShopOrder);

router
  .route('/admin-order')
  .post(ShopOrderController.createShopOrder);

module.exports = router;