const db = require("../../Models")

const createEducaitonService = async (userId,{schoolName,degreeName,fieldOfStudyName,startDate,endDate  }) =>{

    const profile = await db.Profile.findOne({where:{userId}});
    if(!profile){
        throw new Error("You must create  a profile before adding education")
    }
    if(!school){
        throw new Error("School is requires")
    }
     if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new Error("Start date cannot be after end date");
  }

    const [school] = await  db.School.findOrCreate({
        where:{name: schoolName.trim() },
    })
    let degree = null;
    if (degreeName){
        [degree] = await db.Degree.findOrCreate({
            where:{name:degreeName.trim()}
        })

        let fieldOfStudy = null;
        if(fieldOfStudyName){
            [fieldOfStudy] = await db.FieldOfStudy.findOrCreate({
                where: {name: fieldOfStudy.trim()}
            })
        }
    }
    
const education = await db.Education.create({
    userId,
    schoolId: school.Id,
    degreeId: degree? degree.id: null,
    fieldOfStudy: fieldOfStudy? fieldOfStudy.id : null,
    startDate, 
    endDate

})
return education;


}
module.exports = createEducaitonService;