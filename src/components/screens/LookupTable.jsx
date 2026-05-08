import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

export default function LookupTable({ title, description, columns, data, searchKeys = [] }) {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({})
  const [actionInfo, setActionInfo] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    const keys = searchKeys.length ? searchKeys : columns.map((c) => c.key)
    return data.filter((row) => keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)))
  }, [search, data, columns, searchKeys])

  const handleAction = (key, row) => {
    const labelMap = { view: 'Goruntule', edit: 'Duzenle', copy: 'Kopyala', version: 'Yeni Versiyon', history: 'Versiyon Gecmisi', delete: 'Sil' }
    setActionInfo({ key, label: labelMap[key] || key, row })
  }

  const submit = () => {
    setCreateOpen(false)
    setForm({})
    setActionInfo({ key: 'created', label: 'Olusturuldu (mock)', row: form })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title={title}
        description={description}
        right={<PrimaryButton onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>}
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px] max-w-md">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Tabloda ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {search && <OutlineButton onClick={() => setSearch('')}>Temizle</OutlineButton>}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              {columns.map((c) => <th key={c.key} className={c.className || ''}>{c.label}</th>)}
              <th className="w-12 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => (
                  <td key={c.key} className={c.className || ''}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                <td className="text-right"><RowActions row={row} onAction={handleAction} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`Yeni Kayit - ${title}`}
        description="Yeni kayit icin alanlari doldurun"
        size="md"
        footer={
          <>
            <OutlineButton onClick={() => setCreateOpen(false)}>Vazgec</OutlineButton>
            <PrimaryButton onClick={submit}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {columns.map((c) => (
            <label key={c.key} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{c.label}</span>
              <input
                className="form-input"
                value={form[c.key] ?? ''}
                onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
              />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        open={!!actionInfo}
        onClose={() => setActionInfo(null)}
        title={actionInfo?.label}
        description="Mock prototip - bu islem henuz aktif degildir"
        footer={<PrimaryButton onClick={() => setActionInfo(null)}>Tamam</PrimaryButton>}
      >
        <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(actionInfo?.row || {}, null, 2)}</pre>
      </Modal>
    </div>
  )
}
