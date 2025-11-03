import './globals.css'
import { Inter } from 'next/font/google'
import { AppLayout } from './components/AppLayout'
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Content Ideas Manager',
  description: 'Generate and manage content ideas with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
