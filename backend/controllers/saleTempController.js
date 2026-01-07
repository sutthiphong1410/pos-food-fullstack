import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()

export const create = async (req,res) => {
    try{

        const saleTemp = await prisma.saleTemp.create({
            data:{
                userId: req.body.userId,
                tableNo: req.body.tableNo
            }
        })

        await prisma.saleTempDetail.create({
            data:{
                saleTempId:saleTemp.id,
                foodId:req.body.foodId
            }
        })

        res.status(201).json({message:'สร้างคำสั่งซื้อแล้ว'})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const list = async (req,res) => {
    try{
        const saleTemps = await prisma.saleTemp.findMany({
            include:{
                SaleTempdetails:true
            }
        })

        res.status(200).json(saleTemps)
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }
}

//311