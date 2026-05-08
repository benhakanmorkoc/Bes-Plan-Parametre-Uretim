import { useMemo, useState } from 'react'
import { Plus, Search, ArrowLeft, LayoutGrid, List as ListIcon } from 'lucide-react'
import { urunPlanTarifeKartlari, urunPlanlari } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

const PLAN_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'copy', label: 'Planı Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const URUN_ACTIONS = [
  { key: 'view', label: 'Planlarını Görüntüle', icon: 'view' },
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'copy', label: 'Ürünü Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

function normalizeDate(value) {
  return value || new Date().toLocaleDateString('tr-TR')
}

function normalizeProduct(payload, source = {}) {
  const toplam = Number(payload.toplam ?? source.toplam ?? 0)
  const aktif = Number(payload.aktif ?? source.aktif ?? 0)
  const kapali = Number(payload.kapali ?? source.kapali ?? Math.max(toplam - aktif, 0))
  return {
    ...source,
    ...payload,
    tip: 'plan',
    toplam,
    aktif,
    kapali,
    tarih: normalizeDate(payload.tarih ?? source.tarih),
  }
}

function normalizePlan(payload, source = {}) {
  return {
    ...source,
    ...payload,
    oran: Number(payload.oran ?? source.oran ?? 0),
    tarih: normalizeDate(payload.tarih ?? source.tarih),
  }
}

function ProductCard({ urun, onOpen, onAction }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="cursor-pointer" onClick={() => onOpen(urun)}>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">{urun.id}</div>
          <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700">{urun.ad}</h3>
        </div>
        <div className="flex items-start gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">{urun.sozlesmeTipi}</span>
          <RowActions row={urun} actions={URUN_ACTIONS} onAction={onAction} />
        </div>
      </div>
      <div className="cursor-pointer" onClick={() => onOpen(urun)}>
        <p className="text-xs text-slate-500 mb-3">{urun.tipler}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-md py-2">
            <div className="text-base font-bold text-slate-800">{urun.toplam}</div>
            <div className="text-[10px] uppercase text-slate-500">Plan</div>
          </div>
          <div className="bg-green-50 rounded-md py-2">
            <div className="text-base font-bold text-green-700">{urun.aktif}</div>
            <div className="text-[10px] uppercase text-green-600">Aktif</div>
          </div>
          <div className="bg-slate-50 rounded-md py-2">
            <div className="text-base font-bold text-slate-700">{urun.kapali}</div>
            <div className="text-[10px] uppercase text-slate-500">Kapali</div>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 mt-3">Olusturulma: {urun.tarih}</div>
      </div>
    </div>
  )
}

