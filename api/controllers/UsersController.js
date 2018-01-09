const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const response = require('../utilities/responses');
const User = require('../models/user');
const config = require('../../config/app');

exports.register = (req, res, next) => {

  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length) {
        return res.status(422)
          .json({
            error: 'Email already exists'
          });
      } else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            return response.serverError(res, error);
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(() => res.json({
                message: 'User successfully created'
              }))
              .catch(error => response.serverError(res, error));
          }
        });
      }
    });
};

exports.login = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        response.unauthorized(res);
      } else {

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                id: user[0]._id
              },
              config.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.send({
              message: "Successfully logged in",
              token: token
            });
          }

          response.unauthorized(res);
        })
      }
    })
    .catch(error => response.serverError(res, error))
};
