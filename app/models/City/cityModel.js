const mongoose = require("mongoose")

const citySchema = new mongoose.Schema({
    city_name:{
        type: String,
        required: true,
        minLength: 2,
        unique: true
    }
},{
    timestamps: true
})

const city = mongoose.model("City", citySchema)

module.exports = {
    city
}