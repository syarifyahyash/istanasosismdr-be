const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, 'editifugae', { expiresIn: '24h' });
}

const decodeToken = (token) => {
  return jwt.verify(token, 'editifugae')
}

module.exports = {
  generateToken,
  decodeToken
}