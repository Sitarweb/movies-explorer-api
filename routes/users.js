const router = require('express').Router();
const { getMe, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validation');

router.get('/me', getMe);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
