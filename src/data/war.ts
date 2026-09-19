import type { AttackerKind, TroopKind } from '@/types'

/**
 * Content and timings for the screensaver.
 *
 * The village is besieged by objects from partial differential equations and
 * defends itself with a handful of very ordinary villagers and some a priori
 * estimates. The estimates do not hold.
 */

export const ATTACKING_CLANS = [
  'Martines Superior',
  'Vašek Inferior',
  'Clan Bochner',
  'Clan Gelfand Trio',
  'Clan Sobolev',
  'Embedders',
  'Sobolev Embedders',
  'The Weak Solutions',
  'Compactly Supported',
  'A.E. Convergents',
]

export const ATTACKER_NAMES = [
  '∂ₜu − Δu = f',
  'u ∈ L²(0,T;H¹₀)',
  '−Δu = f',
  '‖∇u‖₂ → ∞',
  'δ₀ ∗ u',
  'div u = 0',
]

/** Cycled through as targets fall, so no two waves look the same. */
export const ATTACKER_ORDER: AttackerKind[] = [
  'laplacian',
  'bochner',
  'dirac',
  'sobolev',
  'navier',
  'heat',
  'gradient',
]

/**
 * What each attacker degrades through as the defenders land hits. The chains
 * are deliberately different lengths — a short one simply dies sooner.
 * The nameplate shows the current stage, so you can watch it fall apart.
 */
/**
 * `↪` is a continuous embedding, `↪↪` a compact one, and the distinction is
 * respected: on a bounded domain L^q ↪ L^p (q > p) is continuous but never
 * compact — the Rademacher functions are bounded in every L^s, converge weakly
 * to zero and keep norm one — and W^{1,p} ↪ L^{p*} fails to be compact at the
 * critical exponent. The only earned `↪↪` here is Aubin–Lions.
 */
export const ATTACKER_STAGES: Record<AttackerKind, string[]> = {
  // Sobolev at the critical exponent, then Hölder on a bounded domain.
  // Continuous throughout; Rellich–Kondrachov would need q < p*.
  sobolev: ['W¹ᵖ(Ω)', '↪ Lᵖ*', '↪ Lᵖ', '↪ L¹'],
  // Hölder in time on a finite interval, then L² ↪ L¹ in space. Compactness
  // here would need a bound on ∂ₜu, which this one does not carry.
  bochner: ['L²(0,T;H¹₀)', '↪ L²(0,T;L²)', '↪ L¹(0,T;L²)', '↪ L¹(0,T;L¹)'],
  // Test against φ ∈ H¹₀, then integrate by parts: the boundary term drops
  // and ∫Ω Δu φ = −∫Ω ∇u·∇φ.
  laplacian: ['Δu', '∫Ω Δu φ', '−∫Ω ∇u·∇φ'],
  // Mass one over the line, nothing at all away from the origin.
  dirac: ['δ₀', '∫ −∞,∞ δ₀', '∫ π/2,π δ₀', '0'],
  // (u·∇u)·u = ½u·∇|u|², so with the ½|u|² div u term the product rule folds
  // the whole thing into ½ div(|u|²u), whose integral is a boundary flux.
  navier: [
    'u·∇u + ½u div u',
    '∫Ω [(u·∇u)·u + ½|u|² div u]',
    '½∫Ω div(|u|²u)',
    '0',
  ],
  // Galerkin ansatz, the energy bound, then Aubin–Lions: bounded in
  // L²(0,T;H¹₀) with ∂ₜuₙ bounded in L²(0,T;H⁻¹) is precompact in L²(0,T;L²).
  heat: ['∂ₜ − Δ', 'uₙ = Σ cₖ(t)wₖ', 'u ∈ L²(0,T;W¹²₀)', '↪↪ L²(0,T;L²)'],
  // Vanishing gradient means constant on a connected domain, and zero trace
  // then pins the constant to zero.
  gradient: ['∇u', '‖∇u‖₂ = 0', 'u = const. a.e.', 'u = 0'],
}

/**
 * Chance that the villagers win an engagement and the building survives.
 * Below 0.5 because these are partial differential equations, but high enough
 * that a clean defence happens often.
 */
export const DEFENCE_ODDS = 0.42

/** The defenders are the villagers. They are outmatched. */
export const DEFENDER_ORDER: TroopKind[] = [
  'brute',
  'slinger',
  'boulder',
  'slinger',
  'brute',
  'boulder',
  'brute',
]

/**
 * What each building puts up before it stops being a building. Written with
 * plain Unicode — these are rendered as text, so no LaTeX braces.
 */
export const ESTIMATES = [
  '‖∇u‖₂ ≤ C',
  '‖u‖∞ ≤ C‖f‖₂',
  'u ∈ L²(0,T;H¹)',
  'Grönwall holds.',
  'Poincaré keeps the norm under control.',
  'Cauchy-Schwarz closes the estimate.',
  'Rellich-Kondrachov. Convergence secured.',
  'Energy estimate closed.',
  'X not reflexive. Gelfand unmatched.',
  'Lebesgue says almost everywhere is good enough.',
  'Kolmogorov says this sequence is staying compact.',
  'Hille-Yosida generated this defense.',
  'Hölder keeps the product under control.',
  'Young absorbed the cross term.',
]

