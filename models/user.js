//mongo database
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery',false);
const url = process.env.MONGODB_URI;

//console.log('connecting to the: ', url);

mongoose.connect(url)
    .then(() => console.log('Connected to the MongoDB.'))
    .catch(err => console.log('Error occurred connecting to MongoDB: ', err))

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('user', userSchema);