import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async(req, res) =>{
    try{
        const{ email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }

         const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            token,
            user,
        });
    } catch(error){
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
}

// export default loginUser;