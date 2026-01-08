import { PrismaClient } from "@prisma/client";
import fs from "fs"
const prisma = new PrismaClient()


export const upload = async (req,res) => {
    try{
        if(req.files != undefined){
            const myFile = req.files.myFile

            const fileName = myFile.name

            const fileExtension = fileName.split('.').pop()
            const newFileName = new Date().getTime() + '.' + fileExtension
            const path = "uploads/" + newFileName

            myFile.mv(path, async (err) => {
                if (err){
                    return res.status(500).send({error: err.message})
                }

                return res.send({message:'success', fileName: newFileName})
            })
        }else{
            return res.status(400).send({error: "No file uploaded"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:'Server Error'})
    }
}

export const create = async (req,res) => {
    try{
        await prisma.food.create({
            data:{
                foodTypeId:req.body.foodTypeId,
                name:req.body.name,
                remark:req.body.remark,
                price:req.body.price,
                img:req.body.img,
                foodType:req.body.foodType
            }
        })
        res.status(201).send({message:'สร้างอาหารสำเร็จ'})
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Server Error'})
    }
}

export const list = async (req,res) => {
    try{
        const foods = await prisma.food.findMany({
            include:{
                FoodType:true
            },
            where:{
                status:"use"
            },
            orderBy:{
                id:"desc"
            }
        })
        res.status(200).json(foods)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Server Error'})
    }
}

export const remove = async (req,res) => {
    try{
        await prisma.food.update({
            where:{
                id:parseInt(req.params.id)
            },
            data:{
                status:"delete"
            }
        })
        res.status(200).json({message:'ลบข้อมูลสินค้าสำเร็จ'})
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Server Error'})
    }
}

export const update = async (req, res) => {
  try {
    const oldFood = await prisma.food.findUnique({
      where: { id: req.body.id }
    })

    if (!oldFood) {
      return res.status(404).json({ message: "ไม่พบข้อมูลอาหาร" })
    }

    // ถ้ามีรูปเก่า และมีการส่งรูปใหม่มา
    if (oldFood.img && req.body.img) {
      const oldPath = `uploads/${oldFood.img}`
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    await prisma.food.update({
      where: { id: req.body.id },
      data: {
        foodTypeId: req.body.foodTypeId,
        name: req.body.name,
        remark: req.body.remark,
        price: req.body.price,
        img: req.body.img ? req.body.img : oldFood.img,
        foodType: req.body.foodType
      }
    })

    res.status(201).json({ message: "แก้ไขข้อมูลสำเร็จ" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server Error" })
  }
}


export const filter = async (req,res) => {
    try{
        let condition = {
            status:"use"
        }

        if(req.params.foodType != "all"){
            condition.foodType = req.params.foodType
        }

        const foods = await prisma.food.findMany({
            where:condition,
            orderBy:{
                name: 'asc'
            }
        })

        return res.json(foods)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Server Error'})
    }
}