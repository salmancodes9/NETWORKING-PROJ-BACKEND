const createProfileService = require("../../services/profile/basicProfile");

const createProfile = async (req, res) => {
  try {
    const result = await createProfileService({
      ...req.body,
      userId: req.user.id,
      file: req.file,
    });

    return res.status(201).json({
      message: "Profile created",
      profile: result,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createProfile }