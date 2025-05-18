import { Providers } from './providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '리바운드 - 모두를 위한 농구, 새로운 도약',
  description: '장애인 농구 매칭 플랫폼 리바운드에서 함께 뛰어요. 접근성 있는 경기장 정보부터 팀 매칭까지, 모두가 함께하는 농구를 만듭니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
} 