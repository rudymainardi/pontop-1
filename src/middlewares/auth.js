const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader)
    return res.status(401).send({
      success: false,
      error: 'No token provider'
    });
    
  const parts = authHeader.split(' ');
    
  if(!parts.length === 2)
    return res.status(401).send({
      success: false,
      error: 'Invalid token'
    });

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme))
    return res.status(401).send({
      success: false,
      error: 'Token malformatted'
    });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if(err) return res.status(401).send({
      success: false,
      error: 'Token invalid'
    });

    req.userId = decoded.id;
    return next();
  });
};