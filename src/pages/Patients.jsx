import {
  Search,
  Plus,
  Phone,
  CalendarDays,
  Pencil,
  Trash2,
  ClipboardPen,
  IndianRupee,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { useEffect, useState } from 'react'

import {
  getPatients,
  deletePatient
} from '../services/patientService'

import {
  deleteAppointmentsByPatient
} from '../services/appointmentService'

import {
  getPayments
} from '../services/paymentService'

import {
  doc,
  deleteDoc
} from 'firebase/firestore'

import { db }
  from '../services/firebase'

import AddPatientModal
  from '../components/modals/AddPatientModal'

import EditPatientModal
  from '../components/modals/EditPatientModal'

import AddSessionModal
  from '../components/modals/AddSessionModal'

import SessionHistory
  from '../components/patients/SessionHistory'
  import AppointmentHistory
  from '../components/patients/AppointmentHistory'

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

  const [expandedPayments,
    setExpandedPayments] =
      useState(null)

  const [search, setSearch] =
    useState('')

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

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Patients
          </h1>

          <p className="text-zinc-400">
            Manage patient records and sessions
          </p>
        </div>

        {role === 'admin' && (

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="flex items-center justify-center gap-2 border border-[#3a3a3a] rounded-2xl px-6 py-4 hover:bg-[#1c1c1c] transition-all"
          >

            <Plus size={20} />

            <span className="font-semibold">
              Add Patient
            </span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-4 mb-6">

        <div className="flex items-center gap-3">

          <Search
            size={20}
            className="text-zinc-500"
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
            className="bg-transparent outline-none w-full text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Patients */}
      <div className="space-y-5">

        {patients

          .filter((patient) =>
            patient.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )

          .map((patient) => (

            <div
              key={patient.id}
              className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-5"
            >

              {/* Top */}
              <div className="flex flex-col xl:flex-row xl:items-center gap-5">

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#dffff2] text-black flex items-center justify-center text-lg font-bold">
                  {patient.name?.slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1">

                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">

                    <h2 className="text-2xl font-bold">
                      {patient.name}
                    </h2>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                      patient.category === 'Finished'
                        ? 'bg-zinc-200 text-zinc-700'
                        : patient.category === 'Assessment'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>

                      {patient.category || 'Assessment'}
                    </span>
                  </div>

                  <p className="text-zinc-400 mb-3">
                    {patient.condition} • Age {patient.age}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-400">

                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      Sessions
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      {patient.phone}
                    </div>
                  </div>

                  {/* ADMIN ONLY FINANCE */}
                  {role === 'admin' && (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

                      {/* Total Paid */}
                      <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                        <div className="flex items-center gap-2 mb-2 text-zinc-500 text-sm">

                          <IndianRupee size={15} />

                          Total Paid
                        </div>

                        <h3 className="text-2xl font-bold text-emerald-400">
                          ₹{
                            patient.totalPaid || 0
                          }
                        </h3>
                      </div>

                      {/* Wallet */}
                      <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                        <div className="flex items-center gap-2 mb-2 text-zinc-500 text-sm">

                          <IndianRupee size={15} />

                          Wallet Balance
                        </div>

                        <h3 className="text-2xl font-bold text-cyan-400">
                          ₹{
                            patient.walletBalance || 0
                          }
                        </h3>
                      </div>

                      {/* Due */}
                      <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                        <div className="flex items-center gap-2 mb-2 text-zinc-500 text-sm">

                          <AlertCircle size={15} />

                          Pending Due
                        </div>

                        <h3 className={`text-2xl font-bold ${
                          patient.pendingDue > 0
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                        }`}>

                          {
                            patient.pendingDue > 0
                              ? `₹${patient.pendingDue}`
                              : 'No Due'
                          }
                        </h3>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">

                  {/* Create Session */}
                  <button
                    onClick={() =>
                      setSessionPatient(patient)
                    }
                    className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222] transition-all text-white"
                  >
                    <ClipboardPen size={18} />
                  </button>

                  {/* ADMIN ONLY */}
                  {role === 'admin' && (
                    <>
                      {/* Edit */}
                      <button
                        onClick={() =>
                          setSelectedPatient(patient)
                        }
                        className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222] transition-all text-white"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={async () => {

                          const confirmDelete =
                            window.confirm(
                              'Delete patient, appointments and payments permanently?'
                            )

                          if (!confirmDelete)
                            return

                          try {

                            await deleteAppointmentsByPatient(
                              patient.name
                            )

                            const patientPayments =
                              payments.filter(
                                (item) =>
                                  item.patient === patient.name
                              )

                            for (const payment of patientPayments) {

                              const paymentDoc =
                                doc(
                                  db,
                                  'payments',
                                  payment.id
                                )

                              await deleteDoc(
                                paymentDoc
                              )
                            }

                            await deletePatient(
                              patient.id
                            )

                            loadPatients()

                          } catch (err) {

                            console.log(err)
                          }
                        }}
                        className="w-12 h-12 rounded-2xl border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Session History Toggle */}
              <button
                onClick={() =>

                  setExpandedPatient(

                    expandedPatient === patient.id
                      ? null
                      : patient.id
                  )
                }
                className="mt-5 text-sm text-[#dffff2]"
              >
                {expandedPatient === patient.id
                  ? 'Hide Session History'
                  : 'View Session History'}
              </button>

              {/* Session History */}
{expandedPatient === patient.id && (
  <>
    <SessionHistory
      patient={patient}
    />

    <AppointmentHistory
      patient={patient}
    />
  </>
)}
              {/* PAYMENT HISTORY TOGGLE */}
              <button
                onClick={() =>

                  setExpandedPayments(

                    expandedPayments === patient.id
                      ? null
                      : patient.id
                  )
                }
                className="mt-4 flex items-center gap-2 text-sm text-cyan-400"
              >
                {expandedPayments === patient.id
                  ? (
                    <>
                      <ChevronUp size={16} />
                      Hide Payments
                    </>
                  )
                  : (
                    <>
                      <ChevronDown size={16} />
                      View Payments
                    </>
                  )}
              </button>

              {/* PAYMENT HISTORY */}
              {expandedPayments === patient.id && (

                <div className="mt-5 bg-[#1b1b1b] border border-[#2d2d2d] rounded-3xl p-5">

                  <div className="flex items-center justify-between mb-5">

                    <h3 className="text-xl font-bold">
                      Payment History
                    </h3>

                    <span className="text-sm text-zinc-500">
                      {
                        payments.filter(
                          (payment) =>
                            payment.patient ===
                            patient.name
                        ).length
                      } payments
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

                    {payments

                      .filter(
                        (payment) =>
                          payment.patient ===
                          patient.name
                      )

                      .sort((a, b) => {

                        const dateA =
                          a.createdAt?.seconds
                            ? new Date(
                                a.createdAt.seconds * 1000
                              )
                            : new Date(a.createdAt)

                        const dateB =
                          b.createdAt?.seconds
                            ? new Date(
                                b.createdAt.seconds * 1000
                              )
                            : new Date(b.createdAt)

                        return dateB - dateA
                      })

                      .map((payment) => (

                        <div
                          key={payment.id}
                          className="bg-[#171717] border border-[#2f2f2f] rounded-2xl p-4"
                        >

                          <div className="flex flex-col md:flex-row md:items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-[#dffff2] text-black flex items-center justify-center">

                              <IndianRupee size={20} />
                            </div>

                            <div className="flex-1">

                              <div className="flex flex-wrap items-center gap-3 mb-2">

                                <h3 className="text-xl font-bold">
                                  ₹{payment.amount}
                                </h3>

                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#222] text-cyan-400">
                                  {
                                    payment.paymentType ||
                                    'Payment'
                                  }
                                </span>

                                {payment.status === 'Pending'
  ? (

    <button
      onClick={async () => {

        const confirmPayment =
          window.confirm(
            'Mark this pending payment as paid?'
          )

        if (!confirmPayment)
          return

        const updatedDue =
          Math.max(
            Number(
              patient.pendingDue || 0
            ) -
            Number(
              payment.amount || 0
            ),
            0
          )

        const {
          updatePayment
        } = await import(
          '../services/paymentService'
        )

        const {
          updatePatient
        } = await import(
          '../services/patientService'
        )

        await updatePayment(
          payment.id,
          {
            status: 'Paid',
            paymentType:
              'Due Clearance'
          }
        )

        await updatePatient(
          patient.id,
          {
            pendingDue:
              updatedDue,

            totalPaid:
              Number(
                patient.totalPaid || 0
              ) +
              Number(
                payment.amount || 0
              )
          }
        )

        loadPatients()
      }}
      className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 hover:opacity-90"
    >
      Mark Paid
    </button>

  )
  : (

    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      Paid
    </span>
  )}
                              </div>

                              <p className="text-zinc-400 text-sm">
                                {payment.method} • {
                                  payment.date?.seconds
                                    ? new Date(
                                        payment.date.seconds * 1000
                                      ).toLocaleDateString()
                                    : payment.date
                                }
                              </p>

                              {payment.notes && (

                                <p className="text-zinc-500 text-sm mt-2">
                                  {payment.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                    {payments.filter(
                      (payment) =>
                        payment.patient ===
                        patient.name
                    ).length === 0 && (

                      <div className="text-zinc-500 text-center py-10">
                        No payments found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Add Patient Modal */}
      {openModal && (
        <AddPatientModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadPatients}
        />
      )}

      {/* Edit Patient Modal */}
      {selectedPatient && (
        <EditPatientModal
          patient={selectedPatient}
          close={() =>
            setSelectedPatient(null)
          }
          refresh={loadPatients}
        />
      )}

      {/* Add Session Modal */}
      {sessionPatient && (
        <AddSessionModal
          patient={sessionPatient}
          close={() =>
            setSessionPatient(null)
          }
          refresh={loadPatients}
        />
      )}
    </div>
  )
}