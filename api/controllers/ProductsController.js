const mongoose = require('mongoose');

const Product = require('../models/product');
const response = require('../utilities/responses');

const formatProduct = product => {
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
};

exports.all = (req, res, next) => {
  Product.find()
    .select('_id name price image')
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(product => formatProduct(product))
      };
      res.json(response);
    })
    .catch(error => response.serverError(res, error));
};

exports.create = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: 'products/' + req.file.filename
  });
  product
    .save()
    .then(result => res.json(formatProduct(result)))
    .catch(error => response.serverError(res, error));
};

exports.show = (req, res) => {
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
    .catch(error => response.serverError(res, error));
};

exports.update = (req, res) => {
  Product
    .update({_id: req.params.id}, {
      $set: {
        name: req.body.name,
        price: req.body.price
      }
    })
    .exec()
    .then(product => res.json(product))
    .catch(error => response.serverError(res, error));
};

exports.delete = (req, res) => {
  Product
    .remove({
      _id: req.params.id
    })
    .exec()
    .then(result => res.json(result))
    .catch(error => response.serverError(res, error));
};
