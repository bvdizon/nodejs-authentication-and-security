const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // getting the token from the request "Headers"
    const token = req.header('Authorization').replace('Bearer ', '');

    // verifying the token, "bvdizon" is the secretPrivateKey when user was created
    const decoded = jwt.verify(token, 'bvdizon');

    // decoded returns an object, use the properties to query db
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    // pass the user as a property to req object
    req.user = user;

    next();
  } catch (error) {
    res.send(401).send({ error: 'Unable to authenticate.' });
  }
};

module.exports = auth;
