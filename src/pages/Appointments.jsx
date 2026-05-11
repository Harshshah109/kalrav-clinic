import {
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  Search
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import AddAppointmentModal
  from '../components/modals/AddAppointmentModal'

import {
  getAppointments,
  updateAppointment,
  deleteAppointment
} from '../services/appointmentService'

export default function Appointments({
  role
}) {

  const [appointments, setAppointments] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedAppointment,
    setSelectedAppointment] =
      useState(null)

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold mb-2">
            Appointments
          </h1>

          <p className="text-zinc-400">
            Manage daily schedule and bookings
          </p>
        </div>

        {/* ADMIN ONLY */}
        {role === 'admin' && (

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-center gap-2 border border-[#3a3a3a] rounded-2xl px-6 py-4 hover:bg-[#1c1c1c] transition-all"
          >
            <Plus size={20} />

            <span className="font-semibold">
              New Appointment
            </span>
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* Search */}
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

        {/* Filter */}
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

              {/* Time */}
              <div className="min-w-[140px]">

                <h3 className="text-xl font-bold text-white">
                  {item.time}
                </h3>

                <p className="text-sm text-zinc-500 mt-1">
                  {item.date}
                </p>
              </div>

              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-[#dffff2] text-black flex items-center justify-center font-bold text-lg uppercase">
                {(item.patient || 'PT').slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1">

                <h3 className="text-xl font-bold mb-1">
                  {item.patient || 'Patient'}
                </h3>

                <p className="text-zinc-400">
                  {item.therapy || 'Speech Therapy'} • {item.therapist || 'Dr. Meera'} • {item.duration || '30 min'}
                </p>
              </div>

              {/* Status */}
              <div>

                {role === 'admin' &&
                item.status === 'Pending'
                  ? (
                    <button
                      onClick={async () => {

                        await updateAppointment(
                          item.id,
                          {
                            status: 'Confirmed'
                          }
                        )

                        loadAppointments()
                      }}
                      className="px-6 py-3 rounded-2xl border border-[#3d3d3d] hover:bg-[#222]"
                    >
                      Confirm
                    </button>
                  )
                  : (
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
                  )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">

                {/* ADMIN ONLY */}
                {role === 'admin' && (
                  <>
                    {/* Edit */}
                    <button
                      onClick={() =>
                        setSelectedAppointment(item)
                      }
                      className="w-12 h-12 rounded-2xl border border-[#383838] text-white flex items-center justify-center hover:bg-[#222] transition-all"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={async () => {

                        const confirmDelete =
                          window.confirm(
                            'Delete appointment?'
                          )

                        if (!confirmDelete) return

                        await deleteAppointment(
                          item.id
                        )

                        loadAppointments()
                      }}
                      className="w-12 h-12 rounded-2xl border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}

                {/* Message */}
                <button className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222]">
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {openModal && (
        <AddAppointmentModal
          close={() => setOpenModal(false)}
          refresh={loadAppointments}
        />
      )}

      {/* Edit Modal */}
      {selectedAppointment && (
        <AddAppointmentModal
          editData={selectedAppointment}
          isEdit={true}
          close={() =>
            setSelectedAppointment(null)
          }
          refresh={loadAppointments}
        />
      )}
    </div>
  )
}