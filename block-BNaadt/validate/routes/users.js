var express = require('express');
var router = express.Router();
var User = require('../models/Users');
/* GET users listing. */
router.get('/register', function (req, res, next) {
  let error = req.flash('error2')[0];
  res.render('register', { error });
});
router.get('/login', function (req, res, next) {
  let error = req.flash('error1')[0];
  let pwerror = req.flash('error3')[0];
  res.render('login', { error, pwerror });
});
router.get('/dashboard', function (req, res, next) {
  res.render('dashboard');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.render('login');
  });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!password || !email) {
    req.flash('error1', 'Username / Password is Compulsory');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error2', 'Username not found, Register here');
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (result) {
        req.session.userId = user.id;
        console.log(req.session);
        res.redirect('/users/dashboard');
      } else {
        req.flash('error3', 'Password is incorrect');
        res.redirect('/users/login');
      }
    });
  });
});
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});
module.exports = router;
