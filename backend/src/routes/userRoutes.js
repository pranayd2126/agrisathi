import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userControllers.js';


const userRoutr= express.Router();
userRoutr.post('/register',registerUser)
userRoutr.post('/login',loginUser)




export default userRoutr;