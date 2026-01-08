import Sidebar from "../components/Sidebar/page";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {


    return (
        <div className="min-h-screen bg-linear-to-tr from-zinc-800 to-zinc-950 p-3 flex gap-3">
           <div className="w-2/12 fixed top-3 left-0 right-0 bottom-2">
            <Sidebar/>
           </div>
           <div className="p-6 w-10/12 ml-64 bg-zinc-900 rounded-xl shadow-2xl text-white space-y-3">
            {children}
           </div>
           
        </div>
    )
}

export default Layout;