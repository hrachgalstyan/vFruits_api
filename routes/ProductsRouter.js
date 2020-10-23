const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router
  .route('/')
  .get(ProductsController.getAll)
  .post(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), ProductsController.createProduct);

router
  .route('/:id')
  .get(ProductsController.getProduct)
  .patch(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), ProductsController.updateProduct)
  .delete(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), ProductsController.deleteProduct);

module.exports = router;