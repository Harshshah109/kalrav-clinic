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

  const [form, setForm] =
    useState({

      name:
        patient?.name || '',

      age:
        patient?.age || '',

      gender:
        patient?.gender || '',

      phone:
        patient?.phone || '',

      parentName:
        patient?.parentName || '',

      address:
        patient?.address || '',

      condition:
        [
          'Articulation Disorder',
          'Speech Delay',
          'Autism Spectrum Disorder',
          'Stuttering',
          'Voice Disorder',
          'Language Disorder'
        ].includes(patient?.condition)
          ? patient.condition
          : 'Other',

      otherCondition:
        [
          'Articulation Disorder',
          'Speech Delay',
          'Autism Spectrum Disorder',
          'Stuttering',
          'Voice Disorder',
          'Language Disorder'
        ].includes(patient?.condition)
          ? ''
          : patient?.condition || '',

      notes:
        patient?.notes || ''
    })

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

      try {

        await updatePatient(
          patient.id,
          {

            name:
              form.name,

            age:
              form.age,

            gender:
              form.gender,

            phone:
              form.phone,

            parentName:
              form.parentName,

            address:
              form.address,

            condition:
              form.condition === 'Other'
                ? form.otherCondition
                : form.condition,

            notes:
              form.notes
          }
        )

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          'Error updating patient'
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
          Edit Patient
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

              {/* Name */}
              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Patient Name *
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
                  Age *
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

              {/* Gender */}
              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                >

                  <option value="">
                    Select Gender
                  </option>

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

              {/* Phone */}
              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                />
              </div>

              {/* Parent */}
              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Parent / Guardian Name
                </label>

                <input
                  type="text"
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                />
              </div>

              {/* Condition */}
              <div>

                <label className="text-sm text-zinc-300 mb-2 block">
                  Condition
                </label>

                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                >

                  <option>
                    Articulation Disorder
                  </option>

                  <option>
                    Speech Delay
                  </option>

                  <option>
                    Autism Spectrum Disorder
                  </option>

                  <option>
                    Stuttering
                  </option>

                  <option>
                    Voice Disorder
                  </option>

                  <option>
                    Language Disorder
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            {/* Other Condition */}
            {form.condition === 'Other' && (

              <div className="mt-4">

                <label className="text-sm text-zinc-300 mb-2 block">
                  Specify Condition
                </label>

                <input
                  type="text"
                  name="otherCondition"
                  value={form.otherCondition}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                />
              </div>
            )}

            {/* Address */}
            <div className="mt-4">

              <label className="text-sm text-zinc-300 mb-2 block">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#222] border border-[#3a3a3a] rounded-xl px-4 py-3 outline-none resize-none"
              />
            </div>

            {/* Notes */}
            <div className="mt-4">

              <label className="text-sm text-zinc-300 mb-2 block">
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Additional patient information..."
                className="w-full bg-[#222] border border-[#3a3a3a] rounded-xl px-4 py-3 outline-none resize-none"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#dffff2] text-black font-bold hover:opacity-90 transition-all"
            >

              <Save size={16} />

              Save Changes
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