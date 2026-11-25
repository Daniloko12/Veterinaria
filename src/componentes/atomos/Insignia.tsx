interface InsigniaProps {
  texto: string
  /** Color de Bootstrap: primary, success, danger, warning, secondary... */
  color?: string
  clase?: string
}

function Insignia({ texto, color = 'secondary', clase = '' }: InsigniaProps) {
  return <span className={`badge text-bg-${color} ${clase}`.trim()}>{texto}</span>
}

export default Insignia
