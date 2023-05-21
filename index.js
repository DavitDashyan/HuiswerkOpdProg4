const express = require('express');
const logger = require('./src/util/utils').logger;
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');
require('dotenv').config()
const app = express();
const port = process.env.PORT 

// const bodyParser = require ('body-parser');
// router.use(bodyParser.json());
// For access to application/json request body

app.use(express.json());

// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.


// Algemene route, vangt alle http-methods en alle URLs af, print
// een message, en ga naar de next URL (indien die matcht)!
app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});


app.use('' , userRoutes);
app.use('', authRoutes);

// app.get('api/user', (req, res)=> {

//   const queryField = Object.entries(req.query);

//   if(queryField.length == 2){
//     console.log(`Dit is field1 = ${queryField[0] [0]} == ${queryField [0] [1]}`);

//     res.status(200).json({
//       status: 200,
//       message: `gefilterd op twee parameters`,
//       data: {},
//     });
//   }else if{}
//   }
// })

// Info endpoints

// function updateUserById(id, updatedUser) {
//   const userIndex = database.users.findIndex(user => user.id === id);
//   if (userIndex === -1) {
//     // If no user with the given ID is found, return null
//     return null;
//   }
//   // Update the user object in the array with the new data
//   database.users[userIndex] = {
//     ...database.users[userIndex],
//     ...updatedUser
//   };
//   // Return the updated user object
//   return database.users[userIndex];
// }

// Wanneer geen enkele endpoint matcht kom je hier terecht. Dit is dus
// een soort 'afvoerputje' (sink) voor niet-bestaande URLs in de server.
app.use('*', (req, res) => {
  logger.warn('Invalid endpoint called: ', req.path);
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {}
  });
});

// Express error handler
app.use((err, req, res, next) => {
  console.log("Here I am - the error");
  logger.info(err);
// logger.error(err.code, err.message);
  //  console.log(res);
  //  console.log("end of imhere");
   res.status(err.status).json(err);
// res.status(err.code).json({
  //   statusCode: err.code,
  //   message: err.message,
  //   data: {}
  
  // });
  // next();
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
