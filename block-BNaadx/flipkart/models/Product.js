var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0, required: true },
  price: { type: Number, required: true },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
