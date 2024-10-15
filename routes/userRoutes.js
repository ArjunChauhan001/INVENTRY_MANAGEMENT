
const express = require('express');
const { assignUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { roleAuthorization } = require('../middleware/roleMiddleware');

const router = express.Router();

router.put(
  '/:id/role',
  protect,
  roleAuthorization(['ADMIN']),
  assignUserRole
);


module.exports = router;
