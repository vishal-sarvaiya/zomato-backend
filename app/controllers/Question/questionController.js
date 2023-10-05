const { question } = require("../../models/Question/questionModel")

module.exports.addQuestion = async (req, res) => {
    console.log("question controller called");
    const { questions, option } = req.body;

    try {
        const questionData = new question({
            question: questions,
            option: option
        })

        const saveRes = await questionData.save();

        if (saveRes) {
            console.log("saveRes", saveRes);
            res.status(200).json({
                success: true,
                data: saveRes,
                message: "Question Added Successfully"
            })
        }
    }
    catch (err) {
        console.log("question Adding Error", err);
        res.status(400).json({
            success: false,
            error: err,
            data: [],
        })
    }
}

module.exports.fetchQuestion = async (req, res) => {
    try {
        const fetchedQuestion = await question.find();
        // console.log("fetched questions", fetchedQuestion);
        res.status(200).json({
            success: true,
            data: fetchedQuestion,
            message: "Questions Fetched Successfully"
        })
    }
    catch (err) {
        console.log("Question Fetching Error", err);
        res.status(400).json({
            success: false,
            error: err,
            message: "Error in fetching Questions"
        })
    }
}

module.exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    let { updatedQuestion } = req.body;

    console.log("id", req.params);
    try {
        const updatedOptionRes = await question.findByIdAndUpdate({
            _id: id
        },
            {
                $set: {
                    question: updatedQuestion,
                }
            },
            { new: true }
        )
        if (updatedOptionRes) {
            res.status(200).json({
                success: true,
                data: updatedOptionRes,
                message: "Question Updated Successfully"
            })
        }
    }
    catch (err) {
        console.log("update err", err);
        res.status(400).json({
            success: false,
            error: err
        })
    }

}

module.exports.deleteQuestion = async(req, res) =>{
    const { id } = req.params;
    try{
        const deleteRes = await question.findByIdAndRemove(id)
        console.log("Deleted",deleteRes);
        res.status(200).json({
            success: true,
            data: [],
            message: "Question Deleted Successfully"
        })
    }
    catch(err){
        console.log("error in deleting questions", err);
        res.status(400).json({
            success: false,
            error: err,
            message: "Question not deleted"
        })
    }
}