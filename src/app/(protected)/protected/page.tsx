//import Product from '@/app/(interface)/components/Product'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <main className='w-full flex items-center gap-4 flex-col mt-8'>
    <p>Ruta Protegida</p>
    <Link href={'/'} className='flex items-center gap-2 bg-zinc-950 h-10 roundend-md justify-center text-sm w-fit px-6 text-zinc-100'>
    <ChevronLeft className='w-4 h-4' />
    <span>Volver al Inicio</span>
    </Link>

    {/* <Product /> */}
    
    </main>
  )
}

export default Page