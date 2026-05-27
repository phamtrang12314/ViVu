import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'
// 1. IMPORT CHATBOX VÀO ĐÂY
import Chatbox from '@/components/Chatbox/Chatbox'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Outlet />
      <Footer />

      <Chatbox />
    </div>
  )
}

