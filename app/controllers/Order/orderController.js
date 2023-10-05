const { order } = require("../../models/Order/orderModel")
const { restaurant } = require("../../models/Restaurant/restaurantModel")
const { user } = require("../../models/User/userModel")
const { cart } = require("../../models/Cart/cartModel")

const restaurantOrderStructure = {
    name: String,
    category: String,
    image: String,
    detail: String,
    price: Number,
    __v: Number,
    quantity: String,
    _id: String,
    restaurant_id: String,
    user_id: String,
    payment_method: String,
    status: String,
    order_id: String
}

module.exports.placeOrder = async (req, res) => {
    try {
        // console.log(req.body);
        const { foodData, userId, payment_method, order_status, cart_order } = req.body
        console.log("req.body placeorder", req.body);
        const foodOrders = []
        const currentDate = new Date();


        console.log("cart_order", cart_order, foodData.length);
        let grandTotal = 0;

        if (foodData.length >= 2) {
            // Always push items as an array, even if there's only one item
            foodOrders.push(...foodData);
            grandTotal = foodData.reduce((total, food) => total + food.subTotal, 0);
        }
        else if (foodData) {
            foodOrders.push(foodData);
            grandTotal = foodData.subTotal
        }

        const userData = await user.findById({ _id: userId })
        console.log("userfind", userData);

        const newOrder = new order({
            user_id: userId,
            orderDate: currentDate,
            delievery_address: userData.address,
            payment_method: payment_method,
            order_status: order_status,
            order_items: foodOrders,
            grand_total: grandTotal
        })
        const orderSaveRes = await newOrder.save();
        console.log("ordersave res", orderSaveRes);
        if (orderSaveRes) {
            if (cart_order !== false) {
                const cartDeleteRes = await cart.findByIdAndRemove(cart_order)
                // console.log("cart delte res", cartDeleteRes);
                if (cartDeleteRes) {
                    res.status(200).json({
                        success: true,
                        data: [],
                        message: `Order Placed Successfully Your Order Id Is ${orderSaveRes._id}`,
                    })
                }
            }
            else {
                res.status(200).json({
                    success: true,
                    data: [],
                    message: `Order Placed Successfully Your Order Id Is ${orderSaveRes._id}`,
                })
            }
        }
    }
    catch (err) {
        console.log("error in placing order", err);
        res.status(400).send(err)
    }
}

module.exports.cancelOrder = async (req, res) => {
    try {
        console.log("cancel order", req.params.orderId);
        const orderId = req.params.orderId
        const cancelRes = await order.findByIdAndUpdate({ _id: orderId },
            {
                order_status: "Cancelled"
            },
            {
                returnDocument: "after"
            })

        if (cancelRes.order_status === "Cancelled") {
            res.status(200).json({
                success: true,
                message: "Order Cancelled Successfully",
                data: []
            })
        }
        console.log("cancelRes", cancelRes);
    }
    catch (err) {
        console.log("error in order cancellation", err);
    }
}




