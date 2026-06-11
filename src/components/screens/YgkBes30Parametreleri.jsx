import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon, ArrowLeft, Trash2, MoreVertical, Edit2, List, Save, Eye } from 'lucide-react'
import { ygkBes30 as seedYgkBes30, ygkFormulleri as seedYgkFormulleri } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const DOVIZ_OPTIONS = [
  { code: 'TL', label: 'Türk Lirası (TL)' },
  { code: 'USD', label: 'Amerikan Doları (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
]
const BIRIKIM_TIPI_OPTIONS = ['Ana Para', 'Toplam Birikim']
const KESINTI_DONEMI_OPTIONS = ['Aylık', 'Yıllık']
const KESINTI_ZAMANI_OPTIONS = ['Dönem Sonunda', 'Dönem Başında']
const YGK_KESINTI_TIPI_OPTIONS = ['Oran', 'Tutar', 'Formül', 'Katkı Payı Aralığı']

const LIST_COLUMNS = [
  { key: 'kod', label: 'YGK BES3.0 Kodu' },
  { key: 'ad', label: 'YGK BES3.0 Adı' },
  { key: 'versiyon', label: 'Versiyon' },
  { key: 'doviz', label: 'Döviz Kodu' },
  { key: 'tip', label: 'YGK Kesinti Tipi' },
  { key: 'oran', label: 'Oran' },
  { key: 'yillikTutar', label: 'Yıllık Tutar' },
  { key: 'formul', label: 'YGK Formülü' },
  { key: 'donem', label: 'Kesinti Dönemi' },
  { key: 'yil', label: 'Sözleşme Yılı Aralığı' },
  { key: 'birikim', label: 'Birikim' },
  { key: 'kesintiZamani', label: 'Kesinti Zamanı' },
  { key: 'tahsilatYgkKontrolu', label: 'Tahsilat YGK Kontrolü' },
  { key: 'maxKesintiYap', label: 'Max Kesinti Yap' },
]

const VERSIONS_BY_KOD = {
  'YB30-001': [
    { versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 1', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '0', aciklama: 'YGK BES3.0 Kuralı 1 (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YB30-002': [
    { versiyon: '2', aciklama: 'YGK BES3.0 Kuralı 2', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 2 (önceki)', durum: 'Arşiv', gecerlilik: '15.09.2024' },
  ],
  'YB30-003': [{ versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 3', durum: 'Aktif', gecerlilik: '01.06.2025' }],
  'YB30-004': [{ versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 4', durum: 'Aktif', gecerlilik: '01.03.2026' }],
}

const LINKED_PLANS_BY_KOD = {
  'YB30-001': [
    { planNo: 'PLN-501', planAdi: 'Ferdi Avantaj Planı', versiyon: '6', durum: 'Yürürlükte' },
    { planNo: 'PLN-612', planAdi: 'Birikim Plus Plan', versiyon: '3', durum: 'Taslak' },
  ],
  'YB30-002': [{ planNo: 'PLN-220', planAdi: 'Kurumsal Standart Plan', versiyon: '2', durum: 'Yürürlükte' }],
  'YB30-003': [],
  'YB30-004': [],
}

const INITIAL_MUAF_BANDS_BY_KOD = {
  'YB30-001': [
    { id: '1', minTutar: '1001', maxTutar: '2000', oran: '0.08', tutar: '-' },
    { id: '2', minTutar: '2001', maxTutar: '3500', oran: '0.10', tutar: '-' },
    { id: '3', minTutar: '3501', maxTutar: '5000', oran: '0.12', tutar: '-' },
    { id: '4', minTutar: '5001', maxTutar: '7500', oran: '0.14', tutar: '-' },
    { id: '5', minTutar: '7501', maxTutar: '10000', oran: '0.16', tutar: '-' },
  ],
  'YB30-002': [
    { id: '1', minTutar: '0', maxTutar: '50000', oran: '0.03', tutar: '-' },
    { id: '2', minTutar: '50001', maxTutar: '100000', oran: '0.025', tutar: '-' },
  ],
  'YB30-003': [],
  'YB30-004': [],
}

function emptyMuafForm() {
  return { minTutar: '', maxTutar: '', oran: '', tutar: '' }
}

function muafOranToPercent(oran) {
  if (!oran || oran === '-' || oran === '—') return ''
  const n = parseFloat(String(oran).replace(',', '.'))
  if (Number.isNaN(n) || n === 0) return ''
  if (n > 0 && n <= 1) return String(n * 100)
  return String(n)
}

function muafPercentToOran(percent) {
  const raw = String(percent ?? '').trim()
  if (!raw) return '-'
  const n = parseFloat(raw.replace(',', '.'))
  if (Number.isNaN(n) || n === 0) return '-'
  const decimal = n > 0 && n <= 1 ? n : n / 100
  return decimal.toFixed(2)
}

function displayMuafOran(oran) {
  if (!oran || oran === '-' || oran === '—') return '—'
  const n = parseFloat(String(oran).replace(',', '.'))
  if (Number.isNaN(n) || n === 0) return '—'
  const decimal = n > 0 && n <= 1 ? n : n / 100
  return decimal.toFixed(2)
}

function displayMuafTutar(tutar) {
  if (tutar === '' || tutar == null || tutar === '-' || tutar === '—' || tutar === '0') return '—'
  return String(tutar)
}

function muafTutarToForm(tutar) {
  if (!tutar || tutar === '-' || tutar === '—' || tutar === '0') return ''
  return String(tutar)
}

const INITIAL_KP_ARALIK_BY_KOD = {
  'YB30-001': [
    { id: '1', minKp: '500', maxKp: '2500', oran: '0.08', tutar: '-' },
    { id: '2', minKp: '2501', maxKp: '10000', oran: '0.10', tutar: '-' },
  ],
  'YB30-002': [{ id: '1', minKp: '1000', maxKp: '999999', oran: '0.03', tutar: '-' }],
}

function emptyKpAralikForm() {
  return { minKp: '', maxKp: '', oran: '', tutar: '' }
}

function isKatkiPayiAraligi(row) {
  return row?.tip === 'Katki Payi Araligi'
}

function mapDonemFromSeed(val) {
  if (val === 'Aylik') return 'Aylık'
  if (val === 'Yillik') return 'Yıllık'
  return val || 'Aylık'
}

function mapDonemToSeed(val) {
  if (val === 'Aylık') return 'Aylik'
  if (val === 'Yıllık') return 'Yillik'
  return val
}

function mapBirikimFromSeed(val) {
  if (val === 'Anapara') return 'Ana Para'
  if (val === 'Toplam') return 'Toplam Birikim'
  return val || 'Ana Para'
}

function mapBirikimToSeed(val) {
  if (val === 'Ana Para') return 'Anapara'
  if (val === 'Toplam Birikim') return 'Toplam'
  return val
}

function mapTipFromSeed(val) {
  if (val === 'Katki Payi Araligi') return 'Katkı Payı Aralığı'
  return val || 'Oran'
}

function mapTipToSeed(val) {
  if (val === 'Katkı Payı Aralığı') return 'Katki Payi Araligi'
  return val
}

function displayDash(val) {
  if (val == null || val === '' || val === '-') return '—'
  return val
}

function displayMaxKesintiOrani(oran) {
  const n = parseFloat(String(oran || '0').replace(',', '.'))
  if (Number.isNaN(n) || n === 0 || oran === '-') return '—'
  const decimal = n > 0 && n <= 1 ? n : n / 100
  return decimal.toFixed(2)
}

function displayBoolFlag(val) {
  if (val === false) return 'Hayır'
  return val ? 'Evet' : '—'
}

function displayListCell(row, key) {
  switch (key) {
    case 'tip':
      return row.tip === 'Yok' ? 'Yok' : mapTipFromSeed(row.tip)
    case 'donem':
      return row.donem === '-' ? 'Yok' : mapDonemFromSeed(row.donem)
    case 'birikim':
      return row.birikim === '-' ? '—' : mapBirikimFromSeed(row.birikim)
    case 'oran':
      return displayMaxKesintiOrani(row.oran)
    case 'formul': {
      const { ygkFormulKodu, ygkFormulAdi } = resolveFormulFields(row.formul)
      if (!ygkFormulKodu) return '—'
      return ygkFormulAdi ? `${ygkFormulKodu} — ${ygkFormulAdi}` : ygkFormulKodu
    }
    case 'yillikTutar':
      return displayDash(row[key])
    case 'kesintiZamani':
      return row.kesintiZamani ? row.kesintiZamani : '—'
    case 'tahsilatYgkKontrolu':
      return row.tip === 'Yok' ? '—' : displayBoolFlag(row.tahsilatYgkKontrolu)
    case 'maxKesintiYap':
      return row.tip === 'Yok' ? '—' : displayBoolFlag(row.maxKesintiYap)
    default:
      return row[key] ?? '—'
  }
}

function resolveFormulFields(formulStr) {
  const s = formulStr === '-' ? '' : String(formulStr || '').trim()
  if (!s) return { ygkFormulKodu: '', ygkFormulAdi: '' }
  const byKod = seedYgkFormulleri.find((f) => f.kod === s)
  if (byKod) return { ygkFormulKodu: byKod.kod, ygkFormulAdi: byKod.ad }
  const byAd = seedYgkFormulleri.find((f) => f.ad === s)
  if (byAd) return { ygkFormulKodu: byAd.kod, ygkFormulAdi: byAd.ad }
  return { ygkFormulKodu: s, ygkFormulAdi: '' }
}

function FormulLookupModal({ open, onClose, onSelect }) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open) setSearch('')
  }, [open])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return seedYgkFormulleri.filter((f) => (
      !q || `${f.kod} ${f.ad} ${f.aciklama}`.toLowerCase().includes(q)
    ))
  }, [search])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="YGK Formülleri"
      description="Listeden bir formül seçin"
      size="lg"
      footer={<OutlineButton onClick={onClose}>Kapat</OutlineButton>}
    >
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
          placeholder="Formül kodu veya adı ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-80 overflow-auto border border-slate-200 rounded-lg">
        <table className="w-full grid-table text-sm">
          <thead>
            <tr>
              <th>Formül Kodu</th>
              <th>Formül Adı</th>
              <th>Açıklama</th>
              <th className="w-24 text-center">Seç</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id}>
                <td className="font-mono text-xs font-semibold">{f.kod}</td>
                <td>{f.ad}</td>
                <td className="text-slate-600">{f.aciklama}</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="text-xs px-2.5 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    onClick={() => onSelect(f)}
                  >
                    Seç
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="text-center py-6 text-slate-500">Formül bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}

function FormulLookupField({ kod, ad, onOpen }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Formülü</label>
      <div className="flex gap-2">
        <input
          className="form-input flex-1 bg-slate-50"
          placeholder="Formül seçiniz"
          readOnly
          value={kod ? `${kod}${ad ? ` — ${ad}` : ''}` : ''}
        />
        <OutlineButton onClick={onOpen}>Seç</OutlineButton>
      </div>
    </div>
  )
}

