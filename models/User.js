const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const UserSchema = new Schema({
   
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create collection and add schema
mongoose.model('users', UserSchema, 'users');