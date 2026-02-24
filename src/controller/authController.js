import User from '../models/userModel.js'; 
import jwt from 'jsonwebtoken'
import asyncHandler from "../middlewares/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({id},process.env.JWT_SECRET, {
    expiresIn: "1d"
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  const isDev = process.env.NODE_ENV === 'development' ? false : true

  const cookiesOption = {
    expire : new Date(
      Date.now() + 1 * 24 * 60 * 60 * 1000
    ),
    httpOnly : true,
    secure : isDev 
  }

  res.cookie('jwt', token, cookiesOption)

  user.password = undefined

  res.status(statusCode).json({
    data : user
  })
}

export const register = asyncHandler (async (req, res) => {
  const isAdmin = await User.countDocuments() === 0

  const role = isAdmin ? 'admin' : 'user'

  const createUser = await User.create({
    name : req.body.name,
    email : req.body.email,
    password : req.body.password,
    role : role
  })

  createSendToken(createUser, 201, res)
  
})

export const login = asyncHandler (async (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400)
    throw new Error("Please provide email and password")
  }

  const userData = await User.findOne({
    email : req.body.email
  })

  if (userData && ( await userData.compilePassword(req.body.password))) {
    createSendToken(userData, 200, res)
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (user) {
    return res.status(200).json({
      data: user
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires : new Date(Date.now())
  })

  res.status(200).json({
    message : 'user logged out'
  })
}