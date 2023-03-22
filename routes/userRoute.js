const express = require('express')
const router = express.Router();

const {register, login, registerValidation, loginValidation} = require("../controllers/userConroller")

                              
router.post("/register", registerValidation, register)
router.post("/login",loginValidation, login )


module.exports = router;
  
 