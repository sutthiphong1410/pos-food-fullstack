import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const create = async (req, res) => {
    try {
        const rowSaleTemp = await prisma.saleTemp.findFirst({
            where: {
                userId: req.body.userId,
                tableNo: req.body.tableNo,
                foodId: req.body.foodId
            }
        })


        if (!rowSaleTemp) {
            await prisma.saleTemp.create({
                data: {
                    userId: req.body.userId,
                    tableNo: req.body.tableNo,
                    foodId: req.body.foodId,
                    qty: 1
                }
            })
        } else {
            await prisma.saleTemp.update({
                where: {
                    id: rowSaleTemp.id
                },
                data: {
                    qty: rowSaleTemp.qty + 1
                }
            })
         return res.status(201).json({ message: 'เพิ่มคำสั่งซื้อแล้ว' })

        }

        res.status(201).json({ message: 'สร้างคำสั่งซื้อแล้ว' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const list = async (req, res) => {
    try {
        const saleTemps = await prisma.saleTemp.findMany({
            include: {
                SaleTempdetails: {
                    include: {
                        Food: true,
                        Taste: true,
                        FoodSize: true
                    }
                },
                Food: true
            },
            orderBy:{
                id:'desc'
            }
        })

        res.status(200).json(saleTemps)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

export const remove = async (req, res) => {
    try {
        await prisma.saleTempDetail.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.status(200).json({ message: "ลบคำสั่งซื้อสำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server Error' })
    }
}

export const removeAll = async (req, res) => {
    try {
        const saleTemp = await prisma.saleTemp.findFirst({
            where: {
                tableNo: parseInt(req.body.table),
                userId: parseInt(req.body.userId)
            }
        })

        await prisma.saleTempDetail.deleteMany({
            where: {
                saleTempId: saleTemp.id
            }
        })

        await prisma.saleTemp.delete({
            where: {
                id: saleTemp.id
            }
        })
        res.status(200).json("ลบคำสั่งซื้อทั้งหมดสำเร็จ")
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const updateQty = async (req,res) => {
    try{
        await prisma.saleTemp.update({
            where:{
                id:req.body.id
            },
            data:{
                qty:req.body.qty
            }
        })
        res.status(200).json("สำเร็จ")
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const generateSaleTempDetail = async (req,res) => {
    try{
        const saleTemp= await prisma.saleTemp.findFirst({
            where:{
                id:req.body.saleTempId
            },
            include:{
                SaleTempdetails: true
            }
        })

        if(saleTemp.SaleTempdetails.length === 0){
            for(let i = 0; i < saleTemp.qty; i++){
                await prisma.saleTempDetail.create({
                    data:{
                        saleTempId:saleTemp.id,
                        foodId: saleTemp.foodId
                    }
                })
            }
        }1
        res.status(201).json({message:"สำเร็จ"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const info = async (req,res) => {
    try{
        const saleTemp = await prisma.saleTemp.findFirst({
            where:{
                id:parseInt(req.params.id)
            },
            include:{
                Food:{
                    include:{
                        FoodType:{
                            include:{
                                FoodSizes:{
                                    where:{
                                        status:"use"
                                    },
                                    orderBy:{
                                        id:"asc"
                                    }
                                },
                                Tastes:{
                                    where:{
                                        status:"use"
                                    }
                                }
                            }
                        }
                    }
                },
                SaleTempdetails:{
                    include:{
                        Food:true
                    },
                    orderBy:{
                        id:'asc'
                    }
                }
            }
        })
        res.status(200).json(saleTemp)
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

