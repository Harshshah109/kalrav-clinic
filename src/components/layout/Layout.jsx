import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'

export default function Layout({
  role
}) {

  return (
    <div className="min-h-screen bg-[#f6f4ff] text-[#111827]">

      {/* SIDEBAR */}
      <Sidebar role={role} />

      {/* MAIN */}
      <main
        className="
          md:ml-[270px]
          pt-20
          md:pt-0
          pb-24
          md:pb-8
          p-4
          md:p-8
        "
      >

        <div
          className="
            min-h-[calc(100vh-40px)]
            rounded-[36px]
            bg-white/65
            backdrop-blur-xl
            border border-white/70
            shadow-[0_10px_40px_rgba(124,58,237,0.08)]
            p-5
            md:p-8
          "
        >

          <Outlet />

        </div>
      </main>
    </div>
  )
}