const db = require("../../Models");
const s3UploadService = require("../../aws/s3UploadService.aws");
const getS3SignedUrl = require("../../aws/s3SignedUrlService.aws");

const createProfileService = async ({ bio, userId, file }) => {
  try {
    if (!bio) {
      throw new Error("bio cannot be empty");
    }

    if (!userId) {
      throw new Error("user not authenticated");
    }

    const existingProfile = await db.Profile.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new Error("profile already exists for this user");
    }

    let profilePicUrl = null;
    if (file) {
      profilePicUrl = await s3UploadService(
        file.originalname,
        file.buffer,
        file.mimetype,
        "profiles/",
      );
    }

    const profileCreation = await db.Profile.create({
      bio,
      profilePicUrl,
      userId,
    });

    if (profileCreation.profilePicUrl) {
      profileCreation.profilePicUrl = await getS3SignedUrl(
        profileCreation.profilePicUrl,
      );
    }

    return profileCreation;
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw new Error("profile already exists for this user");
    }

    throw new Error(err.message || "something went wrong");
  }
};

module.exports = createProfileService;
module.exports.createProfileService = createProfileService;
