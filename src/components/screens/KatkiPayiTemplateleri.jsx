import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import {
  Plus, Search, Link as LinkIcon, ChevronDown, ChevronUp, MoreVertical, Edit2, Trash2, GitBranch, ArrowLeft, X, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { kptBaglantiMockPlans } from '../../data/mockData'
import {
  getKptTemplates,
  setKptTemplates,
  getKptImpact,
  getBagliPlanlar,
  isPlanBound,
  addRevision,
  setVersionHistory,
  getVersionHistory,
  subscribeKptStore,
  latestByTemplateCode,
  computeKptDiff,
  KPT_IMPACT_SAMPLE_THRESHOLD,
} from '../../data/kptSharedState'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const ODEME_PERIYOTLARI = ['Aylık', 'Üç Aylık', 'Altı Aylık', 'Yıllık']
const KP_HESAPLAMA_TURU_SECENEKLERI = ['Tefe', 'Tüfe', 'Sabit Oran', 'Artışsız']
const DOVIZ_KP_SECENEKLERI = ['TL', 'USD', 'EUR']
const GECERLILIK_SECENEKLERI = ['Aktif', 'Pasif']
const YUVARLAMA_AKTIF = (v) => v === 'Tavana' || v === 'Tabana'
const GUNLER = Array.from({ length: 31 }, (_, i) => String(i + 1))
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

function toOdemeArray(val) {
  if (Array.isArray(val)) return val
  return String(val || '').split(',').map((s) => s.trim()).filter(Boolean)
}

function displayOdeme(val) {
  const a = toOdemeArray(val)
  return a.length ? a.join(', ') : '—'
}

function displayDonemGunAy(gun, ay) {
  if (!gun && !ay) return '—'
  if (gun && ay) return `${gun} / ${ay}`
  return gun || ay || '—'
}

function displayYuvarlama(yuvarlama, deger) {
  if (!yuvarlama || yuvarlama === 'Yok') return 'Yok'
  if (deger) return `${yuvarlama} (${deger})`
  return yuvarlama
}

function SortHeader({ label, col, sortCol, sortOrder, onSort }) {
  const active = sortCol === col
  return (
    <th
      className="cursor-pointer select-none hover:bg-slate-100/80"
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : null}
      </span>
    </th>
  )
}

function FieldHint({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {hint && <p className="text-[11px] text-slate-500 mt-1 leading-snug">{hint}</p>}
    </label>
  )
}

const emptyForm = () => ({
  dovizKp: 'TL',
  odemePeriyodu: [],
  tumOdemePeriyotlari: 'Hayır',
  kpTemplateKodu: '',
  adi: '',
  versiyon: '1',
  katkiPayiTutari: '',
  katkiPayiTutariIges: '',
  azamiKp: '',
  gecerlilik: 'Aktif',
  baslangicKapitali: '',
  girisFonBuyuklugu: '',
  dovizDiger: 'TL',
  kpHesaplamaTuru: '',
  kpDonemGun: '',
  kpDonemAy: '',
  yuvarlama: 'Yok',
  yuvarlamaDegeri: '',
})

function itemToForm(item) {
  const arr = toOdemeArray(item.odemePeriyodu)
  const tumOdeme = ODEME_PERIYOTLARI.every((p) => arr.includes(p)) && arr.length === ODEME_PERIYOTLARI.length
  return {
    dovizKp: item.dovizKp || 'TL',
    odemePeriyodu: arr,
    tumOdemePeriyotlari: tumOdeme ? 'Evet' : 'Hayır',
    kpTemplateKodu: item.kpTemplateKodu || '',
    adi: item.adi || '',
    versiyon: String(item.versiyon || '1'),
    katkiPayiTutari: item.katkiPayiTutari || '',
    katkiPayiTutariIges: item.katkiPayiTutariIges || '',
    azamiKp: item.azamiKp || '',
    gecerlilik: item.gecerlilik || 'Aktif',
    baslangicKapitali: item.baslangicKapitali || '',
    girisFonBuyuklugu: item.girisFonBuyuklugu || '',
    dovizDiger: item.dovizDiger || 'TL',
    kpHesaplamaTuru: item.kpHesaplamaTuru || '',
    kpDonemGun: item.kpDonemGun || '',
    kpDonemAy: item.kpDonemAy || '',
    yuvarlama: item.yuvarlama || 'Yok',
    yuvarlamaDegeri: item.yuvarlamaDegeri || '',
  }
}

