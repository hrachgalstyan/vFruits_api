const express = require('express');
const CategoriesController = require('../controllers/CategoriesController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router
  .route('/')
  .get(CategoriesController.getAll)
  .post(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), CategoriesController.createCategory);

router
  .route('/:id')
  .get(CategoriesController.getCategory)
  .patch(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), CategoriesController.updateCategory)
  .delete(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin'), CategoriesController.deleteCategory);

module.exports = router;