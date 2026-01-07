'use client'

import config from "@/app/config";
import { Food } from "@/app/type";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [table, setTable] = useState(1)
    const [foods, setFoods] = useState([])
    const myRef = useRef<HTMLInputElement>(null)
    const [saleTemp, setSaleTemp] = useState([])

    useEffect(()=> {
        fetchDataFoods()
        fetchDataSaleTemp()
         if (myRef.current) {
            myRef.current.focus()
        }
    },[])

    const fetchDataFoods = async () => {
        try{
            const res = await axios.get(config.apiUrl+'/food/list')
            setFoods(res.data)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }

    const fetchDataSaleTemp = async () => {
        try{
            const res = await axios.get(config.apiUrl+'/sale/list')
            setSaleTemp(res.data)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }
 
    const filterFood = async (foodType: string) => {
        try{
            const res = await axios.get(config.apiUrl+'/food/filter/'+foodType)
            setFoods(res.data)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    const sale = async (foodId:number) => {
        try{
            const payload = {
                tableNo:table,
                userId: Number(localStorage.getItem("food_id")),
                foodId:foodId
            }

            await axios.post(config.apiUrl+'/sale/create', payload)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เพิ่มคำสั่งซื้อไม่สำเร็จ"
                )
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    return (
        <div className="flex gap-4">
        <div className="space-y-4 w-9/12">
         <h3 className="font-bold">ขายสินค้า</h3>
         <hr className="border-1 border-emerald-500"/>
            <div className="flex gap-2">
               <div className="flex">
                    <h3 className="shadow-2xl px-4 py-1 rounded-l-3xl bg-black/20 border border-zinc-700  text-white" >โต๊ะ</h3>
                    <input ref={myRef} value={table} onChange={e=>setTable(parseInt(e.target.value))} type="text" className="border pl-1 rounded-r-3xl focus:outline-none text-sm shadow-2xl px-4 bg-zinc-800  border-zinc-700  text-white" />
               </div>
               <div className="space-x-2">
                    <button onClick={e=>filterFood('food')} className="px-4 py-1 bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-hamburger me-1"></i> อาหาร
                    </button>

                    <button onClick={e=>filterFood('drink')} className="px-4 py-1 bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-coffee me-1"></i> เครื่องดื่ม
                    </button>

                    <button onClick={e=>filterFood('all')} className="px-4 py-1 bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-list me-1"></i> ทั้งหมด
                    </button>

                    <button  className="px-4 py-1 bg-red-500 hover:bg-red-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-trash me-1"></i> ล้างรายการ
                    </button>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {foods.map((item: Food) => (
                    <div
                    key={item.id}
                    className="bg-zinc-800 p-3 rounded-xl text-white hover:scale-105 hover:bg-zinc-700 transition-all duration-300 cursor-pointer"
                    >
                    <img
                        src={`${config.pathImg}/uploads/${item.img}`}
                        alt={item.name}
                        className="rounded-lg mb-2 w-[200px] h-[190px] mx-auto object-cover "
                        onClick={e=>sale(item.id)}
                    />
                    <p className="font-light hover:text-gray-100">{item.name}</p>
                    <h3 className="text-green-400 hover:text-green-500 font-bold">
                        {item.price} บาท
                    </h3>
                    </div>
                ))}
            </div>

        </div>
        <div className="w-4/12 mt-10 space-y-4">
            <div className="text-end text-4xl w-full bg-black shadow-2xl p-4 rounded-3xl">
                0.00
            </div>
            <div className="px-2 py-4 bg-linear-to-tl rounded-xl from-zinc-900 to-zinc-700 hover:scale-105 transition-transform duration-300">
                <div className="px-3 py-1 pb-4">
                     <h3 className="font-bold">Food Name</h3>
                    <p className="font-light text-gray-200">100 x 2 = 200</p>
                </div>
                <div>
                    <hr />
                    <div className="flex gap-2 w-full pt-2 ">
                        <button className="px-4 py-2 hover:bg-red-400 bg-red-500 w-full rounded-3xl cursor-pointer"><i className="fa fa-times me-1"></i>ยกเลิก</button>
                        <button className="px-4 py-2 hover:bg-green-400 bg-green-500 w-full rounded-3xl cursor-pointer"><i className="fa fa-gear me-1"></i>แก้ไข</button>
                    </div>
                </div>
            </div>
        </div>
           
        </div>
    )
}

export default Page;