export default function KatkiPayiTemplateleri() {
  const [kptData, setKptData] = useState(() => getKptTemplates().map((r) => ({ ...r })))
  const [viewMode, setViewMode] = useState('list')
  const [currentEditId, setCurrentEditId] = useState(null)
  const [editMode, setEditMode] = useState('create')
  const [originalRow, setOriginalRow] = useState(null)
  const [kptForm, setKptForm] = useState(emptyForm)
  const [odemeDropdownOpen, setOdemeDropdownOpen] = useState(false)
  const odemeDropdownRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (odemeDropdownRef.current && !odemeDropdownRef.current.contains(e.target)) {
        setOdemeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const [selectedIds, setSelectedIds] = useState([])
  const [menuRowId, setMenuRowId] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [activeFilterKey, setActiveFilterKey] = useState('')
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false)
  const [filterDraft, setFilterDraft] = useState({ min: '', max: '', text: '', period: '' })
  const [appliedFilters, setAppliedFilters] = useState({})
  const [sortCol, setSortCol] = useState('kpTemplateKodu')
  const [sortOrder, setSortOrder] = useState('asc')
  const [uiError, setUiError] = useState('')
  const [uiSuccess, setUiSuccess] = useState('')
  const [linkedOpen, setLinkedOpen] = useState(false)
  const [linkedRow, setLinkedRow] = useState(null)
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [planModalError, setPlanModalError] = useState('')
  const [planSearch, setPlanSearch] = useState('')
  const [planRows, setPlanRows] = useState([])
  const [selectedPlanIds, setSelectedPlanIds] = useState([])
  const [impactConfirm, setImpactConfirm] = useState(null)
  const [versionConfirm, setVersionConfirm] = useState(null)
  const [redirectToGuncelleme, setRedirectToGuncelleme] = useState(null)
  const [reasonModal, setReasonModal] = useState(null)
  const [reasonText, setReasonText] = useState('')
  const [impactReportOpen, setImpactReportOpen] = useState(null)

  useEffect(() => subscribeKptStore(() => {
    setKptData(getKptTemplates().map((r) => ({ ...r })))
  }), [])

  const filteredLatest = useMemo(() => {
    const latest = latestByTemplateCode(kptData)
    const normalizeNum = (v) => Number(String(v || '0').replace(',', '.'))
    const inRange = (value, f) => {
      const n = normalizeNum(value)
      const minOk = !f?.min || n >= normalizeNum(f.min)
      const maxOk = !f?.max || n <= normalizeNum(f.max)
      return minOk && maxOk
    }
    return latest.filter((item) =>
      (!searchText || `${item.kpTemplateKodu} ${item.adi}`.toLowerCase().includes(searchText.toLowerCase())) &&
      (!appliedFilters.baslangicKapitali || inRange(item.baslangicKapitali, appliedFilters.baslangicKapitali)) &&
      (!appliedFilters.girisFonBuyuklugu || inRange(item.girisFonBuyuklugu, appliedFilters.girisFonBuyuklugu)) &&
      (!appliedFilters.katkiPayiTutari || inRange(item.katkiPayiTutari, appliedFilters.katkiPayiTutari)) &&
      (!appliedFilters.odemePeriyodu || displayOdeme(item.odemePeriyodu).includes(appliedFilters.odemePeriyodu.period)),
    ).sort((a, b) => {
      const va = String(a[sortCol] ?? '').toLowerCase()
      const vb = String(b[sortCol] ?? '').toLowerCase()
      if (va < vb) return sortOrder === 'asc' ? -1 : 1
      if (va > vb) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [kptData, searchText, appliedFilters, sortCol, sortOrder])

  const handleSort = (col) => {
    if (sortCol === col) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortOrder('asc') }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLatest.length && filteredLatest.length) setSelectedIds([])
    else setSelectedIds(filteredLatest.map((r) => r.id))
  }

  const toggleOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const openAdd = () => {
    setKptForm(emptyForm())
    setCurrentEditId(null)
    setEditMode('create')
    setOriginalRow(null)
    setUiError('')
    setViewMode('form')
  }

  const openEditForm = (row, mode) => {
    setKptForm(itemToForm(row))
    setCurrentEditId(row.id)
    setEditMode(mode)
    setOriginalRow(row)
    setUiError('')
    setOdemeDropdownOpen(false)
    setViewMode('form')
  }

  const openGuncelleme = (row) => {
    openEditForm(row, 'direct')
  }

  const openVersiyonGuncelleme = (row) => {
    const kod = row.kpTemplateKodu
    if (!isPlanBound(kod)) {
      setRedirectToGuncelleme(row)
      return
    }
    const impact = getKptImpact(kod)
    if (impact.teklifCount > 0 || impact.sozlesmeCount > 0) {
      setVersionConfirm(row)
      return
    }
    openEditForm(row, 'version')
  }

  const confirmVersionAndOpenForm = () => {
    if (!versionConfirm) return
    openEditForm(versionConfirm, 'version')
    setVersionConfirm(null)
  }

  const confirmRedirectGuncelleme = () => {
    if (!redirectToGuncelleme) return
    openEditForm(redirectToGuncelleme, 'direct')
    setRedirectToGuncelleme(null)
  }

  const buildPayloadFromForm = () => {
    const odemePeriyodu = kptForm.odemePeriyodu
    const today = new Date().toLocaleDateString('tr-TR')
    const prev = currentEditId ? kptData.find((a) => a.id === currentEditId) : null
    let versiyon = '1'
    if (editMode === 'version' && originalRow) {
      versiyon = String(Number(originalRow.versiyon || 1) + 1)
    } else if (currentEditId && prev) {
      versiyon = String(prev.versiyon || '1')
    } else if (!currentEditId) {
      versiyon = String(
        Math.max(0, ...kptData.filter((a) => a.kpTemplateKodu.toLowerCase() === kptForm.kpTemplateKodu.trim().toLowerCase()).map((a) => Number(a.versiyon || 0))) + 1,
      )
    }
    return {
      kpTemplateKodu: kptForm.kpTemplateKodu.trim(),
      adi: kptForm.adi.trim(),
      versiyon,
      katkiPayiTutari: kptForm.katkiPayiTutari,
      katkiPayiTutariIges: kptForm.katkiPayiTutariIges,
      azamiKp: kptForm.azamiKp,
      gecerlilik: currentEditId ? kptForm.gecerlilik : 'Aktif',
      baslangicKapitali: kptForm.baslangicKapitali,
      girisFonBuyuklugu: kptForm.girisFonBuyuklugu,
      dovizKp: kptForm.dovizKp,
      odemePeriyodu,
      dovizDiger: kptForm.dovizDiger,
      kpHesaplamaTuru: kptForm.kpHesaplamaTuru,
      kpDonemGun: kptForm.kpDonemGun,
      kpDonemAy: kptForm.kpDonemAy,
      yuvarlama: kptForm.yuvarlama,
      yuvarlamaDegeri: kptForm.yuvarlamaDegeri,
      aktif: true,
      olusturan: prev?.olusturan || 'uaktas',
      olusturulmaTarihi: editMode === 'version' ? today : (prev?.olusturulmaTarihi || today),
      guncelleyen: 'uaktas',
      guncellemeTarihi: today,
    }
  }

  const validateForm = () => {
    if (!kptForm.kpTemplateKodu?.trim() || !kptForm.adi?.trim() || !kptForm.katkiPayiTutari?.trim()) {
      setUiError('KP Template Kodu, KP Template Adı ve Katkı Payı Tutarı alanları zorunludur.')
      return false
    }
    if (!kptForm.odemePeriyodu || kptForm.odemePeriyodu.length === 0) {
      setUiError('Ödeme Periyodu alanından en az bir seçim yapmalısınız.')
      return false
    }
    if (YUVARLAMA_AKTIF(kptForm.yuvarlama) && !String(kptForm.yuvarlamaDegeri || '').trim()) {
      setUiError('Yuvarlama Tavana veya Tabana seçildiğinde Yuvarlama Değeri zorunludur.')
      return false
    }
    const codeExists = kptData.some(
      (a) => a.kpTemplateKodu.toLowerCase() === kptForm.kpTemplateKodu.trim().toLowerCase()
        && a.id !== currentEditId
        && editMode !== 'version',
    )
    if (codeExists && editMode === 'create') {
      setUiError('Eklenmek istenen KP Template Kodu sistemde mevcuttur. Güncelleme için satır menüsünü kullanın.')
      return false
    }
    return true
  }

  const finalizeSave = (payload, reason) => {
    const kod = payload.kpTemplateKodu
    const impact = getKptImpact(kod)

    if (editMode === 'version' && originalRow) {
      const newId = Date.now()
      const archived = { ...originalRow, aktif: false, gecerlilik: 'Pasif' }
      const newRow = { ...originalRow, ...payload, id: newId, revisionNo: 0, aktif: true }
      const next = kptData.map((a) => (a.id === originalRow.id ? archived : a)).concat(newRow)
      setKptData(next)
      setKptTemplates(next)

      const history = [...getVersionHistory(kod)]
      const histIdx = history.findIndex((h) => String(h.versiyon) === String(originalRow.versiyon))
      if (histIdx >= 0) history[histIdx] = { ...history[histIdx], aktif: false }
      history.push({
        id: newId,
        versiyon: newRow.versiyon,
        olusturulmaTarihi: newRow.olusturulmaTarihi,
        aktif: true,
        katkiPayiTutari: newRow.katkiPayiTutari,
        adi: newRow.adi,
      })
      setVersionHistory(kod, history)
      setUiSuccess(`Yeni versiyon oluşturuldu (v${newRow.versiyon}).`)
    } else if (currentEditId && originalRow) {
      const prevRevision = Number(originalRow.revisionNo || 0)
      const nextRevision = prevRevision + 1
      const updated = { ...originalRow, ...payload, revisionNo: nextRevision }
      const next = kptData.map((a) => (a.id === currentEditId ? updated : a))
      setKptData(next)
      setKptTemplates(next)

      addRevision(kod, {
        revisionId: `rev-${kod}-${nextRevision}-${Date.now()}`,
        templateId: updated.id,
        templateKodu: kod,
        revisionNo: nextRevision,
        versionNo: String(updated.versiyon),
        changeType: 'GUNCELLEME',
        reason,
        changedBy: 'uaktas',
        changedAt: updated.guncellemeTarihi,
        diff: computeKptDiff(originalRow, updated),
        impact: { ...impact, impactReportId: impact.teklifCount + impact.sozlesmeCount > KPT_IMPACT_SAMPLE_THRESHOLD ? `RPT-${Date.now()}` : null },
      })
      setUiSuccess(`Güncelleme kaydedildi (rev. ${nextRevision}).`)
    } else {
      const newRow = { id: Date.now(), ...payload, revisionNo: 0 }
      const next = [...kptData, newRow]
      setKptData(next)
      setKptTemplates(next)
      setVersionHistory(kod, [{
        id: newRow.id,
        versiyon: newRow.versiyon,
        olusturulmaTarihi: newRow.olusturulmaTarihi,
        aktif: true,
        katkiPayiTutari: newRow.katkiPayiTutari,
        adi: newRow.adi,
      }])
      setUiSuccess('Kayıt tamamlandı.')
    }

    setTimeout(() => setUiSuccess(''), 3500)
    setViewMode('list')
    setCurrentEditId(null)
    setEditMode('create')
    setOriginalRow(null)
    setReasonText('')
    setReasonModal(null)
  }

  const saveForm = () => {
    setUiError('')
    if (!validateForm()) return

    if (editMode === 'create') {
      finalizeSave(buildPayloadFromForm(), 'Yeni kayıt')
      return
    }

    const kod = kptForm.kpTemplateKodu.trim()
    const impact = getKptImpact(kod)
    const needsConfirm = editMode === 'direct' && (impact.teklifCount > 0 || impact.sozlesmeCount > 0)
    const needsReason = editMode === 'direct' || editMode === 'version'

    if (needsConfirm && !impactConfirm) {
      setImpactConfirm({ kod, impact, payload: buildPayloadFromForm() })
      return
    }

    if (needsReason) {
      setReasonModal({ mode: editMode, payload: buildPayloadFromForm() })
      return
    }

    finalizeSave(buildPayloadFromForm(), 'Güncelleme')
  }

  const confirmImpactAndContinue = () => {
    if (!impactConfirm) return
    setImpactConfirm(null)
    setReasonModal({ mode: 'direct', payload: impactConfirm.payload })
  }

  const submitReasonAndSave = () => {
    if (!reasonText.trim()) {
      setUiError('Güncelleme gerekçesi zorunludur.')
      return
    }
    if (!reasonModal?.payload) return
    setUiError('')
    finalizeSave(reasonModal.payload, reasonText.trim())
  }

  const deleteByTemplateKodu = (kod) => {
    setKptData((prev) => {
      const removed = new Set(prev.filter((i) => i.kpTemplateKodu === kod).map((i) => i.id))
      setSelectedIds((sids) => sids.filter((id) => !removed.has(id)))
      return prev.filter((item) => item.kpTemplateKodu !== kod)
    })
  }

  const openLinked = (row) => {
    setLinkedRow(row)
    setLinkedOpen(true)
    setMenuRowId(null)
  }

  const resetPlanModal = useCallback(() => {
    setPlanRows(kptBaglantiMockPlans.map((p) => ({ ...p })))
    setSelectedPlanIds([])
    setPlanSearch('')
    setPlanModalError('')
  }, [])

  const openPlanModal = () => {
    resetPlanModal()
    setPlanModalOpen(true)
  }

  const savePlanModal = () => {
    const selectedPlans = planRows.filter((p) => selectedPlanIds.includes(p.id))
    const hasIges = selectedPlans.some((p) => /İGES|IGES/i.test(p.ad || ''))
    if (hasIges) {
      const templates = kptData.filter((t) => selectedIds.includes(t.id))
      const missing = templates.some((t) => !String(t.katkiPayiTutariIges || '').trim())
      if (missing) {
        setPlanModalError('İGES içeren plan seçildiğinde Katkı Payı Tutarı (İGES) alanı boş olamaz (liste üzerinde şablon seçili olmalı).')
        return
      }
    }
    if (selectedPlanIds.length === 0) {
      setPlanModalError('En az bir plan seçmelisiniz.')
      return
    }
    setPlanModalError('')
    setPlanModalOpen(false)
    setUiSuccess('Planlara atama tamamlandı.')
    setTimeout(() => setUiSuccess(''), 4000)
  }

  const dovizDigerEnabled = Number(String(kptForm.baslangicKapitali || '0').replace(',', '.')) > 0
  const selectedTemplateRows = filteredLatest.filter((r) => selectedIds.includes(r.id))
  const filteredPlanRows = planRows.filter((p) => (`${p.id} ${p.ad}`).toLowerCase().includes(planSearch.toLowerCase()))
  const filterOptions = [
    { key: 'baslangicKapitali', label: 'Başlangıç Kapitali', type: 'range' },
    { key: 'girisFonBuyuklugu', label: 'Giriş Fon Büyüklüğü', type: 'range' },
    { key: 'katkiPayiTutari', label: 'Katkı Payı Tutarı', type: 'range' },
    { key: 'odemePeriyodu', label: 'Ödeme Periyodu', type: 'period' },
  ]
  const activeFilterMeta = filterOptions.find((f) => f.key === activeFilterKey)
  const activeFilterLabel = activeFilterMeta?.label || ''

  const openFilter = (key) => {
    setActiveFilterKey(key)
    const existing = appliedFilters[key] || {}
    setFilterDraft({
      min: existing.min || '',
      max: existing.max || '',
      text: existing.text || '',
      period: existing.period || '',
    })
    setFilterMenuOpen(false)
    setFilterPopoverOpen(true)
  }

  const applyFilter = () => {
    if (!activeFilterKey) return
    const meta = filterOptions.find((f) => f.key === activeFilterKey)
    if (!meta) return
    const isEmpty = meta.type === 'range'
      ? (!filterDraft.min && !filterDraft.max)
      : (!filterDraft.period)
    if (isEmpty) {
      setAppliedFilters((prev) => {
        const { [activeFilterKey]: _, ...rest } = prev
        return rest
      })
      setFilterPopoverOpen(false)
      return
    }
    setAppliedFilters((prev) => ({
      ...prev,
      [activeFilterKey]: meta.type === 'range'
        ? { min: filterDraft.min, max: filterDraft.max }
        : { period: filterDraft.period },
    }))
    setFilterPopoverOpen(false)
  }

  const clearActiveFilter = () => {
    if (!activeFilterKey) return
    setAppliedFilters((prev) => {
      const { [activeFilterKey]: _, ...rest } = prev
      return rest
    })
    setFilterDraft({ min: '', max: '', text: '', period: '' })
    setActiveFilterKey('')
    setFilterPopoverOpen(false)
  }

  const listHeaderRight = viewMode === 'list' ? (
    <>
      <OutlineButton disabled={selectedIds.length === 0} onClick={openPlanModal}>
        <LinkIcon className="w-4 h-4" /> Planlara Bağla
        {selectedIds.length > 0 && (
          <span className="ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-blue-600 text-white text-[10px] rounded-full">{selectedIds.length}</span>
        )}
      </OutlineButton>
      <PrimaryButton onClick={openAdd}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
    </>
  ) : null

  if (viewMode === 'form') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden relative">
        {(uiError || uiSuccess) && (
          <div className={`shrink-0 px-4 py-2 flex items-center justify-between text-sm ${uiError ? 'bg-red-50 text-red-800 border-b border-red-100' : 'bg-green-50 text-green-800 border-b border-green-100'}`}>
            <span className="flex items-center gap-2 font-medium">
              {uiError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {uiError || uiSuccess}
            </span>
            <button type="button" className="p-1 rounded hover:bg-black/5" onClick={() => { setUiError(''); setUiSuccess('') }}><X className="w-4 h-4" /></button>
          </div>
        )}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <OutlineButton onClick={() => { setViewMode('list'); setUiError('') }}>
              <ArrowLeft className="w-4 h-4" /> Listeye Dön
            </OutlineButton>
            <h2 className="text-lg font-bold text-slate-800">
              {editMode === 'version'
                ? `Versiyon ile Güncelle (v${originalRow ? Number(originalRow.versiyon || 1) + 1 : '?'})`
                : currentEditId
                  ? 'KP Template Güncelle (Revizyon)'
                  : 'Yeni KP Template Ekle'}
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
            <FieldHint required label="KP Template Kodu">
              <input type="text" className="form-input" value={kptForm.kpTemplateKodu} onChange={(e) => setKptForm({ ...kptForm, kpTemplateKodu: e.target.value })} />
            </FieldHint>
            <FieldHint required label="KP Template Adı">
              <input type="text" className="form-input" value={kptForm.adi} onChange={(e) => setKptForm({ ...kptForm, adi: e.target.value })} />
            </FieldHint>
            <FieldHint label="Versiyon">
              <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" disabled readOnly value={
                editMode === 'version' && originalRow
                  ? String(Number(originalRow.versiyon || 1) + 1)
                  : (kptForm.versiyon || '1')
              } />
            </FieldHint>
            {currentEditId && editMode === 'direct' && (
              <FieldHint label="Revizyon No">
                <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" disabled readOnly value={String(Number(originalRow?.revisionNo || 0) + 1)} />
              </FieldHint>
            )}

            <FieldHint required label="Döviz Türü KP">
              <select className="form-input" value={kptForm.dovizKp} onChange={(e) => setKptForm({ ...kptForm, dovizKp: e.target.value })}>
                {DOVIZ_KP_SECENEKLERI.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FieldHint>
            <FieldHint label="KP Hesaplama Türü">
              <select
                className="form-input"
                value={kptForm.kpHesaplamaTuru}
                onChange={(e) => setKptForm({ ...kptForm, kpHesaplamaTuru: e.target.value, kpDonemGun: '', kpDonemAy: '' })}
              >
                <option value="">Seçiniz...</option>
                {KP_HESAPLAMA_TURU_SECENEKLERI.map((kp) => (
                  <option key={kp} value={kp}>{kp}</option>
                ))}
              </select>
            </FieldHint>
            <FieldHint required label="Tüm Ödeme Periyotları">
              <select
                className="form-input"
                value={kptForm.tumOdemePeriyotlari}
                onChange={(e) => {
                  const val = e.target.value
                  setKptForm({
                    ...kptForm,
                    tumOdemePeriyotlari: val,
                    odemePeriyodu: val === 'Evet' ? [...ODEME_PERIYOTLARI] : kptForm.odemePeriyodu,
                  })
                }}
              >
                <option value="Evet">Evet</option>
                <option value="Hayır">Hayır</option>
              </select>
            </FieldHint>

            <FieldHint required label="Ödeme Periyodu">
              <div className="relative" ref={odemeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setOdemeDropdownOpen((v) => !v)}
                  className="form-input min-h-[42px] h-auto w-full flex items-center justify-between gap-2"
                >
                  <div className="flex flex-wrap gap-1.5 text-left flex-1">
                    {kptForm.odemePeriyodu?.length > 0 ? (
                      kptForm.odemePeriyodu.map((item) => (
                        <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                          {item}
                          {kptForm.tumOdemePeriyotlari !== 'Evet' && (
                            <button
                              type="button"
                              className="text-slate-400 hover:text-slate-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                const next = kptForm.odemePeriyodu.filter((p) => p !== item)
                                setKptForm({
                                  ...kptForm,
                                  odemePeriyodu: next,
                                  tumOdemePeriyotlari: next.length === ODEME_PERIYOTLARI.length ? 'Evet' : 'Hayır',
                                })
                              }}
                              aria-label={`${item} kaldır`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Seçiniz</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ${odemeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {odemeDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg p-2 space-y-1 max-h-52 overflow-auto">
                    {ODEME_PERIYOTLARI.map((period) => (
                      <label key={period} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={kptForm.odemePeriyodu.includes(period)}
                          onChange={() => {
                            const on = kptForm.odemePeriyodu.includes(period)
                            const next = on ? kptForm.odemePeriyodu.filter((p) => p !== period) : [...kptForm.odemePeriyodu, period]
                            setKptForm({
                              ...kptForm,
                              odemePeriyodu: next,
                              tumOdemePeriyotlari: next.length === ODEME_PERIYOTLARI.length ? 'Evet' : 'Hayır',
                            })
                          }}
                        />
                        <span>{period}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </FieldHint>
            <FieldHint label="Dönem Gün/Ay">
              <div className="flex items-center gap-2">
                <select
                  className={`form-input flex-1 ${!kptForm.kpHesaplamaTuru ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                  disabled={!kptForm.kpHesaplamaTuru}
                  value={kptForm.kpDonemGun}
                  onChange={(e) => setKptForm({ ...kptForm, kpDonemGun: e.target.value })}
                >
                  <option value="">Gün</option>
                  {GUNLER.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className="text-slate-400 shrink-0">/</span>
                <select
                  className={`form-input flex-1 ${!kptForm.kpHesaplamaTuru ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                  disabled={!kptForm.kpHesaplamaTuru}
                  value={kptForm.kpDonemAy}
                  onChange={(e) => setKptForm({ ...kptForm, kpDonemAy: e.target.value })}
                >
                  <option value="">Ay</option>
                  {AYLAR.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </FieldHint>
            <div>
              <FieldHint label="Yuvarlama">
                <select
                  className="form-input"
                  value={kptForm.yuvarlama}
                  onChange={(e) => setKptForm({
                    ...kptForm,
                    yuvarlama: e.target.value,
                    yuvarlamaDegeri: YUVARLAMA_AKTIF(e.target.value) ? kptForm.yuvarlamaDegeri : '',
                  })}
                >
                  <option value="Yok">Yok</option>
                  <option value="Tavana">Tavana</option>
                  <option value="Tabana">Tabana</option>
                </select>
              </FieldHint>
              {YUVARLAMA_AKTIF(kptForm.yuvarlama) && (
                <FieldHint label="Yuvarlama Değeri" required>
                  <input
                    type="text"
                    className="form-input mt-3"
                    value={kptForm.yuvarlamaDegeri}
                    onChange={(e) => setKptForm({ ...kptForm, yuvarlamaDegeri: e.target.value.replace(/[^0-9.,]/g, '') })}
                  />
                </FieldHint>
              )}
            </div>

            <FieldHint required label="Katkı Payı Tutarı">
              <input type="text" className="form-input" value={kptForm.katkiPayiTutari} onChange={(e) => setKptForm({ ...kptForm, katkiPayiTutari: e.target.value.replace(/[^0-9.,]/g, '') })} />
            </FieldHint>
            <FieldHint label="Katkı Payı Tutarı (İGES)">
              <input type="text" className="form-input" value={kptForm.katkiPayiTutariIges} onChange={(e) => setKptForm({ ...kptForm, katkiPayiTutariIges: e.target.value.replace(/[^0-9.,]/g, '') })} />
            </FieldHint>
            <FieldHint label="Azami KP Tutarı">
              <input type="text" className="form-input" value={kptForm.azamiKp} onChange={(e) => setKptForm({ ...kptForm, azamiKp: e.target.value.replace(/[^0-9.,]/g, '') })} />
            </FieldHint>

            <FieldHint label="Başlangıç Kapitali">
              <input type="text" className="form-input" value={kptForm.baslangicKapitali} onChange={(e) => setKptForm({ ...kptForm, baslangicKapitali: e.target.value.replace(/[^0-9.,]/g, '') })} />
            </FieldHint>
            <FieldHint label="Giriş Fon Büyüklüğü">
              <input type="text" className="form-input" value={kptForm.girisFonBuyuklugu} onChange={(e) => setKptForm({ ...kptForm, girisFonBuyuklugu: e.target.value.replace(/[^0-9.,]/g, '') })} />
            </FieldHint>
            <FieldHint label="Döviz Türü">
              <select
                className={`form-input ${!dovizDigerEnabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                value={kptForm.dovizDiger}
                disabled={!dovizDigerEnabled}
                onChange={(e) => setKptForm({ ...kptForm, dovizDiger: e.target.value })}
              >
                {DOVIZ_KP_SECENEKLERI.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FieldHint>

          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2">
          <OutlineButton onClick={() => { setViewMode('list'); setUiError('') }}>İptal</OutlineButton>
          <OutlineButton
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => { setKptForm(emptyForm()); setUiError(''); setOdemeDropdownOpen(false) }}
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
      {menuRowId && <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="close menu" onClick={() => setMenuRowId(null)} />}
      {(uiError || uiSuccess) && (
        <div className={`shrink-0 px-4 py-2 flex items-center justify-between text-sm z-20 ${uiError ? 'bg-red-50 text-red-800 border-b border-red-100' : 'bg-green-50 text-green-800 border-b border-green-100'}`}>
          <span className="flex items-center gap-2 font-medium">
            {uiError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {uiError || uiSuccess}
          </span>
          <button type="button" className="p-1 rounded hover:bg-black/5" onClick={() => { setUiError(''); setUiSuccess('') }}><X className="w-4 h-4" /></button>
        </div>
      )}

      <ScreenHeader
        title="Katkı Payı Templateleri"
        description="KP template tanımlarının listelendiği, filtrelenip sıralandığı ekrandır."
        right={listHeaderRight}
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2 relative">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm bg-white"
              placeholder="Ara..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              type="button"
              className="h-9 px-3 rounded-md border border-violet-200 bg-violet-50 text-violet-700 text-xs font-semibold inline-flex items-center gap-1"
              onClick={() => setFilterMenuOpen((v) => !v)}
            >
              Filtre Ekle <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {filterMenuOpen && (
              <div className="absolute z-30 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1">
                {filterOptions.map((f) => (
                  <button key={f.key} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50" onClick={() => openFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {activeFilterKey && (
            <div className="relative">
              <div className="h-9 px-3 rounded-md border border-slate-300 bg-white text-xs inline-flex items-center gap-2">
                <button type="button" onClick={() => openFilter(activeFilterKey)}>{activeFilterLabel}</button>
                <button type="button" className="text-slate-500" onClick={clearActiveFilter}>×</button>
              </div>
              {filterPopoverOpen && (
                <div className="absolute z-30 mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-lg p-3">
                {activeFilterMeta?.type === 'range' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input className="form-input" placeholder="Min. (TL)" value={filterDraft.min} onChange={(e) => setFilterDraft((d) => ({ ...d, min: e.target.value.replace(/[^0-9.,]/g, '') }))} />
                      <input className="form-input" placeholder="Max. (TL)" value={filterDraft.max} onChange={(e) => setFilterDraft((d) => ({ ...d, max: e.target.value.replace(/[^0-9.,]/g, '') }))} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" className="text-xs text-slate-500" onClick={clearActiveFilter}>Temizle</button>
                      <button type="button" className="text-xs px-3 py-1 rounded bg-violet-100 text-violet-700 font-medium" onClick={applyFilter}>Uygula</button>
                    </div>
                  </>
                ) : (
                  <>
                    <select className="form-input mb-3" value={filterDraft.period} onChange={(e) => setFilterDraft((d) => ({ ...d, period: e.target.value }))}>
                      <option value="">Ödeme periyodu seçin</option>
                      {ODEME_PERIYOTLARI.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="flex justify-end gap-2">
                      <button type="button" className="text-xs text-slate-500" onClick={clearActiveFilter}>Temizle</button>
                      <button type="button" className="text-xs px-3 py-1 rounded bg-violet-100 text-violet-700 font-medium" onClick={applyFilter}>Uygula</button>
                    </div>
                  </>
                )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-12 text-center border-r border-slate-100">
                <input type="checkbox" className="rounded" checked={selectedIds.length === filteredLatest.length && filteredLatest.length > 0} onChange={toggleSelectAll} />
              </th>
              <SortHeader label="KP Template Kodu" col="kpTemplateKodu" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Adı" col="adi" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Versiyon" col="versiyon" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Revizyon No" col="revisionNo" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Katkı Payı Tutarı" col="katkiPayiTutari" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Katkı Payı Tutarı (İGES)" col="katkiPayiTutariIges" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Geçerlilik" col="gecerlilik" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Başlangıç Kapitali" col="baslangicKapitali" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Giriş Fon Büyüklüğü" col="girisFonBuyuklugu" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Döviz Türü(KP)" col="dovizKp" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="KP Hesaplama Türü" col="kpHesaplamaTuru" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Dönem Gün/Ay" col="kpDonemGun" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Ödeme Periyodu" col="odemePeriyodu" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Yuvarlama" col="yuvarlama" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Azami KP" col="azamiKp" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Döviz Türü(Diğer)" col="dovizDiger" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Oluşturan" col="olusturan" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Oluşturulma Tarihi" col="olusturulmaTarihi" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Güncelleyen" col="guncelleyen" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <SortHeader label="Güncelleme Tarihi" col="guncellemeTarihi" sortCol={sortCol} sortOrder={sortOrder} onSort={handleSort} />
              <th className="text-center w-24">Liste İşlemleri</th>
            </tr>
          </thead>
          <tbody>
            {filteredLatest.map((row) => (
              <tr key={row.id}>
                <td className="text-center border-r border-slate-100">
                  <input type="checkbox" className="rounded" checked={selectedIds.includes(row.id)} onChange={() => toggleOne(row.id)} />
                </td>
                <td className="font-semibold text-slate-800">{row.kpTemplateKodu}</td>
                <td>{row.adi}</td>
                <td>{row.versiyon}</td>
                <td>{row.revisionNo ?? 0}</td>
                <td>{row.katkiPayiTutari}</td>
                <td>{row.katkiPayiTutariIges || '—'}</td>
                <td>{row.gecerlilik}</td>
                <td>{row.baslangicKapitali}</td>
                <td>{row.girisFonBuyuklugu}</td>
                <td>{row.dovizKp}</td>
                <td>{row.kpHesaplamaTuru || '—'}</td>
                <td>{displayDonemGunAy(row.kpDonemGun, row.kpDonemAy)}</td>
                <td className="max-w-[200px]">{displayOdeme(row.odemePeriyodu)}</td>
                <td>{displayYuvarlama(row.yuvarlama, row.yuvarlamaDegeri)}</td>
                <td>{row.azamiKp}</td>
                <td>{row.dovizDiger || '—'}</td>
                <td>{row.olusturan}</td>
                <td>{row.olusturulmaTarihi}</td>
                <td>{row.guncelleyen || '—'}</td>
                <td>{row.guncellemeTarihi || '—'}</td>
                <td className="text-center relative">
                  <button
                    type="button"
                    onClick={() => setMenuRowId(menuRowId === row.id ? null : row.id)}
                    className={`p-1.5 rounded-full ${menuRowId === row.id ? 'bg-slate-200' : 'hover:bg-slate-100 text-slate-500'}`}
                  >
                    <MoreVertical className="w-5 h-5 mx-auto" />
                  </button>
                  {menuRowId === row.id && (
                    <div className="absolute right-8 top-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1.5 text-left">
                      <button type="button" onClick={() => { openGuncelleme(row); setMenuRowId(null) }} className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Güncelle
                      </button>
                      <button type="button" onClick={() => { openVersiyonGuncelleme(row); setMenuRowId(null) }} className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <GitBranch className="w-4 h-4 mr-2 text-violet-600" /> Versiyon ile Güncelle
                      </button>
                      <button
                        type="button"
                        onClick={() => { deleteByTemplateKodu(row.kpTemplateKodu); setMenuRowId(null) }}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Sil
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button type="button" onClick={() => openLinked(row)} className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <LinkIcon className="w-4 h-4 mr-2 text-slate-400" /> Bağlı Planlar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredLatest.length === 0 && (
              <tr><td colSpan={22} className="text-center py-12 text-slate-400">Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!impactConfirm}
        onClose={() => setImpactConfirm(null)}
        title="Güncelleme Onayı"
        footer={(
          <>
            <OutlineButton onClick={() => setImpactConfirm(null)}>Hayır</OutlineButton>
            <PrimaryButton onClick={confirmImpactAndContinue}>Evet, devam et</PrimaryButton>
          </>
        )}
      >
        {impactConfirm && (() => {
          const { impact, kod } = impactConfirm
          const total = impact.teklifCount + impact.sozlesmeCount
          const showSamples = total <= KPT_IMPACT_SAMPLE_THRESHOLD
          return (
            <div className="space-y-3 text-sm">
              <p>
                Bu template <strong>{impact.planCount}</strong> plana bağlıdır.{' '}
                <strong>{impact.teklifCount}</strong> teklif, <strong>{impact.sozlesmeCount}</strong> sözleşme oluşmuştur.
                Güncellemeye devam edilsin mi?
              </p>
              {showSamples && total > 0 && (
                <div className="bg-slate-50 rounded-md p-3 text-xs space-y-2">
                  {impact.teklifler?.length > 0 && (
                    <div><span className="font-semibold">Teklifler:</span> {impact.teklifler.join(', ')}</div>
                  )}
                  {impact.sozlesmeler?.length > 0 && (
                    <div><span className="font-semibold">Sözleşmeler:</span> {impact.sozlesmeler.join(', ')}</div>
                  )}
                </div>
              )}
              {!showSamples && total > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-xs">
                  <p className="mb-2">{total} kayıt — detay listesi oluşturuldu.</p>
                  <button type="button" className="text-amber-800 font-medium underline" onClick={() => setImpactReportOpen({ kod, impact, reportId: `RPT-${kod}` })}>
                    Listeyi görüntüle
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                Plan kaydı değişmez. Yeni teklif ve sözleşmeler güncel template tanımından üretilir. Mevcut teklif/sözleşmeler etkilenmez.
              </p>
            </div>
          )
        })()}
      </Modal>

      <Modal
        open={!!versionConfirm}
        onClose={() => setVersionConfirm(null)}
        title="Yeni Versiyon Oluştur"
        footer={(
          <>
            <OutlineButton onClick={() => setVersionConfirm(null)}>Hayır</OutlineButton>
            <PrimaryButton onClick={confirmVersionAndOpenForm}>Evet, onaylıyorum</PrimaryButton>
          </>
        )}
      >
        <p className="text-sm text-slate-700">
          Yeni versiyon oluşturulacaktır. Mevcut teklif ve sözleşmeler oluşturuldukları versiyonda kalacaktır.
          Yeni üretimler son versiyondan yapılacaktır. Onaylıyor musunuz?
        </p>
      </Modal>

      <Modal
        open={!!redirectToGuncelleme}
        onClose={() => setRedirectToGuncelleme(null)}
        title="Versiyon Oluşturulamaz"
        footer={(
          <>
            <OutlineButton onClick={() => setRedirectToGuncelleme(null)}>İptal</OutlineButton>
            <PrimaryButton onClick={confirmRedirectGuncelleme}>Güncellemeye devam et</PrimaryButton>
          </>
        )}
      >
        <p className="text-sm text-slate-700">
          Bu template plana bağlı değildir. Versiyon oluşturulmadan güncelleme yapılacaktır.
        </p>
      </Modal>

      <Modal
        open={!!reasonModal}
        onClose={() => { setReasonModal(null); setReasonText('') }}
        title={reasonModal?.mode === 'version' ? 'Versiyon Gerekçesi' : 'Güncelleme Gerekçesi'}
        footer={(
          <>
            <OutlineButton onClick={() => { setReasonModal(null); setReasonText('') }}>İptal</OutlineButton>
            <PrimaryButton onClick={submitReasonAndSave}>Kaydet</PrimaryButton>
          </>
        )}
      >
        <label className="block">
          <span className="block text-sm font-semibold text-slate-700 mb-2">Gerekçe <span className="text-red-500">*</span></span>
          <textarea
            className="form-input min-h-[100px]"
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="Değişiklik gerekçesini giriniz..."
          />
        </label>
      </Modal>

      <Modal
        open={!!impactReportOpen}
        onClose={() => setImpactReportOpen(null)}
        title="Etki Raporu"
        size="lg"
        footer={<PrimaryButton onClick={() => setImpactReportOpen(null)}>Kapat</PrimaryButton>}
      >
        {impactReportOpen && (
          <div className="text-sm space-y-3">
            <p className="text-slate-600">Rapor ID: <span className="font-mono font-medium">{impactReportOpen.reportId}</span></p>
            <table className="w-full grid-table text-xs">
              <thead>
                <tr><th>Teklif / Sözleşme</th><th>Plan</th><th>Statü</th></tr>
              </thead>
              <tbody>
                {(impactReportOpen.impact.teklifler || []).map((t) => (
                  <tr key={t}><td>{t}</td><td>—</td><td>Bilgi</td></tr>
                ))}
                {(impactReportOpen.impact.sozlesmeler || []).map((s) => (
                  <tr key={s}><td>{s}</td><td>—</td><td>Bilgi</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        open={linkedOpen}
        onClose={() => setLinkedOpen(false)}
        title={linkedRow ? `Bağlı Planlar — ${linkedRow.kpTemplateKodu}` : 'Bağlı Planlar'}
        size="xl"
        footer={<PrimaryButton onClick={() => setLinkedOpen(false)}>Kapat</PrimaryButton>}
      >
        <p className="text-xs text-slate-500 mb-3">Prototip: şablona örnek plan eşlemeleri.</p>
        <table className="w-full grid-table text-sm">
          <thead>
            <tr><th>Plan No</th><th>Plan Adı</th><th>Versiyon</th><th>Durum</th></tr>
          </thead>
          <tbody>
            {linkedRow && getBagliPlanlar(linkedRow.kpTemplateKodu).map((r) => (
              <tr key={r.planNo}>
                <td>{r.planNo}</td>
                <td>{r.planAdi}</td>
                <td>{r.versiyon}</td>
                <td>{r.durum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      <Modal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title="Planlara Bağla"
        size="lg"
        footer={(
          <>
            <OutlineButton onClick={() => setPlanModalOpen(false)}>İptal</OutlineButton>
            <PrimaryButton onClick={savePlanModal}>Seçili Planlara Bağla</PrimaryButton>
          </>
        )}
      >
        {planModalError && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 text-red-800 text-sm rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {planModalError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Seçilen Kat Payı Templateleri</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTemplateRows.length > 0 ? selectedTemplateRows.map((r) => (
                <span key={r.id} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs">
                  {r.kpTemplateKodu} - {r.adi}
                </span>
              )) : <span className="text-xs text-slate-500">Şablon seçilmedi.</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-800">Planlar</h4>
              <div className="text-xs text-violet-700 font-medium">{selectedPlanIds.length} plan seçildi</div>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-slate-100 bg-slate-50/60">
                <div className="relative max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara (Plan no, plan adı)"
                    value={planSearch}
                    onChange={(e) => setPlanSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-[360px] overflow-auto">
                <table className="w-full grid-table text-sm">
                  <thead>
                    <tr>
                      <th className="w-10 text-center">
                        <input
                          type="checkbox"
                          checked={filteredPlanRows.length > 0 && filteredPlanRows.every((p) => selectedPlanIds.includes(p.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const merge = new Set([...selectedPlanIds, ...filteredPlanRows.map((p) => p.id)])
                              setSelectedPlanIds(Array.from(merge))
                            } else {
                              setSelectedPlanIds((prev) => prev.filter((id) => !filteredPlanRows.some((p) => p.id === id)))
                            }
                          }}
                        />
                      </th>
                      <th>Plan No</th>
                      <th>Plan Adı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlanRows.map((p) => (
                      <tr key={p.id}>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={selectedPlanIds.includes(p.id)}
                            onChange={() => setSelectedPlanIds((prev) => (prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]))}
                          />
                        </td>
                        <td className="font-mono">{p.id}</td>
                        <td>{p.ad}</td>
                      </tr>
                    ))}
                    {filteredPlanRows.length === 0 && (
                      <tr><td colSpan={3} className="text-center py-6 text-slate-500">Kayıt bulunamadı.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
