import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Modal from '../ui/Modal'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import {
  ygkYillikOdemeDonemi as seedRows,
  ygkYillikOdemeDonemiDetaylari as seedDetaylar,
} from '../../data/mockData'

function emptyForm() {
  return { id: null, kod: '', ad: '', aciklama: '' }
}

export default function YgkYillikOdemeDonemi() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [detailMap, setDetailMap] = useState(() => ({ ...seedDetaylar }))
  const [selectedKod, setSelectedKod] = useState(seedRows[0]?.kod || '')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [formOpen, setFormOpen] = useState(false)
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => `${r.kod} ${r.ad} ${r.aciklama}`.toLowerCase().includes(q))
  }, [rows, search])

  const selectedRow = rows.find((r) => r.kod === selectedKod) || filteredRows[0] || null
  const selectedDetails = selectedRow ? detailMap[selectedRow.kod] || [] : []

  const openCreate = () => { setForm(emptyForm()); setFormOpen(true) }
  const openEdit = (row) => { setForm({ ...row }); setFormOpen(true); setMenuId(null) }
  const saveForm = () => {
    if (!form.kod.trim()) return alert('Kod zorunludur.')
    if (!form.ad.trim()) return alert('Ad zorunludur.')
    if (!form.aciklama.trim()) return alert('Açıklama zorunludur.')
    const payload = { ...form, id: form.id || Date.now() }
    const existsByCode = rows.some((r) => r.kod === payload.kod && r.id !== payload.id)
    if (existsByCode) return alert('Bu kod sistemde mevcut.')
    const exists = rows.some((r) => r.id === payload.id)
    if (exists) {
      const old = rows.find((r) => r.id === payload.id)
      setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)))
      if (old && old.kod !== payload.kod) {
        setDetailMap((prev) => {
          const oldDetails = prev[old.kod] || []
          const { [old.kod]: _, ...rest } = prev
          return { ...rest, [payload.kod]: oldDetails }
        })
      }
    } else {
      setRows((prev) => [...prev, payload])
      setDetailMap((prev) => ({ ...prev, [payload.kod]: [] }))
    }
    setSelectedKod(payload.kod)
    setFormOpen(false)
  }

  const openInspect = (row) => {
    setInfoModal({
      open: true,
      title: 'YGK Yıllık Ödeme Dönemi İncele',
      body: <div className="text-sm"><p><strong>Kod:</strong> {row.kod}</p><p><strong>Ad:</strong> {row.ad}</p><p><strong>Açıklama:</strong> {row.aciklama}</p></div>,
    })
    setMenuId(null)
  }
  const openVersions = (row) => {
    setInfoModal({
      open: true,
      title: 'Versiyonlar',
      body: <ul className="list-disc pl-5 text-sm"><li>{row.kod} - Versiyon 1</li><li>{row.kod} - Versiyon 2</li></ul>,
    })
    setMenuId(null)
  }
  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setDetailMap((prev) => {
      const { [row.kod]: _, ...rest } = prev
      return rest
    })
    if (selectedKod === row.kod) {
      const next = rows.find((r) => r.id !== row.id)
      setSelectedKod(next?.kod || '')
    }
    setMenuId(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader title="YGK Yıllık Ödeme Dönemi" description="Ödeme dönemi tanımları ve periyot detayları" right={<PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>} />
      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Kod / ad / açıklama ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0">
        <div className="overflow-auto border-r border-slate-200">
          <table className="w-full grid-table">
            <thead><tr><th>Kod</th><th>Ad</th><th>Açıklama</th><th className="w-12 text-right">İşlemler</th></tr></thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={selectedKod === row.kod ? 'bg-blue-50/50' : ''} onClick={() => setSelectedKod(row.kod)}>
                  <td>{row.kod}</td><td>{row.ad}</td><td>{row.aciklama}</td>
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
              {!filteredRows.length && <tr><td colSpan={4} className="py-6 text-sm text-slate-500 text-center">Kayıt bulunamadı.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="overflow-auto">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">Alt Detay - {selectedRow ? `${selectedRow.kod} (${selectedRow.ad})` : 'Kayıt seçin'}</h3>
            <p className="text-xs text-slate-500 mt-1">Seçili ödeme dönemine ait periyot kuralları</p>
          </div>
          <div className="p-4">
            <div className="overflow-auto border border-slate-200 rounded-md">
              <table className="w-full grid-table text-sm">
                <thead><tr><th>Parametre</th><th>Değer</th><th>Not</th></tr></thead>
                <tbody>
                  {selectedDetails.map((d) => <tr key={d.id}><td>{d.parametre}</td><td>{d.deger}</td><td>{d.not}</td></tr>)}
                  {!selectedDetails.length && <tr><td colSpan={3} className="py-6 text-sm text-slate-500 text-center">Seçili kayda ait alt detay yok.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="YGK Yıllık Ödeme Dönemi Kaydı" footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Kod *</span><input className="form-input" value={form.kod} onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Ad *</span><input className="form-input" value={form.ad} onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="block text-xs font-semibold text-slate-600 mb-1">Açıklama *</span><input className="form-input" value={form.aciklama} onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))} /></label>
        </div>
      </Modal>
      <Modal open={infoModal.open} onClose={() => setInfoModal({ open: false, title: '', body: null })} title={infoModal.title} footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}>
        {infoModal.body}
      </Modal>
    </div>
  )
}
