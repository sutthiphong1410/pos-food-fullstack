import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (req, res) => {
    try{
        await prisma.foodType.create({
            data:{
                name: req.body.name,
                remark: req.body.remark,
                status: "use"
            }
        });
        res.status(201).json({ message: "สร้างประเภทอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const list = async (req, res) => {
    try{
        const foodTypes = await prisma.foodType.findMany({
            where: {
                status: "use"
            },
            orderBy: {
                id: "desc"
            }
        });
        res.status(200).json(foodTypes);
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const remove = async (req, res) => {
    try{
        await prisma.foodType.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status: "delete"
            }
        });
        res.status(200).json({ message: "ลบประเภทอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const update = async (req, res) => {
    try{
        await prisma.foodType.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name: req.body.name,
                remark: req.body.remark
            }
        });
        res.status(201).json({ message: "แก้ไขประเภทอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}