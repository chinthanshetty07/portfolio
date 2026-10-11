import { Suspense, lazy } from 'react'
import App from './App'

// /         portfolio homepage on the ThreeUI Kage world (lazy: three.js stays off /classic)
// /classic  the detailed React portfolio: case studies, engineering decisions
// /kage     the untouched ThreeUI Kage page, kept for reference
const PortfolioScene = lazy(() => import('./PortfolioScene'))
const KageScene = lazy(() => import('./KageScene'))

const blank = <div style={{ position: 'fixed', inset: 0, background: '#080808' }} />

export default function Root() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/classic') return <App />
  return (
    <Suspense fallback={blank}>{path === '/kage' ? <KageScene /> : <PortfolioScene />}</Suspense>
  )
}
