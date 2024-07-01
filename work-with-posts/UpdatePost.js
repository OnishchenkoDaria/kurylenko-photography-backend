const {pool} = require('../database/db');

function UpdatePost (request, response) {
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    const update = [request.body.title, request.body.content, request.params.id]
    console.log(update)
    pool.query(query, update, (err, result) => {
        if (err) {
            response.status(500).send(`Update wasn't applied.`)
            console.error('Error in PATCH:', err)
        }
        else response.send('Post updated successfully!')
    })
}

module.exports = UpdatePost;