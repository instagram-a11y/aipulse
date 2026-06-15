interface Props {
  label: string
  aspectRatio?: string
  className?: string
}

export function PhotoPlaceholder({ label, aspectRatio = 'aspect-[4/3]', className = '' }: Props) {
  return (
    <div className={`bg-navy-mid flex items-center justify-center ${aspectRatio} ${className}`}>
      <div className="text-center">
        <div className="w-10 h-px bg-gold mx-auto mb-4 opacity-50" />
        <p className="text-gold/60 text-xs tracking-widest uppercase">{label}</p>
        <div className="w-10 h-px bg-gold mx-auto mt-4 opacity-50" />
      </div>
    </div>
  )
}