function parseYilRange(yil) {
  const s = String(yil || '')
  if (s.includes('-')) {
    const [alt, ust] = s.split('-')
    return { alt: alt.trim(), ust: ust.trim() }
  }
  return { alt: s, ust: s }
}

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    ygkBes30TanimiYok: false,
    doviz: 'TL',
    sozlesmeYilAlt: '',
    sozlesmeYilUst: '',
    birikimTipi: 'Ana Para',
    kesintiDonemi: 'Aylık',
    kesintiZamani: 'Dönem Sonunda',
    ygkKesintiTipi: 'Oran',
    kesintiOrani: '',
    yillikTutar: '',
    ygkFormulKodu: '',
    ygkFormulAdi: '',
    tahsilatYgkKontrolu: true,
    maxKesintiYap: true,
  }
}

function rowToForm(row) {
  const ygkBes30TanimiYok = row.tip === 'Yok' || row.yil === '0'
  const { alt, ust } = ygkBes30TanimiYok ? { alt: '', ust: '' } : parseYilRange(row.yil)
  const oranPercent = !ygkBes30TanimiYok && row.oran && row.oran !== '-'
    ? String(parseFloat(row.oran) * 100)
    : ''
  return {
    kod: row.kod || '',
    ad: row.ad || '',
    versiyon: String(row.versiyon || '1'),
    ygkBes30TanimiYok,
    doviz: row.doviz === 'TRL' ? 'TL' : row.doviz || 'TL',
    sozlesmeYilAlt: alt,
    sozlesmeYilUst: ust,
    birikimTipi: ygkBes30TanimiYok ? 'Ana Para' : mapBirikimFromSeed(row.birikim),
    kesintiDonemi: ygkBes30TanimiYok ? 'Aylık' : mapDonemFromSeed(row.donem),
    kesintiZamani: row.kesintiZamani || 'Dönem Sonunda',
    ygkKesintiTipi: ygkBes30TanimiYok ? 'Oran' : mapTipFromSeed(row.tip),
    kesintiOrani: oranPercent,
    yillikTutar: row.yillikTutar === '-' ? '' : String(row.yillikTutar || ''),
    ...resolveFormulFields(row.formul),
    tahsilatYgkKontrolu: row.tahsilatYgkKontrolu !== false,
    maxKesintiYap: row.maxKesintiYap !== false,
  }
}

