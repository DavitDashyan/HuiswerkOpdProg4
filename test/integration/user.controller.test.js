const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const { jwtSecretKey } = require('../../src/config/config');
const jwt = require('jsonwebtoken');
const should = require('chai').should();
let database = [];
let addedUserId = 0;
const { assert } = chai;



chai.should();
chai.use(chaiHttp);
// Testen voor UC-201: Registreren als nieuwe gebruiker
describe('test uc-201 t/m 206', () => {
  // TC-201-1: Verplicht veld ontbreekt
  it('TC-201-1: should return a 400 error when a required field is missing', (done) => {
    const user = {
      // Laat een vereist veld weg, zoals 'firstName'
      lastName: 'Doe',
      emailAddress: 'johndoe@example.com',
      password: 'pass123',
      phoneNumber: '1234567890',
      isActive: 1,
      city: 'New York',
      street: '123 Main St'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        console.log('res=', res.status);
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status', 400);
        res.body.should.have.property('message', 'firstName is missing');
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  // TC-201-2: Niet-valide emailadres
  it('TC-201-2: should return a 400 error when an invalid email address is provided', (done) => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      emailAdress: 'invalid-email', // Ongeldig e-mailadres
      password: 'pass123',
      phoneNumber: '1234567890',
      isActive: 1,
      city: 'New York',
      street: '123 Main St'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status', 400);
        res.body.should.have.property('message', 'Invalid emailAddress');
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  // TC-201-3: Niet-valide wachtwoord
  it('TC-201-3: should return a 400 error when an invalid password is provided', (done) => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      emailAdress: 'johndoe@example.com',
      password: '1234', // Ongeldig wachtwoord (te kort)
      phoneNumber: '1234567890',
      isActive: 1,
      city: 'New York',
      street: '123 Main St'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status', 400);
        res.body.should.have.property('message', 'Invalid password');
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  // TC-201-4: Gebruiker bestaat al
  it('TC-201-4.2: Gebruiker bestaat al: should return a 403 error when a user already exists', (done) => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      emailAdress: 'j.doe@server.com',
      password: 'pass123',
      phoneNumber: '1234567890',
      isActive: 1,
      city: 'New York',
      street: '123 Main St'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('status', 403);
        res.body.should.have.property('message', 'Email address bestaat al');
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
  });

  // TC-201-5: Gebruiker succesvol geregistreerd
  it('TC-201-5: should successfully register a new user', (done) => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      emailAdress: 'johndoe10@example.com',
      password: 'pass123',
      phoneNumber: '1234567890',
      isActive: 1,
      city: 'New York',
      street: '123 Main St'
    };

    chai
      .request(server)
      .post('/api/user')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('status', 201);
        res.body.should.have.property(
          'message',
          `Gebruiker met id ${res.body.data.id} is toegevoegd`
        );
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('id').that.is.not.undefined; // Controleren of het Id aanwezig is
        res.body.data.should.have.property('firstName', user.firstName);
        res.body.data.should.have.property('lastName', user.lastName);
        res.body.data.should.have.property('emailAdress', user.emailAdress);
        res.body.data.should.have.property('phoneNumber', user.phoneNumber);
        res.body.data.should.have.property('isActive', user.isActive);
        res.body.data.should.have.property('city', user.city);
        res.body.data.should.have.property('street', user.street);

        addedUserId = res.body.data.id;

        done();
      });
  });

  it('TC-202-1: should return all users', (done) => {
    chai
      .request(server)
      .get('/api/user')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User getAll endpoint');
        assert.isArray(response.body.data);
        assert.isTrue(response.body.data.length >= 2);
        done();
      });
  });

  it('TC-202-2: should return an error for non-existent filter fields', (done) => {
    chai
      .request(server)
      .get('/api/user?id=1&nonExistentField=test')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User filter undefined');
        assert.deepEqual(response.body.data, {});
        done();
      });
  });

  it('TC-202-3: should return users with isActive=0', (done) => {
    chai
      .request(server)
      .get('/api/user?isActive=0')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User getAll endpoint');
        assert.isArray(response.body.data);
        assert.isTrue(response.body.data.length >= 1);
        response.body.data.forEach((user) => {
          assert.equal(user.isActive, 0);
        });
        done();
      });
  });

  it('TC-202-4: should return users with isActive=1', (done) => {
    chai
      .request(server)
      .get('/api/user?isActive=1')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User getAll endpoint');
        assert.isArray(response.body.data);
        assert.isTrue(response.body.data.length >= 2);
        response.body.data.forEach((user) => {
          assert.equal(user.isActive, 1);
        });
        done();
      });
  });

  it('TC-202-5: should return users with filters on existing fields', (done) => {
    chai
      .request(server)
      .get('/api/user?firstName=John&lastName=Doe')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User getAll endpoint');
        assert.isArray(response.body.data);
        assert.isTrue(response.body.data.length >= 2);
        response.body.data.forEach((user) => {
          assert.equal(user.firstName, 'John');
          assert.equal(user.lastName, 'Doe');
        });
        done();
      });
  });

  it('TC-203-1: should return an error message and no data for an invalid token', (done) => {
    chai
      .request(server)
      .get('/api/user/profile')
      .query({
        id: '12345',
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john.doe@example.com',
        phoneNumber: '1234567890',
        roles: 'user',
        street: '123 Street',
        city: 'City',
        isActive: true
      })
      .set('authorization', 'Bearer InvalidToken') // Set an invalid token here
      .end((err, response) => {
        assert.equal(response.status, 401);
        assert.equal(response.body.message, 'Not authorized');
        assert.deepEqual(response.body.data, {});
        done();
      });
  });

  // Testcase 2: Gebruiker is ingelogd met geldig token
  it('TC-203-2: should return user data for valid token', (done) => {
    chai
      .request(server)
      .get('/api/user/profile')
      .query({
        id: 1,
        firstName: 'Mariëtte',
        lastName: 'van den Dullemen',
        emailAdress: 'm.vandullemen@server.nl'
      })
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        console.log('response.body.data.id,', response.body.data[0].id);
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User getProfile endpoint');

        const expectedData = {
          id: '1',
          firstName: 'Mariëtte',
          lastName: 'van den Dullemen',
          emailAddress: 'm.vandullemen@server.nl'
        };

        assert.equal(response.body.data[0].id, expectedData.id);
        assert.equal(response.body.data[0].firstName, expectedData.firstName);
        assert.equal(response.body.data[0].lastName, expectedData.lastName);
        assert.equal(
          response.body.data[0].emailAdress,
          expectedData.emailAddress
        );

        assert.equal(response.body.data[0].name, expectedData.name);
        assert.equal(
          response.body.data[0].description,
          expectedData.description
        );
        done();
      });
  });

  it('TC-204-1: should return an error message and no data for an invalid token', (done) => {
    chai
      .request(server)
      .get('/api/user/:id') 
      .query({ id: 12345 }) 
      .set('authorization', 'Bearer InvalidToken') // een ongeldige token 
      .end((err, response) => {
        assert.equal(response.status, 401);
        assert.equal(response.body.message, 'Not authorized');
        assert.deepEqual(response.body.data, {});
        done();
      });
  });

  it('TC-204-2: should return a 404 error for a non-existing user ID', (done) => {
    chai
      .request(server)
      .get('/api/user/12345')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 404);
        assert.equal(
          response.body.message,
          'Gebruiker met id 12345 kan niet gevonden worden...'
        );
        done();
      });
  });
  it('TC-204-3: should return user data for an existing user ID', (done) => {
    chai
      .request(server)
      .get('/api/user/2') 
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User and Meal by id found');
        assert.equal(response.body.data.id, 2);
        assert.equal(response.body.data.firstName, 'John');
        assert.equal(response.body.data.lastName, 'Doe');
        done();
      });
  });

  // TC-205-1: Verplicht veld "emailAddress" ontbreekt
  it('TC-205-1: should return an error message when "emailAddress" field is missing', (done) => {
    chai
      .request(server)
      .put('/api/user/1')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send({ phoneNumber: '+31612345678' }) // Omit the "emailAddress" field
      .end((err, response) => {
        assert.equal(response.status, 400);
        assert.equal(response.body.message, 'Invalid emailAddress');
        done();
      });
  });
  // TC-205-2: De gebruiker is niet de eigenaar van de data
  it('TC-205-2: should return an error message when user is not the owner of the data', (done) => {
    chai
      .request(server)
      .put('/api/user/5')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send({
        emailAdress: 'h.tank@server.com',
        phoneNumber: '+31612345678',
        isActive: 0
      })
      .end((err, response) => {
        assert.equal(response.status, 403);
        assert.equal(response.body.message, 'Not authorized');
        done();
      });
  });
  // TC-205-3: Niet-valide telefoonnummer
  it('TC-205-3: should return an error message when "phoneNumber" is not a valid phone number', (done) => {
    chai
      .request(server)
      .put('/api/user/1')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send({ emailAddress: 'john.doe@example.com', phoneNumber: '123456' })
      .end((err, response) => {
        assert.equal(response.status, 400);
        assert.equal(response.body.message, 'Invalid phoneNumber');
        done();
      });
  });
  // TC-205-4: Gebruiker bestaat niet
  it('TC-205-4: should return an error message when user does not exist', (done) => {
    chai
      .request(server)
      .put('/api/user/99999')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send({
        emailAdress: 'h.tghghghghghhank@server.com',
        phoneNumber: '+31612345678',
        isActive: 0
      })
      .end((err, response) => {
        assert.equal(response.status, 404);
        assert.equal(
          response.body.message,
          'User met id 99999 kan niet gevonden worden'
        );
        done();
      });
  });
  // TC-205-5: Niet ingelogd
  it('TC-205-5: should return an error message when not logged in', (done) => {
    chai
      .request(server)
      .put('/api/user/1')
      .send({ emailAdress: 'john.doe@example.com', phoneNumber: '1234567890' })
      .end((err, response) => {
        assert.equal(response.status, 401);
        assert.equal(response.body.message, 'Authorization header missing!');
        done();
      });
  });
  // TC-205-6: Gebruiker succesvol gewijzigd
  it('TC-205-6: should return a success message and updated user data', (done) => {
    chai
      .request(server)
      .put('/api/user/1') 
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send({
        emailAdress: 'm.vandullemen@server.nl',
        phoneNumber: '+316129999990',
        isActive: 0
      })
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User met id 1 is aangepast');
        // Add assertions for the updated user data
        assert.equal(response.body.data.id, 1);
        assert.equal(response.body.data.firstName, 'Mariëtte');
        assert.equal(response.body.data.lastName, 'van den Dullemen');
        assert.equal(response.body.data.phoneNumber, '+316129999990');
        done();
      });
  });
  // TC-206-1: Gebruiker bestaat niet
  it('TC-206-1: should return an error message when user does not exist', (done) => {
    chai
      .request(server)
      .delete('/api/user/99999')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 404);
        assert.equal(
          response.body.message,
          `User met id 99999 kan niet gevonden worden`
        );
        done();
      });
  });
  // TC-206-2: Gebruiker is niet ingelogd
  it('TC-206-2: should return an error message when user is not logged in', (done) => {
    chai
      .request(server)
      .delete('/api/user/12345') 
      .end((err, response) => {
        assert.equal(response.status, 401);
        assert.equal(response.body.message, 'Authorization header missing!');
        done();
      });
  });

  // TC-206-3: De gebruiker is niet de eigenaar van de data
  it('TC-206-3: should return an error message when user is not the owner of the data', (done) => {
    chai
      .request(server)
      .delete('/api/user/5')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 403);
        assert.equal(response.body.message, 'Not authorized');
        done();
      });
  });

  // TC-206-4: Gebruiker succesvol verwijderd
  it('TC-206-4: should return a success message when user is successfully deleted', (done) => {
    const userId = addedUserId; // added during TC-201-5
    chai
      .request(server)
      .delete(`/api/user/${userId}`)
      .set('authorization', 'Bearer ' + jwt.sign({ id: userId }, jwtSecretKey))
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(
          response.body.message,
          `User with ID ${userId} has been deleted`
        );
        done();
      });
  });
});
