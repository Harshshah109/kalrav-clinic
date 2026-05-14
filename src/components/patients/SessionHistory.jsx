import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  CalendarDays,
  Clock3
} from 'lucide-react'

import {
  getPatientSessions
} from '../../services/sessionService'

export default function SessionHistory({
  patient
}) {

  const [sessions, setSessions] =
    useState([])

  const [filter, setFilter] =
    useState('monthly')

  useEffect(() => {

    loadSessions()

  }, [])

  const loadSessions =
    async () => {

      const data =
        await getPatientSessions(
          patient.name
        )

      const sortedSessions =
        data.sort((a, b) => {

          const dateA =
            new Date(
              `${a.sessionDate} ${a.sessionTime}`
            )

          const dateB =
            new Date(
              `${b.sessionDate} ${b.sessionTime}`
            )

          return dateB - dateA
        })

      setSessions(
        sortedSessions || []
      )
    }

  const filteredSessions =
    useMemo(() => {

      const now =
        new Date()

      return sessions.filter(
        (session) => {

          if (!session.sessionDate)
            return false

          const sessionDate =
            new Date(
              session.sessionDate
            )

          if (filter === 'weekly') {

            const diff =
              (now - sessionDate) /
              (1000 * 60 * 60 * 24)

            return diff <= 7
          }

          if (filter === 'monthly') {

            return (
              sessionDate.getMonth() ===
                now.getMonth() &&
              sessionDate.getFullYear() ===
                now.getFullYear()
            )
          }

          if (filter === 'yearly') {

            return (
              sessionDate.getFullYear() ===
              now.getFullYear()
            )
          }

          return true
        }
      )

    }, [sessions, filter])

  return (
    <div className="mt-5">

      {/* FILTERS */}
      <div className="flex bg-[#171717] border border-[#2f2f2f] rounded-2xl p-1 w-fit mb-5">

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

      {/* HISTORY */}
      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">

        {filteredSessions.length === 0 && (

          <div className="bg-[#151515] border border-[#2f2f2f] rounded-2xl p-5 text-zinc-500 text-sm">

            No appointment history yet
          </div>
        )}

        {filteredSessions.map((session) => (

          <div
            key={session.id}
            className="bg-[#151515] border border-[#2f2f2f] rounded-2xl p-5"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2 text-white font-semibold mb-2">

                  <CalendarDays size={16} />

                  {session.sessionDate}
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-500">

                  <div className="flex items-center gap-2">

                    <Clock3 size={14} />

                    {session.sessionTime}
                  </div>

                  <span>
                    {session.therapist}
                  </span>
                </div>
              </div>

              <div className="px-4 py-2 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-sm text-cyan-400 font-semibold w-fit">

                Speech Therapist
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}