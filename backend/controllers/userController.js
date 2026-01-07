import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";


export const login = async (req, res) => {
  try{
    const username = req.body.username;
    const password = req.body.password;

    const user = await prisma.user.findFirst({
      where: {
        username: username,
        password: password,
        status:"use"
      }
    });

    if(user != null){
        const key = process.env.SECRET_KEY
        const token = jwt.sign(user,key,{expiresIn:"30d"})
        res.status(200).json({ token:token, name:user.name, id:user.id});
    }else{
        res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
};

