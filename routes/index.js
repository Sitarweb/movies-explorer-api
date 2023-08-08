const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const { signup, signin } = require('../middlewares/validation');

router.post('/signin', signin, login);
router.post('/signup', signup, createUser);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
