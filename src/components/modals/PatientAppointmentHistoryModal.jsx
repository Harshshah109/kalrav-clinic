import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  X
} from 'lucide-react'

import {
  getAppointments
} from '../../services/appointmentService'

export default function PatientAppointmentHistoryModal({
  patient,
  close
}) {

  const [appointments,
    setAppointments] =
      useState([])

  const [filter,
    setFilter] =
      useState('monthly')

  const [selectedMonth,
    setSelectedMonth] =
      useState(
        new Date().getMonth()
      )

  const [selectedYear,
    setSelectedYear] =
      useState(
        new Date().getFullYear()
      )

  useEffect(() => {

    loadAppointments()

  }, [])

  const loadAppointments =
    async () => {

      const data =
        await getAppointments()

      const filtered =
        (data || []).filter(
          (item) =>
            (
              item.patient ||
              item.patientName
            ) === patient.name
        )

      setAppointments(filtered)
    }

  const filteredAppointments =
    useMemo(() => {

      return appointments.filter(
        (item) => {

          if (!item.date)
            return false

          const date =
            item.date?.seconds
              ? new Date(
                  item.date.seconds * 1000
                )
              : new Date(item.date)

          const now =
            new Date()

          if (
            filter === 'weekly'
          ) {

            const diff =
              (now - date) /
              (1000 * 60 * 60 * 24)

            return diff <= 7
          }

          if (
            filter === 'monthly'
          ) {

            return (
              date.getMonth() ===
                Number(selectedMonth) &&
              date.getFullYear() ===
                Number(selectedYear)
            )
          }

          if (
            filter === 'yearly'
          ) {

            return (
              date.getFullYear() ===
              Number(selectedYear)
            )
          }

          return true
        }
      )

    }, [
      appointments,
      filter,
      selectedMonth,
      selectedYear
    ])

  const groupedData =
    Object.values(

      filteredAppointments.reduce(
        (acc, item) => {

          const therapist =
            item.therapist ||
            item.therapistName ||
            'Unknown'

          if (!acc[therapist]) {

            acc[therapist] = {

              therapist,
              count: 0
            }
          }

          acc[therapist].count += 1

          return acc

        }, {}
      )
    )

  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        overflow-y-auto
        px-4
        py-10
        flex
        justify-center
      "
      style={{
        alignItems: 'flex-start',

        background:
          'rgba(15,15,25,0.35)',

        backdropFilter:
          'blur(4px)'
      }}
    >

      <div
        className="
          relative
          w-full
          max-w-4xl
          rounded-[32px]
          border
          border-[#ece7ff]
          bg-white
          p-6
          shadow-2xl
        "
      >

        {/* CLOSE */}
        <button
          onClick={close}
          className="
            absolute
            top-5
            right-5
            w-10
            h-10
            rounded-xl
            border
            border-[#ece7ff]
            flex
            items-center
            justify-center
          "
        >

          <X size={18} />
        </button>

        {/* TITLE */}
        <h2 className="
          text-4xl
          font-bold
          text-[#1f1147]
          mb-6
        ">
          Appointment History
        </h2>

        {/* FILTERS */}
        <div className="
          flex
          flex-wrap
          gap-3
          mb-6
        ">

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
              className={`
                px-5
                h-11
                rounded-2xl
                font-semibold
                capitalize
                transition-all
                ${
                  filter === item
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'
                    : 'border border-[#ece7ff] text-[#1f1147]'
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        {/* MONTH + YEAR */}
        {filter !== 'weekly' && (

          <div className="
            flex
            gap-4
            mb-6
          ">

            {filter === 'monthly' && (

              <select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
                className="
                  h-12
                  px-4
                  rounded-2xl
                  border
                  border-[#ece7ff]
                "
              >

                {[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December'
                ].map((month, index) => (

                  <option
                                       key={month}
                    value={index}
                  >
                    {month}
                  </option>
                ))}
              </select>
            )}

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
              className="
                h-12
                px-4
                rounded-2xl
                border
                border-[#ece7ff]
              "
            >

              {[2024, 2025, 2026, 2027, 2028]
                .map((year) => (

                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* TABLE */}
        <div className="
          overflow-hidden
          rounded-3xl
          border
          border-[#ece7ff]
        ">

          {/* HEADER */}
          <div className="
            grid
            grid-cols-2
            bg-[#faf8ff]
            border-b
            border-[#ece7ff]
            px-6
            py-4
            font-bold
            text-[#1f1147]
          ">

            <div>
              Therapist Name
            </div>

            <div>
              No. Of Appointments
            </div>
          </div>

          {/* BODY */}
          {groupedData.length === 0 && (

            <div className="
              py-16
              text-center
              text-[#7c6ca8]
            ">
              No appointment history found
            </div>
          )}

          {groupedData.map((item) => (

            <div
              key={item.therapist}
              className="
                grid
                grid-cols-2
                px-6
                py-5
                border-b
                border-[#f3efff]
                items-center
              "
            >

              <div className="
                font-semibold
                text-[#1f1147]
              ">
                {item.therapist}
              </div>

              <div>

                <span className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-500
                  text-white
                  font-semibold
                ">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}