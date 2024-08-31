const express = require('express')
const multer = require('multer')

//const {pool, createPostsTable} = require('../database/db');

//posts table cration
//createPostsTable(pool);

const postsRouter = express.Router()

postsRouter.use(express.json());

//display all posts in the blog
const displayAll = require('../display-all-posts/DisplayAllPosts');

postsRouter.get('/', (req, res) => {
    displayAll(req, res);
})

const displayPostById = require('../display-all-posts/GetPostById');

//displaying post by id
postsRouter.get('/:id', (req, res) => {
    displayPostById(req, res);
})

//initializing the storing of media
const storage = multer.diskStorage({
    //where files will be stored
    destination: (req, file, cb) => {
        cb(null, '../frontend/public')
    },
    //with what name they would be stored
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${Math.floor(Math.random() * 1000)}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

//uploading new post
const UploadPost = require('../work-with-posts/UploadPost');

postsRouter.post('/', upload.single('image'), (req, res) => {
    UploadPost(req, res);
})

//updating post by id
const UpdatePost = require('../work-with-posts/UpdatePost');

postsRouter.put('/update/:id', upload.none(), (req, res) => {
    UpdatePost(req, res);
})

//deleting the post by id
const DeletePost = require('../work-with-posts/DeletePost');

postsRouter.delete('/delete/:id', (req, res) => {
    DeletePost(req, res);
})

module.exports = postsRouter