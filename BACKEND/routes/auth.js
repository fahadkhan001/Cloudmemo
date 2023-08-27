//importing express and routers
const express = require('express');
//using user
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator')
//used to create salt
const bcrypt = require('bcrypt');
//creating token
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');



//you can verify by using.verify wether someone has changed something or not in your data
const JWT_SECRET = "MohammadFahadKhan";


// ROUTE1 :create a user using : POST "/api/auth/createuser".Dosen't require auth.no login required
//we have to create array before (res,req)
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid passsword').isLength({ min: 5 }),
], async (req, res) => {
    let success =false; 

    //if erroe occurs , return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    //check wehter the user with this email already exists we also need to await
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(404).json({success, error: "Email already exists" })
        }
        //generating a  salt
        const salt = await bcrypt.genSalt(10)
        //generating password and u have to pass password as a string
        const secpass = await bcrypt.hash(req.body.password, salt)
        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass
        })
        // .then(user=>{res.json(user)})
        // .catch(err=>{console.log(err)
        // res.json({error:"please enter a valid email",message:err.message})})

        //whenever someone is giving me authtoken i can convert it into below data  and with JWT_SECRET i can easily see werther someone has tampered my data
        const data = {
            id: user.id
        }
        //sending data we want to send
        const Authtoken = jwt.sign(data, JWT_SECRET)

        // res.json(user)
        success=true;
        res.json({success, Authtoken })
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Internal server occured")
    }

})

// ROUTER2: Authenticate a user  using post "/api/auth/login".NO LOGIN required
//just checking wether its a valid email or not we can also check a valid anme and psswrod here
router.post('/login', [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists()
], async (req, res) => {
    let success =false; 
    //if there are errors,return a bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //destructuring pass and email
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=false;
            return res.status(400).json({ error: "Please try to login with correct credentials" });

        }
        //we will compare password
        const comparepassword = await bcrypt.compare(password, user.password);
        if (!comparepassword) {
            success =false;
            return res.status(400).json({success, error: "Please try to login with correct credentials" });

        }
        //we do the exactly the same thing we did in create user
        const data = {
            user: {
                id: user.id
            }
        }
        const Authtoken = jwt.sign(data, JWT_SECRET)
        success =true; 
        res.json({success, Authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured")
    }


})

//ROUTE 3: Get loggedIn user detail using: POST "/api/auth/getuser".LOGIN required
router.post("/getuser",fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")//i dont need password
        res.send(user); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured")
    }
})




module.exports = router
//to use outside its very imp to exprt