import { useCallback, useState } from 'react'
import type { Shortcut } from '@/types'
import { Dialog } from '@/components/Common/Dialog'
import { GoldIcon, PlusIcon } from '@/components/Common/Icons'
import { SHORTCUT_COST, SHORTCUT_EDIT_COST } from '@/data/economy'
import { NO_GOLD_LINES } from '@/data/jokes'
import { useBuilder } from '@/hooks/useBuilder'
import { useSfx } from '@/hooks/useSfx'
import { useStage } from '@/hooks/useStage'
import { useVillageStore } from '@/hooks/useVillageStore'
import { faviconUrl, hostOf, monogramFor, normalizeUrl } from '@/utils/favicon'
import { formatAmount, formatCompact } from '@/utils/format'
import { pick, uid } from '@/utils/random'
import './QuickLinks.scss'

type Draft = { id: string | null; label: string; url: string }

const EMPTY_DRAFT: Draft = { id: null, label: '', url: '' }

export function QuickLinks() {
  const { state, actions } = useVillageStore()
  const { pushToast } = useStage()
  const builder = useBuilder()
  const sfx = useSfx()
  const [draft, setDraft] = useState<Draft | null>(null)

  // Raising a signpost is a build; repainting one is a smaller build.
  const canAfford = state.resources.gold >= SHORTCUT_COST

  const refuse = useCallback(
    (cost: number) => {
      sfx('deny')
      pushToast({
        title: 'Not enough gold.',
        body: `That costs ${formatAmount(cost)}.`,
        tone: 'danger',
        ttl: 3800,
      })
      builder.say(pick(NO_GOLD_LINES), { mood: 'disappointed', ms: 3000, lockMs: 2200 })
    },
    [sfx, pushToast, builder],
  )

  // Saving an unchanged signpost is free; the Builder is not a monster.
  const original = draft?.id ? state.shortcuts.find((s) => s.id === draft.id) : undefined
  const edited =
    !!original &&
    (original.label !== (draft?.label.trim() || original.label) ||
      original.url !== normalizeUrl(draft?.url ?? ''))
  const editCost = edited ? SHORTCUT_EDIT_COST : 0

  const save = useCallback(() => {
    if (!draft) return
    const url = normalizeUrl(draft.url)
    if (!url) return
    const label = draft.label.trim() || hostOf(url)
    const isNew = !draft.id

    const price = isNew ? SHORTCUT_COST : editCost
    if (state.resources.gold < price) {
      refuse(price)
      return
    }

    const next: Shortcut[] = draft.id
      ? state.shortcuts.map((s) => (s.id === draft.id ? { ...s, label, url } : s))
      : [...state.shortcuts, { id: uid('link'), label, url }]

    actions.setShortcuts(next.slice(0, 10))
    if (price > 0) actions.addResources({ gold: -price })
    sfx(price > 0 ? 'hammer' : 'pop')
    setDraft(null)
  }, [draft, state.shortcuts, state.resources.gold, editCost, actions, sfx, refuse])

  const remove = useCallback(() => {
    if (!draft?.id) return
    actions.setShortcuts(state.shortcuts.filter((s) => s.id !== draft.id))
    sfx('pop')
    setDraft(null)
  }, [draft, state.shortcuts, actions, sfx])

  return (
    <>
      <nav className="quick-links" aria-label="Shortcuts">
        {state.shortcuts.map((link, i) => (
          <SignPost
            key={link.id}
            link={link}
            index={i}
            onEdit={() => setDraft({ id: link.id, label: link.label, url: link.url })}
          />
        ))}

        {state.shortcuts.length < 10 && (
          <button
            type="button"
            className={`signpost signpost--add ${canAfford ? '' : 'is-broke'}`}
            style={{ animationDelay: `${state.shortcuts.length * 0.05 + 0.3}s` }}
            onClick={() => (canAfford ? setDraft({ ...EMPTY_DRAFT }) : refuse(SHORTCUT_COST))}
            aria-label={`Build a shortcut for ${formatAmount(SHORTCUT_COST)} gold`}
          >
            <span className="signpost__board">
              <span className="signpost__icon signpost__icon--add">
                <PlusIcon />
              </span>
              <span className="signpost__label">Build</span>
              <span className="signpost__price">
                <GoldIcon />
                {formatCompact(SHORTCUT_COST)}
              </span>
            </span>
            <span className="signpost__post" />
          </button>
        )}
      </nav>

      <Dialog
        open={draft !== null}
        title={draft?.id ? 'Edit signpost' : 'Raise a signpost'}
        onClose={() => setDraft(null)}
        footer={
          <>
            {draft?.id && (
              <button type="button" className="btn btn--danger btn--small" onClick={remove}>
                Demolish
              </button>
            )}
            <button type="button" className="btn btn--stone btn--small" onClick={() => setDraft(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--small"
              onClick={save}
              disabled={!draft?.url.trim() || (!draft?.id && !canAfford)}
            >
              {draft?.id
                ? editCost > 0
                  ? `Save — ${formatCompact(editCost)}`
                  : 'Save'
                : `Raise it — ${formatCompact(SHORTCUT_COST)}`}
            </button>
          </>
        }
      >
        <label className="field">
          <span className="field__label">Name</span>
          <input
            className="field__input"
            value={draft?.label ?? ''}
            placeholder="Bookmark Hut"
            onChange={(e) => setDraft((d) => (d ? { ...d, label: e.target.value } : d))}
          />
        </label>
        <label className="field">
          <span className="field__label">Address</span>
          <input
            className="field__input"
            value={draft?.url ?? ''}
            placeholder="example.com"
            onChange={(e) => setDraft((d) => (d ? { ...d, url: e.target.value } : d))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
            }}
          />
          <span className="field__hint">https:// is added for you.</span>
        </label>
      </Dialog>
    </>
  )
}

function SignPost({ link, index, onEdit }: { link: Shortcut; index: number; onEdit: () => void }) {
  const [broken, setBroken] = useState(false)
  const icon = faviconUrl(link.url, 32)
  const mono = monogramFor(link.label, link.url)

  return (
    <span className="signpost-wrap" style={{ animationDelay: `${index * 0.05 + 0.28}s` }}>
      <a className="signpost" href={link.url} title={hostOf(link.url)}>
        <span className="signpost__board">
          <span className="signpost__icon">
            {icon && !broken ? (
              <img src={icon} alt="" width={22} height={22} onError={() => setBroken(true)} />
            ) : (
              <span className="signpost__mono" style={{ background: mono.color }}>
                {mono.letter}
              </span>
            )}
          </span>
          <span className="signpost__label">{link.label}</span>
        </span>
        <span className="signpost__post" />
      </a>
      <button
        type="button"
        className="signpost__edit"
        onClick={onEdit}
        aria-label={`Edit ${link.label}`}
        title="Edit"
      >
        <svg viewBox="0 0 24 24">
          <path d="M4,17 L15,6 L19,10 L8,21 L3,22 Z" fill="currentColor" />
          <path d="M16,3 L18,1 L23,6 L21,8 Z" fill="currentColor" />
        </svg>
      </button>
    </span>
  )
}
