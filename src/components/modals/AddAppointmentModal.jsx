import {
  useEffect,
  useState
} from 'react'

import {
  X,
  Check
} from 'lucide-react'

import {
  addAppointment,
  updateAppointment
} from '../../services/appointmentService'

import {
  getPatients
} from '../../services/patientService'

import {
  getTherapists
} from '../../services/therapistService'

export default function AddAppointmentModal({
  close,
  refresh,
  editData,
  isEdit
}) {

  const [patients,
    setPatients] =
      useState([])

  const [therapists,
    setTherapists] =
      useState([])

  const [form, setForm] =
    useState({

      patient:
        editData?.patient || '',

      patientPhone:
        editData?.patientPhone || '',

      date:
        editData?.date || '',

      time:
        editData?.time || '09:00 AM',

      therapist:
        editData?.therapist || '',

      therapy:
        editData?.therapy || 'Articulation Therapy',

      duration:
        editData?.duration || '30 min',

      status:
        editData?.status || 'Pending'
    })

  useEffect(() => {

    loadPatients()

    loadTherapists()

  }, [])

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      setPatients(data || [])
    }

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data || [])
    }

  const handleChange = (e) => {

    const updatedForm = {

      ...form,
      [e.target.name]:
        e.target.value
    }

    /* AUTO SET PHONE */
    if (
      e.target.name === 'patient'
    ) {

      const selectedPatient =
        patients.find(
          (p) =>
            p.name === e.target.value
        )

      updatedForm.patientPhone =
        selectedPatient?.phone || ''
    }

    setForm(updatedForm)
  }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        const selectedPatient =
          patients.find(
            (p) =>
              p.name === form.patient
          )

        const appointmentData = {

          ...form,

          patientPhone:
            selectedPatient?.phone || ''
        }

        if (isEdit) {

          await updateAppointment(
            editData.id,
            appointmentData
          )

        } else {

          await addAppointment({

            ...appointmentData,

            createdAt:
              new Date()
          })
        }

        refresh()

        close()

      } catch (err) {

        console.log(err)

        alert(
          'Error saving appointment'
        )
      }
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-2xl bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 md:p-7 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-11 h-11 rounded-2xl border border-[#404040] flex items-center justify-center hover:bg-[#252525] transition-all"
        >

          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8">

          {isEdit
            ? 'Edit Appointment'
            : 'New Appointment'}
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
              value={form.patient}
              onChange={handleChange}
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
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

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
                required
              />
            </div>

            <div>

              <label className="text-sm text-zinc-300 mb-2 block">
                Time
              </label>

              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
              >

                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:00 PM</option>
                <option>01:00 PM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
                <option>04:00 PM</option>
                <option>05:00 PM</option>
              </select>
            </div>
          </div>

          {/* Therapist */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Therapist
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

          {/* Session Type */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Session Type
            </label>

            <select
              name="therapy"
              value={form.therapy}
              onChange={handleChange}
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
            >

              <option>
                Articulation Therapy
              </option>

              <option>
                Speech Therapy
              </option>

              <option>
                Voice Therapy
              </option>

              <option>
                Stuttering Therapy
              </option>

              <option>
                Language Development
              </option>
            </select>
          </div>

          {/* Duration */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Duration
            </label>

            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
            >

              <option>30 min</option>
              <option>45 min</option>
              <option>60 min</option>
            </select>
          </div>

          {/* Status */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl px-5 outline-none focus:border-[#7ddfc6]"
            >

              <option>
                Pending
              </option>

              <option>
                Confirmed
              </option>

              <option>
                Cancelled
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-14 rounded-2xl bg-[#dffff2] text-black font-bold hover:opacity-90 transition-all"
            >

              <Check size={18} />

              {isEdit
                ? 'Save Changes'
                : 'Book Appointment'}
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