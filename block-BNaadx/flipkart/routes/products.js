var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var User = require('../models/Users');

//add product
router.get('/:userId/add', (req, res, next) => {
  var userId = req.params.userId;
  res.render('addProducts', { userId });
});
router.post('/:userId/add', (req, res, next) => {
  var userId = req.params.userId;
  Product.create(req.body, (err, product) => {
    if (err) return next(err);
    res.redirect('/products/' + userId + '/all');
  });
});
//list product
router.get('/:userId/all', (req, res, next) => {
  var userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (err) return next(err);
    Product.find({}, (err, products) => {
      if (err) return next(err);
      res.render('allProducts', { user, products });
    });
  });
});
//add cart
router.get('/:userId/:productId', (req, res, next) => {
  var userId = req.params.userId;
  var productId = req.params.productId;
  User.findByIdAndUpdate(
    userId,
    { $push: { cart: productId } },
    { new: true },
    (err, updatedUser) => {
      if (err) return next(err);
      res.redirect(`/users/${userId}/cart`);
    }
  );
});
module.exports = router;
