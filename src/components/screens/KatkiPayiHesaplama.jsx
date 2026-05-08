import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Modal from '../ui/Modal'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import {
  katkiPayiHesaplama as seedRows,
  katkiPayiHesaplamaDetaylari as seedDetaylar,
} from '../../data/mockData'

function emptyForm() {
  return {
    id: null,
    hesapKodu: '',
    hesapAdi: '',
    hesapMetod: '',
    hesapKaynak: '',
    tablo: '',
    hesapDeger: '',
    doviz: '',
    dovizCinsi: '',
  }
}

export default function KatkiPayiHesaplama() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [detailMap, setDetailMap] = useState(() => ({ ...seedDetaylar }))
  const [selectedKod, setSelectedKod] = useState(seedRows[0]?.hesapKodu || '')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [formOpen, setFormOpen] = useState(false)
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) =>
      `${r.hesapKodu} ${r.hesapAdi} ${r.hesapMetod} ${r.hesapKaynak} ${r.tablo}`.toLowerCase().includes(q),
    )
  }, [rows, search])

  const selectedRow = rows.find((r) => r.hesapKodu === selectedKod) || filteredRows[0] || null
  const selectedDetails = selectedRow ? detailMap[selectedRow.hesapKodu] || [] : []

  const openCreate = () => {
    setForm(emptyForm())
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setForm({ ...row })
    setFormOpen(true)
    setMenuId(null)
  }

  const saveForm = () => {
    if (!form.hesapKodu.trim()) return alert('Hesap Kodu zorunludur.')
    if (!form.hesapAdi.trim()) return alert('Hesap Adı zorunludur.')
    if (!form.hesapMetod.trim()) return alert('Hesap Metodu zorunludur.')

    const payload = { ...form, id: form.id || Date.now() }
    const existsByCode = rows.some((r) => r.hesapKodu === payload.hesapKodu && r.id !== payload.id)
    if (existsByCode) return alert('Bu hesap kodu mevcut.')

    const exists = rows.some((r) => r.id === payload.id)
    if (exists) {
      const old = rows.find((r) => r.id === payload.id)
      setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)))
      if (old && old.hesapKodu !== payload.hesapKodu) {
        setDetailMap((prev) => {
          const oldDetails = prev[old.hesapKodu] || []
          const { [old.hesapKodu]: _, ...rest } = prev
          return { ...rest, [payload.hesapKodu]: oldDetails }
        })
      }
    } else {
      setRows((prev) => [...prev, payload])
      setDetailMap((prev) => ({ ...prev, [payload.hesapKodu]: [] }))
    }

    setSelectedKod(payload.hesapKodu)
    setFormOpen(false)
  }

  const openInspect = (row) => {
    setInfoModal({
      open: true,
      title: 'Katkı Payı Hesaplama İncele',
      body: (
        <div className="space-y-1 text-sm">
          <p><strong>Kod:</strong> {row.hesapKodu}</p>
          <p><strong>Ad:</strong> {row.hesapAdi}</p>
          <p><strong>Metod:</strong> {row.hesapMetod}</p>
          <p><strong>Kaynak:</strong> {row.hesapKaynak}</p>
        </div>
      ),
    })
    setMenuId(null)
  }

  const openVersions = (row) => {
    setInfoModal({
      open: true,
      title: 'Versiyonlar',
      body: (
        <ul className="list-disc pl-5 text-sm">
          <li>{row.hesapKodu} - Versiyon 1</li>
          <li>{row.hesapKodu} - Versiyon 2</li>
        </ul>
      ),
    })
    setMenuId(null)
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setDetailMap((prev) => {
      const { [row.hesapKodu]: _, ...rest } = prev
      return rest
    })
    if (selectedKod === row.hesapKodu) {
      const next = rows.find((r) => r.id !== row.id)
      setSelectedKod(next?.hesapKodu || '')
    }
    setMenuId(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Katkı Payı Hesaplama"
        description="Katkı payı hesaplama kodları ve alt parametre detayları"
        right={<PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>}
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Kod / ad / metod ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0">
        <div className="overflow-auto border-r border-slate-200">
          <table className="w-full grid-table">
            <thead>
              <tr>
                <th>Kod</th><th>Ad</th><th>Metod</th><th>Kaynak</th><th className="w-12 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={selectedKod === row.hesapKodu ? 'bg-blue-50/50' : ''} onClick={() => setSelectedKod(row.hesapKodu)}>
                  <td>{row.hesapKodu}</td><td>{row.hesapAdi}</td><td>{row.hesapMetod}</td><td>{row.hesapKaynak}</td>
                  <td className="relative text-right" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800" onClick={() => setMenuId((prev) => (prev === row.id ? null : row.id))}>...</button>
                    {menuId === row.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm">
                        <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openInspect(row)}>İncele</button>
                        <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openEdit(row)}>Güncelle</button>
                        <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openVersions(row)}>Versiyonlar</button>
                        <button type="button" className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => removeRow(row)}>Sil</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredRows.length && <tr><td colSpan={5} className="py-6 text-sm text-slate-500 text-center">Kayıt bulunamadı.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="overflow-auto">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">Alt Detay - {selectedRow ? `${selectedRow.hesapKodu} (${selectedRow.hesapAdi})` : 'Kayıt seçin'}</h3>
            <p className="text-xs text-slate-500 mt-1">Seçili hesap kodunun parametre detayları</p>
          </div>
          <div className="p-4">
            <div className="overflow-auto border border-slate-200 rounded-md">
              <table className="w-full grid-table text-sm">
                <thead><tr><th>Parametre</th><th>Değer</th><th>Açıklama</th></tr></thead>
                <tbody>
                  {selectedDetails.map((d) => (
                    <tr key={d.id}><td>{d.parametre}</td><td>{d.deger}</td><td>{d.aciklama}</td></tr>
                  ))}
                  {!selectedDetails.length && <tr><td colSpan={3} className="py-6 text-sm text-slate-500 text-center">Seçili kayda ait alt detay yok.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Katkı Payı Hesaplama Kaydı"
        footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Hesap Kodu *</span><input className="form-input" value={form.hesapKodu} onChange={(e) => setForm((f) => ({ ...f, hesapKodu: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Hesap Adı *</span><input className="form-input" value={form.hesapAdi} onChange={(e) => setForm((f) => ({ ...f, hesapAdi: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Hesap Metodu *</span><input className="form-input" value={form.hesapMetod} onChange={(e) => setForm((f) => ({ ...f, hesapMetod: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Hesap Kaynak</span><input className="form-input" value={form.hesapKaynak} onChange={(e) => setForm((f) => ({ ...f, hesapKaynak: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Tablo</span><input className="form-input" value={form.tablo} onChange={(e) => setForm((f) => ({ ...f, tablo: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Hesap Değer</span><input className="form-input" value={form.hesapDeger} onChange={(e) => setForm((f) => ({ ...f, hesapDeger: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Döviz</span><input className="form-input" value={form.doviz} onChange={(e) => setForm((f) => ({ ...f, doviz: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Döviz Cinsi</span><input className="form-input" value={form.dovizCinsi} onChange={(e) => setForm((f) => ({ ...f, dovizCinsi: e.target.value }))} /></label>
        </div>
      </Modal>

      <Modal
        open={infoModal.open}
        onClose={() => setInfoModal({ open: false, title: '', body: null })}
        title={infoModal.title}
        footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}
      >
        {infoModal.body}
      </Modal>
    </div>
  )
}
