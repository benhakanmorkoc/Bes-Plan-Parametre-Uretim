/**
 * BASELINE v1-digitall — 2025-05-15
 * Donmuş kopya; import edilmez. Geri yükleme: baselines/README.md
 */
import { useState } from 'react'
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

const FON_DAGILIM = [
  { label: 'TL Sabit Getiri', val: 31, color: 'bg-emerald-500' },
  { label: 'TL Hisse Senedi', val: 23, color: 'bg-blue-500' },
  { label: 'Eurobond', val: 17, color: 'bg-amber-500' },
  { label: 'Yabancı Hisse', val: 18, color: 'bg-indigo-500' },
  { label: 'Altın', val: 11, color: 'bg-yellow-500' },
]

const initialFormData = () => ({
  teklifTipi: 'BGD',
  acenteKodu: '5',
  acenteAdi: 'EGE BÖLGE MÜDÜRLÜĞÜ',
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
  meslek: 'ACENTE',
  gelir: '150-750',
  ikametgah: 'ÇUKUROVA / ADANA',
  cepTel: '+90 542 538 33 94',
  mukimUlkeVarmi: 'Hayır',
  mukimUlke: '',
  mukimUlkeVergiNo: '',
  vergiMukkellefUlke: 'TÜRKİYE',
  dogduguUlke: 'TÜRKİYE',
  usGreenCard: 'Hayır',
  lehdarBelirlenmis: 'Hayır',
  lehdarlar: [],
  searchLehdarTckn: '',
  plan: '518',
  varlikDagilimi: 'ÖNERİLEN FON',
  fonlar: [{ kod: 'AUA', ad: 'Önerilen Fon Sepeti', oran: 100 }],
  odemeBaslangic: '2025-06-03',
  odemeGunu: '10',
  odemePeriyodu: '6',
  katkiPayi: 1000,
})

