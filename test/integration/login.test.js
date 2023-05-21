const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Login API', () => {
  describe('POST /login', () => {
    it('TC-101-1: return 400 if required field is missing', (done) => {
      chai
        .request(app)
        .post('/api/login')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Invalid required field');
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });

    it('TC-101-2: should return 400 if password is not valid', (done) => {
      chai
        .request(app)
        .post('/api/login')
        .send({
          emailAdress: 'm.vandullemen@server.nl',
          password: 'wrongpassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('User not found or password invalid');
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });

    it('TC-101-3: should return 404 if user does not exist', (done) => {
      chai
        .request(app)
        .post('/api/login')
        .send({
          emailAdress: 'nonexistent@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('User not found or password invalid');
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });

    it('TC-101-4: should return 200 with user info and token if login is successful', (done) => {
      chai
        .request(app)
        .post('/api/login')
        .send({
          emailAdress: 'm.vandullemen@server.nl',
          password: 'secret'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body.results).to.have.property('id');
          expect(res.body.results).to.have.property('firstName');
          expect(res.body.results).to.have.property('lastName');
          expect(res.body.results).to.have.property('emailAdress');
          expect(res.body.results).to.have.property('token');
          done();
        });
    });
  });
});
