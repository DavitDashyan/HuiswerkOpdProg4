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

let addedMealId = 0 ;
// TC-301-1: Verplicht veld ontbreekt
describe('test uc-301, 303 t/m 305', () => {
  it('TC-301-1: should return an error message when a required field is missing', (done) => {
    const meal = {
      // Laat een vereist veld weg, zoals 'discription'
      price: 12.75,
      name: 'Tomaten soep',
      isActive: 1,
      isVega: 0,
      isVegan: 0,
      isToTakeHome: 1,
      dateTime: '2023-05-21 18:30:00',
      maxAmountOfParticipants: 8,
      cookId: 1,
      createDate: '2023-05-21 12:00:00',
      updateDate: '2023-05-21 12:30:00',
      price: '9.99',
      imageUrl: 'https://example.com/meal-image.jpg',
      name: 'Spaghetti Bolognese',
      //  description: 'Classic Italian pasta dish',
      allergenes: 'gluten,lactose'
    };
    chai
      .request(server)
      .post('/api/meal')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send(meal)
      .end((err, response) => {
        assert.equal(response.status, 400);
        assert.equal(response.body.message, 'description is missing');
        done();
      });
  });

  // TC-301-2: Niet ingelogd
  it('TC-301-2: should return an error message when user is not logged in', (done) => {
    const meal = {
      price: 12.75,
      name: 'Tomaten soep',
      isActive: 1,
      isVega: 0,
      isVegan: 0,
      isToTakeHome: 1,
      dateTime: '2023-05-21 18:30:00',
      maxAmountOfParticipants: 8,
      cookId: 1,
      createDate: '2023-05-21 12:00:00',
      updateDate: '2023-05-21 12:30:00',
      price: '9.99',
      imageUrl: 'https://example.com/meal-image.jpg',
      name: 'Spaghetti Bolognese',
      description: 'Classic Italian pasta dish',
      allergenes: 'gluten,lactose'
    };

    chai
      .request(server)
      .post('/api/meal')
      .send(meal)
      .end((err, response) => {
        assert.equal(response.status, 401);
        assert.equal(response.body.message, 'Authorization header missing!');
        done();
      });
  });

  // TC-301-3: Maaltijd succesvol toegevoegd
  it('TC-301-3: should return a success message when meal is successfully added', (done) => {
    const meal = {
      price: 12.75,
      name: 'Tomaten soep',
      isActive: 1,
      isVega: 0,
      isVegan: 0,
      isToTakeHome: 1,
      dateTime: '2023-05-21 18:30:00',
      maxAmountOfParticipants: 8,
      cookId: 1,
      createDate: '2023-05-21 12:00:00',
      updateDate: '2023-05-21 12:30:00',
      price: '9.99',
      imageUrl: 'https://example.com/meal-image.jpg',
      name: 'Spaghetti Bolognese',
      description: 'Classic Italian pasta dish',
      allergenes: 'gluten,lactose'
    };

    chai
      .request(server)
      .post('/api/meal')
      .set('authorization', 'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey))
      .send(meal)
      .end((err, response) => {
        console.log('RESPONSE.BODY=', response.body.data);
        assert.equal(response.status, 201);
        assert.equal(
          response.body.message,
          `Meal with id ${response.body.data.id} has been added`
        );
        addedMealId = response.body.data.id;
        //   assert.equal(response.body.data.id, [insertedId]);
        done();
      });
  });

  it('TC-303-1: should return a list of meals', (done) => {
    chai
      .request(server)
      .get('/api/meal')
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.isArray(response.body.results);
        //   assert.isAtLeast(response.body.results.length, 1, 'Er moet ten minste één maaltijd zijn');
        done();
      });
  });

  it('TC-304-1: should return 404 if meal does not exist', (done) => {
    const mealId = 1234; 

    chai
      .request(server)
      .get(`/api/meal/${mealId}`)
      .end((err, response) => {
        assert.equal(response.status, 404);
        assert.equal(
          response.body.message,
          `Meal met id ${mealId} kan niet gevonden worden...`
        );
        done();
      });
  });

  it('TC-304-2: should return details of meal if it exists', (done) => {
    const mealId = 1; 
    chai
      .request(server)
      .get(`/api/meal/${mealId}`)
      .end((err, response) => {
        assert.equal(response.status, 200);
        assert.equal(
          response.body.message,
          `Meal met id ${mealId} is gevonden`
        );
        assert.isObject(response.body.data);
        done();
      });
  });

    it('TC-305-1: should return 401 if not logged in', (done) => {
      const mealId = 5;
  
      chai
        .request(server)
        .delete(`/api/meal/${mealId}`)
        .end((err, response) => {
          assert.equal(response.status, 401);
          done();
        });
    });
  
    it('TC-305-2: should return 403 if not the owner of the data', (done) => {
      const mealId = addedMealId; 
      const userId = 2; 
  
      chai
        .request(server)
        .delete(`/api/meal/${mealId}`)
        .set('authorization', 'Bearer ' + jwt.sign({ id: userId }, jwtSecretKey))
        .end((err, response) => {
          assert.equal(response.status, 403);
          done();
        });
    });
  
    it('TC-305-3: should return 404 if meal does not exist', (done) => {
      const mealId = 123; // Assuming an invalid meal ID
      const userId = 1; // Assuming the owner user ID
  
      chai
        .request(server)
        .delete(`/api/meal/${mealId}`)
        .set('authorization', 'Bearer ' + jwt.sign({ id: userId }, jwtSecretKey))
        .end((err, response) => {
          assert.equal(response.status, 404);
          done();
        });
    });
  
    it('TC-305-4: should successfully delete the meal', (done) => {
      const mealId = addedMealId; // Created during TC-301-3
      const userId = 1; // My own user ID
  
      chai
        .request(server)
        .delete(`/api/meal/${mealId}`)
        .set('authorization', 'Bearer ' + jwt.sign({ id: userId }, jwtSecretKey))
        .end((err, response) => {
          assert.equal(response.status, 200);
          assert.equal(response.body.message, `Meal with ID ${mealId} has been deleted`);
          done();
        });
    });
  });