export default function YgkBes30Parametreleri() {
  const [rows, setRows] = useState(() => seedYgkBes30.map((r) => ({ ...r })))
  const [viewMode, setViewMode] = useState('list')
  const [formMode, setFormMode] = useState('create')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [linkedRow, setLinkedRow] = useState(null)
  const [inspectRow, setInspectRow] = useState(null)
  const [versionsModal, setVersionsModal] = useState({ open: false, title: '', rows: [] })
  const [muafBandsByKod, setMuafBandsByKod] = useState(() => (
    Object.fromEntries(Object.entries(INITIAL_MUAF_BANDS_BY_KOD).map(([k, v]) => [k, v.map((b) => ({ ...b }))]))
  ))
  const [muafiyetParentRow, setMuafiyetParentRow] = useState(null)
  const [muafFormOpen, setMuafFormOpen] = useState(false)
  const [muafFormMode, setMuafFormMode] = useState('create')
  const [muafForm, setMuafForm] = useState(emptyMuafForm)
  const [muafEditId, setMuafEditId] = useState(null)
  const [muafSearch, setMuafSearch] = useState('')
  const [openMuafMenuBandId, setOpenMuafMenuBandId] = useState(null)
  const [muafInspectBand, setMuafInspectBand] = useState(null)
  const [kpAralikBandsByKod, setKpAralikBandsByKod] = useState(() => (
    Object.fromEntries(Object.entries(INITIAL_KP_ARALIK_BY_KOD).map(([k, v]) => [k, v.map((b) => ({ ...b }))]))
  ))
  const [kpAralikParentRow, setKpAralikParentRow] = useState(null)
  const [kpAralikFormOpen, setKpAralikFormOpen] = useState(false)
  const [kpAralikFormMode, setKpAralikFormMode] = useState('create')
  const [kpAralikForm, setKpAralikForm] = useState(emptyKpAralikForm)
  const [kpAralikEditId, setKpAralikEditId] = useState(null)
  const [kpAralikSearch, setKpAralikSearch] = useState('')
  const [openKpAralikMenuBandId, setOpenKpAralikMenuBandId] = useState(null)
  const [kpAralikInspectBand, setKpAralikInspectBand] = useState(null)
  const [pageSize, setPageSize] = useState(10)
  const [formulLookupOpen, setFormulLookupOpen] = useState(false)

  const currentMuafBands = muafiyetParentRow
    ? (muafBandsByKod[muafiyetParentRow.kod] || [])
    : []

  const filteredMuafBands = useMemo(() => {
    if (!muafSearch.trim()) return currentMuafBands
    const q = muafSearch.toLowerCase()
    return currentMuafBands.filter((b) => (
      [b.minTutar, b.maxTutar, b.oran, b.tutar].some((s) => String(s).toLowerCase().includes(q))
    ))
  }, [currentMuafBands, muafSearch])

  const currentKpAralikBands = kpAralikParentRow
    ? (kpAralikBandsByKod[kpAralikParentRow.kod] || [])
    : []

  const filteredKpAralikBands = useMemo(() => {
    if (!kpAralikSearch.trim()) return currentKpAralikBands
    const q = kpAralikSearch.toLowerCase()
    return currentKpAralikBands.filter((b) => (
      [b.minKp, b.maxKp, b.oran, b.tutar].some((s) => String(s).toLowerCase().includes(q))
    ))
  }, [currentKpAralikBands, kpAralikSearch])

  const hasRules = !form.ygkBes30TanimiYok
  const showOranField = hasRules && form.ygkKesintiTipi === 'Oran'
  const showTutarField = hasRules && form.ygkKesintiTipi === 'Tutar'
  const showFormulField = hasRules && form.ygkKesintiTipi === 'Formül'

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
    setInspectRow(row)
    setOpenMenuRowId(null)
  }

  const validateForm = () => {
    if (!form.kod.trim() || !form.ad.trim()) {
      alert('YGK BES3.0 Kodu ve YGK BES3.0 Adı zorunludur.')
      return false
    }
    if (formMode === 'create' && rows.some((r) => r.kod.toLowerCase() === form.kod.trim().toLowerCase())) {
      alert('Bu kod sistemde mevcuttur.')
      return false
    }
    if (hasRules) {
      if (!String(form.sozlesmeYilAlt ?? '').trim() || !String(form.sozlesmeYilUst ?? '').trim()) {
        alert('Sözleşme Yılı Aralığı (Alt/Üst) zorunludur.')
        return false
      }
      if (showOranField && !String(form.kesintiOrani ?? '').trim()) {
        alert('Kesinti Oranı zorunludur.')
        return false
      }
      if (showTutarField && !String(form.yillikTutar ?? '').trim()) {
        alert('Yıllık Tutar zorunludur.')
        return false
      }
      if (showFormulField && !String(form.ygkFormulKodu ?? '').trim()) {
        alert('YGK Formülü seçilmelidir.')
        return false
      }
    }
    return true
  }

  const saveForm = () => {
    if (!validateForm()) return
    const today = new Date().toLocaleDateString('tr-TR')
    const yil = hasRules
      ? (form.sozlesmeYilAlt === form.sozlesmeYilUst
        ? form.sozlesmeYilAlt
        : `${form.sozlesmeYilAlt}-${form.sozlesmeYilUst}`)
      : '0'
    const oran = hasRules && form.ygkKesintiTipi === 'Oran' && form.kesintiOrani
      ? (parseFloat(String(form.kesintiOrani).replace(',', '.')) / 100).toFixed(2)
      : '-'
    const yillikTutar = hasRules && form.ygkKesintiTipi === 'Tutar' && form.yillikTutar
      ? String(form.yillikTutar).trim()
      : '-'
    const formul = hasRules && form.ygkKesintiTipi === 'Formül' && form.ygkFormulKodu
      ? String(form.ygkFormulKodu).trim()
      : '-'
    const payload = {
      kod: form.kod.trim(),
      ad: form.ad.trim(),
      versiyon: form.versiyon,
      tarih: today,
      doviz: form.doviz === 'TL' ? 'TRL' : form.doviz,
      tip: hasRules ? mapTipToSeed(form.ygkKesintiTipi) : 'Yok',
      oran,
      yillikTutar,
      formul,
      donem: hasRules ? mapDonemToSeed(form.kesintiDonemi) : '-',
      yil,
      birikim: hasRules ? mapBirikimToSeed(form.birikimTipi) : '-',
      kesintiZamani: hasRules ? form.kesintiZamani : '',
      tahsilatYgkKontrolu: hasRules ? form.tahsilatYgkKontrolu : false,
      maxKesintiYap: hasRules ? form.maxKesintiYap : false,
    }
    if (formMode === 'update' && editId) {
      setRows((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setViewMode('list')
  }

  const removeRow = (row) => {
    if (!window.confirm('Bu kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setSelected((prev) => prev.filter((id) => id !== row.id))
    setOpenMenuRowId(null)
  }

  const openLinkedPlans = (row) => {
    setLinkedRow(row)
    setOpenMenuRowId(null)
  }

  const openVersions = (row) => {
    const versionRows = VERSIONS_BY_KOD[row.kod] || []
    setVersionsModal({ open: true, title: `${row.kod} — Versiyonlar`, rows: versionRows })
    setOpenMenuRowId(null)
  }

  const closeMuafiyetModal = () => {
    setMuafiyetParentRow(null)
    setMuafFormOpen(false)
    setMuafForm(emptyMuafForm())
    setMuafEditId(null)
    setMuafFormMode('create')
    setMuafSearch('')
    setOpenMuafMenuBandId(null)
    setMuafInspectBand(null)
  }

  const openMuafiyet = (row) => {
    setMuafiyetParentRow(row)
    setMuafFormOpen(false)
    setMuafForm(emptyMuafForm())
    setMuafEditId(null)
    setMuafFormMode('create')
    setMuafSearch('')
    setOpenMuafMenuBandId(null)
    setOpenMenuRowId(null)
  }

  const closeKpAralikModal = () => {
    setKpAralikParentRow(null)
    setKpAralikFormOpen(false)
    setKpAralikForm(emptyKpAralikForm())
    setKpAralikEditId(null)
    setKpAralikFormMode('create')
    setKpAralikSearch('')
    setOpenKpAralikMenuBandId(null)
    setKpAralikInspectBand(null)
  }

  const openKpAralik = (row) => {
    if (!isKatkiPayiAraligi(row)) return
    setKpAralikParentRow(row)
    setKpAralikFormOpen(false)
    setKpAralikForm(emptyKpAralikForm())
    setKpAralikEditId(null)
    setKpAralikFormMode('create')
    setKpAralikSearch('')
    setOpenKpAralikMenuBandId(null)
    setOpenMenuRowId(null)
  }

  const openKpAralikCreate = () => {
    setKpAralikForm(emptyKpAralikForm())
    setKpAralikFormMode('create')
    setKpAralikEditId(null)
    setKpAralikFormOpen(true)
  }

  const openKpAralikInspect = (band) => {
    setKpAralikInspectBand(band)
    setOpenKpAralikMenuBandId(null)
  }

  const openKpAralikEdit = (band) => {
    setKpAralikForm({
      minKp: band.minKp,
      maxKp: band.maxKp,
      oran: muafOranToPercent(band.oran),
      tutar: muafTutarToForm(band.tutar),
    })
    setKpAralikFormMode('update')
    setKpAralikEditId(band.id)
    setKpAralikFormOpen(true)
    setOpenKpAralikMenuBandId(null)
  }

  const saveKpAralikForm = () => {
    if (!kpAralikParentRow) return
    if (!String(kpAralikForm.minKp).trim() || !String(kpAralikForm.maxKp).trim()) {
      alert('Aylık Min KP Tutarı ve Aylık Max KP Tutarı zorunludur.')
      return
    }
    const kod = kpAralikParentRow.kod
    const payload = {
      id: kpAralikFormMode === 'update' && kpAralikEditId ? kpAralikEditId : String(Date.now()),
      minKp: String(kpAralikForm.minKp).trim(),
      maxKp: String(kpAralikForm.maxKp).trim(),
      oran: muafPercentToOran(kpAralikForm.oran),
      tutar: String(kpAralikForm.tutar ?? '').trim() || '-',
    }
    setKpAralikBandsByKod((prev) => {
      const list = [...(prev[kod] || [])]
      if (kpAralikFormMode === 'update' && kpAralikEditId) {
        const idx = list.findIndex((b) => b.id === kpAralikEditId)
        if (idx >= 0) list[idx] = payload
      } else {
        list.push(payload)
      }
      return { ...prev, [kod]: list }
    })
    setKpAralikFormOpen(false)
    setKpAralikForm(emptyKpAralikForm())
    setKpAralikEditId(null)
    setKpAralikFormMode('create')
  }

  const removeKpAralikBand = (band) => {
    if (!kpAralikParentRow || !window.confirm('Bu katkı payı aralık tanımı silinsin mi?')) return
    const kod = kpAralikParentRow.kod
    setKpAralikBandsByKod((prev) => ({
      ...prev,
      [kod]: (prev[kod] || []).filter((b) => b.id !== band.id),
    }))
    setOpenKpAralikMenuBandId(null)
  }

  const openMuafCreate = () => {
    setMuafForm(emptyMuafForm())
    setMuafFormMode('create')
    setMuafEditId(null)
    setMuafFormOpen(true)
  }

  const openMuafInspect = (band) => {
    setMuafInspectBand(band)
    setOpenMuafMenuBandId(null)
  }

  const openMuafEdit = (band) => {
    setMuafForm({
      minTutar: band.minTutar,
      maxTutar: band.maxTutar,
      oran: muafOranToPercent(band.oran),
      tutar: muafTutarToForm(band.tutar),
    })
    setMuafFormMode('update')
    setMuafEditId(band.id)
    setMuafFormOpen(true)
    setOpenMuafMenuBandId(null)
  }

  const saveMuafForm = () => {
    if (!muafiyetParentRow) return
    if (!String(muafForm.minTutar).trim() || !String(muafForm.maxTutar).trim()) {
      alert('Min Tutar ve Max Tutar zorunludur.')
      return
    }
    const kod = muafiyetParentRow.kod
    const payload = {
      id: muafFormMode === 'update' && muafEditId ? muafEditId : String(Date.now()),
      minTutar: String(muafForm.minTutar).trim(),
      maxTutar: String(muafForm.maxTutar).trim(),
      oran: muafPercentToOran(muafForm.oran),
      tutar: String(muafForm.tutar ?? '').trim() || '-',
    }
    setMuafBandsByKod((prev) => {
      const list = [...(prev[kod] || [])]
      if (muafFormMode === 'update' && muafEditId) {
        const idx = list.findIndex((b) => b.id === muafEditId)
        if (idx >= 0) list[idx] = payload
      } else {
        list.push(payload)
      }
      return { ...prev, [kod]: list }
    })
    setMuafFormOpen(false)
    setMuafForm(emptyMuafForm())
    setMuafEditId(null)
    setMuafFormMode('create')
  }

  const removeMuafBand = (band) => {
    if (!muafiyetParentRow || !window.confirm('Bu muafiyet parametresi silinsin mi?')) return
    const kod = muafiyetParentRow.kod
    setMuafBandsByKod((prev) => ({
      ...prev,
      [kod]: (prev[kod] || []).filter((b) => b.id !== band.id),
    }))
    setOpenMuafMenuBandId(null)
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
            {formMode === 'create' ? 'YGK BES 3.0 Parametreleri Ekle' : `YGK BES 3.0 Güncelle (${form.kod})`}
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  YGK BES3.0 Kodu <span className="text-red-500">*</span>
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
                  YGK BES3.0 Adı <span className="text-red-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.ad}
                  onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</label>
                <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" disabled readOnly value={form.versiyon} />
              </div>
              <div className="flex items-end pb-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                    checked={form.ygkBes30TanimiYok}
                    onChange={(e) => setForm((f) => ({ ...f, ygkBes30TanimiYok: e.target.checked }))}
                  />
                  YGK BES3.0 Tanımı Yok
                </label>
              </div>
            </div>

            {hasRules && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Döviz</label>
                    <select
                      className="form-select"
                      value={form.doviz}
                      onChange={(e) => setForm((f) => ({ ...f, doviz: e.target.value }))}
                    >
                      {DOVIZ_OPTIONS.map((d) => (
                        <option key={d.code} value={d.code}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Sözleşme Yılı Aralığı</label>
                    <div className="flex items-center gap-2">
                      <input
                        className="form-input flex-1"
                        placeholder="Alt Yıl (Örn: 1)"
                        value={form.sozlesmeYilAlt}
                        onChange={(e) => setForm((f) => ({ ...f, sozlesmeYilAlt: e.target.value.replace(/[^0-9]/g, '') }))}
                      />
                      <input
                        className="form-input flex-1"
                        placeholder="Üst Yıl (Örn: 5)"
                        value={form.sozlesmeYilUst}
                        onChange={(e) => setForm((f) => ({ ...f, sozlesmeYilUst: e.target.value.replace(/[^0-9]/g, '') }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Birikim Tipi</label>
                    <select
                      className="form-select"
                      value={form.birikimTipi}
                      onChange={(e) => setForm((f) => ({ ...f, birikimTipi: e.target.value }))}
                    >
                      {BIRIKIM_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kesinti Dönemi</label>
                    <select
                      className="form-select"
                      value={form.kesintiDonemi}
                      onChange={(e) => setForm((f) => ({ ...f, kesintiDonemi: e.target.value }))}
                    >
                      {KESINTI_DONEMI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kesinti Zamanı</label>
                    <select
                      className="form-select"
                      value={form.kesintiZamani}
                      onChange={(e) => setForm((f) => ({ ...f, kesintiZamani: e.target.value }))}
                    >
                      {KESINTI_ZAMANI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Kesinti Tipi</label>
                    <select
                      className="form-select"
                      value={form.ygkKesintiTipi}
                      onChange={(e) => setForm((f) => ({
                        ...f,
                        ygkKesintiTipi: e.target.value,
                        kesintiOrani: '',
                        yillikTutar: '',
                        ygkFormulKodu: '',
                        ygkFormulAdi: '',
                      }))}
                    >
                      {YGK_KESINTI_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  {showFormulField && (
                    <FormulLookupField
                      kod={form.ygkFormulKodu}
                      ad={form.ygkFormulAdi}
                      onOpen={() => setFormulLookupOpen(true)}
                    />
                  )}
                </div>

                {showOranField && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kesinti Oranı (%)</label>
                    <input
                      className="form-input"
                      placeholder="Örn: 3"
                      value={form.kesintiOrani}
                      onChange={(e) => setForm((f) => ({ ...f, kesintiOrani: e.target.value.replace(/[^0-9.,]/g, '') }))}
                    />
                  </div>
                )}

                {showTutarField && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Yıllık Tutar (TL)</label>
                    <input
                      className="form-input"
                      placeholder="Örn: 1500"
                      value={form.yillikTutar}
                      onChange={(e) => setForm((f) => ({ ...f, yillikTutar: e.target.value.replace(/[^0-9.,]/g, '') }))}
                    />
                  </div>
                )}

                <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-4 space-y-3">
                  <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 mt-0.5"
                      checked={form.tahsilatYgkKontrolu}
                      onChange={(e) => setForm((f) => ({ ...f, tahsilatYgkKontrolu: e.target.checked }))}
                    />
                    <span>
                      <span className="font-semibold">Tahsilat YGK Kontrolü Yapılsın</span>
                      <span className="block text-xs text-slate-500 mt-0.5">
                        (Öncelikli olarak tahsilattan kesilip kesilmediğine bakar, çift kesintiyi önler)
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 mt-0.5"
                      checked={form.maxKesintiYap}
                      onChange={(e) => setForm((f) => ({ ...f, maxKesintiYap: e.target.checked }))}
                    />
                    <span>
                      <span className="font-semibold">Max Kesinti Yap</span>
                      <span className="block text-xs text-slate-500 mt-0.5">
                        (Devletin izin verdiği en üst yasal sınırdan tahsilat yapılmasını sağlar)
                      </span>
                    </span>
                  </label>
                </div>
              </>
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

        <FormulLookupModal
          open={formulLookupOpen}
          onClose={() => setFormulLookupOpen(false)}
          onSelect={(f) => {
            setForm((prev) => ({ ...prev, ygkFormulKodu: f.kod, ygkFormulAdi: f.ad }))
            setFormulLookupOpen(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden relative">
      {openMenuRowId && (
        <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Menüyü kapat" onClick={() => setOpenMenuRowId(null)} />
      )}

      <ScreenHeader
        title="YGK BES 3.0 Parametre Tanımları"
        description="BES 3.0 için YGK parametre tanımları"
        right={(
          <>
            <OutlineButton disabled={selected.length === 0}>
              <LinkIcon className="w-4 h-4" /> Planla Eşleştir
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
        <table className="w-full grid-table text-sm min-w-[1600px]">
          <thead>
            <tr>
              <th className="w-10">
                <input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} />
              </th>
              {LIST_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}
              <th className="w-12 text-right">İşlemler</th>
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
                    {displayListCell(row, c.key)}
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
                  >
                    <MoreVertical className="w-5 h-5 mx-auto" />
                  </button>
                  {openMenuRowId === row.id && (
                    <div
                      className="absolute right-8 top-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1.5 text-left"
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
                        <LinkIcon className="w-4 h-4 mr-2 text-slate-400" /> İlişkili Planlar
                      </button>
                      <button
                        type="button"
                        onClick={() => openVersions(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <List className="w-4 h-4 mr-2 text-slate-400" /> Versiyonlar
                      </button>
                      <button
                        type="button"
                        onClick={() => openMuafiyet(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <List className="w-4 h-4 mr-2 text-slate-400" /> Muafiyet Parametreleri
                      </button>
                      {isKatkiPayiAraligi(row) && (
                        <button
                          type="button"
                          onClick={() => openKpAralik(row)}
                          className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <List className="w-4 h-4 mr-2 text-slate-400" /> Katkı Payı Aralık Tanımları
                        </button>
                      )}
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

      <div className="shrink-0 px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Sayfa başına</span>
          <select
            className="border border-slate-200 rounded-md px-2 py-1 text-sm bg-white"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span>Toplam {filtered.length} kayıt</span>
      </div>

      <Modal
        open={Boolean(inspectRow)}
        onClose={() => setInspectRow(null)}
        title={inspectRow ? `YGK BES 3.0 İncele — ${inspectRow.kod}` : 'YGK BES 3.0 İncele'}
        size="lg"
        footer={<PrimaryButton onClick={() => setInspectRow(null)}>Kapat</PrimaryButton>}
      >
        {inspectRow && (
          <div className="space-y-2 text-sm">
            <p><strong>YGK BES3.0 Kodu:</strong> {inspectRow.kod}</p>
            <p><strong>YGK BES3.0 Adı:</strong> {inspectRow.ad}</p>
            <p><strong>Versiyon:</strong> {inspectRow.versiyon}</p>
            <p><strong>Döviz Kodu:</strong> {inspectRow.doviz}</p>
            <p><strong>YGK Kesinti Tipi:</strong> {displayListCell(inspectRow, 'tip')}</p>
            <p><strong>Oran:</strong> {displayListCell(inspectRow, 'oran')}</p>
            <p><strong>Yıllık Tutar:</strong> {displayListCell(inspectRow, 'yillikTutar')}</p>
            <p><strong>YGK Formülü:</strong> {displayListCell(inspectRow, 'formul')}</p>
            <p><strong>Kesinti Dönemi:</strong> {displayListCell(inspectRow, 'donem')}</p>
            <p><strong>Sözleşme Yılı Aralığı:</strong> {inspectRow.yil || '—'}</p>
            <p><strong>Birikim:</strong> {displayListCell(inspectRow, 'birikim')}</p>
            <p><strong>Kesinti Zamanı:</strong> {displayListCell(inspectRow, 'kesintiZamani')}</p>
            <p><strong>Tahsilat YGK Kontrolü:</strong> {displayListCell(inspectRow, 'tahsilatYgkKontrolu')}</p>
            <p><strong>Max Kesinti Yap:</strong> {displayListCell(inspectRow, 'maxKesintiYap')}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(linkedRow)}
        onClose={() => setLinkedRow(null)}
        title={linkedRow ? `İlişkili Planlar — ${linkedRow.kod}` : 'İlişkili Planlar'}
        size="xl"
        footer={<PrimaryButton onClick={() => setLinkedRow(null)}>Kapat</PrimaryButton>}
      >
        {(LINKED_PLANS_BY_KOD[linkedRow?.kod] || []).length ? (
          <table className="w-full grid-table text-sm">
            <thead>
              <tr><th>Plan No</th><th>Plan Adı</th><th>Versiyon</th><th>Durum</th></tr>
            </thead>
            <tbody>
              {(LINKED_PLANS_BY_KOD[linkedRow?.kod] || []).map((p) => (
                <tr key={p.planNo}>
                  <td className="font-semibold">{p.planNo}</td>
                  <td>{p.planAdi}</td>
                  <td>{p.versiyon}</td>
                  <td>{p.durum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Bu parametre ile ilişkili plan bulunmuyor.</p>
        )}
      </Modal>

      <Modal
        open={versionsModal.open}
        onClose={() => setVersionsModal({ open: false, title: '', rows: [] })}
        title={versionsModal.title}
        footer={<PrimaryButton onClick={() => setVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {versionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {versionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Versiyon kaydı yok.</p>
        )}
      </Modal>

      <Modal
        open={Boolean(muafiyetParentRow)}
        onClose={closeMuafiyetModal}
        title={muafiyetParentRow ? `Muafiyet Parametreleri — ${muafiyetParentRow.kod}` : 'Muafiyet Parametreleri'}
        description={muafiyetParentRow?.ad}
        size="lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Ara..."
              value={muafSearch}
              onChange={(e) => setMuafSearch(e.target.value)}
            />
          </div>
          <PrimaryButton onClick={openMuafCreate}>
            <Plus className="w-4 h-4" /> Yeni Ekle
          </PrimaryButton>
        </div>
        <div className="overflow-auto border border-slate-200 rounded-lg relative">
          {openMuafMenuBandId && (
            <button
              type="button"
              className="fixed inset-0 z-[60] cursor-default"
              aria-label="Menüyü kapat"
              onClick={() => setOpenMuafMenuBandId(null)}
            />
          )}
          <table className="w-full grid-table text-sm">
            <thead>
              <tr>
                <th>Min. Tutar</th>
                <th>Max. Tutar</th>
                <th>Oran</th>
                <th>Tutar</th>
                <th className="text-center w-12">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredMuafBands.length ? (
                filteredMuafBands.map((b) => (
                  <tr key={b.id}>
                    <td>{b.minTutar}</td>
                    <td>{b.maxTutar}</td>
                    <td>{displayMuafOran(b.oran)}</td>
                    <td>{displayMuafTutar(b.tutar)}</td>
                    <td className="text-center relative">
                      <button
                        type="button"
                        className={`p-1.5 rounded-full ${openMuafMenuBandId === b.id ? 'bg-slate-200' : 'hover:bg-slate-100 text-slate-500'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMuafMenuBandId((prev) => (prev === b.id ? null : b.id))
                        }}
                        aria-label="Satır işlemleri"
                      >
                        <MoreVertical className="w-5 h-5 mx-auto" />
                      </button>
                      {openMuafMenuBandId === b.id && (
                        <div
                          className="absolute right-8 top-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 z-[70] py-1.5 text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openMuafInspect(b)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4 mr-2 text-slate-500" /> İncele
                          </button>
                          <button
                            type="button"
                            onClick={() => openMuafEdit(b)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Güncelle
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMuafBand(b)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Sil
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    {currentMuafBands.length ? 'Sonuç bulunamadı.' : 'Tanımlı muafiyet parametresi yok.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-slate-600">
          Listelenen: {filteredMuafBands.length} / {currentMuafBands.length}
        </div>
      </Modal>

      <Modal
        open={Boolean(muafInspectBand)}
        onClose={() => setMuafInspectBand(null)}
        title="Muafiyet Parametresi İncele"
        size="md"
        footer={<PrimaryButton onClick={() => setMuafInspectBand(null)}>Kapat</PrimaryButton>}
      >
        {muafInspectBand && (
          <div className="space-y-2 text-sm">
            <p><strong>Min. Tutar:</strong> {muafInspectBand.minTutar}</p>
            <p><strong>Max. Tutar:</strong> {muafInspectBand.maxTutar}</p>
            <p><strong>Oran:</strong> {displayMuafOran(muafInspectBand.oran)}</p>
            <p><strong>Tutar:</strong> {displayMuafTutar(muafInspectBand.tutar)}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={muafFormOpen}
        onClose={() => {
          setMuafFormOpen(false)
          setMuafForm(emptyMuafForm())
          setMuafEditId(null)
          setMuafFormMode('create')
        }}
        title={muafFormMode === 'create' ? 'Muafiyet Parametresi Ekle' : 'Muafiyet Parametresi Güncelle'}
        size="md"
        footer={(
          <>
            <OutlineButton
              onClick={() => {
                setMuafFormOpen(false)
                setMuafForm(emptyMuafForm())
                setMuafEditId(null)
                setMuafFormMode('create')
              }}
            >
              İptal
            </OutlineButton>
            <PrimaryButton onClick={saveMuafForm}>
              <Save className="w-4 h-4" /> Kaydet
            </PrimaryButton>
          </>
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Min. Tutar <span className="text-red-500">*</span>
            </label>
            <input
              className="form-input"
              placeholder="Örn: 1001"
              value={muafForm.minTutar}
              onChange={(e) => setMuafForm((f) => ({ ...f, minTutar: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Max. Tutar <span className="text-red-500">*</span>
            </label>
            <input
              className="form-input"
              placeholder="Örn: 2000"
              value={muafForm.maxTutar}
              onChange={(e) => setMuafForm((f) => ({ ...f, maxTutar: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Oran (%)</label>
            <input
              className="form-input"
              placeholder="Örn: 8"
              value={muafForm.oran}
              onChange={(e) => setMuafForm((f) => ({ ...f, oran: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tutar (TL)</label>
            <input
              className="form-input"
              placeholder="Boş bırakılabilir"
              value={muafForm.tutar}
              onChange={(e) => setMuafForm((f) => ({ ...f, tutar: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(kpAralikParentRow)}
        onClose={closeKpAralikModal}
        title={kpAralikParentRow ? `Katkı Payı Aralık Tanımları — ${kpAralikParentRow.kod}` : 'Katkı Payı Aralık Tanımları'}
        description={kpAralikParentRow?.ad}
        size="lg"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Ara..."
              value={kpAralikSearch}
              onChange={(e) => setKpAralikSearch(e.target.value)}
            />
          </div>
          <PrimaryButton onClick={openKpAralikCreate}>
            <Plus className="w-4 h-4" /> Yeni Ekle
          </PrimaryButton>
        </div>
        <div className="overflow-auto border border-slate-200 rounded-lg relative">
          {openKpAralikMenuBandId && (
            <button
              type="button"
              className="fixed inset-0 z-[60] cursor-default"
              aria-label="Menüyü kapat"
              onClick={() => setOpenKpAralikMenuBandId(null)}
            />
          )}
          <table className="w-full grid-table text-sm">
            <thead>
              <tr>
                <th>Min. KP</th>
                <th>Max. KP</th>
                <th>Oran</th>
                <th>Tutar</th>
                <th className="text-center w-12">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredKpAralikBands.length ? (
                filteredKpAralikBands.map((b) => (
                  <tr key={b.id}>
                    <td>{b.minKp}</td>
                    <td>{b.maxKp}</td>
                    <td>{displayMuafOran(b.oran)}</td>
                    <td>{displayMuafTutar(b.tutar)}</td>
                    <td className="text-center relative">
                      <button
                        type="button"
                        className={`p-1.5 rounded-full ${openKpAralikMenuBandId === b.id ? 'bg-slate-200' : 'hover:bg-slate-100 text-slate-500'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenKpAralikMenuBandId((prev) => (prev === b.id ? null : b.id))
                        }}
                        aria-label="Satır işlemleri"
                      >
                        <MoreVertical className="w-5 h-5 mx-auto" />
                      </button>
                      {openKpAralikMenuBandId === b.id && (
                        <div
                          className="absolute right-8 top-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 z-[70] py-1.5 text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openKpAralikInspect(b)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4 mr-2 text-slate-500" /> İncele
                          </button>
                          <button
                            type="button"
                            onClick={() => openKpAralikEdit(b)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Güncelle
                          </button>
                          <button
                            type="button"
                            onClick={() => removeKpAralikBand(b)}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Sil
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-slate-500 py-8">
                    {currentKpAralikBands.length ? 'Sonuç bulunamadı.' : 'Tanımlı katkı payı aralığı yok.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-slate-600">
          Listelenen: {filteredKpAralikBands.length} / {currentKpAralikBands.length}
        </div>
      </Modal>

      <Modal
        open={Boolean(kpAralikInspectBand)}
        onClose={() => setKpAralikInspectBand(null)}
        title="Katkı Payı Aralığı İncele"
        size="md"
        footer={<PrimaryButton onClick={() => setKpAralikInspectBand(null)}>Kapat</PrimaryButton>}
      >
        {kpAralikInspectBand && (
          <div className="space-y-2 text-sm">
            <p><strong>Min. KP:</strong> {kpAralikInspectBand.minKp}</p>
            <p><strong>Max. KP:</strong> {kpAralikInspectBand.maxKp}</p>
            <p><strong>Oran:</strong> {displayMuafOran(kpAralikInspectBand.oran)}</p>
            <p><strong>Tutar:</strong> {displayMuafTutar(kpAralikInspectBand.tutar)}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={kpAralikFormOpen}
        onClose={() => {
          setKpAralikFormOpen(false)
          setKpAralikForm(emptyKpAralikForm())
          setKpAralikEditId(null)
          setKpAralikFormMode('create')
        }}
        title={kpAralikFormMode === 'create' ? 'Katkı Payı Aralığı Ekle' : 'Katkı Payı Aralığı Güncelle'}
        size="md"
        footer={(
          <>
            <OutlineButton
              onClick={() => {
                setKpAralikFormOpen(false)
                setKpAralikForm(emptyKpAralikForm())
                setKpAralikEditId(null)
                setKpAralikFormMode('create')
              }}
            >
              İptal
            </OutlineButton>
            <PrimaryButton onClick={saveKpAralikForm}>
              <Save className="w-4 h-4" /> Kaydet
            </PrimaryButton>
          </>
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Aylık Min KP Tutarı <span className="text-red-500">*</span>
            </label>
            <input
              className="form-input"
              placeholder="Örn: 500"
              value={kpAralikForm.minKp}
              onChange={(e) => setKpAralikForm((f) => ({ ...f, minKp: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Aylık Max KP Tutarı <span className="text-red-500">*</span>
            </label>
            <input
              className="form-input"
              placeholder="Örn: 2500"
              value={kpAralikForm.maxKp}
              onChange={(e) => setKpAralikForm((f) => ({ ...f, maxKp: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Oran (%)</label>
            <input
              className="form-input"
              placeholder="Örn: 8"
              value={kpAralikForm.oran}
              onChange={(e) => setKpAralikForm((f) => ({ ...f, oran: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tutar (TL)</label>
            <input
              className="form-input"
              placeholder="Boş bırakılabilir"
              value={kpAralikForm.tutar}
              onChange={(e) => setKpAralikForm((f) => ({ ...f, tutar: e.target.value.replace(/[^0-9.,]/g, '') }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
