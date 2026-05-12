import {
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  Search,
  CalendarDays
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import AddAppointmentModal
  from '../components/modals/AddAppointmentModal'

import {
  getAppointments,
  deleteAppointment
} from '../services/appointmentService'

import {
  getPatients
} from '../services/patientService'

function Appointments({
  role
}) {

  const [appointments, setAppointments] =
    useState([])

  const [patients, setPatients] =
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

  const [selectedDate,
    setSelectedDate] =
      useState('')

  useEffect(() => {

    loadAppointments()

    loadPatients()

  }, [])

  const loadAppointments =
    async () => {

      try {

        const data =
          await getAppointments()

        setAppointments(
          Array.isArray(data)
            ? data
            : []
        )

      } catch {

        setAppointments([])
      }
    }

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      setPatients(data || [])
    }

  const formatDate =
    (dateObj) => {

      return `${dateObj.getFullYear()}-${
        String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')
      }-${
        String(
          dateObj.getDate()
        ).padStart(2, '0')
      }`
    }

  const today =
    formatDate(new Date())

  const tomorrowDate =
    new Date()

  tomorrowDate.setDate(
    tomorrowDate.getDate() + 1
  )

  const tomorrow =
    formatDate(tomorrowDate)

  const parseTime =
    (timeString) => {

      if (!timeString)
        return 0

      const [time, modifier] =
        timeString.split(' ')

      let [hours, minutes] =
        time.split(':').map(Number)

      if (
        modifier === 'PM' &&
        hours !== 12
      ) {
        hours += 12
      }

      if (
        modifier === 'AM' &&
        hours === 12
      ) {
        hours = 0
      }

      return (
        hours * 60 + minutes
      )
    }

  const getDateFromItem =
    (item) => {

      return item.date?.seconds
        ? (() => {

            const d =
              new Date(
                item.date.seconds * 1000
              )

            return formatDate(d)
          })()
        : item.date
    }

  const filteredAppointments =
    appointments

      .filter((item) => {

        const matchesSearch =
          (
            item.patient ||
            item.patientName ||
            ''
          )

            .toLowerCase()

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

      .sort((a, b) =>
        parseTime(a.time) -
        parseTime(b.time)
      )

  const todayAppointments =
    filteredAppointments.filter(
      (item) =>
        getDateFromItem(item) === today
    )

  const tomorrowAppointments =
    filteredAppointments.filter(
      (item) =>
        getDateFromItem(item) === tomorrow
    )

  const selectedDateAppointments =
    selectedDate
      ? filteredAppointments.filter(
          (item) =>
            getDateFromItem(item) ===
            selectedDate
        )
      : []

  const AppointmentCard =
    ({ item }) => (

      <div
        className={`border rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5 ${
          item.status === 'Cancelled'
            ? 'border-red-500/30 opacity-50'
            : 'border-[#313131]'
        }`}
      >

        <div className="min-w-[120px]">

          <h3 className="text-xl font-bold">
            {item.time}
          </h3>

          <p className="text-sm text-zinc-500 mt-1">
            {
              item.date?.seconds
                ? new Date(
                    item.date.seconds * 1000
                  ).toLocaleDateString()
                : item.date
            }
          </p>
        </div>

        <div className="w-14 h-14 rounded-full bg-[#dffff2] text-black flex items-center justify-center font-bold uppercase">
          {
            (
              item.patient ||
              item.patientName ||
              'PT'
            ).slice(0, 2)
          }
        </div>

        <div className="flex-1">

          <h3 className="text-xl font-bold mb-1">
            {
              item.patient ||
              item.patientName
            }
          </h3>

          <p className="text-zinc-400">
            {
              item.therapy ||
              'Speech Therapy'
            } • {
              item.therapist ||
              item.therapistName
            }
          </p>
        </div>

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

        <div className="flex gap-3">

          <button
            onClick={() => {

              const patientName =
                item.patient ||
                item.patientName

              const patientData =
                patients.find(
                  (p) =>
                    p.name === patientName
                )

              const phone =
                patientData?.phone ||
                item.patientPhone ||
                ''

              if (!phone) {

                alert(
                  'Phone not found'
                )

                return
              }

              const cleanPhone =
                phone
                  .replace(/\s+/g, '')
                  .replace('+', '')

              const message =
`Hello ${patientName},

Reminder for your appointment.

Time: ${item.time}
`

              window.open(
`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`,
                '_blank'
              )
            }}
            className="w-12 h-12 rounded-2xl border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/10"
          >
            <MessageSquare size={18} />
          </button>

          {role === 'admin' && (
            <>
              <button
                onClick={() =>
                  setSelectedAppointment(item)
                }
                className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222]"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={async () => {

                  const confirmDelete =
                    window.confirm(
                      'Delete appointment?'
                    )

                  if (!confirmDelete)
                    return

                  await deleteAppointment(
                    item.id
                  )

                  loadAppointments()
                }}
                className="w-12 h-12 rounded-2xl border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    )

  return (
    <div className="pb-10">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Appointments
          </h1>

          <p className="text-zinc-400">
            Manage daily schedule and bookings
          </p>
        </div>

        {role === 'admin' && (

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="flex items-center gap-2 border border-[#3a3a3a] rounded-2xl px-6 py-4 hover:bg-[#1c1c1c]"
          >
            <Plus size={20} />

            New Appointment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-2xl px-4 h-14 flex items-center gap-3">

          <Search
            size={18}
            className="text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-transparent outline-none w-full"
          />
        </div>

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

        <div className="relative">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="w-full bg-[#171717] border border-[#2f2f2f] rounded-2xl px-4 h-14 outline-none text-white color-scheme-dark"
          />
        </div>
      </div>

      {selectedDate ? (

        <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <CalendarDays size={22} />

            <div>

              <h2 className="text-2xl font-bold">
                {new Date(selectedDate)
                  .toLocaleDateString(
                    'en-IN',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }
                  )}
              </h2>

              <p className="text-zinc-400 text-sm">
                {selectedDateAppointments.length} appointments
              </p>
            </div>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">

            {selectedDateAppointments.length === 0 && (

              <div className="text-zinc-500 text-center py-10">
                No appointments yet
              </div>
            )}

            {selectedDateAppointments.map((item) => (

              <AppointmentCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </div>

      ) : (

        <>
          <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6 mb-6">

            <div className="flex items-center gap-3 mb-5">

              <CalendarDays size={22} />

              <div>

                <h2 className="text-2xl font-bold">
                  Today's Appointments
                </h2>

                <p className="text-zinc-400 text-sm">
                  {todayAppointments.length} appointments
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">

              {todayAppointments.length === 0 && (

                <div className="text-zinc-500 text-center py-10">
                  No appointments today
                </div>
              )}

              {todayAppointments.map((item) => (

                <AppointmentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-5">

              <CalendarDays size={22} />

              <div>

                <h2 className="text-2xl font-bold">
                  Tomorrow's Appointments
                </h2>

                <p className="text-zinc-400 text-sm">
                  {tomorrowAppointments.length} appointments
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">

              {tomorrowAppointments.length === 0 && (

                <div className="text-zinc-500 text-center py-10">
                  No appointments tomorrow
                </div>
              )}

              {tomorrowAppointments.map((item) => (

                <AppointmentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {openModal && (
        <AddAppointmentModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadAppointments}
        />
      )}

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

export default Appointments