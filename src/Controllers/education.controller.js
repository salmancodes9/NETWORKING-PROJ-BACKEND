const createEducationService = require("../services/education/createEducation.service");
const getEducationService = require("../services/education/getEducation.service");

const createEducation = async (req, res) => {
  try {
    const result = await createEducationService(req.user.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getEducation = async(req,res) =>{
    try{
        const result = await getEducationService(req.user.id);
        res.status(200).json(result);

    }catch(err){
        res.status(400).json({message:err.message})

    }
}
module.exports ={getEducation, createEducation}