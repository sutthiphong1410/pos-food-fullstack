'use client'

import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [arrYear, setArrYear] = useState<number[]>([]);
    const [selectYear, setSelectYear] = useState<number>(new Date().getFullYear());
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchData();
        setArrYear(Array.from({ length: 10  }, (_, i) => dayjs().year() - i));
     
    }, []);

    const fetchData = async () => {
        try{
            const payload = {
                year: selectYear
            }
            const token = localStorage.getItem("token") || "";

            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.post(config.apiUrl+"/report/sumPerMonthInYear", payload, { headers });
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
                <h3 className="font-bold">สรุปยอดขายตามเดือน</h3>
                <hr className="border-1 border-emerald-500"/>
                   <div className="flex items-center gap-4 space-y-4">
                               <div className="flex flex-col ">
                                    <label className="text-[15px] md:text-sm font-semibold text-gray-300">ปี</label>
                                     <select value={selectYear} onChange={e=>setSelectYear(parseInt(e.target.value))}
                                     className="md:px-4 md:py-2 cursor-pointer rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
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
                               
                                 <button
                               onClick={fetchData}
                               className="px-4 py-1 md:py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                               >
                               <i className="fa fa-search md:me-2"></i>
                               <p className="hidden md:inline">แสดงรายงาน</p>
                               </button>
                    </div>

                    <table className="table">
                        <thead >
                            <tr>
                                <th className="text-start">เดือน</th>
                                <th className="text-end w-[150px]">ยอดขายรวม</th>
                            </tr>
                        </thead>
                        <tbody >
                            {data.length > 0 ? (
                                data.map((item: any) => (
                                    <tr key={item.id} >
                                        <td className="text-start">{dayjs(item.month).format('MM')}</td>
                                        <td className="text-end">{item.amount.toLocaleString('th-TH')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center">ไม่มีข้อมูลรายงาน</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-zinc-800 text-zinc-300">
                            <tr>
                                <th className="px-1 py-2 md:px-4 md:py-3 text-end text-[10px] md:text-base">รวมยอดขายทั้งหมด</th>
                                <th className="px-1 py-2 md:px-4 md:py-3 text-end text-[10px] md:text-base">{totalAmount.toLocaleString('th-TH')}</th>
                            </tr>
                        </tfoot>
                    </table>
               
            </div> 
        </>
    )
}

export default Page;

