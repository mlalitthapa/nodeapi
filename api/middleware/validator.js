exports.hasFile = (req, res, next) => {
  if(!req.file) {
    return res.status(422).json({
      error: 'Please select image file for product.'
    })
  }
  next();
};
