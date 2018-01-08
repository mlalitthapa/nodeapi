const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
    .select('_id name price')
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(product => {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
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

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      res.json(result)
    })
    .catch(error => res.status(500).json({
      error: error
    }));
});

router.get('/:id', (req, res) => {
  Product.findById(req.params.id)
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

router.patch('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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
