"use client";

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { FoodType } from "@/app/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [open, setOpen] = useState(false);
  const [foodTypes, setFoodTypes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }

  const fetchData = async () => {
    try{
      const res = await axios.get(config.apiUrl + "/food-type/list");
      setFoodTypes(res.data);
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

  const handleSave = async () => {
    try{
      const payload = {
        name:name,
        remark:remark,
        id:id
      };
      let res;
      if(id === 0){
          res = await axios.post(config.apiUrl + "/food-type/create", payload);
      }else{
          res = await axios.put(config.apiUrl + "/food-type/update/"+id, payload);
      }
      if(res.status == 201){
        toast.success("บันทึกข้อมูลสำเร็จ", { autoClose: 2000 });
        setId(0);
        closeModal();
        fetchData();
      }
    }catch(error: unknown){
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ",
          { autoClose: 2000 }
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  const handleRemove = async (item: FoodType) => {
    try{
      const button = await Swal.fire({
        title: "ลบข้อมูล",
        text: `คุณต้องการลบประเภท ${item.name} ใช่หรือไม่?`,
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      })

      if(button.isConfirmed){
        const res = await axios.delete(config.apiUrl + `/food-type/remove/${item.id}`);
        if(res.status == 200){
          toast.success("ลบข้อมูลสำเร็จ", { autoClose: 2000 });
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

const handleEdit =  (item: FoodType) => {
  setId(item.id);
  setName(item.name);
  setRemark(item.remark);
  openModal();
}

const clearForm = () => {
  setId(0);
  setName("");
  setRemark("");
}

 
  return (
    <>
     <div className="space-y-4">
         <h3 className="font-bold">ประเภทอาหาร</h3>
         <hr className="border-1 border-emerald-500"/>
      <div className="space-y-4">
        <button
          onClick={() => {clearForm(); openModal();}}
          className="px-4 py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
        >
          <i className="fa fa-plus me-2"></i>เพิ่มรายการ
        </button>
        
        <div>
          <table className="w-full border-collapse rounded-xl overflow-hidden">
                <thead className="bg-zinc-800 text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 text-left">ชื่อประเภทอาหาร/เครื่องดื่ม</th>
                    <th className="px-4 py-3 text-left">หมายเหตุ</th>
                    <th className="px-4 py-3 text-center">จัดการ</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                  {foodTypes.length > 0 ? (
                    foodTypes.map((item: FoodType) => (
                      <tr key={item.id} className="hover:bg-zinc-600 bg-zinc-700">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 text-zinc-400">
                          {item.remark || "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl cursor-pointer"
                              onClick={() => handleEdit(item)}
                            >
                              แก้ไข
                            </button>
                            <button
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-3xl cursor-pointer"
                              onClick={(e) => handleRemove(item)}
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-zinc-500">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  )}
                </tbody>
        </table>

        </div>
        <Modal open={open} onClose={closeModal} title="ประเภทอาหาร/เครื่องดื่ม">
          <div className="space-y-3">
            <input
              value={name}
              type="text"
              placeholder="ชื่อประเภทอาหาร/เครื่องดื่ม"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              value={remark}
              placeholder="หมายเหตุ"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className="flex justify-end mt-3">
                <button onClick={handleSave} className="px-4 py-2 rounded-3xl bg-emerald-700 hover:bg-emerald-600 text-white text-end cursor-pointer">
                บันทึก
                </button>
            </div>
          </div>
        </Modal>
      </div>
     </div>
    </>
  );
};

export default Page;
