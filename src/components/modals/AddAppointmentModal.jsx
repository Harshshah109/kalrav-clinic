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

import Select from 'react-select'

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
    <div className="
      fixed
      inset-0
      z-50
      bg-black/40
      backdrop-blur-md
      flex
      items-center
      justify-center
      p-3
    ">

      <div className="
        w-full
        max-w-2xl
        bg-white/90
        border
        border-[#ece7ff]
        rounded-[32px]
        p-6
        md:p-7
        relative
        max-h-[90vh]
        overflow-y-auto
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(124,58,237,0.12)]
      ">

        {/* Close */}
        <button
          onClick={close}
          className="
            absolute
            top-5
            right-5
            w-11
            h-11
            rounded-2xl
            border
            border-[#ece7ff]
            flex
            items-center
            justify-center
            hover:bg-[#f5f3ff]
            transition-all
            text-[#1f1147]
          "
        >

          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="
          text-4xl
          font-bold
          mb-8
          text-[#1f1147]
        ">

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

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Patient
            </label>

            <Select
              options={patients.map((patient) => ({
                value: patient.name,
                label: patient.name
              }))}

              value={
                form.patient
                  ? {
                      value: form.patient,
                      label: form.patient
                    }
                  : null
              }

              onChange={(selected) => {

                const selectedPatient =
                  patients.find(
                    (p) =>
                      p.name === selected.value
                  )

                setForm({
                  ...form,

                  patient:
                    selected.value,

                  patientPhone:
                    selectedPatient?.phone || ''
                })
              }}

              placeholder="Search patient..."

              styles={{

                control: (base) => ({
                  ...base,
                  backgroundColor: '#ffffffcc',
                  borderColor: '#ece7ff',
                  minHeight: 56,
                  borderRadius: 18,
                  boxShadow: 'none',
                  paddingLeft: 6
                }),

                menu: (base) => ({
                  ...base,
                  backgroundColor: '#ffffff',
                  border: '1px solid #ece7ff',
                  borderRadius: 18,
                  overflow: 'hidden'
                }),

                singleValue: (base) => ({
                  ...base,
                  color: '#1f1147'
                }),

                input: (base) => ({
                  ...base,
                  color: '#1f1147'
                }),

                option: (
                  base,
                  state
                ) => ({
                  ...base,
                  backgroundColor:
                    state.isFocused
                      ? '#f5f3ff'
                      : '#fff',

                  color: '#1f1147',
                  cursor: 'pointer'
                }),

                placeholder: (base) => ({
                  ...base,
                  color: '#8c84b3'
                })
              }}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
                style={{
                  colorScheme: 'light'
                }}
                required
              />
            </div>

            <div>

              <label className="
                text-sm
                text-[#7c6ca8]
                font-medium
                mb-2
                block
              ">
                Time
              </label>

              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="
                  w-full
                  h-14
                  bg-white/80
                  border
                  border-[#ece7ff]
                  rounded-2xl
                  px-5
                  outline-none
                  text-[#1f1147]
                "
              >

                {Array.from({ length: 49 }, (_, index) => {

                  const totalMinutes =
                    9 * 60 + index * 15

                  const hours =
                    Math.floor(totalMinutes / 60)

                  const minutes =
                    totalMinutes % 60

                  const formattedHours =
                    hours % 12 === 0
                      ? 12
                      : hours % 12

                  const ampm =
                    hours >= 12
                      ? 'PM'
                      : 'AM'

                  const time =
                    `${formattedHours}:${String(
                      minutes
                    ).padStart(2, '0')} ${ampm}`

                  return (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Therapist */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Therapist
            </label>

            <select
              name="therapist"
              value={form.therapist}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
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

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Session Type
            </label>

            <select
              name="therapy"
              value={form.therapy}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
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

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Duration
            </label>

            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
            >

              <option>30 min</option>
              <option>45 min</option>
              <option>60 min</option>
            </select>
          </div>

          {/* Status */}
          <div>

            <label className="
              text-sm
              text-[#7c6ca8]
              font-medium
              mb-2
              block
            ">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                w-full
                h-14
                bg-white/80
                border
                border-[#ece7ff]
                rounded-2xl
                px-5
                outline-none
                text-[#1f1147]
              "
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
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-500
                text-white
                font-bold
                shadow-lg
                shadow-violet-500/20
                hover:opacity-90
                transition-all
              "
            >

              <Check size={18} />

              {isEdit
                ? 'Save Changes'
                : 'Book Appointment'}
            </button>

            <button
              type="button"
              onClick={close}
              className="
                px-6
                h-14
                rounded-2xl
                border
                border-[#ece7ff]
                bg-white/80
                hover:bg-[#f5f3ff]
                transition-all
                text-[#1f1147]
                font-semibold
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}