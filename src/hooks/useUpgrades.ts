import { useCallback, useEffect } from 'react'
import type { ActiveUpgrade, UpgradeId } from '@/types'
import { BUILDING_BY_ID } from '@/data/buildings'
import { DISAPPOINTED_LINES, UPGRADE_DONE_LINES, UPGRADE_START_LINES } from '@/data/jokes'
import { nextLevelOf, UPGRADE_BY_ID } from '@/data/upgrades'
import { pick } from '@/utils/random'
import { useBuilder } from './useBuilder'
import { useSfx } from './useSfx'
import { useStage } from './useStage'
import { useVillageStore } from './useVillageStore'

export interface UpgradeActions {
  levelOf: (id: UpgradeId) => number
  activeFor: (id: UpgradeId) => ActiveUpgrade | undefined
  start: (id: UpgradeId) => void
  finishNow: (id: UpgradeId) => void
  cancel: (id: UpgradeId) => void
}

export function useUpgradeActions(): UpgradeActions {
  const { state, actions } = useVillageStore()
  const { pushToast } = useStage()
  const builder = useBuilder()
  const sfx = useSfx()

  const levelOf = useCallback((id: UpgradeId) => state.levels[id] ?? 1, [state.levels])

  const activeFor = useCallback(
    (id: UpgradeId) => state.activeUpgrades.find((u) => u.upgradeId === id),
    [state.activeUpgrades],
  )

  const start = useCallback(
    (id: UpgradeId) => {
      const current = state.levels[id] ?? 1
      const def = nextLevelOf(id, current)
      if (!def || state.activeUpgrades.some((u) => u.upgradeId === id)) return

      if (state.resources[def.costKind] < def.cost) {
        sfx('deny')
        pushToast({
          title: `Not enough ${def.costKind}.`,
          body: 'The storages disagree with your ambitions.',
          tone: 'danger',
          ttl: 3600,
        })
        return
      }

      const startedAt = Date.now()
      actions.startUpgrade(
        {
          upgradeId: id,
          level: def.level,
          startedAt,
          endsAt: startedAt + def.realDurationMs,
          fakeDurationMs: def.fakeDurationMs,
          gemCost: def.gemCost,
        },
        def.cost,
        def.costKind,
      )
      sfx('hammer')
      builder.say(pick(UPGRADE_START_LINES), { mood: 'hammering', ms: 3200, lockMs: 1200 })
    },
    [state.levels, state.activeUpgrades, state.resources, actions, sfx, pushToast, builder],
  )

  const finishNow = useCallback(
    (id: UpgradeId) => {
      const active = state.activeUpgrades.find((u) => u.upgradeId === id)
      if (!active) return

      if (state.resources.gems < active.gemCost) {
        sfx('deny')
        pushToast({
          title: 'Not enough gems.',
          body: `You have ${state.resources.gems}. You need ${active.gemCost}.`,
          tone: 'danger',
          ttl: 3800,
        })
        builder.say(pick(DISAPPOINTED_LINES), { mood: 'disappointed', ms: 3000, lockMs: 2400 })
        return
      }

      // Kept for completeness. It will not happen.
      actions.addResources({ gems: -active.gemCost })
      actions.completeUpgrade(id)
      sfx('sparkle')
    },
    [state.activeUpgrades, state.resources.gems, actions, sfx, pushToast, builder],
  )

  const cancel = useCallback(
    (id: UpgradeId) => {
      actions.cancelUpgrade(id)
      sfx('pop')
    },
    [actions, sfx],
  )

  return { levelOf, activeFor, start, finishNow, cancel }
}

/**
 * Watches the real (short) timers and completes builds. Mounted once; uses one
 * timeout per active build rather than polling.
 */
export function useUpgradeCompletion(): void {
  const { state, actions } = useVillageStore()
  const { pushToast, spawnFloat } = useStage()
  const builder = useBuilder()
  const sfx = useSfx()

  useEffect(() => {
    const handles = state.activeUpgrades.map((upgrade) => {
      const complete = () => {
        actions.completeUpgrade(upgrade.upgradeId)
        const def = UPGRADE_BY_ID[upgrade.upgradeId]
        sfx('sparkle')
        pushToast({
          title: `${def.name} upgraded`,
          body: `Level ${upgrade.level}. Ahead of schedule by 13 days.`,
          tone: 'gem',
          ttl: 4600,
        })
        builder.say(pick(UPGRADE_DONE_LINES), { ms: 3600, lockMs: 1200 })
        const building = def.buildingId ? BUILDING_BY_ID[def.buildingId] : null
        if (building) {
          spawnFloat({ amount: 0, kind: 'gems', x: building.x, y: building.y - 16 })
        }
      }

      const delay = upgrade.endsAt - Date.now()
      if (delay <= 0) {
        // Finished while the tab was closed.
        const id = window.setTimeout(complete, 60)
        return id
      }
      return window.setTimeout(complete, delay)
    })

    return () => handles.forEach(window.clearTimeout)
  }, [state.activeUpgrades, actions, pushToast, spawnFloat, builder, sfx])
}

/** Points the Builder at whatever building is currently under construction. */
export function useBuilderWorkSite(): void {
  const { state } = useVillageStore()
  const { setWorkSite } = useBuilder()

  useEffect(() => {
    const first = state.activeUpgrades[0]
    if (!first) {
      setWorkSite(null)
      return
    }
    const def = UPGRADE_BY_ID[first.upgradeId]
    const building = def.buildingId ? BUILDING_BY_ID[def.buildingId] : null
    setWorkSite(building ? { x: building.x + 7, y: building.y + 3 } : { x: 52, y: 82 })
  }, [state.activeUpgrades, setWorkSite])
}
