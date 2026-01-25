"use client"
import { useState } from "react";
import Sidebar from "../components/Sidebar/page";


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    const [open, setOpen] = useState(false);
 



    return (
      <div className="min-h-screen bg-linear-to-tr from-zinc-800 to-zinc-950">
      <div className="flex-col lg:flex">

      <div className="lg:hidden p-3 flex items-center justify-end">
        <button onClick={() => setOpen(true)} className={open == true ? "hidden":"block"}>
          <i className="fa-solid fa-bars text-white text-xl"></i>
        </button>
      </div>
        {open && (
          <div className="fixed inset-0 z-50 bg-black/40"  onClick={() => setOpen(false)}>
            <div className="w-64 h-full bg-zinc-900 p-4"    onClick={(e) => e.stopPropagation()} >
              <Sidebar onSelect={() => setOpen(false)} />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}


        {/* Sidebar */}
        <aside className="
          fixed z-40 rounded-3xl h-lvh w-64
          bg-zinc-900
          hidden lg:block
        ">
          <Sidebar />
        </aside>



    
        {/* Main */}
        <main className="
          flex-1
          lg:ml-64
          p-3
          
        ">
          <div className="bg-zinc-900 rounded-xl p-6 shadow-2xl text-white ">
            {children}
          </div>
        </main>
      </div>
    </div>
    
    )
}

export default Layout;