const express = require('express')
const multer = require('multer')
const mysql = require('mysql')
const cors = require('cors')

const {pool, createPostsTable} = require('../database/db');

//posts table cration
createPostsTable(pool);

const postsRouter = express.Router()

postsRouter.use(express.json());
postsRouter.use (cors({
    origin: 'http://localhost:5173',
    credentials: true,  // enable passing cookies, authorization headers, etc.
}))

postsRouter.get('/', (request, response) => {
    const query = `SELECT * FROM posts ORDER BY id DESC`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Can't get this post`)
            console.error('Error in GET:', err)
        }
        else response.json(result)
    })
})

postsRouter.get('/:id', (request, response) => {
    const query = `SELECT * FROM posts WHERE id =${request.params.id}`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Can't get this post`)
            console.error('Error in GET:', err)
        }
        else response.json(result)
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${Math.floor(Math.random() * 1000)}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

postsRouter.post('/', upload.single('image'), (request, response) => {
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
})

postsRouter.patch('/:id', upload.none(), (request, response) => {
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
})

postsRouter.delete('/:id', (request, response) => {
    const query = `DELETE FROM posts WHERE id = ${request.params.id}`
    pool.query(query, (err, result) => {
        if (err) {
            response.status(500).send(`Post wasn't deleted`)
            console.error('Error in DELETE:', err)
        }
        else response.send('Post deleted successfully!')
    })
})

module.exports = postsRouter