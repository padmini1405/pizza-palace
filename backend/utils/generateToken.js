import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
    return jwt.sign(   //jwt.sign(payload, secret, options)
        { id, role }, //payload

        process.env.JWT_SECRET,  //secret
        {
            expiresIn: "24h",  //options
        }
    );
}

export default generateToken;