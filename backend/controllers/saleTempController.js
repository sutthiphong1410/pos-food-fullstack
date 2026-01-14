import { PrismaClient } from "@prisma/client"
import pdfkit from "pdfkit"
import fs from "fs"
import dayjs from "dayjs"

const prisma = new PrismaClient()

export const create = async (req, res) => {
    try {
        const rowSaleTemp = await prisma.saleTemp.findFirst({
            where: {
                userId: req.body.userId,
                tableNo: req.body.tableNo,
                foodId: req.body.foodId
            },
            include:{
                SaleTempdetails:true
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
           if(rowSaleTemp.SaleTempdetails.length === 0){
                await prisma.saleTemp.update({
                    where: {
                        id: rowSaleTemp.id
                    },
                    data: {
                        qty: rowSaleTemp.qty + 1
                    }
                })
            }
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
            orderBy: {
                id: 'desc'
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
        const saleTempId = parseInt(req.params.id)

        await prisma.saleTempDetail.deleteMany({
            where: {
                saleTempId: saleTempId
            }
        })
        await prisma.saleTemp.delete({
            where: {
                id: saleTempId
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
        const saleTemp = await prisma.saleTemp.findMany({
            where: {
                userId: parseInt(req.body.userId),
                tableNo: req.body.tableNo
            }
        })

        for (let i = 0; i < saleTemp.length; i++) {
            const item = saleTemp[i]
            await prisma.saleTempDetail.deleteMany({
                where: {
                    saleTempId: item.id
                }
            })
        }

        await prisma.saleTemp.deleteMany({
            where: {
                userId: parseInt(req.body.userId),
                tableNo: req.body.tableNo
            }
        })
        res.status(200).json("ลบคำสั่งซื้อทั้งหมดสำเร็จ")
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const updateQty = async (req, res) => {
    try {
        await prisma.saleTemp.update({
            where: {
                id: req.body.id
            },
            data: {
                qty: req.body.qty
            }
        })
        res.status(200).json("สำเร็จ")
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const generateSaleTempDetail = async (req, res) => {
    try {
        const saleTemp = await prisma.saleTemp.findFirst({
            where: {
                id: req.body.saleTempId
            },
            include: {
                SaleTempdetails: true
            }
        })

        if (saleTemp.SaleTempdetails.length === 0) {
            for (let i = 0; i < saleTemp.qty; i++) {
                await prisma.saleTempDetail.create({
                    data: {
                        saleTempId: saleTemp.id,
                        foodId: saleTemp.foodId
                    }
                })
            }
        } 1
        res.status(201).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const info = async (req, res) => {
    try {
        const saleTemp = await prisma.saleTemp.findFirst({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                Food: {
                    include: {
                        FoodType: {
                            include: {
                                FoodSizes: {
                                    where: {
                                        status: "use"
                                    },
                                    orderBy: {
                                        id: "asc"
                                    }
                                },
                                Tastes: {
                                    where: {
                                        status: "use"
                                    }
                                }
                            }
                        }
                    }
                },
                SaleTempdetails: {
                    include: {
                        Food: true,
                        FoodSize: true
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            }
        })
        res.status(200).json(saleTemp)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const selectTaste = async (req, res) => {
    try {
        await prisma.saleTempDetail.update({
            where: {
                id: req.body.saleTempDetailId
            },
            data: {
                tasteId: req.body.tasteId
            }
        })
        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Server Error" })
    }
}

export const unSelectTaste = async (req, res) => {
    try {
        await prisma.saleTempDetail.update({
            where: {
                id: req.body.saleTempDetailId
            },
            data: {
                tasteId: null
            }
        })
        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Server Error" })
    }
}

export const selectSize = async (req, res) => {
    try {
        await prisma.saleTempDetail.update({
            where: {
                id: req.body.saleTempDetailId
            },
            data: {
                foodSizeId: req.body.sizeId
            }
        })
        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Server Error" })
    }
}

export const unSelectSize = async (req, res) => {
    try {
        await prisma.saleTempDetail.update({
            where: {
                id: req.body.saleTempDetailId
            },
            data: {
                foodSizeId: null
            }
        })
        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Server Error" })
    }
}

export const createSaleTempDetail = async (req,res) => {
    try{
        const saleTempId = req.body.saleTempId
        const saleTempDetail = await prisma.saleTempDetail.findFirst({
            where:{
                saleTempId:saleTempId
            }
        })

        await prisma.saleTempDetail.create({
            data:{
                foodId:saleTempDetail.foodId,
                saleTempId:saleTempDetail.saleTempId
            }
        })

        const countSaleTempDetail = await prisma.saleTempDetail.count({
            where:{
                saleTempId:saleTempDetail.saleTempId
            }
        })

        await prisma.saleTemp.update({
            where:{
                id:saleTempDetail.saleTempId
            },
            data:{
                qty:countSaleTempDetail
            }
        })

        res.status(200).json({message:"สำเร็จ"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const removeSaleTempDetail = async (req,res) => {
    try{
        const saleTempDetailId = req.body.saleTempDetailId
        const saleTempDetail = await prisma.saleTempDetail.findUnique({
            where:{
                id:saleTempDetailId
            }
        })

        await prisma.saleTempDetail.delete({
            where:{
                id:saleTempDetailId
            }
        })

        const countSaleTempDetail = await prisma.saleTempDetail.count({
            where:{
                saleTempId:saleTempDetail.saleTempId
            }
        })

        await prisma.saleTemp.update({
            where:{
                id:saleTempDetail.saleTempId
            },
            data:{
                qty:countSaleTempDetail
            }
        })

        res.status(200).json({message:"สำเร็จ"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const printBillBeforePay = async (req,res) => {
    try{
        const organization = await prisma.organization.findFirst()

        const saleTemps =  await prisma.saleTemp.findMany({
            where:{
                userId:parseInt(req.body.userId),
                tableNo:req.body.tableNo
            },
            include:{
                SaleTempdetails:true,
                Food:true
            }
        })

        const paperWidth = 80;
        const padding = 3;

        const doc = new pdfkit({
            size: [paperWidth, 200],
            margins: {
                top: 3,
                bottom: 3,
                left: 3,
                right: 3
            }
        })
        const fileName = `uploads/bill-${dayjs(new Date()).format('YYYYMMDD_HHmmss')}.pdf`
        const font = "Kanit/kanit-regular.ttf"

        doc.pipe(fs.createWriteStream(fileName))

        const imageWidth = 20;
        const postionX = (paperWidth / 2 ) - (imageWidth / 2) 
        doc.image('uploads/'+organization.logo,postionX, 5,{
            align: 'center',
            width: imageWidth,
            height: 20
        })

        doc.moveDown()

        doc.font(font)
        doc.fontSize(5).text('*** ใบแจ้งรายการ ***',20,doc.y+ 8)
        doc.fontSize(8)
        doc.text(organization.name, padding, doc.y)
        doc.fontSize(5)
        doc.text(organization.address)
        doc.text(`เบอร์โทร: ${organization.phone}`)
        doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode}`)
        doc.text(`โต๊ะที่: ${req.body.tableNo}`, {align:'center'})
        doc.text(`วันที่: ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`, {align:'center'})
        doc.text('รายการที่สั่ง', {align:'center'})
        doc.moveDown()

        const y = doc.y
        doc.fontSize(4)
        doc.text('รายการ',padding,y)
        doc.text('ราคา',padding + 18, y, {width:20, align:'right'})
        doc.text('จำนวน',padding + 36, y, {width:20, align:'right'})
        doc.text('รวม',padding + 55, y, {align:'right'})

        doc.lineWidth(0.1)
        doc.moveTo(padding, y + 6).lineTo(paperWidth - padding, y + 6).stroke()

        saleTemps.map((item, index)=> {
            const y = doc.y
            doc.text(item.Food.name, padding, y)
            doc.text(item.Food.price, padding + 18, y, {width:20, align:'right'})
            doc.text(item.qty, padding + 36, y, {width:20, align:'right'})
            doc.text(item.Food.price  * item.qty, padding + 55, y, {align:'right'})
        })

        let sumAmount=0
        saleTemps.forEach(item=>{
            sumAmount += item.Food.price * item.qty
        })

        doc.text(`รวม: ${sumAmount.toLocaleString('th-TH')} บาท`, {align:'right'})
        doc.end()

        res.status(200).json({fileName:fileName})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const endSale = async (req, res) => {
    try{
        const saleTemps = await prisma.saleTemp.findMany({
            include:{
                SaleTempdetails:{
                    include:{
                        Food:true,
                        FoodSize: true,
                    }
                },
                Food:true
            },
            where:{
                userId:req.body.userId,
            }
        })

        const billSale = await prisma.billSale.create({
            data:{
                amount: req.body.amount,
                inputMoney: req.body.inputMoney,
                payType: req.body.payType,
                tableNo: req.body.tableNo,
                userId: req.body.userId,
                returnMoney: req.body.returnMoney
            }
        })

        for(let i=0; i< saleTemps.length; i++){
            const item = saleTemps[i]

            if(item.SaleTempdetails.length > 0){

                for(let j=0; j< item.SaleTempdetails.length; j++){
                    const detail = item.SaleTempdetails[j]
                    await prisma.billSaleDetail.create({
                        data: {
                            billSaleId: billSale.id,
                            foodId: detail.foodId,
                            tasteId: detail.tasteId,
                            foodSizeId: detail.foodSizeId,
                            moneyAdded: detail.FoodSize.moneyAdded,
                            price: detail.Food.price,
                        }
                    })
                }
            }else{
                if(item.qty > 0){
                    for(let k=0; k< item.qty; k++){
                        await prisma.billSaleDetail.create({
                            data:{
                                billSaleId:billSale.id,
                                foodId:item.foodId,
                                price:item.Food.price
                            }
                        })
                    }
                }else{
                    await prisma.billSaleDetail.create({
                        data:{
                            billSaleId:billSale.id,
                            foodId:item.foodId,
                            price:item.Food.price
                        }
                    })
                }
            }
        }
        
        for(let i=0; i< saleTemps.length; i++){
            const item = saleTemps[i]

            await prisma.saleTempDetail.deleteMany({
                where:{
                    saleTempId:item.id
                }
            })
        }


        await prisma.saleTemp.deleteMany({
            where:{
                userId:req.body.userId
            }
        })

        res.status(200).json({message:"สำเร็จ"})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }
}

export const printBillAfterPay = async (req,res) => {
    try{
        const organization = await prisma.organization.findFirst()

        const billSale =  await prisma.billSale.findFirst({
            where:{
                userId:parseInt(req.body.userId),
                tableNo:req.body.tableNo,
                status:"use"
            },
            include:{
                billSaleDetails:{
                    include:{
                        Food:true,
                        FoodSize:true
                    },
                },
                User:true
            },
            orderBy:{
                id:'desc'
            }
        })

        const billSaleDetails = billSale.billSaleDetails

         const paperWidth = 80;
        const padding = 3;

        const doc = new pdfkit({
            size: [paperWidth, 200],
            margins: {
                top: 3,
                bottom: 3,
                left: 3,
                right: 3
            }
        })
        const fileName = `uploads/invoice-${dayjs(new Date()).format('YYYYMMDD_HHmmss')}.pdf`
        const font = "Kanit/kanit-regular.ttf"

        doc.pipe(fs.createWriteStream(fileName))

        const imageWidth = 20;
        const postionX = (paperWidth / 2 ) - (imageWidth / 2) 
        doc.image('uploads/'+organization.logo,postionX, 5,{
            align: 'center',
            width: imageWidth,
            height: 20
        })

        doc.moveDown()

        doc.font(font)
        doc.fontSize(5).text('*** ใบเสร็จรับเงิน ***',20,doc.y+ 8)
        doc.fontSize(8)
        doc.text(organization.name, padding, doc.y)
        doc.fontSize(5)
        doc.text(organization.address)
        doc.text(`เบอร์โทร: ${organization.phone}`)
        doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode}`)
        doc.text(`โต๊ะที่: ${req.body.tableNo}`, {align:'center'})
        doc.text(`วันที่: ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`, {align:'center'})
        doc.text('รายการที่สั่ง', {align:'center'})
        doc.moveDown()

        const y = doc.y
        doc.fontSize(4)
        doc.text('รายการ',padding,y)
        doc.text('ราคา',padding + 18, y, {width:20, align:'right'})
        doc.text('จำนวน',padding + 36, y, {width:20, align:'right'})
        doc.text('รวม',padding + 55, y, {align:'right'})

        doc.lineWidth(0.1)
        doc.moveTo(padding, y + 6).lineTo(paperWidth - padding, y + 6).stroke()

        billSaleDetails.map((item, index)=> {
            const y = doc.y
            let name = item.Food.name
            if(item.foodSizeId != null) name += `${item.FoodSize.name} +${item.FoodSize.moneyAdded}`
            doc.text(name, padding, y)
            doc.text(item.Food.price, padding + 18, y, {width:20, align:'right'})
            doc.text(1, padding + 36, y, {width:20, align:'right'})
            doc.text(item.Food.price  + item.moneyAdded, padding + 55, y, {align:'right'})
        })

        let sumAmount=0
        billSaleDetails.forEach(item=>{
            sumAmount += item.Food.price + item.moneyAdded
        })

        doc.text(`รวม: ${sumAmount.toLocaleString('th-TH')} บาท`,padding, doc.y, {align:'right', width:paperWidth - padding*2})

        doc.text(`รับเงินมา: ${billSale.inputMoney.toLocaleString('th-TH')} บาท`,padding, doc.y, {align:'right', width:paperWidth - padding*2})
        doc.text(`เงินทอน: ${billSale.returnMoney.toLocaleString('th-TH')} บาท`,padding, doc.y, {align:'right', width:paperWidth - padding*2})

        doc.end()

        res.status(200).json({fileName:fileName})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"})
    }

}





