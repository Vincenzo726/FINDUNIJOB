const router = require('express').Router();
const controller = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
router.use(authenticate);
router.post('/', authorize('STUDENT'), controller.create);
router.get('/mine', authorize('STUDENT'), controller.mine);
router.get('/received', authorize('COMPANY'), controller.received);
router.patch('/:id/status', authorize('COMPANY'), controller.updateStatus);
module.exports = router;