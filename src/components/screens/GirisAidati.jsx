import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { girisAidati } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const GA_TYPE_OPTIONS = ['Peşin', 'Taksitli', 'Erteleme', 'Çıkışa Ertelenmiş']
const CURRENCY_OPTIONS = ['TL', 'USD', 'EUR']

const INSTALLMENT_TYPE_OPTIONS = ['Ardışık', 'Dönem', 'Peşin']

const ABAU_DATE_TYPE_OPTIONS = ['Teklif Tarihi', 'Çıkış Tarihi']
const EXIT_GA_CALC_OPTIONS = ['Katkı Payı Ödeme Süresi', 'Sistemde Geçen Süre']
const EXIT_RULE_DURATION_OPTIONS = ['Yıl', 'Ay']
const GA_RULE_OPTIONS = ['Standart Kural', 'Ertelemeli Kural', 'Yasal Limit Kuralı']
const GA_BIND_PLANS = [
  { id: '001', ad: 'Limitli Plan', versiyon: '1', durum: 'Taslak' },
  { id: '002', ad: 'Aile Planı', versiyon: '1', durum: 'Taslak' },
  { id: '003', ad: 'Aslan Bireysel Emeklilik Planı', versiyon: '1', durum: 'Taslak' },
  { id: '004', ad: 'Meridyen Bireysel Emeklilik Planı', versiyon: '1', durum: 'Taslak' },
  { id: '005', ad: 'Gruba Bağlı Bireysel Emeklilik Planı', versiyon: '1', durum: 'Taslak' },
]

function mapTipToTypes(tip) {
  if (tip === 'Pesin') return ['Peşin']
  if (tip === 'Cikisa Ertelenmis') return ['Çıkışa Ertelenmiş']
  if (tip === 'Pesin+Cikisa Ert.') return ['Peşin', 'Çıkışa Ertelenmiş']
  if (tip === 'Yok') return ['Giriş Aidatı Yok']
  return []
}

function formatTypes(arr) {
  return arr && arr.length ? arr.join(', ') : ''
}

