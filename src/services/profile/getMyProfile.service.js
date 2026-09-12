const db = require("../../Models");
const getS3SignedUrl = require("../../aws/s3SignedUrlService.aws");

const getMyProfileService = async ({ userId }) => {
  
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const profile = await db.Profile.findOne({
    where: {id:userId },
    include: [
      {
        model: db.User,
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (profile === null) {
    throw new Error("Profile not found");
  }

  const profileData = profile.toJSON();

  if (profileData.profilePicUrl) {
    profileData.profilePicUrl = await getS3SignedUrl(profileData.profilePicUrl);
  }

  return {
    ...profileData,
    name: profileData.User?.name || null,
  };
};

module.exports = getMyProfileService;
module.exports.getMyProfileService = getMyProfileService;

