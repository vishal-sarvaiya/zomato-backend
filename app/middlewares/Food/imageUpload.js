
const {food} = require("../../models/Food/foodItemModel")
// const multer =require("multer")
const path = require("path");

// const storage = multer.diskStorage({
    
//     destination: "./uploads/",
//     filename: (req,file,cb)=>{
//         const absolutePath = path.join(__dirname, "uploads", file.originalname);
//         console.log("absolute",absolutePath);
//         cb(null,file.originalname.split('.')[0]+Date.now()+path.extname(file.originalname))
//     }
// })


// const upload = multer({storage : storage})

// const imageUploadMiddleware =  async(req,res,next)=>{
    
//     if (!req.files.foodFile) {
//         // if (!req) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }
//     const file = req.files.foodFile
//     const imagePath = `/uploads/${file.name}`
//     try{
//         const savedImage = await food.create({
//             image:imagePath
//         })
//         req.uploadedImage = savedImage
//         next(); 
//     }
//     catch(err){
//         console.log("image upload error",err);
//         return res.status(500).send("Error processing the uploaded file");
//     }
// }
module.exports = imageUploadMiddleware
   


                        //USING EXPRESS FILEUPLOAD(express-fileupload)

// const fileupload = require("express-fileupload")
// const {food} = require("../models/foodItemModel")


// const imageUploadMiddleware = async(req,res,next)=>{
//     console.log("inside middleware");
//     console.log("reqfile",req.files.foodFile);
//     if (!req.files.foodFile) {
//         // if (!req) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = req.files.foodFile
//     try{
//         const imagePath = `/uploads/${file.name}`
//         const savedImage = await food.create({
//             image:imagePath
//         })
//         req.uploadedImage = savedImage
//         next(); 
//     }
//     catch(err){
//         console.log("image upload error",err);
//         return res.status(500).send("Error processing the uploaded file");
//     }

// }

// module.exports = imageUploadMiddleware