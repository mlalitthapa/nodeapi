exports.serverError = (res, error) => {
  return res.status(500).json({
    error: error
  });
};
