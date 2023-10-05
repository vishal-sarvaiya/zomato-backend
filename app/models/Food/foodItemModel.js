// food name
// food category: gujarati,rajasthani
// food image
// food details: Thin crispy golden rice pancakes. Served with Sambhar, 
// food price:
// food rating
// food review

const mongoose = require("mongoose")
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    category:{
        type: String,
        required: true
    },
    image:{
        // data:Buffer,
        type: String,
        required: true
    },
    detail:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    quantity:{
        type: String,
        required: true
    },
    restaurant_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurant",
        required: true
    }
},{
    timestamps: true
})

const food = mongoose.model("Food",foodSchema)
module.exports = {
    food
}