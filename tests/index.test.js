import request from 'supertest';
import express from 'express';

import { router } from '../routes/index';
import init from '../mongoConfigTesting';

const app = express();

beforeAll(async () => {
  await init();
});

app.use('/', router);

test.only('index route works', done => {
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect({ message: 'Hello World' })
    .expect(200, done)
});

describe('sending guesses and receiving feedback', () => {
  test('incomplete guess', done => {
    request(app)
      .post('/maps/1')
      .type('form')
      .send({})
      .expect([
        {
          path: 'x',
          msg: 'X-coordinate is missing.'
        }, {
          path: 'y',
          msg: 'Y-coordinate is missing.'
        }, {
          path: 'character',
          msg: 'No character was specified.'
        }
      ])
      .expect(200, done)
  });

  test('wrong guess', done => {
    request(app)
      .post('/maps/1')
      .type('form')
      .send({
        x: 0,
        y: 0,
        character: 'Waldo'
      })
      .expect({
        isCorrect: false
      })
      .expect(200, done)
  });

  test('correct guess', done => {
    request(app)
      .post('/maps/1')
      .type('form')
      .send({
        x: 1377,
        y: 650,
        character: 'Waldo'
      })
      .expect({
        isCorrect: true
      })
      .expect(200, done)
  });
});