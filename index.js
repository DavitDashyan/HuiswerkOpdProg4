const express = require('express');
const assert = require('assert');

const app = express();
const port = 7645;

// For access to application/json request body
app.use(express.json());

// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.
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
  id: 11,
  name: 'kaas'
}
  ]
};

// Ieder nieuw item in db krijgt 'autoincrement' index.
// Je moet die wel zelf toevoegen!
let index = database.users.length;

// Algemene route, vangt alle http-methods en alle URLs af, print
// een message, en ga naar de next URL (indien die matcht)!
app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});

// Info endpoints
app.get('/api/info', (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'Davide',
      studentNumber: 1234567,
      description: 'Welkom bij de server API van de share a meal.'
    }
  });
});

// UC-201 Registreren als nieuwe user
app.post('/api/register', (req, res) => {
  // De usergegevens zijn meegestuurd in de request body.
  // In de komende lessen gaan we testen of dat werkelijk zo is.
  
  const user = req.body;
    
  // Validate the incoming data
  if (!user.emailAdress) {
    return res.status(400)
    .json({
      status: 400,
      error: 'Missing required data',
      data: {}
    });
   
  }

  console.log('user = ', user);

  // Hier zie je hoe je binnenkomende user info kunt valideren.
  try {
    // assert(user === {}, 'Userinfo is missing'); assert om testen, hij check of het goed geschreben is en of het type string is zo niet err
    assert(typeof user.firstName === 'string', 'firstName must be a string');
    assert(typeof user.emailAdress === 'string','emailAddress must be a string'
      // Check if email is already registered     
    );
  } catch (err) {
    // Als één van de asserts failt sturen we een error response.
    res.status(400).json({
      status: 400,
      message: err.message.toString(),
      data: {}
    });
    // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
    // wanneer er al een response is teruggestuurd.
    return;
  }

  
  // Check if email is already registered
  if (database.users.find(usercur => user.emailAdress === usercur.emailAdress)) {
        return res.status(400).        
        json({
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
});

// UC-202 Opvragen van overzicht van users
app.get('/api/user', (req, res) => {
  // er moet precies 1 response verstuurd worden.
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    message: 'User getAll endpoint',
    data: database.users
  });
});


function updateUserById(id, updatedUser) {
  const userIndex = database.users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    // If no user with the given ID is found, return null
    return null;
  }
  // Update the user object in the array with the new data
  database.users[userIndex] = {
    ...database.users[userIndex],
    ...updatedUser
  };
  // Return the updated user object
  return database.users[userIndex];
}

app.put('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;
  const user = updateUserById(id, updatedUser);
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
});

app.delete('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = database.users.findIndex((user) => user.id === id);

  if (index !== -1) {
    database.users.splice(index, 1);
    res.status(200).json({
      message: `User with ID ${id} deleted successfully`,
    });
  } else {
    res.status(404).json({
      message: `User with ID ${id} not found`,
    });
  }
});


// Wanneer geen enkele endpoint matcht kom je hier terecht. Dit is dus
// een soort 'afvoerputje' (sink) voor niet-bestaande URLs in de server.
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {}
  });
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
