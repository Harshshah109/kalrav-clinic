import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Wallet,
  MessageSquare,
  LogOut
} from 'lucide-react'

import {
  NavLink
} from 'react-router-dom'

import {
  logoutUser
} from '../../services/authService'

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

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[270px] bg-[#151515] border-r border-[#2b2b2b] flex-col justify-between">

      {/* Top */}
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5">

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
  )
}