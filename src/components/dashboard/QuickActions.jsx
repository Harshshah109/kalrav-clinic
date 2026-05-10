import {
  useState
} from 'react'

import {
  Users,
  CalendarDays,
  Wallet,
  Stethoscope
} from 'lucide-react'

import AddPatientModal
  from '../modals/AddPatientModal'

import AddAppointmentModal
  from '../modals/AddAppointmentModal'

import AddTherapistModal
  from '../modals/AddTherapistModal'

import AddPaymentModal
  from '../modals/AddPaymentModal'

export default function QuickActions() {

  const [openPatient,
    setOpenPatient] =
      useState(false)

  const [openAppointment,
    setOpenAppointment] =
      useState(false)

  const [openTherapist,
    setOpenTherapist] =
      useState(false)

  const [openPayment,
    setOpenPayment] =
      useState(false)

  const actions = [
    {
      title: 'Add Patient',
      icon: Users,
      action: () =>
        setOpenPatient(true)
    },
    {
      title: 'New Appointment',
      icon: CalendarDays,
      action: () =>
        setOpenAppointment(true)
    },
    {
      title: 'Add Therapist',
      icon: Stethoscope,
      action: () =>
        setOpenTherapist(true)
    },
    {
      title: 'Add Payment',
      icon: Wallet,
      action: () =>
        setOpenPayment(true)
    }
  ]

  return (
    <>
      <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl p-6">

        {/* Header */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>
        </div>

        {/* Actions */}
        <div className="space-y-4">

          {actions.map((item) => {

            const Icon = item.icon

            return (
              <button
                key={item.title}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border border-[#2f2f2f] hover:bg-[#1f1f1f] hover:border-[#3a3a3a] transition-all"
              >

                <div className="w-12 h-12 rounded-2xl bg-[#222] flex items-center justify-center">

                  <Icon size={20} />
                </div>

                <span className="font-semibold text-lg">
                  {item.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modals */}

      {openPatient && (
        <AddPatientModal
          close={() =>
            setOpenPatient(false)
          }
        />
      )}

      {openAppointment && (
        <AddAppointmentModal
          close={() =>
            setOpenAppointment(false)
          }
        />
      )}

      {openTherapist && (
        <AddTherapistModal
          close={() =>
            setOpenTherapist(false)
          }
        />
      )}

      {openPayment && (
        <AddPaymentModal
          close={() =>
            setOpenPayment(false)
          }
        />
      )}
    </>
  )
}