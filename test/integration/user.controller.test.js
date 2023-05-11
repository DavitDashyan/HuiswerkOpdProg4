const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
let database = [];

chai.should();
chai.use(chaiHttp);

describe('Manage users', () => {
  describe('UC 201 add user /api/', () => {
    beforeEach((done) => {
      database = [];
      done();
    });
    it('when a request input is missing, a valid error should be returned', (done) => {
      chai
        .request(server)
        .post('/api/register')
        .send({
          //firstName ontbreekt
          lastName: 'VanDeSpek',
          emailAdress: 'keesVanDeSpek@gmail.com'
        })
        .end((err, res) => {
          //   res.body.should.has.property('status').to.be.equal(400);
          //   res.body.should.have.property('error');
          res.body.should.be.a('object');
          let { status, result } = res.body;
          status.should.equal(400);
          result.should.be.a('string').that.equal('must be a string');
          done();
        });
    });
  });
});
