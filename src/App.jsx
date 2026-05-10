import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import { useEffect, useState } from 'react'
import CalendarPage from './pages/CalendarPage'

import {
  onAuthStateChanged
} from 'firebase/auth'

import { auth } from './services/firebase'

import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Patients from './pages/Patients'
import Therapists from './pages/Therapists'
import Payments from './pages/Payments'
import Messages from './pages/Messages'

import Login from './pages/Login'

export default function App() {

  const [user, setUser] = useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser)
          setLoading(false)
        }
      )

    return () => unsubscribe()

  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <Login
        onLogin={() => {}}
      />
    )
  }

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Layout />}
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="appointments"
            element={<Appointments />}
          />

          <Route
            path="patients"
            element={<Patients />}
          />

          <Route
            path="therapists"
            element={<Therapists />}
          />

          <Route
            path="payments"
            element={<Payments />}
          />
          <Route
  path="/calendar"
  element={<CalendarPage />}
/>

          <Route
            path="messages"
            element={<Messages />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}