const Post = require('../models/Post');


async function DeletePost (request, response) {
    try{
        await Post.findOneAndDelete({_id: request.params.id});
        return response.status(200).json({message: 'post deleted successfully'})
    } catch(err){
        console.log(err);
        response.status(500).json({error: 'error deleting failed'});
    }
}

module.exports = DeletePost;