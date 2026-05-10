import { useState } from 'react'

import {
  Lock,
  Mail
} from 'lucide-react'

import { loginUser } from '../services/authService'

export default function Login({
  onLogin
}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError('')

      await loginUser(email, password)

      onLogin()

    } catch (err) {

  console.log(err)

  setError(err.message)
}

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-[#171717] border border-[#2f2f2f] rounded-3xl p-8">

        {/* Logo */}
        <div className="mb-10 text-center">

          <h1 className="text-4xl font-bold mb-2">
            Kalrav
          </h1>

          <p className="text-zinc-400">
            Speech Therapy Clinic Admin
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="email"
                placeholder="admin@kalrav.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl pl-12 pr-4 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full h-14 bg-[#222] border border-[#3a3a3a] rounded-2xl pl-12 pr-4 outline-none"
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#dffff2] text-black font-bold hover:opacity-90 transition-all"
          >
            {loading
              ? 'Signing In...'
              : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}