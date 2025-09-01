import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from 'react-hot-toast'
import SideNav from '@/components/SideNav'

export const metadata: Metadata = {
  title: "Addis Care CRM",
  description: "AI-powered CRM system for home care agencies",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex h-screen bg-gray-50">
          <SideNav />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
