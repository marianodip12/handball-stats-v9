// ─── Court zones (top-down, goal at top) ─────────────────────────────────────
export const ZONES = [
  { id: 'extreme_left',  label: 'Extremo Izq.',  shortLabel: 'EI'  },
  { id: 'back_left',     label: 'Lateral Izq.',  shortLabel: 'LI'  },
  { id: 'center',        label: 'Central',        shortLabel: 'C'   },
  { id: 'back_right',    label: 'Lateral Der.',   shortLabel: 'LD'  },
  { id: 'extreme_right', label: 'Extremo Der.',   shortLabel: 'ED'  },
  { id: 'pivot',         label: 'Pivote',         shortLabel: 'PIV' },
  { id: '7m',            label: '7 metros',       shortLabel: '7m'  },
  { id: 'outside',       label: 'Afuera',         shortLabel: 'OUT' },
]

// ─── Goal 3×3 grid sections (goalkeeper's view, left = shooter's right) ──────
export const GOAL_SECTIONS = [
  { id: 'tl', row: 0, col: 0 }, { id: 'tc', row: 0, col: 1 }, { id: 'tr', row: 0, col: 2 },
  { id: 'ml', row: 1, col: 0 }, { id: 'mc', row: 1, col: 1 }, { id: 'mr', row: 1, col: 2 },
  { id: 'bl', row: 2, col: 0 }, { id: 'bc', row: 2, col: 1 }, { id: 'br', row: 2, col: 2 },
]

// ─── Shot results ─────────────────────────────────────────────────────────────
export const SHOT_RESULTS = {
  goal:    { label: 'Gol',             color: '#22c55e' },
  saved:   { label: 'Atajado',         color: '#3b82f6' },
  missed:  { label: 'Errado / Afuera', color: '#ef4444' },
  post:    { label: 'Poste/Travesaño', color: '#eab308' },
  blocked: { label: 'Bloqueado',       color: '#f97316' },
}

// ─── Attack analysis actions ──────────────────────────────────────────────────
export const ATTACK_ACTIONS = [
  { id: 'deflect_fail',   label: 'Desechar sin éxito',  isPositive: false },
  { id: 'no_shot',        label: 'No hay que tirar',    isPositive: null  },
  { id: 'goal_with_shot', label: 'Lanzar con gol',      isPositive: true  },
  { id: 'deflect_ok',     label: 'Desechar con éxito',  isPositive: true  },
]

// ─── Goalkeeper / defense analysis actions ────────────────────────────────────
export const DEFENSE_ACTIONS = [
  { id: 'wrong_anticipation', label: 'Anticipación equivocada',    isPositive: false },
  { id: 'bad_position',       label: 'Posicionamiento incorrecto', isPositive: false },
  { id: 'static',             label: 'Estática',                   isPositive: false },
  { id: 'leg_up',             label: 'Levanta la pierna',          isPositive: false },
  { id: 'arm_down',           label: 'Baje el brazo',              isPositive: false },
  { id: 'good_anticipation',  label: 'Buena anticipación',         isPositive: true  },
  { id: 'influenced_shot',    label: 'Influye en el disparo',      isPositive: true  },
]

// ─── Sanction types ───────────────────────────────────────────────────────────
export const SANCTION_TYPES = [
  { id: 'yellow', label: 'Tarjeta amarilla', color: '#eab308', permanent: false, exclusion: false },
  { id: '2min',   label: '2 minutos',        color: '#3b82f6', permanent: false, exclusion: true  },
  { id: 'red',    label: 'Tarjeta roja',     color: '#ef4444', permanent: true,  exclusion: true  },
  { id: 'blue',   label: 'Tarjeta azul',     color: '#06b6d4', permanent: true,  exclusion: true  },
]

// ─── Match timing ─────────────────────────────────────────────────────────────
export const HALF_DURATION_SECS = 1800   // 30 min per half
export const EXCLUSION_DURATION = 120    // 2-min suspension
export const MAX_ON_COURT       = 7      // max players on court (incl. GK)
