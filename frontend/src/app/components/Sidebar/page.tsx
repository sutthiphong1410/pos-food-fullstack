"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

type SidebarProps = {
  onSelect?: () => void;
};

export default function Page({ onSelect }: SidebarProps) {
  const [name,setName] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("food_name") || " ";
  });
  const router = useRouter();
  const [userLevel, setUserLevel] = useState<string>("");

  useEffect(()=>{
    const name = localStorage.getItem("food_name") || "";
    setName(name);

    getUserLevel();
  }, [])

  const getUserLevel = async () => {
    try{
      const token = localStorage.getItem("token") || "";
      const headers = {
          'Authorization': `Bearer ${token}`
      }
      const res = await axios.get("http://localhost:3001/api/user/getLevelByToken", { headers });
      setUserLevel(res.data.level);

    }catch (error: unknown) {
      if(axios.isAxiosError(error)){
          toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน"),
          {autoClose: 2000}
      }else{
          toast.error("something went wrong", {autoClose: 2000});
      }
    }
  }

  const logout = async () => {
    try{
        const button = await Swal.fire({
        title: 'ออกจากระบบ?',
        text: "คุณต้องการออกจากระบบหรือไม่",
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true
        })
        if (button.isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("food_name");
            localStorage.removeItem("food_id");
           router.push("/login");
        }
    }catch (error: unknown) {
        toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  }

  return (
    <div className="shadow-xl bg-zinc-900  h-full rounded-xl text-white overflow-y-auto">
      <div className="py-8 flex flex-col items-center justify-center space-y-2">
        
        <h3 className="text-lg">
          <i className="fa fa-user"></i>{name}
        </h3>
        
        <button onClick={logout} className="bg-red-500 rounded-full px-2 py-1 cursor-pointer hover:bg-red-400"><i className="fa-solid fa-arrow-right-from-bracket "></i></button>
      </div>
      <div className="pl-7 font-light px-4">
        <ul>
         {userLevel === "admin" && (
           <Link href="/backoffice/dashboard" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-tachometer-alt"></i> Dashboard</li></Link>)}

         
           <Link href="/backoffice/sale" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-dollar-sign"></i> ขายสินค้า</li></Link>
          {userLevel === "admin" && (
          <>
              <Link href="/backoffice/foodType" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-th"></i> ประเภทอาหาร</li></Link>
          <Link href="/backoffice/foodSize" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-list"></i> ขนาดอาหาร</li></Link>
          <Link href="/backoffice/taste" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-file-alt"></i> รสชาติอาหาร</li></Link>
          <Link href="/backoffice/food" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-utensils"></i> อาหาร</li></Link>
          <Link href="/backoffice/user" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-users"></i> ผู้ใช้งาน</li></Link>
          <Link href="/backoffice/organization" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-building"></i> ข้อมูลร้าน</li></Link>
          <Link href="/backoffice/report-bill-sale" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-file-alt"></i> รายงานการขาย</li></Link>
          <Link href="/backoffice/report-sum-sale-per-day" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-calendar"></i> สรุปยอดขายตามวัน</li></Link>
          <Link href="/backoffice/report-sum-sale-per-month" onClick={onSelect}><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-calendar"></i> สรุปยอดขายตามเดือน</li></Link>
          </>)}
        </ul>
      </div>
    </div>
  );
}
