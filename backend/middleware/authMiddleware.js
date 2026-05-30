import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        );

        req.user = await User.findById(decoded.id).select("-password"); // removes password from the response

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
} 

export const isAdmin = (req, res, next) => {
    if(req.user && req.user.role == "admin"){
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Admin access only",
        });
    }
}
