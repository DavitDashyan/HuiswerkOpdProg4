const dbconnection = require('../../dbconnection')
const assert = require('assert');

let database = {
  users: [
    {
      id: 0,
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl'
      // Hier de overige velden uit het functioneel ontwerp
    },
    {
      id: 1,
      firstName: 'Marieke',
      lastName: 'Jansen',
      emailAdress: 'm@server.nl'
      // Hier de overige velden uit het functioneel ontwerp
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

// Ieder nieuw item in db krijgt 'autoincrement' index.
// Je moet die wel zelf toevoegen!
let index = database.users.length;

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let { emailAdress, firstName, lastName } = user;

    try {
      assert(typeof emailAdress === 'string', 'must be a string');
      assert(typeof firstName === 'string', 'must be a string');
      assert(typeof lastName === 'string', 'must be a string');
      next();
    } catch (err) {
      const error = {
        status: 400,
        result: err.message,
        error: err.message
      };

      // console.log("I<N validate");
      console.log(err.code);
      // console.log("IN validate>");
      // console.log(err.code);
      // console.log(err.message);
      // res.status(400).json({
      //   status: 400,
      //   result: err.toString()
      // });

      next(error);
    }
  },
  userInfo: (req, res) => {
    res.status(201).json({
      status: 201,
      message: 'Server info-endpoint',
      data: {
        studentName: 'Davide',
        studentNumber: 1234567,
        description: 'Welkom bij de server API van de share a meal.'
      }
    });
  },
  addRegister: (req, res) => {
    // De usergegevens zijn meegestuurd in de request body.
    // In de komende lessen gaan we testen of dat werkelijk zo is.

    const user = req.body;
    console.log('add register');

    // Validate the incoming data
    if (!user.emailAdress) {
      return res.status(400).json({
        status: 400,
        error: 'Missing required data',
        data: {}
      });
    }

    console.log('user = ', user);
    console.log(typeof user.firstName);
    console.log(typeof user.emailAdress);

    // Hier zie je hoe je binnenkomende user info kunt valideren.
    try {
      // assert(user === {}, 'Userinfo is missing'); assert om testen, hij check of het goed geschreben is en of het type string is zo niet err
      assert(typeof user.firstName === 'string', 'firstName must be a string');
      assert(
        typeof user.emailAdress === 'string',
        'emailAddress must be a string'
      );
      // Check if email is already registered
    } catch (err) {
      // Als één van de asserts failt sturen we een error response.
      //console.log(err);
      console.log('ERROR caught!!!');
      res.status(400).json({
        status: 400,
        message: err.message.toString(),
        data: {}
      });
      // Nodejs is asynchroon. We willen niet dat de routerlicatie verder gaat
      // wanneer er al een response is teruggestuurd.
      return;
    }

    // Check if email is already registered
    if (
      database.users.find((usercur) => user.emailAdress === usercur.emailAdress)
    ) {
      return res.status(400).json({
        status: 400,
        message: 'Missing required data',
        error: 'Email already registered',
        data: {}
      });
    }
    // Zorg dat de id van de nieuwe user toegevoegd wordt
    // en hoog deze op voor de volgende insert.
    user.id = index++;
    // User toevoegen aan database
    database['users'].push(user);

    // Stuur het response terug
    res.status(200).json({
      status: 200,
      message: `User met id ${user.id} is toegevoegd`,
      // Wat je hier retourneert is een keuze; misschien wordt daar in het
      // ontwerpdocument iets over gezegd.
      data: user
    });
  },

  getAllUsers: (req, res, next) => {

    dbconnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
      
        // Use the connection
        connection.query(
          'SELECT id, name FROM meal;',
          function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
      
            // Handle error after the release.
            if (error) throw error;
      
            // Don't use the connection here, it has been returned to the pool.
            console.log('#results = ', results.length);
            res.status(200).json({
            statusCode: 200,
            results: results
        })


            // pool.end((err) => {
            //   console.log('pool was closed');
            // })
          }
        )
      })
//kan weg als de in dbconnection uit de comments komen (get all kan dan weg)


//   },
//   getAllUsers: (req, res) => {
//     // er moet precies 1 response verstuurd worden.
//     const statusCode = 200;
//     res.status(statusCode).json({
//       status: statusCode,
//       message: 'User getAll endpoint',
//       data: database.users
//     });
  },
  getAllMeals: (req, res) => {
    // er moet precies 1 response verstuurd worden.
    const statusCode = 200;
    res.status(statusCode).json({
      status: statusCode,
      message: 'User getAll endpoint',
      data: database.meals
    });
  },
  updateUserById: (id, updatedUser) => {
    console.log("updateuserbyid");
    const userIndex = database.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      // If no user with the given ID is found, return null
      console.log("return null");
      return null;
    }
    // Update the user object in the array with the new data
    database.users[userIndex] = {
      ...database.users[userIndex],
      ...updatedUser
    };
    console.log("return datauser");
    // Return the updated user object
    return database.users[userIndex];
  },
  userPut: (req, res) => {
    const id = parseInt(req.params.id);
    const updatedUser = req.body;
    console.log("userPut");
    const user = controller.updateUserById(id, updatedUser);
    if (user === null) {
      const statusCode = 404;
      res.status(statusCode).json({
        status: statusCode,
        message: `User with ID ${id} not found`
      });
    } else {
      const statusCode = 200;
      res.status(statusCode).json({
        status: statusCode,
        message: `User with ID ${id} updated successfully`,
        data: user
      });
    }
  },
  // de pijl en de dubble punt kunnen weg, is zelfde als met
  userDelete(req, res) {
    const id = parseInt(req.params.id);
    const index = database.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      database.users.splice(index, 1);
      res.status(200).json({
        message: `User with ID ${id} deleted successfully`
      });
    } else {
      res.status(404).json({
        message: `User with ID ${id} not found`
      });
    }
  },
  getUserById: (req, res, next) => {
    const userId = req.params.id;
    console.log(`GET USER ID after id=  ${userId}`);
    let user = database.users.filter((item) => item.id == userId);
    //console.log("AFTER is and user");
    if (user.length > 0) {
      // console.log("GET USER ID start");
      console.log(user);
      res.status(200).json({
        status: 200,
        result: user
      });
    } else {
      //   console.log("ERROR in GET USER ID ");
      const error = {
        status: 404,
        result: `with id ${userId} not found`
      };
      console.log(error);
      //    console.log("ERROR after log");
      next(error);
    }
  },
  getMealById: (req, res, next) => {
    const mealId = req.params.id;
    console.log(`GET MEAL ID after id=  ${mealId}`);
    let meal = database.meals.filter((item) => item.id == mealId);
    //console.log("AFTER is and user");
    if (meal.length > 0) {
      // console.log("GET USER ID start");
      console.log(meal);
      res.status(200).json({
        status: 200,
        result: meal
      });
    } else {
      //   console.log("ERROR in GET USER ID ");
      const error = {
        status: 404,
        result: `with id ${mealId} not found`
      };
      console.log(error);
      //    console.log("ERROR after log");
      next(error);
    }
  }
};

module.exports = controller;
