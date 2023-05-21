const express = require('express');
const logger = require('./src/util/utils').logger;
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');
require('dotenv').config()
const app = express();
const port = process.env.PORT 


app.use(express.json());

app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});


app.use('' , userRoutes);
app.use('', authRoutes);

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
   res.status(err.status).json(err);
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
