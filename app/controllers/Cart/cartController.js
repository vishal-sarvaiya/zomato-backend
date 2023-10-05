// const { ObjectId } = require("mongodb").ObjectId;
const { default: mongoose } = require("mongoose");
const { cart } = require("../../models/Cart/cartModel");
const { food } = require("../../models/Food/foodItemModel")

module.exports.addToCart = async (req, res) => {
    console.log("in cart");
    try {
        // console.log(req.body);
        const { foodData, userId } = req.body;

        // Fetch the cartData from the database
        let cartData = await cart.findOne({ user_id: userId });

        if (!cartData) {
            // If no cart exists for the user, create a new one
            const newCart = new cart({
                user_id: userId,
                cart_items: [],
                grand_total: 0,
            });
            cartData = await newCart.save();
        }

        const existingCartItemIndex = cartData.cart_items.findIndex(
            (item) => item.foodID.toString() === foodData.foodID
            );  

        console.log("existing cart index", existingCartItemIndex);

        if (existingCartItemIndex !== -1) {
            // If the food item already exists in the cart, update the quantity and subtotal
            cartData.cart_items[existingCartItemIndex].quantity += foodData.quantity;
            console.log("cartData.cart_items[existingCartItemIndex].quantity", cartData.cart_items[existingCartItemIndex].quantity);

            cartData.cart_items[existingCartItemIndex].subTotal = cartData.cart_items[existingCartItemIndex].price * cartData.cart_items[existingCartItemIndex].quantity;
            console.log("cartData.cart_items[existingCartItemIndex].subTotal", cartData.cart_items[existingCartItemIndex].subTotal);
        } else {
            // If the food item is not in the cart, add it
            cartData.cart_items.push({
                foodID: foodData.foodID,
                quantity: foodData.quantity,
                restaurantID: foodData.restaurantID,
                price: foodData.price,
                subTotal: foodData.subTotal,
            });
        }

        const newGrandTotal = cartData.cart_items.reduce(
            (total, item) => total + item.subTotal, 0);

        cartData.grand_total = newGrandTotal;
        await cartData.save();

        console.log("cartdata", cartData);
        res.send("Product Added To Cart Successfully");
    } catch (err) {
        console.log("error in Adding To Cart", err);
        res.status(400).send(err);
    }
};

module.exports.updateCart = async (req, res) => {
    console.log("in update cart");
    try {
        const { cartId, foodID, quantity, price,grand_total } = req.body;
        const fetchedCart = await cart.findOne({ _id: cartId });

        const cartItemIndex = fetchedCart.cart_items.findIndex(item => item.foodID.toString() === foodID);

        if (cartItemIndex !== -1) {
            fetchedCart.cart_items[cartItemIndex].quantity = quantity;
            fetchedCart.cart_items[cartItemIndex].subTotal = quantity * JSON.parse(price);
        
            fetchedCart.grand_total = fetchedCart.cart_items.reduce((total, item) => total + item.subTotal, 0);
        
            const updatedCart = await fetchedCart.save()
            console.log("upated",updatedCart);
            res.status(200).json({
                success: true,
                data: updatedCart,
                message: "Cart Updated Successfully",
            })
        } else {
            console.log("Cart item not found");
        }
    } catch (err) {
        console.log("error in Updating To Cart", err);
        res.status(200).json({
            success: false,
            data: err,
            message: "Error in Updating the Cart",
        })
    }
};

module.exports.deleteCartItem = async(req,res) =>{
    console.log("in delete");
    const cartId = req.params.cartId;
    const foodId = req.params.foodId
    console.log(req.params.cartId);
    console.log(req.params.foodId);
  
    const fetchedCart = await cart.findOne({_id: cartId})
    const cartItemIndex = fetchedCart.cart_items.findIndex((item)=> item.foodID.toString() === foodId)


    const filter = { foodID: foodId };
    const updatedCartItems = fetchedCart.cart_items.filter(item => item.foodID.toString() !== foodId);
    fetchedCart.cart_items = updatedCartItems;
    fetchedCart.grand_total = updatedCartItems.reduce((total, item) => total + item.subTotal, 0);
    const updatedCart = await fetchedCart.save();

    console.log("updated cart" ,updatedCart);
    if(updatedCart){
        console.log("success");
        res.send("success")
    }
    else{
        res.send("failed")
    }

    // if(cartItemIndex !== -1){
    //     const deleted = await fetchedCart.splice(cartItemIndex,1);
    //     const deleteOperation ={
    //         $pull:{
    //             cart_items:{
    //                 foodId: new mongoose.Types.ObjectId(foodId)
    //             }
    //         }
    //     }
    //     console.log("daelete operation :", deleteOperation);
    //     const updateCart  =await cart.findOneAndUpdate(
    //         {
    //             _id: cartId
    //         },
    //         deleteOperation,
    //         {
    //             new:true
    //         }
    //     )
    //     console.log("updated cart after delete operation", updateCart);
    // }
    // else{
    //     console.log("cart item not found");
    // }
    // console.log("fetched",cartItemIndex);
}

module.exports.fetchCartData = async (req, res) => {
    try {
        console.log("fetch cart called");
        const userId = req.query.user;
        console.log("userid", userId);
        const cartData = await cart.find({ user_id: userId })
        console.log("cartData", cartData);


        const foodData = await Promise.all(cartData[0].cart_items.map(async (item, i) => {
            console.log("item", item);
            const foodData = await food.find({ _id: item.foodID });
            return foodData;
        }));

        console.log("foodDatawithfetched", foodData);
        const cartWithItemDetails = {
            cartData: cartData,
            foodData: foodData
        }
        res.status(200).send(cartWithItemDetails)
    }
    catch (err) {
        console.log("error in fetching cart data", err);
        res.status(400).send(err)
    }
}















/******************************************MY OLD CODE************************************************* */
// const {cart} = require("../../models/Cart/cartModel")
// module.exports.addToCart = async(req,res) =>{
//     console.log("in cart");

//     try {
//         console.log(req.body);
//         const { foodData, userId } = req.body
//         const foodOrders = []

//         console.log("length", foodData.length);
//         let grandTotal = 0;
//         if (foodData.length > 1) {
//             for (let food of foodData) {
//                 foodOrders.push(food)
//                 grandTotal = grandTotal + food.subTotal;
//             }
//         }
//         else {
//             foodOrders.push(foodData)
//             grandTotal = foodData.subTotal
//         }



//         // const newCart = new cart({
//         //     user_id: userId,
//         //     cart_items: foodOrders,
//         //     grand_total: grandTotal
//         // })
//         const newCart = {
//            foodID: foodData.foodID,
//            quantity:foodData.quantity,
//            restaurantID: foodData.restaurantID,
//            price:foodData.price,
//            subTotal:foodData.subTotal
//         }

//        const cartData = await cart.findOneAndUpdate(
//             { user_id: userId },
//             { $push: { cart_items: newCart} },
//             { upsert: true, new: true }
//           )
//           cartData.grand_total = cartData.cart_items.reduce((total, item) => total + item.price * item.quantity, 0);
//           await cartData.save();

//           console.log("cartdata",cartData);
//         // await newCart.save();        
//         res.send("succcess")
//     }
//     catch (err) {
//         console.log("error in Adding To Cart", err);
//         res.status(400).send(err)
//     }
// }