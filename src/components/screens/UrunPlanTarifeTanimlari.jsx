import { useMemo, useState } from 'react'
import { Plus, Search, ArrowLeft, LayoutGrid, List as ListIcon } from 'lucide-react'
import { urunPlanTarifeKartlari, urunPlanlari } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

const PLAN_ACTIONS = [
  { key: 'view', label: 'Goruntule', icon: 'view' },
  { key: 'edit', label: 'Plan Tanimi', icon: 'edit' },
  { key: 'copy', label: 'Plani Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyon Gecmisi', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const URUN_ACTIONS = [
  { key: 'view', label: 'Planlarini Goruntule', icon: 'view' },
  { key: 'edit', label: 'Urun Tanimi', icon: 'edit' },
  { key: 'copy', label: 'Urun Kopyala', icon: 'copy' },
  { key: 'history', label: 'Versiyon Gecmisi', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

function ProductCard({ urun, onOpen }) {
  return (
    <div
      onClick={() => onOpen(urun)}
      className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">{urun.id}</div>
          <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700">{urun.ad}</h3>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">{urun.sozlesmeTipi}</span>
      </div>
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
  )
}

function PlanList({ urun, onBack }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [actionInfo, setActionInfo] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', durum: 'Taslak', oran: 30, tarih: '' })

  const planlar = urunPlanlari[urun.id] || []
  const filtered = planlar.filter((p) => {
    const matchSearch = !search || p.ad.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.durum === statusFilter
    return matchSearch && matchStatus
  })

  const handleAction = (key, row) => {
    const labelMap = Object.fromEntries(PLAN_ACTIONS.map((a) => [a.key, a.label]))
    setActionInfo({ key, label: labelMap[key] || key, row })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OutlineButton onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Urun Listesi
          </OutlineButton>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{urun.ad}</h2>
            <div className="text-xs text-slate-500">{urun.tipler}</div>
          </div>
        </div>
        <PrimaryButton onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Yeni Plan</PrimaryButton>
      </div>

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Plan adi veya kodu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Durum</label>
          <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tumu</option>
            <option value="Yururlukte">Yururlukte</option>
            <option value="Taslak">Taslak</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th>Plan No</th>
              <th>Plan Adi</th>
              <th>Durum</th>
              <th>Tamamlanma</th>
              <th>Tarih</th>
              <th className="w-12 text-right">Aksiyon</th>
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
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${p.oran}%` }} />
                    </div>
                    <span className="text-xs text-slate-600 w-10 text-right">{p.oran}%</span>
                  </div>
                </td>
                <td>{p.tarih}</td>
                <td className="text-right"><RowActions row={p} actions={PLAN_ACTIONS} onAction={handleAction} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`Yeni Plan - ${urun.ad}`}
        size="lg"
        footer={<>
          <OutlineButton onClick={() => setCreateOpen(false)}>Vazgec</OutlineButton>
          <PrimaryButton onClick={() => { setCreateOpen(false); setActionInfo({ key: 'created', label: 'Yeni Plan Olusturuldu (mock)', row: { ...form, urun: urun.id } }) }}>Kaydet</PrimaryButton>
        </>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { k: 'id', l: 'Plan No' },{ k: 'ad', l: 'Plan Adi' },{ k: 'durum', l: 'Durum' },
            { k: 'oran', l: 'Tamamlanma %' },{ k: 'tarih', l: 'Tarih' },
          ].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
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

export default function UrunPlanTarifeTanimlari() {
  const [view, setView] = useState('grid')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [actionInfo, setActionInfo] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'Ferdi', tarih: '' })

  const filtered = useMemo(() => {
    if (!search) return urunPlanTarifeKartlari
    return urunPlanTarifeKartlari.filter((u) => u.ad.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()))
  }, [search])

  const handleUrunAction = (key, row) => {
    if (key === 'view') { setSelected(row); return }
    const labelMap = Object.fromEntries(URUN_ACTIONS.map((a) => [a.key, a.label]))
    setActionInfo({ key, label: labelMap[key] || key, row })
  }

  if (selected) {
    return <PlanList urun={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Urun - Plan - Tarife Tanimlari"
        description="Urun, plan ve tarife tanimlarinin kart goruntusunde listelendigi ekrandir."
        right={
          <>
            <OutlineButton onClick={() => setView('grid')} className={view === 'grid' ? 'border-blue-300 text-blue-700' : ''}>
              <LayoutGrid className="w-4 h-4" /> Kart
            </OutlineButton>
            <OutlineButton onClick={() => setView('list')} className={view === 'list' ? 'border-blue-300 text-blue-700' : ''}>
              <ListIcon className="w-4 h-4" /> Liste
            </OutlineButton>
            <PrimaryButton onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Yeni Urun</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Urun ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((u) => <ProductCard key={u.id} urun={u} onOpen={setSelected} />)}
          </div>
        ) : (
          <table className="w-full grid-table bg-white border border-slate-200 rounded-md overflow-hidden">
            <thead>
              <tr>
                <th>Urun Kodu</th>
                <th>Urun Adi</th>
                <th>Sozlesme Tipi</th>
                <th>Aktif Plan</th>
                <th>Toplam Plan</th>
                <th>Tarih</th>
                <th className="w-12 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="cursor-pointer" onClick={() => setSelected(u)}>
                  <td className="font-mono text-xs">{u.id}</td>
                  <td className="font-semibold text-slate-800">{u.ad}</td>
                  <td>{u.sozlesmeTipi}</td>
                  <td>{u.aktif}</td>
                  <td>{u.toplam}</td>
                  <td>{u.tarih}</td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    <RowActions row={u} actions={URUN_ACTIONS} onAction={handleUrunAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Yeni Urun"
        size="lg"
        footer={<>
          <OutlineButton onClick={() => setCreateOpen(false)}>Vazgec</OutlineButton>
          <PrimaryButton onClick={() => { setCreateOpen(false); setActionInfo({ key: 'created', label: 'Yeni Urun Olusturuldu (mock)', row: form }) }}>Kaydet</PrimaryButton>
        </>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { k: 'id', l: 'Urun Kodu' },{ k: 'ad', l: 'Urun Adi' },
            { k: 'tipler', l: 'Tipler' },{ k: 'sozlesmeTipi', l: 'Sozlesme Tipi' },
            { k: 'tarih', l: 'Tarih' },
          ].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
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
