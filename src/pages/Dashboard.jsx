import { useEffect, useState } from 'react'

import StatsCards
  from '../components/dashboard/StatsCards'

import TodaySchedule
  from '../components/dashboard/TodaySchedule'

import {
  getAppointments
} from '../services/appointmentService'

export default function Dashboard() {

  const [appointments, setAppointments] =
    useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData =
    async () => {

      const appointmentData =
        await getAppointments()

      setAppointments(
        appointmentData || []
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
      />

      {/* Schedule */}
      <TodaySchedule
        appointments={
          (appointments || []).filter(
            (item) =>
              item.date === today
          )
        }
      />
    </div>
  )
}