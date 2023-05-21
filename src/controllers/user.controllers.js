const assert = require('assert');
const logger = require('../util/utils').logger;
const dbconnection = require('../../dbconnection');

let database = {
  users: [
    {
      id: 0,
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl'
    },
    {
      id: 1,
      firstName: 'Marieke',
      lastName: 'Jansen',
      emailAdress: 'm@server.nl'
    }
  ],
  meals: [
    {
      id: 0,
      name: 'kaas'
    },
    {
      id: 1,
      name: 'brood'
    },
    {
      id: 2,
      name: 'melk'
    }
  ]
};

let index = database.users.length;

const controller = {
  userInfo: (req, res) => {
    res.status(201).json({
      status: 201,
      message: 'Server info-endpoint',
      data: {
        studentName: 'Davit Dashyan',
        studentNumber: 2206322,
        description: 'Welkom bij de server API van de share a meal.'
      }
    });
  },
  addRegister: (req, res, next) => {
    const user = req.body;

    try {
      assert(user.firstName != null, 'firstName is missing');
      assert(typeof user.firstName === 'string', 'firstName must be a string');

      assert(user.lastName != null, 'lastName is missing');
      assert(typeof user.lastName === 'string', 'lastName must be a string');

      assert(user.emailAdress != null, 'emailAddress is missing');
      assert(
        typeof user.emailAdress === 'string',
        'emailAddress must be a string'
      );

      assert(user.password != null, 'password is missing');
      assert(typeof user.password === 'string', 'password must be a string');

      assert(user.phoneNumber != null, 'phoneNumber is missing');
      assert(
        typeof user.phoneNumber === 'string',
        'phoneNumber must be a string'
      );

      assert(user.isActive != null, 'isActive is missing');
      assert(typeof user.isActive === 'number', 'isActive must be a number');

      assert(user.city != null, 'city is missing');
      assert(typeof user.city === 'string', 'city must be a string');

      assert(user.street != null, 'street is missing');
      assert(typeof user.street === 'string', 'street must be a string');
    } catch (err) {
      next({
        status: 400,
        message: err.message,
        data: {}
      });
      return;
    }

    if (user.password.length < 5) {
      next({
        status: 400,
        message: 'Invalid password',
        data: {}
      });
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(user.emailAdress)) {
      next({
        status: 400,
        message: 'Invalid emailAddress',
        data: {}
      });
      return;
    }

    const query =
      'INSERT INTO user (firstName, lastName, emailAdress, password, phoneNumber, isActive, city, street) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      user.firstName,
      user.lastName,
      user.emailAdress,
      user.password,
      user.phoneNumber,
      user.isActive,
      user.city,
      user.street
    ];

    dbconnection.getConnection(function (err, conn) {
      if (err) {
        next({
          status: 500,
          message: 'Error connecting to database',
          data: {}
        });
        return;
      }
      if (conn) {
        conn.query(query, values, function (err, results) {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              next({
                status: 403,
                message: 'Email address bestaat al',
                data: {}
              });
              return;
            } else {
              next({
                status: 500,
                message: 'Error executing query: ' + err,
                data: {}
              });
              return;
            }
          }
          const insertedId = results.insertId;
          logger.info(`Gebruiker met id ${insertedId} is toegevoegd`);
          res.status(201).json({
            status: 201,
            message: `Gebruiker met id ${insertedId} is toegevoegd`,
            data: { id: insertedId, ...user }
          });
        });
        dbconnection.releaseConnection(conn);
      }
    });
  },

  postMeal: (req, res, next) => {
    const meal = req.body;

    console.log('in postMeal');
    try {
      assert(meal.isActive != null, 'isActive is missing');
      assert(typeof meal.isActive === 'number', 'isActive must be a number');

      assert(meal.isVega != null, 'isVega is missing');
      assert(typeof meal.isVega === 'number', 'isVega must be a number');

      assert(meal.isVegan != null, 'isVegan is missing');
      assert(typeof meal.isVegan === 'number', 'isVegan must be a number');

      assert(meal.isToTakeHome != null, 'isToTakeHome is missing');
      assert(
        typeof meal.isToTakeHome === 'number',
        'isToTakeHome must be a number'
      );

      assert(meal.dateTime != null, 'dateTime is missing');
      assert(typeof meal.dateTime === 'string', 'dateTime must be a string');

      assert(
        meal.maxAmountOfParticipants != null,
        'maxAmountOfParticipants is missing'
      );
      assert(
        typeof meal.maxAmountOfParticipants === 'number',
        'maxAmountOfParticipants must be a number'
      );

      assert(meal.price != null, 'price is missing');
      assert(typeof meal.price === 'string', 'price must be a string');

      assert(meal.imageUrl != null, 'imageUrl is missing');
      assert(typeof meal.imageUrl === 'string', 'imageUrl must be a string');

      assert(meal.cookId != null, 'cookId is missing');
      assert(typeof meal.cookId === 'number', 'cookId must be a number');

      assert(meal.createDate != null, 'createDate is missing');
      assert(
        typeof meal.createDate === 'string',
        'createDate must be a string'
      );

      assert(meal.updateDate != null, 'updateDate is missing');
      assert(
        typeof meal.updateDate === 'string',
        'updateDate must be a string'
      );

      assert(meal.name != null, 'name is missing');
      assert(typeof meal.name === 'string', 'name must be a string');

      assert(meal.description != null, 'description is missing');
      assert(
        typeof meal.description === 'string',
        'description must be a string'
      );

      assert(meal.allergenes != null, 'allergenes is missing');
      assert(
        typeof meal.allergenes === 'string',
        'allergenes must be a string'
      );
    } catch (err) {
      next({
        status: 400,
        message: err.message,
        data: {}
      });
      return;
    }
    if (meal.cookId != req.userId) {
      console.info('You can only post meal on your id, cookId set to own');
      meal.cookId = req.userId;
    }

    console.log('meal.cookId=', meal.cookId, 'req.userOd', req.userId);
    const query =
      'INSERT INTO meal (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      meal.isActive,
      meal.isVega,
      meal.isVegan,
      meal.isToTakeHome,
      meal.dateTime,
      meal.maxAmountOfParticipants,
      meal.price,
      meal.imageUrl,
      meal.cookId,
      //req.userId,
      meal.createDate,
      meal.updateDate,
      meal.name,
      meal.description,
      meal.allergenes
    ];

    console.log('QUERY=', query);
    dbconnection.getConnection(function (err, conn) {
      if (err) {
        next({
          status: 500,
          message: 'Error connecting to the database',
          data: {}
        });
        return;
      }
      if (conn) {
        conn.query(query, values, function (err, results) {
          if (err) {
            next({
              status: 500,
              message: 'Error executing query: ' + err,
              data: {}
            });
            return;
          }
          const insertedId = results.insertId;
          logger.info(`Meal with id ${insertedId} has been added`);
          res.status(201).json({
            status: 201,
            message: `Meal with id ${insertedId} has been added`,
            data: { id: insertedId, ...meal }
          });
        });
        dbconnection.releaseConnection(conn);
      }
    });
  },

  getAllMeals: (req, res, next) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(
        'SELECT * FROM meal;',
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
          console.log('error = ', error);
          // Handle error after the release.
          if (error) throw error;

          // Don't use the connection here, it has been returned to the pool.
          console.log('#results = ', results.length);
          res.status(200).json({
            status: 200,
            results: results
          });
        }
      );
    });
  },

  getAllUsers: (req, res, next) => {
    logger.info('UC-202');
    console.log('[INFO] getAllUsers is aangeroepen req.userId= ', req.userId);

    console.log('request query=', req.params);
    const filters = {
      id: req.query.id,
      firstName: req.query.firstName,
      lastName: req.query.lastName,
      emailAdress: req.query.emailAdress,
      phoneNumber: req.query.phoneNumber,
      roles: req.query.roles,
      street: req.query.street,
      city: req.query.city,
      isActive: req.query.isActive
    };

    let query =
      'SELECT id, firstName, lastName, phoneNumber, roles, isActive FROM user WHERE 1=1';
    for (const field in filters) {
      if (filters[field] !== undefined) {
        query += ` AND ${field} = '${filters[field]}'`;
      }
    }

    const paramNames = Object.keys(req.query);
    for (const name of paramNames) {
      if (!filters.hasOwnProperty(name)) {
        res.status(200).json({
          status: 200,
          message: 'User filter undefined',
          data: {}
        });
        return;
      }
    }

    console.log(query);

    dbconnection.getConnection((err, conn) => {
      if (err) {
        next({
          status: 500,
          message: 'Error connecting to database',
          data: {}
        });
      } else {
        conn.query(query, (err, results, fields) => {
          if (err) {
            next({
              status: 409,
              message: err.message,
              data: {}
            });
          } else {
            logger.info(`Found ${results.length} results`);
            res.status(200).json({
              status: 200,
              message: 'User getAll endpoint',
              data: results
            });
          }
          conn.release();
        });
      }
    });
  },

  getProfile: (req, res, next) => {
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const emailAddress = req.query.emailAdress;
    const phoneNumber = req.query.phoneNumber;
    const roles = req.query.roles;
    const street = req.query.street;
    const city = req.query.city;
    const isActive = req.query.isActive;

    let query = `SELECT * FROM user WHERE id= ${req.userId}`;
    let queryMeal = `SELECT * FROM meal WHERE cookId= ${req.userId}`;

    console.log('QUERY=', query);

    dbconnection.getConnection(function (err, conn) {
      if (err) {
        next({
          status: 500,
          message: 'Error connecting to database',
          data: {}
        });
      } else {
        conn.query(query, function (err, results, fields) {
          if (err) {
            next({
              status: 409,
              message: err.message,
              data: {}
            });
          } else {
            logger.info(`Found ${results.length} results`);
            /**/
            conn.query(queryMeal, function (err, resultsMeal, fields) {
              if (err) {
                next({
                  status: 409,
                  message: err.message,
                  data: {}
                });
              } else {
                logger.info(`Found ${resultsMeal.length} results`);

                res.status(200).json({
                  status: 200,
                  message: 'User getProfile endpoint',
                  data: results,
                  resultsMeal
                });
              }
            });
          }

          conn.release();
        });
      }
    });
  },

  updateUserById: (req, res, next) => {
    const userId = parseInt(req.params.id);
    const userUpdates = req.body;

    const ownUserId = req.userId;

    console.log('userUpdate = ', req.body, 'end body');
    console.log('before if: userUpdates.phoneNumber=', userUpdates.phoneNumber);

    if (userUpdates.phoneNumber) {
      console.log('phoneNumber', userUpdates.phoneNumber);
      const phoneRegex = /^\+[1-9]\d{0,2}\d{1,14}$/; 
      if (!phoneRegex.test(userUpdates.phoneNumber)) {
        next({
          status: 400,
          message: 'Invalid phoneNumber'
        });
        console.log('return from phone');
        return;
      }
    }

    console.log('useridAAAA', userId, userUpdates.emailAdress);
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(userUpdates.emailAdress)) {
      next({
        status: 400,
        message: 'Invalid emailAddress'
      });
      console.log('return form email');
      return;
    }

    if (userUpdates.isActive != 0 && userUpdates.isActive != 1) {
      next({
        status: 400,
        message: 'isActive must be 0 or 1'
      });
      return;
    }

    const userQuery = `SELECT * FROM user WHERE id = ${userId}`;

    dbconnection.getConnection((err, conn) => {
      if (err) {
        next({
          status: 500,
          message: err,
          data: {}
        });
        return;
      }
      if (conn) {
        conn.query(userQuery, [userId], (err, results) => {
          if (err) {
            next({
              status: 500,
              message: 'Error executing query: ' + err,
              data: {}
            });
            return;
          }
          if (results.length === 0) {
            next({
              status: 404,
              message: `User met id ${userId} kan niet gevonden worden`
            });
            return;
          }
          try {
            assert(userId != null, 'userId is missing');
            assert(typeof userId === 'number', 'userId must be a number');
            assert(userId === ownUserId, 'Not authorized');
          } catch (err) {
            next({
              status: 403,
              message: err.message
            });
            return;
          }
          const user = results[0];

          let updatedUser = { ...user };

          for (const key in userUpdates) {
            if (key in user) {
              updatedUser[key] = userUpdates[key];
            }
          }

          const updateQuery = `UPDATE user SET ? WHERE id = ${userId}`;
          conn.query(updateQuery, [updatedUser, userId], (err, results) => {
            if (err) {
              next({
                status: 500,
                message: 'Error executing query: ' + err
              });
              return;
            }
            logger.info(`User met id ${userId} is aangepast`);
            res.status(200).json({
              status: 200,
              message: `User met id ${userId} is aangepast`,
              data: updatedUser
            });
          });

          dbconnection.releaseConnection(conn);
        });
      }
    });
    console.log('before end');
  },

  userDelete: (req, res, next) => {
    const id = parseInt(req.params.id);
    const query = `DELETE FROM user WHERE id = ${id}`;

    const ownUserId = req.userId;

    dbconnection.getConnection((error, conn) => {
      if (error) {
        return next({
          status: 500,
          message: error,
          data: {}
        });
      }

      if (!conn) {
        return next({
          status: 500,
          message: 'Failed to establish a database connection',
          data: {}
        });
      }

      const userQuery = `SELECT * FROM user WHERE id = ${id}`;
      conn.query(userQuery, [id], (err, results) => {
        if (err) {
          next({
            status: 500,
            message: 'Error executing query: ' + err,
            data: {}
          });
          return;
        }
        if (results.length === 0) {
          next({
            status: 404,
            message: `User met id ${id} kan niet gevonden worden`,
            data: {}
          });
          return;
        }

        try {
          assert(id === ownUserId, 'Not authorized');
        } catch (err) {
          next({
            status: 403,
            message: err.message
          });
          return;
        }

        conn.query(query, [id], (err, results) => {
          if (err) {
            return next({
              status: 500,
              message: 'An error occurred while executing the query: ' + err,
              data: {}
            });
          }

          if (results.affectedRows === 0) {
            return next({
              status: 404,
              message: 'User not found',
              data: {}
            });
          }
          logger.info(`User with ID ${id} has been successfully deleted`);
          res.status(200).json({
            status: 200,
            message: `User with ID ${id} has been deleted`,
            data: {}
          });
        });
      });

      dbconnection.releaseConnection(conn);
    });
  },

  deleteMeal: (req, res, next) => {
    const id = parseInt(req.params.id); // meal id 47
    const cookQuery = `SELECT cookId FROM meal WHERE id = ${id}`; // 110 from mealid 47
    const query = `DELETE FROM meal WHERE id = ${id}`;

    const ownUserId = req.userId;

    console.log('before connection');

    dbconnection.getConnection((error, conn) => {
      if (error) {
        console.log('error in getConnection');
        return next({
          status: 500,
          message: error,
          data: {}
        });
      }

      if (!conn) {
        return next({
          status: 500,
          message: 'Failed to establish a database connection',
          data: {}
        });
      }

      console.log('COOKQUERY=', cookQuery);
      conn.query(cookQuery, (err, results) => {
        if (err) {
          return next({
            status: 500,
            message: 'An error occurred while executing the query: ' + err,
            data: {}
          });
        }

        if (results.affectedRows === 0) {
          return next({
            status: 404,
            message: 'Meal not found',
            data: {}
          });
        }

        console.log('results=', results);
        if (results && results.length === 1) {
          const idCook = results[0].cookId; // Use "cookId" column from the query results
          try {
            assert(idCook === ownUserId, 'Not authorized');
          } catch (err) {
            return next({
              status: 403,
              message: err.message
            });
          }
          logger.info(
            `Meal with ID ${id} has cookId owned by the logged-in person's user ID`
          );
        }

        console.log('START DELETING ROW');
        conn.query(query, (err, results) => {
          if (err) {
            return next({
              status: 500,
              message: 'An error occurred while executing the query: ' + err,
              data: {}
            });
          }

          if (results.affectedRows === 0) {
            return next({
              status: 404,
              message: 'Meal not found',
              data: {}
            });
          }

          logger.info(`Meal with ID ${id} has been successfully deleted`);
          res.status(200).json({
            status: 200,
            message: `Meal with ID ${id} has been deleted`,
            data: {}
          });
        });

        dbconnection.releaseConnection(conn);
      });
    });
  },

  getUserById: (req, res, next) => {
    const userId = parseInt(req.params.id);
    const userQuery =
      'SELECT id, firstName, lastName, phoneNumber, isActive  FROM user WHERE id = ?';
    const queryMeal = `SELECT * FROM meal WHERE cookId= ${userId}`;

    console.log('query=', userQuery, userId, req.params.id);
    dbconnection.getConnection((err, conn) => {
      if (err) {
        return next({
          status: 500,
          message: 'Error connecting to the database',
          data: {}
        });
      }

      conn.query(userQuery, [userId], (err, results) => {
        if (err) {
          conn.release();
          return next({
            status: 500,
            message: 'Error executing the query',
            data: {}
          });
        }

        if (results && results.length > 0) {
          const user = results[0];
          logger.info('Found user with id', userId);

          conn.query(queryMeal, function (err, resultsMeal, fields) {
            if (err) {
              next({
                status: 409,
                message: err.message,
                data: {}
              });
            } else {
              logger.info(`Found ${resultsMeal.length} results`);

              res.status(200).json({
                status: 200,
                message: 'User and Meal by id found',
                data: user,
                resultsMeal
              });
            }
          });
        } else {
          next({
            status: 404,
            message: `Gebruiker met id ${userId} kan niet gevonden worden...`
          });
        }

        conn.release();
      });
    });
  },

  getMealById: (req, res, next) => {
    const mealId = req.params.id;
    const mealQuery = 'SELECT * FROM meal WHERE id = ?';

    dbconnection.getConnection((err, conn) => {
      if (err) {
        return next({
          status: 500,
          message: 'Error connecting to the database',
          data: {}
        });
      }
      conn.query(mealQuery, [mealId], (err, results) => {
        if (err) {
          conn.release();
          return next({
            status: 500,
            message: 'Error executing the query',
            data: {}
          });
        }

        if (results && results.length > 0) {
          const meal = results[0];
          logger.info('Found user with id', mealId);

          res.status(200).json({
            status: 200,
            message: `Meal met id ${mealId} is gevonden`,
            data: meal
          });
        } else {
          next({
            status: 404,
            message: `Meal met id ${mealId} kan niet gevonden worden...`
          });
        }
        conn.release();
      });
    });
  }
};
module.exports = controller;