const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

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

module.exports = router;
