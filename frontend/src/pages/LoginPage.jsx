import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { loginUser } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    setLoading(true)
    setError('')
    try {
      const data = await loginUser(username.trim(), password)
      login(data.username, data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="bg-surface border border-divider rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-ink mb-1 text-center">로그인</h2>
        <p className="text-sm text-ink-muted text-center mb-6">
          번역 기록을 저장하려면 로그인하세요
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
            <label className="block text-sm font-medium text-ink mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
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
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="text-center text-sm text-ink-muted mt-4">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-brand font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
