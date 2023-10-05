const { city } = require("../../models/City/cityModel")
const { restaurant } = require("../../models/Restaurant/restaurantModel")
module.exports.addCity = async (req, res) => {
    let { cityName } = req.body;
    cityName = cityName.toLowerCase();
    cityName = cityName[0].toUpperCase() + cityName.slice(1);
    try {
        const CityData = new city({
            city_name: cityName,
        })

        await CityData.save();
        console.log("city data", CityData);
        res.status(200).send("City Details Added Successfully")

    }
    catch (err) {
        console.log("error in adding new city", err);
        console.log("error in adding new city", err._message);
        res.status(500).send("Error in Adding City");
    }
}

module.exports.getCity = async (req, res) => {
    const CityData = await city.find()
    const restaurantData = await restaurant.find()

    const CityRestaurantCount = []
    const count = {};

    restaurantData.forEach((restaurant) => {
        const city = restaurant.city;
      
        if (count[city]) {
            // If the city already exists in the count object, increment the count
            count[city]++;
        } else {
            // If the city doesn't exist in the count object, initialize it with a count of 1
            count[city] = 1;
        }
    });

    console.log("count", count);
    for (const city in count) {
        CityRestaurantCount.push({
            city: city,
            numberOfRestaurants: count[city],
        });
    }

    const data = {
        CityData: CityData,
        CityRestaurantCount: CityRestaurantCount
    }

    // console.log("CityRestaurantCount", CityRestaurantCount);
    try {
        res.status(200).json({
            success: true,
            message: "City Details Fetched Successfully",
            data: data
        })
    }
    catch (err) {
        console.log("error in fetching city data");
        res.status(500).send("Error in Fetching City");
    }
}