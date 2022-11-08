var express = require('express');
var router = express.Router();
var User = require('../modules/User');
/* GET users listing. */
router.get('/register', function (req, res, next) {
  res.render('index');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.send(`saved`);
  });
});
module.exports = router;
