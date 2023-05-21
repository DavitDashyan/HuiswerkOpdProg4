const assert = require('assert');
const logger = require('../util/utils').logger;
const dbconnection = require('../../dbconnection');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../config/config').jwtSecretKey;
const { connect } = require('http2');

console.log('test voor login');
module.exports = {
  login: (req, res, next) => {
    // const { emailAdress, password } = req.body;
    // console.log(`${emailAdress} ${password}`);

    // const queryString =
    //   'SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress=?';

    dbconnection.getConnection((err, connection) => {
      if (err) {
        logger.error('error getting connection from pool');
        res.status(500).json({
          error: err.toString(),
          datetime: new Date().toString()
        });
      } // not connected!

      if (connection) {
        connection.query(
          'SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress=?',
          [req.body.emailAdress],
          (err, rows, fields) => {
            connection.release();
            if (err) {
              logger.error('Error: ', err.toString());
              res.status(500).json({
                error: err.toString(),
                datetime: new Date().toISOString()
              });
            }
            if (rows) {
              if (
                rows &&
                rows.length === 1 &&
                rows[0].password == req.body.password
              ) {
                logger.info(
                  'password DID match, sending userinfo and valid token'
                );
                const { password, ...userinfo } = rows[0];

                const payload = {
                  userId: userinfo.id
                };

                jwt.sign(
                  payload,
                  //'process.env.JWT_SECRET',
                  jwtSecretKey,
                  { expiresIn: '14d' },
                  function (err, token) {
                    console.log('jwtSecretKey=', jwtSecretKey);
                    console.log('err=', err);
                    logger.debug('User logged in sending:', userinfo);
                    res.status(200).json({
                      statusCode: 200,
                      results: { ...userinfo, token }
                    });
                  }
                );
              } else {
                logger.info('User not found or password invalid');
                res.status(404).json({
                  message: 'User not found or password invalid',
                  status: 404,
                  data: {}
                  //datetime: new Date.toISOString()
                });
              }
            }
          }
        );
      }
      // Use the connection
      // connection.query(
      //   queryString,
      //   [emailAdress],
      //   function (error, results, fields) {
      //     // When done with the connection, release it.
      //     connection.release();

      //     console.log('error = ', error);
      //     // Handle error after the release.
      //     if (error) logger.error('Error: ', err.toString());
      //     res.status(500).json({
      //       error: err.toString(),
      //       datetime: new Date().toISOString()
      //     });

      //     if (results && results.length === 1) {
      //       console.log(results);
      //       const user = results[0];

      //       if (user.password === password) {
      //         // email en password correct!

      //         jwt.sign(
      //           { userId: user.id },
      //           'process.env.JWT_SECRET',
      //           { expiresIn: '30d' },
      //           //  { algorithm: 'RS256' },
      //           function (err, token) {
      //             if (err) console.log(err);
      //             if (token) {
      //               console.log(token);
      //               res.status(200).json({
      //                 statusCode: 200,
      //                 results: token
      //               });
      //             }
      //           }
      //         );
      //       } else {
      //         //password did not match
      //       }
      //     } else {
      //       console.log('user not found');
      //       res.status(404).json({
      //         statusCode: 404,
      //         message: 'email not found'
      //       });
      //     }

      //     // Don't use the connection here, it has been returned to the pool.
      //     // console.log('#results = ', results.length);
      //     // res.status(200).json({
      //     //   status: 200,
      //     //   results: results
      //     // });
      //   }
      // );
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
        message: "Invalid required field",
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

      console.log("AAAA jwtSecretKey=",jwtSecretKey);//'process.env.JWT_SECRET',
      jwt.verify(token, jwtSecretKey, (err, payload) => {

        if (err) {
          logger.warn('Not autherized'),
            res.status(401).json({
              status:401,
              message: 'Not authorized',
              data: {}
            });
        }
        if (payload) {
          logger.debug('token is valid', payload);

         req.userId = payload.userId;
         if (!req.userId)
          req.userId = payload.id;

          console.log('end of ValidateToken', payload.id);
          next();
        }
      });
    }
  }
};
