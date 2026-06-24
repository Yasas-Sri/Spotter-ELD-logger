export default function Logo({ size = 26, withWord = true }) {
  return (
    <div className="flex items-center gap-2.25">
      <img src="/logo.png" alt="Spotter" width={size} height={size} className="block shrink-0 rounded-[7px]" />
      {withWord && (
        <span className="font-sans text-[16.5px] font-bold tracking-[-0.02em] text-(--text-primary)">Spotter</span>
      )}
    </div>
  )
}
