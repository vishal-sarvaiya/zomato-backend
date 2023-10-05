const mongoose = require("mongoose")
const {food} = require("../Food/foodItemModel")

const cartSchemaStructure = {
    foodID:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "food",
        required:true
    },
    quantity:Number,
    restaurantID:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "restaurant",
        required: true
    },
    price:Number,
    subTotal:Number,
}
const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    cart_items:{
        type:[cartSchemaStructure],
        required:true
    },
    grand_total:{
        type:Number,
        required:true
    }
},
{
    timestamps: true
})

cartSchema.pre('save', function(next) {
    if (this.isModified('cart_items') || this.isNew) {
      this.grand_total = this.cart_items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
    next();
  });

const cart = mongoose.model("Cart", cartSchema)

module.exports = {
    cart
}