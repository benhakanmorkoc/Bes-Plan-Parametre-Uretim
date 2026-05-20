import { useMemo, useState } from 'react'
import { ArrowLeft, MoreVertical, Plus, Search } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { sozlesmeTipi as seedRows } from '../../data/mockData'

const BRANS_OPTIONS = ['Bireysel Emeklilik', 'Hayat', 'Sağlık', 'Elementer']

function emptyForm() {
  return { id: null, brans: 'Bireysel Emeklilik', kod: '', aciklama: '' }
}

export default function SozlesmeTipi() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [menuId, setMenuId] = useState(null)
  const [filterBrans, setFilterBrans] = useState('Tümü')
  const [filterKod, setFilterKod] = useState('')
  const [form, setForm] = useState(emptyForm())

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const bransOk = filterBrans === 'Tümü' || r.brans === filterBrans
      const kodOk = !filterKod.trim() || String(r.kod).toLowerCase().includes(filterKod.toLowerCase())
      return bransOk && kodOk
    })
  }, [rows, filterBrans, filterKod])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setView('create')
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ id: row.id, brans: row.brans, kod: row.kod, aciklama: row.aciklama })
    setView('create')
    setMenuId(null)
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((x) => x.id !== row.id))
    setMenuId(null)
  }

  const saveForm = () => {
    if (!form.brans) return alert('Branş zorunludur.')
    if (!String(form.kod).trim()) return alert('Sözleşme (Ürün Tipi) Kodu zorunludur.')
    if (!String(form.aciklama).trim()) return alert('Açıklama zorunludur.')

    const payload = {
      id: form.id || Date.now(),
      brans: form.brans,
      kod: String(form.kod).trim().toUpperCase(),
      aciklama: String(form.aciklama).trim(),
    }

    const existsByKod = rows.some((r) => r.kod === payload.kod && r.id !== payload.id)
    if (existsByKod) return alert('Bu kod zaten mevcut.')

    if (editingId) {
      setRows((prev) => prev.map((r) => (r.id === editingId ? payload : r)))
    } else {
      setRows((prev) => [...prev, payload])
    }
    setView('list')
  }

  if (view === 'create') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setView('list')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{editingId ? 'Sözleşme (Ürün) Tipi Güncelle' : 'Sözleşme (Ürün) Tipi Ekle'}</h2>
            <p className="text-sm text-slate-500 mt-1">Sistem için sözleşme (ürün) tipi tanımlayın</p>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Branş *</span>
              <select className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.brans} onChange={(e) => setForm((f) => ({ ...f, brans: e.target.value }))}>
                {BRANS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Sözleşme(Ürün Tipi) Kodu *</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.kod} onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))} />
            </label>
            <label className="md:col-span-2">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Açıklama</span>
              <textarea className="w-full min-h-[80px] border border-slate-300 rounded-md px-3 py-2 text-sm" value={form.aciklama} onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))} />
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
        title="Sözleşme (Ürün) Tipi Tanımları"
        description="Sistemdeki ürün tiplerini ve açıklamalarını buradan yönetebilirsiniz."
        right={<PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>}
      />

      <div className="px-6 py-4 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <span className="block text-xs text-slate-600 mb-1">Filtre - Branş</span>
            <select className="w-full h-9 border border-slate-300 rounded-md px-3 text-sm" value={filterBrans} onChange={(e) => setFilterBrans(e.target.value)}>
              <option>Tümü</option>
              {BRANS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <span className="block text-xs text-slate-600 mb-1">Filtre - Kodu</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Kod ara..." value={filterKod} onChange={(e) => setFilterKod(e.target.value)} />
            </div>
          </div>
          <div className="flex items-end">
            <OutlineButton onClick={() => { setFilterBrans('Tümü'); setFilterKod('') }}>Temizle</OutlineButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm">
          <thead>
            <tr>
              <th>Branş Adı</th>
              <th>Sözleşme(Ürün Tipi) Kodu</th>
              <th>Açıklama</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td>{r.brans}</td>
                <td><span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{r.kod}</span></td>
                <td>{r.aciklama}</td>
                <td className="text-right">
                  <div className="relative inline-block">
                    <button type="button" className="p-1.5 text-slate-500 hover:bg-slate-100 rounded" onClick={() => setMenuId((p) => (p === r.id ? null : r.id))}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuId === r.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-md z-20">
                        <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50" onClick={() => openEdit(r)}>Güncelle</button>
                        <button type="button" className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => removeRow(r)}>Sil</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filteredRows.length && (
              <tr>
                <td colSpan={4} className="py-6 text-sm text-slate-500 text-center">Kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
