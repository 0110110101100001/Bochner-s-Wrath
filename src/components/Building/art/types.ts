export interface ArtProps {
  /** Current upgrade level of the thing this building represents. */
  level: number
  /** True while the building is being interacted with or built on. */
  active?: boolean
}
