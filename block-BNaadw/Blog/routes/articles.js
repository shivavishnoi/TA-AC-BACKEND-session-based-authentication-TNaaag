var express = require('express');
const Article = require('../models/Articles');
const User = require('../models/Users');
var router = express.Router();

//articles add
router.get('/new', (req, res, next) => {
  res.render('addArticle');
});
router.post('/new', (req, res, next) => {
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.render('articleDetails', { article });
  });
});
module.exports = router;
