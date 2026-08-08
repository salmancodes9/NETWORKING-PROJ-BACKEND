const db = require("../../Models")

const  deletePost = async (userId , postId)=>{
    const post = db.Post.findOne({where : postId, isDeleted: false})


    if(!post) {
        throw new Error("Post not found")
    }
    if (post.userId !== userId){
            throw new Error("You are not authorized to delete this post");

    }
    await post.update({isDeleted: true})

  return { message: "Post deleted successfully" };

}
module.exports = deletePost;