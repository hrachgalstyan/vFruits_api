const express = require('express');
const DailyTotalsController = require('../controllers/DailyTotalsController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router.use(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin', 'admin'));

router
  .route('/')
  .get(DailyTotalsController.getAll)

module.exports = router;