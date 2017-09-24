const jwt = require('jsonwebtoken');
var config = require('config');

function createToken(user) {
  let scopes;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  if (user.admin) {
    scopes = 'admin';
  }
  // Sign the JWT
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      scope: scopes, 
      newPassword: user.newPassword // change password
    },
    config.get('secretkey'),
    { algorithm: 'HS256', expiresIn: '1h' }
  );
}

module.exports = createToken;
