import { useMemo, useState } from 'react'
import { ArrowLeft, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { asgariUcretTablosu as seedRows } from '../../data/mockData'

function toIsoDate(dateStr) {
  if (!dateStr) return ''
  if (dateStr.includes('-')) return dateStr
  const parts = dateStr.split('.')
  if (parts.length !== 3) return ''
  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
}

function emptyForm() {
  return { id: null, gecerlilikTarihi: '', asgariUcret: '', katkiPayiOrani: '0.00', girisAidatiOrani: '0.00' }
}

function formatMoney(value) {
  const n = Number(String(value).replace(',', '.'))
  if (!Number.isFinite(n)) return value
  return `${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`
}

export default function AsgariUcretTablosu() {
  const [rows, setRows] = useState(() =>
    seedRows.map((x) => ({ ...x, gecerlilikTarihi: toIsoDate(x.gecerlilikTarihi) })).sort((a, b) => (a.gecerlilikTarihi < b.gecerlilikTarihi ? 1 : -1)),
  )
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minTutar, setMinTutar] = useState('')
  const [maxTutar, setMaxTutar] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({ startDate: '', endDate: '', minTutar: '', maxTutar: '' })

  const todayIso = new Date().toISOString().slice(0, 10)

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const asgari = Number(String(r.asgariUcret).replace(',', '.'))
      if (appliedFilters.startDate && r.gecerlilikTarihi < appliedFilters.startDate) return false
      if (appliedFilters.endDate && r.gecerlilikTarihi > appliedFilters.endDate) return false
      if (appliedFilters.minTutar && asgari < Number(appliedFilters.minTutar)) return false
      if (appliedFilters.maxTutar && asgari > Number(appliedFilters.maxTutar)) return false
      return true
    })
  }, [rows, appliedFilters])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setView('create')
  }

  const canEditDelete = (row) => row.gecerlilikTarihi >= todayIso

  const openEdit = (row) => {
    if (!canEditDelete(row)) return
    setEditingId(row.id)
    setForm({
      id: row.id,
      gecerlilikTarihi: row.gecerlilikTarihi,
      asgariUcret: String(row.asgariUcret),
      katkiPayiOrani: String(row.katkiPayiOrani),
      girisAidatiOrani: String(row.girisAidatiOrani),
    })
    setView('create')
  }

  const saveForm = () => {
    if (!form.gecerlilikTarihi) return alert('Geçerlilik Tarihi zorunludur.')
    if (!String(form.asgariUcret).trim()) return alert('Asgari Ücret Tutarı zorunludur.')
    const payload = {
      id: form.id || Date.now(),
      gecerlilikTarihi: form.gecerlilikTarihi,
      asgariUcret: String(form.asgariUcret).trim(),
      katkiPayiOrani: String(form.katkiPayiOrani || '0.00').trim(),
      girisAidatiOrani: String(form.girisAidatiOrani || '0.00').trim(),
    }

    const existsByDate = rows.some((r) => r.gecerlilikTarihi === payload.gecerlilikTarihi && r.id !== payload.id)
    if (existsByDate) return alert('Bu geçerlilik tarihinde kayıt mevcut.')

    if (editingId) {
      setRows((prev) => prev.map((r) => (r.id === editingId ? payload : r)).sort((a, b) => (a.gecerlilikTarihi < b.gecerlilikTarihi ? 1 : -1)))
    } else {
      setRows((prev) => [payload, ...prev].sort((a, b) => (a.gecerlilikTarihi < b.gecerlilikTarihi ? 1 : -1)))
    }
    setView('list')
  }

  const removeRow = (row) => {
    if (!canEditDelete(row)) return
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
  }

  if (view === 'create') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setView('list')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{editingId ? 'Asgari Ücret Güncelle' : 'Yeni Asgari Ücret Ekle'}</h2>
            <p className="text-sm text-slate-500 mt-1">Sistem için asgari ücret tablosu tanımlayın</p>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Geçerlilik Tarihi *</span>
              <input type="date" className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.gecerlilikTarihi} onChange={(e) => setForm((f) => ({ ...f, gecerlilikTarihi: e.target.value }))} />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Asgari Ücret Tutarı (TL) *</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" placeholder="Örn: 20002.50" value={form.asgariUcret} onChange={(e) => setForm((f) => ({ ...f, asgariUcret: e.target.value }))} />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Katkı Payı Oranı</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.katkiPayiOrani} onChange={(e) => setForm((f) => ({ ...f, katkiPayiOrani: e.target.value }))} />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Giriş Aidatı Oranı</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.girisAidatiOrani} onChange={(e) => setForm((f) => ({ ...f, girisAidatiOrani: e.target.value }))} />
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
        title="Asgari Ücret Tablosu Yönetimi"
        description="Asgari ücret ve oranlarının geçmişe yönelik tarihsel olarak tutulduğu yasal referans tablosudur."
        right={
          <PrimaryButton onClick={openCreate}>
            <Plus className="w-4 h-4" /> Yeni Ekle
          </PrimaryButton>
        }
      />

      <div className="px-6 py-4 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-3">
          <label>
            <span className="text-xs text-slate-600 mb-1 block">Tarih (Başlangıç)</span>
            <input type="date" className="w-full h-9 border border-slate-300 rounded-md px-3 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            <span className="text-xs text-slate-600 mb-1 block">Tarih (Bitiş)</span>
            <input type="date" className="w-full h-9 border border-slate-300 rounded-md px-3 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label>
            <span className="text-xs text-slate-600 mb-1 block">Min Tutar (TL)</span>
            <input className="w-full h-9 border border-slate-300 rounded-md px-3 text-sm" placeholder="Örn: 10000" value={minTutar} onChange={(e) => setMinTutar(e.target.value)} />
          </label>
          <label>
            <span className="text-xs text-slate-600 mb-1 block">Max Tutar (TL)</span>
            <input className="w-full h-9 border border-slate-300 rounded-md px-3 text-sm" placeholder="Örn: 25000" value={maxTutar} onChange={(e) => setMaxTutar(e.target.value)} />
          </label>
          <div className="flex items-end gap-2">
            <OutlineButton onClick={() => { setStartDate(''); setEndDate(''); setMinTutar(''); setMaxTutar(''); setAppliedFilters({ startDate: '', endDate: '', minTutar: '', maxTutar: '' }) }}>Temizle</OutlineButton>
            <PrimaryButton onClick={() => setAppliedFilters({ startDate, endDate, minTutar, maxTutar })}><Search className="w-4 h-4" /> Ara</PrimaryButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm">
          <thead>
            <tr>
              <th>Geçerlilik Tarihi</th>
              <th>Asgari Ücret</th>
              <th>Katkı Payı Oranı</th>
              <th>Giriş Aidatı Oranı</th>
              <th>Durum</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const editable = canEditDelete(row)
              return (
                <tr key={row.id}>
                  <td>{row.gecerlilikTarihi}</td>
                  <td className="font-semibold">{formatMoney(row.asgariUcret)}</td>
                  <td>{row.katkiPayiOrani}</td>
                  <td>{row.girisAidatiOrani}</td>
                  <td>
                    <span className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-600">
                      {row.gecerlilikTarihi < todayIso ? 'Geçmiş Dönem' : 'Güncel Dönem'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        title={editable ? 'Güncelle' : 'Geçmiş kayıt güncellenemez'}
                        disabled={!editable}
                        onClick={() => openEdit(row)}
                        className={`p-1 ${editable ? 'text-blue-600 hover:text-blue-800' : 'text-slate-300 cursor-not-allowed'}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title={editable ? 'Sil' : 'Geçmiş kayıt silinemez'}
                        disabled={!editable}
                        onClick={() => removeRow(row)}
                        className={`p-1 ${editable ? 'text-red-500 hover:text-red-700' : 'text-slate-300 cursor-not-allowed'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!filteredRows.length && (
              <tr>
                <td colSpan={6} className="py-6 text-sm text-slate-500 text-center">Kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
