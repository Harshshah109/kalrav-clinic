import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TodaySchedule({
  appointments
}) {

  return (
    <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">
          Today's Schedule
        </h2>

        <Link
          to="/appointments"
          className="w-11 h-11 rounded-xl border border-[#3a3a3a] flex items-center justify-center hover:bg-[#222] transition-all"
        >
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Empty */}
      {appointments.length === 0 && (
        <div className="text-zinc-500 text-center py-10">
          No appointments found
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {appointments.map((item) => (
          <div
            key={item.id}
            className="border border-[#313131] rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4"
          >
            
            {/* Time */}
            <div className="text-zinc-300 font-medium min-w-[80px]">
              {item.time}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {item.patient}
              </h3>

              <p className="text-sm text-zinc-400">
                {item.therapist} • {item.therapy}
              </p>
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  item.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}