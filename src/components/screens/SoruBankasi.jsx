import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Modal from '../ui/Modal'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { soruBankasi as seedRows } from '../../data/mockData'

function emptyForm() {
  return { id: null, soruNo: '', soruTipi: '', cevapTipi: '', soru: '', siraNo: '' }
}

export default function SoruBankasi() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [formOpen, setFormOpen] = useState(false)
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => `${r.soruNo} ${r.soruTipi} ${r.cevapTipi} ${r.soru}`.toLowerCase().includes(q))
  }, [rows, search])

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
    if (!form.soruNo.trim()) return alert('Soru No zorunludur.')
    if (!form.soruTipi.trim()) return alert('Soru Tipi zorunludur.')
    if (!form.cevapTipi.trim()) return alert('Cevap Tipi zorunludur.')
    if (!form.soru.trim()) return alert('Soru alanı zorunludur.')
    const payload = { ...form, id: form.id || Date.now() }
    const existsByNo = rows.some((r) => r.soruNo === payload.soruNo && r.id !== payload.id)
    if (existsByNo) return alert('Bu soru no sistemde mevcut.')
    const exists = rows.some((r) => r.id === payload.id)
    if (exists) setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)))
    else setRows((prev) => [...prev, payload])
    setFormOpen(false)
  }

  const openInspect = (row) => {
    setInfoModal({
      open: true,
      title: 'Soru İncele',
      body: (
        <div className="text-sm space-y-1">
          <p><strong>Soru No:</strong> {row.soruNo}</p>
          <p><strong>Soru Tipi:</strong> {row.soruTipi}</p>
          <p><strong>Cevap Tipi:</strong> {row.cevapTipi}</p>
          <p><strong>Sıra No:</strong> {row.siraNo || '-'}</p>
          <p><strong>Soru:</strong> {row.soru}</p>
        </div>
      ),
    })
    setMenuId(null)
  }
  const openVersions = (row) => {
    setInfoModal({
      open: true,
      title: 'Versiyonlar',
      body: <ul className="list-disc pl-5 text-sm"><li>Soru {row.soruNo} - Versiyon 1</li><li>Soru {row.soruNo} - Versiyon 2</li></ul>,
    })
    setMenuId(null)
  }
  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setMenuId(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader title="Soru Bankası" description="Anketlerde kullanılacak sorular" right={<PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>} />
      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Soru no / soru tipi / metin ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full grid-table">
          <thead><tr><th>Soru No</th><th>Soru Tipi</th><th>Cevap Tipi</th><th>Sıra</th><th className="w-12 text-right">İşlemler</th></tr></thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td>{row.soruNo}</td><td>{row.soruTipi}</td><td>{row.cevapTipi}</td><td>{row.siraNo}</td>
                <td className="relative text-right">
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
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Soru Bankası Kaydı" footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Soru No *</span><input className="form-input" value={form.soruNo} onChange={(e) => setForm((f) => ({ ...f, soruNo: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Soru Tipi *</span><input className="form-input" value={form.soruTipi} onChange={(e) => setForm((f) => ({ ...f, soruTipi: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Cevap Tipi *</span><input className="form-input" value={form.cevapTipi} onChange={(e) => setForm((f) => ({ ...f, cevapTipi: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Sıra No</span><input className="form-input" value={form.siraNo} onChange={(e) => setForm((f) => ({ ...f, siraNo: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="block text-xs font-semibold text-slate-600 mb-1">Soru *</span><textarea className="form-input min-h-24" value={form.soru} onChange={(e) => setForm((f) => ({ ...f, soru: e.target.value }))} /></label>
        </div>
      </Modal>
      <Modal open={infoModal.open} onClose={() => setInfoModal({ open: false, title: '', body: null })} title={infoModal.title} footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}>
        {infoModal.body}
      </Modal>
    </div>
  )
}
