const http2 = require('node:http2');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const CREATED = http2.constants.HTTP_STATUS_CREATED;

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => { // !!!
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы невалидные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Фильм с указанным id не найден');
      else if (movie.owner.toString() !== req.user._id) throw new ForbiddenError('Вы не являетесь автором, поэтому не можете удалить этот фильм');
      else {
        Movie.deleteOne(movie)
          .then(() => res.send(movie));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id карточки'));
        return;
      }
      next(err);
    });
};
