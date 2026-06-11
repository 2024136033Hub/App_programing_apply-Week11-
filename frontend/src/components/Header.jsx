import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

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
          AccessAI
        </Link>
        <nav className="flex gap-2">
          {navItem('/text', '텍스트 번역')}
          {navItem('/webcam', '웹캠 번역')}
        </nav>
      </div>
    </header>
  )
}
