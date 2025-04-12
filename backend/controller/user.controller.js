const asyncHandler = require("express-async-handler")
const User = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


function generateJwtToken(_id) {
    return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
}


const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, pic } = req.body;

    
    if (!name || !email || !password) {
        res.status(422).json({error:"Please Fill All The Fields."})
    }

    
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(422).json({error:"User Already Exist."})
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({ name, email, password:hashedPassword, pic });
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateJwtToken(user._id),
        })
    }
    else {
            return res.status(422).json({error:"Login Failed."})
    }
})



const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    
    if (!email || !password) {
        res.status(422).json({error:"Please Fill All The Fields."})
    }

    
    const user = await User.findOne({ email:email });

    if (user && (await bcrypt.compare(password, user.password)) ) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateJwtToken(user._id),
        })
    }
    else{
        res.status(422).json({error:"Incorrect email or password."})
    }
})



const searchUser = asyncHandler(async(req, res)=>{

    const search = req.query.search ? {
        $or:[
            {name : { $regex: req.query.search, $options: 'i' }},
            {email : { $regex: req.query.search, $options: 'i' }},
             ]
    }:{}

    const users = await User.find(search).find({_id:{$ne:req.user._id}});

    res.status(200).json(users)


})


const updateUserData = asyncHandler(async (req, res) => {
    const { name, pic } = req.body;
    const userId = req.user._id;
  
    try {
      
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      
      if (name) {
        user.name = name;
      }
      if (pic) {
        user.pic = pic;
      }
  
      
      await user.save();
  
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateJwtToken(user._id),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user data" });
    }
  });
  
module.exports = { registerUser, authUser, searchUser, updateUserData };