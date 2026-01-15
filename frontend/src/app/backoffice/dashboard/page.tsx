'use client'

import config from "@/app/config";
import axios from "axios";
import { Chart } from "chart.js/auto";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [incomePerDays, setIncomePerDays] = useState<any[]>([]);
    const [incomePerMonths, setIncomePerMonths] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);

    const [monthNames] = useState<string[]>([
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']);

    const [days, setDays] = useState<number[]>([]);
    const [year, setYear] = useState<number>(dayjs().year());
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());   
    const [month, setMonth] = useState<number>(dayjs().month() + 1);
    const [chartPerDay, setChartPerDay] = useState<Chart | null>(null);
    const [chartPerMonth, setChartPerMonth] = useState<Chart | null>(null);

    useEffect(() => {
        const totalDayInMonth = dayjs().daysInMonth();
        setDays(Array.from({ length: totalDayInMonth }, (_, i) => i + 1));
        setYears(Array.from({ length: 5 }, (_, i) => dayjs().year() - i));
    },[])

    const fetchData = async () => {
        fetchDataSumPerDayInYearAndMonth();
        fetchDataSumPerMonthInYear();
    }

    const createBarChartDays = (incomePerDays: any[]) => {
        const labels: number[] = [];
        const data: number[] = [];

        for(let i=0; i<incomePerDays.length; i++){
            const item = incomePerDays[i];
            labels.push(dayjs(item.date).date());
            data.push(item.amount);
        }

        const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement;
        if(chartPerDay){
            chartPerDay.destroy();
        }

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'รายได้ต่อวัน (บาท)',
                    data: data,
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        setChartPerDay(chart);
    }

    const fetchDataSumPerDayInYearAndMonth = async () => {
        try{
            const payload = {
                year: selectedYear,
                month: month
            }

            const token = localStorage.getItem("token") || "";

            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.post(config.apiUrl+"/report/sumPerDayInYearAndMonth", payload, { headers });
            setIncomePerDays(res.data);
            createBarChartDays(res.data);
        }catch (error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
            }else{
                toast.error("something went wrong");
            }
        }
    }

    const createBarChartMonths = (incomePerMonths: any[]) => {
        const datas: number[] =[];

        for(let i=0; i<incomePerMonths.length; i++){
            const item = incomePerMonths[i];
            datas.push(item.amount);
        }

        const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement;

        if(chartPerMonth){
            chartPerMonth.destroy();
        }

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'รายได้ต่อเดือน (บาท)',
                    data: datas,
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        setChartPerMonth(chart);
    }

    const fetchDataSumPerMonthInYear = async () => {
        try{
            const payload = {
                year: selectedYear
            }
            const token = localStorage.getItem("token") || "";

            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.post(config.apiUrl+"/report/sumPerMonthInYear", payload, { headers });
            setIncomePerMonths(res.data);
            createBarChartMonths(res.data);
        }catch (error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
            }else{
                toast.error("something went wrong");
            }
        }

    }

    return (
        <>
            <div className="space-y-4">
                <h3 className="font-bold">Dashboard</h3>
                <hr className="border-1 border-emerald-500"/>
                

                <div className="flex items-center gap-4 space-y-4">
                               <div className="flex flex-col ">
                                    <label className="text-sm font-semibold text-gray-300">ปี</label>
                                     <select value={selectedYear} onChange={e=>setSelectedYear(parseInt(e.target.value))}
                                     className="px-4 py-2 cursor-pointer rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                                        {years.map((year) => (
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
                                     <select value={month} onChange={e=>setMonth(parseInt(e.target.value))}
                                     className="px-4 py-2 cursor-pointer rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
                                        {monthNames.map((monthName, index) => (
                                            <option 
                                            key={index} 
                                            value={index + 1}
                                            >
                                                {monthName}
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

                <div>
                    <h3 className="text-xl">สรุปยอดขายตามวัน</h3>
                    <canvas id="chartPerDay" height={120}></canvas>
                </div>

                <div>
                    <h3 className="text-xl">สรุปยอดขายตามเดือน</h3>
                    <canvas id="chartPerMonth" height={120}></canvas>
                </div>
            </div>
        </>
    )
}

export default Page;