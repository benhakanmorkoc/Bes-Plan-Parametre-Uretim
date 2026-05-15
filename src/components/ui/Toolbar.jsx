export function ScreenHeader({ title, description, right }) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-white">
      <div>
        <h2 className="text-xl font-bold text-blue-700">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}

export function PrimaryButton({ children, onClick, disabled, className = '', small = false }) {
  const size = small ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 ${size} rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

export function OutlineButton({ children, onClick, disabled, className = '', small = false }) {
  const size = small ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 ${size} rounded-md font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

export function StatusBadge({ value, status, children }) {
  const display = children ?? value
  const v = String(status ?? value ?? children ?? '').toLowerCase()
  let cls = 'bg-amber-50 text-amber-700 border-amber-200'
  if (v.includes('yururlukte') || v.includes('aktif') || v.includes('onayli') || v.includes('sozlesmelesti')) cls = 'bg-green-50 text-green-700 border-green-200'
  else if (v.includes('kapali') || v.includes('pasif') || v.includes('iptal')) cls = 'bg-slate-100 text-slate-600 border-slate-200'
  else if (v.includes('taslak') || v.includes('onayda') || v.includes('bekleniyor')) cls = 'bg-amber-50 text-amber-700 border-amber-200'
  else if (v.includes('kaldirildi') || v.includes('reddi')) cls = 'bg-red-50 text-red-700 border-red-200'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${cls}`}>{display}</span>
  )
}
