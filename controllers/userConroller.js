const { body, validationResult } = require('express-validator');
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();


const User = require('../models/User')

const createToken = (user) =>{
    return jwt.sign({user}, process.env.SECRET_KEY, {
        expiresIn: '7d'
    });
};

//------------------------------------------- REGISTRATION ---------------------------------------------

module.exports.registerValidation = [
    body("name").not().isEmpty().trim().withMessage("name is required"),
    body("email").not().isEmpty().trim().withMessage("email is required"),
    body("password").isLength({min: 6}).trim().withMessage("password must be 6 charecter long")
]

module.exports.register =async (req,res) =>{
    const {name, email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
    }

     try {
        const checkUser =await User.findOne({email}) 
        if(checkUser){
            return res.status(400).json({errors: [{msg: "Email is already taken"}]})
        }

        // hashing-password
        const salt = await bycrypt.genSalt(10);
        const hash = await bycrypt.hash(password, salt);

        try {
            const user = await User.create({
                name,
                email,
                password: hash,
            });
            const token = createToken(user);
            return res.status(200).json({msg: "Your account has been created", token})
            
        } catch (error) {
            return res.status(500).json({errors: error})
        }
    } catch (error) {
        return res.status(500).json({errors: error})
    }

}


//------------------------------------------- LOGIN ------------------------------------------------

module.exports.loginValidation = [
    body("email").not().isEmpty().trim().withMessage("invalid credentials"),
    body("password").not().isEmpty().withMessage("invalid credentials")
]

module.exports.login = async (req, res) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const matched = await bycrypt.compare(password, user.password)
            if(matched){
                const token = createToken(user);
                return res
                .status(200)
                .json({msg: "Login sucessful", token})
            }else{
                res.status(401).json({errors: [{msg: "Invalid password"}]})
            }
        }else{
            res.status(404).json({errors: [{msg: "Email not found"}]})
        }

    } catch (error) {
        res.status(500).json({errors: error})
    }
}