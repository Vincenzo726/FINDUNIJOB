const router = require('express').Router();
const controller = require('../controllers/job.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
router.get('/', controller.list); router.get('/:id', controller.getOne);
router.post('/', authenticate, authorize('COMPANY'), controller.create);
router.patch('/:id', authenticate, authorize('COMPANY'), controller.update);
router.delete('/:id', authenticate, authorize('COMPANY'), controller.remove);
module.exports = router;