const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const responses = require('../utilities/responses');

const formatOrder = order => {
  return {
    _id: order._id,
    product: order.product,
    quantity: order.quantity,
    request: {
      type: 'GET',
      url: 'http://localhost:3000/orders/' + order._id
    }
  }
};

exports.all = (req, res, next) => {
  Order.find().exec()
    .then(orders => {
      res.send({
        count: orders.length,
        orders: orders.map(order => {
          return formatOrder(order);
        })
      });
    })
    .catch(error => responses.serverError(res, error));
};

exports.create = (req, res, next) => {

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
          res.send(formatOrder(order));
        })
        .catch(error => responses.serverError(res, error));
    })
    .catch(error => responses.serverError(res, error));

};

exports.show = (req, res) => {
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
    .catch(error => responses.serverError(res, error));
};

exports.delete = (req, res) => {
  Order.remove({
    _id: req.params.id
  })
    .exec()
    .then(() => res.send({
      message: 'Order removed'
    }))
    .catch(error => responses.serverError(res, error));
};
