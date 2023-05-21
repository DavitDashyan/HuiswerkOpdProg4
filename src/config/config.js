require('dotenv').config();

 const loglevel = (module.exports = {
   jwtSecretKey:
     'process.env.JWT_SECRET' /*|| 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTY4NDUyMzU5NCwiZXhwIjoxNjg3MTE1NTk0fQ.FqsN4QhjLpjLT-YpO-fbujwcI7ynWJKTyyCchiV5q0Q'*/,

    logger: require('tracer').console({
      format: ['{{timestamp}} [{{title}}] {{file}}:{{line}} : {{message}}'],
      preprocess: function (data) {
        data.title = data.title.toUpperCase();
      },
      dateformat: 'isoUtcDateTime',
      level: process.env.LOGLEVEL
    })
 });
