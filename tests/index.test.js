import request from 'supertest';
import express from 'express';

import { router } from '../routes/index';
import init from '../mongoConfigTesting';

const app = express();

beforeAll(async () => {
  await init();
});

app.use('/', router);

test('index route works', done => {
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect({ message: 'Hello World' })
    .expect(200, done)
});

// todo: resolve testing warning
// "A worker process has failed to exit gracefully and has been force exited."