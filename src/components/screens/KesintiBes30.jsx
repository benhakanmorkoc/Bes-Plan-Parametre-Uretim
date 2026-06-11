import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon, ArrowLeft, Trash2, ShieldAlert, MoreVertical, Edit2, List, Eye } from 'lucide-react'
import { bes30 as seedBes30 } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const LIST_COLUMNS = [
  { key: 'kod', label: 'Kesinti BES3.0 Kodu' },
  { key: 'ad', label: 'Kesinti BES3.0 Adı' },
  { key: 'versiyon', label: 'Versiyon' },
  { key: 'yil', label: 'Yıl' },
  { key: 'oran', label: 'Max Kesinti Oranı', computed: 'oran' },
  { key: 'tutar', label: 'Max Kesinti Tutarı', computed: 'tutar' },
]

const VERSIONS_BY_KOD = {
  'KB30-001': [
    { versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 1', durum: 'Aktif', gecerlilik: '30.07.2024' },
    { versiyon: '0', aciklama: 'Kesinti BES3.0 Kural 1 (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2024' },
  ],
  'KB30-002': [
    { versiyon: '2', aciklama: 'Kesinti BES3.0 Kural 2', durum: 'Aktif', gecerlilik: '15.03.2025' },
    { versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 2 (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2025' },
  ],
  'KB30-003': [{ versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 3', durum: 'Aktif', gecerlilik: '01.01.2026' }],
  'KB30-004': [{ versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 4', durum: 'Aktif', gecerlilik: '01.06.2026' }],
  'KB30-000': [{ versiyon: '1', aciklama: 'Kesinti BES3.0 Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    bes30TanimiYok: false,
    sozlesmeYili: '',
    maxKesintiOrani: '',
    maxKesintiTutari: '',
  }
}

function oranToPercent(oran) {
  const n = parseFloat(String(oran || '0').replace(',', '.'))
  if (Number.isNaN(n)) return ''
  if (n > 0 && n <= 1) return String(n * 100)
  return String(n)
}

function percentToOran(percent) {
  const n = parseFloat(String(percent || '0').replace(',', '.'))
  if (Number.isNaN(n)) return '0'
  return (n / 100).toFixed(2)
}

function rowToForm(row) {
  return {
    kod: row.kod || '',
    ad: row.ad || '',
    versiyon: String(row.versiyon || '1'),
    bes30TanimiYok: row.kod === 'KB30-000',
    sozlesmeYili: row.yil || '',
    maxKesintiOrani: row.kod === 'KB30-000' ? '' : oranToPercent(row.oran),
    maxKesintiTutari: row.tutar === '-' ? '' : String(row.tutar || ''),
  }
}

function displayMaxKesintiOrani(oran) {
  const n = parseFloat(String(oran || '0').replace(',', '.'))
  if (Number.isNaN(n) || n === 0) return '0'
  const decimal = n > 0 && n <= 1 ? n : n / 100
  return decimal.toFixed(2)
}

function displayMaxKesintiTutari(tutar) {
  if (tutar === '' || tutar == null || tutar === '-' || tutar === '—') return '—'
  return String(tutar)
}

function renderListCell(row, col) {
  if (col.computed === 'oran') return displayMaxKesintiOrani(row.oran)
  if (col.computed === 'tutar') return displayMaxKesintiTutari(row.tutar)
  const val = row[col.key]
  return val === '' || val == null ? '—' : val
}

export default function KesintiBes30() {
  const [rows, setRows] = useState(() => seedBes30.map((r) => ({ ...r })))
  const [viewMode, setViewMode] = useState('list')
  const [formMode, setFormMode] = useState('create')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [simpleModal, setSimpleModal] = useState({ open: false, title: '', body: null })

  const hasRules = !form.bes30TanimiYok

  useEffect(() => {
    const close = () => setOpenMenuRowId(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => `${r.kod} ${r.ad}`.toLowerCase().includes(q))
  }, [rows, search])

  const allChecked = filtered.length > 0 && selected.length === filtered.length
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map((r) => r.id))
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const openCreate = () => {
    setForm(emptyForm())
    setFormMode('create')
    setEditId(null)
    setViewMode('form')
  }

  const openUpdate = (row) => {
    setForm(rowToForm(row))
    setFormMode('update')
    setEditId(row.id)
    setViewMode('form')
    setOpenMenuRowId(null)
  }

  const openInspect = (row) => {
    setSimpleModal({
      open: true,
      title: 'Kesinti BES 3.0 İncele',
      body: (
        <div className="space-y-2 text-sm">
          <p><strong>Kesinti BES3.0 Kodu:</strong> {row.kod}</p>
          <p><strong>Kesinti BES3.0 Adı:</strong> {row.ad}</p>
          <p><strong>Versiyon:</strong> {row.versiyon}</p>
          <p><strong>Yıl:</strong> {row.yil || '—'}</p>
          <p><strong>Max Kesinti Oranı:</strong> {displayMaxKesintiOrani(row.oran)}</p>
          <p><strong>Max Kesinti Tutarı:</strong> {displayMaxKesintiTutari(row.tutar)}</p>
        </div>
      ),
    })
    setOpenMenuRowId(null)
  }

  const openLinkedPlans = (row) => {
    const mock = [
      { planNo: 'PLN-501', planAdi: 'Ferdi Avantaj Planı', versiyon: '6', durum: 'Yürürlükte' },
      { planNo: 'PLN-720', planAdi: 'BES 3.0 Standart Plan', versiyon: '2', durum: 'Taslak' },
    ]
    setSimpleModal({
      open: true,
      title: `${row.kod} — Bağlı Planlar`,
      body: (
        <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Plan No</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Plan Adı</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Versiyon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Durum</th>
              </tr>
            </thead>
            <tbody>
              {mock.map((p) => (
                <tr key={p.planNo} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 font-mono text-xs">{p.planNo}</td>
                  <td className="px-3 py-1.5">{p.planAdi}</td>
                  <td className="px-3 py-1.5">{p.versiyon}</td>
                  <td className="px-3 py-1.5">{p.durum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    })
    setOpenMenuRowId(null)
  }

  const openVersions = (row) => {
    const history = VERSIONS_BY_KOD[row.kod] || []
    setSimpleModal({
      open: true,
      title: `${row.kod} — Versiyonlar`,
      body: history.length ? (
        <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Versiyon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Açıklama</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Durum</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Geçerlilik</th>
              </tr>
            </thead>
            <tbody>
              {history.map((v) => (
                <tr key={v.versiyon} className="border-t border-slate-100">
                  <td className="px-3 py-1.5">{v.versiyon}</td>
                  <td className="px-3 py-1.5">{v.aciklama}</td>
                  <td className="px-3 py-1.5">{v.durum}</td>
                  <td className="px-3 py-1.5">{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Versiyon geçmişi bulunamadı.</p>
      ),
    })
    setOpenMenuRowId(null)
  }

  const validateForm = () => {
    if (!form.kod.trim() || !form.ad.trim()) {
      alert('Kesinti BES3.0 Kodu ve Kesinti BES3.0 Adı zorunludur.')
      return false
    }
    if (formMode === 'create' && rows.some((r) => r.kod.toLowerCase() === form.kod.trim().toLowerCase())) {
      alert('Bu kesinti kodu sistemde mevcuttur.')
      return false
    }
    if (hasRules) {
      if (!String(form.sozlesmeYili ?? '').trim()) {
        alert('Sözleşme Yılı zorunludur.')
        return false
      }
      if (!String(form.maxKesintiOrani ?? '').trim()) {
        alert('Maksimum Kesinti Oranı zorunludur.')
        return false
      }
    }
    return true
  }

  const saveForm = () => {
    if (!validateForm()) return
    const today = new Date().toLocaleDateString('tr-TR')
    const payload = {
      kod: form.kod.trim(),
      ad: form.ad.trim(),
      versiyon: form.versiyon,
      tarih: today,
      yil: hasRules ? String(form.sozlesmeYili) : '0',
      oran: hasRules ? percentToOran(form.maxKesintiOrani) : '0',
      tutar: hasRules && form.maxKesintiTutari ? form.maxKesintiTutari : hasRules ? '-' : '0',
    }
    if (formMode === 'update' && editId) {
      setRows((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setViewMode('list')
  }

  const removeRow = (row) => {
    if (!window.confirm(`${row.kod} kodlu kayıt silinsin mi?`)) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setSelected((prev) => prev.filter((id) => id !== row.id))
    setOpenMenuRowId(null)
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
            {formMode === 'create' ? 'Kesinti BES 3.0 Ekle' : `Kesinti BES 3.0 Güncelle (${form.kod})`}
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl space-y-5">
            <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">
                Bu ekran, diğer ekranlarda tanımlanan toplam kesintinin (GA + YGK + Ara Verme) mevzuat
                sınırlarını (%8.5) aşmamasını sağlayan güvenlik frenidir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Kesinti BES3.0 Kodu <span className="text-red-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.kod}
                  disabled={formMode === 'update'}
                  onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Kesinti BES3.0 Adı <span className="text-red-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.ad}
                  onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</label>
                <input
                  className="form-input bg-slate-100 text-slate-600 cursor-not-allowed"
                  disabled
                  readOnly
                  value={form.versiyon}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                    checked={form.bes30TanimiYok}
                    onChange={(e) => setForm((f) => ({ ...f, bes30TanimiYok: e.target.checked }))}
                  />
                  Kesinti BES3.0 Tanımı Yok
                </label>
              </div>
            </div>

            {hasRules && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sözleşme Yılı</label>
                  <input
                    className="form-input"
                    placeholder="Örn: 1"
                    value={form.sozlesmeYili}
                    onChange={(e) => setForm((f) => ({ ...f, sozlesmeYili: e.target.value.replace(/[^0-9]/g, '') }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Maksimum Kesinti Oranı (%)</label>
                  <input
                    className="form-input"
                    placeholder="%8.50"
                    value={form.maxKesintiOrani}
                    onChange={(e) => setForm((f) => ({ ...f, maxKesintiOrani: e.target.value.replace(/[^0-9.,]/g, '') }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Maksimum Kesinti Tutarı (TL)</label>
                  <input
                    className="form-input"
                    placeholder="0.00 TL"
                    value={form.maxKesintiTutari}
                    onChange={(e) => setForm((f) => ({ ...f, maxKesintiTutari: e.target.value.replace(/[^0-9.,]/g, '') }))}
                  />
                </div>
              </div>
            )}
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
          <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden relative">
      {openMenuRowId && (
        <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Menüyü kapat" onClick={() => setOpenMenuRowId(null)} />
      )}

      <ScreenHeader
        title="Kesinti BES 3.0"
        description="BES 3.0 kapsamında kesinti tanımları"
        right={(
          <>
            <OutlineButton disabled={selected.length === 0}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
              {selected.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full">
                  {selected.length}
                </span>
              )}
            </OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        )}
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Kod / Ad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table min-w-[900px]">
          <thead>
            <tr>
              <th className="w-10">
                <input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} />
              </th>
              {LIST_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}
              <th className="w-12 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <input type="checkbox" className="rounded" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} />
                </td>
                {LIST_COLUMNS.map((c) => (
                  <td key={c.key} className={c.key === 'kod' ? 'font-semibold' : ''}>
                    {renderListCell(row, c)}
                  </td>
                ))}
                <td className="text-center relative">
                  <button
                    type="button"
                    className={`p-1.5 rounded-full ${openMenuRowId === row.id ? 'bg-slate-200' : 'hover:bg-slate-100 text-slate-500'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuRowId((prev) => (prev === row.id ? null : row.id))
                    }}
                    aria-label="Satır işlemleri"
                  >
                    <MoreVertical className="w-5 h-5 mx-auto" />
                  </button>
                  {openMenuRowId === row.id && (
                    <div
                      className="absolute right-8 top-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1.5 text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => openInspect(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4 mr-2 text-slate-500" /> İncele
                      </button>
                      <button
                        type="button"
                        onClick={() => openUpdate(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Güncelle
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Sil
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={() => openLinkedPlans(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LinkIcon className="w-4 h-4 mr-2 text-slate-400" /> Bağlı Planlar
                      </button>
                      <button
                        type="button"
                        onClick={() => openVersions(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <List className="w-4 h-4 mr-2 text-slate-400" /> Versiyonlar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={LIST_COLUMNS.length + 2} className="text-center text-slate-500 py-6 text-sm">
                  Sonuç bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={simpleModal.open}
        onClose={() => setSimpleModal({ open: false, title: '', body: null })}
        title={simpleModal.title}
        footer={<PrimaryButton onClick={() => setSimpleModal({ open: false, title: '', body: null })}>Kapat</PrimaryButton>}
      >
        {simpleModal.body}
      </Modal>
    </div>
  )
}
