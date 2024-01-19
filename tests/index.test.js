import request from 'supertest';
import express from 'express';
import createError from 'http-errors';

import { router } from '../routes/map';
import Map from '../models/map';
import init from '../mongoConfigTesting';

const app = express();

beforeAll(async () => {
  await init();

  await Map.create({
    mapId: '1',
    characters: [
      {
        name: 'Waldo',
        xLeftBound: 1367,
        xRightBound: 1387,
        yUpperBound: 636,
        yLowerBound: 666
      }
    ]
  })
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);
app.use(function (req, res, next) { next(createError(404)) });
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.locals.message = err.message;
  res.status(err.status || 500).send(err);
})

describe('sending guesses and receiving feedback', () => {
  test('error when guessing for a nonexistent map', done => {
    request(app)
      .post('/maps/woof')
      .send({})
      .expect('Map not found.')
      .expect(404, done)
  });

  test('incomplete guess', done => {
    request(app)
      .post('/maps/1')
      .type('form')
      .send({})
      .expect({
        errors: [
          {
            path: 'x',
            msg: 'X-coordinate must be a number.'
          }, {
            path: 'y',
            msg: 'Y-coordinate must be a number.'
          }, {
            path: 'character',
            msg: 'No character was specified.'
          }
        ]
      })
      .expect(200, done)
  });

  test('incorrectly-formatted guess', done => {
    request(app)
      .post('/maps/1')
      .type('form')
      .send({
        x: 'Woof',
        y: 'Woof',
        character: 'Woof'
      })
      .expect({
        errors: [
          {
            path: 'x',
            msg: 'X-coordinate must be a number.'
          }, {
            path: 'y',
            msg: 'Y-coordinate must be a number.'
          }, {
            path: 'character',
            msg: 'This character does not exist in this map.'
          }
        ]
      })
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