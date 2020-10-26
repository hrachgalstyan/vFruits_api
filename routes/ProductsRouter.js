const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const AuthAdminController = require('../controllers/AuthAdminController');
const Products = require('../models/Products');

const router = express.Router();

router
  .route('/new-products')
  .get(ProductsController.aliasNewProducts, ProductsController.getAll);

router
  .route('/best-sale')
  .get(ProductsController.aliasBestSale, ProductsController.getAll);

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