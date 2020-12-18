const mongoose = require('mongoose');

// A Schema is the same as a Table in a normal SQL database
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Author', authorSchema);