const Post = require('../models/Post');

function UploadPost (request, response) {
    const { title, content, date } = request.body
    const imageURL = '../../public/' +request.file.filename
    const data = {title, content, date, imageURL}

    const post = new Post(data);
    post.save().then((savedPost) => {
        console.log('added new post: ', savedPost);
        response.send('Post created successfully!')
    }).catch((err) => {
        console.log('error occurred during the saving: ', err);
        response.status(500).send(`Post wasn't sent.`);
    })
}

module.exports = UploadPost;