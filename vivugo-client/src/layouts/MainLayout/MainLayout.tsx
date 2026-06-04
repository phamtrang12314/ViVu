import React, { lazy, Suspense, useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileBottomNav from '@/components/MobileBottomNav/MobileBottomNav'

const Chatbox = lazy(() => import('@/components/Chatbox/Chatbox'))

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  const [showChatbox, setShowChatbox] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowChatbox(true), 2500)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-20 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      {showChatbox && (
        <Suspense fallback={null}>
          <Chatbox />
        </Suspense>
      )}
    </div>
  )
}
