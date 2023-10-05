const { food } = require("../../models/Food/foodItemModel")
const fs = require("fs")
const { restaurant } = require("../../models/Restaurant/restaurantModel")
const { ObjectId } = require("mongodb")

module.exports.addFood = async (req, res) => {
    // console.log("reqbody",req.body);
    // console.log("reqfiles",req.file);
    const { name, price, category, details, restaurantId, quantity } = req.body
    const file = req.file
    if (!req.file.fieldname) {
        res.status(400).json({ message: "No file uploaded" });
    }

    // console.log("filename");
    const imagePath = `app/uploads/${file.filename}`
    try {
        const foodData = new food({
            image: imagePath,
            name: name,
            price: JSON.parse(price),
            category: category,
            detail: details,
            restaurant_id: restaurantId,
            quantity: quantity
        })
        await foodData.save()
        // console.log("fooddata",foodData);
        res.status(200).json({
            success: true,
            message:"Food Details Added Successfully",
            data: foodData,
        })

    }
    catch (err) {
        console.log("image upload error", err);
        res.status(500).json({
            success: false,
            error:"Error Adding the Food Details",
            message: "Error Adding the Food Details "
        })
    }
}

module.exports.getFood = async (req, res) => {
    console.log("in get");
    console.log("getfood", req.query);
    const restaurant_id = req.query.restaurant
    const food_id = req.query.fooditem
    console.log(food_id, "***", restaurant_id);
    if (food_id) {
        try {
            const fooddetail = await food.find({ _id: food_id })

            const allFoodDetailsExceptMain = await food.find(
                {
                    $and: [
                        { _id: { $ne: food_id } },
                        { restaurant_id: restaurant_id }
                    ]
                })
            const allFoodDetailsAllRestaurantExceptMain = await food.find({
                _id: {
                    $ne: food_id
                }
            })
            const restaurantdetail = await restaurant.find({
                _id: new ObjectId(restaurant_id)
            })

            console.log("Redsfdsfdsfdsfd",allFoodDetailsExceptMain);
            const restaurantWithFood = {
                restaurant: restaurantdetail,
                food: fooddetail,
                allFoodDetailsExceptMain: allFoodDetailsExceptMain,
                allFoodDetailsAllRestaurantExceptMain: allFoodDetailsAllRestaurantExceptMain,
            }
            res.status(200).send(restaurantWithFood)
        }

        catch (err) {
            console.log("err", err);
            res.status(400).send(err)
        }
    }
    else {
        console.log("with restaurant_id");
        try {
            const fooddetail = await food.find({ restaurant_id: restaurant_id })
            const restaurantdetail = await restaurant.find({
                _id: restaurant_id
            })
            const restaurantWithItsFood = {
                restaurant: restaurantdetail,
                food: fooddetail,
            }
            res.status(200).send(restaurantWithItsFood)
        }
        catch (err) {
            console.log("err", err);
            res.status(400).send(err)
        }
    }
}

module.exports.updateFood = async (req, res) => {
    try{
    let { price, category, details, name, restaurantId, quantity, foodId, image } = req.body;

    console.log("up called", req.body);
    console.log("old file", image);
    console.log("up called file", req.file);


    if (req.file) {
        image = req.file.path;
    }
    const food_id = new ObjectId(foodId)
    console.log("fff", foodId, food_id);
    const updateRes = await food.findByIdAndUpdate(
        { _id: food_id },
        {
            $set: {
                price: JSON.parse(price),
                category: category,
                detail: details,
                name: name,
                restaurant_id: restaurantId,
                quantity: quantity,
                image: image
            }
        },
        {
            returnDocument: "before"
        })

    console.log("update res", updateRes);
    if (updateRes) {
        if(req.file) {
            console.log("image", updateRes.image);
            fs.unlink(updateRes.image, (err) => {
                if (err) {
                    console.log("image delete error during update", err);
                }
                console.log("image also deleted");
                res.status(200).json({
                    success: true,
                    message: "Food Item Updated Successfully",
                    data: []
                })
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "Food Item Updated Successfully",
                data: []
            })
        }
     
    }
}
catch(err){
    console.log("error in updating food items",err);
    res.status(400).json({
        success: false,
        message: "Error in Food Item Update",
        data: []
    })
}
}

module.exports.deleteFood = async (req, res) => {
    console.log("in delete form");
    console.log(req.params.id);
    // res.send("deleted")
    try {
        // const p =__dirname+"app/uploads/2e4cca8756a4af06592a86ba73a5e314_16896582771692419455893.jpg"
        // console.log("path",p);
        const deletedItem = await food.findByIdAndDelete(req.params.id)
        if (deletedItem) {
            const imagePath = deletedItem.image
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log("image remove error", err);
                }
                console.log("deleted", deletedItem.image);
                console.log("image file removed");
                res.status(200).json({
                    success: true,
                    message: "Item Deleted Successfully",
                    data: []
                })
            })
        }
        else {
            console.log(req.params.id, "not deleted");
            res.status(400).json({
                success: false,
                error: "Item Not Deleted",
                message: "Item Not Deleted",
            })
        }
    }
    catch (err) {
        console.log("deleteerr", err);
        res.status(400).json({
            success: false,
            error: "Item Not Deleted",
            message: "Item Not Deleted",
        })
    }
}

module.exports.getAllFood = async(req,res) =>{
    try{
        const foodData = await food.find();
        res.status(200).json({
            success: true,
            data: foodData,
            message: "Food Items Founded",
        })
    }
    catch(err){
        console.log("error in fetching all food",err);
        res.status(400).json({
            success: false,
            data: [],
            message: "Food Not Founded",
        })
    }
}

