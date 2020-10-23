const express = require('express');
const ChangeLogsController = require('../controllers/ChangeLogsController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router.use(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin', 'admin'));

router
  .route('/')
  .get(ChangeLogsController.getAll)
  .post(ChangeLogsController.createChangeLog);

router
  .route('/:id')
  .get(ChangeLogsController.getChangeLog)
  .patch(ChangeLogsController.updateChangeLog)
  .delete(ChangeLogsController.deleteChangeLog);

module.exports = router;