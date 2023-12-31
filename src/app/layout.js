// import Footer from '@/components/Footer/footer'
// import Header from '@/components/Header/Header'
import ReduxProvide from '@/redux/provider'
import { Inter } from 'next/font/google';
import { RootStyleRegistry } from './root-style-registry'
const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvide>
          <RootStyleRegistry>
              {children}
          </RootStyleRegistry>
        </ReduxProvide>
      </body>
    </html>
  )
}
