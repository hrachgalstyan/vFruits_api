const express = require('express');
const ActivityLogsController = require('../controllers/ActivityLogsController');
const AuthAdminController = require('../controllers/AuthAdminController');

const router = express.Router();

router.use(AuthAdminController.protect, AuthAdminController.restrictTo('super_admin', 'admin'));

router
  .route('/')
  .get(ActivityLogsController.getAll)
  .post(ActivityLogsController.createActivityLog);

router
  .route('/:id')
  .get(ActivityLogsController.getActivityLog)
  .patch(ActivityLogsController.updateActivityLog)
  .delete(ActivityLogsController.deleteActivityLog);

module.exports = router;