const jwt = require('jsonwebtoken');

const privateKey = 'secretString';

jwt.sign(
  { userId: 1 },
  privateKey,
  //  { algorithm: 'RS256' },
  function (err, token) {
    if (err) console.log(err);
    if (token) console.log(token);
  }
);
