import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'

export default function Layout({
  role
}) {

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main */}
      <main className="md:ml-[270px] pt-20 md:pt-0 pb-24 md:pb-6 p-4 md:p-8">

        <Outlet />
      </main>
    </div>
  )
}