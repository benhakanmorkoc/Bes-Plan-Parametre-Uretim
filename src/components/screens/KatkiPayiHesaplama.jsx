import { useMemo, useState } from 'react'
import { ArrowLeft, MoreVertical, Plus, Search } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { katkiPayiHesaplama as seedRows, endeksTanimlari } from '../../data/mockData'

const HESAP_METOD_OPTIONS = ['Sabit Oran', 'Endeks', 'Sabit Tutar']
const HESAP_KAYNAK_OPTIONS = ['Tablo', 'Döviz']
const DOVIZ_OPTIONS = ['TL', 'USD', 'EUR']
const DOVIZ_CINSI_OPTIONS = ['Efektif Satış', 'Efektif Alış', 'Döviz Alış', 'Döviz Satış']

function emptyForm() {
  return {
    id: null,
    hesapKodu: '',
    hesapAdi: '',
    hesapMetod: '',
    hesapDeger: '',
    hesapKaynak: '',
    tablo: '',
    doviz: '',
    dovizCinsi: '',
  }
}

export default function KatkiPayiHesaplama() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [menuId, setMenuId] = useState(null)
  const [kodFilter, setKodFilter] = useState('')
  const [metodFilter, setMetodFilter] = useState('')
  const [form, setForm] = useState(emptyForm())

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const mk = !kodFilter.trim() || String(r.hesapKodu).toLowerCase().includes(kodFilter.toLowerCase())
      const mm = !metodFilter.trim() || String(r.hesapMetod).toLowerCase().includes(metodFilter.toLowerCase())
      return mk && mm
    })
  }, [rows, kodFilter, metodFilter])

  const isSabitOran = form.hesapMetod === 'Sabit Oran'
  const isSabitTutar = form.hesapMetod === 'Sabit Tutar'
  const isEndeks = form.hesapMetod === 'Endeks'
  const isTablo = isEndeks && form.hesapKaynak === 'Tablo'
  const isDoviz = isEndeks && form.hesapKaynak === 'Döviz'

  const patchForm = (patch) => setForm((f) => ({ ...f, ...patch }))

  const onChangeMetod = (metod) => {
    if (metod === 'Endeks') {
      patchForm({ hesapMetod: metod, hesapDeger: '', hesapKaynak: '', tablo: '', doviz: '', dovizCinsi: '' })
      return
    }
    patchForm({ hesapMetod: metod, hesapKaynak: 'Sabit', tablo: '', doviz: '', dovizCinsi: '' })
  }

  const onChangeKaynak = (kaynak) => {
    patchForm({
      hesapKaynak: kaynak,
      tablo: kaynak === 'Tablo' ? form.tablo : '',
      doviz: kaynak === 'Döviz' ? form.doviz : '',
      dovizCinsi: kaynak === 'Döviz' ? form.dovizCinsi : '',
    })
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setView('create')
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      id: row.id,
      hesapKodu: String(row.hesapKodu || ''),
      hesapAdi: String(row.hesapAdi || ''),
      hesapMetod: String(row.hesapMetod || ''),
      hesapDeger: String(row.hesapDeger || ''),
      hesapKaynak: String(row.hesapKaynak || ''),
      tablo: String(row.tablo || ''),
      doviz: String(row.doviz || ''),
      dovizCinsi: String(row.dovizCinsi || ''),
    })
    setView('create')
    setMenuId(null)
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((x) => x.id !== row.id))
    setMenuId(null)
  }

  const saveForm = () => {
    if (!String(form.hesapKodu).trim()) return alert('Hesaplama Kodu zorunludur.')
    if (!String(form.hesapAdi).trim()) return alert('Hesaplama Adı zorunludur.')
    if (!form.hesapMetod) return alert('Hesaplama Metodu zorunludur.')

    if ((isSabitOran || isSabitTutar) && !String(form.hesapDeger).trim()) {
      return alert(isSabitOran ? 'Oran değeri giriniz.' : 'Tutar değeri giriniz.')
    }

    if (isEndeks && !form.hesapKaynak) return alert('Hesap Kaynak seçiniz.')
    if (isTablo && !form.tablo) return alert('Tablo (Endeks Tanımı) seçiniz.')
    if (isDoviz && (!form.doviz || !form.dovizCinsi)) return alert('Döviz ve Döviz Cinsi seçiniz.')

    const payload = {
      id: form.id || Date.now(),
      hesapKodu: String(form.hesapKodu).trim(),
      hesapAdi: String(form.hesapAdi).trim(),
      hesapMetod: form.hesapMetod,
      hesapDeger: String(form.hesapDeger || '').trim(),
      hesapKaynak: form.hesapKaynak || (isEndeks ? '' : 'Sabit'),
      tablo: form.tablo || '',
      doviz: form.doviz || '',
      dovizCinsi: form.dovizCinsi || '',
    }

    const existsByKod = rows.some((r) => String(r.hesapKodu) === payload.hesapKodu && r.id !== payload.id)
    if (existsByKod) return alert('Bu hesaplama kodu zaten mevcut.')

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
            <h2 className="text-3xl font-bold text-slate-800">{editingId ? 'Katkı Payı Hesaplama Güncelle' : 'Yeni Katkı Payı Hesaplama Ekle'}</h2>
            <p className="text-sm text-slate-500 mt-1">Sistem için katkı payı hesaplama tanımlayın</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Hesaplama Kodu *</span>
            <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.hesapKodu} onChange={(e) => patchForm({ hesapKodu: e.target.value })} />
          </label>
          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Hesaplama Adı *</span>
            <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.hesapAdi} onChange={(e) => patchForm({ hesapAdi: e.target.value })} />
          </label>

          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Hesaplama Metodu *</span>
            <select className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.hesapMetod} onChange={(e) => onChangeMetod(e.target.value)}>
              <option value="">Seçiniz</option>
              {HESAP_METOD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Hesap Değer</span>
            <input
              className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              disabled={isEndeks || !form.hesapMetod}
              placeholder={isSabitOran ? 'Oran giriniz' : isSabitTutar ? 'Tutar giriniz' : 'Sabit oran veya sabit tutar seçiniz'}
              value={form.hesapDeger}
              onChange={(e) => patchForm({ hesapDeger: e.target.value })}
            />
          </label>

          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Hesap Kaynak</span>
            <select
              className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              disabled={!isEndeks}
              value={form.hesapKaynak}
              onChange={(e) => onChangeKaynak(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {HESAP_KAYNAK_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Tablo (Endeks Tanımı)</span>
            <select
              className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              disabled={!isTablo}
              value={form.tablo}
              onChange={(e) => patchForm({ tablo: e.target.value })}
            >
              <option value="">Endeks Seçiniz</option>
              {endeksTanimlari.map((e) => <option key={e.id} value={e.kod}>{e.kod}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Döviz</span>
            <select
              className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              disabled={!isDoviz}
              value={form.doviz}
              onChange={(e) => patchForm({ doviz: e.target.value })}
            >
              <option value="">Seçiniz</option>
              {DOVIZ_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>

          <label>
            <span className="block text-sm font-semibold text-slate-700 mb-2">Döviz Cinsi</span>
            <select
              className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
              disabled={!isDoviz}
              value={form.dovizCinsi}
              onChange={(e) => patchForm({ dovizCinsi: e.target.value })}
            >
              <option value="">Seçiniz</option>
              {DOVIZ_CINSI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
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
        title="Katkı Payı Hesaplama Bilgileri"
        description="Plana bağlı katkı payı tanımlarının belirlenen dönemlerde hangi oranlar ile artırılacağını belirlediği ekrandır."
        right={<PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>}
      />

      <div className="px-6 py-4 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <div className="text-xs text-slate-600 mb-1">Hesaplama Kodu</div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Kod ara..." value={kodFilter} onChange={(e) => setKodFilter(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Hesaplama Metodu</div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Metod ara..." value={metodFilter} onChange={(e) => setMetodFilter(e.target.value)} />
            </div>
          </div>
          <div className="flex items-end">
            <OutlineButton onClick={() => { setKodFilter(''); setMetodFilter('') }}>Temizle</OutlineButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm min-w-[1080px]">
          <thead>
            <tr>
              <th></th>
              <th>Hesaplama Kodu</th>
              <th>Hesaplama Adı</th>
              <th>Hesap Metod</th>
              <th>Hesap Kaynak</th>
              <th>Hesap Değer</th>
              <th>Tablo</th>
              <th>Döviz</th>
              <th>Döviz Cins</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td><input type="checkbox" /></td>
                <td>{r.hesapKodu}</td>
                <td>{r.hesapAdi}</td>
                <td><span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{r.hesapMetod || '-'}</span></td>
                <td>{r.hesapKaynak || '-'}</td>
                <td>{r.hesapDeger || '-'}</td>
                <td>{r.tablo || '-'}</td>
                <td>{r.doviz || '-'}</td>
                <td>{r.dovizCinsi || '-'}</td>
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
                <td colSpan={10} className="py-6 text-center text-slate-500">Kayıt bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
