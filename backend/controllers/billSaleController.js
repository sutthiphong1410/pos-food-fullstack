import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()

export const list = async (req, res) => {
    try{
        const billSales = await prisma.billSale.findMany({
            where:{
                createDate:{
                    gte: req.body.startDate,
                    lte: req.body.endDate
                }
            },
            include:{
                billSaleDetails:{
                    include:{
                        Food:true,
                        FoodSize:true,
                        Taste:true
                    }
                },
                User:true
            },
            orderBy:{
                id: 'desc'
            }
        })

        res.status(200).json(billSales)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}

export const remove = async (req, res) => {
    try{
        await prisma.billSale.update({
            where:{
                id: parseInt(req.params.id)
            },
            data:{
                status:"delete"
            }
        })

        res.status(200).json({message: "ลบรายการขายสำเร็จ"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}