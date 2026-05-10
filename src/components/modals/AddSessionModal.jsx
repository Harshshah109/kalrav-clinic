import {
  useEffect,
  useState
} from 'react'

import {
  X,
  ClipboardPen
} from 'lucide-react'

import {
  addSession
} from '../../services/sessionService'

import {
  getTherapists
} from '../../services/therapistService'

export default function AddSessionModal({
  patient,
  close,
  refresh
}) {

  const [therapists, setTherapists] =
    useState([])

  const [form, setForm] =
    useState({
      therapist: '',
      notes: '',
      progress: '',
      nextGoal: '',
      sessionDate: '',
      sessionTime: ''
    })

  useEffect(() => {
    loadTherapists()
  }, [])

  const loadTherapists =
    async () => {

      const data =
        await getTherapists()

      setTherapists(data)
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

      await addSession({

        ...form,

        patient:
          patient.name,

        createdAt:
          new Date()
      })

      refresh()
      close()
    }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">

      <div className="w-full max-w-2xl bg-[#1b1b1b] border border-[#343434] rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl border border-[#404040] flex items-center justify-center hover:bg-[#252525]"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">
          Add Session Note
        </h2>

        <p className="text-zinc-400 mb-8">
          {patient.name}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Therapist */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Therapist
            </label>

            <select
              name="therapist"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
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

          {/* Date */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Session Date
            </label>

            <input
              type="date"
              name="sessionDate"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Time */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Session Time
            </label>

            <input
              type="time"
              name="sessionTime"
              onChange={handleChange}
              className="w-full h-12 bg-[#222] border border-[#3a3a3a] rounded-xl px-4 outline-none"
              required
            />
          </div>

          {/* Notes */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Session Notes
            </label>

            <textarea
              name="notes"
              rows="5"
              onChange={handleChange}
              placeholder="Describe today's therapy session..."
              className="w-full bg-[#222] border border-[#3a3a3a] rounded-xl px-4 py-3 outline-none resize-none"
              required
            />
          </div>

          {/* Progress */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Progress
            </label>

            <textarea
              name="progress"
              rows="3"
              onChange={handleChange}
              placeholder="Patient showed improvement in..."
              className="w-full bg-[#222] border border-[#3a3a3a] rounded-xl px-4 py-3 outline-none resize-none"
            />
          </div>

          {/* Goal */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Next Goal
            </label>

            <textarea
              name="nextGoal"
              rows="3"
              onChange={handleChange}
              placeholder="Next session focus..."
              className="w-full bg-[#222] border border-[#3a3a3a] rounded-xl px-4 py-3 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#dffff2] text-black font-bold hover:opacity-90"
            >
              <ClipboardPen size={18} />

              Save Session
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