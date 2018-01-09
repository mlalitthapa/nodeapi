const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');
const authenticate = require('../middleware/authenticate');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/products');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const hasFile = (req, res, next) => {
  if(!req.file) {
    return res.status(422).json({
      error: 'Please select image file for product.'
    })
  }
  next();
};

router.get('/', (req, res, next) => {
  Product.find()
    .select('_id name price image')
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(product => {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            detail: {
              type: 'GET',
              url: `http://localhost:3000/products/${product._id}`
            }
          };
        })
      };
      res.json(response);
    })
    .catch(error => res.status(500).json({
      error: error
    }));
});

router.post('/', authenticate, upload.single('image'), hasFile, (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: 'products/' + req.file.filename
  });
  product
    .save()
    .then(result => {
      res.json({
        _id: result._id,
        name: result.name,
        price: result.price,
        image: result.image
      })
    })
    .catch(error => res.status(500).json({
      error: error
    }));
});

router.get('/:id', (req, res) => {
  Product.findById(req.params.id)
    .select("_id name price image")
    .then(product => {
      if (product)
        res.json(product);
      else
        res.status(404)
          .json({
            error: 'Product not found'
          });
    })
    .catch(error => res.status(500).json({
      error: error
    }));
});

router.patch('/:id', authenticate, (req, res) => {
  Product
    .update({_id: req.params.id}, {
      $set: {
        name: req.body.name,
        price: req.body.price
      }
    })
    .exec()
    .then(product => res.json(product))
    .catch(error => res.status(500).json({
      error: error
    }));
});

router.delete('/:id', authenticate, (req, res) => {
  Product
    .remove({
      _id: req.params.id
    })
    .exec()
    .then(result => res.json(result))
    .catch(error => res.status(500).json({
      error: error
    }));
});

module.exports = router;
