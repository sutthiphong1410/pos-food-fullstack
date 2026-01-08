'use client'

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { Food, FoodSize, SaleTemp, SaleTempDetail, Taste } from "@/app/type";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
    const [table, setTable] = useState(1)
    const [foods, setFoods] = useState([])
    const myRef = useRef<HTMLInputElement>(null)
    const [saleTemp, setSaleTemp] = useState([])
    const [tastes, setTastes] = useState([])
    const [sizes, setSizes] = useState([])
    const [amount, setAmount] = useState(0)
    const [saleTempDetails, setSaleTempDetails] = useState([])

    const [openEdit, setOpenEdit] = useState(false)
 

    useEffect(()=> {
        fetchDataFoods()
        fetchDataSaleTemp()
         if (myRef.current) {
            myRef.current.focus()
        }
    },[])

    const openModalEdit = (item:SaleTemp) => {
        setOpenEdit(true);
        generateSaleTempDetail(item.id)
    }

    const closeModalEdit = () => {
        setOpenEdit(false);
    }

    const generateSaleTempDetail = async (saleTempId: number) => {
        try{
            const payload ={
                saleTempId:saleTempId
            }

            await axios.post(config.apiUrl+'/sale/generateSaleTempDetail',payload)
            await fetchDataSaleTemp()
            fetchDataSaleTempInfo(saleTempId)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong!")
            }
        }
    }


    const sumAmount = (saleTemp: SaleTemp[]) => {
        let total = 0
        saleTemp.forEach((item:SaleTemp) => {
            total += item.Food.price * item.qty
        });

        setAmount(total)
    }

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
            sumAmount(res.data)
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
    
    const fetchDataSaleTempInfo = async (saleTempId:number) => {
        try{
            const res = await axios.get(config.apiUrl+'/sale/info/'+saleTempId)
            setSaleTempDetails(res.data.SaleTempdetails)
            setTastes(res.data.Food?.FoodType?.Tastes || [])
            setSizes(res.data.Food?.FoodType?.FoodSizes || [])
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
            fetchDataSaleTemp()
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

    const removeSaleTemp = async (id:number) => {
        try{
            const button = await Swal.fire({
                title:'ลบข้อมูล',
                text:`คุณต้องการลบคำสั่งซื้อหรือไม่`,
                icon:'question',
                showCancelButton:true,
                showConfirmButton:true
            })

            if(button.isConfirmed){
                await axios.delete(config.apiUrl+"/sale/remove/"+id)
                fetchDataSaleTemp()
                toast.success("ลบคำสั่งซื้อสำเร็จ",{autoClose:2000})
            }
        }catch(error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "ลบคำสั่งซื้อไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    const removeAllSaleTemp = async () => {
        try{
            const button = await Swal.fire({
                title:'ลบข้อมูล',
                text:`คุณต้องการลบคำสั่งซื้อทั้งหมดหรือไม่`,
                icon:'question',
                showCancelButton:true,
                showConfirmButton:true
            })

            if(button.isConfirmed){
                const payload = {
                    talbeNo: table,
                    userId: localStorage.getItem("food_id")
                }
                await axios.delete(config.apiUrl+"/sale/removeAll",{data:payload})
                fetchDataSaleTemp()
                toast.success("ลบคำสั่งซื้อสำเร็จ",{autoClose:2000})
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "ลบคำสั่งซื้อไม่สำเร็จ",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong")
            }
        }
    }

    const updateQty = async (id:number, qty:number) => {
        try{
            const payload = {
                id:id,
                qty:qty
            }
            
            await axios.put(config.apiUrl+'/sale/updateQty',payload)
            fetchDataSaleTemp()
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data.message || "เกิดช้อผิดพลาด",
                    {autoClose:2000}
                )
            }else{
                toast.error("Something went wrong")
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

                    <button disabled={saleTemp.length === 0} onClick={e=>removeAllSaleTemp()} className=" disabled:bg-zinc-500 px-4 py-1 bg-red-500 hover:bg-red-400 cursor-pointer rounded-3xl">
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
        <div className="w-4/12 mt-10 space-y-4 ">
            <div className="text-end text-4xl w-full bg-black shadow-2xl p-4 rounded-3xl">
                {amount.toLocaleString("TH-th")}
            </div>
          {saleTemp.length > 0 ?saleTemp?.map((item:SaleTemp) => (
                <div key={item.id} className="px-2 py-4 bg-linear-to-tl rounded-xl from-zinc-900 to-zinc-700 hover:scale-105 transition-transform duration-300">
                   <div className="flex item-center justify-between ">
                     <div className="px-3 py-1 pb-4">
                        <h3 className="font-bold">{item.Food.name}</h3>
                        <p className="font-light text-gray-200">{item.Food.price} x {item.qty} = {item.Food.price * item.qty}</p>
                    </div>
                    <div className="mt-3 ">
                        <button disabled={item.SaleTempdetails.length > 0 } className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-500 disabled:cursor-default cursor-pointer rounded-l-3xl px-1" onClick={e=> updateQty(item.id, item.qty-1)}>
                            <i className="fa fa-minus text-[14px]"></i>
                        </button>
                        <input type="text" disabled value={item.qty} className="text-center w-10 bg-white text-black focus:outline-none"/>
                         <button disabled={item.SaleTempdetails.length > 0 } className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-500 disabled:cursor-default cursor-pointer rounded-r-3xl px-1" onClick={e=> updateQty(item.id, item.qty+1)}>
                            <i className="fa fa-plus text-[14px]"></i>
                        </button>
                    </div>
                   </div>
                    <div>
                        <hr />
                        <div className="flex gap-2 w-full pt-2 ">
                            <button onClick={e=>removeSaleTemp(item.id)} className="px-4 py-2 hover:bg-red-400 bg-red-500 w-full rounded-3xl cursor-pointer"><i className="fa fa-times me-1"></i>ยกเลิก</button>
                            <button onClick={e=>openModalEdit(item)} className="px-4 py-2 hover:bg-blue-400 bg-blue-500 w-full rounded-3xl cursor-pointer"><i className="fa fa-gear me-1"></i>แก้ไข</button>
                        </div>
                    </div>
                </div>
          )):<></>}
        </div>
            <Modal open={openEdit} onClose={closeModalEdit} title="แก้ไขรายการ" modalSize="max-w-5xl">
                <div className="space-y-3 ">
                   <div>
                    <button className="px-4 py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                        <i className="fa fa-plus me-2"></i>
                        เพิ่มรายการ
                    </button>
                   </div>
                <table className="w-full border-collapse rounded-xl overflow-hidden">
                    <thead className="bg-zinc-800 text-zinc-300">
                    <tr>
                        <th className="px-4 py-3 text-center"></th>
                        <th className="px-4 py-3 text-left">ชื่ออาหาร</th>
                        <th className="px-4 py-3 text-center">รสชาติ</th>
                        <th className="px-4 py-3 text-center">ขนาด</th>
                    </tr>
                    </thead>
                    <tbody>
                        {saleTempDetails.length > 0 ? saleTempDetails.map((item:SaleTempDetail) => (
                            <tr key={item.id}  className="hover:bg-zinc-600 bg-zinc-700">
                                <td className="text-center px-4 py-3">
                                    <button className=" bg-red-500 hover:bg-red-400 transition-colors duration-300 rounded-md cursor-pointer">
                                        <i className="fa fa-times"></i>
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    {item.Food.name}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {tastes.map((tastes: Taste)=> (
                                        <button className="font-light border px-1 rounded-md border-red-500 text-red-500 hover:text-white hover:bg-red-500 cursor-pointer transition-all duration-300" key={tastes.id}>{tastes.name}</button>
                                    ))}
                                </td>
                                  <td className="px-4 py-3 text-center">
                                    {sizes.map((sizes: FoodSize)=> (
                                        <button  className="font-light border px-1 rounded-md border-green-500 text-green-500 hover:text-white hover:bg-green-500 cursor-pointer transition-all duration-300" key={sizes.id}>+{sizes.moneyAdded} {sizes.name}</button>
                                    ))}
                                </td>
                            </tr>
                        )):<></>}
                    </tbody>
                   
            </table>



                </div>
            </Modal>
        </div>
    )
}

export default Page;


//382
