const db = require("../../Models")
const {Op} = db.Sequelize


const sendRequest = async (requesterId, receiverId)=>{
    if(requesterId === receiverId){
        throw new Error("You cant send a connection request to yourself")
    }

    const existing = await db.Connection.findOne({
        where:{
            [Op.or] : [
                {requesterId, receiverId},
                {requesterId: receiverId, receiverId: requesterId}
            ]

        }
    }) 
    if(existing){
    if ( existing.status === "accepted") throw new Error("Already Connected")
        if (existing.status === "pending") throw new Error("A connection request already exisits between you two")
    }
const connection = await db.Connection.create({
    requesterId,
    receiverId,
    status: "pending"
});
return { message:"Connection request sent",connection}

}
module.exports = sendRequest;