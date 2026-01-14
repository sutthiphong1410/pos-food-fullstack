'use client'

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { BillSale, BillSaleDetail } from "@/app/type";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify/unstyled";
import Swal from "sweetalert2";

const Page = () => {
    const [billSales, setBillSales] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [sumAmount, setSumAmount] = useState(0);
    const [billSaleDetails, setBillSaleDetails] = useState<BillSaleDetail[]>([]);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const openModalBillSale = (billSaleDetails: BillSaleDetail[]) => {
        setBillSaleDetails(billSaleDetails)
        setShowDetailModal(true);
    }

    const closeModalBillSale = () => {
        setShowDetailModal(false);
    }

    const fetchData = async () => {
        try{
            const payload = {
                startDate:new  Date(dayjs(fromDate).format('YYYY-MM-DD') + " 00:00:00"),
                endDate: new Date(dayjs(toDate).format('YYYY-MM-DD') + " 23:59:59")
            };

            const res = await axios.post(config.apiUrl + "/bill-sale/list", payload);
            setBillSales(res.data);
            const sum = handleSumAmount(res.data);
            setSumAmount(sum);

        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
              toast.error(
                error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                { autoClose: 2000 }
              );
            } else {
              toast.error("Something went wrong");
            }
        }
    }

    const handleSumAmount = (data:BillSale[]) => {
        let sum = 0;
        data.forEach((item:BillSale) => {
            sum += item.amount;
        });
        return sum;
    }

    const handleRemove = async (id:number) => {
        try{
            const button = await Swal.fire({
                title: 'ยกเลิกบิล?',
                text: "คุณต้องการยกเลิกบิลนี้หรือไม่",
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true
                })

            if (button.isConfirmed) {

                const res = await axios.delete(config.apiUrl + "/bill-sale/remove/"+id);
                if(res.status == 200){
                    toast.success("ยกเลิกบิลสำเร็จ", { autoClose: 2000 });
                    fetchData();
                }
            }

        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
              toast.error(
                error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ",
                { autoClose: 2000 }
              );
            } else {
              toast.error("Something went wrong");
            }
        }
    }
    return (
        <>
          <div className="space-y-4">
            <h3 className="font-bold">รายงานการขาย</h3>
            <hr className="border-1 border-emerald-500"/>
            <div className="flex items-center gap-4 space-y-4">
                <div className="flex flex-col ">
                     <label className="text-sm font-semibold text-gray-300">จากวันที่</label>
                        <input 
                            value={dayjs(fromDate).format('YYYY-MM-DD')}
                            onChange={(e) => setFromDate(new Date(e.target.value))}
                            type="date"  
                            className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                  <div className="flex flex-col ">
                     <label className="text-sm font-semibold text-gray-300">ถึงวันที่</label>
                        <input 
                            value={dayjs(toDate).format('YYYY-MM-DD')}
                            onChange={(e) => setToDate(new Date(e.target.value))}
                            type="date"  
                            className="px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>
                
                <button
                onClick={fetchData}
                className="px-4 py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                >
                <i className="fa fa-search me-2"></i>แสดงรายงาน
                </button>
            </div>

               <table className="w-full border-collapse rounded-xl overflow-hidden">
                <thead className="bg-zinc-800 text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 text-center w-[300px]"></th>
                    <th className="px-4 py-3 text-center">วันที่</th>
                    <th className="px-4 py-3 text-start">รหัสบิล</th>
                    <th className="px-4 py-3 text-start">พนักงานขาย</th>
                    <th className="px-4 py-3 text-end">โต๊ะ</th>
                    <th className="px-4 py-3 text-end">ยอดขาย</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                    {billSales.length > 0 ? (
                        billSales.map((item: BillSale) => (
                            <tr key={item.id} className="hover:bg-zinc-600 bg-zinc-700">
                                <td className="px-4 py-3 text-center space-x-4">
                                    <button 
                                        onClick={() => handleRemove(item.id)}
                                        className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded-lg cursor-pointer">
                                        ยกเลิก
                                    </button>
                                    <button 
                                        onClick={() => openModalBillSale(item.billSaleDetails || [])}
                                        className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded-lg cursor-pointer">
                                        รายละเอียด
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">{dayjs(item.payDate).format('DD-MM-YYYY HH:mm:ss')}</td>
                                <td className="px-4 py-3 text-start">{item.id}</td>
                                <td className="px-4 py-3 text-start">{item.User?.name}</td>
                                <td className="px-4 py-3 text-end">{item.tableNo}</td>
                                <td className="px-4 py-3 text-end">{item.amount.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-6 text-center text-zinc-500">
                                ไม่มีข้อมูล
                            </td>
                        </tr>
                    )}
                    <tr className="bg-zinc-800 font-bold">
                        <td colSpan={5} className="px-4 py-3 text-end">รวมยอดขาย</td>
                        <td className="px-4 py-3 text-end">{sumAmount.toFixed(2)}</td>
                    </tr>
                </tbody>

                </table>
        </div>

        <Modal open={showDetailModal} onClose={closeModalBillSale} title="รายละเอียดบิลขาย">
            <div>
                <table className="w-full p-4 border-collapse rounded-xl overflow-hidden font-light">
                    <thead className="bg-zinc-800 text-zinc-300">
                        <tr>
                            <th className="text-start p-2">รายการ</th>
                            <th className="text-end">ราคา</th>
                            <th>รสชาติ</th>
                            <th>ขนาด</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                        {billSaleDetails.length > 0 ? (
                            billSaleDetails.map((item:BillSaleDetail) => (
                                 <tr key={item.id} className="hover:bg-zinc-600 bg-zinc-700">
                                    <td className="text-start p-2">{item.Food.name}</td>
                                    <td className="text-end">{(item.Food.price + (item.FoodSize ? item.FoodSize.moneyAdded : 0)).toFixed(2)}</td>
                                    <td className="text-center">{item.Taste ? item.Taste.name : ''}</td>
                                    <td className="text-center">{item.FoodSize ? item.FoodSize.name + " " + item.FoodSize.moneyAdded : ''}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-zinc-500">
                                    ไม่มีข้อมูล
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
        </>
    )
}

export default Page;