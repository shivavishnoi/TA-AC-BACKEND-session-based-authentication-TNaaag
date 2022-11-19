var express = require('express');
const session = require('express-session');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});
router.get('/logout', function (req, res, next) {
  res.clearCookie(session.sid);
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
