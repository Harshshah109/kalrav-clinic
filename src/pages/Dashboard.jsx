import { useEffect, useState } from 'react'

import StatsCards
  from '../components/dashboard/StatsCards'

import TodaySchedule
  from '../components/dashboard/TodaySchedule'

import TeamOverview
  from '../components/dashboard/TeamOverview'

import QuickActions
  from '../components/dashboard/QuickActions'

import {
  getAppointments
} from '../services/appointmentService'

import {
  getPatients
} from '../services/patientService'

import {
  getTherapists
} from '../services/therapistService'

import {
  getPayments
} from '../services/paymentService'

export default function Dashboard() {

  const [appointments, setAppointments] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [therapists, setTherapists] =
    useState([])

  const [revenue, setRevenue] =
    useState(0)

  useEffect(() => {
    loadDashboardData()
    loadRevenue()
  }, [])

  const loadRevenue =
    async () => {

      const payments =
        await getPayments()

      const total =
        (payments || [])
          .filter(
            (item) =>
              item.status === 'Paid'
          )
          .reduce(
            (sum, item) =>
              sum + Number(item.amount || 0),
            0
          )

      setRevenue(total)
    }

  const loadDashboardData =
    async () => {

      const appointmentData =
        await getAppointments()

      const patientData =
        await getPatients()

      const therapistData =
        await getTherapists()

      setAppointments(
        appointmentData || []
      )

      setPatients(
        patientData || []
      )

      setTherapists(
        therapistData || []
      )
    }

  const greeting = () => {

    const hour =
      new Date().getHours()

    if (hour < 12)
      return 'Good Morning'

    if (hour < 18)
      return 'Good Afternoon'

    return 'Good Evening'
  }

  const today =
    `${new Date().getFullYear()}-${
      String(
        new Date().getMonth() + 1
      ).padStart(2, '0')
    }-${
      String(
        new Date().getDate()
      ).padStart(2, '0')
    }`

  return (
    <div className="pb-10">

      {/* Greeting */}
      <div className="mb-8">

        <h1 className="text-5xl font-bold mb-3">
          {greeting()}
        </h1>

        <p className="text-zinc-400 text-lg">
          Kalrav Speech Therapy Clinic • {' '}
          {new Date().toDateString()}
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        appointments={appointments}
        patients={patients}
        therapists={therapists}
        revenue={revenue}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Schedule */}
        <div className="xl:col-span-2">

          <TodaySchedule
            appointments={
              (appointments || []).filter(
                (item) =>
                  item.date === today
              )
            }
          />
        </div>

        {/* Right */}
        <div className="space-y-6">

          <TeamOverview
            therapists={therapists}
          />

          <QuickActions />
        </div>
      </div>
    </div>
  )
}