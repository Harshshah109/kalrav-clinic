import {
  useState,
  useEffect
} from 'react'

import {
  X,
  UserPlus
} from 'lucide-react'

import {
  addPatient
} from '../../services/patientService'

import {
  getTherapists
} from '../../services/therapistService'

export default function AddPatientModal({
  close,
  refresh
}) {

  const [therapists,
    setTherapists] =
      useState([])

  const [form, setForm] =
    useState({
      firstName: '',
      lastName: '',
      age: '',
      gender: 'Male',
      phone: '',
      condition: 'Articulation Disorder',
      therapist: '',
      notes: ''
    })

  useEffect(() => {
    loadTherapists()
  }, [])

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data || [])
    }

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      await addPatient({
        name:
          `${form.firstName} ${form.lastName}`,

        age:
          form.age,

        gender:
          form.gender,

        phone:
          form.phone,

        condition:
          form.condition,

        therapist:
          form.therapist,

        notes:
          form.notes,

        createdAt:
          new Date()
      })

      refresh()

      close()
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-3xl bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-6 right-6 w-12 h-12 rounded-2xl border border-[#404040] flex items-center justify-center hover:bg-[#252525] transition-all"
        >

          <X size={20} />
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-8">
          Add New Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                First Name *
              </label>

              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
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
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Age
              </label>

              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
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
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
              >

                <option>
                  Male
                </option>

                <option>
                  Female
                </option>

                <option>
                  Other
                </option>
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
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
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
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
            >

              <option>
                Articulation Disorder
              </option>

              <option>
                Stuttering
              </option>

              <option>
                Voice Therapy
              </option>

              <option>
                Language Delay
              </option>
            </select>
          </div>

          {/* Therapist */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Assign Therapist
            </label>

            <select
              name="therapist"
              value={form.therapist}
              onChange={handleChange}
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
            >

              <option value="">
                Select Therapist
              </option>

              {therapists.map((item) => (

                <option
                  key={item.id}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Notes
            </label>

            <textarea
              name="notes"
              rows="5"
              placeholder="Medical history, referral notes..."
              onChange={handleChange}
              className="w-full bg-[#222] border border-[#3a3a3a] rounded-2xl p-5 outline-none resize-none focus:border-[#7ddfc6]"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-14 rounded-2xl bg-[#7ddfc6] text-black font-bold hover:opacity-90 transition-all"
            >

              <UserPlus size={18} />

              Add Patient
            </button>

            <button
              type="button"
              onClick={close}
              className="px-6 h-14 rounded-2xl border border-[#404040] hover:bg-[#252525] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}