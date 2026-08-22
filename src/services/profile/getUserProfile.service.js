const db = require("../../Models");
const getS3SignedUrl = require("../../aws/s3SignedUrlService.aws");

const getUserProfile = async ({userId}) =>{
    if(!userId){
        throw new Error("please enter valid userid")
    } 
    const  userProfile = await db.Profile.findOne({where :{id:userId},
     include: [
    {
      model: db.User,
      attributes: ["name"],
    },
  ],
})
    if(userProfile === null){
        throw new Error("Profile not found")
    }

const profileData = userProfile.toJSON();

  if (profileData.profilePicUrl) {
    profileData.profilePicUrl = await getS3SignedUrl(profileData.profilePicUrl);
  }

  return {
    ...profileData,
      name: profileData.User?.name || null,

  };
};
module.exports = getUserProfile;