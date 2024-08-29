const Post = require('../models/Post');

async function UpdatePost (request, response) {
    try {
        await Post.findOneAndUpdate({_id: request.params.id}, {
            title: request.body.title,
            content: request.body.content,
        }, {new: true});
        return response.status(200).json({ message: 'post updated successfully' });
    } catch(err){
        console.log(err);
        return response.status(500).json({error: 'error adding order record to user' });
    }
}

module.exports = UpdatePost;