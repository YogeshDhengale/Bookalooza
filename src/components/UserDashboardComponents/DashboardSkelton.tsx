import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'

export default function DashboardSkelton() {
  return (
    <div className='size-full'>
        <div className="p-2 md:p-4">
            <Skeleton className='w-full h-8 mb-4' />
            <Skeleton className='w-full h-4 mb-4' />
        </div>
        <Separator className='w-full' />
        <div className="p-2 h-full flex flex-col flex-1 md:p-4">
            <Skeleton className='w-full h-28 mb-4' />
            <Skeleton className='w-full h-28 mb-4' />
            <Skeleton className='w-full h-28 mb-4' />
        </div>
    </div>
  )
}
