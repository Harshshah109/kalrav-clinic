import { useState } from 'react'

import {
  Mail,
  LockKeyhole
} from 'lucide-react'

export default function Login() {

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const handleLogin = (e) => {

    e.preventDefault()

    // login logic
  }

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-[#faf7ff]
      via-[#f5f3ff]
      to-[#eef2ff]
      px-4
      relative
      overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="
        absolute
        top-[-120px]
        right-[-120px]
        w-[350px]
        h-[350px]
        bg-fuchsia-300/30
        blur-3xl
        rounded-full
      " />

      <div className="
        absolute
        bottom-[-120px]
        left-[-120px]
        w-[350px]
        h-[350px]
        bg-violet-300/30
        blur-3xl
        rounded-full
      " />

      {/* CARD */}
      <div className="
        relative
        w-full
        max-w-md
        rounded-[36px]
        border
        border-white/60
        bg-white/80
        backdrop-blur-xl
        p-8
        shadow-[0_20px_60px_rgba(124,58,237,0.18)]
      ">

        {/* LOGO */}
        <div className="flex justify-center mb-6">

          <img
            src="/logo.png"
            alt="Kalrav"
            className="h-24 object-contain"
          />
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">

          <h1 className="
            text-4xl
            font-black
            text-[#1f1147]
            mb-2
          ">
            Welcome Back
          </h1>

          <p className="
            text-[#7c6ca8]
            text-base
          ">
            Kalrav Speech Therapy Clinic
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="
              text-sm
              font-semibold
              text-[#6d5ca5]
              mb-2
              block
            ">
              Email Address
            </label>

            <div className="
              flex
              items-center
              gap-3
              h-14
              rounded-2xl
              border
              border-[#e9ddff]
              bg-[#faf8ff]
              px-4
            ">

              <Mail
                size={18}
                className="text-violet-500"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-[#1f1147]
                  placeholder:text-[#9b8cc9]
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>

            <label className="
              text-sm
              font-semibold
              text-[#6d5ca5]
              mb-2
              block
            ">
              Password
            </label>

            <div className="
              flex
              items-center
              gap-3
              h-14
              rounded-2xl
              border
              border-[#e9ddff]
              bg-[#faf8ff]
              px-4
            ">

              <LockKeyhole
                size={18}
                className="text-violet-500"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-[#1f1147]
                  placeholder:text-[#9b8cc9]
                "
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="
              w-full
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              via-fuchsia-500
              to-purple-500
              text-white
              font-bold
              text-lg
              shadow-lg
              shadow-violet-500/25
              hover:scale-[1.01]
              transition-all
              mt-2
            "
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <div className="
          text-center
          mt-8
          text-sm
          text-[#8c84b3]
        ">
          Secure Clinic Management System
        </div>
      </div>
    </div>
  )
}