import {
  Plus,
  Clock3,
  BriefcaseMedical,
  Pencil
} from 'lucide-react'

import { useEffect, useState } from 'react'

import {
  getTherapists,
  updateTherapist
} from '../services/therapistService'

import AddTherapistModal
  from '../components/modals/AddTherapistModal'

export default function Therapists() {

  const [therapists, setTherapists] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [editData, setEditData] =
    useState(null)

  const [openEdit, setOpenEdit] =
    useState(false)

  const [openProfile, setOpenProfile] =
    useState(false)

  const [profileData, setProfileData] =
    useState(null)

  useEffect(() => {
    loadTherapists()
  }, [])

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data || [])
    }

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            Therapists
          </h1>

          <p className="text-zinc-400">
            Manage clinic therapists and availability
          </p>
        </div>

        <button
          onClick={() =>
            setOpenModal(true)
          }
          className="flex items-center justify-center gap-2 border border-[#3a3a3a] rounded-2xl px-6 py-4 hover:bg-[#1c1c1c] transition-all"
        >

          <Plus size={20} />

          <span className="font-semibold">
            Add Therapist
          </span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {therapists.map((therapist) => (

          <div
            key={therapist.id}
            className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6"
          >

            {/* Top */}
            <div className="flex items-start justify-between mb-6">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full bg-[#dffff2] text-black flex items-center justify-center text-lg font-bold uppercase">

                  {(therapist.name || 'TH')
                    .slice(0, 2)}
                </div>

                <div>

                  <h2 className="text-2xl font-bold mb-1">
                    {therapist.name}
                  </h2>

                  <p className="text-zinc-400">
                    {therapist.role || 'Therapist'}
                  </p>
                </div>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  therapist.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : therapist.status === 'On Leave'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >

                {therapist.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">

              <div className="flex items-center gap-3 text-zinc-300">

                <BriefcaseMedical size={18} />

                <span>
                  Experience: {therapist.experience || 0} years
                </span>
              </div>

              <div className="flex items-center gap-3 text-zinc-300">

                <Clock3 size={18} />

                <span>
                  {therapist.phone || 'No phone'}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">

              {/* View */}
              <button
                onClick={() => {

                  setProfileData(
                    therapist
                  )

                  setOpenProfile(true)
                }}
                className="flex-1 py-3 rounded-2xl border border-[#383838] hover:bg-[#222] transition-all"
              >
                View Profile
              </button>

              {/* Edit */}
              <button
                onClick={() => {

                  setEditData(
                    therapist
                  )

                  setOpenEdit(true)
                }}
                className="w-12 h-12 rounded-2xl border border-[#383838] flex items-center justify-center hover:bg-[#222] transition-all"
              >

                <Pencil size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {openModal && (

        <AddTherapistModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadTherapists}
        />
      )}

      {/* PROFILE MODAL */}
      {openProfile && profileData && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

          <div className="w-full max-w-4xl bg-[#171717] border border-[#2f2f2f] rounded-3xl p-7">

            {/* Header */}
            <div className="flex items-start justify-between mb-8">

              <div className="flex items-center gap-5">

                <div className="w-24 h-24 rounded-full bg-[#dffff2] text-black flex items-center justify-center text-3xl font-bold uppercase">

                  {(profileData.name || 'TH')
                    .slice(0, 2)}
                </div>

                <div>

                  <h2 className="text-4xl font-bold mb-2">
                    {profileData.name}
                  </h2>

                  <p className="text-zinc-400 text-lg">
                    {profileData.role || 'Therapist'}
                  </p>

                  <span className="inline-block mt-3 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">

                    {profileData.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setOpenProfile(false)
                }
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-5">

                <p className="text-zinc-500 text-sm mb-2">
                  Phone
                </p>

                <h3 className="text-lg font-semibold">
                  {profileData.phone || 'N/A'}
                </h3>
              </div>

              <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-5">

                <p className="text-zinc-500 text-sm mb-2">
                  Email
                </p>

                <h3 className="text-lg font-semibold break-all">
                  {profileData.email || 'N/A'}
                </h3>
              </div>

              <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-5">

                <p className="text-zinc-500 text-sm mb-2">
                  Qualification
                </p>

                <h3 className="text-lg font-semibold">
                  {profileData.qualification || 'N/A'}
                </h3>
              </div>

              <div className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-5">

                <p className="text-zinc-500 text-sm mb-2">
                  Experience
                </p>

                <h3 className="text-lg font-semibold">
                  {profileData.experience || 0} years
                </h3>
              </div>
            </div>

            {/* Specializations */}
            <div className="mt-6 bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-5">

              <p className="text-zinc-500 text-sm mb-4">
                Specializations
              </p>

              <div className="flex flex-wrap gap-3">

                {(profileData.specializations || []).map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-[#dffff2] text-black font-semibold text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-5">

              <p className="text-zinc-500 text-sm mb-3">
                Notes
              </p>

              <p className="text-zinc-300 leading-relaxed">
                {profileData.notes || 'No notes added'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {openEdit && editData && (

        <AddTherapistModal
          editData={editData}
          isEdit={true}
          close={() =>
            setOpenEdit(false)
          }
          refresh={loadTherapists}
        />
      )}
    </div>
  )
}