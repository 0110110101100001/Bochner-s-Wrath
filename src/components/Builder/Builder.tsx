import { useBuilder } from '@/hooks/useBuilder'
import { useSfx } from '@/hooks/useSfx'
import { BuilderArt } from './BuilderArt'
import './Builder.scss'

export function Builder() {
  const { mood, pos, facing, travelMs, speech, poke } = useBuilder()
  const sfx = useSfx()

  return (
    <div
      className="builder-anchor"
      style={{
        transform: `translate(${pos.x}%, ${pos.y}%)`,
        transitionDuration: `${travelMs}ms`,
        transitionTimingFunction: 'linear',
        // Keeps him correctly in front of or behind buildings as he walks.
        zIndex: Math.round(pos.y * 10) + 1,
      }}
    >
      <div className={`builder ${mood === 'away' ? 'is-gone' : ''}`} data-mood={mood}>
        {speech && (
          <div className="builder__bubble" key={speech}>
            <span>{speech}</span>
          </div>
        )}
        <button
          type="button"
          className="builder__hitbox"
          onClick={() => {
            poke()
            sfx('pop')
          }}
          aria-label="Poke the Builder"
        >
          <span className="builder__flip" style={{ transform: `scaleX(${facing})` }}>
            <BuilderArt />
          </span>
        </button>
      </div>
    </div>
  )
}
