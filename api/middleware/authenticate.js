const jwt = require('jsonwebtoken');
const config = require('../../config/app');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, config.env.JWT_KEY);
    req.userData = decode;
    next();
  } catch (error) {
    return res.status(401)
      .json({
        error: 'Authentication failed'
      });
  }
};
