import {
  Search,
  Plus,
  Phone,
  CalendarDays,
  Pencil,
  Trash2,
  ClipboardPen,
  IndianRupee,
  AlertCircle
} from 'lucide-react'

import { useEffect, useState } from 'react'

import {
  getPatients,
  deletePatient
} from '../services/patientService'

import {
  getPayments
} from '../services/paymentService'

import AddPatientModal
  from '../components/modals/AddPatientModal'

import EditPatientModal
  from '../components/modals/EditPatientModal'

import AddSessionModal
  from '../components/modals/AddSessionModal'

import SessionHistory
  from '../components/patients/SessionHistory'

import PatientAppointmentHistoryModal
  from '../components/modals/PatientAppointmentHistoryModal'

export default function Patients({
  role
}) {

  const [patients, setPatients] =
    useState([])

  const [payments, setPayments] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedPatient,
    setSelectedPatient] =
      useState(null)

  const [sessionPatient,
    setSessionPatient] =
      useState(null)

  const [expandedPatient,
    setExpandedPatient] =
      useState(null)

  const [historyPatient,
    setHistoryPatient] =
      useState(null)

  const [search, setSearch] =
    useState('')

  const [patientFilter,
    setPatientFilter] =
      useState('Active')

  useEffect(() => {

    loadPatients()

  }, [])

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      const paymentData =
        await getPayments()

      setPatients(data || [])

      setPayments(paymentData || [])
    }

  const getPaymentDateObject =
    (payment) => {

      if (payment?.date?.seconds) {

        return new Date(
          payment.date.seconds * 1000
        )
      }

      if (payment?.createdAt?.seconds) {

        return new Date(
          payment.createdAt.seconds * 1000
        )
      }

      if (payment?.date) {

        return new Date(payment.date)
      }

      if (payment?.createdAt) {

        return new Date(payment.createdAt)
      }

      return new Date(0)
    }

  const formatPaymentDate =
    (payment) => {

      const date =
        getPaymentDateObject(payment)

      if (!date || isNaN(date.getTime()))
        return 'N/A'

      return date.toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )
    }

  const getLatestPendingPayment =
    (patient) => {

      const patientPendingPayments =
        payments

          .filter((payment) => {

            const samePatient =
              payment.patient === patient.name

            const isPending =
              payment.status === 'Pending'

            return (
              samePatient &&
              isPending
            )
          })

          .sort((a, b) => {

            const dateA =
              getPaymentDateObject(a)

            const dateB =
              getPaymentDateObject(b)

            return dateB - dateA
          })

      return (
        patientPendingPayments[0] ||
        null
      )
    }

  return (

    <div className="pb-10 relative isolate z-0">

      {/* HEADER */}
      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-5xl
            font-bold
            mb-2
            text-[#1f1147]
          ">
            Patients
          </h1>

          <p className="
            text-[#7c6ca8]
            text-lg
          ">
            Manage patient records and sessions
          </p>
        </div>

        {role === 'admin' && (

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              border
              border-[#ece7ff]
              bg-white/75
              rounded-2xl
              px-6
              py-4
              hover:bg-[#f5f3ff]
              transition-all
              text-[#1f1147]
              font-semibold
            "
          >

            <Plus size={20} />

            <span>
              Add Patient
            </span>
          </button>
        )}
      </div>

      {/* FILTER */}
      <div className="
        flex
        flex-wrap
        gap-3
        mb-6
      ">

        {[
          'Active',
          'Assessment',
          'Finished'
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setPatientFilter(item)
            }
            className={`
              h-12
              px-6
              rounded-2xl
              font-semibold
              transition-all
              ${
                patientFilter === item
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'
                  : 'bg-white/75 border border-[#ece7ff] text-[#1f1147]'
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="
        bg-white/75
        border
        border-[#ece7ff]
        rounded-3xl
        p-4
        mb-6
      ">

        <div className="flex items-center gap-3">

          <Search
            size={20}
            className="text-[#8c84b3]"
          />

          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              bg-transparent
              outline-none
              w-full
              text-[#1f1147]
            "
          />
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-5">

        {patients

          .filter((patient) => {

            const matchesSearch =
              patient.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )

            const matchesCategory =
              (patient.category || 'Assessment') ===
              patientFilter

            return (
              matchesSearch &&
              matchesCategory
            )
          })

          .map((patient) => {

            const latestPendingPayment =
              getLatestPendingPayment(patient)

            return (

              <div
                key={patient.id}
                className="
                  bg-white/75
                  border
                  border-[#ece7ff]
                  rounded-3xl
                  p-5
                "
              >

                {/* TOP */}
                <div className="
                  flex
                  flex-col
                  xl:flex-row
                  xl:items-center
                  gap-5
                ">

                  {/* AVATAR */}
                  <div className="
                    w-16
                    h-16
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-fuchsia-500
                    text-white
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-bold
                  ">
                    {patient.name?.slice(0, 2)}
                  </div>

                  {/* INFO */}
                  <div className="flex-1">

                    <div className="
                      flex
                      items-center
                      gap-3
                      mb-2
                    ">

                      <h2 className="
                        text-2xl
                        font-bold
                      ">
                        {patient.name}
                      </h2>

                      <span className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          patient.category === 'Finished'
                            ? 'bg-zinc-200 text-zinc-700'
                            : patient.category === 'Assessment'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }
                      `}>
                        {patient.category}
                      </span>
                    </div>

                    <p className="
                      text-[#7c6ca8]
                      mb-3
                    ">
                      {patient.condition} • Age {patient.age}
                    </p>

                    <div className="
                      flex
                      flex-wrap
                      gap-4
                      text-sm
                      text-[#7c6ca8]
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">
                        <Phone size={16} />
                        {patient.phone}
                      </div>
                    </div>

                    {/* FINANCE */}
                    {role === 'admin' && (

                      <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                        mt-5
                      ">

                        <div className="
                          bg-[#faf8ff]
                          rounded-2xl
                          p-4
                          border
                          border-[#ece7ff]
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                            text-[#8c84b3]
                            text-sm
                          ">

                            <IndianRupee size={15} />

                            Total Paid
                          </div>

                          <h3 className="
                            text-2xl
                            font-bold
                            text-emerald-500
                          ">
                            ₹{patient.totalPaid || 0}
                          </h3>
                        </div>

                        <div className="
                          bg-[#faf8ff]
                          rounded-2xl
                          p-4
                          border
                          border-[#ece7ff]
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                            text-[#8c84b3]
                            text-sm
                          ">

                            <IndianRupee size={15} />

                            Wallet Balance
                          </div>

                          <h3 className="
                            text-2xl
                            font-bold
                            text-cyan-500
                          ">
                            ₹{patient.walletBalance || 0}
                          </h3>
                        </div>

                        <div className="
                          bg-[#faf8ff]
                          rounded-2xl
                          p-4
                          border
                          border-[#ece7ff]
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                            text-[#8c84b3]
                            text-sm
                          ">

                            <AlertCircle size={15} />

                            Latest Pending Due
                          </div>

                          <h3 className={`
                            text-2xl
                            font-bold
                            ${
                              latestPendingPayment
                                ? 'text-yellow-500'
                                : 'text-emerald-500'
                            }
                          `}>
                            {
                              latestPendingPayment
                                ? `₹${latestPendingPayment.remainingDue || latestPendingPayment.amount || 0}`
                                : 'No Due'
                            }
                          </h3>

                          {latestPendingPayment && (

                            <p className="
                              text-xs
                              text-[#8c84b3]
                              mt-1
                            ">
                              {formatPaymentDate(
                                latestPendingPayment
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3">

                    <button
                      onClick={() => {

                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        })

                        setSessionPatient(patient)
                      }}
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        border
                        border-[#ece7ff]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <ClipboardPen size={18} />
                    </button>

                    {role === 'admin' && (
                      <>
                        <button
                          onClick={() => {

                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth'
                            })

                            setSelectedPatient(patient)
                          }}
                          className="
                            w-12
                            h-12
                            rounded-2xl
                            border
                            border-[#ece7ff]
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={async () => {

                            const confirmDelete =
                              window.confirm(
                                'Delete patient permanently?'
                              )

                            if (!confirmDelete)
                              return

                            await deletePatient(
                              patient.id
                            )

                            loadPatients()
                          }}
                          className="
                            w-12
                            h-12
                            rounded-2xl
                            border
                            border-red-200
                            text-red-500
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* SESSION HISTORY */}
                <button
                  onClick={() =>

                    setExpandedPatient(

                      expandedPatient === patient.id
                        ? null
                        : patient.id
                    )
                  }
                  className="
                    mt-5
                    text-sm
                    text-violet-600
                    font-semibold
                  "
                >
                  {expandedPatient === patient.id
                    ? 'Hide Session History'
                    : 'View Session History'}
                </button>

                {expandedPatient === patient.id && (
                  <SessionHistory
                    patient={patient}
                  />
                )}

                {/* APPOINTMENT HISTORY */}
                <button
                  onClick={() =>
                    setHistoryPatient(patient)
                  }
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-violet-600
                    font-semibold
                  "
                >
                  <CalendarDays size={16} />

                  View Appointment History
                </button>
              </div>
            )
          })}
      </div>

      {/* MODALS */}
      {openModal && (
        <AddPatientModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadPatients}
        />
      )}

      {selectedPatient && (
        <EditPatientModal
          patient={selectedPatient}
          close={() =>
            setSelectedPatient(null)
          }
          refresh={loadPatients}
        />
      )}

      {sessionPatient && (
        <AddSessionModal
          patient={sessionPatient}
          close={() =>
            setSessionPatient(null)
          }
          refresh={loadPatients}
        />
      )}

      {historyPatient && (
        <PatientAppointmentHistoryModal
          patient={patient}
          close={() =>
            setHistoryPatient(null)
          }
        />
      )}
    </div>
  )
}