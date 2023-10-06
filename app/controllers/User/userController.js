const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcryptjs");
const { user } = require("../../models/User/userModel")
const { order } = require("../../models/Order/orderModel");
const { food } = require("../../models/Food/foodItemModel");
const { json } = require("express");

module.exports.register = async (req, res) => {
    const { firstname, lastname, email, password, phoneno, city, address, pincode } = req.body;
    const saltRounds = 10;
    console.log("rereree", req.body);
    const userExist = await user.findOne({
        email: email
    })
    console.log("user", userExist);
    if (userExist) {
        // console.log("user Exist",res);
        res.status(409).send("User Already Exist")
    }


    else {
        // const encryptedPassword = await bcrypt.hash(password,saltRounds,(err, hash)=>{
        //     if(err){
        //         console.log("Error in Password Encryption",err);
        //     }
        //     return hash
        // })
        const encryptedPassword = await bcrypt.hash(password, saltRounds)

        console.log("encryptedPassword", encryptedPassword);

        try {
            const userData = new user({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: encryptedPassword,
                phoneno: phoneno,
                city: city,
                address: address,
                pincode: pincode,
                role: "user",
            })
            await userData.save()
            console.log("userdata", userData);
            res.status(200).send("User Registered Successfully")

        }
        catch (error) {
            console.log("error in registering user", error);
            res.status(403).send(error.message)
        }
    }
}

module.exports.login = async (req, res) => {
    console.log("in login user");
    const { email, password } = req.body;
    try {
        const check = await user.findOne({ email: email })
       

        // console.log("check", check._id.toString());
        // console.log("check", process.env.SECRET_KEY);

// const preference = check?.preference ? check?.preference : "not set";
        const myquery = { email: email };

        if (check) {
            const userId = check._id.toString()
            const comparePassword = await bcrypt.compare(password, check.password);
            console.log("comparedddd", comparePassword);
            if (comparePassword) {
                let token = jwt.sign(
                    {
                        userId: userId,
                        role: "user",
                        name: check.firstname,
                    },
                    process.env.SECRET_KEY, {
                    expiresIn: "1h"
                }
                )
                await user.findByIdAndUpdate({
                    _id: userId
                }, {
                    $set: {
                        token: token
                    }
                })
                const data = {
                    data: check,
                    message: "Logged In Successfully",
                    token: token,
                }
                res.status(200).send(data)
            }
            else {
                res.status(401).send("Incorrect Password")
                // res.json("Incorrect Password");
            }
        }
        else {
            res.status(400).send("User Does not exists")
            // res.json("not exists");
        }
    }
    catch (err) {
        console.log("error in login", err);
        res.status(400).send(err.message)
    }
}

module.exports.fetchOrders = async (req, res) => {

    const userId = req.query.user;
    const orderId = req.query.order;
    const orderStatus = req.query.status;
    const user_data = await user.find({ _id: userId })

    let fetchedOrder
    if (orderId === undefined) {
        console.log("undefined called");
        fetchedOrder = await order.find({ user_id: userId, order_status: orderStatus })
    }
    else {
        console.log("orderid called");
        fetchedOrder = await order.find({ _id: orderId })
    }


    const orderItems = []
    const orderWithItemData = []

    await Promise.all(
        fetchedOrder.map(async (order, i) => {
            const orderWithItem = {
                order: order,
                item: []
            }
            order.order_items.flatMap((item) => {
                orderItems.push(item)
                orderWithItem.item.push(item)
            })
            orderWithItemData.push(orderWithItem)
        })
    )

    const foodData = []
    await Promise.all(
        orderItems.map(async (item, i) => {
            const fooddata = await food.find({ _id: item.foodID })
            foodData.push(...fooddata)
        })
    )

    const data = {
        user_data: user_data,
        // orderWithItem: orderWithItemData,
        orderWithItem: fetchedOrder,
        foodData: foodData,
    }
    res.status(200).json({
        success: true,
        data: data,
        message: "Orders Fetched Successfully",
    })

}


module.exports.cretePreference = async (req, res) => {
    try {
        const { userId, preferences } = req.body;
        console.log(req.body);

        // let preferenceData = {};
        // preferences.forEach((prefer) => {
        //     const { category } = prefer.selectedValue;
        //     // If the category exists in preferenceData, increment its counter
        //     if (preferenceData[category]) {
        //         console.log("if set then", preferenceData, preferenceData[category]);
        //         preferenceData[category]++;
        //     } else {
        //         console.log("when not set then", preferenceData, preferenceData[category]);
        //         // If the category doesn't exist, add it and set the counter to 1
        //         preferenceData[category] = 1;
        //     }
        // });

        // console.log("preferenceData", preferenceData);

        const updateRes = await user.findByIdAndUpdate(
            {
                _id: userId
            },
            {
                $set: {
                    preference: preferences
                }
            },
            {
                returnDocument: "after"
            }
        )

        res.status(200).json({
            success: true,
            data: updateRes,
            message: "preference added successfully"
        })
    }
    catch (err) {
        console.log(err);
    }
}



module.exports.fetchUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userDetails = await user.findById({_id: userId})
        // console.log("user details", userDetails);
        res.send(userDetails)
    }
    catch (err) {
        console.log("error in fetching userinfo");
    }
}
// await Promise.all(
//     fetchedOrder.map(async (order, i) => {

//         const orderWithItems = {
//             order: order,
//             orderItems: []
//         };
//         // console.log("order", order);
//         order.order_items.flatMap((item) => {
//             // console.log("item", item);
//             orderItems.push(item)
//             // const orderWithItem = {
//             //     order: order,
//             //     item: item
//             // }
//             orderWithItems.orderItems.push(item);
//             // orderWithItemData.push(orderWithItem)
//         })
//         orderWithItemData.push(orderWithItems);
//     })
// )


/************************************original */
// await Promise.all(
//     fetchedOrder.map(async (order, i) => {
//         // console.log("order", order);
//         order.order_items.flatMap((item) => {
//             // console.log("item", item);
//             orderItems.push(item)
//             const orderWithItem = {
//                 order: order,
//                 item: item
//             }
//             orderWithItemData.push(orderWithItem)
//         })
//     })
// )