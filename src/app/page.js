import React from 'react'
import Herobanner from '@/Component/Banner/Herobanner'
import Products from '@/Component/Products/Products'
import { Construction } from 'lucide-react'

export default function page() {
  return (
    <>
      <Herobanner />
      <Products />

      {/* 🔧 Under Development Overlay */}
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl px-8 py-6 text-center max-w-sm w-full">
          <Construction className="mx-auto mb-4 text-orange-500" size={48} />
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
            Under Development
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Please Wait... Our team is working hard to bring you new features!
            <br />
            Please check back soon.
          </p>
        </div>
      </div>
    </>
  )
}
