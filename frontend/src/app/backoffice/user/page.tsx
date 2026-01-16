'use client'

import Modal from "@/app/components/Modal/page";
import config from "@/app/config";
import { User } from "@/app/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
    const [users, setUsers] = useState<User[]>([])
    const [id, setId] = useState(0) 
    const [name, setName] = useState("")
    const [level, setLevel] = useState<string[]>(["admin", "user"])
    const [levelSelected, setLevelSelected] = useState<string>("admin")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [currentUserId, setCurrentUserId] = useState(0)

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setCurrentUserId(parseInt(localStorage.getItem("food_id") || "0"));
        fetchData()
    }, [])

    const openModal = () => {
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
    }

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl+'/user/list')
            setUsers(res.data)
        }catch (error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน"),
                {autoClose: 2000}
            }else{
                toast.error("something went wrong", {autoClose: 2000});
            }
        }
    }

    const handleSave = async () => {
        try{
            const payload = {
                name:name,
                username:username,
                password:password,
                level:levelSelected,
                id:id
            }

            let res

            if(id === 0){
                res = await axios.post(config.apiUrl+'/user/create', payload)
            }else{
                res = await axios.put(config.apiUrl+'/user/update', payload)
            }

           if(res.status === 201){
                toast.success("บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว", {autoClose: 2000});
                setId(0)
                fetchData()
                closeModal()

           }

        }catch (error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้งาน"),
                {autoClose: 2000}
            }else{
                toast.error("something went wrong", {autoClose: 2000});
            }
        }
    }

    const handleClearForm = () => {
        setName("")
        setUsername("")
        setPassword("")
        setLevelSelected("admin")
    }

    const handleEdit = (id:number) => {
        setId(id)

        const user = users.find((item:User) => item.id === id)
        if(user){
            setName(user?.name || "")
            setUsername(user?.username || "")
            setLevelSelected(user?.level || "")
            setPassword(user?.password || "")
        }
        openModal()
    }

    const handleDelete = async (id:number) => {
        try{
            const button = await Swal.fire({
                title: 'ลบข้อมูล',
                text: "คุณต้องการลบข้อมูลผู้ใช้งานหรือไม่",
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (button.isConfirmed) {
                const res = await axios.delete(config.apiUrl+`/user/remove/${id}`)
                if(res.status === 201){
                    toast.success("ลบข้อมูลผู้ใช้งานเรียบร้อยแล้ว", {autoClose: 2000});
                    fetchData()
                }
            }

        }catch (error: unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้งาน"),
                {autoClose: 2000}
            }else{
                toast.error("something went wrong", {autoClose: 2000});
            }
        }
    }
    return (
        <>
             <div className="space-y-4">
                <h3 className="font-bold">ผู้ใช้งาน</h3>
                <hr className="border-1 border-emerald-500"/>
                <div className="space-y-4">
                    <button 
                    onClick={() => { handleClearForm(); openModal(); }}
                    className="btn-add">
                    <i className="fa fa-plus me-2"></i>เพิ่มรายการ
                    </button>
                </div>

                <table className="table">
                            <thead >
                                <tr>
                                    <th className="text-left">ชื่อ</th>
                                    <th className="text-left">username</th>
                                    <th>ระดับผู้ใช้งาน</th>
                                    <th className="text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item:User) => (
                                    <tr key={item.id} className={item.id === currentUserId ? "bg-zinc-700" : ""}>
                                        <td>{item.name}</td>
                                        <td>{item.username}</td>
                                        <td className="text-center">{item.level}</td>
                                        <td className="flex justify-center text-center gap-1">
                                            <button 
                                            onClick={() => handleEdit(item.id)}
                                            className="btn-edit">
                                             แก้ไข
                                            </button>
                                            <button
                                            onClick={() => handleDelete(item.id)}
                                            className="btn-delete">
                                             ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                </table>

                <Modal open={open} onClose={closeModal} title="เพิ่มข้อมูลผู้ใช้งาน">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="block">ชื่อ</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"/>
                    </div>
                    <div className="space-y-1">
                        <label className="block">ระดับผู้ใช้งาน</label>
                        <select 
                        value={levelSelected}
                        onChange={(e) => setLevelSelected(e.target.value)}
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white">
                           {level.map((item:string, index:number) => (
                            <option key={index} value={item}>{item}</option>
                           ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block">username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"/>
                    </div>
                    <div className="space-y-1">
                        <label className="block">รหัสผ่าน</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"/>
                    </div>

                     <div className="flex justify-end mt-3">
                        <button onClick={handleSave} className="px-4 py-2 rounded-3xl bg-emerald-700 hover:bg-emerald-600 text-white text-end cursor-pointer">
                            บันทึก
                        </button>
                    </div>
                </div>
                </Modal>
            </div>

        </>
    )
}

export default Page;