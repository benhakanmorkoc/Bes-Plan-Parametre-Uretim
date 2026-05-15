import { useMemo, useState } from 'react'
import { ArrowLeft, List, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { endeksDetaylari as seedDetaylar, endeksTanimlari as seedEndeksler } from '../../data/mockData'

function emptyRowForm() {
  return { kod: '', aciklama: '' }
}

function emptyDataForm() {
  return { tarih: '', tip: 'Tutar', deger: '', doviz: 'TL' }
}

const toDataRows = (details = []) =>
  details.map((d) => ({
    id: d.id,
    tarih: d.gecerlilikTarihi,
    deger: d.deger,
    tip: Number(d.deger) < 1 ? 'Oran' : 'Tutar',
    doviz: 'TL',
  }))

export default function EndeksTanimlari() {
  const [rows, setRows] = useState(() => seedEndeksler.map((x) => ({ ...x })))
  const [detailMap, setDetailMap] = useState(() => ({ ...seedDetaylar }))
  const [view, setView] = useState('list')
  const [kodFilter, setKodFilter] = useState('')
  const [aciklamaFilter, setAciklamaFilter] = useState('')
  const [newForm, setNewForm] = useState(emptyRowForm())
  const [selectedRow, setSelectedRow] = useState(null)
  const [dataForm, setDataForm] = useState(emptyDataForm())

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesKod = !kodFilter.trim() || r.kod.toLowerCase().includes(kodFilter.toLowerCase())
      const matchesAciklama = !aciklamaFilter.trim() || r.aciklama.toLowerCase().includes(aciklamaFilter.toLowerCase())
      return matchesKod && matchesAciklama
    })
  }, [rows, kodFilter, aciklamaFilter])

  const tableDataRows = useMemo(() => {
    if (!selectedRow) return []
    return toDataRows(detailMap[selectedRow.kod] || [])
  }, [selectedRow, detailMap])

  const saveNew = () => {
    const kod = newForm.kod.trim().toUpperCase()
    const aciklama = newForm.aciklama.trim()
    if (!kod) return alert('Endeks tablo kodu zorunludur.')
    if (!aciklama) return alert('Açıklama zorunludur.')
    if (rows.some((r) => r.kod === kod)) return alert('Bu kod zaten tanımlı.')
    setRows((prev) => [...prev, { id: Date.now(), kod, aciklama, inUse: false }])
    setDetailMap((prev) => ({ ...prev, [kod]: [] }))
    setView('list')
    setNewForm(emptyRowForm())
  }

  const openDataPage = (row) => {
    setSelectedRow(row)
    setDataForm(emptyDataForm())
    setView('tableData')
  }

  const addDataRow = () => {
    if (!selectedRow) return
    if (!dataForm.tarih) return alert('Tarih zorunludur.')
    if (!String(dataForm.deger).trim()) return alert('Oran / Tutar zorunludur.')
    const next = {
      id: Date.now(),
      gecerlilikTarihi: dataForm.tarih,
      deger: String(dataForm.deger).trim(),
      kaynak: 'Manuel',
      aciklama: dataForm.tip,
    }
    setDetailMap((prev) => ({
      ...prev,
      [selectedRow.kod]: [next, ...(prev[selectedRow.kod] || [])],
    }))
    setDataForm((f) => ({ ...f, deger: '' }))
  }

  const removeDataRow = (id) => {
    if (!selectedRow) return
    setDetailMap((prev) => ({
      ...prev,
      [selectedRow.kod]: (prev[selectedRow.kod] || []).filter((x) => x.id !== id),
    }))
  }

  if (view === 'create') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setView('list')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Yeni Endeks Tablosu</h2>
        </div>

        <div className="p-6">
          <div className="border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="text-lg font-semibold text-slate-800">1 Ana Tablo Bilgileri</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Endeks Tablo Kodu *</span>
                <input
                  className="mt-2 w-full h-11 border border-slate-300 rounded-md px-3 text-sm"
                  value={newForm.kod}
                  onChange={(e) => setNewForm((f) => ({ ...f, kod: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Açıklama *</span>
                <input
                  className="mt-2 w-full h-11 border border-slate-300 rounded-md px-3 text-sm"
                  value={newForm.aciklama}
                  onChange={(e) => setNewForm((f) => ({ ...f, aciklama: e.target.value }))}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <PrimaryButton onClick={saveNew}>Kaydet</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'tableData' && selectedRow) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setView('list')}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-bold text-slate-800">Tablo Verileri: {selectedRow.kod}</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">{selectedRow.aciklama}</p>
        </div>

        <div className="p-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800">Tarih ve Oran Girişi</div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input type="date" className="h-10 border border-slate-300 rounded-md px-3 text-sm" value={dataForm.tarih} onChange={(e) => setDataForm((f) => ({ ...f, tarih: e.target.value }))} />
                <select className="h-10 border border-slate-300 rounded-md px-3 text-sm" value={dataForm.tip} onChange={(e) => setDataForm((f) => ({ ...f, tip: e.target.value }))}>
                  <option>Tutar</option>
                  <option>Oran</option>
                </select>
                <input className="h-10 border border-slate-300 rounded-md px-3 text-sm" placeholder="Oran / Tutar" value={dataForm.deger} onChange={(e) => setDataForm((f) => ({ ...f, deger: e.target.value }))} />
                <select className="h-10 border border-slate-300 rounded-md px-3 text-sm" value={dataForm.doviz} onChange={(e) => setDataForm((f) => ({ ...f, doviz: e.target.value }))}>
                  <option>TL</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
                <PrimaryButton onClick={addDataRow}><Plus className="w-4 h-4" /> Listeye Ekle</PrimaryButton>
              </div>
            </div>

            <div className="border-t border-slate-100">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Oran / Tutar</th>
                    <th>Döviz</th>
                    <th className="text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataRows.map((d) => (
                    <tr key={d.id}>
                      <td>{d.tarih}</td>
                      <td className="font-semibold text-blue-700">{d.deger}</td>
                      <td>{d.doviz}</td>
                      <td className="text-right">
                        <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeDataRow(d.id)}>
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!tableDataRows.length && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">Henüz veri yok.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Endeks Tanımları"
        description="Hesaplamalarda baz alınacak endeks verilerinin tarih bazlı tanımlandığı ekrandır."
        right={
          <PrimaryButton onClick={() => setView('create')}>
            <Plus className="w-4 h-4" /> Yeni Ekle
          </PrimaryButton>
        }
      />

      <div className="px-6 py-4 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <div className="text-xs text-slate-600 mb-1">Endeks Kodu</div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Kod ara..." value={kodFilter} onChange={(e) => setKodFilter(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Endeks Adı (Açıklama)</div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Ad ara..." value={aciklamaFilter} onChange={(e) => setAciklamaFilter(e.target.value)} />
            </div>
          </div>
          <div className="flex items-end">
            <OutlineButton onClick={() => { setKodFilter(''); setAciklamaFilter('') }}>Temizle</OutlineButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm">
          <thead>
            <tr>
              <th>Endeks Tablo Kodu</th>
              <th>Açıklama</th>
              <th>Durum</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="font-semibold">{row.kod}</td>
                <td>{row.aciklama}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded text-xs ${row.inUse ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {row.inUse ? 'Kullanımda' : 'Boşta'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-3">
                    <button type="button" className="text-blue-600 hover:text-blue-800" title="Güncelle">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" className="text-emerald-600 hover:text-emerald-800" title="Tablo Verileri" onClick={() => openDataPage(row)}>
                      <List className="w-4 h-4" />
                    </button>
                    <button type="button" className="text-red-500 hover:text-red-700" title="Sil">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
