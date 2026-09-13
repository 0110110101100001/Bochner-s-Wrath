import type { ReactElement } from 'react'
import type { UpgradeIcon } from '@/types'

/** Hand-drawn resource emblems, matched to the village palette. */

export function GoldIcon() {
  return (
    <svg viewBox="0 0 40 40" className="res-icon">
      <ellipse cx="20" cy="32" rx="16" ry="6" fill="#a96b07" />
      <circle cx="20" cy="20" r="15" fill="#c8830c" />
      <circle cx="20" cy="18.5" r="13" fill="url(#coin-face)" />
      <defs>
        <radialGradient id="coin-face" cx="36%" cy="30%" r="76%">
          <stop offset="0%" stopColor="#fff6c9" />
          <stop offset="52%" stopColor="#ffc62e" />
          <stop offset="100%" stopColor="#d18f0d" />
        </radialGradient>
      </defs>
      <path d="M20,10 l2.6,5.6 6.1,0.8 -4.5,4.2 1.2,6 -5.4,-2.9 -5.4,2.9 1.2,-6 -4.5,-4.2 6.1,-0.8 Z" fill="#a96b07" opacity="0.5" />
      <ellipse cx="15" cy="13" rx="4" ry="2.6" fill="#fff" opacity="0.6" transform="rotate(-28 15 13)" />
    </svg>
  )
}

export function ElixirIcon() {
  return (
    <svg viewBox="0 0 40 40" className="res-icon">
      <defs>
        <linearGradient id="elx-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e79bff" />
          <stop offset="55%" stopColor="#b845f0" />
          <stop offset="100%" stopColor="#6a17a8" />
        </linearGradient>
      </defs>
      <path d="M20,4 C27,14 32,20 32,26 a12,12 0 0,1 -24,0 C8,20 13,14 20,4 Z" fill="url(#elx-fill)" />
      <path d="M20,4 C27,14 32,20 32,26 a12,12 0 0,1 -6,10 C30,30 27,22 20,10 Z" fill="#3f0c66" opacity="0.35" />
      <ellipse cx="15" cy="24" rx="4" ry="6" fill="#fff" opacity="0.42" transform="rotate(-18 15 24)" />
    </svg>
  )
}

