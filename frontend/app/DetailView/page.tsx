"use client"
import React from 'react'

import DetailedAnalyticsView from '@/components/dashboard/DetailedAnalyticsView'
function page() {
  return (
    <DetailedAnalyticsView
            onBack={()=>false}
            urlData={{}}
          />
  )
}

export default page