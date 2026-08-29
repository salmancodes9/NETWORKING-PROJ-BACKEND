const db = require("../../Models");
module.exports = async (userId) => {
  if (!userId) throw new Error("user id is missing");
  const user = await db.User.findByPk(userId);
  if (!user) throw new Error("user not found");

  await user.update({ refreshToken: null });
  return { message: "logged out successfully", userId };
};
