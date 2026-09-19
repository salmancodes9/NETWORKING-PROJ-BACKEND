const db = require("../Models");
const { uploadToS3 } = require("../aws/s3UploadService.aws"); // adjust path/name to match your actual file

// GET /api/profile/me
const getMyProfile = async (req, res) => {
  try {
    const profile = await db.Profile.findOne({
      where: { userId: req.user.id },
      include: [
        { model: db.MemberProfile },
        { model: db.User, attributes: ["id", "email", "role", "isVerified"] },
      ],
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/profile/:userId  (view someone else's public profile)
const getProfileByUserId = async (req, res) => {
  try {
    const targetUserId = Number(req.params.userId);

    const profile = await db.Profile.findOne({
      where: { userId: targetUserId },
      include: [
        { model: db.MemberProfile, attributes: ["name", "bio", "profilePicUrl"] },
      ],
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/profile/me
const updateProfile = async (req, res) => {
  try {
    const profile = await db.Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const memberProfile = await db.MemberProfile.findOne({ where: { profileId: profile.id } });
    if (!memberProfile) return res.status(404).json({ message: "Member profile not found" });

    const { name, bio } = req.body;

    await memberProfile.update({
      name: name ?? memberProfile.name,
      bio: bio ?? memberProfile.bio,
    });

    res.status(200).json({ message: "Profile updated", memberProfile });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/profile/me/picture  (multipart/form-data, using multer + your existing S3 upload)
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    const profile = await db.Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const memberProfile = await db.MemberProfile.findOne({ where: { profileId: profile.id } });
    if (!memberProfile) return res.status(404).json({ message: "Member profile not found" });

    const imageUrl = await uploadToS3(req.file); // adjust based on your actual S3 upload function signature

    await memberProfile.update({ profilePicUrl: imageUrl });

    res.status(200).json({ message: "Profile picture updated", profilePicUrl: imageUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getMyProfile, getProfileByUserId, updateProfile, updateProfilePicture };