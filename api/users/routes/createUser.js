const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');
const mail = require('../../../helper/mail');
const password = require('../util/password');

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    auth: false,
    // Before the route handler runs, verify that the user is unique
    pre: [{ method: verifyUniqueUser }],
    handler: (req, res) => {
      let user = new User();
      user.email = req.payload.email;
      user.username = req.payload.username;
      user.admin = false;
      user.isVerified = false;
      password.hashPassword(req.payload.password, (err, hash) => {
        if (err) throw Boom.badRequest(err);
        
        user.password = hash;
        user.save((err, user) => {
          if (err) throw Boom.badRequest(err);

          const token = createToken(user);
          mail.sentMailVerificationLink(user, token);
          // If the user is saved successfully, issue a JWT
          res({ id_token: token }).code(201);
        });
      });
    },
    // Validate the payload against the Joi schema
    validate: {
      payload: createUserSchema
    }
  }
};
