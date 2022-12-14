const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const {check, validationResult} = require('express-validator');
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User');

//A callback is a function called at the completion of a given task
//It prevents any blocking, and allows other code to be run in the meantime

//@route    POST api/users
//@desc     Register User
//@access   Public
router.post('/', [
    //check is a built in function from express-validator used to
    //verify inputs from user in a very simple manner
    check('name', 'Name is required').not().isEmpty(),
    check('email', "Please input a valid email").isEmail(),
    check('password', "Please input a password with 6 or more characters").isLength({
        min: 6})
    ],
    async(req, res) => {
    const errors = validationResult(req);
    //If there are errors
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }


const {name, email, password} = req.body;

try {
//See if user exists, findOne is a helpful function for this
let user = await User.findOne({ 
    email //Same as saying email: email  
});   

if(user){
   return res.status(400).json({
        //We do it like this to make a standard output for error handling
        errors: [{ msg: "User already exists" }]
    });
}

//Get users gravatar (based on email)
const avatar = normalize(
    gravatar.url(email, {
      s: '200',//Size
      r: 'pg',//Rating (parental guidance)
      d: 'mm'//Default (image)
    }),
    { forceHttps: true }
  );

user = new User({
    name,
    email,
    avatar,
    password
});
//Encrypt password using bcrypt
//Salt is needed for hashes
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);//hashses the passed in password with the above created salt

await user.save();//Saves user to the database, await is a promise

//Return jsonwebtoken
//Visit jwt.io and paste in the created webtoken, it will display the following code under: payload
const payload = {
    user: {
        id: user.id //MongoDB creates this id
    }
}

jwt.sign(
    payload,                 //Pass in payload (id)
     config.get('jwtSecret'), //Pass in secret
     { expiresIn: 360000 },  //Pass in expiry date (optional)
     (err, token) => {      //Call back
        if(err) throw err; //If error
        res.json({token})  //If no error, return token
     }); //3600 = 1 hour
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}

});

module.exports = router;
