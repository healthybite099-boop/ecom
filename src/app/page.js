import React from 'react'
import Herobanner from '@/Component/Banner/Herobanner'
import HomeBanner from '@/Component/Banner/HomeBanner'
import Card1 from '@/Component/Card/Card1'
import Gift from '@/Component/Gift/Gift'
export default function page() {
  return (
    <>
      <Herobanner />
      <Card1/>
      <HomeBanner/>
      <Gift/>

      {/* <Products /> */}

    </>
  )
}
