const auth = async (req, res, next) => {
  console.log('hello from auth.js');
  next();
};

module.exports = auth;
