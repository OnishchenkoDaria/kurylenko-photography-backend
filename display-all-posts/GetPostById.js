const Post = require('../models/Post');

function displayPostById (request, response) {
    const id = request.params.id;
    Post.findById(id)
        .then((post) => {
            response.json(post);
        })
        .catch(err => {
            console.log(err);
            response.status(500).send(`Can't get this post`)
        })
}

module.exports = displayPostById;