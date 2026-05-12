import { useEffect, useRef, useState } from 'react'
import { MoreVertical, Eye, Pencil, Copy, GitBranch, Trash2, History, Link as LinkIcon, FileText } from 'lucide-react'

const ICONS = {
  view: Eye,
  edit: Pencil,
  copy: Copy,
  version: GitBranch,
  history: History,
  link: LinkIcon,
  delete: Trash2,
  details: FileText,
}

const DEFAULT_ACTIONS = [
  { key: 'view', label: 'Goruntule', icon: 'view' },
  { key: 'edit', label: 'Duzenle', icon: 'edit' },
  { key: 'copy', label: 'Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyon Gecmisi', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

export default function RowActions({ actions = DEFAULT_ACTIONS, onAction, row }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handle = (key) => {
    setOpen(false)
    onAction?.(key, row)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 inline-flex items-center justify-center"
        aria-label="Satir aksiyonlari"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 min-w-[11rem] w-max max-w-[14rem] bg-white border border-slate-200 rounded-md shadow-lg py-1 text-sm">
          {actions.map((a, idx) => {
            if (a.divider) return <div key={`d${idx}`} className="my-1 border-t border-slate-100" />
            const Icon = ICONS[a.icon] || Eye
            return (
              <button
                key={a.key}
                onClick={() => handle(a.key)}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 ${a.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}`}
              >
                <Icon className="w-3.5 h-3.5" /> {a.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { DEFAULT_ACTIONS }
