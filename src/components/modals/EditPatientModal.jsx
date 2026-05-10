import { useState } from 'react'

import {
  X,
  Save
} from 'lucide-react'

import {
  updatePatient
} from '../../services/patientService'

export default function EditPatientModal({
  patient,
  close,
  refresh
}) {

  const [form, setForm] = useState({
    name: patient.name || '',
    age: patient.age || '',
    condition: patient.condition || '',
    phone: patient.phone || ''
  })

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    await updatePatient(
      patient.id,
      form
    )

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
          Edit Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Patient Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Age */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Age
            </label>

            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Condition */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Condition
            </label>

            <input
              type="text"
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
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
              <Save size={16} />

              Save Changes
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