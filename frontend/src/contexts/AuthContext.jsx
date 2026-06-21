import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('accessai_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (username, token) => {
    localStorage.setItem('accessai_token', token)
    localStorage.setItem('accessai_user', JSON.stringify({ username }))
    setUser({ username })
  }

  const logout = () => {
    localStorage.removeItem('accessai_token')
    localStorage.removeItem('accessai_user')
    setUser(null)
  }

  const getToken = () => localStorage.getItem('accessai_token')

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
