import React from 'react'
import Image from 'next/image'
export default function Designe() {
    return (
        <div>
            <Image
                src="/images/2.jpeg"
                alt="designe"
                width={1920}
                height={1080}
                className='w-full h-auto' />

        </div>
    )
}
