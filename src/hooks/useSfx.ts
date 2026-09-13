import { useCallback } from 'react'
import { playSfx, type SfxName } from '@/utils/sfx'
import { useVillageStore } from './useVillageStore'

/** Sound effects, gated on the "Village Sounds" setting (off by default). */
export function useSfx(): (name: SfxName) => void {
  const enabled = useVillageStore().state.settings.sounds
  return useCallback(
    (name: SfxName) => {
      if (enabled) playSfx(name)
    },
    [enabled],
  )
}
