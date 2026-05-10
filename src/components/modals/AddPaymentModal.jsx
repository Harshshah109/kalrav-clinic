import { useEffect, useState } from 'react'

import {
  X,
  IndianRupee
} from 'lucide-react'

import { addPayment }
  from '../../services/paymentService'

import { getPatients }
  from '../../services/patientService'

export default function AddPaymentModal({
  close,
  refresh
}) {

  const [patients, setPatients] =
    useState([])

  const [form, setForm] = useState({
    patient: '',
    amount: '',
    method: 'Cash',
    status: 'Paid',
    date: ''
  })

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {

    const data =
      await getPatients()

    setPatients(data)
  }

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    await addPayment({
      ...form,
      createdAt: new Date()
    })

    refresh()
    close()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-xl bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 relative">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#404040] flex items-center justify-center hover:bg-[#252525]"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8">
          Add Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Patient */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Patient
            </label>

            <select
              name="patient"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            >
              <option value="">
                Select Patient
              </option>

              {patients.map((patient) => (
                <option
                  key={patient.id}
                  value={patient.name}
                >
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Amount
            </label>

            <input
              type="number"
              name="amount"
              placeholder="500"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Method */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Payment Method
            </label>

            <select
              name="method"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>
          </div>

          {/* Status */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Status
            </label>

            <select
              name="status"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>

          {/* Date */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Payment Date
            </label>

            <input
              type="date"
              name="date"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#dffff2] text-black font-bold hover:opacity-90"
            >
              <IndianRupee size={16} />

              Save Payment
            </button>

            <button
              type="button"
              onClick={close}
              className="px-6 h-12 rounded-xl border border-[#404040] hover:bg-[#252525]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}