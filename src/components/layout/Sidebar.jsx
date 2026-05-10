import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Wallet,
  MessageSquare,
  LogOut,
  X
} from 'lucide-react'

import {
  NavLink
} from 'react-router-dom'

import {
  logoutUser
} from '../../services/authService'

import {
  useState
} from 'react'

const navSections = [
  {
    title: 'MAIN',
    items: [
      {
        name: 'Dashboard',
        path: '/',
        icon: LayoutDashboard
      },
      {
        name: 'Appointments',
        path: '/appointments',
        icon: CalendarDays
      },
      {
        name: 'Calendar',
        path: '/calendar',
        icon: CalendarDays
      },
      {
        name: 'Patients',
        path: '/patients',
        icon: Users
      }
    ]
  },
  {
    title: 'CLINIC',
    items: [
      {
        name: 'Therapists',
        path: '/therapists',
        icon: Stethoscope
      },
      {
        name: 'Payments',
        path: '/payments',
        icon: Wallet
      },
      {
        name: 'Messages',
        path: '/messages',
        icon: MessageSquare
      }
    ]
  }
]

export default function Sidebar() {

  const [openMobile,
    setOpenMobile] =
      useState(false)

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#151515]/95 backdrop-blur-xl border-b border-[#2b2b2b] flex items-center justify-between px-5">

        <h1 className="text-2xl font-bold">
          Kalrav
        </h1>

        <button
          onClick={() =>
            setOpenMobile(true)
          }
          className="w-11 h-11 rounded-xl border border-[#333] flex items-center justify-center"
        >

          <div className="flex flex-col gap-1">

            <div className="w-5 h-[2px] bg-white rounded-full"></div>

            <div className="w-5 h-[2px] bg-white rounded-full"></div>

            <div className="w-5 h-[2px] bg-white rounded-full"></div>
          </div>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {openMobile && (

        <div className="md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm">

          <div className="w-[85%] max-w-[320px] h-full bg-[#151515] border-r border-[#2a2a2a] flex flex-col justify-between">

            {/* Top */}
            <div>

              {/* Header */}
              <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">

                <div>

                  <h1 className="text-3xl font-bold">
                    Kalrav
                  </h1>

                  <p className="text-zinc-500 text-sm mt-1">
                    Speech Therapy Clinic
                  </p>
                </div>

                <button
                  onClick={() =>
                    setOpenMobile(false)
                  }
                  className="w-10 h-10 rounded-xl border border-[#333] flex items-center justify-center"
                >

                  <X size={18} />
                </button>
              </div>

              {/* MOBILE NAV */}
              <div className="p-4">

                {navSections.map((section) => (

                  <div
                    key={section.title}
                    className="mb-6"
                  >

                    <p className="text-xs text-zinc-500 tracking-[0.2em] mb-4">

                      {section.title}
                    </p>

                    <div className="space-y-2">

                      {section.items.map((item) => (

                        <NavLink
                          key={item.name}
                          to={item.path}
                          end={item.path === '/'}
                          onClick={() =>
                            setOpenMobile(false)
                          }
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all ${
                              isActive
                                ? 'bg-[#1d1d1d] border-white text-white'
                                : 'border-[#343434] text-zinc-300 hover:bg-[#1d1d1d]'
                            }`
                          }
                        >

                          <item.icon size={18} />

                          <span className="font-medium">
                            {item.name}
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-[#2a2a2a]">

              <button
                onClick={logoutUser}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border border-[#343434] hover:bg-[#1d1d1d] transition-all text-zinc-300"
              >

                <LogOut size={18} />

                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[270px] bg-[#151515] border-r border-[#2b2b2b] flex-col justify-between">

        <div>

          {/* Logo */}
          <div className="p-6 border-b border-[#2a2a2a]">

            <div className="flex items-center gap-2">

              <div className="w-3 h-3 rounded-full bg-emerald-300"></div>

              <h1 className="text-3xl font-bold tracking-tight">
                Kalrav
              </h1>
            </div>

            <p className="text-zinc-400 text-sm mt-2">
              Speech Therapy Clinic
            </p>
          </div>

          {/* DESKTOP NAV */}
          <div className="px-4 py-5">

            {navSections.map((section) => (

              <div
                key={section.title}
                className="mb-6"
              >

                <p className="text-xs text-zinc-500 tracking-[0.2em] mb-4">

                  {section.title}
                </p>

                <div className="space-y-2">

                  {section.items.map((item) => (

                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-200 ${
                          isActive
                            ? 'bg-[#1d1d1d] border-white text-white'
                            : 'border-[#343434] text-zinc-300 hover:bg-[#1d1d1d]'
                        }`
                      }
                    >

                      <item.icon size={18} />

                      <span className="font-medium">
                        {item.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[#2a2a2a]">

          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl border border-[#343434] hover:bg-[#1d1d1d] transition-all text-zinc-300"
          >

            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>
      {/* MOBILE BOTTOM NAV */}
<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 bg-[#151515]/95 backdrop-blur-xl border-t border-[#2b2b2b] flex items-center justify-around px-2">

  {[
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: CalendarDays
    },
    {
      name: 'Patients',
      path: '/patients',
      icon: Users
    },
    {
      name: 'Payments',
      path: '/payments',
      icon: Wallet
    }
  ].map((item) => (

    <NavLink
      key={item.name}
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 text-xs ${
          isActive
            ? 'text-white'
            : 'text-zinc-500'
        }`
      }
    >

      <item.icon size={20} />

      <span>
        {item.name}
      </span>
    </NavLink>
  ))}
</div>
    </>
  )
}