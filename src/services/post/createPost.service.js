const db = require("../../Models")

const createPost = async (userId ,{ content , imageUrl}) =>{
    if(!content && !imageUrl){
        throw new Error("Post must have an image or content either")
    }
    const post = await db.Post.create({
        userId,
        content,
        imageUrl
    })
    return post

}
module.exports = createPost;