const db = require("../../Models");

const getAllPosts = async () => {
  const posts = await db.Post.findAll({
    where: { isDeleted: false },
    include: [{ model: db.User, attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });

  return posts;
};

module.exports = getAllPosts;