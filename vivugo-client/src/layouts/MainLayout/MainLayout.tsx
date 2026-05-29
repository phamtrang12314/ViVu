import Footer from '@/components/Footer'
import Header from '@/components/Header'
import MobileBottomNav from '@/components/MobileBottomNav/MobileBottomNav'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Chatbox from '@/components/Chatbox/Chatbox'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-20 lg:pb-0">{children}</main>
      <Outlet />
      <Footer />
      <MobileBottomNav />
      <Chatbox />
    </div>
  )
}

