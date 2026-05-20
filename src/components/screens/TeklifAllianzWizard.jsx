/**
 * Allianz teklif sihirbazı (aktif geliştirme dosyası).
 * Donmuş referans: ./baselines/TeklifAllianzWizard.v1-digitall.jsx — bkz. baselines/README.md
 */
import { useState, useMemo, useEffect } from 'react'
import KatilimciStep from './allianz/KatilimciStep'
import LehdarStep from './allianz/LehdarStep'
import PlanFonStep from './allianz/PlanFonStep'
import WizardSectionStep from './allianz/WizardSectionStep'
import { buildVisibleSteps, getStepKey } from './allianz/wizardSteps'
import { emptyKatilimciBlock } from './allianz/katilimciFields'
import {
  User,
  Search,
  FileText,
  PieChart,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit,
} from 'lucide-react'

const TEKLIF_NO_DEFAULT = '32253978'

const PLAN_LABELS = {
  '518': '518 - KİŞİYE ÖZEL PLAN',
  '519': '519 - SAFRAN PLAN',
  '526': '526 - MERCAN PLAN',
}

const ODEME_PERIYOD_LABELS = {
  '1': 'AYLIK ÖDEME',
  '3': 'ÜÇ AYLIK ÖDEME',
  '6': 'ALTI AYLIK ÖDEME',
  '12': 'YILLIK ÖDEME',
}

const ODEME_SEKLI_LABEL = 'HAVALE/ÖZEL ÖDEME SEÇENEĞİ'

const SIRKET_DEFAULT = 'ALLIANZ YAŞAM VE EMEKLİLİK A.Ş.'

const ARACI_SICIL_OPTIONS = [
  { value: '11270208416 - SEMA ARIK', label: '11270208416 - SEMA ARIK' },
  { value: '11270208417 - ALİ YILMAZ', label: '11270208417 - ALİ YILMAZ' },
]

function StepBlockHeader({ children }) {
  return (
    <div className="bg-slate-100 border border-slate-200 border-b-0 px-4 py-2.5 rounded-t-lg">
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{children}</h3>
    </div>
  )
}

function formatTelefon(value) {
  if (!value) return '—'
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 10) return `(TR) +90 ${digits}`
  return value
}

const initialFormData = () => ({
  teklifTipi: 'BGD',
  sirket: SIRKET_DEFAULT,
  acenteKodu: '5',
  acenteAdi: 'EGE BÖLGE MÜDÜRLÜĞÜ',
  araciSicil: ARACI_SICIL_OPTIONS[0].value,
  urunTipi: 'Bireysel Teklif Girişi',
  dijitalForm: 'Evet',
  mesafeliSatis: 'Hayır',
  tanzimTarihi: '2025-05-13',
  ayniKisi: 'Evet',
  tckn: '',
  searchDogumTarihi: '',
  babaAdi: '',
  ad: '',
  soyad: '',
  cinsiyet: 'Erkek',
  anneAdi: '',
  uyruk: 'TÜRKİYE',
  medeniHal: 'Evli',
  kimlikTuru: 'NÜFUS CÜZDANI',
  kimlikSeriNo: '',
  vergiKimlikNo: '',
  vergiDairesi: '',
  cocukSayisi: '',
  maviKartTarihi: '',
  meslek: 'ACENTE',
  meslekDetay: 'ACENTE',
  egitimDurumu: 'ÜNİVERSİTE',
  gelir: '150-750',
  kurumSicilNo: '',
  isyeriUnvani: '',
  ikametgah: 'ÇUKUROVA / ADANA',
  ikametgahAdres: '',
  ikametUlke: 'TÜRKİYE',
  ikametIl: '',
  ikametIlce: '',
  ikametAdres1: '',
  ikametAdres2: '',
  ikametAdres3: '',
  iletisimAdresAyni: '',
  cepTel: '',
  cepTelBolge: '',
  evIsTel: '',
  faks: '',
  email: '',
  fatcaAbdIkamet: 'Hayır',
  mukimUlkeVarmi: 'Hayır',
  mukimUlke: '',
  mukimUlkeVergiNo: '',
  vergiMukkellefUlke: 'TÜRKİYE',
  dogduguUlke: 'TÜRKİYE',
  usGreenCard: 'Hayır',
  lehdarBelirlenmis: 'Hayır',
  lehdarMusteriTipi: 'Gerçek',
  lehdarlar: [],
  searchLehdarTckn: '',
  searchLehdarDogumTarihi: '',
  searchLehdarBabaAdi: '',
  plan: '518',
  varlikDagilimi: 'ÖNERİLEN FON',
  fonlar: [{ kod: 'AUA', ad: 'Önerilen Fon Sepeti', oran: 100 }],
  odemeBaslangic: '2025-06-03',
  odemeGunu: '10',
  odemePeriyodu: '6',
  katkiPayi: 1000,
  katki: emptyKatilimciBlock(),
})

