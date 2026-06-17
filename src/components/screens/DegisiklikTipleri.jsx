import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Eye, Link2, Plus, Search } from 'lucide-react'
import Modal from '../ui/Modal'
import RowActions from '../ui/RowActions'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import {
  degisiklikTipleri as seedRows,
  degisiklikTipiBagliPlanlar as seedBagliPlanlar,
  degisiklikTipiBagliPlanlarByZeyil as seedBagliPlanlarByZeyil,
} from '../../data/mockData'

const AVAILABLE_PLANS = [
  { no: '003', ad: 'ESNEK PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '004', ad: 'AILE PLANI', versiyon: '1', durum: 'Taslak', baslangic: '01.02.2025' },
  { no: '001', ad: 'LIMITLI PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '002', ad: 'STANDART PLAN', versiyon: '2', durum: 'Yürürlükte', baslangic: '15.03.2025' },
  { no: '005', ad: 'TSK MENSUPLARI EMEKLILIK PLANI', versiyon: '3', durum: 'Taslak', baslangic: '01.06.2025' },
  { no: '006', ad: 'GRUBA BAGLI BIREYSEL EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '11.06.2025' },
  { no: '007', ad: '0007 NOLU EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '20.06.2025' },
  { no: '008', ad: 'GRUBA BAGLI BIREYSEL EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '25.06.2025' },
]

const INITIAL_SELECTED_PLANS = [
  { no: '001', ad: 'LIMITLI PLAN', versiyon: '1', durum: 'Taslak', baslangic: '01.01.2025' },
  { no: '002', ad: 'STANDART PLAN', versiyon: '2', durum: 'Yürürlükte', baslangic: '15.03.2025' },
  { no: '005-1', ad: 'ASLAN BIREYSEL EMEKLILIK PLANI', versiyon: '1', durum: 'Taslak', baslangic: '01.07.2025' },
]

const AVAILABLE_GONDERI = [
  { id: '1', sistem: 'Sözleşme/Poliçe', kategori: 'Aktarım Bilgi Formu', ad: 'Aktarım Talep', sebep: 'Mevzuat' },
  { id: '2', sistem: 'Müşteri', kategori: 'Özel Gün', ad: 'Doğum Günü Bilgilendirme Mesajı', sebep: 'Genel Bilgilendirme' },
  { id: '3', sistem: 'Başvuru', kategori: 'Hesap Bildirim Cetveli', ad: 'Aylık Hesap Bildirim Cetveli', sebep: 'Operasyonel' },
  { id: '4', sistem: 'Teklif', kategori: 'Aktarım Bilgi Formu', ad: 'Teklif Aktarım Bilgilendirme', sebep: 'Mevzuat' },
]

const BRANS_OPTIONS = [
  { kod: 'BES', label: 'Bireysel Emeklilik' },
  { kod: 'Hayat', label: 'Hayat' },
  { kod: 'Elementer', label: 'Elementer' },
  { kod: 'Sağlık', label: 'Sağlık' },
]

const SOZLESME_TIPI_BY_BRANS = {
  BES: [
    { kod: 'Ferdi', label: 'Ferdi' },
    { kod: 'Grup', label: 'Grup' },
    { kod: 'OKS', label: 'OKS' },
    { kod: 'EGP', label: 'EGP' },
  ],
  Hayat: [
    { kod: 'Risk', label: 'Risk' },
    { kod: 'Birikimli', label: 'Birikimli' },
    { kod: 'İrat', label: 'İrat' },
  ],
}

/** P-Emeklilik, L-Hayat, H-Sağlık, GE-Elementer */
const BRANS_KISA_KOD = {
  BES: 'P',
  Hayat: 'L',
  'Sağlık': 'H',
  Elementer: 'GE',
}

const SOZLESME_KISA_KOD = {
  Ferdi: 'F',
  Grup: 'G',
  OKS: 'OKS',
  EGP: 'EGP',
  Risk: 'RSK',
  Birikimli: 'BRK',
  İrat: 'IRT',
}

const ROW_ACTIONS = [
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { divider: true },
  { key: 'link', label: 'Bağlı Planlar', icon: 'link' },
  { key: 'details', label: 'Bağlı Gönderiler', icon: 'details' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatTrDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function sozlesmeTipiOptionsForBranslar(bransKodlari) {
  const seen = new Set()
  const out = []
  for (const kod of bransKodlari || []) {
    for (const opt of SOZLESME_TIPI_BY_BRANS[kod] || []) {
      if (!seen.has(opt.kod)) {
        seen.add(opt.kod)
        out.push(opt)
      }
    }
  }
  return out
}

function sozlesmeTipiDisplay(kodlar, options) {
  if (!kodlar?.length) return 'Seçiniz'
  return kodlar.map((k) => options.find((o) => o.kod === k)?.label || k).join(', ')
}

function defaultSozlesmeTipiKodlari(bransKodlari) {
  return sozlesmeTipiOptionsForBranslar(bransKodlari).map((o) => o.kod)
}

function bransLabel(kod) {
  return BRANS_OPTIONS.find((o) => o.kod === kod)?.label || kod
}

function bransDisplay(kodlar) {
  return (kodlar || []).map(bransLabel).join(', ')
}

function resolveBransKodlari(row) {
  if (row.bransKodlari?.length) return [...row.bransKodlari]
  if (!row.brans) return []
  const parts = String(row.brans).split(',').map((s) => s.trim()).filter(Boolean)
  return parts.map((p) => BRANS_OPTIONS.find((o) => o.kod === p || o.label === p)?.kod || p)
}

function bransKisaDisplay(kodlar) {
  const codes = (kodlar || []).map((k) => BRANS_KISA_KOD[k] || k)
  return codes.length ? codes.join(', ') : '—'
}

function sozlesmeKisaDisplay(kodlar) {
  const codes = (kodlar || []).map((k) => SOZLESME_KISA_KOD[k] || k)
  return codes.length ? codes.join(', ') : '—'
}

function planLabel(planNo) {
  return `Plan-${planNo}`
}

function normalizeDegisiklikRow(row) {
  const bransKodlari = resolveBransKodlari(row)
  return {
    ...row,
    versiyon: row.versiyon ?? 1,
    bransKodlari,
    brans: bransDisplay(bransKodlari) || row.brans || '',
    sozlesmeTipiKodlari: row.sozlesmeTipiKodlari?.length
      ? [...row.sozlesmeTipiKodlari]
      : defaultSozlesmeTipiKodlari(bransKodlari),
  }
}

function buildInitialVersionHistory(rows) {
  const map = {}
  for (const row of rows) {
    const key = row.zeyilKodu
    if (!map[key]) {
      map[key] = [{
        id: row.id,
        versiyon: row.versiyon ?? 1,
        yilLimit: row.yilLimit,
        olusturulmaTarihi: '2025-01-01',
        aktif: true,
        rowSnapshot: normalizeDegisiklikRow(row),
      }]
    }
  }
  return map
}

function emptyForm() {
  return {
    id: null,
    brans: '',
    bransKodlari: [],
    sozlesmeTipiKodlari: [],
    zeyilKodu: '',
    zeyilAdi: '',
    versiyon: 1,
    yilLimit: '',
    primDegistirir: 'Hayir',
    uwVarMi: 'Hayir',
  }
}

function BransMultiSelect({ label, required, selectedKodlar, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const summary = selectedKodlar.length === 0
    ? 'Seçiniz'
    : bransDisplay(selectedKodlar)

  const toggle = (kod) => {
    const next = selectedKodlar.includes(kod)
      ? selectedKodlar.filter((k) => k !== kod)
      : [...selectedKodlar, kod]
    onChange([...new Set(next)])
  }

  return (
    <div className="relative" ref={wrapRef}>
      <span className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-h-11 px-3 py-2 border border-slate-300 rounded-md text-sm text-left bg-white flex items-center justify-between gap-2 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={`truncate ${selectedKodlar.length === 0 ? 'text-slate-400' : 'text-slate-800'}`}>{summary}</span>
      </button>
      {open && (
        <div
          className="absolute z-40 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-[0_8px_24px_rgba(15,23,42,0.12)] max-h-56 overflow-y-auto py-1"
          role="listbox"
        >
          {BRANS_OPTIONS.map((opt) => (
            <label
              key={opt.kod}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                className="rounded border-slate-300 w-4 h-4 text-violet-600 focus:ring-violet-500"
                checked={selectedKodlar.includes(opt.kod)}
                onChange={() => toggle(opt.kod)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function SozlesmeTipiMultiSelect({ label, required, options, selectedKodlar, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const summary = disabled
    ? 'Önce branş seçiniz'
    : options.length === 0
      ? 'Bu branş için sözleşme tipi yok'
      : sozlesmeTipiDisplay(selectedKodlar, options)

  const toggle = (kod) => {
    const next = selectedKodlar.includes(kod)
      ? selectedKodlar.filter((k) => k !== kod)
      : [...selectedKodlar, kod]
    onChange([...new Set(next)])
  }

  return (
    <div className="relative" ref={wrapRef}>
      <span className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <button
        type="button"
        disabled={disabled || options.length === 0}
        onClick={() => !disabled && options.length > 0 && setOpen((o) => !o)}
        className={`w-full min-h-11 px-3 py-2 border border-slate-300 rounded-md text-sm text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 ${
          disabled || options.length === 0
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white hover:border-slate-400 text-slate-800'
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={`truncate ${!selectedKodlar.length ? 'text-slate-400' : ''}`}>{summary}</span>
      </button>
      {open && !disabled && options.length > 0 && (
        <div
          className="absolute z-40 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-[0_8px_24px_rgba(15,23,42,0.12)] max-h-56 overflow-y-auto py-1"
          role="listbox"
        >
          {options.map((opt) => (
            <label
              key={opt.kod}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                className="rounded border-slate-300 w-4 h-4 text-violet-600 focus:ring-violet-500"
                checked={selectedKodlar.includes(opt.kod)}
                onChange={() => toggle(opt.kod)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function DegisiklikVersionsScreen({ sourceRow, versions, onBack, onInspect }) {
  const sorted = useMemo(
    () => [...versions].sort((a, b) => b.versiyon - a.versiyon),
    [versions],
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          aria-label="Listeye dön"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-800 truncate">Değişiklik Tipi Versiyonları</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-flex px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 text-[10px] font-bold tracking-wide">VERSİYON LİSTESİ</span>
            <span className="text-xs text-slate-500">{sourceRow?.zeyilKodu} · {sourceRow?.zeyilAdi}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="overflow-auto border border-slate-200 rounded-lg">
          <table className="w-full grid-table text-sm">
            <thead>
              <tr>
                <th>Değişiklik Kodu</th>
                <th>Versiyon</th>
                <th>Yılda Kaç Kez</th>
                <th>Oluşturulma Tarihi</th>
                <th>Durum</th>
                <th className="w-28 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((v) => (
                <tr key={`${v.zeyilKodu}-${v.versiyon}`}>
                  <td className="font-semibold text-violet-700">{sourceRow?.zeyilKodu}</td>
                  <td className="tabular-nums">{v.versiyon}</td>
                  <td className="tabular-nums">{v.yilLimit}</td>
                  <td>{formatTrDate(v.olusturulmaTarihi || v.baslangic)}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${v.aktif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {v.aktif ? 'Güncel' : 'Arşiv'}
                    </span>
                  </td>
                  <td className="text-right">
                    <OutlineButton type="button" className="h-8 px-3 text-xs" onClick={() => onInspect?.(v)}>
                      <Eye className="w-3.5 h-3.5" /> İncele
                    </OutlineButton>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={6} className="text-center text-slate-500 py-8">Versiyon kaydı bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function DegisiklikTipleri() {
  const initialRows = useMemo(() => seedRows.map((x) => normalizeDegisiklikRow(x)), [])
  const [rows, setRows] = useState(initialRows)
  const [versionHistoryByZeyilKodu, setVersionHistoryByZeyilKodu] = useState(() => buildInitialVersionHistory(initialRows))
  const [boundPlansByTanimId, setBoundPlansByTanimId] = useState(() => {
    const copy = {}
    for (const [k, v] of Object.entries(seedBagliPlanlar)) {
      copy[Number(k)] = v.map((p) => ({ ...p }))
    }
    return copy
  })
  const [boundPlansByZeyilKodu] = useState(() => {
    const copy = {}
    for (const [k, v] of Object.entries(seedBagliPlanlarByZeyil)) {
      copy[k] = v.map((p) => ({ ...p }))
    }
    return copy
  })

  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [editMode, setEditMode] = useState('create')
  const [originalRow, setOriginalRow] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [filterKod, setFilterKod] = useState('')
  const [filterAd, setFilterAd] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  const [versionConfirmRow, setVersionConfirmRow] = useState(null)
  const [differentPlansConfirm, setDifferentPlansConfirm] = useState(null)
  const [versionsContext, setVersionsContext] = useState(null)
  const [inspectVersion, setInspectVersion] = useState(null)

  const [planBindOpen, setPlanBindOpen] = useState(false)
  const [gonderiBindOpen, setGonderiBindOpen] = useState(false)
  const [leftPlans, setLeftPlans] = useState(() => AVAILABLE_PLANS.filter((p) => !INITIAL_SELECTED_PLANS.some((s) => s.no === p.no)))
  const [rightPlans, setRightPlans] = useState(INITIAL_SELECTED_PLANS)
  const [leftPlanSelected, setLeftPlanSelected] = useState([])
  const [rightPlanSelected, setRightPlanSelected] = useState([])
  const [planKodFilter, setPlanKodFilter] = useState('')

  const [leftGonderi, setLeftGonderi] = useState(AVAILABLE_GONDERI)
  const [rightGonderi, setRightGonderi] = useState([])
  const [leftGonderiSelected, setLeftGonderiSelected] = useState([])
  const [rightGonderiSelected, setRightGonderiSelected] = useState([])
  const [gonderiFilter, setGonderiFilter] = useState({ sistem: '', kategori: '', ad: '', sebep: '' })

  const filteredLeftPlans = useMemo(() => {
    if (!planKodFilter.trim()) return leftPlans
    const q = planKodFilter.toLowerCase()
    return leftPlans.filter((p) => p.no.toLowerCase().includes(q) || p.ad.toLowerCase().includes(q))
  }, [leftPlans, planKodFilter])

  const filteredLeftGonderi = useMemo(() => {
    return leftGonderi.filter((g) => {
      const s = !gonderiFilter.sistem || g.sistem === gonderiFilter.sistem
      const k = !gonderiFilter.kategori || g.kategori === gonderiFilter.kategori
      const a = !gonderiFilter.ad.trim() || g.ad.toLowerCase().includes(gonderiFilter.ad.toLowerCase())
      const se = !gonderiFilter.sebep || g.sebep === gonderiFilter.sebep
      return s && k && a && se
    })
  }, [leftGonderi, gonderiFilter])

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const k = !filterKod.trim() || r.zeyilKodu.toLowerCase().includes(filterKod.toLowerCase())
      const a = !filterAd.trim() || r.zeyilAdi.toLowerCase().includes(filterAd.toLowerCase())
      return k && a
    })
  }, [rows, filterKod, filterAd])

  const getBoundPlansForRow = (row) => {
    const byId = boundPlansByTanimId[row.id] || []
    if (byId.length) return byId
    return boundPlansByZeyilKodu[row.zeyilKodu] || []
  }

  const isPlanBound = (row) => getBoundPlansForRow(row).length > 0

  const getPlansWithDifferentAdet = (row) => {
    const master = Number(String(row.yilLimit).trim())
    return getBoundPlansForRow(row).filter((p) => {
      const planAdet = Number(p.yillikAdet)
      return !Number.isNaN(master) && !Number.isNaN(planAdet) && planAdet !== master
    })
  }

  const movePlanOneRight = () => {
    const selectedRows = leftPlans.filter((p) => leftPlanSelected.includes(p.no))
    if (!selectedRows.length) return
    setRightPlans((prev) => [...prev, ...selectedRows])
    setLeftPlans((prev) => prev.filter((p) => !leftPlanSelected.includes(p.no)))
    setLeftPlanSelected([])
  }
  const movePlanAllRight = () => {
    if (!leftPlans.length) return
    setRightPlans((prev) => [...prev, ...leftPlans])
    setLeftPlans([])
    setLeftPlanSelected([])
  }
  const movePlanOneLeft = () => {
    const selectedRows = rightPlans.filter((p) => rightPlanSelected.includes(p.no))
    if (!selectedRows.length) return
    setLeftPlans((prev) => [...prev, ...selectedRows])
    setRightPlans((prev) => prev.filter((p) => !rightPlanSelected.includes(p.no)))
    setRightPlanSelected([])
  }
  const movePlanAllLeft = () => {
    if (!rightPlans.length) return
    setLeftPlans((prev) => [...prev, ...rightPlans])
    setRightPlans([])
    setRightPlanSelected([])
  }

  const moveGonderiOneRight = () => {
    const selectedRows = leftGonderi.filter((g) => leftGonderiSelected.includes(g.id))
    if (!selectedRows.length) return
    setRightGonderi((prev) => [...prev, ...selectedRows])
    setLeftGonderi((prev) => prev.filter((g) => !leftGonderiSelected.includes(g.id)))
    setLeftGonderiSelected([])
  }
  const moveGonderiAllRight = () => {
    if (!leftGonderi.length) return
    setRightGonderi((prev) => [...prev, ...leftGonderi])
    setLeftGonderi([])
    setLeftGonderiSelected([])
  }
  const moveGonderiOneLeft = () => {
    const selectedRows = rightGonderi.filter((g) => rightGonderiSelected.includes(g.id))
    if (!selectedRows.length) return
    setLeftGonderi((prev) => [...prev, ...selectedRows])
    setRightGonderi((prev) => prev.filter((g) => !rightGonderiSelected.includes(g.id)))
    setRightGonderiSelected([])
  }
  const moveGonderiAllLeft = () => {
    if (!rightGonderi.length) return
    setLeftGonderi((prev) => [...prev, ...rightGonderi])
    setRightGonderi([])
    setRightGonderiSelected([])
  }

  const openCreate = () => {
    setEditingId(null)
    setEditMode('create')
    setOriginalRow(null)
    setForm(emptyForm())
    setView('create')
  }

  const openEditForm = (row, mode, source) => {
    const normalized = normalizeDegisiklikRow(row)
    const sozlesmeOpts = sozlesmeTipiOptionsForBranslar(normalized.bransKodlari)
    setEditingId(normalized.id)
    setEditMode(mode)
    setOriginalRow(source || normalized)
    setForm({
      ...normalized,
      bransKodlari: [...(normalized.bransKodlari || [])],
      sozlesmeTipiKodlari: normalized.sozlesmeTipiKodlari?.length
        ? [...normalized.sozlesmeTipiKodlari]
        : sozlesmeOpts.map((o) => o.kod),
      versiyon: mode === 'version' ? (normalized.versiyon ?? 1) + 1 : (normalized.versiyon ?? 1),
    })
    setView('create')
  }

  const openGuncelleme = (row) => {
    if (isPlanBound(row)) {
      setVersionConfirmRow(row)
      return
    }
    openEditForm(row, 'edit')
  }

  const confirmVersionAndEdit = () => {
    if (!versionConfirmRow) return
    const row = versionConfirmRow
    setVersionConfirmRow(null)
    const differentPlans = getPlansWithDifferentAdet(row)
    if (differentPlans.length > 0) {
      setDifferentPlansConfirm({ row, plans: differentPlans })
      return
    }
    openEditForm(row, 'version', row)
  }

  const confirmDifferentPlansAndOpenForm = () => {
    if (!differentPlansConfirm?.row) return
    openEditForm(differentPlansConfirm.row, 'version', differentPlansConfirm.row)
    setDifferentPlansConfirm(null)
  }

  const applyDirectUpdate = (payload) => {
    setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)))
    setVersionHistoryByZeyilKodu((prev) => {
      const list = [...(prev[payload.zeyilKodu] || [])]
      const idx = list.findIndex((v) => v.versiyon === payload.versiyon)
      const entry = {
        id: payload.id,
        versiyon: payload.versiyon,
        yilLimit: payload.yilLimit,
        olusturulmaTarihi: list[idx]?.olusturulmaTarihi || list[idx]?.baslangic || todayIso(),
        aktif: true,
        rowSnapshot: payload,
      }
      if (idx >= 0) list[idx] = entry
      else list.push(entry)
      return { ...prev, [payload.zeyilKodu]: list }
    })
  }

  const applyNewVersion = (payload, prevRow) => {
    const now = todayIso()
    const newId = Date.now()
    const newRow = normalizeDegisiklikRow({ ...payload, id: newId, versiyon: payload.versiyon })

    setRows((prev) => prev.map((r) => (r.id === prevRow.id ? newRow : r)))

    setVersionHistoryByZeyilKodu((prev) => {
      const list = [...(prev[newRow.zeyilKodu] || [])]
      const updated = list.map((v) => (
        v.versiyon === prevRow.versiyon
          ? { ...v, aktif: false }
          : v
      ))
      updated.push({
        id: newId,
        versiyon: newRow.versiyon,
        yilLimit: newRow.yilLimit,
        olusturulmaTarihi: now,
        aktif: true,
        rowSnapshot: newRow,
      })
      return { ...prev, [newRow.zeyilKodu]: updated }
    })

    setBoundPlansByTanimId((prev) => {
      const plans = prev[prevRow.id]
      if (!plans) return prev
      const next = { ...prev }
      delete next[prevRow.id]
      next[newId] = plans.map((p) => ({ ...p }))
      return next
    })
  }

  const finalizeSave = (payload) => {
    if (editMode === 'version' && originalRow) {
      applyNewVersion(payload, originalRow)
    } else if (editingId) {
      applyDirectUpdate(payload)
    } else {
      const newRow = normalizeDegisiklikRow({ ...payload, id: payload.id || Date.now(), versiyon: 1 })
      setRows((prev) => [...prev, newRow])
      setVersionHistoryByZeyilKodu((prev) => ({
        ...prev,
        [newRow.zeyilKodu]: [{
          id: newRow.id,
          versiyon: 1,
          yilLimit: newRow.yilLimit,
          olusturulmaTarihi: todayIso(),
          aktif: true,
          rowSnapshot: newRow,
        }],
      }))
    }
    setView('list')
    setEditingId(null)
    setEditMode('create')
    setOriginalRow(null)
    setForm(emptyForm())
  }

  const saveForm = () => {
    if (!form.bransKodlari?.length) return alert('Branş Kodu zorunludur.')
    const sozlesmeOpts = sozlesmeTipiOptionsForBranslar(form.bransKodlari)
    if (sozlesmeOpts.length && !form.sozlesmeTipiKodlari?.length) {
      return alert('Sözleşme Tipi zorunludur.')
    }
    if (!String(form.zeyilKodu).trim()) return alert('Değişiklik Kodu zorunludur.')
    if (!String(form.zeyilAdi).trim()) return alert('Değişiklik Adı zorunludur.')
    if (!String(form.yilLimit).trim()) return alert('Yılda Kaç Kez Yapılabilir zorunludur.')

    const bransKodlari = [...form.bransKodlari]
    const sozlesmeTipiKodlari = [...(form.sozlesmeTipiKodlari || [])]
    const payload = normalizeDegisiklikRow({
      ...form,
      bransKodlari,
      sozlesmeTipiKodlari,
      id: editMode === 'version' ? Date.now() : (form.id || Date.now()),
      versiyon: editMode === 'version' ? (originalRow?.versiyon ?? 1) + 1 : (form.versiyon ?? 1),
    })

    const existsByCode = rows.some((r) => r.zeyilKodu === payload.zeyilKodu && r.id !== editingId && editMode !== 'version')
    if (existsByCode) return alert('Bu değişiklik kodu mevcut.')

    finalizeSave(payload)
  }

  const toggleRow = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((x) => x.id !== row.id))
  }

  const handleRowAction = (key, row) => {
    if (key === 'edit') openGuncelleme(row)
    else if (key === 'history') setVersionsContext(row)
    else if (key === 'link') setPlanBindOpen(true)
    else if (key === 'details') setGonderiBindOpen(true)
    else if (key === 'delete') removeRow(row)
  }

  const confirmModals = (
    <>
      <Modal
        open={!!versionConfirmRow}
        onClose={() => setVersionConfirmRow(null)}
        title="Yeni Versiyon Oluştur"
        size="md"
        footer={(
          <>
            <OutlineButton type="button" onClick={() => setVersionConfirmRow(null)}>Hayır</OutlineButton>
            <PrimaryButton type="button" onClick={confirmVersionAndEdit}>Evet</PrimaryButton>
          </>
        )}
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          Değişiklik tipi planlara bağlıdır. Yeni versiyon oluşturmak istiyor musunuz?
        </p>
      </Modal>

      <Modal
        open={!!differentPlansConfirm}
        onClose={() => setDifferentPlansConfirm(null)}
        title="Farklı Yıllık Adet Tanımlı Planlar"
        size="md"
        footer={(
          <>
            <OutlineButton type="button" onClick={() => setDifferentPlansConfirm(null)}>Hayır</OutlineButton>
            <PrimaryButton type="button" onClick={confirmDifferentPlansAndOpenForm}>Evet</PrimaryButton>
          </>
        )}
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          Farklı yıllık adet tanımı yapılmış planlar mevcuttur,
          {' '}
          <span className="font-semibold">
            {(differentPlansConfirm?.plans || []).map((p) => planLabel(p.planNo)).join(', ')}
          </span>
          , yeni versiyon oluşturulsun mu?
        </p>
        <p className="text-xs text-slate-500 mt-3">
          Bu planlardaki yıllık adet değerleri otomatik güncellenmez.
        </p>
      </Modal>
    </>
  )

  if (inspectVersion) {
    const snap = inspectVersion.rowSnapshot || inspectVersion
    return (
      <>
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setInspectVersion(null)}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Versiyon İncele (v{inspectVersion.versiyon})</h2>
            <p className="text-sm text-slate-500 mt-1">{snap.zeyilKodu} · {snap.zeyilAdi}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Branş Kodu:</span> <span className="font-medium">{bransKisaDisplay(snap.bransKodlari)}</span></div>
          <div><span className="text-slate-500">Sözleşme Tipi:</span> <span className="font-medium">{sozlesmeKisaDisplay(snap.sozlesmeTipiKodlari)}</span></div>
          <div><span className="text-slate-500">Yılda Kaç Kez:</span> <span className="font-medium">{snap.yilLimit}</span></div>
          <div><span className="text-slate-500">Versiyon:</span> <span className="font-medium">{inspectVersion.versiyon}</span></div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <OutlineButton onClick={() => setInspectVersion(null)}>Kapat</OutlineButton>
        </div>
      </div>
      {confirmModals}
      </>
    )
  }

  if (versionsContext) {
    const versions = versionHistoryByZeyilKodu[versionsContext.zeyilKodu] || []
    return (
      <>
      <DegisiklikVersionsScreen
        sourceRow={versionsContext}
        versions={versions}
        onBack={() => setVersionsContext(null)}
        onInspect={(v) => setInspectVersion(v)}
      />
      {confirmModals}
      </>
    )
  }

  if (view === 'create') {
    const sozlesmeTipiOptions = sozlesmeTipiOptionsForBranslar(form.bransKodlari)
    const bransSecili = (form.bransKodlari || []).length > 0
    const isVersionUpdate = editMode === 'version'
    const isReadonlyCode = isVersionUpdate || !!editingId

    const title = isVersionUpdate
      ? `Yeni Versiyon Oluştur (v${form.versiyon})`
      : editingId
        ? 'Değişiklik Tipi Güncelle'
        : 'Yeni Değişiklik Tipi Ekle'

    return (
      <>
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setView('list')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {isVersionUpdate
                ? 'Planlara bağlı kayıt için yeni versiyon üzerinde güncelleme yapılıyor'
                : 'Sistem için değişiklik tipleri tanımlayın'}
            </p>
          </div>
        </div>

        {isVersionUpdate && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
            Bu değişiklik tipi planlara bağlıdır. Kayıt mevcut versiyon <strong>v{originalRow?.versiyon ?? 1}</strong> üzerinden
            {' '}<strong>v{form.versiyon}</strong> olarak oluşturulacaktır.
          </div>
        )}

        <div className="p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BransMultiSelect
              label="Branş Kodu"
              required
              selectedKodlar={form.bransKodlari || []}
              onChange={(bransKodlari) => {
                const opts = sozlesmeTipiOptionsForBranslar(bransKodlari)
                setForm((f) => ({
                  ...f,
                  bransKodlari,
                  brans: bransDisplay(bransKodlari),
                  sozlesmeTipiKodlari: opts.map((o) => o.kod),
                }))
              }}
            />
            <SozlesmeTipiMultiSelect
              label="Sözleşme Tipi"
              required={sozlesmeTipiOptions.length > 0}
              options={sozlesmeTipiOptions}
              selectedKodlar={form.sozlesmeTipiKodlari || []}
              disabled={!bransSecili}
              onChange={(sozlesmeTipiKodlari) => setForm((f) => ({ ...f, sozlesmeTipiKodlari }))}
            />
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Versiyon</span>
              <input
                className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm bg-slate-100 text-slate-600"
                value={form.versiyon ?? 1}
                readOnly
              />
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Değişiklik Kodu *</span>
              <input
                className={`w-full h-11 border border-slate-300 rounded-md px-3 text-sm ${isReadonlyCode ? 'bg-slate-100 text-slate-600' : ''}`}
                value={form.zeyilKodu}
                readOnly={isReadonlyCode}
                onChange={(e) => setForm((f) => ({ ...f, zeyilKodu: e.target.value }))}
              />
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Değişiklik Adı *</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" value={form.zeyilAdi} onChange={(e) => setForm((f) => ({ ...f, zeyilAdi: e.target.value }))} />
            </label>
            <label>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Yılda Kaç Kez Yapılabilir?</span>
              <input className="w-full h-11 border border-slate-300 rounded-md px-3 text-sm" placeholder="Örn: 2" value={form.yilLimit} onChange={(e) => setForm((f) => ({ ...f, yilLimit: e.target.value }))} />
            </label>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <OutlineButton onClick={() => setView('list')}>İptal</OutlineButton>
          {!isVersionUpdate && <OutlineButton onClick={() => setForm(emptyForm())}>Temizle</OutlineButton>}
          <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
        </div>
      </div>
      {confirmModals}
      </>
    )
  }

  return (
    <>
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Değişiklik Tipleri"
        right={
          <div className="flex items-center gap-2">
            <OutlineButton onClick={() => setPlanBindOpen(true)}><Link2 className="w-4 h-4" /> Planlara Bağla</OutlineButton>
            <OutlineButton onClick={() => setGonderiBindOpen(true)}><Link2 className="w-4 h-4" /> Gönderi Tiplerine Bağla</OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </div>
        }
      />

      <div className="px-6 py-4 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
          <div>
            <span className="block text-xs text-slate-600 mb-1">Değişiklik Kodu</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Kod ara..." value={filterKod} onChange={(e) => setFilterKod(e.target.value)} />
            </div>
          </div>
          <div>
            <span className="block text-xs text-slate-600 mb-1">Değişiklik Adı</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="w-full h-9 border border-slate-300 rounded-md pl-9 pr-3 text-sm" placeholder="Değişiklik adı ara..." value={filterAd} onChange={(e) => setFilterAd(e.target.value)} />
            </div>
          </div>
          <div className="flex items-end"><OutlineButton onClick={() => { setFilterKod(''); setFilterAd('') }}>Temizle</OutlineButton></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm min-w-[1200px]">
          <thead>
            <tr>
              <th></th>
              <th>Branş Kodu</th>
              <th>Sözleşme(Ürün) Tipi</th>
              <th>Değişiklik Kodu</th>
              <th>Değişiklik Adı</th>
              <th>Versiyon</th>
              <th>Yılda Kaç Kez Yapılabilir?</th>
              <th>Prim Değiştiriyor mu?</th>
              <th>UW var mı?</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td><input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleRow(r.id)} /></td>
                <td className="font-semibold text-slate-800">{bransKisaDisplay(r.bransKodlari)}</td>
                <td className="font-medium text-slate-700">{sozlesmeKisaDisplay(r.sozlesmeTipiKodlari)}</td>
                <td className="font-semibold">{r.zeyilKodu}</td>
                <td>{r.zeyilAdi}</td>
                <td className="tabular-nums">{r.versiyon ?? 1}</td>
                <td>{r.yilLimit}</td>
                <td>{r.primDegistirir === 'Evet' ? 'Evet' : 'Hayır'}</td>
                <td>{r.uwVarMi === 'Evet' ? 'Evet' : 'Hayır'}</td>
                <td className="text-right">
                  <RowActions actions={ROW_ACTIONS} row={r} onAction={handleRowAction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2"><span>Sayfa başına</span><select className="h-8 border border-slate-300 rounded-md px-2"><option>10</option></select></div>
        <span>Toplam {rows.length} kayıt</span>
      </div>

      <Modal
        open={planBindOpen}
        onClose={() => setPlanBindOpen(false)}
        title="Planlara Bağla(Değişiklik Tipleri)"
        size="xl"
        footer={
          <>
            <OutlineButton onClick={() => setPlanBindOpen(false)}>İptal</OutlineButton>
            <OutlineButton onClick={() => { setLeftPlans(AVAILABLE_PLANS); setRightPlans([]); setLeftPlanSelected([]); setRightPlanSelected([]); setPlanKodFilter('') }}>Temizle</OutlineButton>
            <PrimaryButton onClick={() => setPlanBindOpen(false)}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <div className="border border-slate-200 rounded-md p-2">
            <div className="text-center text-sm font-semibold text-red-700 mb-2">Seçilmemiş Taslak Planlar</div>
            <div className="flex items-end gap-2 mb-2">
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">Kod :</div>
                <select className="w-full h-9 border border-slate-300 rounded px-2 text-sm" value={planKodFilter} onChange={(e) => setPlanKodFilter(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  {[...new Set(leftPlans.map((p) => p.no))].map((kod) => <option key={kod} value={kod}>{kod}</option>)}
                </select>
              </div>
              <PrimaryButton onClick={() => {}}>Ara</PrimaryButton>
            </div>
            <div className="max-h-[330px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>Plan No</th>
                    <th>Plan Adı</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeftPlans.map((p) => (
                    <tr key={p.no}>
                      <td><input type="checkbox" checked={leftPlanSelected.includes(p.no)} onChange={() => setLeftPlanSelected((prev) => prev.includes(p.no) ? prev.filter((x) => x !== p.no) : [...prev, p.no])} /></td>
                      <td>{p.no}</td>
                      <td>{p.ad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-20">
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanOneRight}>--&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanAllRight}>&gt;&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanOneLeft}>&lt;--</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={movePlanAllLeft}>&lt;&lt;</button>
          </div>
          <div className="border border-slate-200 rounded-md p-2">
            <div className="text-center text-sm font-semibold text-emerald-700 mb-2">Seçilmiş Planlar</div>
            <div className="max-h-[330px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>Plan No</th>
                    <th>Plan Adı</th>
                    <th>Versiyon</th>
                    <th>Plan Durumu</th>
                  </tr>
                </thead>
                <tbody>
                  {rightPlans.map((p) => (
                    <tr key={p.no}>
                      <td><input type="checkbox" checked={rightPlanSelected.includes(p.no)} onChange={() => setRightPlanSelected((prev) => prev.includes(p.no) ? prev.filter((x) => x !== p.no) : [...prev, p.no])} /></td>
                      <td>{p.no}</td>
                      <td>{p.ad}</td>
                      <td>{p.versiyon}</td>
                      <td><span className={`px-1.5 py-0.5 rounded text-xs ${p.durum === 'Yürürlükte' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.durum}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={gonderiBindOpen}
        onClose={() => setGonderiBindOpen(false)}
        title="Gönderi Tiplerine Bağla"
        size="xl"
        footer={
          <>
            <OutlineButton onClick={() => setGonderiBindOpen(false)}>İptal</OutlineButton>
            <OutlineButton onClick={() => { setLeftGonderi(AVAILABLE_GONDERI); setRightGonderi([]); setLeftGonderiSelected([]); setRightGonderiSelected([]); setGonderiFilter({ sistem: '', kategori: '', ad: '', sebep: '' }) }}>Temizle</OutlineButton>
            <PrimaryButton onClick={() => setGonderiBindOpen(false)}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <div className="border border-slate-200 rounded-md p-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select className="h-9 border border-slate-300 rounded-md px-2 text-sm" value={gonderiFilter.sistem} onChange={(e) => setGonderiFilter((p) => ({ ...p, sistem: e.target.value }))}>
                <option value="">Sistem (Tümü)</option>
                {[...new Set(AVAILABLE_GONDERI.map((g) => g.sistem))].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="h-9 border border-slate-300 rounded-md px-2 text-sm" value={gonderiFilter.kategori} onChange={(e) => setGonderiFilter((p) => ({ ...p, kategori: e.target.value }))}>
                <option value="">Kategori (Tümü)</option>
                {[...new Set(AVAILABLE_GONDERI.map((g) => g.kategori))].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              <input className="h-9 border border-slate-300 rounded-md px-2 text-sm" placeholder="Gönderi Adı" value={gonderiFilter.ad} onChange={(e) => setGonderiFilter((p) => ({ ...p, ad: e.target.value }))} />
              <select className="h-9 border border-slate-300 rounded-md px-2 text-sm" value={gonderiFilter.sebep} onChange={(e) => setGonderiFilter((p) => ({ ...p, sebep: e.target.value }))}>
                <option value="">Gönderi Sebebi (Tümü)</option>
                {[...new Set(AVAILABLE_GONDERI.map((g) => g.sebep))].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="max-h-[330px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead><tr><th></th><th>Sistem</th><th>Kategori</th><th>Gönderi Adı</th><th>Gönderi Sebebi</th></tr></thead>
                <tbody>
                  {filteredLeftGonderi.map((g) => (
                    <tr key={g.id}>
                      <td><input type="checkbox" checked={leftGonderiSelected.includes(g.id)} onChange={() => setLeftGonderiSelected((prev) => prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id])} /></td>
                      <td>{g.sistem}</td>
                      <td>{g.kategori}</td>
                      <td>{g.ad}</td>
                      <td>{g.sebep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-20">
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiOneRight}>--&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiAllRight}>&gt;&gt;</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiOneLeft}>&lt;--</button>
            <button type="button" className="h-8 px-3 rounded bg-blue-500 text-white text-sm" onClick={moveGonderiAllLeft}>&lt;&lt;</button>
          </div>
          <div className="border border-slate-200 rounded-md p-2">
            <div className="text-sm font-semibold text-emerald-700 mb-2">Seçilmiş Gönderi Tipleri</div>
            <div className="max-h-[370px] overflow-auto border border-slate-200 rounded">
              <table className="w-full grid-table text-sm">
                <thead><tr><th></th><th>Sistem</th><th>Kategori</th><th>Gönderi Adı</th><th>Gönderi Sebebi</th></tr></thead>
                <tbody>
                  {rightGonderi.map((g) => (
                    <tr key={g.id}>
                      <td><input type="checkbox" checked={rightGonderiSelected.includes(g.id)} onChange={() => setRightGonderiSelected((prev) => prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id])} /></td>
                      <td>{g.sistem}</td>
                      <td>{g.kategori}</td>
                      <td>{g.ad}</td>
                      <td>{g.sebep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    {confirmModals}
    </>
  )
}
