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
            include: {
                SaleTempdetails: true
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
            if (rowSaleTemp.SaleTempdetails.length === 0) {
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
        }
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

export const createSaleTempDetail = async (req, res) => {
    try {
        const saleTempId = req.body.saleTempId
        const saleTempDetail = await prisma.saleTempDetail.findFirst({
            where: {
                saleTempId: saleTempId
            }
        })

        await prisma.saleTempDetail.create({
            data: {
                foodId: saleTempDetail.foodId,
                saleTempId: saleTempDetail.saleTempId
            }
        })

        const countSaleTempDetail = await prisma.saleTempDetail.count({
            where: {
                saleTempId: saleTempDetail.saleTempId
            }
        })

        await prisma.saleTemp.update({
            where: {
                id: saleTempDetail.saleTempId
            },
            data: {
                qty: countSaleTempDetail
            }
        })

        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const removeSaleTempDetail = async (req, res) => {
    try {
        const saleTempDetailId = req.body.saleTempDetailId
        const saleTempDetail = await prisma.saleTempDetail.findUnique({
            where: {
                id: saleTempDetailId
            }
        })

        await prisma.saleTempDetail.delete({
            where: {
                id: saleTempDetailId
            }
        })

        const countSaleTempDetail = await prisma.saleTempDetail.count({
            where: {
                saleTempId: saleTempDetail.saleTempId
            }
        })

        await prisma.saleTemp.update({
            where: {
                id: saleTempDetail.saleTempId
            },
            data: {
                qty: countSaleTempDetail
            }
        })

        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const printBillBeforePay = async (req, res) => {
    try {
        const organization = await prisma.organization.findFirst()
        const saleTemps = await prisma.saleTemp.findMany({
            where: {
                userId: parseInt(req.body.userId),
                tableNo: req.body.tableNo
            },
            include: {
                SaleTempdetails: {
                    include: {
                        FoodSize: true,
                    }
                },
                Food: true
            }
        })
        const saleTempIds = saleTemps.map(st => st.id)

        const saleTempDetails = await prisma.saleTempDetail.findMany({
            where: {
                saleTempId: {
                    in: saleTempIds
                }
            },
            include: {
                Food: true,
                FoodSize: true
            }
        })

        
        const paperWidth = 80;
        const padding = 3;

        const LINE_HEIGHT = 8
        const HEADER_HEIGHT = 120
        const FOOTER_HEIGHT = 20

        let itemHeight = 0

        saleTemps.forEach(item => {
        itemHeight += LINE_HEIGHT * 2 

        const optionCount = item.SaleTempdetails.filter(d => d.FoodSize).length
        itemHeight += optionCount * LINE_HEIGHT
        })

        const paperHeight = HEADER_HEIGHT + itemHeight + FOOTER_HEIGHT


        const doc = new pdfkit({
            size: [paperWidth, paperHeight],
            margins: {
                top: 3,
                bottom: 3,
                left: 3,
                right: 3
            }
        })

        const printSpaceBetween = (label, value) => {
        const y = doc.y
        const contentWidth = paperWidth - (padding * 2)

        doc.text(label, padding, y, { align: 'left' })
        doc.text(value, padding, y, {
            width: contentWidth,
            align: 'right'
        })

        doc.moveDown(0.4)
}
        const fileName = `uploads/bill-${dayjs(new Date()).format('YYYYMMDD_HHmmss')}.pdf`
        const font = "Kanit/kanit-regular.ttf"



        doc.pipe(fs.createWriteStream(fileName))

        
        const imageWidth = 30;
        const postionX = (paperWidth / 2) - (imageWidth / 2)
        const logoMax = [30, 20]

        doc.image('uploads/' + organization.logo,postionX, 5, {
            fit: logoMax,
            align: 'center',
        })

        doc.moveDown(1.2)

        doc.font(font)
        doc.fontSize(5)
        doc.text(organization.name, padding, doc.y+8, { align: 'center' })
        doc.fontSize(4).text('*** ใบแจ้งยอดก่อนชำระเงิน ***', { align: 'center' })
    
        doc.fontSize(4)
        doc.text(`TAX# ${organization.taxCode}`, { align: 'center' })
        doc.text(`ที่อยู่: ${organization.address}`, { align: 'center' })
        doc.text(`เบอร์โทร: ${organization.phone}`, { align: 'center' })
        doc.moveDown(0.1)
        doc.text(`พร้อมเพย์`, { align: 'center' })
        doc.text(`${organization.promtpay}`, { align: 'center' })

        doc.fontSize(4)
        doc.text(`โต๊ะที่: ${req.body.tableNo}`, { align: 'start' })
        doc.text(`พนักงาน: ${req.body.userName}`, { align: 'start' })
        doc.moveDown(0.4)
        

        const y = doc.y
        doc.fontSize(4)
        doc.lineWidth(0.1)
        doc.moveTo(padding, y -1).lineTo(paperWidth - padding, y - 1).stroke()
        doc.text('รายการที่สั่ง', padding, y)
        doc.lineWidth(0.1)
        doc.moveTo(padding, y + 6).lineTo(paperWidth - padding, y + 6).stroke()


                let total = 0

            saleTemps.forEach(item => {
            const startY = doc.y

            // ===== รวม option =====
            const optionMap = item.SaleTempdetails
                .filter(d => d.FoodSize)
                .reduce((acc, d) => {
                const name = d.FoodSize.name
                if (!acc[name]) {
                    acc[name] = {
                    count: 0,
                    price: Number(d.FoodSize.moneyAdded)
                    }
                }
                acc[name].count += 1
                return acc
                }, {})

            const optionTotal = Object.values(optionMap)
                .reduce((sum, o) => sum + (o.count * o.price), 0)

            const foodTotal =
                (item.Food.price * item.qty) + optionTotal

                total += foodTotal

                // ===== บรรทัดที่ 1 =====
                doc.text(item.Food.name, padding, startY)
                doc.text(
                    `฿${foodTotal.toFixed(2)}`,
                    padding + 55,
                    startY,
                    { align: 'right' }
                )

                

                // ===== บรรทัดที่ 2 =====
                doc.text(
                    `${item.qty} x ฿${item.Food.price.toFixed(2)}`,
                    padding
                )

                // ===== บรรทัด option (รวมชื่อเดียวกัน) =====
                Object.entries(optionMap).forEach(([name, o]) => {
                    doc.text(
                    `(${name} ${o.count}) +${o.count * o.price}`,
                    padding
                    )
                })

            doc.moveDown(0.4)
            })



            doc.moveDown(0.5)
            doc.lineWidth(0.1)
            doc.moveTo(padding, doc.y).lineTo(paperWidth - padding, doc.y).stroke()
            doc.moveDown(0.4)

            printSpaceBetween(
                'รวม',
                `฿${total.toLocaleString('th-TH')}`
            )

            printSpaceBetween(
                'ภาษีมูลค่าเพิ่ม (VAT 7%)',
                `฿${(total * 0.07).toLocaleString('th-TH')}`
            )

            const netAmount = total + (total * 0.07)

            doc.fontSize(4)
            printSpaceBetween('ยอดสุทธิ',`฿${netAmount.toLocaleString('th-TH')}`)
            doc.fontSize(4)
            doc.lineWidth(0.1)
            doc.moveTo(padding, doc.y).lineTo(paperWidth - padding, doc.y).stroke()
            doc.moveDown(0.5)
            doc.text('ขอบพระคุณที่ใช้บริการ', { align: 'center' })
            doc.moveDown(0.2)

           doc.text(`${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`)
            doc.end()

        res.status(200).json({ fileName: fileName, saleTempDetails: saleTempDetails })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const endSale = async (req, res) => {
    try {
        const saleTemps = await prisma.saleTemp.findMany({
            include: {
                SaleTempdetails: {
                    include: {
                        Food: true,
                        FoodSize: true,
                    }
                },
                Food: true
            },
            where: {
                userId: req.body.userId,
            }
        })

        const billSale = await prisma.billSale.create({
            data: {
                amount: req.body.amount,
                inputMoney: req.body.inputMoney,
                payType: req.body.payType,
                tableNo: req.body.tableNo,
                userId: req.body.userId,
                returnMoney: req.body.returnMoney
            }
        })

        for (let i = 0; i < saleTemps.length; i++) {
            const item = saleTemps[i]

            if (item.SaleTempdetails.length > 0) {

                for (let j = 0; j < item.SaleTempdetails.length; j++) {
                    const detail = item.SaleTempdetails[j]
                    await prisma.billSaleDetail.create({
                        data: {
                            billSaleId: billSale.id,
                            foodId: detail.foodId,
                            tasteId: detail.tasteId,
                            foodSizeId: detail.foodSizeId,
                            moneyAdded: detail.FoodSize?.moneyAdded ?? null,
                            price: detail.Food.price,
                        }
                    })
                }
            } else {
                if (item.qty > 0) {
                    for (let k = 0; k < item.qty; k++) {
                        await prisma.billSaleDetail.create({
                            data: {
                                billSaleId: billSale.id,
                                foodId: item.foodId,
                                price: item.Food.price
                            }
                        })
                    }
                } else {
                    await prisma.billSaleDetail.create({
                        data: {
                            billSaleId: billSale.id,
                            foodId: item.foodId,
                            price: item.Food.price
                        }
                    })
                }
            }
        }

        for (let i = 0; i < saleTemps.length; i++) {
            const item = saleTemps[i]

            await prisma.saleTempDetail.deleteMany({
                where: {
                    saleTempId: item.id
                }
            })
        }


        await prisma.saleTemp.deleteMany({
            where: {
                userId: req.body.userId
            }
        })

        res.status(200).json({ message: "สำเร็จ" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server Error" })
    }
}

export const printBillAfterPay = async (req, res) => {
  try {
    const organization = await prisma.organization.findFirst()

    const billSale = await prisma.billSale.findFirst({
      where: {
        userId: parseInt(req.body.userId),
        tableNo: req.body.tableNo,
        status: "use"
      },
      include: {
        billSaleDetails: {
          include: {
            Food: true,
            FoodSize: true
          }
        },
        User: true
      },
      orderBy: { id: 'desc' }
    })

    const billSaleDetails = billSale.billSaleDetails

    // =======================
    // คำนวณความสูงกระดาษ
    // =======================
    const LINE_HEIGHT = 8
    let itemHeight = 0

    const grouped = Object.values(
      billSaleDetails.reduce((acc, d) => {
        const key = d.foodId
        acc[key] ??= {
          food: d.Food,
          qty: 0,
          options: []
        }
        acc[key].qty += 1
        if (d.FoodSize) acc[key].options.push(d.FoodSize)
        return acc
      }, {})
    )

    grouped.forEach(item => {
      itemHeight += LINE_HEIGHT * 2
      itemHeight += item.options.length * LINE_HEIGHT
    })

    const paperWidth = 80
    const paperHeight = 120 + itemHeight + 40
    const padding = 3

    const doc = new pdfkit({
      size: [paperWidth, paperHeight],
      margins: { top: 3, bottom: 3, left: 3, right: 3 }
    })

    const printSpaceBetween = (label, value) => {
    const y = doc.y
    const contentWidth = paperWidth - (padding * 2)
        doc.text(label, padding, y, { align: 'left' })
        doc.text(value, padding, y, {
        width: contentWidth,
        align: 'right'
        })
    }   

    doc.moveDown(0.4)

    const fileName = `uploads/invoice-${dayjs().format('YYYYMMDD_HHmmss')}.pdf`
    const font = "Kanit/kanit-regular.ttf"
    doc.pipe(fs.createWriteStream(fileName))

    // =======================
    // HEADER (เหมือน BeforePay)
    // =======================
      const imageWidth = 30;
        const postionX = (paperWidth / 2) - (imageWidth / 2)
        const logoMax = [30, 20]

    doc.image('uploads/' + organization.logo,postionX, 5, {
        fit: logoMax,
        align: 'center',
    })

    doc.moveDown(1.2)

    doc.font(font)
    doc.fontSize(5)
    doc.text(organization.name, { align: 'center' })
    doc.fontSize(4).text('*** ใบเสร็จรับเงิน ***', { align: 'center' })

    doc.fontSize(4)
    doc.text(`TAX# ${organization.taxCode}`, { align: 'center' })
    doc.text(`ที่อยู่: ${organization.address}`, { align: 'center' })
    doc.text(`เบอร์โทร: ${organization.phone}`, { align: 'center' })
    doc.moveDown(0.1)
    doc.text(`พร้อมเพย์`, { align: 'center' })
    doc.text(`${organization.promtpay}`, { align: 'center' })

    doc.fontSize(4)
    doc.text(`โต๊ะที่: ${req.body.tableNo}`, { align: 'start' })
    doc.text(`พนักงาน: ${req.body.userName}`, { align: 'start' })
    doc.moveDown(0.4)

    
    doc.fontSize(4)
    doc.lineWidth(0.1)
    doc.moveTo(padding, doc.y -1).lineTo(paperWidth - padding, doc.y - 1).stroke()
    doc.text('รายการที่สั่ง', padding, doc.y)
    doc.lineWidth(0.1)
    doc.moveTo(padding, doc.y + 0.5).lineTo(paperWidth - padding, doc.y + 0.5).stroke()

    // =======================
    // BODY (เหมือน BeforePay)
    // =======================
    let total = 0

    grouped.forEach(item => {
      const startY = doc.y

      // รวม option
      const optionMap = item.options.reduce((acc, o) => {
        acc[o.name] ??= { count: 0, price: Number(o.moneyAdded ?? 0) }
        acc[o.name].count++
        return acc
      }, {})

      const optionTotal = Object.values(optionMap)
        .reduce((s, o) => s + o.count * o.price, 0)

      const foodTotal =
        (item.food.price * item.qty) + optionTotal

      total += foodTotal

      // บรรทัด 1
      doc.text(item.food.name, padding, startY)
      doc.text(`฿${foodTotal.toFixed(2)}`, padding + 55, startY, { align: 'right' })

      // บรรทัด 2
      doc.text(`${item.qty} x ฿${item.food.price.toFixed(2)}`, padding)

      // option
      Object.entries(optionMap).forEach(([name, o]) => {
        doc.text(`(${name} ${o.count}) +${o.count * o.price}`, padding)
      })

      doc.moveDown(0.4)
    })

    // =======================
    // FOOTER
    // =======================
     doc.moveDown(0.5)
     doc.lineWidth(0.1)
     doc.moveTo(padding, doc.y).lineTo(paperWidth - padding, doc.y).stroke()
     doc.moveDown(0.4)

     const netAmount = total + (total * 0.07)
    printSpaceBetween(
                'รวมทั้งหมด',
                `฿${netAmount.toLocaleString('th-TH')}`
            )
    printSpaceBetween(
                'ภาษีมูลค่าเพิ่ม (VAT 7%)',
                `฿${(total * 0.07).toLocaleString('th-TH')}`
            )
    printSpaceBetween(
                `${billSale.payType === 'cash' ? 'เงินสด' : 'เงินโอน'}`,
                `฿${billSale.inputMoney.toLocaleString('th-TH')}`
            )
    printSpaceBetween(
                'เงินทอน',
                `฿${billSale.returnMoney.toLocaleString('th-TH')}`
            )
        doc.fontSize(4)
        doc.lineWidth(0.1)
        doc.moveTo(padding, doc.y).lineTo(paperWidth - padding, doc.y).stroke()
        doc.moveDown(0.5)
        doc.text('ขอบพระคุณที่ใช้บริการ', { align: 'center' })
        doc.moveDown(0.2)

        doc.text(`${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`)
        doc.end()

    res.status(200).json({ fileName })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Server Error" })
  }
}



//แก้ billSaleDetail moneyAdded




