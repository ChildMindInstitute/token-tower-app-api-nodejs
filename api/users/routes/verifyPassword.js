const Boom = require('boom');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const config = require('config');

module.exports = {
  method: 'GET',
  path: '/api/users/verifyPassword/{token}',
  config: {
    auth: false,
    handler: (req, res) => {
      jwt.verify(req.params.token, config.get('secretkey'), (err, decoded) => {
        if (decoded === undefined) return res(Boom.forbidden('invalid verification link'));

        User.findOne({ _id: decoded.id }, (err, user) => {
          if (err) {
            console.error(err);
            return res(Boom.badImplementation(err));
          }
          if (user === null) return res(Boom.forbidden('invalid verification link'));
          user.password = decoded.newPassword;
          User.findOneAndUpdate({ _id: decoded.id }, user, (err, user) => {
            if (err) {
              console.error(err);
              return res(Boom.badImplementation(err));
            }
            return res({ message: 'account sucessfully changed password' });
          })
        })
      });
    }
  }
};
