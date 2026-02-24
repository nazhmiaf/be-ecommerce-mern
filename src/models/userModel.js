import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from 'validator'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "username is already exists"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],  
    unique: [true, "Email is already exists"],
    validate : {
      validator : validator. isEmail,
      message: "please enter a valid email"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
})

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.compilePassword = async function (reqPassword) {
  return await bcrypt.compare(reqPassword, this.password)
}

const User = mongoose.model("user", userSchema);

export default User;