const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const app = require('../../index');
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe('UC-201-1 Registreren als nieuwe user', () => {
    it('TC-201-1 - Verplicht veld ontbreekt', (done) => {
        const newUser = {
            firstName: 'John',
            lastName: 'Doe'
            // email is een verplicht veld, maar ontbreekt in deze test
        };

        chai.request(app)
            .post('/api/register')
            .send(newUser)
            .end((err, res) => {                
                res.body.should.has.property('status').to.be.equal(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
    });

    it('TC-201-5 - User succesvol geregistreerd', (done) => {
        // nieuwe user waarmee we testen
        const newUser = {
            firstName: 'Hendrik2',
            lastName: 'Not van Dam',
            emailAdress: 'hvdJunior@server.nl'
        };

        // Voer de test uit
        chai
            .request(server)
            .post('/api/register')
            .send(newUser)
            .end((err, res) => {
                assert(err === null);

                res.body.should.be.an('object');
                let {
                    data,
                    message,
                    status
                } = res.body;

                status.should.equal(200);
                message.should.be.a('string').that.contains('toegevoegd');
                data.should.be.an('object');

                // OPDRACHT!
                // Bekijk zelf de API reference op https://www.chaijs.com/api/bdd/
                // Daar zie je welke chained functions je nog meer kunt gebruiken.
                data.should.include({
                    id: 2
                });
                data.should.not.include({
                    id: 0
                });
                data.id.should.equal(2);
                data.firstName.should.equal('Hendrik2');

                done();
            });
    });
});

    describe('UC-201-2 registratie moet uniek zijn', () => {
        it('toeveogen aan databse asl het unik is', (done) => {

            const userData = {
            firstName: 'Test',
            lastName: 'User',
            emailAdress: 'test@example.com'
           };
        chai.request(app)
            .post('/api/register')
            .send(userData)
            .end((err, res) => {                
                res.body.should.has.property('status').to.be.equal(200);
                res.body.should.be.a('object');                
                done();
            });
        });

        it('should return an error message if a user with the same email already exists', (done) => {
            const userData = {
            firstName: 'Test',
            lastName: 'User',
            emailAdress: 'test@example.com'
           };
        chai.request(app)
            .post('/api/register')
            .send(userData)
            .end((err, res) => {                
                res.body.should.has.property('status').to.be.equal(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
        });
    });




describe('UC-202-1 Gebruikers ophalen', () => {

    it('TC-203-2 - Een of meer gebruikers aanwezig', (done) => {
        
          chai.request(app)
            .get('/api/user')
            .end((err, res) => {                
                res.body.should.has.property('status').to.be.equal(200);
                res.body.should.be.a('object');
                let { data, message } = res.body;
                // Assert that `data` is an array
                 data.should.be.an('array');

                // Assert that `data` is not empty
                data.should.be.an('array').and.have.length.greaterThan(0);

                // In request to 'TC-202-1 Toon alle gebruikers (minimaal 2)'.
                console.log('DATA = ', data);
                done();
            });
        
        
        }); 

});

describe('UC-203', () => {

it('error met het is nog niet geimplementeerd', (done) => {
    chai
      .request(server)
      .get('/api/profile')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(404);
        message.should.be.a('string').that.is.equal('Endpoint not found');
        data.should.be.an('object');

        done();
      });
  });
 });

/**********************/


describe('UC-204 Bij een bestaande user id wordt de juiste user uit de database geretourneerd. \
Bij een niet-bestaande user id wordt een passende foutmelding geretourneerd.', () => {
    it('TC-204-1 - Bestaande user id', (done) => {
        const existingUserId = 1;
        chai.request(app)            
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                //res.body.should.have.property('id').eql(existingUserId);
                let { data, message } = res.body;
                
                const user = data.find(user => user.id === existingUserId);

        // Assert that the user object is not null or undefined
        expect(user).to.exist;

        // Assert that the user object's contents are correct
        expect(user.firstName).to.equal('Marieke');
        expect(user.lastName).to.equal('Jansen');
        expect(user.emailAdress).to.equal('m@server.nl');
               
        done();
    });
      });
});

describe('Bij een niet-bestaande user id wordt een passende foutmelding geretourneerd.', () => {
  it('TC-204-2 - Niet-bestaande user id', (done) => {
      const nonExistingUserId = 999;
      chai.request(app)
          .get('/api/user')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
               let { data, message } = res.body;                
               const user = data.find(user => user.id === nonExistingUserId);
              expect(user).to.be.undefined;
              done();
          });
  });
});

describe('Update user', () => {
  const existingUserId = 1; // replace with an existing user ID in your database
  const nonExistingUserId = 999; // replace with a non-existing user ID in your database

  it('should update an existing user and return the updated user data', (done) => {
    const updatedUser = {
      firstName: 'John34',
      lastName: 'Doe34',
      email: 'john3.doe4@example.com'
    };

    chai.request(app)
      .put(`/api/user/${existingUserId}`)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(`User with ID ${existingUserId} updated successfully`);
        res.body.should.have.property('data');
        res.body.data.should.have.property('id').eql(existingUserId);
        res.body.data.should.have.property('firstName').eql(updatedUser.firstName);
        res.body.data.should.have.property('lastName').eql(updatedUser.lastName);
        res.body.data.should.have.property('email').eql(updatedUser.email);
        
        chai.request(app)            
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                //res.body.should.have.property('id').eql(existingUserId);
                let { data, message } = res.body;
                
                const user = data.find(user => user.id === existingUserId);
                console.log(user)
                });
        
        done();
      });
  });

  it('should return an appropriate error message for a non-existing user id', (done) => {
    const updatedUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    chai.request(app)
      .put(`/api/user/${nonExistingUserId}`)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(`User with ID ${nonExistingUserId} not found`);
        done();
      });
  });
});


describe('DELETE /api/user/:id', () => {
  // Test for deleting an existing user
  it('should delete a user with a valid ID', (done) => {
    const userId = 0; // replace with an existing user ID in your database
    chai.request(app)
      .delete(`/api/user/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(`User with ID ${userId} deleted successfully`);
        done();
      });
  });

  // Test for attempting to delete a non-existent user
  it('should return an error message with a non-existent ID', (done) => {
    const userId = 999; // replace with a non-existent user ID in your database
    chai.request(app)
      .delete(`/api/user/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal(`User with ID ${userId} not found`);
        done();
      });
  });
});