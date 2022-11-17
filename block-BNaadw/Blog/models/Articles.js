var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slugify');

var articlesSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
    author: { type: String, minlength: 4, required: true },
    slug: { type: String, unique: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true }
);

articlesSchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    replacement: '_',
    lower: true,
  });
  next();
});
var Article = mongoose.model('Article', articlesSchema);
module.exports = Article;
