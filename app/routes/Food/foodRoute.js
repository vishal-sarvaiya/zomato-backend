const Router = require("express");  
const { addFood, getFood, deleteFood, updateFood, getAllFood } = require("../../controllers/Food/foodController");
const router = Router();
// const imageUploadMiddleware = require("../middlewares/imageUpload");
// const multer = require("multer");
const path = require("path")
const Auth = require("../../middlewares/Auth")

// const storage = multer.diskStorage({
//     destination: "app/uploads/",
//     filename: (req,file,cb)=>{
//         cb(null,file.originalname.split('.')[0]+Date.now()+path.extname(file.originalname))
//         // cb(null,file.originalname)
//     }
// })
// const upload = multer({storage : storage})

//using Image Upload
// router.post("/addfood",Auth(['restaurant']),upload.single('image'),addFood)
// router.put("/updatefood",Auth(['restaurant']),upload.single('image'),updateFood)



router.post("/addfood",Auth(['restaurant']),addFood)
router.put("/updatefood",Auth(['restaurant']),updateFood)
router.get("/getfood/",Auth(['user','restaurant']),getFood)
router.get("/getallfood",Auth(['restaurant','user']),getAllFood)
router.delete("/deletefood/:id",Auth(['restaurant']),deleteFood)


module.exports = router