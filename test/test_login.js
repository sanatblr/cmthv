const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('/cmt/login', () => {
  it('should redirect to /cmt/seat/reserve for regular users', (done) => {
    const email = 'regular@example.com';
 //   const encodedEmail = encodeURIComponent(email); // Encode the email value

    request(app)
      .post('/cmt/login')
      .send({ email })
      .expect(302)
      .expect('Location', '/cmt/seat/reserve')
      .expect('Set-Cookie', `email;`) // Check for the encoded email value in the Set-Cookie header
      .end(done);
  });

  it('should redirect to /cmt/seat/reset for admin users', (done) => {
    const email = 'admin@createmytrip.com';
//    const encodedEmail = encodeURIComponent(email); // Encode the email value

    request(app)
      .post('/cmt/login')
      .send({ email })
      .expect(302)
      .expect('Location', '/cmt/seat/reset')
//      .expect('Set-Cookie', `email=${encodedEmail};`) // Check for the encoded email value in the Set-Cookie header
      .end(done);
  });

  it('should set cookies', (done) => {
    const email = 'test@example.com';

    request(app)
      .post('/cmt/login')
      .send({ email })
      .expect(302)
      .expect('Set-Cookie', /email=test@example.com;/)
      .expect('Set-Cookie', /token=.+;/)
      .end(done);
  });

  // Add more test cases to cover different scenarios
});
