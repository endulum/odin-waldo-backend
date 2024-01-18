import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';

import { router as indexRouter } from './routes/index'

// import './mongoConfig';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.use(function (req, res, next) { next(createError(404)) });
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.status(err.status || 500).send(err);
})

app.listen(3000, () =>
  console.log('listening on port 3000'),
);