'use client'

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { FoodSize, FoodType } from "@/app/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [remark, setRemark] = useState("");
    const [moneyAdded, setMoneyAdded] = useState(0);
    const [id, setId] = useState(0);
    const [foodTypeId, setFoodTypeId] = useState(0);
    const [foodTypes, setFoodTypes] = useState([]);
    const [foodSizes, setFoodSizes] = useState([]);

    useEffect(() => {
        fetchFoodTypes()
        fetchFoodSizes()
    }, []);

    const fetchFoodTypes = async () => {
        try{
            const res = await axios.get(config.apiUrl + "/food-type/list");
            setFoodTypes(res.data);
        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                  { autoClose: 2000 }
                );
              
            }else{
              toast.error("Something went wrong");
            }
        }
    }

    const fetchFoodSizes = async () => {
        try{
            const res = await axios.get(config.apiUrl + "/food-size/list");
            setFoodSizes(res.data);

        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ",
                  { autoClose: 2000 }
                );
            }else{
              toast.error("Something went wrong");
            }
        }
    }

    const save = async () => { 
        try{
            const payload = {
                foodTypeId:foodTypeId,
                name:name,
                moneyAdded:moneyAdded,
                remark:remark,
                id:id
            };
            let res;
            if(id == 0){
                res = await axios.post(config.apiUrl + "/food-size/create", payload);
            }else{
                res = await axios.put(config.apiUrl + "/food-size/update", payload);
            }
            if(res.status == 201){
                toast.success("บันทึกข้อมูลสำเร็จ", { autoClose: 2000 });
                setId(0);
                fetchFoodSizes();
                closeModal();
            }
        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ",
                  { autoClose: 2000 }
                );
            }else{
              toast.error("Something went wrong");
            }
        }
    }

    const handleRemove = async (item: FoodSize) => {
        try{
           const button = await Swal.fire({
                title: 'ลบข้อมูล',
                text: "คุณต้องการลบข้อมูลใช่หรือไม่?",
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,});
            if(button.isConfirmed){
                const res = await axios.delete(config.apiUrl + "/food-size/remove/"+item.id);
                if(res.status == 200){
                    toast.success("ลบข้อมูลสำเร็จ", { autoClose: 2000 });
                    fetchFoodSizes();
                }
            }
        }catch(error: unknown){
            if (axios.isAxiosError(error)) {
                toast.error(
                  error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ",
                  { autoClose: 2000 }
                );
            }else{
              toast.error("Something went wrong");
            }
        }
    }

    const handleEdit = (item: FoodSize) => {
        setId(item.id);
        setName(item.name);
        setRemark(item.remark);
        setMoneyAdded(item.moneyAdded);
        setFoodTypeId(item.foodTypeId);
        openModal();
    }

    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    const clearForm = () => {
        setId(0);
        setName("");
        setRemark("");
        setMoneyAdded(0);
        setFoodTypeId(0);
    }
    return (
        <>
        <div className="space-y-4">
            <h3 className="font-bold">ขนาดอาหาร</h3>
            <hr className="border-1 border-emerald-500"/>
                <div className="space-y-4">
                    <button onClick={()=>{openModal(); clearForm();}} className="px-4 py-2 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                        <i className="fa fa-plus me-2"></i>เพิ่มรายการ
                    </button>

                    <div>
                        <table className="w-full border-collapse rounded-xl overflow-hidden">
                          <thead className="bg-zinc-800 text-zinc-300">
                            <tr>
                              <th className="px-4 py-3 text-left">ชื่อประเภทอาหาร/เครื่องดื่ม</th>
                              <th className="px-4 py-3 text-left">ขนาด</th>
                              <th className="px-4 py-3 ">หมายเหตุ</th>
                              <th className="px-4 py-3 text-end">คิดเงินเพิ่ม</th>
                              <th className="px-4 py-3 text-center">จัดการ</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                            {foodSizes.length > 0 ? (
                              foodSizes.map((item: FoodSize) => (
                                <tr key={item.id} className="hover:bg-zinc-600 bg-zinc-700">
                                  <td className="px-4 py-3">{item.FoodType?.name || "-"}</td>
                                  <td className="px-4 py-3">{item.name}</td>
                                  <td className="px-4 py-3 text-zinc-400">
                                    {item.remark || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-end">
                                    {item.moneyAdded.toLocaleString("TH-th") || "-"}
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
                                <td colSpan={5} className="py-6 text-center text-zinc-500">
                                  ไม่มีข้อมูล
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                    </div>
                </div>
        </div>

        <Modal open={isOpen} onClose={closeModal} title="ขนาดอาหาร/เครื่องดื่ม">
           <div className="space-y-3">
            <select className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white" value={foodTypeId} onChange={(e) => setFoodTypeId(Number(e.target.value))}>
                <option value="">เลือกประเภทอาหาร/เครื่องดื่ม</option>
                 {foodTypes.map((item: FoodType) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                 ))}
            </select>
            <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                type="text"
                placeholder="ขนาด"
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
            />

            <input
            value={moneyAdded}
                onChange={(e)=>setMoneyAdded(Number(e.target.value))}
                type="text"
                placeholder="คิดเงินเพิ่ม (บาท)"
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
            />


            <textarea 
                value={remark}
                onChange={(e)=>setRemark(e.target.value)}
                placeholder="หมายเหตุ" 
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white" 
            />
            <div className="flex justify-end mt-3">
                <button onClick={save} className="px-4 py-2 rounded-3xl bg-emerald-700 hover:bg-emerald-600 text-white text-end cursor-pointer">
                บันทึก
                </button>
            </div>
          </div>
        </Modal>
        </>
    )
}

export default Page;

