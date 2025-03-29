import { cn } from '@/lib/utils'
import React from 'react'

const  Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={cn('w-full relative py-10 px-6', className)}>
        {children}
    </section>
  )
}

export default Section