const mongoose = require("mongoose")
  
const orderSchemaStructure = {
    _id:String,
    restaurant_id:String,
    user_id:String,
    price:Number,
    quantity:String,
    payment_method:String,
    status:String,
    order_id:String
}

const restaurantSchema = new mongoose.Schema({
    restaurant_name: {       
            type:String,
            required:true,
            lowercase:true,
            trim: true,        
    },
    email: {
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
    },
    phoneno:{
        type : Number,
        required: true,
        minLength: 10,
        maxLength:12
    },
    restaurant_images: {
        type : [String],
        // required : true
    },
    menu_image: {
        type : String,
        // required: true
    },
    city: {
        type: String,
        required:true
    },
    pincode:{
        type :Number,
        required:true
    },
    address: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    }
    // orders:{
    //     type:[orderSchemaStructure],
    //     // required: true
    // }
},
{
    timestamps: true
})

const restaurant = mongoose.model('Restaurant',restaurantSchema);
module.exports = {
    restaurant
}


// const category = ["Pizza","South Indian","Punjabi","Desserts","Gujarati","Chinese","Mexican","Burger","Cake","Fastfood"]