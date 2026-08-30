const db = require("../../Models");

const getEducationService = async (userId) => {
  const education = await db.Education.findAll({
    where: { userId },
    include: [
      { model: db.School, attributes: ["id", "name"] },
      { model: db.Degree, attributes: ["id", "name"] },
      { model: db.FieldOfStudy, attributes: ["id", "name"] },
    ],
    order: [["startDate", "DESC"]],
  });

  return education;
};

module.exports = getEducationService;