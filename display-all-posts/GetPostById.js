const {pool} = require('../database/db');

function displayPostById (request, response) {
    const query = `SELECT * FROM posts WHERE id =${request.params.id}`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Can't get this post`)
            console.error('Error in GET:', err)
        }
        else response.json(result)
    })
}

module.exports = displayPostById;