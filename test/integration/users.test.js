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

/*
describe('UC-202-2 Opvragen van overzicht van users', () => {
    it('TC-202-1 - Toon alle gebruikers, minimaal 2', (done) => {
        // Voer de test uit
        chai
            .request(server)
            .get('/api/user')
            .end((err, res) => {
                assert(err === null);

                res.body.should.be.an('object');
                let {
                    data,
                    message,
                    status
                } = res.body;

                status.should.equal(200);
                message.should.be.a('string').equal('User getAll endpoint');

                // Je kunt hier nog testen dat er werkelijk 2 userobjecten in het array zitten.
                // Maarrr: omdat we in een eerder test een user hebben toegevoegd, bevat
                // de database nu 3 users...
                // We komen hier nog op terug.
                data.should.be.an('array').that.has.length(3);

                done();
            });
    });

    // Je kunt een test ook tijdelijk skippen om je te focussen op andere testcases.
    // Dan gebruik je it.skip
    it.skip('TC-202-3 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
        // Voer de test uit
        chai
            .request(server)
            .get('/api/user')
            .query({
                name: 'foo',
                city: 'non-existent'
            })
            // Is gelijk aan .get('/api/user?name=foo&city=non-existent')
            .end((err, res) => {
                assert(err === null);

                res.body.should.be.an('object');
                let {
                    data,
                    message,
                    status
                } = res.body;

                status.should.equal(200);
                message.should.be.a('string').equal('User getAll endpoint');
                data.should.be.an('array');

                done();
            });
    });
});
*/