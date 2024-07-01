const {pool} = require('../database/db');

function DeletePost (request, response) {
    const query = `DELETE FROM posts WHERE id = ${request.params.id}`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Post wasn't deleted`)
            console.error('Error in DELETE:', err)
        }
        else response.send('Post deleted successfully!')
    })
}

module.exports = DeletePost;