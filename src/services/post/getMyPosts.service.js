const db = require("../../Models");

const getMyPosts = async (userId) => {
  const posts = await db.Post.findAll({
    where: { userId, isDeleted: false },
    order: [["createdAt", "DESC"]],
  });

  return posts;
};

module.exports = getMyPosts;