export const WAR_START_LINES = [
  'Existence is guaranteed. Uniqueness is our problem now, Chief.',
  'Our walls have zero trace.',
  'Coercivity confirmed. On their side.',
  'Strong attack. We only have a weak formulation.',
  'By density, they will fill every gap.',
  'The rest is left as an exercise for the enemy.',
  'The proof is straightforward. Surviving it is not.',
  'Lax and Milgram are on their side today.',
  'No boundary condition is going to save us now.',
  'They attack almost everywhere.',
  'Our village is bounded. It is not safe.',
  'They will pass to a convergent subsequence and come again.',
  'They may now pass to the limit.',
  'They found a fixed point. Unfortunately for us.',
  'They integrate by parts. Then they destroy the parts.',
  'Our wall is only Lipschitz, Chief.',
  'Proof omitted. Three stars expected. Against us.',
]

export const DEFENCE_LINES = [
  'The estimate held.',
  'Compactness acquired. They could not escape.',
  'The boundary conditions did their job.',
  'Their attack converged strongly to zero.',
  'Coercivity wins again.',
  'The village remains bounded.',
  'No loss of regularity detected.',
  'The conclusion follows immediately.',
]

export const WAR_MID_LINES = [
  'We are losing regularity, Chief.',
  'Somebody find a convergent subsequence.',
  'That constant depends on the domain. Of course it does.',
  'We may need a weaker formulation.',
  'The estimate is not closing.',
  'Chief, the compact embedding has failed.',
  'Integrate by parts. Do something.',
  'We have boundedness. We do not have a plan.',
  'The classical solution is no longer available.',
  'Pass to the limit and hope.',
]

export const WAR_END_LINES: Record<number, string[]> = {
  0: [
    'No stars. Grönwall holds.',
    'The attack converged strongly to zero.',
    'Defense holds almost everywhere.',
    'The energy estimate closed perfectly.',
    'No breach. No subsequence. No problem.',
    'The attacker failed even in the weak sense.',
    'Coercivity wins again.',
  ],

  1: [
    'One star. The damage remains bounded.',
    'A breach exists, but uniqueness is questionable.',
    'Some regularity was lost. The village remains.',
    'Weak damage. Literally.',
    'One star. Still safely below the critical threshold.',
    'The defense survives up to a lower-order term.',
    'Not ideal, but the estimate still closes.',
  ],

  2: [
    'Two stars. The estimate is deteriorating.',
    'Strong damage. Weak defense.',
    'Only the leading-order structure survived.',
    'Compactness is all we have left.',
    'The boundary is gone. The core still holds.',
    'Existence survives. Regularity does not.',
    'Two stars. We are running out of a priori bounds.',
  ],

  3: [
    'Three stars. The solution blew up.',
    'Existence has left the chat.',
    'The village converged strongly to zero.',
    'Global regularity not found.',
    'All a priori estimates have failed.',
    'The maximal solution ceased to exist.',
    'No weakly convergent subsequence can save us now.',
    'Three stars. Boundary conditions no longer relevant.',
    'The defense exists only in the distributional sense.',
  ],
}

export const DEFENCE_SUBTITLES = [
  'Every estimate held. Nobody is more surprised than the Builder.',
  'The village remains in H¹.',
  'Attack repelled. Constants unchanged.',
  'The boundary conditions were sufficient.',
  'Compactness saved the village again.',
  'The attacker failed to satisfy the hypotheses.',
  'All damage terms vanish almost everywhere.',
]

export const WAR_RESULT_SUBTITLES = [
  'The village converges weakly to rubble.',
  'A solution exists. Uniqueness pending.',
  'Regularity was lost somewhere in the proof.',
  'The Builder has switched to distributions.',
  'Smoothness was never in the hypotheses.',
  'Further destruction follows by density.',
  'Boundary values are no longer well defined.',
  'We now pass to a subsequence.',
  'The constant C changed again.',
  'Proof omitted for the sake of the village.',
]

/* ------------------------------------------------------------------ timing */

/** Everything below is in milliseconds. */
export const WAR_TIMING = {
  intro: 1600,
  /** Gap between one target falling and the next attacker dropping. */
  wave: 1750,
  march: 1700,
  /** Long enough to walk an attacker down its embedding chain. */
  attack: 2300,
  /** Pause after the last building falls, before the result card. */
  settle: 1100,
  result: 3000,
  /** Pause before the whole replay loops again. */
  restart: 1900,
} as const

/** Advertised attack length. Ticks down considerably faster than that. */
export const WAR_CLOCK_MS = 3 * 60_000

export const STAR_THRESHOLDS = [40, 70, 100]
