const express = require('express');

const authenticate = require('../middleware/authenticate');
const OrdersController = require('../controllers/OrdersController');

const router = express.Router();

router.get('/', OrdersController.all);

router.post('/', authenticate, OrdersController.create);

router.get('/:id', OrdersController.show);

router.delete('/:id', authenticate, OrdersController.delete);

module.exports = router;
