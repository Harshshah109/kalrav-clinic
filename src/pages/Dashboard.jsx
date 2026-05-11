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

export default function Dashboard({
  role
}) {

  const [appointments, setAppointments] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [therapists, setTherapists] =
    useState([])

  const [payments, setPayments] =
    useState([])

  const [filter, setFilter] =
    useState('monthly')

  useEffect(() => {

    loadDashboardData()

  }, [])

  const loadDashboardData =
    async () => {

      const appointmentData =
        await getAppointments()

      const patientData =
        await getPatients()

      const therapistData =
        await getTherapists()

      const paymentData =
        await getPayments()

      setAppointments(
        appointmentData || []
      )

      setPatients(
        patientData || []
      )

      setTherapists(
        therapistData || []
      )

      setPayments(
        paymentData || []
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

  const filterPayments = () => {

    const now =
      new Date()

    return payments.filter(
      (item) => {

        if (
          item.status !== 'Paid'
        ) return false

        if (!item.date)
          return false

        const paymentDate =
          item.date?.seconds
            ? new Date(
                item.date.seconds * 1000
              )
            : new Date(item.date)

        if (filter === 'daily') {

          return (
            paymentDate.toDateString() ===
            now.toDateString()
          )
        }

        if (filter === 'weekly') {

          const diff =
            (now - paymentDate) /
            (1000 * 60 * 60 * 24)

          return diff <= 7
        }

        if (filter === 'monthly') {

          return (
            paymentDate.getMonth() ===
              now.getMonth() &&
            paymentDate.getFullYear() ===
              now.getFullYear()
          )
        }

        if (filter === 'yearly') {

          return (
            paymentDate.getFullYear() ===
            now.getFullYear()
          )
        }

        return true
      }
    )
  }

  const filteredPayments =
    filterPayments()

  const totalRevenue =
    filteredPayments.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    )

  const cashRevenue =
    filteredPayments
      .filter(
        (item) =>
          item.method === 'Cash'
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )

  const digitalRevenue =
    filteredPayments
      .filter(
        (item) =>
          item.method !== 'Cash'
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )

  const pendingRevenue =
    payments
      .filter(
        (item) =>
          item.status === 'Pending'
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      )

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

      {/* Revenue Filter */}
      <div className="flex flex-wrap gap-3 mb-6">

        {[
          'daily',
          'weekly',
          'monthly',
          'yearly'
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`px-5 h-12 rounded-2xl border transition-all capitalize ${
              filter === item
                ? 'bg-[#dffff2] text-black border-[#dffff2]'
                : 'border-[#2f2f2f] bg-[#171717] text-zinc-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Stats */}
      <StatsCards
  appointments={appointments}
  patients={patients}
  therapists={therapists}

  revenue={
    role === 'admin'
      ? totalRevenue
      : 0
  }

  cashRevenue={
    role === 'admin'
      ? cashRevenue
      : 0
  }

  digitalRevenue={
    role === 'admin'
      ? digitalRevenue
      : 0
  }

  pendingRevenue={
    role === 'admin'
      ? pendingRevenue
      : 0
  }

  revenueFilter={filter}

  role={role}
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