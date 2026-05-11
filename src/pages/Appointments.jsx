import {
  MessageSquare,
  Search
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import {
  getAppointments
} from '../services/appointmentService'

export default function Appointments() {

  const [appointments, setAppointments] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {

    const data =
      await getAppointments()

    setAppointments(data)
  }

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold mb-2">
          Appointments
        </h1>

        <p className="text-zinc-400">
          Daily schedule and appointments
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <div className="flex-1 bg-[#171717] border border-[#2f2f2f] rounded-2xl px-4 h-14 flex items-center gap-3">

          <Search
            size={18}
            className="text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-transparent outline-none w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="bg-[#171717] border border-[#2f2f2f] rounded-2xl px-4 h-14 outline-none"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Appointment List */}
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

        <div className="space-y-4">

          {appointments
            .filter((item) => {

              const matchesSearch =
                item.patient
                  ?.toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )

              const matchesStatus =
                statusFilter === 'All'
                  ? true
                  : item.status === statusFilter

              return (
                matchesSearch &&
                matchesStatus
              )
            })
            .map((item) => (

            <div
              key={item.id}
              className={`border rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5 ${
                item.status === 'Cancelled'
                  ? 'border-red-500/30 opacity-50'
                  : 'border-[#313131]'
              }`}
            >

              <div className="min-w-[140px]">

                <h3 className="text-xl font-bold text-white">
                  {item.time}
                </h3>

                <p className="text-sm text-zinc-500 mt-1">
                  {item.date}
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-[#dffff2] text-black flex items-center justify-center font-bold text-lg uppercase">
                {(item.patient || 'PT').slice(0, 2)}
              </div>

              <div className="flex-1">

                <h3 className="text-xl font-bold mb-1">
                  {item.patient || 'Patient'}
                </h3>

                <p className="text-zinc-400">
                  {item.therapy || 'Speech Therapy'} • {item.therapist || 'Therapist'} • {item.duration || '30 min'}
                </p>
              </div>

              <div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    item.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <button className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222]">
                <MessageSquare size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}