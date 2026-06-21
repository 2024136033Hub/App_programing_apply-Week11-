import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { registerUser } from '../services/api'

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password) return
    if (!isValidEmail(email.trim())) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (password !== password2) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await registerUser(username.trim(), email.trim(), password)
      login(data.username, data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="bg-surface border border-divider rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-ink mb-1 text-center">회원가입</h2>
        <p className="text-sm text-ink-muted text-center mb-6">
          무료로 가입하고 번역 기록을 저장하세요
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디 입력"
              className="w-full border border-divider rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-ink"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-divider rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상"
              className="w-full border border-divider rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">비밀번호 확인</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="비밀번호 재입력"
              className="w-full border border-divider rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-ink"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
