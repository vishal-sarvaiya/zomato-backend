const express = require("express")
const cors = require("cors")
const mongoose =require("mongoose")
const app = express()
const path = require("path")
app.use(express())
app.use(cors())
app.use(express.json())


require('dotenv').config();

const userRoute = require("./app/routes/User/userRoutes")
app.use(userRoute)

const foodRoute = require("./app/routes/Food/foodRoute")
app.use(foodRoute)

const restaurantRoute = require("./app/routes/Restaurant/restaurantRoute")
app.use(restaurantRoute)

const orderRoute = require("./app/routes/Order/orderRoutes")
app.use(orderRoute)

const cartRoute = require("./app/routes/Cart/cartRoute")
app.use(cartRoute)

const cityRoute  = require("./app/routes/City/cityRoute")
app.use(cityRoute)

const questionRoute = require("./app/routes/Question/questionRoute")
app.use(questionRoute)

app.use('/app/uploads',express.static('app/uploads'))

mongoose
// .connect("mongodb://localhost:27017/Zomato")
.connect(process.env.MONGODB_URL)
.then(() =>{
    console.log("connected to mongodb");
})
.catch((error)=>{
    console.log("mongodb connection Error:",error);
})

app.listen(8000,()=>{
    console.log("App is Listening on Port 8000");
})