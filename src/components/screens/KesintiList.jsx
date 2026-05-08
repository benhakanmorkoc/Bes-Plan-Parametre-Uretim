import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'
import { urunPlanlari, urunPlanTarifeKartlari } from '../../data/mockData'

const PLAN_LISTESI = Object.values(urunPlanlari).flat().map((p, i) => ({
  id: p.id,
  ad: p.ad,
  urun: urunPlanTarifeKartlari.find((u) => urunPlanlari[u.id]?.includes(p))?.ad || '-',
  durum: p.durum,
}))

export default function KesintiList({ title, description, columns, data, searchKeys = [] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [planFilter, setPlanFilter] = useState('')
  const [pickedPlans, setPickedPlans] = useState([])
  const [form, setForm] = useState({})
  const [actionInfo, setActionInfo] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    const keys = searchKeys.length ? searchKeys : columns.map((c) => c.key)
    return data.filter((row) => keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)))
  }, [search, data, columns, searchKeys])

  const allChecked = selected.length === filtered.length && filtered.length > 0
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map((r) => r.id))
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleAction = (key, row) => {
    const labelMap = { view: 'Goruntule', edit: 'Duzenle', copy: 'Kopyala', version: 'Yeni Versiyon', history: 'Versiyon Gecmisi', delete: 'Sil' }
    setActionInfo({ key, label: labelMap[key] || key, row })
  }

  const submitCreate = () => {
    setCreateOpen(false)
    setForm({})
    setActionInfo({ key: 'created', label: 'Yeni Kayit Olusturuldu (mock)', row: form })
  }

  const submitLink = () => {
    setLinkOpen(false)
    setActionInfo({ key: 'linked', label: 'Planlara Baglandi (mock)', row: { kesintiler: selected, planlar: pickedPlans } })
    setPickedPlans([])
  }

  const filteredPlans = useMemo(() => {
    if (!planFilter.trim()) return PLAN_LISTESI
    const q = planFilter.toLowerCase()
    return PLAN_LISTESI.filter((p) => [p.id, p.ad, p.urun].some((v) => String(v).toLowerCase().includes(q)))
  }, [planFilter])

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title={title}
        description={description}
        right={
          <>
            <OutlineButton disabled={selected.length === 0} onClick={() => setLinkOpen(true)}>
              <LinkIcon className="w-4 h-4" /> Planlara Bagla {selected.length > 0 && <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full">{selected.length}</span>}
            </OutlineButton>
            <PrimaryButton onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px] max-w-md">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Kod / Ad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10"><input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} /></th>
              {columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th className="w-12 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="rounded" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} /></td>
                {columns.map((c) => (
                  <td key={c.key} className={c.className || ''}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                <td className="text-right"><RowActions row={row} onAction={handleAction} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 2} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`Yeni Kayit - ${title}`}
        description="Yeni kayit icin alanlari doldurun"
        size="lg"
        footer={
          <>
            <OutlineButton onClick={() => setCreateOpen(false)}>Vazgec</OutlineButton>
            <PrimaryButton onClick={submitCreate}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {columns.map((c) => (
            <label key={c.key} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{c.label}</span>
              <input className="form-input" value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Planlara Bagla"
        description={`${selected.length} adet kayit secili. Baglanacak plan(lari) seciniz.`}
        size="lg"
        footer={
          <>
            <OutlineButton onClick={() => setLinkOpen(false)}>Vazgec</OutlineButton>
            <PrimaryButton disabled={pickedPlans.length === 0} onClick={submitLink}>Bagla ({pickedPlans.length})</PrimaryButton>
          </>
        }
      >
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Plan ara..." value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} />
        </div>
        <div className="max-h-80 overflow-auto border border-slate-200 rounded-md">
          <table className="w-full grid-table text-sm">
            <thead><tr><th className="w-10"></th><th>Plan ID</th><th>Plan</th><th>Urun</th><th>Durum</th></tr></thead>
            <tbody>
              {filteredPlans.map((p) => {
                const checked = pickedPlans.includes(p.id)
                return (
                  <tr key={p.id} className="cursor-pointer" onClick={() => setPickedPlans((prev) => checked ? prev.filter((x) => x !== p.id) : [...prev, p.id])}>
                    <td><input type="checkbox" checked={checked} readOnly /></td>
                    <td className="font-mono text-xs">{p.id}</td>
                    <td className="font-medium">{p.ad}</td>
                    <td>{p.urun}</td>
                    <td>{p.durum}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
