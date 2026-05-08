import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

export default function LookupTable({ title, description, columns, data, searchKeys = [] }) {
  const [rows, setRows] = useState(() => data)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({})
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [actionInfo, setActionInfo] = useState(null)

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    const closeMenu = () => setOpenMenuRowId(null)
    window.addEventListener('click', closeMenu)
    return () => window.removeEventListener('click', closeMenu)
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    const keys = searchKeys.length ? searchKeys : columns.map((c) => c.key)
    return rows.filter((row) => keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)))
  }, [search, rows, columns, searchKeys])

  const openInspect = (row) => {
    setActionInfo({ key: 'view', label: 'İncele', row })
    setOpenMenuRowId(null)
  }

  const openEdit = (row, asNewVersion = false) => {
    const seed = { ...row }
    if (asNewVersion && seed.versiyon) {
      const next = Number(seed.versiyon)
      if (!Number.isNaN(next)) seed.versiyon = String(next + 1)
    }
    setForm(seed)
    setCreateOpen(true)
    setOpenMenuRowId(null)
  }

  const openVersions = (row) => {
    const currentVersion = Number(row.versiyon || 1)
    const versions = [currentVersion - 2, currentVersion - 1].filter((v) => v > 0)
    setActionInfo({ key: 'history', label: 'Versiyonlar', row: { ...row, versions } })
    setOpenMenuRowId(null)
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setOpenMenuRowId(null)
  }

  const submit = () => {
    const payload = { ...form }
    if (!payload.id) payload.id = Date.now()
    const exists = rows.some((r) => r.id === payload.id)
    if (exists) {
      setRows((prev) => prev.map((r) => (r.id === payload.id ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, payload])
    }
    setCreateOpen(false)
    setForm({})
    setActionInfo({ key: 'created', label: 'Kayıt Kaydedildi', row: payload })
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
              <th className="w-12 text-right">İşlemler</th>
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
                <td className="text-right relative">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuRowId((prev) => (prev === row.id ? null : row.id))
                    }}
                  >
                    ...
                  </button>
                  {openMenuRowId === row.id && (
                    <div
                      className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openInspect(row)}>
                        İncele
                      </button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openEdit(row, false)}>
                        Güncelle
                      </button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openEdit(row, true)}>
                        Yeni Versiyon
                      </button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openVersions(row)}>
                        Versiyonlar
                      </button>
                      <button type="button" className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => removeRow(row)}>
                        Sil
                      </button>
                    </div>
                  )}
                </td>
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
        title={`Yeni Ekle - ${title}`}
        description="Alanları düzenleyip kaydedin"
        size="md"
        footer={
          <>
            <OutlineButton onClick={() => setCreateOpen(false)}>Vazgeç</OutlineButton>
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
                onChange={(e) => setForm({ ...form, id: form.id, [c.key]: e.target.value })}
              />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        open={!!actionInfo}
        onClose={() => setActionInfo(null)}
        title={actionInfo?.label}
        description="Mock prototip işlem çıktısı"
        footer={<PrimaryButton onClick={() => setActionInfo(null)}>Tamam</PrimaryButton>}
      >
        {actionInfo?.key === 'history' ? (
          <div className="text-sm">
            {(actionInfo.row?.versions || []).length ? (
              <ul className="list-disc pl-5">
                {actionInfo.row.versions.map((v) => <li key={v}>Versiyon {v}</li>)}
              </ul>
            ) : (
              <p>Önceki versiyon bulunamadı.</p>
            )}
          </div>
        ) : (
          <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(actionInfo?.row || {}, null, 2)}</pre>
        )}
      </Modal>
    </div>
  )
}
