const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../../config/app');

const router = express.Router();

router.post('/signup', (req, res, next) => {

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
            return res.status(500).json({
              error: error
            })
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
              .catch(error => res.status(500).json({
                error: error
              }));
          }
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(401)
          .json({
            error: "Invalid email or password"
          })
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
          res.status(401)
            .json({
              error: "Invalid email or password"
            })
        })
      }
    })
    .catch(error => res.status(500).json({
      error: error
    }))
});

module.exports = router;
