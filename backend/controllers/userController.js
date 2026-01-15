import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";


export const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await prisma.user.findFirst({
      where: {
        username: username,
        password: password,
        status: "use"
      }
    });

    if (user != null) {
      const key = process.env.SECRET_KEY
      const token = jwt.sign(user, key, { expiresIn: "30d" })
      res.status(200).json({ token: token, name: user.name, id: user.id });
    } else {
      res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
};

export const create = async (req, res) => {
  try {
    await prisma.user.create({
      data: {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        level: req.body.level,
      }
    });

    res.status(201).json({ message: "สร้างผู้ใช้งานสำเร็จ" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
}

export const list = async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        level: true,
      },
      where: { 
        status: "use" 
      },
      orderBy: { 
        id: "asc" 
      }
    });

    res.status(200).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
}

export const update = async (req, res) => {
  try{
    await prisma.user.update({
      where: {
        id: req.body.id
      },
      data: {
        name: req.body.name,
        username: req.body.username,
        level: req.body.level,
      }
    });

    res.status(201).json({ message: "แก้ไขผู้ใช้งานสำเร็จ" });
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
}

export const remove = async (req, res) => {
  try{
    await prisma.user.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        status: "delete"
      }
    });
    res.status(201).json({ message: "ลบผู้ใช้งานสำเร็จ" });
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
}

export const getLevelByToken = async (req,res) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    res.status(200).json({ level: user.level });
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
}
