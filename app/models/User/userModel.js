const mongoose = require("mongoose")

const prefer = {
    id:mongoose.Schema.Types.ObjectId,
    selectedValue:{
        value: String,
        category: String,
        _id: mongoose.Schema.Types.ObjectId,
    },
    _id: mongoose.Schema.Types.ObjectId,
}

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minLength:2,
    },
    lastname: {
        type: String,
        required: true,
        minLength:2,       
    },
    email:{
        type:String,
        unique: true,
        required:true,
        lowercase:true,
        trim: true,
    },
    password: {
        type:String,
        required:true,
        minLength:8,
    },
    role: {
        type: String,
        required: true,
        enum: ["user","restaurant","admin"],
    },
    token:{
        type: String,
        // required: true,
    },
    phoneno:{
        type : Number,
        required: true,
        minLength: 10,
        maxLength:12
    },
    city: {
        type:String,
        required:true,
        trim: true,
    },
    address: {
        type:String,
        required:true,
        trim: true,
    },
    pincode: {
        type:Number,
        required:true,
    },
    preference:{
        type: [prefer] 
    }
},{
    timestamps: true
})

const user = mongoose.model('User',userSchema);
module.exports = {
    user
}

// module.exports = mongoose.model('user',userSchema,'Users')