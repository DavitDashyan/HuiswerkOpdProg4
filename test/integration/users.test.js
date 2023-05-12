const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');

const logger = require('../../src/util/utils').logger;
const pool = require('../../dbconnection');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test cases voor UC-201', function () {
    it('TC-201-1', (done) => {
        const user = {
            firstName: 'TC',
            lastName: '201-1', 
            password: 'secret',
        };

        chai.request(app)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('emailAddress is missing');
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-201-2', (done) => {
        const user = {
            firstName: "Pieter",
            lastName: "Robben",
            emailAddress: "p.robben.nl",
            street: "Hogeschoollaan",
            city: "Tilburg",
            password: "Wachtwoord123",
            phoneNumber: "06942126952",
            isActive : 1
        };

        chai.request(app)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('Invalid emailAddress');
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-201-3', (done) => {
        const user = {
            firstName: "Kees",
            lastName: "Robben",
            emailAddress: "p.robben.nl",
            street: "Hogeschoollaan",
            city: "Tilburg",
            password: "kees",
            phoneNumber: "06942126952",
            isActive : 1
        };

        chai.request(app)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                expect(res.body.status).to.equal(400);
                expect(res.body.message).to.equal('Invalid password');
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
    });

    it('TC-201-4', (done) => {
        // user is already in the database
        const user = {
            firstName: "Bart",
            lastName: "Janssen",
            isActive: 1,
            emailAddress: "m.vandullemen@server.nl",
            password: "secret123",
            phoneNumber: "",
            roles: "",
            street: "",
            city: ""
        };

        chai.request(app)
            .post('/api/user')
            .send(user)
            .end((err, res) => {
                expect(res.body.status).to.equal(403);
                expect(res.body.message).to.equal('Email address bestaat al');
                expect(res.body.data).to.be.an('object').that.is.empty;
                done();
            });
        })
    });

    it('TC-201-5', (done) => {
        const user = {
            firstName: "Sander",
            lastName: "Janssen",
            isActive: 1,
            emailAddress: "sanderjanssen@server.nl",
            password: "sandertje89",
            phoneNumber: "0623456789",
            street: "Lovensdijkstraat",
            city: "Breda"
        };

        const deleteQuery = 'DELETE FROM user WHERE emailAdress = ?';
        const values = [user.emailAddress];

        pool.getConnection((err, conn) => {
            if (err) {
                done(err);
            } else {
                conn.query(deleteQuery, values, (err, results) => {
                    if (err) {
                        done(err);
                    } else {
                        pool.releaseConnection(conn);
                        chai.request(app)
                            .post('/api/user')
                            .send(user)
                            .end((err, res) => {
                                expect(res.body.status).to.equal(200);
                                expect(res.body.message).to.equal(
                                    `Gebruiker met id ${res.body.data.id} is toegevoegd`
                                );
                                expect(res.body.data.firstName).to.equal(user.firstName);
                                expect(res.body.data.lastName).to.equal(user.lastName);
                                expect(res.body.data.emailAddress).to.equal(user.emailAddress);
                                expect(res.body.data.password).to.equal(user.password);
                                expect(res.body.data.isActive).to.equal(user.isActive);
                                expect(res.body.data.phoneNumber).to.equal(user.phoneNumber);
                                expect(res.body.data.street).to.equal(user.street);
                                expect(res.body.data.city).to.equal(user.city);

                                done();
                            });
                    }
                });
            }
        });
    });
