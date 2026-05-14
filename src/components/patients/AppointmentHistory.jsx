import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  CalendarDays
} from 'lucide-react'

import {
  getAppointments
} from '../../services/appointmentService'

export default function AppointmentHistory({
  patient
}) {

  const [appointments,
    setAppointments] =
      useState([])

  const [filter,
    setFilter] =
      useState('monthly')

  useEffect(() => {

    loadAppointments()

  }, [])

  const loadAppointments =
    async () => {

      const data =
        await getAppointments()

      const patientAppointments =
        data.filter(
          (item) =>
            item.patient ===
            patient.name
        )

      setAppointments(
        patientAppointments || []
      )
    }

  const filteredAppointments =
    useMemo(() => {

      const now =
        new Date()

      return appointments.filter(
        (appointment) => {

          const appointmentDateValue =
  appointment.date ||
  appointment.sessionDate

if (!appointmentDateValue)
  return false

          const appointmentDate =
  appointment.date?.seconds
  ? new Date(
      appointment.date.seconds * 1000
    ).toLocaleDateString()
  : (
      appointment.date ||
      appointment.sessionDate
    )
    ? new Date(
        appointment.date.seconds * 1000
      )
    : new Date(
        appointment.date ||
        appointment.sessionDate
      )
              ? new Date(
                  appointment.date.seconds * 1000
                )
              : new Date(
                  appointment.date
                )

          if (filter === 'weekly') {

            const diff =
              (now - appointmentDate) /
              (1000 * 60 * 60 * 24)

            return diff <= 7
          }

          if (filter === 'monthly') {

            return (
              appointmentDate.getMonth() ===
                now.getMonth() &&
              appointmentDate.getFullYear() ===
                now.getFullYear()
            )
          }

          if (filter === 'yearly') {

            return (
              appointmentDate.getFullYear() ===
              now.getFullYear()
            )
          }

          return true
        }
      )

    }, [appointments, filter])

  return (
    <div className="mt-5 bg-[#1b1b1b] border border-[#2d2d2d] rounded-3xl p-5">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

        <div>

          <h3 className="text-2xl font-bold">
            Appointment History
          </h3>

          <p className="text-zinc-500 mt-1">
            Previous appointment records
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex bg-[#171717] border border-[#2f2f2f] rounded-2xl p-1 w-fit">

          {[
            'weekly',
            'monthly',
            'yearly'
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(item)
              }
              className={`px-4 h-10 rounded-xl text-sm font-semibold transition-all ${
                filter === item
                  ? 'bg-[#dffff2] text-black'
                  : 'text-zinc-400'
              }`}
            >
              {
                item.charAt(0)
                  .toUpperCase() +
                item.slice(1)
              }
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">

        {filteredAppointments.length === 0 && (

          <div className="bg-[#151515] border border-[#2f2f2f] rounded-2xl p-5 text-zinc-500 text-sm">

            No appointment history yet
          </div>
        )}

        {filteredAppointments

          .sort((a, b) => {

            const dateA =
              a.date?.seconds
                ? new Date(
                    a.date.seconds * 1000
                  )
                : new Date(a.date)

            const dateB =
              b.date?.seconds
                ? new Date(
                    b.date.seconds * 1000
                  )
                : new Date(b.date)

            return dateB - dateA
          })

          .map((appointment) => (

            <div
              key={appointment.id}
              className="bg-[#151515] border border-[#2f2f2f] rounded-2xl p-5"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2 text-white font-semibold mb-2">

                    <CalendarDays size={16} />

                    {
                      appointment.date?.seconds
                        ? new Date(
                            appointment.date.seconds * 1000
                          ).toLocaleDateString()
                        : appointment.date
                    }
                  </div>

                  <p className="text-zinc-500 text-sm">
                    {
                      appointment.therapist ||
                      'Speech Therapist'
                    }
                  </p>
                </div>

                <div className="px-4 py-2 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-sm text-cyan-400 font-semibold w-fit">

                  Appointment
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}