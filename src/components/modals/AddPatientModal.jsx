import { useState } from 'react'

import {
  X,
  Save
} from 'lucide-react'

import {
  addPatient
} from '../../services/patientService'

export default function AddPatientModal({
  close,
  refresh
}) {

  const [form, setForm] =
    useState({

      name: '',
      age: '',
      gender: '',
      phone: '',
      parentName: '',
      address: '',
      condition: '',
      otherCondition: '',

      category: 'Assessment',

      notes: ''
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

        await addPatient({

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

          category:
            form.category,

          notes:
            form.notes,

          createdAt:
            new Date()
        })

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          'Error adding patient'
        )
      }
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 md:p-7 relative">

        <button
          onClick={close}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#404040] flex items-center justify-center hover:bg-[#252525]"
        >
          <X size={18} />
        </button>

        <h2 className="text-3xl font-bold mb-8">
          Add New Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          <div>

            <h3 className="text-xs tracking-widest text-zinc-500 font-bold mb-5">
              PERSONAL INFO
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

              <div>
                <label className="text-sm text-zinc-300 mb-2 block">
                  Condition
                </label>

                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                  required
                >

                  <option value="">
                    Select Condition
                  </option>

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
                  placeholder="Enter custom condition"
                  className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
                  required
                />
              </div>
            )}

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

            {/* CATEGORY */}
            <div className="mt-4">

              <label className="text-sm text-zinc-300 mb-2 block">
                Patient Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              >

                <option>
                  Active
                </option>

                <option>
                  Assessment
                </option>

                <option>
                  Finished
                </option>
              </select>
            </div>

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

          <div className="flex flex-col md:flex-row gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#dffff2] text-black font-bold hover:opacity-90 transition-all"
            >

              <Save size={16} />

              Add Patient
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