export default function TeklifAllianzWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [teklifNo] = useState(TEKLIF_NO_DEFAULT)
  const [formData, setFormData] = useState(initialFormData)

  const visibleSteps = useMemo(
    () => buildVisibleSteps(formData),
    [formData.ayniKisi, formData.urunTipi]
  )
  const stepKey = getStepKey(visibleSteps, currentStep)
  const totalSteps = visibleSteps.length

  useEffect(() => {
    if (currentStep > totalSteps) setCurrentStep(totalSteps)
  }, [totalSteps, currentStep])

  const handleInputChange = (field, value) => {
    if (typeof field === 'object' && field !== null) {
      setFormData((prev) => ({ ...prev, ...field }))
      return
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (stepKey === 'katilimci' && !formData.ad) return
    if (stepKey === 'katki' && !formData.katki?.ad) return
    if (currentStep < totalSteps) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setCurrentStep((prev) => prev + 1)
      }, 600)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setSuccess(true)
      }, 600)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const resetWizard = () => {
    setFormData(initialFormData())
    setCurrentStep(1)
    setSuccess(false)
  }

  const mockKisiDetay = (prev) => ({
    ad: 'NEVİN İLVE',
    soyad: 'SUNEL',
    babaAdi: prev.babaAdi || 'REZA',
    anneAdi: 'MUNİB',
    searchDogumTarihi: prev.searchDogumTarihi || '1976-08-20',
    kimlikTuru: 'NÜFUS CÜZDANI',
    kimlikSeriNo: 'A123456',
    medeniHal: 'Evli',
    uyruk: 'TÜRKİYE',
    egitimDurumu: 'ÜNİVERSİTE',
    gelir: '150-750',
    meslek: 'ACENTE',
    meslekDetay: 'ACENTE',
    isyeriUnvani: 'APS',
    vergiMukkellefUlke: prev.vergiMukkellefUlke || 'TÜRKİYE',
    dogduguUlke: prev.dogduguUlke || 'TÜRKİYE',
  })

  const simulateSearch = () => {
    if (!formData.tckn.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, ...mockKisiDetay(prev) }))
      setIsLoading(false)
    }, 1000)
  }

  const simulateKatkiSearch = () => {
    const k = formData.katki || emptyKatilimciBlock()
    if (!k.tckn?.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        katki: { ...(prev.katki || emptyKatilimciBlock()), ...mockKisiDetay(prev.katki || emptyKatilimciBlock()) },
      }))
      setIsLoading(false)
    }, 1000)
  }

  const donemselTutar = (parseInt(formData.odemePeriyodu, 10) || 0) * (Number(formData.katkiPayi) || 0)

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 shrink-0 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-xl shrink-0">
              A
            </div>
            <h1 className="text-lg md:text-xl font-bold text-blue-900 tracking-tight">
              DigitALL <span className="text-blue-600 font-normal">| Allianz</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-400">Teklif No</p>
              <p className="font-mono font-bold text-blue-800">{teklifNo}</p>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <span className="text-xs font-bold">SA</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 px-4 py-4 md:py-6 overflow-x-auto shrink-0">
        <div className="flex justify-between min-w-[900px] max-w-6xl mx-auto">
          {visibleSteps.map((s) => (
            <div
              key={s.key}
              className={`flex flex-col items-center gap-2 flex-1 relative min-w-[72px] ${s.id !== totalSteps ? "after:content-[''] after:h-[2px] after:w-full after:bg-slate-100 after:absolute after:top-5 after:left-1/2 after:-z-10" : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white
                ${
                  currentStep === s.id
                    ? 'border-blue-600 text-blue-600 scale-110 shadow-lg shadow-blue-100'
                    : currentStep > s.id
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-slate-200 text-slate-400'
                }`}
              >
                {currentStep > s.id ? <CheckCircle size={20} /> : <s.Icon size={18} />}
              </div>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider text-center px-1 ${currentStep === s.id ? 'text-blue-600' : 'text-slate-400'}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-auto px-4 py-6 min-h-0">
        {success ? (
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">İşlem Başarılı!</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-base md:text-lg">
              Teklifiniz başarıyla oluşturuldu ve sisteme kaydedildi. Poliçe belgelerinizi aşağıdan indirebilirsiniz.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                className="bg-blue-800 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-blue-900 shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <FileText size={20} /> Sözleşme Dökümanları
              </button>
              <button
                type="button"
                onClick={resetWizard}
                className="bg-white text-blue-800 border border-blue-800 px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-blue-50"
              >
                Yeni Teklif Girişi
              </button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-left border border-blue-100">
                <AlertCircle className="text-blue-600 shrink-0" size={20} />
                <p className="text-sm text-blue-800">Dijital Başvuru Kaydı Alındı. SMS onayı bekleniyor.</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3 text-left border border-amber-100">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <p className="text-sm text-amber-800 italic">KATILIMCI ONBOARDING SÜRECİ TAMAMLANMADI</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative max-w-5xl mx-auto">
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-40 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
                <p className="mt-4 font-bold text-blue-900 tracking-widest uppercase text-xs">Sistem Sorgulanıyor...</p>
              </div>
            )}

            {stepKey === 'teklif' && (
              <div className="p-6 md:p-8 space-y-6">
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Teklif Tipi</h3>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {['ACENTELER/HSBC/ING', 'BGD', 'CC'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="teklifTipi"
                          checked={formData.teklifTipi === type}
                          onChange={() => handleInputChange('teklifTipi', type)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span
                          className={`text-sm font-bold ${formData.teklifTipi === type ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}
                        >
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Şirket</label>
                    <select
                      className="w-full bg-slate-100 border border-slate-200 p-3 rounded font-semibold text-slate-700 cursor-not-allowed"
                      value={formData.sirket}
                      disabled
                    >
                      <option value={SIRKET_DEFAULT}>{SIRKET_DEFAULT}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Acente Kodu</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-slate-700"
                      value={formData.acenteKodu}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Acente Adı</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-slate-700"
                      value={formData.acenteAdi}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Ürün Tipi</label>
                    <select
                      className="w-full border border-slate-200 p-3 rounded font-semibold focus:border-blue-500 outline-none"
                      value={formData.urunTipi}
                      onChange={(e) => handleInputChange('urunTipi', e.target.value)}
                    >
                      <option value="Bireysel Teklif Girişi">Bireysel Teklif Girişi</option>
                      <option value="Vakıf/Dernek Üyelik">Vakıf/Dernek Üyelik</option>
                      <option value="18 Yaş Altı">18 Yaş Altı</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 sm:items-end">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Dijital Form</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            checked={formData.dijitalForm === 'Evet'}
                            onChange={() => handleInputChange('dijitalForm', 'Evet')}
                          />{' '}
                          Evet
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            checked={formData.dijitalForm === 'Hayır'}
                            onChange={() => handleInputChange('dijitalForm', 'Hayır')}
                          />{' '}
                          Hayır
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mesafeli Satış mı?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            checked={formData.mesafeliSatis === 'Evet'}
                            onChange={() => handleInputChange('mesafeliSatis', 'Evet')}
                          />{' '}
                          Evet
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            checked={formData.mesafeliSatis === 'Hayır'}
                            onChange={() => handleInputChange('mesafeliSatis', 'Hayır')}
                          />{' '}
                          Hayır
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <section>
                  <StepBlockHeader>Aracı Bilgileri</StepBlockHeader>
                  <div className="border border-slate-200 border-t-0 rounded-b-lg p-4 md:p-5 bg-white">
                    <div className="space-y-1 max-w-xl">
                      <label className="text-xs font-bold text-slate-500 uppercase">Aracı Sicil</label>
                      <select
                        className="w-full border border-slate-200 p-3 rounded font-semibold text-slate-800 focus:border-blue-500 outline-none"
                        value={formData.araciSicil}
                        onChange={(e) => handleInputChange('araciSicil', e.target.value)}
                      >
                        {ARACI_SICIL_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section>
                  <StepBlockHeader>Ek Bilgiler</StepBlockHeader>
                  <div className="border border-slate-200 border-t-0 rounded-b-lg p-4 md:p-5 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Acente Tanzim Tarihi</label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 p-3 rounded font-semibold focus:border-blue-500 outline-none"
                        value={formData.tanzimTarihi}
                        onChange={(e) => handleInputChange('tanzimTarihi', e.target.value)}
                      />
                      <p className="text-[10px] text-slate-400 font-medium">GG/AA/YYYY</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Katılımcı ve Katkı Yapan Aynı mı?</label>
                      <div className="flex gap-6 pt-1">
                        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="ayniKisi"
                            checked={formData.ayniKisi === 'Evet'}
                            onChange={() => handleInputChange('ayniKisi', 'Evet')}
                            className="w-4 h-4 text-blue-600"
                          />
                          Evet
                        </label>
                        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="ayniKisi"
                            checked={formData.ayniKisi === 'Hayır'}
                            onChange={() =>
                              handleInputChange({
                                ayniKisi: 'Hayır',
                                katki: formData.katki || emptyKatilimciBlock(),
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          Hayır
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {stepKey === 'katilimci' && (
              <KatilimciStep
                formData={formData}
                onChange={handleInputChange}
                onSearch={simulateSearch}
                isLoading={isLoading}
                aramaBaslik="Katılımcı Bilgileri Arama"
              />
            )}

            {stepKey === 'katki' && (
              <KatilimciStep
                formData={formData.katki || emptyKatilimciBlock()}
                onChange={(patch) =>
                  handleInputChange({
                    katki: { ...(formData.katki || emptyKatilimciBlock()), ...patch },
                  })
                }
                onSearch={simulateKatkiSearch}
                isLoading={isLoading}
                aramaBaslik="Katkı Yapan Bilgileri Arama"
              />
            )}

            {stepKey === 'yt1' && (
              <WizardSectionStep
                title="Yasal Temsilci 1"
                description="Birinci yasal temsilci bilgileri bu adımda girilecektir."
              />
            )}

            {stepKey === 'yt2' && (
              <WizardSectionStep
                title="Yasal Temsilci 2"
                description="İkinci yasal temsilci bilgileri bu adımda girilecektir."
              />
            )}

            {stepKey === 'lehdar' && <LehdarStep formData={formData} onChange={handleInputChange} />}

            {stepKey === 'plan' && <PlanFonStep formData={formData} onChange={handleInputChange} />}

            {stepKey === 'odeme' && (
              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-500 uppercase tracking-tighter">Ödeme Başlangıç Tarihi</label>
                    <input
                      type="date"
                      value={formData.odemeBaslangic}
                      onChange={(e) => handleInputChange('odemeBaslangic', e.target.value)}
                      className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-600 outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-500 uppercase tracking-tighter">Ödeme Günü</label>
                    <select
                      className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-600 outline-none font-bold"
                      value={formData.odemeGunu}
                      onChange={(e) => handleInputChange('odemeGunu', e.target.value)}
                    >
                      {[...Array(28)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-red-500 uppercase tracking-tighter">Ödeme Periyodu</label>
                    <select
                      value={formData.odemePeriyodu}
                      onChange={(e) => handleInputChange('odemePeriyodu', e.target.value)}
                      className="w-full border-b-2 border-slate-100 p-2 focus:border-blue-600 outline-none font-bold"
                    >
                      <option value="1">AYLIK ÖDEME</option>
                      <option value="3">ÜÇ AYLIK ÖDEME</option>
                      <option value="6">ALTI AYLIK ÖDEME</option>
                      <option value="12">YILLIK ÖDEME</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Aylık Katkı Payı Tutarı</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('katkiPayi', Math.max(500, formData.katkiPayi - 100))}
                        className="w-10 h-10 border rounded flex items-center justify-center font-bold text-xl hover:bg-slate-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={formData.katkiPayi}
                        onChange={(e) => handleInputChange('katkiPayi', parseInt(e.target.value, 10) || 0)}
                        className="flex-1 border-b-2 border-slate-100 p-2 text-center font-bold text-xl outline-none min-w-0"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('katkiPayi', formData.katkiPayi + 100)}
                        className="w-10 h-10 border rounded flex items-center justify-center font-bold text-xl hover:bg-slate-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 p-8 rounded-xl text-center space-y-2 teklif-pulse">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Dönemsel Tahsil Edilecek Tutar</p>
                  <p className="text-3xl font-black text-red-600 tracking-tight">
                    {formData.odemePeriyodu} x {formData.katkiPayi} = {donemselTutar.toLocaleString('tr-TR')} TL
                  </p>
                  <p className="text-[10px] text-red-400 font-bold italic">
                    **Teklif ödeme yöntemi ve ödeme aracı müşteri tarafından belirlenecektir!
                  </p>
                </div>
              </div>
            )}

            {stepKey === 'ozet' && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-blue-900 font-black text-xl italic uppercase tracking-tighter">Özet Teklif Bilgileri</h3>
                  <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">Kontrol Noktası</div>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 teklif-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg relative group">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Ürün Tipi</p>
                      <p className="text-sm font-bold text-slate-800">{formData.urunTipi}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Başlangıç Tarihi</p>
                      <p className="text-sm font-bold text-slate-800">{formData.tanzimTarihi}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded shadow-sm border border-slate-200 text-blue-600 hover:bg-slate-50"
                      title="Düzenle"
                    >
                      <Edit size={14} />
                    </button>
                  </div>

                  <div className="bg-white border border-slate-100 p-4 rounded-lg relative group shadow-sm">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Katılımcı Bilgileri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ad Soyad</p>
                        <p className="text-sm font-bold text-slate-800">
                          {formData.ad || '—'} {formData.soyad || ''}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">TC Kimlik No</p>
                        <p className="text-sm font-mono font-bold text-slate-800">{formData.tckn || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Adres</p>
                        <p className="text-sm font-bold text-slate-800">{formData.ikametgahAdres || formData.ikametgah || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Faks Telefonu</p>
                        <p className="text-sm font-bold text-slate-800">{formatTelefon(formData.faks)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">E-Posta</p>
                        <p className="text-sm font-bold text-slate-800">{formData.email || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Doğum Tarihi</p>
                        <p className="text-sm font-bold text-slate-800">
                          {formData.searchDogumTarihi
                            ? new Date(formData.searchDogumTarihi).toLocaleDateString('tr-TR')
                            : '—'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Meslek</p>
                        <p className="text-sm font-bold text-slate-800">{formData.meslekDetay || formData.meslek || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ev Telefonu</p>
                        <p className="text-sm font-bold text-slate-800">{formatTelefon(formData.evIsTel)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cep Telefonu</p>
                        <p className="text-sm font-bold text-slate-800">{formatTelefon(formData.cepTel)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded shadow-sm border border-slate-200 text-blue-600 hover:bg-slate-50"
                      title="Düzenle"
                    >
                      <Edit size={14} />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Katkı Yapan Bilgileri</h4>
                    <p className="text-sm font-bold text-slate-800">
                      {formData.ayniKisi === 'Evet'
                        ? 'Katılımcı ile Katkı Yapan Aynı Kişidir!'
                        : 'Katılımcı ile Katkı Yapan Farklı Kişidir.'}
                    </p>
                    {formData.ayniKisi === 'Hayır' && formData.katki?.ad && (
                      <p className="text-sm text-slate-700 mt-2">
                        Katkı Yapan: {formData.katki.ad} {formData.katki.soyad}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Lehdar Bilgileri</h4>
                    {formData.lehdarBelirlenmis === 'Hayır' ? (
                      <p className="text-sm font-bold text-slate-800">Kanuni Varisler</p>
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{(formData.lehdarlar || []).length} adet lehdar tanımlı</p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Plan / Fon Bilgileri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <p className="text-sm font-bold text-slate-800">{PLAN_LABELS[formData.plan] || formData.plan}</p>
                      <p className="text-sm font-bold text-slate-800 md:text-right">{formData.varlikDagilimi}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[480px]">
                        <thead className="border-b border-slate-200">
                          <tr className="text-[10px] font-bold uppercase text-slate-500">
                            <th className="py-2">Fon Kodu</th>
                            <th className="py-2">Fon Açıklaması</th>
                            <th className="py-2 text-right">Oran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(formData.fonlar || []).map((f) => (
                            <tr key={f.kod} className="border-b border-slate-100 text-sm font-bold text-slate-800">
                              <td className="py-2">{f.kod}</td>
                              <td className="py-2">{f.ad || (f.oran === 100 ? 'ÖNERİLEN FON' : '—')}</td>
                              <td className="py-2 text-right">{f.oran ?? 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Ödeme Bilgileri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Ödeme Şekli</span>
                          <span className="text-sm font-bold text-slate-800">{ODEME_SEKLI_LABEL}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Katkı Payı Tutarı</span>
                          <span className="text-sm font-bold text-red-600">{formData.katkiPayi}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Ödeme Günü</span>
                          <span className="text-sm font-bold text-slate-800">{formData.odemeGunu}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Ödeme Sıklığı</span>
                          <span className="text-sm font-bold text-slate-800">
                            {ODEME_PERIYOD_LABELS[formData.odemePeriyodu] || `${formData.odemePeriyodu} Ayda Bir`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Ödeme Başlangıç Tarihi</span>
                          <span className="text-sm font-bold text-slate-800">
                            {formData.odemeBaslangic
                              ? new Date(formData.odemeBaslangic).toLocaleDateString('tr-TR')
                              : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Başlangıç Toplu Ödemesi</span>
                          <span className="text-sm font-bold text-slate-800">—</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <footer className="bg-slate-50 border-t border-slate-200 px-6 md:px-8 py-6 flex flex-wrap justify-between items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={handleBack}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition duration-200 ${
                  currentStep === 1 ? 'invisible' : 'text-blue-800 border border-blue-800 bg-white hover:bg-blue-50'
                }`}
              >
                <ChevronLeft size={20} /> GERİ
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <button type="button" className="text-slate-400 font-bold text-sm hover:text-slate-600">
                  Taslağa Kaydet
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (stepKey === 'katilimci' && !formData.ad) || (stepKey === 'katki' && !formData.katki?.ad)
                  }
                  className={`flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-bold text-white transition duration-300 shadow-xl ${
                    (stepKey === 'katilimci' && !formData.ad) || (stepKey === 'katki' && !formData.katki?.ad)
                      ? 'bg-slate-300 cursor-not-allowed'
                      : stepKey === 'ozet'
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                        : 'bg-blue-800 hover:bg-blue-900 shadow-blue-100'
                  }`}
                >
                  {stepKey === 'ozet' ? 'ONAYLA VE BİTİR' : 'İLERİ'} <ChevronRight size={20} />
                </button>
              </div>
            </footer>
          </div>
        )}
      </main>

      <style>{`
        .teklif-scrollbar::-webkit-scrollbar { width: 4px; }
        .teklif-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .teklif-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes teklif-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(0.99); }
        }
        .teklif-pulse { animation: teklif-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  )
}
