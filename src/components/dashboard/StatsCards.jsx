import {
  CalendarDays,
  Users,
  IndianRupee,
  UserRound,
  Wallet,
  Smartphone,
  AlertCircle
} from 'lucide-react'

export default function StatsCards({
  appointments = [],
  patients = [],
  therapists = [],
  revenue = 0,
  cashRevenue = 0,
  digitalRevenue = 0,
  pendingRevenue = 0,
  revenueFilter = 'monthly',
  role = 'admin'
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

  const revenueTitle =
    revenueFilter === 'daily'
      ? 'Today Revenue'
      : revenueFilter === 'weekly'
      ? 'Weekly Revenue'
      : revenueFilter === 'yearly'
      ? 'Yearly Revenue'
      : 'Monthly Revenue'

  return (
    <div className={`grid gap-5 mb-8 ${
      role === 'admin'
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
    }`}>

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

      {/* REVENUE - ADMIN ONLY */}
      {role === 'admin' && (

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center">
              <IndianRupee size={22} />
            </div>
          </div>

          <h3 className="text-zinc-400 mb-2">
            {revenueTitle}
          </h3>

          <h2 className="text-4xl font-bold mb-5">
            ₹{revenue.toLocaleString()}
          </h2>

          {/* Breakdown */}
          <div className="space-y-3">

            {/* Cash */}
            <div className="flex items-center justify-between bg-[#1f1f1f] rounded-2xl px-4 py-3">

              <div className="flex items-center gap-2 text-zinc-400 text-sm">

                <Wallet size={16} />

                Cash
              </div>

              <span className="font-semibold text-white">
                ₹{cashRevenue.toLocaleString()}
              </span>
            </div>

            {/* Digital */}
            <div className="flex items-center justify-between bg-[#1f1f1f] rounded-2xl px-4 py-3">

              <div className="flex items-center gap-2 text-zinc-400 text-sm">

                <Smartphone size={16} />

                Digital
              </div>

              <span className="font-semibold text-white">
                ₹{digitalRevenue.toLocaleString()}
              </span>
            </div>

            {/* Pending */}
            <div className="flex items-center justify-between bg-[#1f1f1f] rounded-2xl px-4 py-3">

              <div className="flex items-center gap-2 text-zinc-400 text-sm">

                <AlertCircle size={16} />

                Pending
              </div>

              <span className="font-semibold text-yellow-400">
                ₹{pendingRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

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