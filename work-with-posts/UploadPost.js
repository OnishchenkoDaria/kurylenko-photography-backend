const {pool} = require('../database/db');

function UploadPost (request, response) {
    const { title, content, date } = request.body
    const imageURL = '../../public/' +request.file.filename
    const post = {title, content, date, imageURL}
    query = `INSERT INTO posts SET ?`
    pool.query(query, post, (err, result) => {
        if (err) {
            response.status(500).send(`Post wasn't sent.`)
            console.error('Error in POST:', err)
        }
        else response.send('Post created successfully!')
    })
}

module.exports = UploadPost;