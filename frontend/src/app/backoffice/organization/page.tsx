'use client'

import config from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [promtpay, setPromtpay] = useState("");
    const [logo, setLogo] = useState("");
    const [taxCode, setTaxCode] = useState("");
    const [fileSelected, setFileSelected] = useState<File | null>(null);




    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl + '/organization/info');
            if(res.status === 200){
                const data = res.data;
                setName(data.name);
                setPhone(data.phone);
                setAddress(data.address);
                setEmail(data.email);
                setWebsite(data.website);
                setPromtpay(data.promtpay);
                setLogo(data.logo);
                setTaxCode(data.taxCode);
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล"),
                {autoClose: 2000};
            }else{
                toast.error("Some thing went wrong");
            }
        }
    }

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', fileSelected as Blob);

        const res = await axios.post(config.apiUrl + '/organization/upload-logo', formData);
        return res.data.fileName
    }

    const save = async  () => {
        try{
            const fileName = await uploadFile();
            const payload = {
                name:name,
                phone:phone,
                address:address,
                email:email,
                website:website,
                promtpay:promtpay,
                logo:fileName,
                taxCode:taxCode
            }

            const res = await axios.post(config.apiUrl + '/organization/create', payload);

            if(res.status === 200){
                toast.success("บันทึกข้อมูลสำเร็จ", {autoClose: 2000});
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"),
                {autoClose: 2000};
            }else{
                toast.error("Some thing went wrong");
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            setFileSelected(e.target.files[0]);
        }
    }

 

    return (
        <>
             <div className="space-y-4">
                <h3 className="font-bold">ข้อมูลร้าน</h3>
                <hr className="border-1 border-emerald-500"/>
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-2 lg:col-span-2">
                        <label className="text-sm font-semibold text-gray-300">ชื่อร้าน</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>


                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-300">เบอร์โทร</label>
                        <input 
                            type="text" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 lg:col-span-2">
                        <label className="text-sm font-semibold text-gray-300">ที่อยู่</label>
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-300">อีเมล</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-300">เว็บไซต์</label>
                        <input 
                            type="url" 
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-300">พร้อมเพย์</label>
                        <input 
                            type="text" 
                            value={promtpay}
                            onChange={(e) => setPromtpay(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>


                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-300">เลขประจำตัวผู้เสียภาษี</label>
                        <input 
                            type="text" 
                            value={taxCode}
                            onChange={(e) => setTaxCode(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>

                    
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-gray-300">โลโก้</label>
                        {logo && (
                            <img src={config.pathImg + '/uploads/' + logo} alt="Logo" className="w-32 h-32 object-contain mb-2 rounded-md"/>
                        )}
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition file:mr-2 md:file:py-2 file:px-2 md:file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:cursor-pointer"
                        />
                    </div>
              
                    </div>
                     <div className="">
                        <button onClick={save} className="py-1 px-1 md:px-8 md:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition duration-200 transform hover:scale-105 shadow-lg cursor-pointer">
                            บันทึกข้อมูล
                        </button>
                    </div>
                </div>
        </>
    )
}

export default Page;