'use client'

import { useParams } from "next/navigation"

export default function Results(){
  const params = useParams()
  const { key } = params
  return(
    <div>
      <h1>Results</h1>
      <h3>текст: {key}</h3>
    </div>
  )
}