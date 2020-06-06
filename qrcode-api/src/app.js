const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');
const project = require('./constants/project');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: project.message,
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