function PlanList({ urun, planlar, onBack, onSavePlan, onPlanAction }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', durum: 'Taslak', oran: 30, tarih: '' })

  const filtered = planlar.filter((p) => {
    const matchSearch = !search || p.ad.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.durum === statusFilter
    return matchSearch && matchStatus
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({ id: '', ad: '', durum: 'Taslak', oran: 30, tarih: '' })
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ ...row })
    setFormOpen(true)
  }

  const save = () => {
    if (!form.id.trim()) return alert('Plan No zorunludur.')
    if (!form.ad.trim()) return alert('Plan Adi zorunludur.')
    const payload = normalizePlan(form)
    const duplicate = planlar.some((p) => p.id === payload.id && p.id !== editingId)
    if (duplicate) return alert('Bu Plan No zaten kullaniliyor.')
    onSavePlan(payload, editingId)
    setFormOpen(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OutlineButton onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Ürün Listesi
          </OutlineButton>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{urun.ad}</h2>
            <div className="text-xs text-slate-500">{urun.tipler}</div>
          </div>
        </div>
        <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Plan</PrimaryButton>
      </div>

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Plan adı veya kodu..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Durum</label>
          <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tümü</option>
            <option value="Yururlukte">Yürürlükte</option>
            <option value="Taslak">Taslak</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th>Plan No</th>
              <th>Plan Adı</th>
              <th>Durum</th>
              <th>Tamamlanma</th>
              <th>Tarih</th>
              <th className="w-12 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs">{p.id}</td>
                <td>{p.ad}</td>
                <td><StatusBadge value={p.durum} /></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${p.oran}%` }} /></div>
                    <span className="text-xs text-slate-600 w-10 text-right">{p.oran}%</span>
                  </div>
                </td>
                <td>{p.tarih}</td>
                <td className="text-right">
                  <RowActions
                    row={p}
                    actions={PLAN_ACTIONS}
                    onAction={(key, row) => {
                      if (key === 'edit') openEdit(row)
                      else onPlanAction(key, row)
                    }}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${editingId ? 'Plan Güncelle' : 'Yeni Plan'} - ${urun.ad}`}
        size="lg"
        footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={save}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[{ k: 'id', l: 'Plan No' }, { k: 'ad', l: 'Plan Adi' }, { k: 'durum', l: 'Durum' }, { k: 'oran', l: 'Tamamlanma %' }, { k: 'tarih', l: 'Tarih' }].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default function UrunPlanTarifeTanimlari() {
  const [view, setView] = useState('grid')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(() => urunPlanTarifeKartlari.map((x) => ({ ...x })))
  const [plansByProduct, setPlansByProduct] = useState(() => Object.fromEntries(Object.entries(urunPlanlari).map(([k, v]) => [k, v.map((x) => ({ ...x }))])))
  const [formOpen, setFormOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'Ferdi', tarih: '', toplam: 0, aktif: 0, kapali: 0 })
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })

  const filtered = useMemo(() => {
    if (!search) return products
    return products.filter((u) => u.ad.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()))
  }, [search, products])

  const getPlans = (urunId) => plansByProduct[urunId] || []

  const recalcCounts = (urunId, currentProducts, currentPlansByProduct) => {
    const plans = currentPlansByProduct[urunId] || []
    const toplam = plans.length
    const aktif = plans.filter((p) => p.durum === 'Yururlukte').length
    const kapali = Math.max(toplam - aktif, 0)
    return currentProducts.map((p) => (p.id === urunId ? { ...p, toplam, aktif, kapali } : p))
  }

  const showVersions = (title, rows, renderRow) => {
    const first = rows[0] ? renderRow(rows[0]) : null
    const columns = first ? Object.keys(first) : []
    setInfoModal({
      open: true,
      title,
      body: rows.length ? (
        <div className="overflow-auto border border-slate-200 rounded-md">
          <table className="w-full grid-table text-sm">
            <thead><tr>{columns.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, idx) => {
              const mapped = renderRow(r)
              return <tr key={idx}>{columns.map((c) => <td key={c}>{mapped[c]}</td>)}</tr>
            })}</tbody>
          </table>
        </div>
      ) : <div className="text-sm text-slate-500">Kayit bulunamadi.</div>,
    })
  }

  const createCopiedId = (baseId, existsFn) => {
    let i = 1
    let candidate = `${baseId}-CP`
    while (existsFn(candidate)) {
      i += 1
      candidate = `${baseId}-CP${i}`
    }
    return candidate
  }

  const openCreateProduct = () => {
    setEditingProductId(null)
    setForm({ id: '', ad: '', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'Ferdi', tarih: '', toplam: 0, aktif: 0, kapali: 0 })
    setFormOpen(true)
  }

  const openEditProduct = (row) => {
    setEditingProductId(row.id)
    setForm({ ...row })
    setFormOpen(true)
  }

  const saveProduct = () => {
    if (!form.id.trim()) return alert('Ürün Kodu zorunludur.')
    if (!form.ad.trim()) return alert('Ürün Adı zorunludur.')
    const payload = normalizeProduct(form)
    const duplicate = products.some((p) => p.id === payload.id && p.id !== editingProductId)
    if (duplicate) return alert('Bu Ürün Kodu zaten mevcut.')

    if (editingProductId) {
      setProducts((prev) => prev.map((p) => (p.id === editingProductId ? payload : p)))
      if (editingProductId !== payload.id) {
        setPlansByProduct((prev) => {
          const existingPlans = prev[editingProductId] || []
          const { [editingProductId]: _, ...rest } = prev
          return { ...rest, [payload.id]: existingPlans }
        })
      }
      if (selected?.id === editingProductId) setSelected(payload)
    } else {
      setProducts((prev) => [...prev, payload])
      setPlansByProduct((prev) => ({ ...prev, [payload.id]: [] }))
    }
    setFormOpen(false)
  }

  const handleSavePlan = (payload, editingId) => {
    if (!selected) return
    setPlansByProduct((prev) => {
      const existing = prev[selected.id] || []
      const next = editingId ? existing.map((p) => (p.id === editingId ? payload : p)) : [...existing, payload]
      const nextMap = { ...prev, [selected.id]: next }
      setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
      return nextMap
    })
  }

  const handlePlanAction = (key, row) => {
    if (!selected) return
    if (key === 'view') {
      setInfoModal({
        open: true,
        title: 'Plan İncele',
        body: <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(row, null, 2)}</pre>,
      })
      return
    }
    if (key === 'copy') {
      const newId = createCopiedId(row.id, (id) => getPlans(selected.id).some((p) => p.id === id))
      handleSavePlan(normalizePlan({ ...row, id: newId, ad: `${row.ad} (Kopya)`, tarih: normalizeDate() }), null)
      return
    }
    if (key === 'version') {
      const base = row.id.split('-V')[0]
      const versionNo = getPlans(selected.id).filter((p) => p.id.startsWith(base)).length + 1
      handleSavePlan(normalizePlan({ ...row, id: `${base}-V${versionNo}`, ad: `${row.ad} v${versionNo}`, tarih: normalizeDate(), durum: 'Taslak' }), null)
      return
    }
    if (key === 'history') {
      const base = row.id.split('-V')[0]
      const versions = getPlans(selected.id).filter((p) => p.id.startsWith(base))
      showVersions(`${row.id} - Versiyonlar`, versions, (r) => ({
        'Plan No': r.id,
        'Plan Adi': r.ad,
        Durum: r.durum,
        'Tamamlanma %': r.oran,
        Tarih: r.tarih,
      }))
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Plan silinsin mi?')) return
      setPlansByProduct((prev) => {
        const existing = prev[selected.id] || []
        const next = existing.filter((p) => p.id !== row.id)
        const nextMap = { ...prev, [selected.id]: next }
        setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
        return nextMap
      })
    }
  }

  const handleUrunAction = (key, row) => {
    if (key === 'view') { setSelected(row); return }
    if (key === 'edit') { openEditProduct(row); return }
    if (key === 'copy') {
      const newId = createCopiedId(row.id, (id) => products.some((p) => p.id === id))
      const copied = normalizeProduct({ ...row, id: newId, ad: `${row.ad} (Kopya)`, tarih: normalizeDate() }, row)
      setProducts((prev) => [...prev, copied])
      setPlansByProduct((prev) => ({ ...prev, [newId]: (prev[row.id] || []).map((p) => ({ ...p, id: p.id.replace(row.id, newId), ad: `${p.ad} (Kopya)` })) }))
      return
    }
    if (key === 'version') {
      const base = row.id.split('-V')[0]
      const versions = products.filter((p) => p.id.startsWith(base))
      const newId = `${base}-V${versions.length + 1}`
      const versioned = normalizeProduct({ ...row, id: newId, ad: `${row.ad} v${versions.length + 1}`, tarih: normalizeDate() }, row)
      setProducts((prev) => [...prev, versioned])
      setPlansByProduct((prev) => ({ ...prev, [newId]: (prev[row.id] || []).map((p) => ({ ...p, id: p.id.replace(row.id, newId) })) }))
      return
    }
    if (key === 'history') {
      const versions = products.filter((p) => p.id.startsWith(row.id.split('-V')[0])).sort((a, b) => b.id.localeCompare(a.id))
      showVersions(`${row.id} - Versiyonlar`, versions, (r) => ({
        'Ürün Kodu': r.id,
        'Ürün Adı': r.ad,
        'Sözleşme Tipi': r.sozlesmeTipi,
        Tarih: r.tarih,
      }))
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Ürün silinsin mi?')) return
      setProducts((prev) => prev.filter((p) => p.id !== row.id))
      setPlansByProduct((prev) => {
        const { [row.id]: _, ...rest } = prev
        return rest
      })
      if (selected?.id === row.id) setSelected(null)
    }
  }

  if (selected) {
    return <PlanList urun={selected} planlar={getPlans(selected.id)} onBack={() => setSelected(null)} onSavePlan={handleSavePlan} onPlanAction={handlePlanAction} />
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Ürün - Plan - Tarife Tanımları"
        description="Ürün, plan ve tarife tanımlarının kart görünümünde listelendiği ekrandır."
        right={
          <>
            <OutlineButton onClick={() => setView('grid')} className={view === 'grid' ? 'border-blue-300 text-blue-700' : ''}><LayoutGrid className="w-4 h-4" /> Kart</OutlineButton>
            <OutlineButton onClick={() => setView('list')} className={view === 'list' ? 'border-blue-300 text-blue-700' : ''}><ListIcon className="w-4 h-4" /> Liste</OutlineButton>
            <PrimaryButton onClick={openCreateProduct}><Plus className="w-4 h-4" /> Yeni Ürün</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((u) => <ProductCard key={u.id} urun={u} onOpen={setSelected} onAction={handleUrunAction} />)}
          </div>
        ) : (
          <table className="w-full grid-table bg-white border border-slate-200 rounded-md overflow-hidden">
            <thead><tr><th>Ürün Kodu</th><th>Ürün Adı</th><th>Sözleşme Tipi</th><th>Aktif Plan</th><th>Toplam Plan</th><th>Tarih</th><th className="w-12 text-right">İşlemler</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="cursor-pointer" onClick={() => setSelected(u)}>
                  <td className="font-mono text-xs">{u.id}</td>
                  <td className="font-semibold text-slate-800">{u.ad}</td>
                  <td>{u.sozlesmeTipi}</td>
                  <td>{u.aktif}</td>
                  <td>{u.toplam}</td>
                  <td>{u.tarih}</td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}><RowActions row={u} actions={URUN_ACTIONS} onAction={handleUrunAction} /></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingProductId ? 'Ürün Güncelle' : 'Yeni Ürün'} size="lg" footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={saveProduct}>Kaydet</PrimaryButton></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[{ k: 'id', l: 'Ürün Kodu' }, { k: 'ad', l: 'Ürün Adı' }, { k: 'tipler', l: 'Tipler' }, { k: 'sozlesmeTipi', l: 'Sözleşme Tipi' }, { k: 'tarih', l: 'Tarih' }, { k: 'toplam', l: 'Toplam Plan' }, { k: 'aktif', l: 'Aktif Plan' }].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>

      <Modal open={infoModal.open} onClose={() => setInfoModal({ open: false, title: '', body: null })} title={infoModal.title} footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}>
        {infoModal.body}
      </Modal>
    </div>
  )
}
