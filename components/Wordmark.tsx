interface Props {
  onDark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl' }

export function Wordmark({ onDark = true, size = 'md' }: Props) {
  return (
    <span className={`wordmark font-display font-light tracking-tight ${sizes[size]}`}>
      <span className={onDark ? 'text-white' : 'text-navy'}>AI</span>
      <span className="text-gold">Pulse</span>
    </span>
  )
}
