const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов, пожалуйста, повторите попытку позже',
});

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());

app.use(routes);
app.use(errors());

app.use(errorHandler);

async function connect() {
  await mongoose.connect(DB_URL, {});
  await app.listen(PORT);
}

connect();