function toDisplayDate(d = new Date()) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}`
}

function emptyForm() {
  return {
    gaCode: '',
    gaName: '',
    currency: 'TL',
    version: '1',
    girisAidatiYok: false,
    maxDeduction: '',
    abauDateType: '',
    gaRule: '',
    gaTypes: ['Peşin'],
    exitGaCalcType: '',
    installmentType: '',
    installmentCount: '',
    cashType: '',
    cashRate: '',
    cashAmount: '',
    instType: '',
    instRate: '',
    instAmount: '',
    deferType: '',
    deferRate: '',
    deferAmount: '',
    totalAmount: '0.00',
    exitGaRules: [{ id: 1, sureTipi: 'Yıl', altLimit: '', ustLimit: '', oran: '' }],
  }
}

function calcPartValue(type, rate, amount, baseAmount) {
  if (type === 'Oran') {
    const r = parseFloat(String(rate || '0').replace(',', '.'))
    if (Number.isNaN(r)) return 0
    return baseAmount * (r / 100)
  }
  if (type === 'Tutar') {
    const n = parseFloat(String(amount || '0').replace(',', '.'))
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

export default function GirisAidati() {
  const [rows, setRows] = useState(() =>
    girisAidati.map((r) => ({
      id: r.id,
      gaCode: r.gaKodu,
      gaName: `Giriş Aidatı ${r.gaKodu}`,
      currency: r.doviz,
      gaTypes: mapTipToTypes(r.tip),
      installmentType: r.taksitTipi === '-' ? '' : r.taksitTipi,
      installmentCount: r.taksitAdedi === '-' ? '' : r.taksitAdedi,
      cashValue: r.pesinat,
      installmentValue: r.taksit,
      deferValue: r.erteleme,
      totalAmount: r.toplam,
      createdBy: 'mock.user',
      createdAt: toDisplayDate(new Date()),
      updatedBy: 'mock.user',
      updatedAt: toDisplayDate(new Date()),
      version: Number(r.versiyon || 1),
      inUse: r.id === 1,
    })),
  )
  const [search, setSearch] = useState('')
  const [selectedCodes, setSelectedCodes] = useState([])
  const [openMenuCode, setOpenMenuCode] = useState(null)

  const [form, setForm] = useState(emptyForm)
  const [formMode, setFormMode] = useState('create') // 'create' | 'update'
  const [currentEditCode, setCurrentEditCode] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const [simpleModal, setSimpleModal] = useState({ open: false, title: '', body: null })
  const [bindOpen, setBindOpen] = useState(false)
  const [bindSearch, setBindSearch] = useState('')
  const [bindSelectedPlanIds, setBindSelectedPlanIds] = useState([])

  const baseAmount = 40000

  const filteredRows = useMemo(() => {
    const key = search.toLowerCase().trim()
    if (!key) return rows
    return rows.filter((r) => {
      const haystack = `${r.gaCode} ${r.gaName} ${r.currency}`.toLowerCase()
      return haystack.includes(key)
    })
  }, [rows, search])

  const allChecked = filteredRows.length > 0 && selectedCodes.length === filteredRows.length

  useEffect(() => {
    const onClick = () => setOpenMenuCode(null)
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const toggleSelectAll = () => {
    if (allChecked) {
      setSelectedCodes([])
    } else {
      setSelectedCodes(filteredRows.map((r) => r.gaCode))
    }
  }

  const toggleSelectOne = (code) => {
    setSelectedCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const currentTotal = useMemo(() => {
    if (form.girisAidatiYok) return '0.00'
    const cash = calcPartValue(form.cashType, form.cashRate, form.cashAmount, baseAmount)
    const inst = calcPartValue(form.instType, form.instRate, form.instAmount, baseAmount)
    const defer = calcPartValue(form.deferType, form.deferRate, form.deferAmount, baseAmount)
    return (cash + inst + defer).toFixed(2)
  }, [form, baseAmount])

  const openCreate = () => {
    setForm(emptyForm())
    setFormMode('create')
    setCurrentEditCode(null)
    setFormOpen(true)
  }

  const openUpdate = (code, forceNewVersion) => {
    const row = rows.find((r) => r.gaCode === code)
    if (!row) return
    const nextVersion = forceNewVersion ? row.version + 1 : row.version
    const girisAidatiYok = row.gaTypes.includes('Giriş Aidatı Yok')
    setForm({
      gaCode: row.gaCode,
      gaName: row.gaName,
      currency: row.currency,
      version: String(nextVersion),
      girisAidatiYok,
      maxDeduction: '',
      abauDateType: ABAU_DATE_TYPE_OPTIONS[0],
      gaRule: '',
      gaTypes: girisAidatiYok ? [] : row.gaTypes,
      exitGaCalcType: row.gaTypes.includes('Çıkışa Ertelenmiş') ? EXIT_GA_CALC_OPTIONS[0] : '',
      installmentType: row.installmentType || '',
      installmentCount: row.installmentCount || '',
      cashType: row.cashValue ? 'Tutar' : '',
      cashRate: '',
      cashAmount: row.cashValue || '',
      instType: row.installmentValue ? 'Tutar' : '',
      instRate: '',
      instAmount: row.installmentValue || '',
      deferType: row.deferValue ? 'Tutar' : '',
      deferRate: '',
      deferAmount: row.deferValue || '',
      totalAmount: row.totalAmount || '0.00',
      exitGaRules: [{ id: 1, sureTipi: 'Yıl', altLimit: '', ustLimit: '', oran: '' }],
    })
    setFormMode('update')
    setCurrentEditCode(code)
    setFormOpen(true)
  }

  const validateForm = () => {
    if (!form.gaCode.trim() || !form.gaName.trim() || !form.currency) {
      alert('Giriş Aidatı Kodu, Giriş Aidatı Adı ve Döviz zorunludur.')
      return false
    }
    const hasPesin = form.gaTypes.includes('Peşin')
    if (hasPesin && !form.installmentType) {
      alert('Peşin tipi seçiliyken Taksit Tipi zorunludur.')
      return false
    }
    if (formMode === 'create') {
      const exists = rows.some((r) => r.gaCode.toLowerCase() === form.gaCode.trim().toLowerCase())
      if (exists) {
        alert('Eklenmek istenen GA Kodu sistemde mevcuttur. Güncelleme için satır menüsünü kullanın.')
        return false
      }
    }
    return true
  }

  const saveForm = () => {
    if (!validateForm()) return
    const now = new Date()
    const payload = {
      gaCode: form.gaCode.trim(),
      gaName: form.gaName.trim(),
      currency: form.currency,
      gaTypes: form.girisAidatiYok ? ['Giriş Aidatı Yok'] : form.gaTypes,
      installmentType: form.installmentType,
      installmentCount: form.installmentCount,
      cashValue: calcPartValue(form.cashType, form.cashRate, form.cashAmount, baseAmount).toFixed(2),
      installmentValue: calcPartValue(form.instType, form.instRate, form.instAmount, baseAmount).toFixed(2),
      deferValue: calcPartValue(form.deferType, form.deferRate, form.deferAmount, baseAmount).toFixed(2),
      totalAmount: currentTotal,
      createdBy: 'current.user',
      createdAt:
        formMode === 'update'
          ? rows.find((r) => r.gaCode === form.gaCode)?.createdAt || toDisplayDate(now)
          : toDisplayDate(now),
      updatedBy: 'current.user',
      updatedAt: toDisplayDate(now),
      version: Number(form.version || 1),
      inUse: false,
    }
    if (formMode === 'update') {
      setRows((prev) => prev.map((r) => (r.gaCode === form.gaCode ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setFormOpen(false)
  }

  const openInspect = (code) => {
    const row = rows.find((r) => r.gaCode === code)
    if (!row) return
    setSimpleModal({
      open: true,
      title: 'Giriş Aidatı İncele',
      body: (
        <div className="space-y-1 text-sm">
          <p>
            <strong>GA Kodu:</strong> {row.gaCode}
          </p>
          <p>
            <strong>GA Adı:</strong> {row.gaName}
          </p>
          <p>
            <strong>Versiyon:</strong> {row.version}
          </p>
          <p>
            <strong>GA Tipi:</strong> {formatTypes(row.gaTypes)}
          </p>
        </div>
      ),
    })
    setOpenMenuCode(null)
  }

  const openLinkedPlans = (code) => {
    const mock = [
      { code: 'PLN-501', name: 'Ferdi Avantaj Planı', version: 6, status: 'Yürürlükte' },
      { code: 'PLN-612', name: 'Birikim Plus Plan', version: 3, status: 'Taslak' },
    ]
    setSimpleModal({
      open: true,
      title: `${code} - Bağlı Planlar`,
      body: (
        <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Plan Kodu</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Plan Uzun Adı</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Versiyon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Durum</th>
              </tr>
            </thead>
            <tbody>
              {mock.map((p) => (
                <tr key={p.code} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 font-mono text-xs">{p.code}</td>
                  <td className="px-3 py-1.5">{p.name}</td>
                  <td className="px-3 py-1.5">{p.version}</td>
                  <td className="px-3 py-1.5">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    })
    setOpenMenuCode(null)
  }

  const openVersions = (code) => {
    const base = rows.find((r) => r.gaCode === code)
    const history = [
      { version: (base?.version || 1) - 2, total: '8000.00' },
      { version: (base?.version || 1) - 1, total: '12000.00' },
    ].filter((v) => v.version > 0)
    setSimpleModal({
      open: true,
      title: `${code} - Eski Versiyonlar`,
      body: history.length ? (
        <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Versiyon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Toplam Tutar</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.version} className="border-t border-slate-100">
                  <td className="px-3 py-1.5">{h.version}</td>
                  <td className="px-3 py-1.5">{h.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Eski versiyon kaydı mock olarak gösterilmiyor.</p>
      ),
    })
    setOpenMenuCode(null)
  }

  const openExitDeferred = (code) => {
    const mock = [
      { termType: 'Ay', minLimit: 1, maxLimit: 12, ratio: 0.05, fixedAmount: 0 },
      { termType: 'Yıl', minLimit: 2, maxLimit: 5, ratio: 0.07, fixedAmount: 30 },
    ]
    setSimpleModal({
      open: true,
      title: `${code} - Çıkışta Alınacak GA`,
      body: (
        <div className="space-y-2 text-sm">
          <p>Servis taklidi ile listelenen çıkışta alınacak GA tanımları:</p>
          <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Süre Tipi</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Alt Limit</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Üst Limit</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Oran</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Sabit Tutar</th>
                </tr>
              </thead>
              <tbody>
                {mock.map((x, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="px-3 py-1.5">{x.termType}</td>
                    <td className="px-3 py-1.5">{x.minLimit}</td>
                    <td className="px-3 py-1.5">{x.maxLimit}</td>
                    <td className="px-3 py-1.5">{x.ratio}</td>
                    <td className="px-3 py-1.5">{x.fixedAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            Not: Bu ekranda Create/Update/Delete servis davranışı mock olarak simüle edilebilir.
          </p>
        </div>
      ),
    })
    setOpenMenuCode(null)
  }

  const deleteTemplate = (code) => {
    if (!window.confirm(`${code} kodlu kaydı çıkarmak istediğinize emin misiniz?`)) return
    setRows((prev) => prev.filter((r) => r.gaCode !== code))
    setSelectedCodes((prev) => prev.filter((c) => c !== code))
    setOpenMenuCode(null)
  }

  const openBindPlans = () => {
    setBindSearch('')
    setBindSelectedPlanIds([])
    setBindOpen(true)
  }

  const confirmBindPlans = () => {
    if (!bindSelectedPlanIds.length) {
      alert('En az bir plan seçmelisiniz.')
      return
    }
    alert(`Mock: ${selectedCodes.length} giriş aidatı için ${bindSelectedPlanIds.length} planla bağlama işlemi tetiklendi.`)
    setBindOpen(false)
  }

  const hasFee = !form.girisAidatiYok
  const hasPesin = hasFee && form.gaTypes.includes('Peşin')
  const hasTaksitli = hasFee && form.gaTypes.includes('Taksitli')
  const hasErteleme = hasFee && form.gaTypes.includes('Erteleme')
  const hasErtelenmis = hasFee && form.gaTypes.includes('Çıkışa Ertelenmiş')

  const installmentCountOptions = useMemo(() => {
    if (!form.installmentType) return []
    if (form.installmentType === 'Ardışık') {
      return Array.from({ length: 11 }).map((_, i) => `${i + 2} Taksit`)
    }
    if (form.installmentType === 'Dönem') {
      return ['Aylık', 'Üç Aylık', 'Altı Aylık', 'Yıllık']
    }
    if (form.installmentType === 'Peşin') {
      return ['Peşin']
    }
    return []
  }, [form.installmentType])
  const selectedGARows = filteredRows.filter((r) => selectedCodes.includes(r.gaCode))
  const filteredBindPlans = GA_BIND_PLANS.filter((p) =>
    `${p.id} ${p.ad}`.toLowerCase().includes(bindSearch.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Giriş Aidatı"
        description="Katılımcıdan sisteme girişte veya erken çıkışta alınacak giriş aidatının tahsilat stratejisini belirler."
        right={
          <>
            <OutlineButton disabled={selectedCodes.length === 0} onClick={openBindPlans}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
              {selectedCodes.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-blue-600 text-white text-[10px] rounded-full">
                  {selectedCodes.length}
                </span>
              )}
            </OutlineButton>
            <PrimaryButton onClick={openCreate}>
              <Plus className="w-4 h-4" /> Yeni Ekle
            </PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">GA Kodu / Adı / Döviz</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="GA kodu, adı veya döviz ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <OutlineButton onClick={() => setSearch('')}>Filtreleri Temizle</OutlineButton>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table min-w-[1100px]">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <input type="checkbox" className="rounded" checked={allChecked} onChange={toggleSelectAll} />
              </th>
              <th>GA Kodu</th>
              <th>GA Adı</th>
              <th>Döviz</th>
              <th>GA Tipi</th>
              <th>Taksit Tipi</th>
              <th>Taksit Adedi</th>
              <th>Peşinat</th>
              <th>Taksit</th>
              <th>Erteleme</th>
              <th>Toplam Tutar (ÇE Hariç)</th>
              <th>Oluşturan</th>
              <th>Oluşturulma Tarihi</th>
              <th>Güncelleyen</th>
              <th>Güncellenme Tarihi</th>
              <th className="w-12 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="text-center">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedCodes.includes(row.gaCode)}
                    onChange={() => toggleSelectOne(row.gaCode)}
                  />
                </td>
                <td className="font-mono text-xs">{row.gaCode}</td>
                <td>{row.gaName}</td>
                <td>{row.currency}</td>
                <td>{formatTypes(row.gaTypes)}</td>
                <td>{row.installmentType || '-'}</td>
                <td>{row.installmentCount || '-'}</td>
                <td>{row.cashValue}</td>
                <td>{row.installmentValue}</td>
                <td>{row.deferValue}</td>
                <td className="font-semibold text-slate-800">{row.totalAmount}</td>
                <td>{row.createdBy}</td>
                <td>{row.createdAt}</td>
                <td>{row.updatedBy}</td>
                <td>{row.updatedAt}</td>
                <td className="relative text-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuCode((prev) => (prev === row.gaCode ? null : row.gaCode))
                    }}
                  >
                    ...
                  </button>
                  {openMenuCode === row.gaCode && (
                    <div
                      className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-slate-50"
                        onClick={() => openUpdate(row.gaCode, false)}
                      >
                        Güncelle
                      </button>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                        onClick={() => deleteTemplate(row.gaCode)}
                      >
                        Sil
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-slate-50"
                        onClick={() => openLinkedPlans(row.gaCode)}
                      >
                        Bağlı Planlar
                      </button>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-slate-50"
                        onClick={() => openVersions(row.gaCode)}
                      >
                        Versiyonları
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={16} className="text-center text-slate-500 py-6 text-sm">
                  Sonuç bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === 'create' ? 'Giriş Aidatı - Yeni Ekle' : `Giriş Aidatı - Güncelle (${form.gaCode})`}
        size="xl"
        footer={
          <>
            <OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton>
            <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Giriş Aidatı Kodu *</label>
              <input
                className="form-input"
                value={form.gaCode}
                disabled={formMode === 'update'}
                onChange={(e) => setForm((f) => ({ ...f, gaCode: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Giriş Aidatı Adı *</label>
              <input
                className="form-input"
                value={form.gaName}
                onChange={(e) => setForm((f) => ({ ...f, gaName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</label>
              <div className="h-9 px-3 flex items-center rounded-md border border-slate-200 bg-slate-50 text-sm">
                {form.version}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Döviz Kodu *</label>
              <select
                className="form-select"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ABAÜ Tarih Tipi</label>
              <select
                className="form-select"
                value={form.abauDateType}
                disabled={form.girisAidatiYok}
                onChange={(e) => setForm((f) => ({ ...f, abauDateType: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                {ABAU_DATE_TYPE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">GA Hesaplama Kuralı</label>
              <div className="flex gap-2">
                <select
                  className="form-select flex-1"
                  value={form.gaRule}
                  disabled={form.girisAidatiYok}
                  onChange={(e) => setForm((f) => ({ ...f, gaRule: e.target.value }))}
                >
                  <option value="">Seçiniz</option>
                  {GA_RULE_OPTIONS.map((rule) => (
                    <option key={rule} value={rule}>
                      {rule}
                    </option>
                  ))}
                </select>
                <OutlineButton
                  disabled={form.girisAidatiYok}
                  onClick={() => setForm((f) => ({ ...f, gaRule: GA_RULE_OPTIONS[0] }))}
                >
                  Ara
                </OutlineButton>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={form.girisAidatiYok}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      girisAidatiYok: e.target.checked,
                      gaTypes: e.target.checked ? [] : f.gaTypes,
                    }))
                  }
                />
                <span className="font-semibold">Giriş Aidatı Yok</span>
                <span className="text-xs text-blue-600">
                  (Bu seçenek işaretlendiğinde aidat kuralları devre dışı kalır.)
                </span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Taksit Tipi</label>
              <select
                className="form-select"
                disabled={form.girisAidatiYok || !hasPesin}
                value={form.installmentType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    installmentType: e.target.value,
                    installmentCount: '',
                  }))
                }
              >
                <option value="">Seçiniz</option>
                {INSTALLMENT_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Taksit Adedi</label>
              <select
                className="form-select"
                disabled={form.girisAidatiYok || !form.installmentType}
                value={form.installmentCount}
                onChange={(e) => setForm((f) => ({ ...f, installmentCount: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                {installmentCountOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Toplam Tutar (ÇE Hariç)
              </label>
              <input className="form-input bg-slate-50" disabled value={`${currentTotal} TL`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Çıkışa Ert. GA Hesaplama Tipi</label>
              <select
                className="form-select"
                disabled={form.girisAidatiYok || !hasErtelenmis}
                value={form.exitGaCalcType}
                onChange={(e) => setForm((f) => ({ ...f, exitGaCalcType: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                {EXIT_GA_CALC_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-700 mb-2">
              Giriş Aidatı Tipi (Çoklu seçim)
            </h4>
            <div className="flex flex-wrap gap-2">
              {GA_TYPE_OPTIONS.map((t) => {
                const selected = form.gaTypes.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selected
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'bg-white border-slate-300 text-slate-700'
                    } ${!hasFee ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() =>
                      setForm((f) => {
                        const exists = f.gaTypes.includes(t)
                        return {
                          ...f,
                          gaTypes: exists
                            ? f.gaTypes.filter((x) => x !== t)
                            : [...f.gaTypes, t],
                        }
                      })
                    }
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Peşinat</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Peşinat Değer Tipi</label>
                  <select
                    className="form-select"
                    disabled={form.girisAidatiYok || !hasPesin}
                    value={form.cashType}
                    onChange={(e) => setForm((f) => ({ ...f, cashType: e.target.value, cashRate: '', cashAmount: '' }))}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Oran">Oran</option>
                    <option value="Tutar">Tutar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Peşinat Oranı</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled={form.girisAidatiYok || !hasPesin || form.cashType !== 'Oran'}
                    value={form.cashRate}
                    onChange={(e) => setForm((f) => ({ ...f, cashRate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Peşinat Tutarı</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled={form.girisAidatiYok || !hasPesin || form.cashType !== 'Tutar'}
                    value={form.cashAmount}
                    onChange={(e) => setForm((f) => ({ ...f, cashAmount: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Taksit</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Taksit Değer Tipi</label>
                  <select
                    className="form-select"
                    disabled={form.girisAidatiYok || !hasTaksitli}
                    value={form.instType}
                    onChange={(e) => setForm((f) => ({ ...f, instType: e.target.value, instRate: '', instAmount: '' }))}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Oran">Oran</option>
                    <option value="Tutar">Tutar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Taksit Oranı</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled={form.girisAidatiYok || !hasTaksitli || form.instType !== 'Oran'}
                    value={form.instRate}
                    onChange={(e) => setForm((f) => ({ ...f, instRate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Taksit Tutarı</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled={form.girisAidatiYok || !hasTaksitli || form.instType !== 'Tutar'}
                    value={form.instAmount}
                    onChange={(e) => setForm((f) => ({ ...f, instAmount: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Erteleme</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Erteleme Değer Tipi</label>
                  <select
                    className="form-select"
                    disabled={form.girisAidatiYok || !hasErteleme}
                    value={form.deferType}
                    onChange={(e) => setForm((f) => ({ ...f, deferType: e.target.value, deferRate: '', deferAmount: '' }))}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Oran">Oran</option>
                    <option value="Tutar">Tutar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Erteleme Oranı</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled={form.girisAidatiYok || !hasErteleme || form.deferType !== 'Oran'}
                    value={form.deferRate}
                    onChange={(e) => setForm((f) => ({ ...f, deferRate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Erteleme Tutarı</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled={form.girisAidatiYok || !hasErteleme || form.deferType !== 'Tutar'}
                    value={form.deferAmount}
                    onChange={(e) => setForm((f) => ({ ...f, deferAmount: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="rounded"
              checked={form.maxDeduction === 'Evet'}
              disabled={form.girisAidatiYok}
              onChange={(e) => setForm((f) => ({ ...f, maxDeduction: e.target.checked ? 'Evet' : 'Hayır' }))}
            />
            Max Kesinti (Yasal Limiti Otomatik Kontrol Et)
          </label>

          {hasErtelenmis && !form.girisAidatiYok && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">Çıkışta Alınacak GA Tanımları (Kademe)</h4>
                <OutlineButton
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      exitGaRules: [...f.exitGaRules, { id: Date.now(), sureTipi: 'Yıl', altLimit: '', ustLimit: '', oran: '' }],
                    }))
                  }
                >
                  + Ekle
                </OutlineButton>
              </div>
              <div className="overflow-auto">
                <table className="w-full grid-table text-sm">
                  <thead>
                    <tr>
                      <th>Süre Tipi</th>
                      <th>Alt Limit</th>
                      <th>Üst Limit</th>
                      <th>Oran (%)</th>
                      <th className="w-20 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.exitGaRules.map((rule) => (
                      <tr key={rule.id}>
                        <td>
                          <select
                            className="form-select"
                            value={rule.sureTipi}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                exitGaRules: f.exitGaRules.map((r) => (r.id === rule.id ? { ...r, sureTipi: e.target.value } : r)),
                              }))
                            }
                          >
                            {EXIT_RULE_DURATION_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-input"
                            value={rule.altLimit}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                exitGaRules: f.exitGaRules.map((r) => (r.id === rule.id ? { ...r, altLimit: e.target.value } : r)),
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            value={rule.ustLimit}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                exitGaRules: f.exitGaRules.map((r) => (r.id === rule.id ? { ...r, ustLimit: e.target.value } : r)),
                              }))
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            value={rule.oran}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                exitGaRules: f.exitGaRules.map((r) => (r.id === rule.id ? { ...r, oran: e.target.value } : r)),
                              }))
                            }
                          />
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                exitGaRules: f.exitGaRules.length > 1 ? f.exitGaRules.filter((r) => r.id !== rule.id) : f.exitGaRules,
                              }))
                            }
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={bindOpen}
        onClose={() => setBindOpen(false)}
        title="Planlara Bağla"
        description={`Seçilen giriş aidatı sayısı: ${selectedCodes.length}`}
        footer={
          <>
            <OutlineButton onClick={() => setBindOpen(false)}>Vazgeç</OutlineButton>
            <PrimaryButton disabled={selectedCodes.length === 0 || bindSelectedPlanIds.length === 0} onClick={confirmBindPlans}>
              Seçilen Planlara Bağla
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Seçilen Giriş Aidatı Tanımları</h4>
            <div className="flex flex-wrap gap-2">
              {selectedGARows.length > 0 ? selectedGARows.map((r) => (
                <span key={r.gaCode} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs">
                  {r.gaCode} - {r.gaName}
                </span>
              )) : <span className="text-xs text-slate-500">Kayıt seçilmedi.</span>}
            </div>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                  placeholder="Ara (Plan no, plan adı)"
                  value={bindSearch}
                  onChange={(e) => setBindSearch(e.target.value)}
                />
              </div>
              <div className="text-xs text-violet-700 font-medium ml-3">{bindSelectedPlanIds.length} plan seçildi</div>
            </div>
            <div className="max-h-[360px] overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th className="w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredBindPlans.length > 0 && filteredBindPlans.every((p) => bindSelectedPlanIds.includes(p.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const merged = new Set([...bindSelectedPlanIds, ...filteredBindPlans.map((p) => p.id)])
                            setBindSelectedPlanIds(Array.from(merged))
                          } else {
                            setBindSelectedPlanIds((prev) => prev.filter((id) => !filteredBindPlans.some((p) => p.id === id)))
                          }
                        }}
                      />
                    </th>
                    <th>Plan No</th>
                    <th>Plan Adı</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBindPlans.map((p) => (
                    <tr key={p.id}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={bindSelectedPlanIds.includes(p.id)}
                          onChange={() => setBindSelectedPlanIds((prev) => (prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]))}
                        />
                      </td>
                      <td className="font-mono">{p.id}</td>
                      <td>{p.ad}</td>
                    </tr>
                  ))}
                  {filteredBindPlans.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-slate-500">Kayıt bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={simpleModal.open}
        onClose={() => setSimpleModal({ open: false, title: '', body: null })}
        title={simpleModal.title}
        footer={<PrimaryButton onClick={() => setSimpleModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}
      >
        {simpleModal.body}
      </Modal>
    </div>
  )
}
