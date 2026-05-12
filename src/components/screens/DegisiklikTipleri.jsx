import { useMemo, useState } from 'react'
import { ArrowLeft, Link2, List, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { degisiklikTipleri as seedRows } from '../../data/mockData'

const AVAILABLE_PLANS = [
  { no: '001', ad: 'LIMITLI PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '002', ad: 'STANDART PLAN', versiyon: '2', durum: 'Yürürlükte', baslangic: '15.03.2025' },
  { no: '005', ad: 'TSK MENSUPLARI EMEKLILIK PLANI', versiyon: '3', durum: 'Taslak', baslangic: '01.06.2025' },
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
  const [boundPlans, setBoundPlans] = useState(AVAILABLE_PLANS)
  const [boundGonderi, setBoundGonderi] = useState(AVAILABLE_GONDERI.slice(0, 3))

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
        title="Bağlı Planlar(Değişiklik Tipleri)"
        size="xl"
        footer={<><OutlineButton onClick={() => setPlanBindOpen(false)}>İptal</OutlineButton><OutlineButton>Temizle</OutlineButton><PrimaryButton onClick={() => setPlanBindOpen(false)}>Kaydet</PrimaryButton></>}
      >
        <div className="space-y-3">
          <div>
            <OutlineButton>Filtre Seçenekleri</OutlineButton>
          </div>
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Plan Kodu / Adı</th>
                  <th>Durumu</th>
                  <th>Plan Versiyonu</th>
                  <th>Plan Versiyon Başlangıç Tarihi</th>
                  <th className="text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {boundPlans.map((p) => (
                  <tr key={p.no}>
                    <td className="font-semibold">{p.no} - {p.ad}</td>
                    <td><span className={`px-2 py-0.5 rounded text-xs ${p.durum === 'Yürürlükte' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.durum}</span></td>
                    <td>{p.versiyon}</td>
                    <td>{p.baslangic}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-3">
                        <button type="button" className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                        <button type="button" className="text-red-500 hover:text-red-700" onClick={() => setBoundPlans((prev) => prev.filter((x) => x.no !== p.no))}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={gonderiBindOpen}
        onClose={() => setGonderiBindOpen(false)}
        title="Bağlı Gönderiler"
        size="xl"
        footer={null}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <select className="h-9 border border-slate-300 rounded-md px-2 text-sm"><option>Sistem (Tümü)</option></select>
            <select className="h-9 border border-slate-300 rounded-md px-2 text-sm"><option>Kategori (Tümü)</option></select>
            <input className="h-9 border border-slate-300 rounded-md px-2 text-sm" placeholder="Gönderi Adı" />
            <select className="h-9 border border-slate-300 rounded-md px-2 text-sm"><option>Gönderi Sebebi (Tümü)</option></select>
          </div>
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full grid-table text-sm">
              <thead><tr><th>Sistem</th><th>Kategori</th><th>Gönderi Adı</th><th>Gönderi Sebebi</th></tr></thead>
              <tbody>
                {boundGonderi.map((g) => (
                  <tr key={g.id}>
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
      </Modal>
    </div>
  )
}