export default function TeklifAllianzWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [teklifNo] = useState(TEKLIF_NO_DEFAULT)
  const [formData, setFormData] = useState(initialFormData)

  const steps = [
    { id: 1, label: 'Teklif Bilgileri', icon: <FileText size={18} /> },
    { id: 2, label: 'Katılımcı', icon: <User size={18} /> },
    { id: 3, label: 'Lehdar', icon: <User size={18} /> },
    { id: 4, label: 'Plan/Fon', icon: <PieChart size={18} /> },
    { id: 5, label: 'Ödeme', icon: <CreditCard size={18} /> },
    { id: 6, label: 'Özet', icon: <CheckCircle size={18} /> },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep === 2 && !formData.ad) return
    if (currentStep < 6) {
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

  const simulateSearch = () => {
    if (!formData.tckn.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        ad: 'NEVİN İLVE',
        soyad: 'SUNEL',
        babaAdi: 'REZA',
        anneAdi: 'MUNİB',
        searchDogumTarihi: prev.searchDogumTarihi || '1976-08-20',
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
        <div className="flex justify-between min-w-[560px] max-w-4xl mx-auto">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex flex-col items-center gap-2 flex-1 relative ${s.id !== 6 ? "after:content-[''] after:h-[2px] after:w-full after:bg-slate-100 after:absolute after:top-5 after:left-1/2 after:-z-10" : ''}`}
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
                {currentStep > s.id ? <CheckCircle size={20} /> : s.icon}
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

            {currentStep === 1 && (
              <div className="p-6 md:p-8 space-y-8">
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
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-6 md:p-8 space-y-8">
                <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <Search size={16} /> Katılımcı Bilgileri Arama
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-red-500 uppercase">TCKN/VKN/YKN</label>
                      <input
                        className="w-full border-b-2 border-slate-200 p-2 focus:border-blue-600 outline-none bg-transparent font-mono"
                        placeholder="Zorunlu alan!"
                        value={formData.tckn}
                        onChange={(e) => handleInputChange('tckn', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-red-500 uppercase">Doğum Tarihi</label>
                      <input
                        type="date"
                        className="w-full border-b-2 border-slate-200 p-2 focus:border-blue-600 outline-none bg-transparent"
                        value={formData.searchDogumTarihi}
                        onChange={(e) => handleInputChange('searchDogumTarihi', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={simulateSearch}
                      className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2"
                    >
                      <Search size={16} /> Ara
                    </button>
                  </div>
                </section>

                {formData.ad && (
                  <div className="space-y-8 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Ad Soyad</label>
                        <p className="font-bold text-lg text-slate-800">
                          {formData.ad} {formData.soyad}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Cinsiyet</label>
                        <p className="font-semibold text-slate-700">{formData.cinsiyet}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Meslek</label>
                        <select
                          className="w-full border-b-2 border-slate-100 p-1 font-semibold text-slate-700 outline-none focus:border-blue-600"
                          value={formData.meslek}
                          onChange={(e) => handleInputChange('meslek', e.target.value)}
                        >
                          <option value="ACENTE">ACENTE</option>
                          <option value="MÜHENDİS">MÜHENDİS</option>
                          <option value="DOKTOR">DOKTOR</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Adres & İletişim</h4>
                        <button type="button" className="text-blue-700 text-xs font-bold flex items-center gap-1">
                          <Plus size={14} /> Yeni Ekle
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch gap-4 text-sm font-semibold text-slate-700">
                        <div className="bg-white p-3 rounded border border-slate-200 flex-1 flex justify-between items-center shadow-sm">
                          <span>{formData.ikametgah}</span>
                          <Edit size={14} className="text-blue-600 shrink-0" />
                        </div>
                        <div className="bg-white p-3 rounded border border-slate-200 flex-1 flex justify-between items-center shadow-sm">
                          <span>{formData.cepTel}</span>
                          <Edit size={14} className="text-blue-600 shrink-0" />
                        </div>
                      </div>
                    </div>

                    <section className="space-y-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">FATCA / CRS Bilgileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600">Vergi Mükellefi Olduğu Ülke</label>
                          <select
                            className="w-full border-b-2 border-slate-100 p-1 font-semibold outline-none focus:border-blue-600"
                            value={formData.vergiMukkellefUlke}
                            onChange={(e) => handleInputChange('vergiMukkellefUlke', e.target.value)}
                          >
                            <option value="TÜRKİYE">TÜRKİYE</option>
                            <option value="ALMANYA">ALMANYA</option>
                            <option value="ABD">ABD</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-600">Mukim Ülke Var mı?</label>
                          <div className="flex gap-6 mt-1">
                            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                              <input
                                type="radio"
                                checked={formData.mukimUlkeVarmi === 'Evet'}
                                onChange={() => handleInputChange('mukimUlkeVarmi', 'Evet')}
                              />{' '}
                              Evet
                            </label>
                            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                              <input
                                type="radio"
                                checked={formData.mukimUlkeVarmi === 'Hayır'}
                                onChange={() => handleInputChange('mukimUlkeVarmi', 'Hayır')}
                              />{' '}
                              Hayır
                            </label>
                          </div>
                        </div>
                      </div>
                      {formData.mukimUlkeVarmi === 'Evet' && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-amber-800 uppercase">Mukim Adres</label>
                              <button
                                type="button"
                                className="w-full bg-white border border-amber-300 p-2 rounded text-xs font-bold text-amber-700 flex items-center justify-center gap-2"
                              >
                                <Plus size={14} /> Mukim Adres Ekle
                              </button>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-amber-800 uppercase">Vergi Kimlik No (TIN)</label>
                              <input
                                className="w-full bg-white border border-amber-300 p-2 rounded text-sm outline-none focus:border-amber-500"
                                placeholder="Zorunlu alan!"
                                value={formData.mukimUlkeVergiNo}
                                onChange={(e) => handleInputChange('mukimUlkeVergiNo', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </section>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-6 md:p-8 space-y-8">
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lehdar Belirlenmiş mi?</h3>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        checked={formData.lehdarBelirlenmis === 'Evet'}
                        onChange={() => handleInputChange('lehdarBelirlenmis', 'Evet')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className={`text-sm font-bold ${formData.lehdarBelirlenmis === 'Evet' ? 'text-slate-800' : 'text-slate-400'}`}>Evet</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        checked={formData.lehdarBelirlenmis === 'Hayır'}
                        onChange={() => handleInputChange('lehdarBelirlenmis', 'Hayır')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className={`text-sm font-bold ${formData.lehdarBelirlenmis === 'Hayır' ? 'text-slate-800' : 'text-slate-400'}`}>Hayır</span>
                    </label>
                  </div>
                </section>

                {formData.lehdarBelirlenmis === 'Hayır' ? (
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded flex items-center gap-4">
                    <AlertCircle className="text-blue-600 shrink-0" />
                    <p className="text-blue-900 font-semibold text-sm italic tracking-tight">Kanuni Varisler Lehdar Olarak Tanımlanacaktır.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-red-500 uppercase tracking-tighter">Lehdar Kimlik No</label>
                          <input
                            className="w-full border-b border-slate-200 p-2 bg-transparent outline-none focus:border-blue-600 font-mono"
                            placeholder="Zorunlu alan!"
                            value={formData.searchLehdarTckn}
                            onChange={(e) => handleInputChange('searchLehdarTckn', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1 md:text-right md:pt-4">
                          <button type="button" className="bg-blue-800 text-white px-8 py-2 rounded font-bold text-sm shadow-md hover:bg-blue-900 w-full md:w-auto">
                            Ara
                          </button>
                        </div>
                      </div>
                    </div>
                    <table className="w-full text-left text-xs uppercase font-bold text-slate-400">
                      <thead className="border-b">
                        <tr>
                          <th className="pb-3">Kimlik No</th>
                          <th className="pb-3">Adı Soyadı</th>
                          <th className="pb-3">Pay %</th>
                          <th className="pb-3 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b text-slate-600">
                          <td className="py-4 italic text-center" colSpan={4}>
                            Henüz lehdar eklenmedi. Toplam pay %100 olmalıdır.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</label>
                    <select
                      className="w-full border border-slate-200 p-3 rounded font-bold text-blue-900 shadow-sm focus:border-blue-600 outline-none"
                      value={formData.plan}
                      onChange={(e) => handleInputChange('plan', e.target.value)}
                    >
                      <option value="518">518 - KİŞİYE ÖZEL PLAN</option>
                      <option value="519">519 - SAFRAN PLAN</option>
                      <option value="526">526 - MERCAN PLAN</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Varlık Dağılımı</label>
                    <select
                      className="w-full border border-slate-200 p-3 rounded font-bold text-blue-900 shadow-sm focus:border-blue-600 outline-none"
                      value={formData.varlikDagilimi}
                      onChange={(e) => handleInputChange('varlikDagilimi', e.target.value)}
                    >
                      <option value="ÖNERİLEN FON">ÖNERİLEN FON</option>
                      <option value="SERBEST DAĞILIM">SERBEST DAĞILIM</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 md:p-8 rounded-xl relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 space-y-6 w-full">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <h4 className="text-blue-400 font-bold tracking-widest text-xs">MODEL PORTFÖY: AUA</h4>
                        <div className="flex gap-2">
                          <button type="button" className="bg-green-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase hover:bg-green-700">
                            Fazla Döviz
                          </button>
                          <button type="button" className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase hover:bg-blue-700">
                            Önerilene Dön
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {FON_DAGILIM.map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-[10px] uppercase font-bold">
                              <span className="text-slate-400">{item.label}</span>
                              <span>%{item.val}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full">
                              <div
                                className={`${item.color} h-full rounded-full transition-all duration-1000`}
                                style={{ width: `${item.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-[16px] border-slate-800 flex flex-col items-center justify-center relative shrink-0">
                      <PieChart size={64} className="text-blue-400 opacity-20 absolute" />
                      <span className="text-3xl font-bold">%100</span>
                      <span className="text-[10px] text-blue-400 font-bold uppercase">Toplam Pay</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
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

            {currentStep === 6 && (
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Doğum Tarihi</p>
                        <p className="text-sm font-bold text-slate-800">
                          {formData.searchDogumTarihi
                            ? new Date(formData.searchDogumTarihi).toLocaleDateString('tr-TR')
                            : '—'}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-full">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">İkametgah</p>
                        <p className="text-sm font-bold text-slate-800">{formData.ikametgah}</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Plan / Fon</h4>
                      <p className="text-sm font-bold text-slate-800 mb-1">{PLAN_LABELS[formData.plan] || formData.plan}</p>
                      <p className="text-xs text-blue-600 font-bold uppercase">{formData.varlikDagilimi} (%100)</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="text-[10px] font-black text-blue-800 uppercase mb-4 border-b pb-1">Ödeme</h4>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500">Katkı Payı</span>
                        <span className="text-sm font-bold text-red-600">{formData.katkiPayi} TL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500">Sıklık</span>
                        <span className="text-sm font-bold text-slate-800">
                          {ODEME_PERIYOD_LABELS[formData.odemePeriyodu] || `${formData.odemePeriyodu} Ayda Bir`}
                        </span>
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
                  disabled={currentStep === 2 && !formData.ad}
                  className={`flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-bold text-white transition duration-300 shadow-xl ${
                    currentStep === 2 && !formData.ad
                      ? 'bg-slate-300 cursor-not-allowed'
                      : currentStep === 6
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                        : 'bg-blue-800 hover:bg-blue-900 shadow-blue-100'
                  }`}
                >
                  {currentStep === 6 ? 'ONAYLA VE BİTİR' : 'İLERİ'} <ChevronRight size={20} />
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
