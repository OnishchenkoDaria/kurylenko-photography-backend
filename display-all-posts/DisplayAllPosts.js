const Post = require('../models/Post');

async function DisplayAllPosts(request, response) {

    try{
        const posts = await Post.find({});
        response.json(posts);
    } catch(err){
        console.log(err);
        response.status(500).send(`post records not found`);
    }
}

module.exports = DisplayAllPosts;