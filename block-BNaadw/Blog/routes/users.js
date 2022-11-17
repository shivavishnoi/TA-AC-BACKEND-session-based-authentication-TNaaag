var express = require('express');
var router = express.Router();
var User = require('../models/Users');

/* Add users */
router.get('/register', function (req, res, next) {
  res.render('registerUser', { error: req.flash('error')[0] });
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code == 11000) {
        req.flash('error', 'Email is already in Use');
        return res.redirect('/users/register');
      }
      if ((err.name = 'ValidationError')) {
        req.flash('error', 'Password should have atleast 6 characters');
        return res.redirect('/users/register');
      }
    }
    return res.redirect('/users/login');
  });
});
//login
router.get('/login', (req, res, next) => {
  res.render('loginUser', { error: req.flash('error')[0] });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'password and email are required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'User is not Registered');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password is incorrect');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users/dashboard/' + user.id);
    });
  });
});
//dashboard
router.get('/dashboard/:id', (req, res, next) => {
  var id = req.params.id;
  User.findById(id, (err, user)=>{
 if (err) return next(err);
 res.render('dashboard', {user});
  })
});
//logout;
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
