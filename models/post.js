//mongo database
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery',false);
const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(() => console.log('Connected posts to the MongoDB.'))
    .catch(err => console.log('Error occurred connecting posts to MongoDB: ', err))

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: String,
    likes: String,
    views: String,
    imageURL: String,
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        //delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('post', postSchema);