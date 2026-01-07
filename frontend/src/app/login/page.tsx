"use client";

import config from "@/app/config";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const login = async () => {
    try {

      const payload = { username, password };
      const res = await axios.post(config.apiUrl + "/user/login", payload);
      if (res.data.token !== undefined) {
        toast.success("เข้าสู่ระบบสำเร็จ", { autoClose: 2000 });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("food_name", res.data.name);
        localStorage.setItem("food_id", res.data.id);
        
        router.push("/backoffice");
      } else {
        toast.error(res.data.message, { autoClose: 2000 });
      }
      
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Login failed",
          { autoClose: 2000 }
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="w-screen bg-linear-to-br from-zinc-900 to-zinc-950">
      <div className="flex flex-col py-15 items-center  min-h-screen ">
        <div className="bg-zinc-900 rounded-lg shadow-md w-10/12 space-y-18 ">

        
        <div className="flex justify-center items-start pt-5  ">
          <Image src={logo} alt="Logo" width={150} height={150} />
        </div>

            <div className="flex flex-col justify-center items-center space-y-4">
            
              <h2 className="text-3xl text-center mb-4 font-semibold">เข้าสู่ระบบ</h2>
              <p className="text-center mb-4 font-light text-gray-500">Welcome back to Admin</p>

              <div className="">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full font-light pr-40 py-2 border-b focus:outline-0"
                  placeholder="Username"
                />
              </div>
              <div className="">
                <input

                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full font-light pr-40 py-2 border-b focus:outline-0"
                  placeholder="Password"
                />
              </div>
              <div className="flex justify-center items-center  py-2">
                <button
                  onClick={login}
                  className="font-light rounded-3xl cursor-pointer px-18 bg-emerald-500 text-black py-2 hover:bg-emerald-600 transition duration-300"
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 py-12 text-xs font-light text-gray-500">
              <p className="hover:underline cursor-pointer">Term & Conditions</p>
              <p className="hover:underline cursor-pointer">Privacy Policy</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
