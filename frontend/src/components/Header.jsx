import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        pathname === to
          ? 'bg-surface text-brand'
          : 'text-white hover:bg-brand-dark'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="bg-brand text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          수다
        </Link>
        <nav className="flex items-center gap-2">
          {navItem('/text', '텍스트 번역')}
          {navItem('/webcam', '웹캠 번역')}
          {navItem('/favorites', '즐겨찾기')}
          {user ? (
            <>
              {navItem('/history', '번역 기록')}
              <span className="text-brand-soft text-sm px-2 hidden sm:inline">
                {user.username}님
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg font-medium text-white hover:bg-brand-dark transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              {navItem('/login', '로그인')}
              {navItem('/signup', '회원가입')}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
