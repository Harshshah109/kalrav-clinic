import {
  CalendarDays,
  Users,
  IndianRupee,
  UserRound
} from 'lucide-react'

export default function StatsCards({
  appointments = [],
  patients = [],
  therapists = [],
  revenue = 0
}) {

  const todayAppointments =
    appointments.length

  const pendingAppointments =
    appointments.filter(
      (item) =>
        item.status === 'Pending'
    ).length

  const activePatients =
    patients.length

  const activeTherapists =
    therapists.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      {/* Appointments */}
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

      {/* Patients */}
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <h3 className="text-zinc-400 mb-2">
          Active Patients
        </h3>

        <h2 className="text-4xl font-bold mb-2">
          {activePatients}
        </h2>

        <p className="text-sm text-emerald-400">
          Live patient database
        </p>
      </div>

      {/* Revenue */}
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center">
            <IndianRupee size={22} />
          </div>
        </div>

        <h3 className="text-zinc-400 mb-2">
          Revenue This Month
        </h3>

        <h2 className="text-4xl font-bold mb-2">
          ₹{revenue.toLocaleString()}
        </h2>

        <p className="text-sm text-emerald-400">
          Paid payments revenue
        </p>
      </div>

      {/* Therapists */}
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">

          <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center">
            <UserRound size={22} />
          </div>
        </div>

        <h3 className="text-zinc-400 mb-2">
          Therapists Active
        </h3>

        <h2 className="text-4xl font-bold mb-2">
          {activeTherapists}
        </h2>

        <p className="text-sm text-emerald-400">
          Available therapists
        </p>
      </div>
    </div>
  )
}