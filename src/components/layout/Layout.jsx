import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'

export default function Layout() {

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-[270px] p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}