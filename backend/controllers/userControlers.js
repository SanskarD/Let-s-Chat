const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const {generateToken} = require('../config/token')


const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,pic} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Enter all Fields")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("Email already exists!")
    }

    const user = new User({name,email,password,pic})
    await user.save()

    if(user){
        res.status(200).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Failed to create User")
    }
})

const authUser = asyncHandler(async(req,res)=>{
    const {email , password} = req.body

    const user = await User.findOne({email})

    if(user && (await user.verifyPassword(password))){
        res.status(200).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
})

const allUsers = asyncHandler(async(req,res)=>{
    const regex = req.query.search ? {
        $or:[
            {name: {$regex: req.query.search,$options:"i"}},
            {email: {$regex: req.query.search,$options:"i"}}
        ]
    }:{}
    
    const users = await User.find(regex).find({_id:{$ne: req.user._id}})
    res.send(users)
})


module.exports = {registerUser,authUser,allUsers}