import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { egpGenel as seedRows } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const CURRENCY_OPTIONS = ['TL', 'USD', 'EUR']
const BIREY_TIPI_OPTIONS = ['Fert', 'Personel', 'Çocuk', 'Eş', 'Anne Baba', 'Kardeş', 'Personel Eş', 'Diğer']
const ENDEKS_ARALIK_OPTIONS = Array.from({ length: 20 }, (_, i) => String(i + 1))
const ENDEKS_TIP_OPTIONS = ['Tefe', 'Tüfe', 'Artışsız', 'Sabit Oran']

const PLAN_OPTIONS = [
  { id: '001', ad: 'Limitli Plan' },
  { id: '002', ad: 'Aile Planı' },
  { id: '003', ad: 'Aslan Bireysel Emeklilik Planı' },
  { id: '004', ad: 'Meridyen Bireysel Emeklilik Planı' },
]

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    doviz: 'TL',
    bireyTipi: '',
    minBirikim: '',
    kacYil: '',
    endeksTipi: '',
  }
}

export default function EgpGenelParametreleri() {
  const [rows, setRows] = useState(() =>
    seedRows.map((x) => ({
      ...x,
      doviz: x.doviz === 'TRY' ? 'TL' : x.doviz,
      bireyTipi: BIREY_TIPI_OPTIONS.includes(x.bireyTipi) ? x.bireyTipi : 'Fert',
    })),
  )
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })
  const [bindOpen, setBindOpen] = useState(false)
  const [bindSearch, setBindSearch] = useState('')
  const [bindSelectedPlans, setBindSelectedPlans] = useState([])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => `${r.kod} ${r.ad} ${r.doviz} ${r.bireyTipi}`.toLowerCase().includes(q))
  }, [rows, search])

  const allChecked = filteredRows.length > 0 && filteredRows.every((r) => selected.includes(r.id))

  const filteredPlans = PLAN_OPTIONS.filter((p) => `${p.id} ${p.ad}`.toLowerCase().includes(bindSearch.toLowerCase()))
  const selectedRows = filteredRows.filter((r) => selected.includes(r.id))

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ ...row, versiyon: String(row.versiyon || '1') })
    setFormOpen(true)
    setMenuId(null)
  }

  const submit = () => {
    if (!form.kod.trim() || !form.ad.trim() || !form.doviz || !form.bireyTipi || !form.minBirikim || !form.kacYil || !form.endeksTipi) {
      alert('Zorunlu alanları doldurun.')
      return
    }
    const payload = { ...form, minBirikim: String(form.minBirikim) }
    if (editingId) {
      setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setFormOpen(false)
  }

  const openLinkedPlans = (row) => {
    setInfoModal({
      open: true,
      title: 'Bağlı Planlar',
      body: (
        <div className="text-sm">
          <p className="mb-2">{row.kod} için bağlı planlar (mock)</p>
          <ul className="list-disc pl-5">
            <li>PLN-001 - Limitli Plan</li>
            <li>PLN-003 - Aslan Bireysel Emeklilik Planı</li>
          </ul>
        </div>
      ),
    })
    setMenuId(null)
  }

  const openVersions = (row) => {
    setInfoModal({
      open: true,
      title: 'Versiyonlar',
      body: <div className="text-sm">{row.kod} için versiyon bilgileri (mock)</div>,
    })
    setMenuId(null)
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setSelected((prev) => prev.filter((id) => id !== row.id))
    setMenuId(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Genel EGP Parametreleri"
        right={
          <>
            <OutlineButton disabled={selected.length === 0} onClick={() => { setBindSearch(''); setBindSelectedPlans([]); setBindOpen(true) }}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
            </OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10 text-center"><input type="checkbox" checked={allChecked} onChange={() => setSelected(allChecked ? [] : filteredRows.map((r) => r.id))} /></th>
              <th>EGP Parametre Kodu</th>
              <th>EGP Parametre Adı</th>
              <th>Versiyon</th>
              <th>Döviz Kodu</th>
              <th>Birey Tipi</th>
              <th>Minimum Birikim Tutarı</th>
              <th>Endeksleme Frekansı (Yıl)</th>
              <th className="w-12 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="text-center"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((prev) => (prev.includes(row.id) ? prev.filter((x) => x !== row.id) : [...prev, row.id]))} /></td>
                <td>{row.kod}</td>
                <td>{row.ad}</td>
                <td>{row.versiyon}</td>
                <td>{row.doviz}</td>
                <td>{row.bireyTipi}</td>
                <td>{row.minBirikim}</td>
                <td>{row.kacYil}</td>
                <td className="relative text-center">
                  <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setMenuId((prev) => (prev === row.id ? null : row.id))}>...</button>
                  {menuId === row.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm">
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openEdit(row)}>Güncelle</button>
                      <button type="button" className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => removeRow(row)}>Sil</button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openLinkedPlans(row)}>Bağlı Planlar</button>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openVersions(row)}>Versiyonlar</button>
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
        title="Yeni Parametre Ekle"
        size="lg"
        footer={<><OutlineButton onClick={() => setFormOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={submit}>Kaydet</PrimaryButton></>}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Ana Tanımlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">EGP Parametre Kodu *</span><input className="form-input" value={form.kod} onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))} /></label>
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">EGP Parametre Adı *</span><input className="form-input" value={form.ad} onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))} /></label>
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">Döviz Kodu *</span><select className="form-select" value={form.doviz} onChange={(e) => setForm((f) => ({ ...f, doviz: e.target.value }))}>{CURRENCY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">Birey Tipi *</span><select className="form-select" value={form.bireyTipi} onChange={(e) => setForm((f) => ({ ...f, bireyTipi: e.target.value }))}><option value="">Seçiniz</option>{BIREY_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</span><input className="form-input bg-slate-100" disabled value={form.versiyon || '1'} /></label>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Minimum Birikim Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">Minimum Birikim Tutarı *</span><input className="form-input" value={form.minBirikim} onChange={(e) => setForm((f) => ({ ...f, minBirikim: e.target.value.replace(/[^0-9.,]/g, '') }))} /></label>
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">Endeksleme Aralığı (Yıl) *</span><select className="form-select" value={form.kacYil} onChange={(e) => setForm((f) => ({ ...f, kacYil: e.target.value }))}><option value="">Seçiniz</option>{ENDEKS_ARALIK_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
              <label><span className="block text-xs font-semibold text-slate-600 mb-1">Min. Birikim Tutarı Endeks Tipi *</span><select className="form-select" value={form.endeksTipi} onChange={(e) => setForm((f) => ({ ...f, endeksTipi: e.target.value }))}><option value="">Seçiniz</option>{ENDEKS_TIP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
            </div>
          </div>
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
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Seçilen EGP Parametreleri</h4>
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
