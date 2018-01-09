exports.serverError = (res, error) => {
  return res.status(500).json({
    error: error
  });
};

exports.unauthorized = res => {
  return res.status(401).json({
    error: 'Authorization failed.'
  });
};
