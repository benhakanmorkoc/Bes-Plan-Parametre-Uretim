import { useMemo, useState } from 'react'
import { ArrowLeft, Link2, List, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { degisiklikTipleri as seedRows } from '../../data/mockData'

const AVAILABLE_PLANS = [
  { no: '003', ad: 'ESNEK PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '004', ad: 'AILE PLANI', versiyon: '1', durum: 'Taslak', baslangic: '01.02.2025' },
  { no: '001', ad: 'LIMITLI PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '002', ad: 'STANDART PLAN', versiyon: '2', durum: 'Yürürlükte', baslangic: '15.03.2025' },
  { no: '005', ad: 'TSK MENSUPLARI EMEKLILIK PLANI', versiyon: '3', durum: 'Taslak', baslangic: '01.06.2025' },
  { no: '006', ad: 'GRUBA BAGLI BIREYSEL EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '11.06.2025' },
  { no: '007', ad: '0007 NOLU EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '20.06.2025' },
  { no: '008', ad: 'GRUBA BAGLI BIREYSEL EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '25.06.2025' },
]

const INITIAL_SELECTED_PLANS = [
  { no: '001', ad: 'LIMITLI PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '002', ad: 'STANDART PLAN', versiyon: '2', durum: 'Yürürlükte', baslangic: '15.03.2025' },
  { no: '005-1', ad: 'ASLAN BIREYSEL EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '01.07.2025' },
]

const AVAILABLE_GONDERI = [
  { id: '1', sistem: 'Sözleşme/Poliçe', kategori: 'Aktarım Bilgi Formu', ad: 'Aktarım Talep', sebep: 'Mevzuat' },
  { id: '2', sistem: 'Müşteri', kategori: 'Özel Gün', ad: 'Doğum Günü Bilgilendirme Mesajı', sebep: 'Genel Bilgilendirme' },
  { id: '3', sistem: 'Başvuru', kategori: 'Hesap Bildirim Cetveli', ad: 'Aylık Hesap Bildirim Cetveli', sebep: 'Operasyonel' },
  { id: '4', sistem: 'Teklif', kategori: 'Aktarım Bilgi Formu', ad: 'Teklif Aktarım Bilgilendirme', sebep: 'Mevzuat' },
]

function emptyForm() {
  return { id: null, brans: 'BES', zeyilKodu: '', zeyilAdi: '', yilLimit: '', primDegistirir: 'Hayir', uwVarMi: 'Hayir' }
}

export default function DegisiklikTipleri() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [menuId, setMenuId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [filterKod, setFilterKod] = useState('')
  const [filterAd, setFilterAd] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [planBindOpen, setPlanBindOpen] = useState(false)
  const [gonderiBindOpen, setGonderiBindOpen] = useState(false)
  const [leftPlans, setLeftPlans] = useState(() => AVAILABLE_PLANS.filter((p) => !INITIAL_SELECTED_PLANS.some((s) => s.no === p.no)))
  const [rightPlans, setRightPlans] = useState(INITIAL_SELECTED_PLANS)
  const [leftPlanSelected, setLeftPlanSelected] = useState([])
  const [rightPlanSelected, setRightPlanSelected] = useState([])
  const [planKodFilter, setPlanKodFilter] = useState('')

  const [leftGonderi, setLeftGonderi] = useState(AVAILABLE_GONDERI)
  const [rightGonderi, setRightGonderi] = useState([])
  const [leftGonderiSelected, setLeftGonderiSelected] = useState([])
  const [rightGonderiSelected, setRightGonderiSelected] = useState([])
  const [gonderiFilter, setGonderiFilter] = useState({ sistem: '', kategori: '', ad: '', sebep: '' })

  const filteredLeftPlans = useMemo(() => {
    if (!planKodFilter.trim()) return leftPlans
    const q = planKodFilter.toLowerCase()
    return leftPlans.filter((p) => p.no.toLowerCase().includes(q) || p.ad.toLowerCase().includes(q))
  }, [leftPlans, planKodFilter])

  const filteredLeftGonderi = useMemo(() => {
    return leftGonderi.filter((g) => {
      const s = !gonderiFilter.sistem || g.sistem === gonderiFilter.sistem
      const k = !gonderiFilter.kategori || g.kategori === gonderiFilter.kategori
      const a = !gonderiFilter.ad.trim() || g.ad.toLowerCase().includes(gonderiFilter.ad.toLowerCase())
      const se = !gonderiFilter.sebep || g.sebep === gonderiFilter.sebep
      return s && k && a && se
    })
  }, [leftGonderi, gonderiFilter])

  const movePlanOneRight = () => {
    const selectedRows = leftPlans.filter((p) => leftPlanSelected.includes(p.no))
    if (!selectedRows.length) return
    setRightPlans((prev) => [...prev, ...selectedRows])
    setLeftPlans((prev) => prev.filter((p) => !leftPlanSelected.includes(p.no)))
    setLeftPlanSelected([])
  }
  const movePlanAllRight = () => {
    if (!leftPlans.length) return
    setRightPlans((prev) => [...prev, ...leftPlans])
    setLeftPlans([])
    setLeftPlanSelected([])
  }
  const movePlanOneLeft = () => {
    const selectedRows = rightPlans.filter((p) => rightPlanSelected.includes(p.no))
    if (!selectedRows.length) return
    setLeftPlans((prev) => [...prev, ...selectedRows])
    setRightPlans((prev) => prev.filter((p) => !rightPlanSelected.includes(p.no)))
    setRightPlanSelected([])
  }
  const movePlanAllLeft = () => {
    if (!rightPlans.length) return
    setLeftPlans((prev) => [...prev, ...rightPlans])
    setRightPlans([])
    setRightPlanSelected([])
  }

  const moveGonderiOneRight = () => {
    const selectedRows = leftGonderi.filter((g) => leftGonderiSelected.includes(g.id))
    if (!selectedRows.length) return
    setRightGonderi((prev) => [...prev, ...selectedRows])
    setLeftGonderi((prev) => prev.filter((g) => !leftGonderiSelected.includes(g.id)))
    setLeftGonderiSelected([])
  }
  const moveGonderiAllRight = () => {
    if (!leftGonderi.length) return
    setRightGonderi((prev) => [...prev, ...leftGonderi])
    setLeftGonderi([])
    setLeftGonderiSelected([])
  }
  const moveGonderiOneLeft = () => {
    const selectedRows = rightGonderi.filter((g) => rightGonderiSelected.includes(g.id))
    if (!selectedRows.length) return
    setLeftGonderi((prev) => [...prev, ...selectedRows])
    setRightGonderi((prev) => prev.filter((g) => !rightGonderiSelected.includes(g.id)))
    setRightGonderiSelected([])
  }
  const moveGonderiAllLeft = () => {
    if (!rightGonderi.length) return
    setLeftGonderi((prev) => [...prev, ...rightGonderi])
    setRightGonderi([])
    setRightGonderiSelected([])
  }

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const k = !filterKod.trim() || r.zeyilKodu.toLowerCase().includes(filterKod.toLowerCase())
      const a = !filterAd.trim() || r.zeyilAdi.toLowerCase().includes(filterAd.toLowerCase())
      return k && a
    })
  }, [rows, filterKod, filterAd])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setView('create')
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ ...row })
    setView('create')
    setMenuId(null)
  }

  const saveForm = () => {
    if (!form.brans) return alert('Branş Kodu zorunludur.')
    if (!String(form.zeyilKodu).trim()) return alert('Zeyil Kodu zorunludur.')
    if (!String(form.zeyilAdi).trim()) return alert('Zeyil Adı zorunludur.')
    if (!String(form.yilLimit).trim()) return alert('Yılda Kaç Kez Yapılabilir zorunludur.')
    const payload = { ...form, id: form.id || Date.now() }
    const existsByCode = rows.some((r) => r.zeyilKodu === payload.zeyilKodu && r.id !== payload.id)
    if (existsByCode) return alert('Bu zeyil kodu mevcut.')
    if (editingId) setRows((prev) => prev.map((r) => (r.id === editingId ? payload : r)))
    else setRows((prev) => [...prev, payload])
    setView('list')
  }

  const toggleRow = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((x) => x.id !== row.id))
    setMenuId(null)
  }

  if (view === 'create') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setView('list')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{editingId ? 'Değişiklik (Zeyl) Tipi Güncelle' : 'Yeni Zeyil Tipi Ekle'}</h2>
            <p className="text-sm text-slate-500 mt-1">Sistem için değişiklik(zeyl) tipleri tanımlayın</p>
          </div>
        </div>
        <div className="p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Branş Kodu *</span>
              <select className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.brans} onChange={(e) => setForm((f) => ({ ...f, brans: e.target.value }))}>
                <option>BES</option>
              </select>
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Zeyil Kodu *</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.zeyilKodu} onChange={(e) => setForm((f) => ({ ...f, zeyilKodu: e.target.value }))} />
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Zeyil Adı *</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.zeyilAdi} onChange={(e) => setForm((f) => ({ ...f, zeyilAdi: e.target.value }))} />
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Yılda Kaç Kez Yapılabilir?</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" placeholder="Örn: 2" value={form.yilLimit} onChange={(e) => setForm((f) => ({ ...f, yilLimit: e.target.value }))} />
            </label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <OutlineButton onClick={() => setView('list')}>İptal</OutlineButton>
          <OutlineButton onClick={() => setForm(emptyForm())}>Temizle</OutlineButton>
          <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Değişiklik(Zeyl) Tipleri"
        right={
          <div className="flex items-center gap-2">
            <OutlineButton onClick={() => setPlanBindOpen(true)}><Link2 className="w-4 h-4" /> Planlara Bağla</OutlineButton>
            <OutlineButton onClick={() => setGonderiBindOpen(true)}><Link2 className="w-4 h-4" /> Gönderi Tiplerine Bağla</OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </div>
        }
      />

      <div className="px-6 py-4 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <span className="block text-xs text-slate-600 mb-1">Zeyil Kodu</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Kod ara..." value={filterKod} onChange={(e) => setFilterKod(e.target.value)} />
            </div>
          </div>
          <div>
            <span className="block text-xs text-slate-600 mb-1">Zeyil Adı</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Zeyil adı ara..." value={filterAd} onChange={(e) => setFilterAd(e.target.value)} />
            </div>
          </div>
          <div className="flex items-end"><OutlineButton onClick={() => { setFilterKod(''); setFilterAd('') }}>Temizle</OutlineButton></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm min-w-[1200px]">
          <thead>
            <tr>
              <th></th>
              <th>Branş Kodu</th>
              <th>Branş</th>
              <th>Zeyil Kodu</th>
              <th>Zeyil Adı</th>
              <th>Yılda Kaç Kez Yapılabilir?</th>
              <th>Prim Değiştiriyor mu?</th>
              <th>UW var mı?</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td><input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleRow(r.id)} /></td>
                <td className="font-semibold">{r.brans}</td>
                <td><span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-700">{r.brans}</span></td>
                <td className="font-semibold">{r.zeyilKodu}</td>
                <td>{r.zeyilAdi}</td>
                <td>{r.yilLimit}</td>
                <td>{r.primDegistirir === 'Evet' ? 'Evet' : 'Hayır'}</td>
                <td>{r.uwVarMi === 'Evet' ? 'Evet' : 'Hayır'}</td>
                <td className="text-right">
                  <div className="relative inline-block">
                    <button type="button" className="p-1.5 text-slate-500 hover:bg-slate-100 rounded" onClick={() => setMenuId((p) => (p === r.id ? null : r.id))}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuId === r.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-md z-20">
                        <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => openEdit(r)}><Pencil className="w-3.5 h-3.5 text-blue-600" /> Güncelle</button>
                        <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 inline-flex items-center gap-2" onClick={() => removeRow(r)}><Trash2 className="w-3.5 h-3.5" /> Sil</button>
                        <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => { setPlanBindOpen(true); setMenuId(null) }}><Link2 className="w-3.5 h-3.5 text-amber-600" /> Bağlı Planlar</button>
                        <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => { setGonderiBindOpen(true); setMenuId(null) }}><List className="w-3.5 h-3.5 text-violet-600" /> Bağlı Gönderiler</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2"><span>Sayfa başına</span><select className="h-8 border border-slate-300 rounded-md px-2"><option>10</option></select></div>
        <span>Toplam {rows.length} kayıt</span>
      </div>

      <Modal
        open={planBindOpen}
        onClose={() => setPlanBindOpen(false)}
        title="Planlara Bağla(Değişiklik Tipleri)"
        size="xl"
        footer={
          <>
            <OutlineButton onClick={() => setPlanBindOpen(false)}>İptal</OutlineButton>
            <OutlineButton onClick={() => { setLeftPlans(AVAILABLE_PLANS); setRightPlans([]); setLeftPlanSelected([]); setRightPlanSelected([]); setPlanKodFilter('') }}>Temizle</OutlineButton>
            <PrimaryButton onClick={() => setPlanBindOpen(false)}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <div className="border border-slate-200 rounded-md p-2">
            <div className="text-center text-sm font-semibold text-red-700 mb-2">Seçilmemiş Taslak Planlar</div>
            <div className="flex items-end gap-2 mb-2">
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">Kod :</div>
                <select className="w-full h-9 border border-slate-300 rounded px-2 text-sm" value={planKodFilter} onChange={(e) => setPlanKodFilter(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  {[...new Set(leftPlans.map((p) => p.no))].map((kod) => <option key={kod} value={kod}>{kod}</option>)}
                </select>
              </div>
              <PrimaryButton onClick={() => {}}>Ara</PrimaryButton>
            </div>
            <div className="max-h-[330px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>Plan No</th>
                    <th>Plan Adı</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeftPlans.map((p) => (
                    <tr key={p.no}>
                      <td><input type="checkbox" checked={leftPlanSelected.includes(p.no)} onChange={() => setLeftPlanSelected((prev) => prev.includes(p.no) ? prev.filter((x) => x !== p.no) : [...prev, p.no])} /></td>
                      <td>{p.no}</td>
                      <td>{p.ad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-20">
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanOneRight}>--&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanAllRight}>&gt;&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanOneLeft}>&lt;--</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanAllLeft}>&lt;&lt;</button>
          </div>
          <div className="border border-slate-200 rounded-md p-2">
            <div className="text-center text-sm font-semibold text-emerald-700 mb-2">Seçilmiş Planlar</div>
            <div className="flex items-end gap-2 mb-2">
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">Kod :</div>
                <select className="w-full h-9 border border-slate-300 rounded px-2 text-sm">
                  <option value="">Seçiniz...</option>
                </select>
              </div>
              <PrimaryButton onClick={() => {}}>Ara</PrimaryButton>
            </div>
            <div className="max-h-[330px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>Plan No</th>
                    <th>Plan Adı</th>
                    <th>Versiyon</th>
                    <th>Plan Durumu</th>
                  </tr>
                </thead>
                <tbody>
                  {rightPlans.map((p) => (
                    <tr key={p.no}>
                      <td><input type="checkbox" checked={rightPlanSelected.includes(p.no)} onChange={() => setRightPlanSelected((prev) => prev.includes(p.no) ? prev.filter((x) => x !== p.no) : [...prev, p.no])} /></td>
                      <td>{p.no}</td>
                      <td>{p.ad}</td>
                      <td>{p.versiyon}</td>
                      <td><span className={`px-1.5 py-0.5 rounded text-xs ${p.durum === 'Yürürlükte' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.durum}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={gonderiBindOpen}
        onClose={() => setGonderiBindOpen(false)}
        title="Gönderi Tiplerine Bağla"
        size="xl"
        footer={
          <>
            <OutlineButton onClick={() => setGonderiBindOpen(false)}>İptal</OutlineButton>
            <OutlineButton onClick={() => { setLeftGonderi(AVAILABLE_GONDERI); setRightGonderi([]); setLeftGonderiSelected([]); setRightGonderiSelected([]); setGonderiFilter({ sistem: '', kategori: '', ad: '', sebep: '' }) }}>Temizle</OutlineButton>
            <PrimaryButton onClick={() => setGonderiBindOpen(false)}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <div className="border border-slate-200 rounded-md p-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select className="h-9 border border-slate-300 rounded-md px-2 text-sm" value={gonderiFilter.sistem} onChange={(e) => setGonderiFilter((p) => ({ ...p, sistem: e.target.value }))}>
                <option value="">Sistem (Tümü)</option>
                {[...new Set(AVAILABLE_GONDERI.map((g) => g.sistem))].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="h-9 border border-slate-300 rounded-md px-2 text-sm" value={gonderiFilter.kategori} onChange={(e) => setGonderiFilter((p) => ({ ...p, kategori: e.target.value }))}>
                <option value="">Kategori (Tümü)</option>
                {[...new Set(AVAILABLE_GONDERI.map((g) => g.kategori))].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <input className="h-9 border border-slate-300 rounded-md px-2 text-sm" placeholder="Gönderi Adı" value={gonderiFilter.ad} onChange={(e) => setGonderiFilter((p) => ({ ...p, ad: e.target.value }))} />
              <select className="h-9 border border-slate-300 rounded-md px-2 text-sm" value={gonderiFilter.sebep} onChange={(e) => setGonderiFilter((p) => ({ ...p, sebep: e.target.value }))}>
                <option value="">Gönderi Sebebi (Tümü)</option>
                {[...new Set(AVAILABLE_GONDERI.map((g) => g.sebep))].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="max-h-[330px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead><tr><th></th><th>Sistem</th><th>Kategori</th><th>Gönderi Adı</th><th>Gönderi Sebebi</th></tr></thead>
                <tbody>
                  {filteredLeftGonderi.map((g) => (
                    <tr key={g.id}>
                      <td><input type="checkbox" checked={leftGonderiSelected.includes(g.id)} onChange={() => setLeftGonderiSelected((prev) => prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id])} /></td>
                      <td>{g.sistem}</td>
                      <td>{g.kategori}</td>
                      <td>{g.ad}</td>
                      <td>{g.sebep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-20">
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiOneRight}>--&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiAllRight}>&gt;&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiOneLeft}>&lt;--</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiAllLeft}>&lt;&lt;</button>
          </div>
          <div className="border border-slate-200 rounded-md p-2">
            <div className="text-sm font-semibold text-emerald-700 mb-2">Seçilmiş Gönderi Tipleri</div>
            <div className="max-h-[370px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead><tr><th></th><th>Sistem</th><th>Kategori</th><th>Gönderi Adı</th><th>Gönderi Sebebi</th></tr></thead>
                <tbody>
                  {rightGonderi.map((g) => (
                    <tr key={g.id}>
                      <td><input type="checkbox" checked={rightGonderiSelected.includes(g.id)} onChange={() => setRightGonderiSelected((prev) => prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id])} /></td>
                      <td>{g.sistem}</td>
                      <td>{g.kategori}</td>
                      <td>{g.ad}</td>
                      <td>{g.sebep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
