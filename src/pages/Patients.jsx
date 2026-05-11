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
  deleteAppointmentsByPatient
} from '../services/appointmentService'

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

export default function Patients({
  role
}) {

  const [patients, setPatients] =
    useState([])

  const [payments, setPayments] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedPatient, setSelectedPatient] =
    useState(null)

  const [sessionPatient, setSessionPatient] =
    useState(null)

  const [expandedPatient, setExpandedPatient] =
    useState(null)

  const [search, setSearch] =
    useState('')

  useEffect(() => {
    loadPatients()
    loadPayments()
  }, [])

  const loadPatients = async () => {

    const data =
      await getPatients()

    setPatients(data)
  }

  const loadPayments = async () => {

    const data =
      await getPayments()

    setPayments(data)
  }

  const getPatientPayments =
    (patientName) => {

      return payments.filter(
        (item) =>
          item.patient === patientName
      )
    }

  const getTotalPaid =
    (patientName) => {

      return getPatientPayments(patientName)
        .filter(
          (item) =>
            item.status === 'Paid'
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.amount || 0),
          0
        )
    }

  const getPendingDue =
    (patientName) => {

      return getPatientPayments(patientName)
        .filter(
          (item) =>
            item.status === 'Pending'
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.amount || 0),
          0
        )
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
            Manage patient records, sessions and billing
          </p>
        </div>

        {/* Add Patient */}
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center justify-center gap-2 border border-[#3a3a3a] rounded-2xl px-6 py-4 hover:bg-[#1c1c1c] transition-all"
        >
          <Plus size={20} />

          <span className="font-semibold">
            Add Patient
          </span>
        </button>
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
              setSearch(e.target.value)
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
          .map((patient) => {

            const totalPaid =
              getTotalPaid(
                patient.name
              )

            const pendingDue =
              getPendingDue(
                patient.name
              )

            return (

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

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 w-fit">
                        Active
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

                    {/* PAYMENT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

                      {/* Total Paid */}
                      <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                        <div className="flex items-center gap-2 mb-2 text-zinc-500 text-sm">

                          <IndianRupee size={15} />

                          Total Paid
                        </div>

                        <h3 className="text-2xl font-bold text-emerald-400">
                          ₹{totalPaid}
                        </h3>
                      </div>

                      {/* Pending Due */}
                      <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                        <div className="flex items-center gap-2 mb-2 text-zinc-500 text-sm">

                          <AlertCircle size={15} />

                          Pending Due
                        </div>

                        <h3 className={`text-2xl font-bold ${
                          pendingDue > 0
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                        }`}>
                          {
                            pendingDue > 0
                              ? `₹${pendingDue}`
                              : 'No Due'
                          }
                        </h3>
                      </div>

                      {/* Status */}
                      <div className="bg-[#1f1f1f] rounded-2xl p-4 border border-[#2d2d2d]">

                        <p className="text-zinc-500 text-sm mb-2">
                          Payment Status
                        </p>

                        {
                          pendingDue > 0 ? (

                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                              Pending
                            </span>

                          ) : (

                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                              Cleared
                            </span>
                          )
                        }
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">

                    {/* Add Session */}
                    <button
                      onClick={() =>
                        setSessionPatient(patient)
                      }
                      className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222] transition-all text-white"
                    >
                      <ClipboardPen size={18} />
                    </button>

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
                            'Delete this patient and all related appointments?'
                          )

                        if (!confirmDelete)
                          return

                        await deleteAppointmentsByPatient(
                          patient.name
                        )

                        await deletePatient(
                          patient.id
                        )

                        loadPatients()
                      }}
                      className="w-12 h-12 rounded-2xl border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
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
                  <SessionHistory
                    patient={patient}
                  />
                )}
              </div>
            )
          })}
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