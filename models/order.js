//mongo database
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery',false);
const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(() => console.log('Connected orders to the MongoDB.'))
    .catch(err => console.log('Error occurred connecting orders to MongoDB: ', err))

const orderSchema = new mongoose.Schema({
    user_id: String,
    price: String,
    email: String,
    date: String,
    status: String,
})

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('order', orderSchema);