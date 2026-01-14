'use client'

import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BillSale } from "@/app/type";

const Page = () => {
    const [arrYear, setArrYear] = useState<number[]>([]);
    const [arrMonth, setArrMonth] = useState(['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']);
    const [selectYear, setSelectYear] = useState<number>(new Date().getFullYear());
    const [selectMonth, setSelectMonth] = useState<number>(new Date().getMonth() + 1);
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchData();
        setArrYear(Array.from({ length: 5  }, (_, i) => dayjs().year() - i));
     
    }, []);

    const fetchData = async () => {
        try{
            const payload = {
                year: selectYear,
                month: selectMonth
            }
            const res = await axios.post(config.apiUrl+"/report/sumPerDayInYearAndMonth", payload);
            setData(res.data);
            setTotalAmount(sumTotalAmount(res.data));
        }catch (error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
            }else{
                toast.error("something went wrong");
            }
        }
    }

    const sumTotalAmount = (data: any[]) => {
        let sum = 0;

        data.forEach((item:any) => {
            sum += item.amount;
        })

        return sum;
    }
    return (
        <>
             <div className="space-y-4">
                <h3 className="font-bold">สรุปยอดขายรายวัน</h3>
                <hr className="border-1 border-emerald-500"/>
                   <div className="flex items-center gap-4 space-y-4">
                               <div className="flex flex-col ">
                                    <label className="text-sm font-semibold text-gray-300">ปี</label>
                                     <select value={selectYear} onChange={e=>setSelectYear(parseInt(e.target.value))}
                                     className="px-4 py-2 cursor-pointer rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                                        {arrYear.map((year) => (
                                            <option 
                                            key={year} 
                                            value={year}
                                            >
                                                {year}
                                            </option>
                                        ))}
                                     </select>
                               </div>
               
                                 <div className="flex flex-col ">
                                      <label className="text-sm font-semibold text-gray-300">เดือน</label>
                                     <select value={selectMonth} onChange={e=>setSelectMonth(parseInt(e.target.value))}
                                     className="px-4 py-2 cursor-pointer rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                                        {arrMonth.map((month, index) => (
                                            <option 
                                            key={index} 
                                            value={index + 1}
                                            >
                                                {month}
                                            </option>
                                        ))}
                                     </select>
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
                                <th className="px-4 py-3 text-start">วันที่</th>
                                <th className="px-4 py-3 text-end w-[150px]">ยอดขายรวม</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                            {data.length > 0 ? (
                                data.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-zinc-600 bg-zinc-700">
                                        <td className="px-4 py-3 text-start">{dayjs(item.date).format('DD')}</td>
                                        <td className="px-4 py-3 text-end">{item.amount.toLocaleString('th-TH')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-4 py-3 text-center">ไม่มีข้อมูลรายงาน</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-zinc-800 text-zinc-300">
                            <tr>
                                <th className="px-4 py-3 text-end">รวมยอดขายทั้งหมด</th>
                                <th className="px-4 py-3 text-end">{totalAmount.toLocaleString('th-TH')}</th>
                            </tr>
                        </tfoot>
                    </table>
               
            </div> 
        </>
    )
}

export default Page;

