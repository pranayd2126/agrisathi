import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};


const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body

    const user = await userModel.findOne({email});
    if (!user) {
        return res.json({success: false, message: "user not exists register first"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
        const token = createToken(user._id)
        res.json({ success: true, token });
    }
    else {
        res.json({success: false, message: 'wrong password or user id'})
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
};

// route for user registration

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // user already exists
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "user already exits " });
    }

    // valid email and string password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: " enter valid emil " });
    }

    if (password.length < 8) {
      // Fixed: changed "lenght" to "length"
      return res.json({
        success: false,
        message: " plce entrer 8 chat password  ",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// route for admin login
const adminLogin = async (req, res) => {};

export { loginUser, registerUser, adminLogin };
