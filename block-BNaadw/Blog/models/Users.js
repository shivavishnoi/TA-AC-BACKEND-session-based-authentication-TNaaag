var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const { router } = require('../app');
var usersSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    full_name: { type: String },
    location: { type: String, required: true },
    email: { type: String, required: true, minlength: 6, unique: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);
//fullname
usersSchema.pre('save', function (next) {
  this.full_name = this.first_name + ' ' + this.last_name;
  next();
});
//hashing password
usersSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});
//verify password
usersSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    cb(err, result);
  });
};

var User = mongoose.model('User', usersSchema);
module.exports = User;
