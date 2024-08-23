//mongo database
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery',false);
const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(() => console.log('Connected users to the MongoDB.'))
    .catch(err => console.log('Error occurred connecting users to MongoDB: ', err))

const orderSchema = new mongoose.Schema({
    price: String,
    date: String,
    status: String,
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    orders: [orderSchema],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('user', userSchema);