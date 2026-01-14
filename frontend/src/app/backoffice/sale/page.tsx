'use client'

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { Food, FoodSize, SaleTemp, SaleTempDetail, Taste } from "@/app/type";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
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
    const [amountAdded, setAmountAdded] = useState(0)
    const [saleTempDetails, setSaleTempDetails] = useState([])
    const [saleTempId, setSaleTempId] = useState(0)
    const [payType, setPayType] = useState('cash')
    const [inputMoney, setInputMoney] = useState(0)
    const [billUrl, setBillUrl] = useState('')

    const [openEdit, setOpenEdit] = useState(false)
    const [openEndSale, setOpenEndSale] = useState(false)
    const [openBill, setOpenBill] = useState(false)
 

    useEffect(()=> {
        fetchDataFoods()
        fetchDataSaleTemp()
         if (myRef.current) {
            myRef.current.focus()
        }
    },[])

    const openModalEdit = (item:SaleTemp) => {
        setOpenEdit(true);
        setSaleTempId(item.id)
        generateSaleTempDetail(item.id)
    }

    const closeModalEdit = () => {
        setOpenEdit(false);
    }

    const openModalEndSale = () => {
        setOpenEndSale(true);
    }

    const closeModalEndSale = () => {
        setOpenEndSale(false);
    }

    const openModalBill = () => {
        setOpenBill(true);
    }

    const closeModalBill = () => {
        setOpenBill(false);
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

            const results = res.data
            let sum =0

            results.forEach((item:SaleTemp )=> {
                sum += sumMoneyAdded(item.SaleTempdetails)
            }); 

            sumAmount(results)
            setAmountAdded(sum)
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
                toast.error("Something went wrongsss")
            }
        }
    }

    const sumMoneyAdded = (saleTempDetails: SaleTempDetail[]) => {
        let sum = 0;

        for(let i=0; i< saleTempDetails.length; i++){
            const detail = saleTempDetails[i]
            sum += detail.FoodSize?.moneyAdded ?? 0
        }
        
        return sum
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
            const payload = {
                    talbeNo: table,
                    userId: localStorage.getItem("food_id")
            }
            const button = await Swal.fire({
                title:'ลบข้อมูล',
                text:`คุณต้องการลบคำสั่งซื้อทั้งหมดหรือไม่`,
                icon:'question',
                showCancelButton:true,
                showConfirmButton:true
            })

            if(button.isConfirmed){
               
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
                toast.error("Something went wrong!")
            }
        }
    }

    const selectTaste = async (tasteId:number, saleTempDetailId:number, saleTempId:number) =>{
        try{
            const payload = {
                tasteId: tasteId,
                saleTempDetailId:saleTempDetailId,
                saleTempId:saleTempId
            }

            const res = await axios.put(config.apiUrl+'/sale/selectTaste', payload)
            if(res.status == 200){
                fetchDataSaleTempInfo(saleTempId)
                toast.success("เลือกรสชาติสำเร็จ",{autoClose:2000})
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose: 2000}
                )
            }else{
                toast.error(
                    "Something went wrong!"
                )
            }
        }
    }

      const unSelectTaste = async (saleTempDetailId:number, saleTempId:number) =>{
        try{
            const payload = {
                saleTempDetailId:saleTempDetailId,
            }

            const res = await axios.put(config.apiUrl+'/sale/unSelectTaste', payload)
            if(res.status == 200){
                fetchDataSaleTempInfo(saleTempId)
                toast.success("ยกเลิกการเลือกรสชาติแล้ว",{autoClose:2000})
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose: 2000}
                )
            }else{
                toast.error(
                    "Something went wrong!"
                )
            }
        }
    }

     const selectSize = async (sizeId:number, saleTempDetailId:number, saleTempId:number) =>{
        try{
            const payload = {
                sizeId: sizeId,
                saleTempDetailId:saleTempDetailId,
                saleTempId:saleTempId
            }

            const res = await axios.put(config.apiUrl+'/sale/selectSize', payload)
            await fetchDataSaleTempInfo(saleTempId)
            await fetchDataSaleTemp()
            if(res.status == 200){
                fetchDataSaleTempInfo(saleTempId)
                toast.success("เลือกขนาดสำเร็จ",{autoClose:2000})
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose: 2000}
                )
            }else{
                toast.error(
                    "Something went wrong!"
                )
            }
        }
    }

    const unSelectSize = async (saleTempDetailId:number, saleTempId:number) =>{
        try{
            const payload = {
                saleTempDetailId:saleTempDetailId,
            }

            const res = await axios.put(config.apiUrl+'/sale/unSelectSize', payload)
            if(res.status == 200){
                fetchDataSaleTempInfo(saleTempId)
                await fetchDataSaleTempInfo(saleTempId)
                await fetchDataSaleTemp()
                toast.success("ยกเลิกการเลือกขนาดแล้ว",{autoClose:2000})
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose: 2000}
                )
            }else{
                toast.error(
                    "Something went wrong!"
                )
            }
        }
    }

    const createSaleTempDetail = async () => {
        try{
            const payload = {
                slaeTempId: saleTempId
            }

            await axios.post(config.apiUrl+'/sale/createSaleTempDetail', payload)
            await fetchDataSaleTemp()
            fetchDataSaleTempInfo(saleTempId)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose: 2000}
                )
            }else{
                toast.error(
                    "Something went wrong!"
                )
            }
        }
    }

    const removeSaleTempDetail = async (saleTempDetailId:number) => {
        try{
            const payload = {
                saleTempDetailId:saleTempDetailId
            }

            await axios.delete(config.apiUrl+'/sale/removeSaleTempDetail',{data: payload})
            await fetchDataSaleTemp()
            fetchDataSaleTempInfo(saleTempId)
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(
                    error.response?.data?.message || "เกิดข้อผิดพลาด",
                    {autoClose: 2000}
                )
            }else{
                toast.error(
                    "Something went wrong!"
                )
            }
        }

    }

    const printBillBeforePay = async () => {
        try{
            const payload = {
                tableNo: table,
                userId: parseInt(localStorage.getItem("food_id") || "0")
            }
            const res = await axios.post(config.apiUrl+'/sale/printBillBeforePay', payload)

            if(res.status == 200){
                toast.success("พิมพ์ใบแจ้งรายการสำเร็จ",{autoClose:2000})
            }

            setTimeout(() => {
                setBillUrl(res.data.fileName)

                const button = document.getElementById('btnPrint') as HTMLButtonElement
                button.click()
            }, 500);
        }catch(error:unknown){
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

    const endSale = async () => {
        try{
            const button = await Swal.fire({
                title:'จบการขาย',
                text:`คุณต้องการจบการขายหรือไม่`,
                icon:'question',
                showCancelButton:true,
                showConfirmButton:true
            })


            if(button.isConfirmed){
                const payload = {
                    tableNo: table,
                    userId: parseInt(localStorage.getItem("food_id") || "0"),
                    payType: payType,
                    inputMoney: inputMoney,
                    amount: amount + amountAdded,
                    returnMoney: inputMoney - (amount + amountAdded)
                }
                const res = await axios.post(config.apiUrl+'/sale/endSale', payload)
                if(res.status == 200){
                    toast.success("จบการขายสำเร็จ",{autoClose:2000})
                    closeModalEndSale()
                    fetchDataSaleTemp()
                    setInputMoney(0)
                    printBillAfterPay()
                }
            }
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

    const printBillAfterPay = async () => {
        try{
            const payload = {
                tableNo: table,
                userId: parseInt(localStorage.getItem("food_id") || "0")
            }
            const res = await axios.post(config.apiUrl+'/sale/printBillAfterPay', payload)

            setTimeout(() => {
                setBillUrl(res.data.fileName)
                const button = document.getElementById('btnPrint') as HTMLButtonElement
                button.click()
            }, 300);

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



    return (
        <div className="flex gap-4">
        <div className="space-y-4 w-9/12">
         <h3 className="font-bold">ขายสินค้า</h3>
         <hr className="border-1 border-emerald-500"/>
            <div className="flex gap-2">
               <div className="flex">
                    <h3 className="shadow-2xl px-2 py-1 rounded-l-3xl bg-black/20 border border-zinc-700  text-white" >โต๊ะ</h3>
                    <input ref={myRef} value={table} onChange={e=>setTable(parseInt(e.target.value))} type="text" className="border pl-1 rounded-r-3xl focus:outline-none text-sm shadow-2xl px-2 bg-zinc-800  border-zinc-700  text-white" />
               </div>
               <div className="space-x-2">
                    <button onClick={e=>filterFood('food')} className="px-2 py-1 bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-hamburger "></i> อาหาร
                    </button>

                    <button onClick={e=>filterFood('drink')} className="px-2 py-1 bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-coffee "></i> เครื่องดื่ม
                    </button>

                    <button onClick={e=>filterFood('all')} className="px-2 py-1 bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-list "></i> ทั้งหมด
                    </button>

                    <button disabled={saleTemp.length === 0} onClick={e=>removeAllSaleTemp()} className=" disabled:bg-zinc-500 px-2 py-1 bg-red-500 hover:bg-red-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-trash "></i> ล้างรายการ
                    </button>
                    {amount > 0 ?
                    <button onClick={e=>printBillBeforePay()} className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 cursor-pointer rounded-3xl">
                            <i className="fa fa-print "></i> พิมพ์ใบแจ้งรายการ
                    </button>
                    :
                    <button disabled className="px-2 py-1 bg-gray-500  rounded-3xl">
                            <i className="fa fa-print "></i> พิมพ์ใบแจ้งรายการ
                    </button>}
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
                {(amount + amountAdded).toLocaleString("TH-th")+" .-"}
            </div>

            {amount >  0 ? 
            <button onClick={openModalEndSale} className="px-4 py-3 bg-green-600 w-full rounded-xl hover:bg-green-500 transition-colors duration-300 cursor-pointer ">
                <i className="fa fa-check me-2"></i>
                จบการขาย
            </button>
            :
            <button disabled className="px-4 py-3 bg-gray-600 w-full rounded-xl transition-colors duration-300 ">
                <i className="fa fa-check me-2"></i>
                จบการขาย
            </button>
        }
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
                            <button onClick={e=>removeSaleTemp(item.id)} className="px-4 py-2 hover:bg-red-400 bg-red-500 w-full rounded-3xl cursor-pointer"><i className="fa fa-times "></i>ยกเลิก</button>
                            <button onClick={e=>openModalEdit(item)} className="px-4 py-2 hover:bg-blue-400 bg-blue-500 w-full rounded-3xl cursor-pointer"><i className="fa fa-gear me-1"></i>แก้ไข</button>
                        </div>
                    </div>
                </div>
          )):<></>}
        </div>
            <Modal open={openEdit} onClose={closeModalEdit} title="แก้ไขรายการ" modalSize="max-w-5xl">
                <div className="space-y-3 ">
                   <div>
                    <button onClick={createSaleTempDetail} className="px-4 py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
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
                                    <button onClick={e=>removeSaleTempDetail(item.id)} className=" bg-red-500 hover:bg-red-400 transition-colors duration-300 rounded-md cursor-pointer">
                                        <i className="fa fa-times"></i>
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    {item.Food.name}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {tastes.map((tastes: Taste)=> (
                                        item.tasteId === tastes.id ?
                                        <button className="font-light px-1 border border-red-500 rounded-md bg-red-500 text-white hover:text-red-500 hover:border-red-500 hover:bg-transparent cursor-pointer transition-all duration-300" 
                                        onClick={e=> unSelectTaste(item.id, item.saleTempId)}
                                        key={tastes.id}>{tastes.name}
                                        </button>
                                        :
                                        <button 
                                        className="font-light border px-1 rounded-md border-red-500 text-red-500 hover:text-white hover:bg-red-500 cursor-pointer transition-all duration-300" 
                                        onClick={e=> selectTaste(tastes.id, item.id, item.saleTempId)}
                                        key={tastes.id}>{tastes.name}</button>
                                    ))}
                                </td>
                                  <td className="px-4 py-3 text-center">
                                    {sizes.map((sizes: FoodSize)=> (
                                        item.foodSizeId == sizes.id ?
                                         <button  
                                        onClick={e=> unSelectSize(item.id, item.saleTempId)}
                                        className="font-light border px-1 rounded-md border-green-500 bg-green-500 text-white hover:text-green-500 hover:border-green-500 hover:bg-transparent cursor-pointer transition-all duration-300" 
                                        key={sizes.id}>+{sizes.moneyAdded} {sizes.name}</button>
                                        :
                                        <button  
                                        onClick={e=> selectSize(sizes.id, item.id, item.saleTempId)}
                                        className="font-light border px-1 rounded-md border-green-500 text-green-500 hover:text-white hover:bg-green-500 cursor-pointer transition-all duration-300" 
                                        key={sizes.id}>+{sizes.moneyAdded} {sizes.name}</button>
                                    ))}
                                </td>
                            </tr>
                        )):<></>}
                    </tbody>
                   
            </table>



                </div>
            </Modal>

            <Modal open={openEndSale} onClose={closeModalEndSale} title="จบการขาย" >
                <div className="space-y-4">
                   <div>
                        <h3>รูปแบบการชำระเงิน</h3>
                        <div className="flex gap-4">
                            <button 
                            onClick={e=>setPayType("cash")}
                            className={
                                payType==="cash" ? 'w-full py-2 bg-gray-500 rounded-3xl cursor-pointer':
                                'w-full py-2 border border-gray-500 hover:bg-gray-500 rounded-3xl cursor-pointer'}>เงินสด</button>
                            <button 
                            onClick={e=>setPayType("transfer")}
                            className={
                                payType==="transfer" ? 'w-full py-2 bg-gray-500 rounded-3xl cursor-pointer':
                                'w-full py-2 border border-gray-500 hover:bg-gray-500 rounded-3xl cursor-pointer'}>เงินโอน</button>
                        </div>
                   </div>

                   <div>
                        <h3>ยอดเงิน</h3>
                        <input disabled className="w-full text-3xl focus:outline-0 rounded-3xl pr-3 py-2 bg-gray-700 text-end " value={(amount + amountAdded).toLocaleString("TH-th")+" .-"}  />
                   </div>

                   <div className="space-y-1">
                        <h3>รับเงิน</h3>
                        <div className="flex gap-1 pb-2">
                            <button 
                            onClick={e=> setInputMoney(50)}
                            className={inputMoney == 50 ? "w-full py-2 bg-gray-500 rounded-xl cursor-pointer": 
                            "w-full py-2 border border-gray-500 hover:bg-gray-500 rounded-xl cursor-pointer"}>50</button>

                            <button 
                            onClick={e=> setInputMoney(100)}
                            className={inputMoney == 100 ? "w-full py-2 bg-gray-500 rounded-xl cursor-pointer": 
                            "w-full py-2 border border-gray-500 hover:bg-gray-500 rounded-xl cursor-pointer"}>100</button>
                            
                            <button 
                            onClick={e=> setInputMoney(500)}
                            className={inputMoney == 500 ? "w-full py-2 bg-gray-500 rounded-xl cursor-pointer": 
                            "w-full py-2 border border-gray-500 hover:bg-gray-500 rounded-xl cursor-pointer"}>500</button>

                            <button 
                            onClick={e=> setInputMoney(1000)}
                            className={inputMoney == 1000 ? "w-full py-2 bg-gray-500 rounded-xl cursor-pointer": 
                            "w-full py-2 border border-gray-500 hover:bg-gray-500 rounded-xl cursor-pointer"}>1000</button>
                        </div>
                        <input 
                        value={inputMoney}
                        onChange={e=> setInputMoney(parseInt(e.target.value))}
                        type="number" className="w-full text-xl focus:outline-0 rounded-3xl pr-1 py-2  border text-end "  />
                   </div>

                    <div>
                        <h3>เงินทอน</h3>
                        <input disabled className="w-full text-3xl focus:outline-0 rounded-3xl pr-3 py-2 bg-gray-700 text-end " 
                        value={inputMoney - (amount + amountAdded)}  />
                   </div>

                   <div className="flex gap-4 ">
                        <button 
                        onClick={e=>setInputMoney(amount + amountAdded)}
                        className="w-full bg-blue-500 py-2 hover:bg-blue-600 cursor-pointer rounded-3xl ">จ่ายพอดี</button>
                        <button 
                        onClick={e=>endSale()}
                        className="w-full bg-green-500 py-2 hover:bg-green-600 cursor-pointer rounded-3xl ">จบการขาย</button>
                   </div>
                </div>
            </Modal>

            <button id="btnPrint" style={{display:"none"}} onClick={openModalBill}></button>
            <Modal open={openBill} onClose={closeModalBill} title="พิมพ์ใบแจ้งรายการ" >
                <div className="space-y-4">
                    <iframe src={`${config.pathImg}/${billUrl}`} className="w-full h-[600px]"></iframe>
                </div>
            </Modal>
        </div>
    )
}

export default Page;


