import { NavLink, useLocation } from 'react-router-dom'

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
      <path d="M3 12v9h18v-9" />
    </svg>
  )
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" fill={active ? 'rgba(108,99,255,0.15)' : 'none'} />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  )
}

export function Navigation() {
  const { pathname } = useLocation()

  if (pathname === '/player') return null

  const base =
    'flex flex-col items-center gap-1 py-3 px-8 text-xs font-medium transition-colors duration-150'
  const active = 'text-accent'
  const inactive = 'text-secondary'

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-card border-t border-white/[0.08] pb-safe z-50">
      <div className="flex justify-around max-w-lg mx-auto">
        <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          {({ isActive }) => (
            <>
              <HomeIcon active={isActive} />
              <span>Home</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {({ isActive }) => (
            <>
              <HistoryIcon active={isActive} />
              <span>History</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
