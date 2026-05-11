import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import {
  useEffect,
  useState
} from 'react'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import {
  auth,
  db
} from './services/firebase'

import Layout
  from './components/layout/Layout'

import Dashboard
  from './pages/Dashboard'

import Appointments
  from './pages/Appointments'

import Patients
  from './pages/Patients'

import Therapists
  from './pages/Therapists'

import Payments
  from './pages/Payments'

import Messages
  from './pages/Messages'

import CalendarPage
  from './pages/CalendarPage'

import Login
  from './pages/Login'

export default function App() {

  const [user, setUser] =
    useState(null)

  const [role, setRole] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        async (currentUser) => {

          if (!currentUser) {

            setUser(null)
            setRole(null)
            setLoading(false)

            return
          }

          const userDoc =
            await getDoc(
              doc(
                db,
                'users',
                currentUser.uid
              )
            )

          const userRole =
            userDoc.exists()
              ? userDoc.data().role
              : 'therapist'

          setUser(currentUser)

          setRole(userRole)

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
          element={
            <Layout role={role} />
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Appointments */}
          <Route
            path="appointments"
            element={
              <Appointments
                role={role}
              />
            }
          />

          {/* Patients */}
          <Route
            path="patients"
            element={
              <Patients
                role={role}
              />
            }
          />

          {/* Calendar */}
          <Route
            path="calendar"
            element={<CalendarPage />}
          />

          {/* Therapist Management */}
          {
            role === 'admin' && (

              <Route
                path="therapists"
                element={<Therapists />}
              />
            )
          }

          {/* Payments */}
          {
            role === 'admin' && (

              <Route
                path="payments"
                element={<Payments />}
              />
            )
          }

          {/* Messages */}
          <Route
            path="messages"
            element={<Messages />}
          />

          {/* Block Invalid */}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}