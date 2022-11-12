var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req, res, next) => {
  console.log(req.session);
  res.render('dashboard');
});

/* GET users listing. */
router.get('/register', function (req, res, next) {
  res.render('register.ejs');
});
router.get('/login', function (req, res, next) {
  res.render('login.ejs');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.render('login');
  });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        res.redirect('/users/login');
      }
      req.session.userID = user.id;
      res.redirect('/users');
    });
  });
});
module.exports = router;
