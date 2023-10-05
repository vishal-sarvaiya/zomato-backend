const Router = require("express");
const Auth = require("../../middlewares/Auth")
const { placeOrder, cancelOrder } = require("../../controllers/Order/orderController");
const router = Router();

router.post("/placeorder", Auth(['user']),placeOrder)
router.post("/cancelorder/:orderId",Auth(['user']), cancelOrder)

module.exports = router

