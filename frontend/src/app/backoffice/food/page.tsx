'use client'

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { Food, FoodType } from "@/app/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [foodTypeId, setFoodTypeId] = useState(0);
    const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
    const [foods, setFoods] = useState([])
    const [name, setName] = useState("");
    const [remark, setRemark] = useState("");
    const [id, setId] = useState(0);
    const [price, setPrice] = useState(0);
    const [img, setImg] = useState("");
    const [fileName, setFileName] = useState("เลือกไฟล์รูปภาพ");
    const [myFile, setMyFile] = useState<File | null>(null);
    const [foodType, setFoodType] = useState("food");

    useEffect(() => {
        fetchDataFoodTypes();
        fetchDataFood()
    }, [])

    const fetchDataFoodTypes = async () => {
        try{
            const res = await axios.get(config.apiUrl + "/food-type/list");
                setFoodTypes(res.data);
                setFoodTypeId(res.data[0].id);
        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                  { autoClose: 2000 }
                );
            }else{
              toast.error("Something went wrong");
            }
        }
    }

    const fetchDataFood = async () => {
        try{
            const res = await axios.get(config.apiUrl+'/food/list')
            setFoods(res.data)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                    { autoClose: 2000 }
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }

    const handleSelectedFile = (e:any) => {
        const file = e.target.files[0];
        setMyFile(file);
        setFileName(file.name);
    }

    const handleUpload = async () => {
        try{
            const formData = new FormData()
            if(myFile){
                formData.append('myFile', myFile)
            }

            const res = await axios.post(config.apiUrl+'/food/upload',formData)
            return res.data.fileName
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "อัพโหลดไฟล์ไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }

    const handleSave = async () => {
        try{
            const img = await handleUpload()
            const payload = {
                foodTypeId: foodTypeId,
                name: name,
                remark: remark,
                price: price,
                img: img,
                foodType: foodType,
                id: id
            }
            let res
            if(id== 0){
                 res = await axios.post(config.apiUrl+'/food/create', payload)
            }else{
                res = await axios.put(config.apiUrl+'/food/update',payload)
                setId(0)
            }

            if(res.status == 201){
                toast.success("บันทึกข้อมูลสำเร็จ", { autoClose: 2000 });
                closeModal();
                fetchDataFood()
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ",
                    {autoClose: 2000}
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }

    const handleRemove = async (item : Food) => {
        try{
            const button = await Swal.fire({
                title:'ลบข้อมูล',
                text:`คุณต้องการลบ ${item.name} ใช่หรือไม่`,
                icon:'question',
                showCancelButton:true,
                showConfirmButton:true
            })

            if(button.isConfirmed){
                const res = await axios.delete(config.apiUrl+'/food/remove/'+item.id)
                if(res.status == 200){
                    toast.success('ลบข้อมูลสำเร็จ', {autoClose:2000})
                    fetchDataFood()
                }
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }

    const getFoodTypeName = (foodType: string) : string =>{
        if(foodType == 'food'){
            return 'อาหาร'
        }else{
            return 'เครื่องดื่ม'
        }
    }

    const handleEdit = (item: Food) => {
        setId(item.id)
        setFoodTypeId(item.foodTypeId)
        setName(item.name)
        setPrice(item.price)
        setFoodType(item.foodType)
        setImg(item.img)
        setRemark(item.remark)
        openModal()
    }

    const openModal = () => {
        setOpen(true);
    }

    const closeModal = () => {
        setOpen(false);
    }

    const clearForm = () => {
        setId(0)
        setFoodTypeId(0)
        setName("")
        setPrice(0)
        setFoodType("")
        setFileName("เลือกไฟล์รูปภาพ")
        setImg("")
        setRemark("")
    }

    return (
        <>
           <div className="space-y-4">
            <h3 className="font-bold">อาหาร</h3>
            <hr className="border-1 border-emerald-500"/>
                <div className="space-y-4">
                    <button onClick={()=>{clearForm(); openModal();}} className="px-4 py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                        <i className="fa fa-plus me-2"></i>เพิ่มรายการ
                    </button>

                     <table className="w-full border-collapse rounded-xl overflow-hidden">
                        <thead className="bg-zinc-800 text-zinc-300">
                        <tr>
                            <th className="px-4 py-3 text-left">ภาพ</th>
                            <th className="px-4 py-3 text-left">ประเภท</th>
                            <th className="px-4 py-3 text-left">ชนิด</th>
                            <th className="px-4 py-3 text-left">ชื่ออาหาร</th>
                            <th className="px-4 py-3 text-center">หมายเหตุ</th>
                            <th className="px-4 py-3 text-end">ราคา</th>
                            <th className="px-4 py-3 text-center">จัดการ</th>
                        </tr>
                        </thead>
                            <tbody className="divide-y divide-zinc-800 bg-zinc-900 ">
                                {foods.length > 0 ? (
                                    foods.map((item: Food) => (
                                        <tr key={item.id} className="hover:bg-zinc-600 bg-zinc-700">
                                            <td className="px-4 py-3 ">
                                                <img className="rounded-xl" src={config.pathImg+'/uploads/' + item.img} alt={item.name} width="150" />
                                            </td>
                                                <td className="px-4 py-3">{item.FoodType?.name}</td>
                                                <td className="px-4 py-3">{getFoodTypeName(item.foodType)}</td>
                                                <td className="px-4 py-3 text-zinc-400">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {item.remark}
                                                </td>
                                                 <td className="px-4 py-3 text-end">
                                                    {item.price}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl cursor-pointer"
                                                        onClick={() => handleEdit(item)}
                                                        >
                                                        แก้ไข
                                                        </button>
                                                        <button
                                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-3xl cursor-pointer"
                                                        onClick={(e) => handleRemove(item)}
                                                        >
                                                        ลบ
                                                        </button>
                                                    </div>
                                                    </td>
                                                </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="py-6 text-center text-zinc-500">
                                                        ไม่มีข้อมูล
                                                    </td>
                                                </tr>
                                            )}
                            </tbody>
                    </table>
                </div>
            </div>

            <Modal open={open} onClose={closeModal} title="ขนาดอาหาร/เครื่องดื่ม">
                <div className="space-y-3">
                    <select className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white" value={foodTypeId} onChange={e=>setFoodTypeId(parseInt(e.target.value))} >
                        <option value="">เลือกประเภทอาหาร/เครื่องดื่ม</option>
                        {foodTypes.map((item: FoodType) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    
                    {img != '' &&
                        <img className="rounded-2xl" src={config.pathImg+'/uploads/'+img} alt={name} width={200} />
                    }
                    <label className="cursor-pointer w-full flex items-center justify-between gap-3 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-400 hover:bg-zinc-700">
            
                        <span className="flex items-center gap-2 truncate text-[14px]">
                            <i className="fa-solid fa-file-import text-lg"></i>
                            {fileName}
                        </span>

                        <span className="border border-zinc-500 px-4 py-1 rounded-3xl hover:bg-zinc-500 hover:text-white shrink-0">
                            อัพโหลด
                        </span>

                        <input
                            onChange={(e) => handleSelectedFile(e)}
                            type="file"
                            accept="image/*"
                            className="hidden "
                        />
                    </label>

                    <input
                        value={name}
                        onChange={e=> setName(e.target.value)}
                        type="text"
                        placeholder="ชื่ออาหาร"
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                    />

                    <input
                        value={price}
                        onChange={e=> setPrice(parseInt(e.target.value))}
                        type="number"
                        placeholder="ราคา"
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                    />

                   <div className="flex space-x-4">
                    <div>ประเภท</div>

                    <label className="flex items-center gap-1 cursor-pointer">
                        <input
                        type="radio"
                        name="foodType"
                        value="food"
                        checked={foodType === "food"}
                        onChange={(e) => setFoodType(e.target.value)}
                        />
                        อาหาร
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                        <input
                        type="radio"
                        name="foodType"
                        value="drink"
                        checked={foodType === "drink"}
                        onChange={(e) => setFoodType(e.target.value)}
                        />
                        เครื่องดื่ม
                    </label>
                    </div>

                    <textarea 
                        value={remark}
                        onChange={e=>setRemark(e.target.value)}
                        placeholder="หมายเหตุ" 
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white" 
                    />
                    <div className="flex justify-end mt-3">
                        <button onClick={handleSave} className="px-4 py-2 rounded-3xl bg-emerald-700 hover:bg-emerald-600 text-white text-end cursor-pointer">
                        บันทึก
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Page;