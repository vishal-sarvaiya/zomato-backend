const mongoose = require("mongoose")

const foodSchemaStructure = {
    foodID:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    restaurantID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"restaurant",
        required: true
    },
    quantity:Number,
    price:Number,
    subTotal:Number,
}
const orderSchema = new mongoose.Schema({
   
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    orderDate:{
        type: Date,
        required:true,
    },
    delievery_address:{
        type:String,
        required:true,
    },
    payment_method: {
        type: String,
        required: true,
    },  
    order_status: {
        type: String,
        required: true
    },
    order_items:{
        type:[foodSchemaStructure],
        required:true
    },
    grand_total:{
        type:Number,
        required:true
    }
   
   
},{
    timestamps: true
})

const order = mongoose.model("Order", orderSchema)

module.exports = {
    order
}