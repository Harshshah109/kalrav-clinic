import { useEffect, useState } from 'react'

import Select from 'react-select'

import {
  X,
  IndianRupee
} from 'lucide-react'

import { addPayment }
  from '../../services/paymentService'

import {
  getPatients,
  updatePatient
} from '../../services/patientService'

export default function AddPaymentModal({
  close,
  refresh
}) {

  const [patients, setPatients] =
    useState([])

  const [selectedPatient,
    setSelectedPatient] =
      useState(null)

  const [form, setForm] = useState({

    patient: '',

    amount: '',

    method: 'Cash',

    status: 'Paid',

    paymentType:
      'Monthly Settlement',

    date: '',

    notes: ''
  })

  useEffect(() => {

    loadPatients()

  }, [])

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      setPatients(data || [])
    }

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value
      })
    }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      if (!selectedPatient)
        return

      const paymentAmount =
        Number(form.amount || 0)

      const currentWallet =
        Number(
          selectedPatient.walletBalance || 0
        )

      const currentDue =
        Number(
          selectedPatient.pendingDue || 0
        )

      let updatedWallet =
        currentWallet

      let updatedDue =
        currentDue

      /* ADVANCE PAYMENT */
      if (
        form.paymentType ===
        'Advance Payment'
      ) {

        updatedWallet =
          currentWallet +
          paymentAmount
      }

      /* DUE CLEARANCE */
      else if (
        form.paymentType ===
        'Due Clearance'
      ) {

        if (
          paymentAmount >= currentDue
        ) {

          updatedWallet =
            paymentAmount -
            currentDue

          updatedDue = 0

        } else {

          updatedDue =
            currentDue -
            paymentAmount
        }
      }

      /* MONTHLY SETTLEMENT */
      else {

        if (
          paymentAmount >= currentDue
        ) {

          updatedWallet =
            paymentAmount -
            currentDue

          updatedDue = 0

        } else {

          updatedDue =
            currentDue -
            paymentAmount
        }
      }

      /* SAVE PAYMENT */
      await addPayment({

        ...form,

        patient:
          selectedPatient.name,

        previousWallet:
          currentWallet,

        previousDue:
          currentDue,

        remainingWallet:
          updatedWallet,

        remainingDue:
          updatedDue,

        createdAt:
          new Date()
      })

      /* UPDATE PATIENT */
      await updatePatient(
        selectedPatient.id,
        {

          walletBalance:
            updatedWallet,

          pendingDue:
            updatedDue,

          totalPaid:
            Number(
              selectedPatient.totalPaid || 0
            ) + paymentAmount
        }
      )

      refresh()

      close()
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-2xl bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={close}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#404040] flex items-center justify-center hover:bg-[#252525]"
        >
          <X size={18} />
        </button>

        <h2 className="text-3xl font-bold mb-8">
          Add Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PATIENT */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Patient
            </label>

            <Select
              options={patients.map((patient) => ({
                value: patient.id,
                label: patient.name
              }))}

              onChange={(selected) => {

                const patient =
                  patients.find(
                    (p) =>
                      p.id === selected.value
                  )

                setSelectedPatient(patient)

                setForm({
                  ...form,
                  patient:
                    patient.name
                })
              }}

              placeholder="Search patient..."

              className="text-black"

              styles={{

                control: (base) => ({
                  ...base,
                  backgroundColor: '#222',
                  borderColor: '#3a3a3a',
                  minHeight: 56,
                  borderRadius: 16,
                  boxShadow: 'none'
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: '#1b1b1b',
                  border: '1px solid #343434'
                }),

                singleValue: (base) => ({
                  ...base,
                  color: 'white'
                }),

                input: (base) => ({
                  ...base,
                  color: 'white'
                }),

                option: (
                  base,
                  state
                ) => ({
                  ...base,
                  backgroundColor:
                    state.isFocused
                      ? '#2a2a2a'
                      : '#1b1b1b',

                  color: 'white'
                }),

                placeholder: (base) => ({
                  ...base,
                  color: '#777'
                })
              }}
            />
          </div>

          {/* BALANCE INFO */}
          {selectedPatient && (

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-[#171717] border border-[#2f2f2f] rounded-2xl p-4">

                <p className="text-zinc-400 text-sm mb-2">
                  Wallet Balance
                </p>

                <h2 className="text-3xl font-bold text-emerald-400">
                  ₹{
                    selectedPatient.walletBalance || 0
                  }
                </h2>
              </div>

              <div className="bg-[#171717] border border-[#2f2f2f] rounded-2xl p-4">

                <p className="text-zinc-400 text-sm mb-2">
                  Pending Due
                </p>

                <h2 className="text-3xl font-bold text-yellow-400">
                  ₹{
                    selectedPatient.pendingDue || 0
                  }
                </h2>
              </div>
            </div>
          )}

          {/* AMOUNT + DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                placeholder="500"
                value={form.amount}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none"
                required
              />
            </div>

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Payment Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none"
                required
              />
            </div>
          </div>

          {/* TYPE + METHOD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Payment Type
              </label>

              <select
                name="paymentType"
                value={form.paymentType}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none"
              >

                <option>
                  Monthly Settlement
                </option>

                <option>
                  Advance Payment
                </option>

                <option>
                  Due Clearance
                </option>

                <option>
                  Session Payment
                </option>
              </select>
            </div>

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Payment Method
              </label>

              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none"
              >

                <option>
                  Cash
                </option>

                <option>
                  UPI
                </option>

                <option>
                  Card
                </option>

                <option>
                  Bank Transfer
                </option>
              </select>
            </div>
          </div>

          {/* NOTES */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Notes
            </label>

            <textarea
              name="notes"
              rows="4"
              placeholder="Additional payment notes..."
              value={form.notes}
              onChange={handleChange}
              className="w-full bg-[#222] border border-[#3a3a3a] rounded-2xl p-5 outline-none resize-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-14 rounded-2xl bg-[#dffff2] text-black font-bold hover:opacity-90"
            >
              <IndianRupee size={16} />
              Save Payment
            </button>

            <button
              type="button"
              onClick={close}
              className="px-6 h-14 rounded-2xl border border-[#404040] hover:bg-[#252525]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}