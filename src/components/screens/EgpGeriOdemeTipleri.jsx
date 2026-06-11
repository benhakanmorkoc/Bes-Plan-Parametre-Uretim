import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon, ArrowLeft, Trash2, Save } from 'lucide-react'
import { egpGeriOdeme as seedRows } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const GERI_ODEME_TIPLERI = [
  'Tutar Bazlı Ödeme',
  'Süre Bazlı Ödeme',
  'Mevduat',
  'Kira Geliri',
  'Bakiyeye Orantılı',
  'Sabit',
]

const PLAN_OPTIONS = [
  { id: '001', ad: 'Limitli Plan' },
  { id: '002', ad: 'Aile Planı' },
  { id: '003', ad: 'Aslan Bireysel Emeklilik Planı' },
  { id: '004', ad: 'Meridyen Bireysel Emeklilik Planı' },
]

function normalizeTip(raw) {
  if (raw === 'Tutar Bazlı Ödeme' || raw === 'Süre Bazlı Ödeme' || raw === 'Mevduat' || raw === 'Kira Geliri') return raw
  if (raw === 'Sabit') return 'Tutar Bazlı Ödeme'
  if (raw === 'Bakiyeye Orantili') return 'Süre Bazlı Ödeme'
  if (raw === 'Bakiyeye Orantılı') return 'Süre Bazlı Ödeme'
  return raw || ''
}

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    tip: '',
    sureAlt: '',
    sureUst: '',
    tutarAlt: '',
    tutarUst: '',
    oranUst: '',
    faiz: '',
  }
}

function rowToForm(row) {
  return {
    kod: row.kod || '',
    ad: row.ad || '',
    versiyon: String(row.versiyon || '1'),
    tip: row.tip || '',
    sureAlt: row.sureAlt || '',
    sureUst: row.sureUst || '',
    tutarAlt: row.tutarAlt || '',
    tutarUst: row.tutarUst || '',
    oranUst: row.oranUst || '',
    faiz: row.faiz || '',
  }
}

function FieldLabel({ children, required }) {
  return (
    <span className="block text-xs font-semibold text-slate-600 mb-1">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </span>
  )
}

