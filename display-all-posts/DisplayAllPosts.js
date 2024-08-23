const Post = require('../models/Post');

function DisplayAllPosts(request, response) {
    Post.find({})
        .then((posts) => {
            response.json(posts);
        })
        .catch((err) => {
            console.log(err);
            response.status(500).send(`post records not found`);
        })

    /*const query = `SELECT * FROM posts ORDER BY id DESC`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Can't get this post`)
            console.error('Error in GET:', err)
        }
        else response.json(result)
    })*/
}

module.exports = DisplayAllPosts;