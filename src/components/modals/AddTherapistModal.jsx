import { useState } from 'react'

import {
  X,
  Plus,
  Save
} from 'lucide-react'

import {
  addTherapist,
  updateTherapist
} from '../../services/therapistService'

export default function AddTherapistModal({
  close,
  refresh,
  editData,
  isEdit
}) {

  const [form, setForm] = useState({

    firstName:
      editData?.name?.split(' ')[0] || '',

    lastName:
      editData?.name?.split(' ').slice(1).join(' ') || '',

    phone:
      editData?.phone || '',

    email:
      editData?.email || '',

    role:
      editData?.role || '',

    experience:
      editData?.experience || '',

    qualification:
      editData?.qualification || '',

    specialization: '',

    availability:
      editData?.availability || [],

    startTime:
      editData?.startTime || '09:00',

    endTime:
      editData?.endTime || '17:00',

    sessionsPerDay:
      editData?.sessionsPerDay || '6',

    status:
      editData?.status || 'Active',

    notes:
      editData?.notes || ''
  })

  const [specializations,
    setSpecializations] =
      useState(

        editData?.specialization
          ? editData.specialization.split(', ')
          : []
      )

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const addSpecialization = () => {

    if (!form.specialization)
      return

    if (
      specializations.includes(
        form.specialization
      )
    ) return

    setSpecializations([
      ...specializations,
      form.specialization
    ])

    setForm({
      ...form,
      specialization: ''
    })
  }

  const removeSpecialization =
    (item) => {

      setSpecializations(

        specializations.filter(
          (spec) =>
            spec !== item
        )
      )
    }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      const therapistData = {

        name:
          `${form.firstName} ${form.lastName}`,

        phone:
          form.phone,

        email:
          form.email,

        role:
          form.role,

        experience:
          form.experience,

        qualification:
          form.qualification,

        specialization:
          specializations.join(', '),

        availability:
          form.availability,

        startTime:
          form.startTime,

        endTime:
          form.endTime,

        sessionsPerDay:
          form.sessionsPerDay,

        status:
          form.status,

        notes:
          form.notes
      }

      try {

        if (isEdit) {

          await updateTherapist(
            editData.id,
            therapistData
          )

        } else {

          await addTherapist({
            ...therapistData,
            createdAt:
              new Date()
          })
        }

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          err.message ||
          'Error saving therapist'
        )
      }
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 md:p-7 relative">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#404040] flex items-center justify-center hover:bg-[#252525]"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8">

          {isEdit
            ? 'Edit Therapist'
            : 'Add New Therapist'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* PERSONAL INFO */}
          <div>

            <h3 className="text-xs tracking-widest text-zinc-500 font-bold mb-5">
              PERSONAL INFO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  First Name *
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
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
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                  required
                />
              </div>

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
                />
              </div>

              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Email (Optional)
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                />
              </div>

              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Role / Title
                </label>

                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                />
              </div>

              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Experience
                </label>

                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                />
              </div>
            </div>

            <div className="mt-4">

              <label className="text-sm text-zinc-300 mb-2 block">
                Qualification
              </label>

              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              />
            </div>
          </div>

          {/* SPECIALIZATION */}
          <div>

            <h3 className="text-xs tracking-widest text-zinc-500 font-bold mb-5">
              SPECIALIZATIONS
            </h3>

            <div className="flex gap-3">

              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="flex-1 h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              >

                <option value="">
                  — Add specialization —
                </option>

                <option>
                  Articulation Disorder
                </option>

                <option>
                  Voice Therapy
                </option>

                <option>
                  Speech Therapy
                </option>

                <option>
                  Stuttering Therapy
                </option>

                <option>
                  Language Development
                </option>
              </select>

              <button
                type="button"
                onClick={addSpecialization}
                className="w-12 h-12 rounded-xl border border-[#3a3a3a] flex items-center justify-center hover:bg-[#222]"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">

              {specializations.map((item, index) => (

                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    removeSpecialization(item)
                  }
                  className="px-3 py-2 rounded-full bg-[#dffff2] text-black text-sm font-semibold"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div>

            <h3 className="text-xs tracking-widest text-zinc-500 font-bold mb-5">
              STATUS
            </h3>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
            >

              <option>
                Active
              </option>

              <option>
                On Leave
              </option>

              <option>
                Inactive
              </option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#dffff2] text-black font-bold hover:opacity-90 transition-all"
            >

              <Save size={16} />

              {isEdit
                ? 'Save Changes'
                : 'Create Therapist'}
            </button>

            <button
              type="button"
              onClick={close}
              className="px-6 h-12 rounded-xl border border-[#404040] hover:bg-[#252525] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}