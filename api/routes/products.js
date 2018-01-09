const express = require('express');

const authenticate = require('../middleware/authenticate');
const upload = require('../utilities/multerConfig');
const validator = require('../middleware/validator');
const ProductsController  = require('../controllers/ProductsController');

const router = express.Router();

router.get('/', ProductsController.all);

router.post('/', authenticate, upload.single('image'), validator.hasFile, ProductsController.create);

router.get('/:id', ProductsController.show);

router.patch('/:id', authenticate, ProductsController.update);

router.delete('/:id', authenticate, ProductsController.delete);

module.exports = router;
