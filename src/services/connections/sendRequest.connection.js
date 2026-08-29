const db = require("../../Models")
const {Op} = db.sequelize
const sendRequest = async (requesterId, receiverId)=>{
    if(requesterId === receiverId){
        throw new Error("You cant send a connection request to yourself")
    }

    const exisitng = await db.Connection.findOne({
        where:{
            [Op.or] : [
                {requesterId, receiverId},
                {requesterId, receiverId, receiverId: requesterId}
            ]

        }
    }) 
    if(existing){
    if ( exisitng.status === "accepted") throw new Error("Already Connected")
        if (exisitng.status === "pending") throw new Error("A connection request already exisits between you two")
    }
const connection = await db.Connection.create({
    requesterId,
    receiverId,
    status: "pending"
});
return { message:"Connection request sent",connection}

}
module.exports = sendRequest;