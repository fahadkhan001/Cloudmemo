const jwt = require("jsonwebtoken")
//it good to keep it i eviroment variable .env.local but wwe are hardcoding
const JWT_SECRET = "MohammadFahadKhan";
const fetchuser=(req,res,next)=>{
//Get the user form the jwt token and add id to req object
//first we will bring the token
const token = req.header("Auth-token");
if(!token){
    res.status(401).send({error:"Please Authenticate a valid token"})
}try {
    const data =jwt.verify(token,JWT_SECRET)
    req.user =data.user

    next()
} catch (error) {
    res.status(401).send({error:"Please Authenticate a valid token"})


}
}

module.exports =fetchuser;