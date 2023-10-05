const Router = require("express");
const Auth = require("../../middlewares/Auth")

const { addToCart, fetchCartData, updateCart, deleteCartItem } = require("../../controllers/Cart/cartController");
const router = Router();

router.post("/addtocart",Auth(['user']),addToCart)
router.get("/fetchcartdata",Auth(['user']),fetchCartData)
router.put("/updatecart",Auth(['user']),updateCart)
router.delete("/deletecartitem/:cartId/:foodId",Auth(['user']), deleteCartItem)
module.exports = router
