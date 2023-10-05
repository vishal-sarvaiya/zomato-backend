const Router = require("express");
const { register, login, fetchOrders, getUserDetails, fetchUserInfo,cretePreference } = require("../../controllers/User/userController");
const Auth = require("../../middlewares/Auth")

const router = Router();

router.post('/register',register)
router.post('/login',login)
router.get("/fetchOrders",Auth(['user']),fetchOrders)
router.get("/fetchuserinfo",Auth(['user']), fetchUserInfo)
router.post("/cretepreference",cretePreference )
module.exports = router