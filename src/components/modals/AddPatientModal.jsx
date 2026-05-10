import { useState } from 'react'
import { X, UserPlus } from 'lucide-react'

import { addPatient } from '../../services/patientService'

export default function AddPatientModal({
  close,
  refresh
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: 'Male',
    phone: '',
    condition: 'Articulation Disorder',
    therapist: 'Dr. Meera Pillai',
    notes: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await addPatient({
      name: `${form.firstName} ${form.lastName}`,
      age: form.age,
      gender: form.gender,
      phone: form.phone,
      condition: form.condition,
      therapist: form.therapist,
      notes: form.notes,
      createdAt: new Date()
    })

    refresh()
    close()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
      
      <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#1b1b1b] border border-[#343434] rounded-3xl p-5 md:p-6 relative">
        
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#404040] flex items-center justify-center hover:bg-[#252525] transition-all"
        >
          <X size={18} />
        </button>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Add New Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                First Name *
              </label>

              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Last Name *
              </label>

              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Age
              </label>

              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleChange}
                className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Gender
              </label>

              <select
                name="gender"
                onChange={handleChange}
                className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Phone *
            </label>

            <input
              type="text"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
              required
            />
          </div>

          {/* Condition */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Condition / Diagnosis
            </label>

            <select
              name="condition"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
            >
              <option>Articulation Disorder</option>
              <option>Stuttering</option>
              <option>Voice Therapy</option>
              <option>Language Delay</option>
            </select>
          </div>

          {/* Therapist */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Assign Therapist
            </label>

            <select
              name="therapist"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none focus:border-[#7ddfc6]"
            >
              <option>Dr. Meera Pillai</option>
              <option>Dr. Suresh Rao</option>
              <option>Dr. Priya Kapoor</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Notes
            </label>

            <textarea
              name="notes"
              rows="4"
              placeholder="Medical history, referral notes..."
              onChange={handleChange}
              className="w-full bg-[#222] border border-[#3a3a3a] rounded-xl p-4 outline-none resize-none focus:border-[#7ddfc6]"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 h-12 rounded-xl bg-[#7ddfc6] text-black font-bold hover:opacity-90 transition-all"
            >
              <UserPlus size={16} />
              Add Patient
            </button>

            <button
              type="button"
              onClick={close}
              className="px-5 h-12 rounded-xl border border-[#404040] hover:bg-[#252525] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}