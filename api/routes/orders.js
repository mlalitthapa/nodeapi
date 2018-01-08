const express = require('express');
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Order.find().exec()
    .then(orders => {
      res.send({
        count: orders.length,
        orders: orders.map(order => {
          return {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + order._id
            }
          }
        })
      });
    })
    .catch(error => res.status(500).json({
      error: error
    }));
});

router.post('/', (req, res, next) => {

  Product.findById(req.body.productId)
    .then(product => {

      if (!product)
        return res.status(404).json({
          error: 'Product not found.'
        });

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      order.save()
        .then(order => {
          res.send({
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + order._id
            }
          });
        })
        .catch(error => {
          res.status(500).json({
            error: error
          })
        });
    })
    .catch(error => res.status(500).json({
      error: error
    }));

});

router.get('/:id', (req, res) => {
  Order.findById(req.params.id)
    .then(order => {
      if (!order)
        return res.status(404).json({
          error: 'Order not found'
        });

      res.send({
        _id: order._id,
        product: order.product,
        quantity: order.quantity
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      })
    })
});

router.delete('/:id', (req, res) => {
  Order.remove({
    _id: req.params.id
  })
    .exec()
    .then(() => res.send({
      message: 'Order removed'
    }))
    .catch(error => res.status(500).json({
      error: error
    }));
});

module.exports = router;
