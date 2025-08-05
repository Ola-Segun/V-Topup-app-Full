"use client"

import { useState } from "react"
import { OtpInputCard } from "./otp-input-card"

export function InputPin({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <OtpInputCard value={value} onChange={onChange} />
    </div>
  )
}
