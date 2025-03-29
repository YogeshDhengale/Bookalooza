import React from 'react'

const ProductCard = ({}) => {
  return (
    <div className="max-w-[280px] rounded-3xl bg-gradient-to-b from-[#f8f1f7] to-white p-[1px]">
      <div className="h-full w-full rounded-3xl bg-gradient-to-b from-[#f8f1f7] to-white p-4">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative w-full">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NRuZCwSz7fWUi5XgL1Rx2cdEZdbeP4.png"
              alt="Imagination book cover"
              className="object-cover"
              loading='lazy'
            />
          </div>
        </div>
        <div className="mt-3 space-y-1 px-1">
          <p className="text-sm font-medium text-gray-600">Olivia Wilson</p>
          <h3 className="text-xl font-semibold text-gray-900">Imagination</h3>
          <p className="text-lg font-medium text-[#9370db]">$25.00</p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard