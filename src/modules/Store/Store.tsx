import Container from '@/components/Container/Container'
import React from 'react'
import storebanner from "@/assets/images/store-banner.svg"
import { cn } from '@/lib/utils'

function Store() {
  return (
    <div>
        <Container className='p-6'>
            <div className={cn('w-full relative py-12 md:py-20 bg-cover bg-no-repeat bg-[75%]')}  style={{backgroundImage: `url(${storebanner})`}}>
                <h1 className='text-5xl font-bold'>Bookstore</h1>
            </div>
        </Container>
        
    </div>
  )
}

export default Store