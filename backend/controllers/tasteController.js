import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (req, res) => {
    try {
        await prisma.taste.create({
            data: {
                foodTypeId: req.body.foodTypeId,
                name: req.body.name,
                remark: req.body.remark,
            }
        });

        res.status(201).json({ message: "Taste created successfully" });
    }catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const list = async (req, res) => {
    try{
        const tastes = await prisma.taste.findMany({
            where: {
                status: "use"
            },
            orderBy: {
                id: "desc"
            },
            include:{
                FoodType: true
            }
        });
        res.status(200).json(tastes);
    }catch(error){
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const remove = async (req, res) => {
    try{
        await prisma.taste.update({
            data: {
                status: "delete"
            },
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.status(200).json({ message: "ลบรสชาติอาหารสำเร็จ"})
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const update = async (req, res) => {
    try{
        await prisma.taste.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                foodTypeId: req.body.foodTypeId,
                name: req.body.name,
                remark: req.body.remark,
            }
        });
        res.status(201).json({ message: "แก้ไขรสชาติอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}