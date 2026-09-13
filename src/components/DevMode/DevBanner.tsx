import { DEV_MODE_TAGLINE, DEV_MODE_TITLE } from '@/data/events'

/** Shown for a few seconds after the arrow sequence is typed. */
export function DevBanner() {
  return (
    <div className="dev-banner" role="status">
      <span className="dev-banner__dot" aria-hidden="true" />
      <b>{DEV_MODE_TITLE}</b>
      <span>{DEV_MODE_TAGLINE}</span>
    </div>
  )
}
