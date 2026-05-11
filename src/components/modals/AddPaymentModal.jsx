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
    date: '',
    notes: ''
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

          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Patient
            </label>

            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none"
              >
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

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
