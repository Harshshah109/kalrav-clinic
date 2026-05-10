import {
  useEffect,
  useState
} from 'react'

import Calendar
  from 'react-calendar'

import {
  CalendarDays,
  Clock3,
  UserRound
} from 'lucide-react'

import {
  getAppointments
} from '../services/appointmentService'

export default function CalendarPage() {

  const [date, setDate] =
    useState(new Date())

  const [appointments, setAppointments] =
    useState([])

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments =
    async () => {

      const data =
        await getAppointments()

      setAppointments(data)
    }

  const selectedDate =
  `${date.getFullYear()}-${
    String(
      date.getMonth() + 1
    ).padStart(2, '0')
  }-${
    String(
      date.getDate()
    ).padStart(2, '0')
  }`

  const filteredAppointments =
    appointments.filter(
      (item) =>
        item.date === selectedDate
    )

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold mb-2">
          Clinic Calendar
        </h1>

        <p className="text-zinc-400">
          Manage appointments visually
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">

        {/* Calendar */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-3xl p-6 h-fit">

          <Calendar
            onChange={setDate}
            value={date}
            className="custom-calendar"
          />
        </div>

        {/* Right Side */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-3xl p-6">

          {/* Selected Date */}
          <div className="flex items-center gap-3 mb-8">

            <div className="w-12 h-12 rounded-2xl bg-[#dffff2] text-black flex items-center justify-center">

              <CalendarDays size={22} />
            </div>

            <div>

              <p className="text-zinc-400 text-sm">
                Selected Date
              </p>

              <h2 className="text-2xl font-bold">
                {selectedDate}
              </h2>
            </div>
          </div>

          {/* Appointments */}
          <div className="space-y-4">

            {filteredAppointments.length === 0 && (

              <div className="bg-[#1d1d1d] border border-[#2a2a2a] rounded-3xl p-10 text-center">

                <div className="w-20 h-20 rounded-3xl bg-[#252525] flex items-center justify-center mx-auto mb-5">

                  <CalendarDays size={35} />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  No Appointments
                </h2>

                <p className="text-zinc-500">
                  No appointments scheduled on this date
                </p>
              </div>
            )}

            {filteredAppointments.map((item) => (

              <div
                key={item.id}
                className="bg-[#1d1d1d] border border-[#2a2a2a] rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center gap-5 hover:border-[#3a3a3a] transition-all"
              >

                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-[#dffff2] text-black flex items-center justify-center font-bold text-lg uppercase">

                  {(item.patient || 'PT').slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1">

                  <h3 className="text-2xl font-bold mb-2">
                    {item.patient}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-400">

                    <div className="flex items-center gap-2">

                      <Clock3 size={15} />

                      {item.time}
                    </div>

                    <div className="flex items-center gap-2">

                      <UserRound size={15} />

                      {item.therapist}
                    </div>
                  </div>

                  <p className="text-zinc-500 mt-3">
                    {item.therapy}
                  </p>
                </div>

                {/* Status */}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}