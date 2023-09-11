const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const { handleAllErrors } = require('./errors/errors');
const invalidRoutes = require('./routes/invalidURLs');
const { PATTERN } = require('./utils/constants');
const corsHandler = require('./middlewares/corsHandler');

const {
  createUser,
  login,
} = require('./controllers/users');

const {
  PORT = 3000,
  MONGODB_URI = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

mongoose.connect(MONGODB_URI, {
  autoIndex: true,
});

app.use(cookieParser());
app.use(express.json());
app.use(corsHandler);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(PATTERN),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

// 404 Not Found Route
app.use('*', invalidRoutes);

// Error Handling Middleware
app.use(errors());
app.use(handleAllErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
