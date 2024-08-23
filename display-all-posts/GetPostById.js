//const {pool} = require('../database/db');
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

    /*const query = `SELECT * FROM posts WHERE id =${request.params.id}`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Can't get this post`)
            console.error('Error in GET:', err)
        }
        else response.json(result)
    })*/
}

module.exports = displayPostById;