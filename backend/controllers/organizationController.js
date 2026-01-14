import {PrismaClient} from "@prisma/client";
import fs from 'fs';
const prisma = new PrismaClient();


export const create = async (req, res) => {
    try {
        const oldOrganization = await prisma.organization.findMany()
        const payload = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
            website: req.body.website,
            promtpay: req.body.promtpay,
            logo: req.body.logo,
            taxCode: req.body.taxCode,
        }

        if(oldOrganization.length == 0){
            await prisma.organization.create({
                data: payload
            })
            res.status(201).json({message: "สร้างข้อมูลร้านสำเร็จ"})
        }else{
            await prisma.organization.update({
                where: { id: oldOrganization[0].id },
                data: payload
            })
            res.status(200).json({message: "แก้ไขข้อมูลร้านสำเร็จ"})
        }
    
    }catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}

export const info = async (req, res) => {
    try{
        const organization = await prisma.organization.findFirst()
        res.status(200).json(organization)
    }catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}


export const uploadLogo = async (req, res) => {
    try{
        const file = req.files.file;
        const extension = file.name.split('.').pop();
        const fileName = `logo_${Date.now()}.${extension}`;
        
        file.mv(`./uploads/${fileName}`)

        const organization = await prisma.organization.findFirst()

        if(organization && organization.logo){
            const oldFilePath = `./uploads/${organization.logo}`;
            fs.unlinkSync(oldFilePath);

            await prisma.organization.update({
                where: { id: organization.id },
                data: { logo: fileName }
            })
            
        }

        res.status(200).json({fileName: fileName});
    }catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}