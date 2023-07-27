import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <h1 className="font-heading">Raleway</h1>
      <p className="font-lato">Lato</p>
    </div>
  )
}
