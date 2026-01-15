import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthen = (req, res, next) => {
    try{
        if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
            if(decode) {
                next();
            }else{
                res.status(401).json({ message: "Unauthorized" });
            }
        }else{
            res.status(401).json({ message: "Unauthorized" });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export default isAuthen;