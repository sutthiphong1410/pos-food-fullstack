import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (req, res) => {
    try{
        await prisma.foodSize.create({
            data:{
                foodTypeId: req.body.foodTypeId,
                name: req.body.name,
                moneyAdded: req.body.moneyAdded,
                remark: req.body.remark,
                status: "use"
            }
        });
        res.status(201).json({ message: "สร้างขนาดอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const list = async (req, res) => {
    try{
        const foodSizes = await prisma.foodSize.findMany({
            where: {
                status: "use" 
            },
            orderBy: {
                id: "desc"
            },
            include: {
                FoodType: true
            }
        });
        res.status(200).json(foodSizes);
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const remove = async (req, res) => {
    try{
        await prisma.foodSize.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status: "delete"
            }

        });
        res.status(200).json({ message: "ลบขนาดอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}

export const update = async (req, res) => {
    try{
        await prisma.foodSize.update({
            where: {
                id: req.body.id
            },
            data: {
                foodTypeId: req.body.foodTypeId,
                name: req.body.name,
                moneyAdded: req.body.moneyAdded,
                remark: req.body.remark
            }
        })
        res.status(201).json({ message: "แก้ไขขนาดอาหารสำเร็จ" });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error" });
    }
}