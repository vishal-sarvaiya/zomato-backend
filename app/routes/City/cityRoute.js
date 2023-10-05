const Router = require("express");
const { addCity, getCity } = require("../../controllers/City/cityController");
const router = Router();

router.post("/addcity",addCity)
router.get("/getcity",getCity)
module.exports = router