export default function EgpGeriOdemeTipleri() {
  const [rows, setRows] = useState(() =>
    seedRows.map((r) => ({
      ...r,
      tip: normalizeTip(r.tip),
    })),
  )
  const [viewMode, setViewMode] = useState('list')
  const [selected, setSelected] = useState([])
  const [menuId, setMenuId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [bindOpen, setBindOpen] = useState(false)
  const [bindSearch, setBindSearch] = useState('')
  const [bindSelectedPlans, setBindSelectedPlans] = useState([])
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })

  const filteredRows = rows
  const allChecked = filteredRows.length > 0 && filteredRows.every((r) => selected.includes(r.id))
  const selectedRows = filteredRows.filter((r) => selected.includes(r.id))
  const filteredPlans = useMemo(
    () => PLAN_OPTIONS.filter((p) => `${p.id} ${p.ad}`.toLowerCase().includes(bindSearch.toLowerCase())),
    [bindSearch],
  )

  const isTutarBazli = form.tip === 'Tutar Bazlı Ödeme'
  const isSureBazli = form.tip === 'Süre Bazlı Ödeme'
  const isMevduatOrKira = form.tip === 'Mevduat' || form.tip === 'Kira Geliri'

  const sureAltEnabled = isSureBazli || isMevduatOrKira
  const sureUstEnabled = isSureBazli
  const tutarAltEnabled = isTutarBazli
  const tutarUstEnabled = isTutarBazli
  const faizEnabled = isMevduatOrKira

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setViewMode('form')
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(rowToForm(row))
    setViewMode('form')
    setMenuId(null)
  }

  const handleTipChange = (tip) => {
    setForm((f) => ({
      ...f,
      tip,
      sureAlt: '',
      sureUst: '',
      tutarAlt: '',
      tutarUst: '',
      oranUst: f.oranUst,
      faiz: '',
    }))
  }

  const save = () => {
    if (!form.kod.trim() || !form.ad.trim() || !form.tip) {
      alert('Geri Ödeme Kodu, Geri Ödeme Adı ve Geri Ödeme Tipi zorunludur.')
      return
    }
    const payload = { ...form }
    if (editingId) {
      setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setViewMode('list')
  }

  if (viewMode === 'form') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100"
            aria-label="Geri"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">
            {editingId ? `Geri Ödeme Tipleri Güncelle (${form.kod})` : 'Geri Ödeme Tipleri Ekle'}
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Geri Ödeme Kodu</FieldLabel>
              <input
                className="form-input"
                value={form.kod}
                disabled={Boolean(editingId)}
                onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel required>Geri Ödeme Adı</FieldLabel>
              <input
                className="form-input"
                value={form.ad}
                onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Versiyon</FieldLabel>
              <input
                className="form-input bg-slate-100 text-slate-600 cursor-not-allowed"
                disabled
                readOnly
                value={form.versiyon || '1'}
              />
            </div>
            <div>
              <FieldLabel required>Geri Ödeme Tipi</FieldLabel>
              <select
                className="form-select"
                value={form.tip}
                onChange={(e) => handleTipChange(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {GERI_ODEME_TIPLERI.map((t) => <option key={t} value={t}>{t}</option>)}
                {!GERI_ODEME_TIPLERI.includes(form.tip) && form.tip ? <option value={form.tip}>{form.tip}</option> : null}
              </select>
            </div>
            <div>
              <FieldLabel>Geri Ödeme Süresi(Yıl) Alt Limiti</FieldLabel>
              <input
                className={`form-input ${!sureAltEnabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                disabled={!sureAltEnabled}
                placeholder={sureAltEnabled ? '' : 'Sadece Süre/Kira/Mevduat için'}
                value={form.sureAlt}
                onChange={(e) => setForm((f) => ({ ...f, sureAlt: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Geri Ödeme Süresi(Yıl) Üst Limiti</FieldLabel>
              <input
                className={`form-input ${!sureUstEnabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                disabled={!sureUstEnabled}
                placeholder={sureUstEnabled ? '' : 'Sadece Süre Bazlı için'}
                value={form.sureUst}
                onChange={(e) => setForm((f) => ({ ...f, sureUst: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Alt Limit Geri Ödeme Tutarı</FieldLabel>
              <input
                className={`form-input ${!tutarAltEnabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                disabled={!tutarAltEnabled}
                placeholder={tutarAltEnabled ? '' : 'Sadece Tutar Bazlı için'}
                value={form.tutarAlt}
                onChange={(e) => setForm((f) => ({ ...f, tutarAlt: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Üst Limit Geri Ödeme Tutarı</FieldLabel>
              <input
                className={`form-input ${!tutarUstEnabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                disabled={!tutarUstEnabled}
                placeholder={tutarUstEnabled ? '' : 'Sadece Tutar Bazlı için'}
                value={form.tutarUst}
                onChange={(e) => setForm((f) => ({ ...f, tutarUst: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Geri Ödeme Oranı Üst Limiti</FieldLabel>
              <input
                className="form-input"
                value={form.oranUst}
                onChange={(e) => setForm((f) => ({ ...f, oranUst: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Faiz Oran</FieldLabel>
              <input
                className={`form-input ${!faizEnabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                disabled={!faizEnabled}
                placeholder={faizEnabled ? '' : 'Sadece Mevduat/Kira için aktif'}
                value={form.faiz}
                onChange={(e) => setForm((f) => ({ ...f, faiz: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <OutlineButton onClick={() => setViewMode('list')}>İptal</OutlineButton>
          <OutlineButton
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setForm(emptyForm())}
          >
            <Trash2 className="w-4 h-4" /> Temizle
          </OutlineButton>
          <PrimaryButton onClick={save}>
            <Save className="w-4 h-4" /> Kaydet
          </PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Geri Ödeme Tipleri"
        right={(
          <>
            <OutlineButton disabled={selected.length === 0} onClick={() => { setBindOpen(true); setBindSearch(''); setBindSelectedPlans([]) }}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
            </OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        )}
      />

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10 text-center"><input type="checkbox" checked={allChecked} onChange={() => setSelected(allChecked ? [] : filteredRows.map((r) => r.id))} /></th>
              <th>Geri Ödeme Kodu</th>
              <th>Geri Ödeme Adı</th>
              <th>Geri Ödeme Tipi</th>
              <th>Versiyon</th>
              <th>Geri Ödeme Süresi(Yıl) Alt Limiti</th>
              <th>Geri Ödeme Süresi(Yıl) Üst Limiti</th>
              <th className="w-12 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="text-center"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((prev) => (prev.includes(row.id) ? prev.filter((x) => x !== row.id) : [...prev, row.id]))} /></td>
                <td>{row.kod}</td>
                <td>{row.ad}</td>
                <td>{row.tip}</td>
                <td>{row.versiyon}</td>
                <td>{row.sureAlt || '-'}</td>
                <td>{row.sureUst || '-'}</td>
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
        open={bindOpen}
        onClose={() => setBindOpen(false)}
        title="Planlara Bağla"
        footer={<><OutlineButton onClick={() => setBindOpen(false)}>İptal</OutlineButton><PrimaryButton disabled={bindSelectedPlans.length === 0}>Seçili Planlara Bağla</PrimaryButton></>}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Seçilen Geri Ödeme Tipleri</h4>
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
