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
              {/* Actions */}
<div className="flex gap-3">

  {/* WhatsApp Reminder */}
  <button
    onClick={() => {

      const phone =
        item.phone ||
        item.patientPhone ||
        ''

      if (!phone) {

        alert(
          'Patient phone number not found'
        )

        return
      }

      const cleanPhone =
        phone.replace(/\D/g, '')

      const message =
`Hello ,

Please confirm your therapy session Tommrow.

⏰ Time: ${item.time}
`

      const whatsappURL =
`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`

      window.open(
        whatsappURL,
        '_blank'
      )
    }}
    className="w-12 h-12 rounded-2xl border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/10 transition-all"
  >

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.52 3.48A11.77 11.77 0 0012.05 0C5.55 0 .26 5.29.26 11.79c0 2.08.54 4.11 1.58 5.91L0 24l6.49-1.7a11.76 11.76 0 005.56 1.42h.01c6.5 0 11.79-5.29 11.79-11.79 0-3.15-1.23-6.1-3.33-8.45zM12.06 21.4h-.01a9.54 9.54 0 01-4.86-1.33l-.35-.21-3.85 1.01 1.03-3.75-.23-.39a9.5 9.5 0 01-1.47-5.08c0-5.25 4.28-9.53 9.54-9.53 2.55 0 4.94.99 6.74 2.79a9.45 9.45 0 012.8 6.74c0 5.26-4.28 9.55-9.54 9.55zm5.23-7.12c-.29-.15-1.72-.85-1.98-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.42-1.69-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.91-2.16-.24-.57-.48-.49-.66-.5l-.56-.01c-.2 0-.51.07-.78.37-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.05 2.85 1.2 3.05.15.2 2.06 3.14 4.99 4.4.7.3 1.25.48 1.67.62.7.22 1.33.19 1.83.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34z"/>
    </svg>
  </button>

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