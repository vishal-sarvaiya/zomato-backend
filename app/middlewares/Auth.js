const { user } = require("../models/User/userModel")
const jwt = require("jsonwebtoken")

module.exports =  (allowedRoles) =>{
    
    return async(req, res, next) => {
        if (!req.header("Authorization")) {
            return res.status(401).json({
                error: "Token Is Required For Authentication",
                success: false,
                message: "Unauthorized User",
                data: []
            })
        }
        else {
            const token = req.header("Authorization").split(' ')[1];
            try {
                const verifiedToken = jwt.verify(token, process.env.SECRET_KEY)
    
                if (verifiedToken.exp <= Date.now() / 1000) {
                    return res.status(401).json({ error: 'Token has expired' });
                }
    
                if (!verifiedToken || !verifiedToken.userId) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
                if(!allowedRoles.includes(verifiedToken.role)){
                    return res.status(403).json({
                        success: false,
                        error: "Sorry! You Don't Have Access To This Page.",
                    })
                }
                // Attach the decoded user data to the request object for further route handling
                req.user = verifiedToken;
                next()
            }
            catch (err) {
                if (err.message && err.message === "jwt expired") {
                    res.status(401).json({
                        success: false,
                        // error: err?.message && err?.message ,
                        error: "Session Expired",
                        message: "Data Not Found",
                        data: []
                    })
                }
                else {
                    console.log("error in middleware", err.message);
                    res.status(400).json({
                        success: false,
                        error: err?.message ? err?.message : "Invaild Token",
                        message: "Invalid Token",
                        data: []
                    })
                }
            }
        }
    }
}

































// module.exports = async (req, res, next) => {
//     console.log("inside middleware");
//     if (!req.header("Authorization")) {
//         return res.status(401).json({
//             error: "Token Is Required For Authentication",
//             success: false,
//             message: "Unauthorized User",
//             data: []
//         })
//     }
//     else {
//         const token = req.header("Authorization").split(' ')[1];
//         console.log(req.header("Authorization"), "*******", token, "@@@@@");
//         try {
//             const verifiedToken = jwt.verify(token, process.env.SECRET_KEY)
//             console.log("verifiedToken", verifiedToken.role);
          
//             console.log("inside try");

//             if (verifiedToken.exp <= Date.now() / 1000) {
//                 return res.status(401).json({ error: 'Token has expired' });
//             }

           
//             if (!verifiedToken || !verifiedToken.userId) {
//                 return res.status(401).json({ error: 'Invalid token' });
//             }
//             // Attach the decoded user data to the request object for further route handling
//             req.user = verifiedToken;
//             next()
//         }
//         catch (err) {
//             if (err.message && err.message === "jwt expired") {
//                 res.status(401).json({
//                     success: false,
//                     // error: err?.message && err?.message ,
//                     error: "Session Expired",
//                     message: "Data Not Found",
//                     data: []
//                 })
//             }
//             else {
//                 console.log("error in middleware", err.message);
//                 res.status(400).json({
//                     success: false,
//                     error: err?.message ? err?.message : "Invaild Token",
//                     message: "Invalid Token",
//                     data: []
//                 })
//             }
//         }
//     }
// }