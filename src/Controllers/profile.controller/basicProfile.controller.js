const { createProfileService } = require("../../services/profile/basicProfile.service");
const { getMyProfileService } = require("../../services/profile/getMyProfile.service");
const createProfile = async (req, res) => {
  try {
    const result = await createProfileService({
      ...req.body,
      userId: req.user.id,
      file: req.file,
    }); //completedd

    return res.status(201).json({
      message: "Profile created",
      profile: result,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const myProfile = async (req, res) => {
  try {
    const result = await getMyProfileService({
      userId: req.user.id,
    });
    return res
      .status(200)
      .json({ message: "profile fetched", profile: result });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createProfile, myProfile };
  