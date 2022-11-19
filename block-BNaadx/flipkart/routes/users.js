var express = require('express');
var router = express.Router();
var User = require('../models/Users');
// var flash = require("connect-flash")
/* GET users listing. */
router.get('/admin', function (req, res, next) {
  res.render('admin');
});
router.get('/client', function (req, res, next) {
  res.render('user');
});
//user client register
router.get('/client/register', function (req, res, next) {
  res.render('userRegister.ejs', { error: req.flash('error')[0] });
});
router.post('/client/register', (req, res, next) => {
  req.body.isAdmin = false;
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.name == 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      if (err.name == 'MongoError') {
        req.flash('error', 'Email already taken');
        return res.redirect('back');
      }
    }
    res.redirect('/users/login');
  });
});
//user admin register
router.get('/admin/register', function (req, res, next) {
  res.render('adminRegister.ejs');
});
router.post('/admin/register', (req, res, next) => {
  req.body.isAdmin = true;
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
});
//user login
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error')[0] });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email and Password are required');
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
        return res.redirect('/users/login');
      }
      req.session.userID = user.id;
      res.redirect(`/users/${user.id}/dashboard`);
    });
  });
});
//dashboard
router.get('/:id/dashboard', (req, res, next) => {
  var userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) return next(err);
    res.render('dashboard', { user });
  });
});
router.get('/:userId/cart', (req, res, next) => {
  var userId = req.params.userId;

  User.findById(userId)
    .populate('cart')
    .exec((err, user) => {
      res.render('cart', { user });
    });
});
module.exports = router;
