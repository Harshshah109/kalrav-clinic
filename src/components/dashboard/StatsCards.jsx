import {
  CalendarDays
} from 'lucide-react'

export default function StatsCards({
  appointments = []
}) {

  const todayAppointments =
    appointments.length

  const pendingAppointments =
    appointments.filter(
      (item) =>
        item.status === 'Pending'
    ).length

  return (
    <div className="grid grid-cols-1 gap-5 mb-8">

      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center">
            <CalendarDays size={22} />
          </div>
        </div>

        <h3 className="text-zinc-400 mb-2">
          Today's Appointments
        </h3>

        <h2 className="text-4xl font-bold mb-2">
          {todayAppointments}
        </h2>

        <p className="text-sm text-yellow-400">
          {pendingAppointments} pending confirmations
        </p>
      </div>
    </div>
  )
}