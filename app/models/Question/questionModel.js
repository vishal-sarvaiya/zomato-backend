const mongoose = require("mongoose");

const optionSchema = {
    value: String,
    category: String,
}

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    option: {
        type: [optionSchema],
        required: true,
    }
}, { timestamps: true }
)

const question = mongoose.model("Question",questionSchema)

module.exports = {
    question
}