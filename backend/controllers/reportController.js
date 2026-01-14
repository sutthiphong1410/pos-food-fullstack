import {PrismaClient} from "@prisma/client"
import dayjs from "dayjs"
const prisma = new PrismaClient()

export const sumPerDayInYearAndMonth = async (req,res) => {
    try{
        const year = req.body.year
        const month = req.body.month

        const sumPerDay = []
        const startDate = dayjs(year + "-" + month + "-01")
        const endDate = startDate.endOf("month")

        for(let day = startDate.date(); day <= endDate.date(); day++){
            const dateFrom = startDate.date(day).format("YYYY-MM-DD")
            const dateTo = startDate.date(day).add(1,"day").format("YYYY-MM-DD")

            const billSales = await prisma.billSale.findMany({
                where: {
                    createDate: {
                        gte: new Date(dateFrom),
                        lt: new Date(dateTo)
                    },
                    status:"use"
                },
                include: {
                    billSaleDetails: true
                }
            })

            let sum = 0

            for(let i=0; i<billSales.length; i++){
                const billSaleDetails = billSales[i].billSaleDetails

                for(let j=0; j<billSaleDetails.length; j++){
                    sum += billSaleDetails[j].price 
                }
            }

            sumPerDay.push({
                date: dateFrom,
                amount: sum
            })
        }
        res.status(200).json(sumPerDay)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}

export const sumPerMonthInYear = async (req,res) => {
    try{
        const year = req.body.year
        const sumPerMonth = []

        for(let month = 1; month <= 12; month++){
            const startDate = dayjs(year + "-" + month + "-01")
            const endDate = startDate.endOf("month")

            const billSales = await prisma.billSale.findMany({
                where: {
                    createDate: {
                        gte: new Date(startDate.format("YYYY-MM-DD")),
                        lte: new Date(endDate.format("YYYY-MM-DD"))
                    },
                    status:"use"
                },
                include: {
                    billSaleDetails: true
                }
            })

            let sum = 0

            for(let i=0; i<billSales.length; i++){
                const billSaleDetails = billSales[i].billSaleDetails

                for(let j=0; j<billSaleDetails.length; j++){
                    sum += billSaleDetails[j].price 
                }
            }

            sumPerMonth.push({
                month: startDate.format("MM"),
                amount: sum
            })
        }
        res.status(200).json(sumPerMonth)
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}