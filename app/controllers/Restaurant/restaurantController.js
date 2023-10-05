const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { restaurant } = require("../../models/Restaurant/restaurantModel")
const { order } = require("../../models/Order/orderModel");
const { ObjectId } = require("mongodb");
const { food } = require("../../models/Food/foodItemModel");
const { user } = require("../../models/User/userModel");


module.exports.restaurantregister = async (req, res) => {
    console.log("api called");
    const {
        restaurant_name,
        email,
        password,
        phoneno,
        city,
        pincode,
        address,
        category
    } = req.body;

    if (!req.files) {
        res.status(400).json({ message: "No file uploaded" });
    }
    const saltRounds = 10;

    const files = req.files
    console.log(files);

    const imageFolderPath = "app/uploads";
    const menuImagePath = `app/uploads/${files.menu_image[0].filename}`
    let imagePath = []
    for (let i of files.restaurant_images) {
        imagePath.push(`${imageFolderPath}/${i.filename}`)
    }

    const restaurantExist = await restaurant.findOne({
        email: email
    })

    if (restaurantExist) {
        res.status(409).send("Restaurant Already Exist")
    }
    else {
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        try {
            const restaurantData = new restaurant({
                restaurant_name: restaurant_name,
                category: category,
                email: email,
                password: encryptedPassword,
                phoneno: JSON.parse(phoneno),
                restaurant_images: imagePath,
                menu_image: menuImagePath,
                city: city,
                pincode: JSON.parse(pincode),
                address: address,
                role: "restaurant",
            })
            await restaurantData.save()
            console.log("restaurantdata", restaurantData);
            res.status(200).send("restaurant Registered Successfully")
        }
        catch (error) {
            console.log("error in registering restaurant", error);
            res.status(403).send(error.message)
        }
    }
}

module.exports.restaurantlogin = async (req, res) => {
    console.log("in login restaurant");
    const { email, password } = req.body;
    console.log("email", email);
    try {
        const check = await restaurant.findOne({ email: email })
        console.log("check", check);
        const userId = check._id.toString()

        if (check) {
            const comparePassword = await bcrypt.compare(password, check.password);
            if (comparePassword) {
                let token = jwt.sign({
                    userId: userId,
                    role: "restaurant",
                    restaurant_name: check.restaurant_name
                },
                    process.env.SECRET_KEY, {
                    expiresIn: "1h"
                }
                )

                await restaurant.findByIdAndUpdate({ _id: userId }, {
                    $set: {
                        token: token
                    }
                })
                const data = {
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
            res.status(400).send("Restaurant Does not exists")
            // res.json("not exists");
        }
    }
    catch (err) {
        console.log("error in login", err);
        res.status(400).send(err.message)
    }
}

module.exports.getRestaurant = async (req, res) => {
    console.log("get restaurant");
    const cityName = req.query.city;
    const restaurantId = req.query.restaurant;
    const userId = req.query.user;
    // console.log("city omly",userId);

    const userData = await user.findById(userId)
    console.log("userdata", userData?.preference);

    let preferences = userData?.preference;
    let preferenceData = {};
    preferences && preferences.length > 0 &&
        preferences.forEach((prefer) => {
            const { category } = prefer.selectedValue;
            // If the category exists in preferenceData, increment its counter
            if (preferenceData[category]) {
                // console.log("if set then", preferenceData, preferenceData[category]);
                preferenceData[category]++;
            } else {
                // console.log("when not set then", preferenceData, preferenceData[category]);
                // If the category doesn't exist, add it and set the counter to 1
                preferenceData[category] = 1;
            }
        });

    console.log("preferenceData in restaurant", preferenceData);

    try {
        let restaurantData;
        cityName ?
            restaurantData = await restaurant.find({ city: cityName })
            :
            restaurantId ?
                restaurantData = await restaurant.find({ _id: restaurantId })
                :
                restaurantData = await restaurant.find()

        const demoprefer = {
            Gujarati: 3,
            Italian: 2,
            Punjabi: 1
        }

        const d = restaurantData.sort((a, b) => {
            const categoryA = a.category; // Assuming restaurant objects have a "category" property
            const categoryB = b.category;
            // const categoryA = a.category; // Assuming restaurant objects have a "category" property
            // const categoryB = b.category;

            const scoreA = preferenceData[categoryA] || 0;
            const scoreB = preferenceData[categoryB] || 0;
         
            // Sort in descending order, adjust for ascending if needed
            return scoreB - scoreA;
        });
        res.status(200).send(d)
    }
    catch (err) {
        console.log("getRestaurant err", err);
        res.status(400).send(err)
    }
}

module.exports.showOrders = async (req, res) => {
    console.log("show order");
    //    /*****************************For Fetching Order for Restaurant******************************************** */
    const restaurantId = req.query.restaurant;
    const orderStatus = req.query.status;

    const agregatedData = await order.aggregate([
        // Match orders that have items from the desired supplier
        {
            $match: {
                "order_items.restaurantID": new ObjectId(restaurantId)
            }
        },
        // Unwind the OrderItems array to work with individual items
        {
            $unwind: "$order_items"
        },
        // Match items that belong to the desired supplier
        {
            $match: {
                "order_items.restaurantID": new ObjectId(restaurantId),
                "order_status": orderStatus
            }
        },

        // Project to shape the output
        {
            $project: {
                _id: 0,
                OrderID: "$_id",
                ProductID: "$order_items.foodID",
                Quantity: "$order_items.quantity",
                UnitPrice: "$order_items.price",
                Subtotal: "$order_items.subTotal",
                orderDate: "$orderDate"
            }
        }
    ]).exec()

    const foundedfoodData = []
    await Promise.all(
        agregatedData.map(async (adata, i) => {
            const foodData = await food.find({ _id: adata.ProductID })
            foundedfoodData.push(...foodData)
        })
    )

    const data = {
        foodData: foundedfoodData,
        orderData: agregatedData,
    }
    res.status(200).json({
        success: true,
        data: data,
        message: "Order Founded",
    })







    //     Open:

    // Confirmed: 

    // Delivered: 

    // Cancelled: 


    // .exec((err, supplierOrders) => {
    //     if (err) {
    //         console.error('Error:', err);
    //     } else {
    //         console.log('Supplier Orders:', supplierOrders);
    //     }
    // });
    // console.log("newOrder", newOrder);
    // // restaurant_id
    // food.map((foodProduct, index) => {
    //     const restaurantId = foodProduct.restaurant_id
    //     const orderData = restaurant.findByIdAndUpdate(
    //         {_id:restaurantId},
    //         {
    //             orders: {


    //                 price: foodProduct.price,

    //                 quantity: foodProduct.quantity,
    //                 _id: foodProduct._id,
    //                 restaurant_id: foodProduct.restaurant_id,
    //                 user_id: userId,
    //                 payment_method: payment_method,
    //                 status: status,
    //                 order_id: newOrder._id
    //             }
    //         },
    //     )

    // })
}
