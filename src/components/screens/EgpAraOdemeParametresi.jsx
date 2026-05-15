import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { egpAraOdeme as seedRows } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    sayiAlt: '',
    sayiUst: '',
    tutarUst: '',
    oranBirikim: '',
    oranMaas: '',
  }
}

const PLAN_OPTIONS = [
  { id: '001', ad: 'Limitli Plan' },
  { id: '002', ad: 'Aile Planı' },
  { id: '003', ad: 'Aslan Bireysel Emeklilik Planı' },
  { id: '004', ad: 'Meridyen Bireysel Emeklilik Planı' },
]

export default function EgpAraOdemeParametresi() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [selected, setSelected] = useState([])
  const [menuId, setMenuId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })
  const [bindOpen, setBindOpen] = useState(false)
  const [bindSearch, setBindSearch] = useState('')
  const [bindSelectedPlans, setBindSelectedPlans] = useState([])

  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id))
  const selectedRows = rows.filter((r) => selected.includes(r.id))
  const filteredPlans = useMemo(
    () => PLAN_OPTIONS.filter((p) => `${p.id} ${p.ad}`.toLowerCase().includes(bindSearch.toLowerCase())),
    [bindSearch],
  )

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({
      kod: row.kod || '',
      ad: row.ad || '',
      versiyon: String(row.versiyon || '1'),
      sayiAlt: row.sayiAlt || '',
      sayiUst: row.sayiUst || '',
      tutarUst: row.tutarUst || '',
      oranBirikim: row.oranBirikim || '',
      oranMaas: row.oranMaas || '',
    })
    setFormOpen(true)
    setMenuId(null)
  }

  const clearForm = () => {
    setForm((prev) => ({ ...emptyForm(), versiyon: prev.versiyon }))
  }

  const save = () => {
    if (!form.kod.trim() || !form.ad.trim() || !form.sayiAlt || !form.sayiUst || !form.tutarUst || !form.oranBirikim || !form.oranMaas) {
      alert('Zorunlu alanları doldurun.')
      return
    }
    const payload = { ...form }
    if (editingId) {
      setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setFormOpen(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Ara Ödeme Sayısı"
        right={
          <>
            <OutlineButton disabled={selected.length === 0} onClick={() => { setBindOpen(true); setBindSearch(''); setBindSelectedPlans([]) }}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
            </OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        }
      />

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10 text-center"><input type="checkbox" checked={allChecked} onChange={() => setSelected(allChecked ? [] : rows.map((r) => r.id))} /></th>
              <th>Ara Ödeme Kodu</th>
              <th>Ara Ödeme Adı</th>
              <th>Versiyon</th>
              <th>Ara Ödeme Sayısı Alt Limiti</th>
              <th>Ara Ödeme Sayısı Üst Limiti</th>
              <th>Ara Ödeme Tutarı Üst Limiti</th>
              <th>Üst Limit Ara Ödeme Oranı Birikim</th>
              <th>Üst Limit Ara Ödeme Oranı Yıllık Maaş</th>
              <th className="w-12 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="text-center"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((prev) => (prev.includes(row.id) ? prev.filter((x) => x !== row.id) : [...prev, row.id]))} /></td>
                <td>{row.kod}</td>
                <td>{row.ad}</td>
                <td>{row.versiyon}</td>
                <td>{row.sayiAlt}</td>
                <td>{row.sayiUst}</td>
                <td>{row.tutarUst}</td>
                <td>{row.oranBirikim}</td>
                <td>{row.oranMaas}</td>
                <td className="relative text-center">
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setMenuId((prev) => (prev === row.id ? null : row.id))}>...</button>
                  {menuId === row.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm">
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openEdit(row)}>Güncelle</button>
                      <button type="button" className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => { if (window.confirm('Kayıt silinsin mi?')) setRows((prev) => prev.filter((r) => r.id !== row.id)); setMenuId(null) }}>Sil</button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setInfoModal({ open: true, title: 'Bağlı Planlar', body: <div className="text-sm">Bağlı planlar mock ekranı</div> }); setMenuId(null) }}>Bağlı Planlar</button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setInfoModal({ open: true, title: 'Versiyonlar', body: <div className="text-sm">Versiyonlar mock ekranı</div> }); setMenuId(null) }}>Versiyonlar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Ara Ödeme Sayısı Ekle"
        size="xl"
        footer={
          <>
            <OutlineButton onClick={() => setFormOpen(false)}>İptal</OutlineButton>
            <OutlineButton onClick={clearForm}>Temizle</OutlineButton>
            <PrimaryButton onClick={save}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Ara Ödeme Kodu *</span><input className="form-input" value={form.kod} onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Ara Ödeme Adı *</span><input className="form-input" value={form.ad} onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</span><input className="form-input bg-slate-100" disabled value={form.versiyon || '1'} /></label>
          <div />
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Ara Ödeme Sayısı Alt Limiti *</span><input className="form-input" value={form.sayiAlt} onChange={(e) => setForm((f) => ({ ...f, sayiAlt: e.target.value.replace(/[^0-9]/g, '') }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Ara Ödeme Sayısı Üst Limiti *</span><input className="form-input" value={form.sayiUst} onChange={(e) => setForm((f) => ({ ...f, sayiUst: e.target.value.replace(/[^0-9]/g, '') }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Ara Ödeme Tutarı Üst Limiti *</span><input className="form-input" value={form.tutarUst} onChange={(e) => setForm((f) => ({ ...f, tutarUst: e.target.value.replace(/[^0-9.,]/g, '') }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Üst Limit Ara Ödeme Oranı Birikim *</span><input className="form-input" value={form.oranBirikim} onChange={(e) => setForm((f) => ({ ...f, oranBirikim: e.target.value.replace(/[^0-9.,]/g, '') }))} /></label>
          <label><span className="block text-xs font-semibold text-slate-600 mb-1">Üst Limit Ara Ödeme Oranı Yıllık Maaş *</span><input className="form-input" value={form.oranMaas} onChange={(e) => setForm((f) => ({ ...f, oranMaas: e.target.value.replace(/[^0-9.,]/g, '') }))} /></label>
        </div>
      </Modal>

      <Modal
        open={bindOpen}
        onClose={() => setBindOpen(false)}
        title="Planlara Bağla"
        footer={<><OutlineButton onClick={() => setBindOpen(false)}>İptal</OutlineButton><PrimaryButton disabled={bindSelectedPlans.length === 0}>Seçili Planlara Bağla</PrimaryButton></>}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Seçilen Ara Ödeme Parametreleri</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRows.length > 0 ? selectedRows.map((r) => (
                <span key={r.id} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs">
                  {r.kod} - {r.ad}
                </span>
              )) : <span className="text-xs text-slate-500">Kayıt seçilmedi.</span>}
            </div>
          </div>
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara (Plan no, plan adı)" value={bindSearch} onChange={(e) => setBindSearch(e.target.value)} />
          </div>
          <div className="max-h-80 overflow-auto border border-slate-200 rounded-md">
            <table className="w-full grid-table text-sm">
              <thead><tr><th className="w-10 text-center"><input type="checkbox" checked={filteredPlans.length > 0 && filteredPlans.every((p) => bindSelectedPlans.includes(p.id))} onChange={(e) => e.target.checked ? setBindSelectedPlans(Array.from(new Set([...bindSelectedPlans, ...filteredPlans.map((p) => p.id)]))) : setBindSelectedPlans((prev) => prev.filter((id) => !filteredPlans.some((p) => p.id === id)))} /></th><th>Plan No</th><th>Plan Adı</th></tr></thead>
              <tbody>
                {filteredPlans.map((p) => (
                  <tr key={p.id}>
                    <td className="text-center"><input type="checkbox" checked={bindSelectedPlans.includes(p.id)} onChange={() => setBindSelectedPlans((prev) => (prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]))} /></td>
                    <td className="font-mono">{p.id}</td>
                    <td>{p.ad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-violet-700 font-medium text-right">{bindSelectedPlans.length} plan seçildi</div>
        </div>
      </Modal>

      <Modal open={infoModal.open} onClose={() => setInfoModal({ open: false, title: '', body: null })} title={infoModal.title} footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}>
        {infoModal.body}
      </Modal>
    </div>
  )
}