export function GemIcon() {
  return (
    <svg viewBox="0 0 40 40" className="res-icon">
      <path d="M13,6 L27,6 L36,17 L20,36 L4,17 Z" fill="#16a35c" />
      <path d="M13,6 L27,6 L31,17 L20,36 L9,17 Z" fill="#3ddc84" />
      <path d="M13,6 L20,17 L9,17 Z" fill="#8ff5bd" />
      <path d="M27,6 L31,17 L20,17 Z" fill="#63e79c" />
      <path d="M9,17 L20,17 L20,36 Z" fill="#1fbd6c" />
      <path d="M15,8 L18,8 L13,16 Z" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}

const UPGRADE_PATHS: Record<UpgradeIcon, ReactElement> = {
  cloud: (
    <>
      <path
        d="M11,26 a7,7 0 0,1 0.6,-13.9 a9,9 0 0,1 17,2.2 a6,6 0 0,1 -1.6,11.7 Z"
        fill="currentColor"
      />
      <path d="M13,30 l-2,4 M20,30 l-2,4 M27,30 l-2,4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  coin: (
    <>
      <circle cx="18" cy="18" r="12" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <path d="M18,10 l2.2,4.8 5.2,0.7 -3.8,3.6 1,5.1 -4.6,-2.5 -4.6,2.5 1,-5.1 -3.8,-3.6 5.2,-0.7 Z" fill="currentColor" />
    </>
  ),
  droplet: (
    <path d="M18,5 C24,13 28,18 28,22 a10,10 0 0,1 -20,0 C8,18 12,13 18,5 Z" fill="currentColor" />
  ),
  search: (
    <>
      <circle cx="17" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <path d="M24,23 L31,30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="18" cy="18" r="12" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <path d="M18,11 L18,18 L24,21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  book: (
    <>
      <path d="M7,8 h10 a4,4 0 0,1 4,4 v18 a4,4 0 0,0 -4,-4 H7 Z" fill="currentColor" opacity="0.85" />
      <path d="M29,8 h-8 a4,4 0 0,0 -4,4 v18 a4,4 0 0,1 4,-4 h8 Z" fill="currentColor" />
    </>
  ),
  coffee: (
    <>
      <path d="M8,14 h16 v9 a8,8 0 0,1 -16,0 Z" fill="currentColor" />
      <path d="M24,16 h3 a4,4 0 0,1 0,8 h-3" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <path d="M12,9 q2,-3 0,-5 M17,9 q2,-3 0,-5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  wifi: (
    <>
      <path d="M6,15 a18,18 0 0,1 24,0" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M11,21 a11,11 0 0,1 14,0" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="18" cy="27" r="3" fill="currentColor" />
    </>
  ),
  chart: (
    <>
      <path d="M6,30 L14,20 L20,25 L30,9" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24,9 h7 v7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </>
  ),
  moon: <path d="M27,22 A12,12 0 1,1 15,7 a9,9 0 0,0 12,15 Z" fill="currentColor" />,
  chair: (
    <>
      <path d="M11,6 h14 v14 h-14 Z" fill="currentColor" opacity="0.85" />
      <path d="M8,20 h20 v5 h-20 Z" fill="currentColor" />
      <path d="M11,25 v7 M25,25 v7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  desktop: (
    <>
      <rect x="5" y="7" width="26" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M13,30 h10 M18,24 v6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  wall: (
    <>
      <path d="M5,13 h26 v16 h-26 Z" fill="currentColor" opacity="0.85" />
      <path d="M5,13 v-5 h6 v5 M14,13 v-5 h6 v5 M23,13 v-5 h6 v5" fill="currentColor" />
      <path d="M5,21 h26 M13,13 v8 M22,21 v8" stroke="#2c1a0d" strokeWidth="1.8" opacity="0.5" />
    </>
  ),
}

export function UpgradeGlyph({ name }: { name: UpgradeIcon }) {
  return (
    <svg viewBox="0 0 36 36" className="glyph">
      {UPGRADE_PATHS[name]}
    </svg>
  )
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 32 32" className="glyph">
      <path
        d="M16,4 l2.2,0 0.8,3.4 a9,9 0 0,1 2.6,1.5 l3.3,-1.2 1.6,2.7 -2.5,2.4 a9,9 0 0,1 0,3 l2.5,2.4 -1.6,2.7 -3.3,-1.2 a9,9 0 0,1 -2.6,1.5 L18.2,28 l-4.4,0 -0.8,-3.4 a9,9 0 0,1 -2.6,-1.5 l-3.3,1.2 -1.6,-2.7 2.5,-2.4 a9,9 0 0,1 0,-3 L5.5,13.8 7.1,11.1 10.4,12.3 a9,9 0 0,1 2.6,-1.5 L13.8,4 Z"
        fill="currentColor"
      />
      <circle cx="16" cy="16" r="4.4" fill="#c7cedd" />
    </svg>
  )
}

export function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className="glyph">
      <path d="M6,12 h5 l7,-6 v20 l-7,-6 H6 Z" fill="currentColor" />
      {on ? (
        <>
          <path d="M21,11 a7,7 0 0,1 0,10" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M24,7 a12,12 0 0,1 0,18" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </>
      ) : (
        <path d="M22,12 l8,8 M30,12 l-8,8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  )
}

export function HammerIcon() {
  return (
    <svg viewBox="0 0 36 36" className="glyph">
      <path d="M7,31 L21,17" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M18,6 L31,19 L26,24 L13,11 Z" fill="currentColor" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 32 32" className="glyph">
      <path d="M9,9 L23,23 M23,9 L9,23" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 32 32" className="glyph">
      <path d="M16,7 V25 M7,16 H25" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" />
    </svg>
  )
}
