"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Page() {
  const [name] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("food_name") || " ";
  });
  const router = useRouter();

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
    <div className="shadow-xl bg-zinc-900  h-full rounded-xl text-white">
      <div className="py-8 flex flex-col items-center justify-center space-y-2">
        <div>logo</div>
        <h3 className="text-lg">{name}</h3>
        <p className="text-zinc-400 text-sm font-light">software developer</p>
        <button onClick={logout} className="bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-400"><i className="fa-solid fa-arrow-right-from-bracket "></i></button>
      </div>
      <div className="pl-7 font-light px-4">
        <ul>
          <Link href="/backoffice/foodType"><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-th"></i> ประเภทอาหาร</li></Link>
          <Link href="/backoffice/foodSize"><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-list"></i> ขนาดอาหาร</li></Link>
          <Link href="/backoffice/taste"><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-file-alt"></i> รสชาติอาหาร</li></Link>
          <Link href="/backoffice/food"><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-utensils"></i> อาหาร</li></Link>
          <Link href="/backoffice/sale"><li className="hover:bg-zinc-800 rounded-lg p-2 cursor-pointer"><i className="fa-solid fa-dollar-sign"></i> ขายสินค้า</li></Link>
        </ul>
      </div>
    </div>
  );
}
