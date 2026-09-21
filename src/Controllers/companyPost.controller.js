const db = require("../Models");
const uploadToS3 = require("../aws/s3UploadService.aws");
const getSignedImageUrl = require("../aws/s3SignedUrlService.aws");

const hydratePost = async (post) => {
  const plainPost = post.toJSON ? post.toJSON() : post;

  if (plainPost.imageUrl) {
    plainPost.imageUrl = await getSignedImageUrl(plainPost.imageUrl);
  }

  return plainPost;
};

const getProfileForCurrentUser = async (userId) =>
  db.Profile.findOne({ where: { userId } });

const create = async (req, res) => {
  try {
    const profile = await getProfileForCurrentUser(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Only allow company profiles to create via this controller
    if (profile.profileType !== "company") {
      return res
        .status(403)
        .json({ message: "Only company profiles can create company posts" });
    }

    const { content } = req.body;
    let { imageUrl } = req.body;

    if (req.file) {
      imageUrl = await uploadToS3(
        req.file.originalname,
        req.file.buffer,
        req.file.mimetype,
        "company-posts",
      );
    }

    if (!content && !imageUrl) {
      return res.status(400).json({ message: "Post must have text or image" });
    }

    const post = await db.CompanyPost.create({
      profileId: profile.id,
      content: content ?? null,
      imageUrl: imageUrl ?? null,
    });

    const savedPost = await db.CompanyPost.findByPk(post.id, {
      include: [
        {
          model: db.Profile,
          include: [
            { model: db.User, attributes: ["id", "email", "role"] },
            { model: db.CompanyProfile },
            { model: db.MemberProfile },
          ],
        },
      ],
    });

    return res.status(201).json(await hydratePost(savedPost));
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const post = await db.CompanyPost.findByPk(req.params.id, {
      include: [{ model: db.Profile }],
    });

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.Profile?.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own post" });
    }

    await post.update({ isDeleted: true });

    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getAll = async (_req, res) => {
  try {
    const posts = await db.CompanyPost.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.Profile,
          include: [
            { model: db.User, attributes: ["id", "email", "role"] },
            { model: db.CompanyProfile },
            { model: db.MemberProfile },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const hydratedPosts = await Promise.all(posts.map(hydratePost));

    return res.status(200).json(hydratedPosts);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getMine = async (req, res) => {
  try {
    const profile = await getProfileForCurrentUser(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const posts = await db.CompanyPost.findAll({
      where: {
        profileId: profile.id,
        isDeleted: false,
      },
      include: [
        {
          model: db.Profile,
          include: [
            { model: db.User, attributes: ["id", "email", "role"] },
            { model: db.CompanyProfile },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const hydratedPosts = await Promise.all(posts.map(hydratePost));

    return res.status(200).json(hydratedPosts);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  create,
  remove,
  getAll,
  getMine,
};
