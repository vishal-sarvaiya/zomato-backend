const Router = require("express");
const { addQuestion, updateQuestion, fetchQuestion, deleteQuestion } = require("../../controllers/Question/questionController");
const router =  Router();

router.post("/addquestion",addQuestion)
router.get("/fetchquestions", fetchQuestion)
router.put("/updatequestion/:id", updateQuestion)
router.delete("/deletequestion/:id",deleteQuestion)



module.exports = router;