const mongoose = require('mongoose');
const Book = require('./book');

// A Schema is the same as a Table in a normal SQL database
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err);
        } else if(books.length > 0) {
            next(new Error('This author has books still'));
        } else {
            next();
        }
    })
});

module.exports = mongoose.model('Author', authorSchema);