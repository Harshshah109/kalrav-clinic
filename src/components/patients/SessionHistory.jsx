import {
  useEffect,
  useState
} from 'react'

import {
  CalendarDays,
  Clock3,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import {
  getPatientSessions
} from '../../services/sessionService'

export default function SessionHistory({
  patient
}) {

  const [sessions, setSessions] =
    useState([])

  const [openSession, setOpenSession] =
    useState(null)

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
        sortedSessions
      )
    }

  return (
    <div className="mt-5 max-h-[420px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">

      {sessions.length === 0 && (

        <div className="bg-[#151515] border border-[#2f2f2f] rounded-2xl p-5 text-zinc-500 text-sm">

          No session history yet
        </div>
      )}

      {sessions.map((session) => (

        <div
          key={session.id}
          className="bg-[#151515] border border-[#2f2f2f] rounded-2xl overflow-hidden"
        >

          {/* Top Bar */}
          <button
            onClick={() =>

              setOpenSession(

                openSession === session.id
                  ? null
                  : session.id
              )
            }
            className="w-full p-5 flex items-center justify-between hover:bg-[#1c1c1c] transition-all"
          >

            <div className="text-left">

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

            {openSession === session.id
              ? <ChevronUp size={18} />
              : <ChevronDown size={18} />
            }
          </button>

          {/* Expanded Content */}
          {openSession === session.id && (

            <div className="border-t border-[#2a2a2a] p-5 space-y-5">

              {/* Notes */}
              <div>

                <p className="text-sm text-zinc-500 mb-2">
                  Session Notes
                </p>

                <div className="bg-[#1d1d1d] border border-[#2b2b2b] rounded-2xl p-4 text-zinc-300 leading-relaxed">
                  {session.notes}
                </div>
              </div>

              {/* Progress */}
              <div>

                <p className="text-sm text-zinc-500 mb-2">
                  Progress
                </p>

                <div className="bg-[#1d1d1d] border border-[#2b2b2b] rounded-2xl p-4 text-zinc-300 leading-relaxed">
                  {session.progress || 'No progress added'}
                </div>
              </div>

              {/* Goal */}
              <div>

                <p className="text-sm text-zinc-500 mb-2">
                  Next Goal
                </p>

                <div className="bg-[#1d1d1d] border border-[#2b2b2b] rounded-2xl p-4 text-zinc-300 leading-relaxed">
                  {session.nextGoal || 'No goal added'}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}