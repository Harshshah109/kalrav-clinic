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

  const [form, setForm] =
    useState({

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

      let updatedPaid =
        Number(
          selectedPatient.totalPaid || 0
        )

      /* FROM WALLET */
      if (
        form.method ===
        'From Wallet'
      ) {

        if (
          currentWallet <
          paymentAmount
        ) {

          alert(
            'Not enough balance in wallet'
          )

          return
        }

        updatedWallet =
          currentWallet -
          paymentAmount

        updatedDue =
          Math.max(
            currentDue -
            paymentAmount,
            0
          )
      }

      /* ADVANCE */
      else if (
        form.paymentType ===
        'Advance Payment'
      ) {

        updatedWallet =
          currentWallet +
          paymentAmount

        updatedPaid =
          updatedPaid +
          paymentAmount
      }

      /* PENDING */
      else if (
        form.paymentType ===
        'Pending Payment'
      ) {

        updatedDue =
          currentDue +
          paymentAmount
      }

      /* NORMAL */
      else {

        updatedPaid =
          updatedPaid +
          paymentAmount

        updatedDue =
          Math.max(
            currentDue -
            paymentAmount,
            0
          )
      }

      const paymentStatus =
        form.paymentType ===
        'Pending Payment'
          ? 'Pending'
          : 'Paid'

      /* SAVE PAYMENT */
      await addPayment({

        ...form,

        status:
          paymentStatus,

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
            updatedPaid
        }
      )

      refresh()

      close()
    }

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

      <div className="
  relative
  w-full
  max-w-2xl
  max-h-[85vh]
  overflow-y-auto
  custom-scrollbar
  bg-white/90
  border
  border-[#ece7ff]
  rounded-[32px]
  p-6
  md:p-7
  backdrop-blur-xl
  shadow-[0_10px_40px_rgba(124,58,237,0.12)]
  mt-2
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
            hover:bg-[#f5f3ff]
            transition-all
            text-[#1f1147]
          "
        >
          <X size={18} />
        </button>

        {/* TITLE */}
        <h2 className="
          text-4xl
          font-bold
          mb-8
          text-[#1f1147]
        ">
          Add Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PATIENT */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
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

              styles={{

                control: (base) => ({
                  ...base,
                  backgroundColor: '#ffffffcc',
                  borderColor: '#ece7ff',
                  minHeight: 56,
                  borderRadius: 18,
                  boxShadow: 'none',
                  paddingLeft: 6
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: '#fff',
                  border: '1px solid #ece7ff',
                  borderRadius: 18,
                  overflow: 'hidden'
                }),

                singleValue: (base) => ({
                  ...base,
                  color: '#1f1147'
                }),

                input: (base) => ({
                  ...base,
                  color: '#1f1147'
                }),

                option: (
                  base,
                  state
                ) => ({
                  ...base,
                  backgroundColor:
                    state.isFocused
                      ? '#f5f3ff'
                      : '#fff',

                  color: '#1f1147'
                }),

                placeholder: (base) => ({
                  ...base,
                  color: '#8c84b3'
                })
              }}
            />
          </div>

          {/* BALANCES */}
          {selectedPatient && (

            <div className="grid grid-cols-2 gap-4">

              {/* Wallet */}
              <div className="
                bg-[#faf8ff]
                border
                border-[#ece7ff]
                rounded-2xl
                p-5
              ">

                <p className="
                  text-[#8c84b3]
                  text-sm
                  mb-2
                ">
                  Wallet Balance
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-cyan-500
                ">
                  ₹{
                    selectedPatient.walletBalance || 0
                  }
                </h2>
              </div>

              {/* Due */}
              <div className="
                bg-[#faf8ff]
                border
                border-[#ece7ff]
                rounded-2xl
                p-5
              ">

                <p className="
                  text-[#8c84b3]
                  text-sm
                  mb-2
                ">
                  Pending Due
                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-amber-500
                ">
                  ₹{
                    selectedPatient.pendingDue || 0
                  }
                </h2>
              </div>
            </div>
          )}

          {/* AMOUNT + DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Amount */}
            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                placeholder="500"
                value={form.amount}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
                required
              />
            </div>

            {/* Date */}
            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Payment Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
                style={{
                  colorScheme: 'light'
                }}
                required
              />
            </div>
          </div>

          {/* TYPE + METHOD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Type */}
            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Payment Type
              </label>

              <select
                name="paymentType"
                value={form.paymentType}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
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

                <option>
                  Pending Payment
                </option>
              </select>
            </div>

            {/* Method */}
            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Payment Method
              </label>

              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
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

                <option>
                  From Wallet
                </option>
              </select>
            </div>
          </div>

          {/* NOTES */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Notes
            </label>

            <textarea
              name="notes"
              rows="4"
              placeholder="Additional payment notes..."
              value={form.notes}
              onChange={handleChange}
              className="
                w-full
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                p-5
                outline-none
                resize-none
                text-[#1f1147]
                placeholder:text-[#8c84b3]
              "
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                text-white
                font-bold
                hover:opacity-90
                shadow-lg
                shadow-violet-500/20
              "
            >

              <IndianRupee size={16} />

              Save Payment
            </button>

            <button
              type="button"
              onClick={close}
              className="
                px-6
                h-14
                rounded-2xl
                border
                border-[#ece7ff]
                bg-white/80
                hover:bg-[#f5f3ff]
                transition-all
                text-[#1f1147]
                font-semibold
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}