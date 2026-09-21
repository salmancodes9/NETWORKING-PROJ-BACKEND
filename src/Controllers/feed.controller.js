const db = require("../Models");
const getSignedImageUrl = require("../aws/s3SignedUrlService.aws");

const hydrate = async (post, postType) => {
  const plain = post.toJSON();

  if (plain.imageUrl) {
    plain.imageUrl = await getSignedImageUrl(plain.imageUrl);
  }

  const profile = plain.Profile || {};
  const memberProfile = profile.MemberProfile || null;
  const companyProfile = profile.CompanyProfile || null;

  plain.postType = postType;
  plain.accountType = profile.profileType || postType;
  plain.name = memberProfile?.name || companyProfile?.companyName || "Unknown";
  plain.profileId = profile.id || null;
  plain.userId = profile.userId || null;

  return plain;
};

const getFeed = async (req, res) => {
  try {
    const memberPosts = await db.Post.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.Profile,
          include: [
            { model: db.MemberProfile },
            { model: db.User, attributes: ["id", "email", "role"] },
          ],
        },
      ],
    });

    const companyPosts = await db.CompanyPost.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.Profile,
          include: [
            { model: db.CompanyProfile },
            { model: db.User, attributes: ["id", "email", "role"] },
          ],
        },
      ],
    });

    const taggedMember = await Promise.all(
      memberPosts.map((p) => hydrate(p, "member")),
    );
    const taggedCompany = await Promise.all(
      companyPosts.map((p) => hydrate(p, "company")),
    );

    const feed = [...taggedMember, ...taggedCompany].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json(feed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getFeed };
