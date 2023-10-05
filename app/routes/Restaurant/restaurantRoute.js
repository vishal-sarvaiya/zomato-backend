const { restaurantregister, restaurantlogin, getRestaurant, showOrders } = require("../../controllers/Restaurant/restaurantController")
const Auth = require("../../middlewares/Auth")

const Router = require("express");
const router = Router()
const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: "app/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[0] + Date.now() + path.extname(file.originalname))
        // cb(null,file.originalname)
    }
})
const upload = multer({ storage: storage })

// router.post("/restaurantregister",upload.single('menu_image'),restaurantregister)
// router.post("/restaurantregister" ,[upload2.single('menu_image'), upload.array('restaurant_images',4)], restaurantregister)
router.post("/restaurantregister",
    upload.fields([{
        name: 'menu_image',
        maxCount: 1
    }, {
        name: 'restaurant_images',
        maxCount: 4
    }]),
    restaurantregister)

router.post("/restaurantlogin", restaurantlogin)
router.get("/getrestaurant", Auth(['user','restaurant']), getRestaurant)
router.get("/showorder", Auth(['restaurant']), showOrders)
module.exports = router