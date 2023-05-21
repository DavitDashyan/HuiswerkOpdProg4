const assert = require('assert');
const logger = require('../util/utils').logger;
const dbconnection = require('../../dbconnection');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../config/config').jwtSecretKey;
const { connect } = require('http2');

console.log('test voor login');
module.exports = {
  login: (req, res, next) => {
    dbconnection.getConnection((err, connection) => {
      if (err) {
        logger.error('error getting connection from pool');
        res.status(500).json({
          status: 500,
          message: err.toString(),
          data: {}
        });
        return;
      }

      connection.query(
        'SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress=?',
        [req.body.emailAdress],
        (err, rows, fields) => {
          connection.release();
          if (err) {
            logger.error('Error: ', err.toString());
            res.status(500).json({
              status: 500,
              message: err.toString(),
              data: {}
             // datetime: new Date().toISOString()
            });
            return;
          }

          if (rows.length === 1) {
            if (rows[0].password === req.body.password) {
              logger.info(
                'password DID match, sending userinfo and valid token'
              );
              const { password, ...userinfo } = rows[0];

              const payload = {
                userId: userinfo.id
              };

              jwt.sign(
                payload,
                jwtSecretKey,
                { expiresIn: '14d' },
                function (err, token) {
                  if (err) {
                    logger.error('Error signing JWT:', err);
                    res.status(500).json({
                      status: 500,
                      message: 'Error signing JWT',
                      data: {}
                    });
                    return;
                  }

                  logger.debug('User logged in sending:', userinfo);
                  res.status(200).json({
                    status: 200,
                    results: { ...userinfo, token }
                  });
                }
              );
            } else {
              logger.info('Password invalid');
              res.status(400).json({
                status: 400,
                message: 'User not found or password invalid',
                data: {}
              });
            }
          } else {
            logger.info('User not found');
            res.status(404).json({
              status: 404,
              message: 'User not found or password invalid',
              data: {}
            });
          }
        }
      );
    });
  },

  validateLogin: (req, res, next) => {
    try {
      console.log('typeOf string=', req.body.emailAdress);
      assert(
        typeof req.body.emailAdress === 'string',
        'email must be a string.'
      );
      assert(
        typeof req.body.password === 'string',
        'password must be a string.'
      );
      next();
    } catch (ex) {
      res.status(400).json({
        status: 400,
        message: 'Invalid required field',
        data: {}
        //datetime: new Date().toISOString()
      });
    }
  },
  validateToken(req, res, next) {
    logger.info('validateToken called');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn('Authorization header missing!');
      res.status(401).json({
        status: 401,
        message: 'Authorization header missing!',
        date: {}
      });
    } else {
      const token = authHeader.substring(7, authHeader.length);

      console.log('AAAA jwtSecretKey=', jwtSecretKey); //'process.env.JWT_SECRET',
      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn('Not autherized'),
            res.status(401).json({
              status: 401,
              message: 'Not authorized',
              data: {}
            });
        }
        if (payload) {
          logger.debug('token is valid', payload);

          req.userId = payload.userId;
          if (!req.userId) req.userId = payload.id;

          console.log('end of ValidateToken', payload.id);
          next();
        }
      });
    }
  }
};
