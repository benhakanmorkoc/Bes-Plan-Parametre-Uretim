import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Check, AlertCircle } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'

const WIZARD_STEPS = [
  { id: 1, label: 'Teklif Bilgileri' },
  { id: 2, label: 'Katılımcı Arama' },
  { id: 3, label: 'Katılımcı Bilgileri' },
  { id: 4, label: 'Katkı Yapan' },
  { id: 5, label: 'Yasal Temsilci' },
  { id: 6, label: 'Lehdar' },
  { id: 7, label: 'Plan ve Fon' },
]

const TEKLIF_TIPLERI = ['BGD', 'YKB', 'ING', 'Acente', 'Çağrı Merkezi']
const URUN_TIPLERI = ['Bireysel Teklif Girişi', 'Gruba Bağlı', 'Kurumsal']
const EVET_HAYIR = ['Evet', 'Hayır']

const MOCK_KPS = {
  '12345678901': {
    ad: 'İLVE',
    soyad: 'SUNEL',
    babaAdi: 'REZA',
    anneAdi: 'MUNİB',
    dogumTarihi: '20/08/1976',
    cinsiyet: 'Erkek',
    uyruk: 'TÜRKİYE',
    medeniHal: 'Evli',
    kimlikTuru: 'NÜFUS CÜZDANI',
    kimlikSeriNo: 'A123456',
  },
}

const FON_DAGILIM_DEFAULT = [
  { tip: 'TL Sabit Getiri', oran: 31 },
  { tip: 'TL Hisse Senedi', oran: 23 },
  { tip: 'Eurobond', oran: 17 },
  { tip: 'Yabancı Hisse', oran: 18 },
  { tip: 'Altın', oran: 11 },
]

const initialTeklif = () => ({
  teklifTipi: 'BGD',
  sirket: 'Allianz Yaşam ve Emeklilik A.Ş.',
  acenteKodu: '5',
  acenteAdi: 'EGE BÖLGE MÜDÜRLÜĞÜ',
  urunTipi: 'Bireysel Teklif Girişi',
  dijitalForm: 'Evet',
  mesafeliSatis: 'Hayır',
  araciSicil: '11270208416 - SEMA ARIK',
  acenteTanzimTarihi: new Date().toLocaleDateString('tr-TR'),
  katilimciKatkıAyni: 'Evet',
})

const initialKatilimci = () => ({
  tckn: '',
  dogumTarihi: '',
  babaAdi: '',
  kimlikTuru: '',
  kimlikSeriNo: '',
  cinsiyet: '',
  ad: '',
  soyad: '',
  anneAdi: '',
  uyruk: 'TÜRKİYE',
  medeniHal: '',
  vergiDairesi: '',
  cocukSayisi: '',
  egitimDurumu: '',
  ortalamaGelir: '',
  meslek: '',
  kurumSicilNo: '',
  isyeriUnvani: '',
  cepTel: '',
  email: '',
  fatcaVergiUlke: 'TÜRKİYE',
  fatcaDogumUlke: 'TÜRKİYE',
  fatcaAbdIkamet: 'Hayır',
  fatcaGreenCard: 'Hayır',
  mukimUlke: 'Hayır',
})

function genTeklifNo() {
  return String(32000000 + Math.floor(Math.random() * 999999))
}

function Field({ label, required, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className="block text-[11px] font-semibold text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-[10px] text-slate-500 mt-0.5">{hint}</span>}
    </label>
  )
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">{title}</h3>
      {children}
    </section>
  )
}

export default function TeklifAllianzWizard() {
  const [step, setStep] = useState(1)
  const [teklifNo, setTeklifNo] = useState('')
  const [teklif, setTeklif] = useState(initialTeklif)
  const [katilimci, setKatilimci] = useState(initialKatilimci)
  const [kpsBulundu, setKpsBulundu] = useState(false)
  const [lehdarBelirlenmis, setLehdarBelirlenmis] = useState('Hayır')
  const [planKod, setPlanKod] = useState('518')
  const [, setPlanAd] = useState('KİŞİYE ÖZEL PLAN')
  const [varlikDagilim, setVarlikDagilim] = useState('ÖNERİLEN FON')
  const [fonGrid, setFonGrid] = useState(FON_DAGILIM_DEFAULT)

  const setT = (patch) => setTeklif((p) => ({ ...p, ...patch }))
  const setK = (patch) => setKatilimci((p) => ({ ...p, ...patch }))

  const skipKatkıYapan = teklif.katilimciKatkıAyni === 'Evet'
  const skipYasalTemsilci = skipKatkıYapan

  const visibleSteps = useMemo(
    () =>
      WIZARD_STEPS.filter((s) => {
        if (s.id === 4 && skipKatkıYapan) return false
        if (s.id === 5 && skipYasalTemsilci) return false
        return true
      }),
    [skipKatkıYapan, skipYasalTemsilci],
  )

  const handleKpsAra = () => {
    const key = katilimci.tckn.replace(/\D/g, '')
    const mock = MOCK_KPS[key]
    if (mock) {
      setKatilimci((p) => ({
        ...p,
        ...mock,
        babaAdi: p.babaAdi || mock.babaAdi,
      }))
      setKpsBulundu(true)
      return
    }
    if (key.length === 11) {
      setKatilimci((p) => ({
        ...p,
        ad: 'DEMO',
        soyad: 'KATILIMCI',
        cinsiyet: 'Erkek',
        babaAdi: p.babaAdi || 'BABA',
        anneAdi: 'ANNE',
        dogumTarihi: p.dogumTarihi || '01/01/1990',
        kimlikTuru: 'NÜFUS CÜZDANI',
        kimlikSeriNo: 'A000000',
        medeniHal: 'Bekar',
      }))
      setKpsBulundu(true)
      return
    }
    alert('Geçerli TCKN giriniz veya demo için 12345678901 kullanın.')
    setKpsBulundu(false)
  }

  const validateStep = (s) => {
    if (s === 1) return true
    if (s === 2) {
      if (!katilimci.tckn.trim()) {
        alert('TCKN / VKN / YKN zorunludur.')
        return false
      }
      if (!katilimci.dogumTarihi.trim()) {
        alert('Doğum tarihi zorunludur.')
        return false
      }
      if (!kpsBulundu) {
        alert('Önce Ara ile katılımcı sorgulayınız.')
        return false
      }
      return true
    }
    if (s === 3) {
      if (!katilimci.cepTel.trim() || !katilimci.email.trim()) {
        alert('Cep telefonu ve e-posta zorunludur.')
        return false
      }
      return true
    }
    return true
  }

  const nextStepId = () => {
    let n = step + 1
    if (n === 4 && skipKatkıYapan) n = 6
    if (n === 5 && skipYasalTemsilci) n = 6
    return n
  }

  const prevStepId = () => {
    let n = step - 1
    if (n === 5 && skipYasalTemsilci) n = 3
    if (n === 4 && skipKatkıYapan) n = 3
    return n
  }

  const handleSonraki = () => {
    if (!validateStep(step)) return
    if (step === 1 && !teklifNo) setTeklifNo(genTeklifNo())
    const n = nextStepId()
    if (n <= 7) setStep(n)
  }

  const handleOnceki = () => {
    const n = prevStepId()
    if (n >= 1) setStep(n)
  }

  const handleTamamla = () => {
    alert(`Teklif ${teklifNo} kaydedildi (prototip). Sonraki adımda ödeme ve belge adımları eklenecek.`)
  }

  const fonToplam = fonGrid.reduce((a, r) => a + (Number(r.oran) || 0), 0)

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Allianz Teklif Girişi"
        description="Allianz Başvuru Ekranları dokümanına göre adım adım teklif süreci (Sprint 1: adımlar 1–7)"
        right={
          teklifNo ? (
            <span className="text-sm font-mono font-semibold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              Teklif No: {teklifNo}
            </span>
          ) : null
        }
      />

      <div className="px-4 md:px-6 py-3 border-b border-slate-100 overflow-x-auto">
        <ol className="flex gap-1 min-w-max">
          {visibleSteps.map((s) => {
            const active = s.id === step
            const done = s.id < step
            return (
              <li key={s.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    active ? 'bg-blue-600 text-white' : done ? 'bg-blue-50 text-blue-800 hover:bg-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${active ? 'bg-white/20' : done ? 'bg-blue-200' : 'bg-slate-200'}`}>
                    {done ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  {s.label}
                </button>
                {s.id !== visibleSteps[visibleSteps.length - 1].id && <ChevronRight className="w-4 h-4 text-slate-300 mx-0.5 shrink-0" />}
              </li>
            )
          })}
        </ol>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-6 py-4">
        {step === 1 && (
          <div className="max-w-4xl space-y-4">
            <SectionCard title="Teklif Bilgileri">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Field label="Teklif Tipi" required>
                  <select className="form-select w-full" value={teklif.teklifTipi} onChange={(e) => setT({ teklifTipi: e.target.value })}>
                    {TEKLIF_TIPLERI.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Şirket" required>
                  <input className="form-input w-full bg-slate-50" readOnly value={teklif.sirket} />
                </Field>
                <Field label="Acente Kodu" required>
                  <input className="form-input w-full" value={teklif.acenteKodu} onChange={(e) => setT({ acenteKodu: e.target.value })} />
                </Field>
                <Field label="Acente Adı" required>
                  <input className="form-input w-full" value={teklif.acenteAdi} onChange={(e) => setT({ acenteAdi: e.target.value })} />
                </Field>
                <Field label="Ürün Tipi" required>
                  <select className="form-select w-full" value={teklif.urunTipi} onChange={(e) => setT({ urunTipi: e.target.value })}>
                    {URUN_TIPLERI.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Dijital Form" required>
                  <select className="form-select w-full" value={teklif.dijitalForm} onChange={(e) => setT({ dijitalForm: e.target.value })}>
                    {EVET_HAYIR.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Mesafeli Satış mı?" required>
                  <select className="form-select w-full" value={teklif.mesafeliSatis} onChange={(e) => setT({ mesafeliSatis: e.target.value })}>
                    {EVET_HAYIR.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Katılımcı ve Katkı Yapan Aynı mı?" required hint="Evet ise 4–5. adımlar atlanır.">
                  <select className="form-select w-full" value={teklif.katilimciKatkıAyni} onChange={(e) => setT({ katilimciKatkıAyni: e.target.value })}>
                    {EVET_HAYIR.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </SectionCard>
            <SectionCard title="Aracı Bilgileri">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Aracı Sicil" required>
                  <input className="form-input w-full" value={teklif.araciSicil} onChange={(e) => setT({ araciSicil: e.target.value })} />
                </Field>
                <Field label="Acente Tanzim Tarihi" required>
                  <input className="form-input w-full" value={teklif.acenteTanzimTarihi} onChange={(e) => setT({ acenteTanzimTarihi: e.target.value })} />
                </Field>
              </div>
            </SectionCard>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-3xl space-y-4">
            <SectionCard title="Arama Kriterleri">
              {teklifNo && (
                <p className="text-xs text-slate-600 mb-2">
                  Teklif No: <strong className="font-mono text-slate-900">{teklifNo}</strong>
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="TCKN / VKN / YKN" required>
                  <input className="form-input w-full font-mono" maxLength={11} value={katilimci.tckn} onChange={(e) => setK({ tckn: e.target.value })} placeholder="11 haneli TCKN" />
                </Field>
                <Field label="Doğum Tarihi" required>
                  <input className="form-input w-full" placeholder="GG/AA/YYYY" value={katilimci.dogumTarihi} onChange={(e) => setK({ dogumTarihi: e.target.value })} />
                </Field>
                <Field label="Baba Adı">
                  <input className="form-input w-full" value={katilimci.babaAdi} onChange={(e) => setK({ babaAdi: e.target.value })} />
                </Field>
                <div className="flex items-end">
                  <PrimaryButton onClick={handleKpsAra}>
                    <Search className="w-4 h-4" /> Ara
                  </PrimaryButton>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Demo: TCKN <code className="bg-slate-100 px-1 rounded">12345678901</code> (İLVE SUNEL) veya herhangi 11 haneli numara.</p>
            </SectionCard>
            {kpsBulundu && (
              <details open className="rounded-lg border border-emerald-200 bg-emerald-50/40">
                <summary className="px-4 py-3 text-sm font-semibold text-emerald-900 cursor-pointer">Katılımcı Bilgileri Detay</summary>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 pb-4 text-sm">
                  <div><dt className="text-slate-500 text-xs">Ad Soyad</dt><dd className="font-medium">{katilimci.ad} {katilimci.soyad}</dd></div>
                  <div><dt className="text-slate-500 text-xs">Doğum</dt><dd>{katilimci.dogumTarihi}</dd></div>
                  <div><dt className="text-slate-500 text-xs">Baba Adı</dt><dd>{katilimci.babaAdi}</dd></div>
                  <div><dt className="text-slate-500 text-xs">Cinsiyet</dt><dd>{katilimci.cinsiyet}</dd></div>
                </dl>
              </details>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="max-w-4xl space-y-4">
            <SectionCard title="Kimlik">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Field label="Kimlik Türü"><input className="form-input w-full" value={katilimci.kimlikTuru} onChange={(e) => setK({ kimlikTuru: e.target.value })} /></Field>
                <Field label="Kimlik Seri No"><input className="form-input w-full" value={katilimci.kimlikSeriNo} onChange={(e) => setK({ kimlikSeriNo: e.target.value })} /></Field>
                <Field label="Cinsiyet"><input className="form-input w-full" value={katilimci.cinsiyet} onChange={(e) => setK({ cinsiyet: e.target.value })} /></Field>
                <Field label="Ad"><input className="form-input w-full" value={katilimci.ad} onChange={(e) => setK({ ad: e.target.value })} /></Field>
                <Field label="Soyad"><input className="form-input w-full" value={katilimci.soyad} onChange={(e) => setK({ soyad: e.target.value })} /></Field>
                <Field label="Uyruk"><input className="form-input w-full" value={katilimci.uyruk} onChange={(e) => setK({ uyruk: e.target.value })} /></Field>
                <Field label="Medeni Hal"><input className="form-input w-full" value={katilimci.medeniHal} onChange={(e) => setK({ medeniHal: e.target.value })} /></Field>
              </div>
            </SectionCard>
            <SectionCard title="Eğitim / Meslek">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Field label="Eğitim Durumu"><input className="form-input w-full" placeholder="ÜNİVERSİTE" value={katilimci.egitimDurumu} onChange={(e) => setK({ egitimDurumu: e.target.value })} /></Field>
                <Field label="Ortalama Gelir"><input className="form-input w-full" placeholder="150-750 (USD)" value={katilimci.ortalamaGelir} onChange={(e) => setK({ ortalamaGelir: e.target.value })} /></Field>
                <Field label="Meslek"><input className="form-input w-full" placeholder="ACENTE" value={katilimci.meslek} onChange={(e) => setK({ meslek: e.target.value })} /></Field>
                <Field label="İşyeri Ünvanı"><input className="form-input w-full" value={katilimci.isyeriUnvani} onChange={(e) => setK({ isyeriUnvani: e.target.value })} /></Field>
              </div>
            </SectionCard>
            <SectionCard title="İletişim">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Cep Telefonu" required><input className="form-input w-full" value={katilimci.cepTel} onChange={(e) => setK({ cepTel: e.target.value })} /></Field>
                <Field label="E-Posta" required><input type="email" className="form-input w-full" value={katilimci.email} onChange={(e) => setK({ email: e.target.value })} /></Field>
              </div>
            </SectionCard>
            <SectionCard title="FATCA / CRS">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Vergi Mükellefi Olduğu Ülke" required>
                  <input className="form-input w-full" value={katilimci.fatcaVergiUlke} onChange={(e) => setK({ fatcaVergiUlke: e.target.value })} />
                </Field>
                <Field label="Doğduğu Ülke" required>
                  <input className="form-input w-full" value={katilimci.fatcaDogumUlke} onChange={(e) => setK({ fatcaDogumUlke: e.target.value })} />
                </Field>
                <Field label="Amerika'da Kalıcı İkamet İzni Var mı?">
                  <select className="form-select w-full" value={katilimci.fatcaAbdIkamet} onChange={(e) => setK({ fatcaAbdIkamet: e.target.value })}>
                    {EVET_HAYIR.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </Field>
                <Field label="US GreenCard var mı?">
                  <select className="form-select w-full" value={katilimci.fatcaGreenCard} onChange={(e) => setK({ fatcaGreenCard: e.target.value })}>
                    {EVET_HAYIR.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </Field>
                <Field label="Mukim Ülke Var mı?">
                  <select className="form-select w-full" value={katilimci.mukimUlke} onChange={(e) => setK({ mukimUlke: e.target.value })}>
                    {EVET_HAYIR.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </Field>
              </div>
            </SectionCard>
          </div>
        )}

        {step === 4 && !skipKatkıYapan && (
          <div className="max-w-2xl">
            <div className="flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-900">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Katkı yapan katılımcıdan farklıysa burada tanımlanır. Sprint 2’de KPS arama ve adres adımları eklenecek.</p>
            </div>
          </div>
        )}

        {step === 5 && !skipYasalTemsilci && (
          <div className="max-w-2xl">
            <div className="flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-900">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>18 yaş altı veya vesayet durumunda yasal temsilci bilgileri. Sprint 2’de detaylandırılacak.</p>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="max-w-3xl space-y-4">
            <SectionCard title="Lehdar (Vefat durumunda hak sahibi)">
              <Field label="Lehdar Belirlenmiş mi?" required>
                <select className="form-select w-full max-w-xs" value={lehdarBelirlenmis} onChange={(e) => setLehdarBelirlenmis(e.target.value)}>
                  {EVET_HAYIR.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </Field>
              {lehdarBelirlenmis === 'Hayır' && (
                <div className="flex gap-2 mt-3 p-3 rounded-md bg-slate-100 text-sm text-slate-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-slate-500" />
                  Kanuni varisler — vefat tazminatı veraset ilamındaki kişilere ödenir (mevzuat bilgi notu).
                </div>
              )}
              {lehdarBelirlenmis === 'Evet' && (
                <p className="text-sm text-slate-600 mt-2">Lehdar arama ve yüzde dağılımı Sprint 2’de eklenecek.</p>
              )}
            </SectionCard>
          </div>
        )}

        {step === 7 && (
          <div className="max-w-4xl space-y-4">
            <SectionCard title="Plan Seçimi">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Plan" required>
                  <select
                    className="form-select w-full"
                    value={planKod}
                    onChange={(e) => {
                      const v = e.target.value
                      setPlanKod(v)
                      setPlanAd(v === '518' ? 'KİŞİYE ÖZEL PLAN' : 'STANDART PLAN')
                    }}
                  >
                    <option value="518">518 - KİŞİYE ÖZEL PLAN</option>
                    <option value="520">520 - STANDART PLAN</option>
                  </select>
                </Field>
                <Field label="Varlık Dağılımı">
                  <select className="form-select w-full" value={varlikDagilim} onChange={(e) => setVarlikDagilim(e.target.value)}>
                    <option>ÖNERİLEN FON</option>
                    <option>SERBEST DAĞILIM</option>
                  </select>
                </Field>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <OutlineButton small onClick={() => setFonGrid(FON_DAGILIM_DEFAULT)}>Önerilene Dön</OutlineButton>
              </div>
            </SectionCard>
            <SectionCard title="Fon Dağılımı (AUA)">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left px-3 py-2">Varlık Tipi</th>
                    <th className="text-right px-3 py-2 w-28">Oran %</th>
                  </tr>
                </thead>
                <tbody>
                  {fonGrid.map((row, i) => (
                    <tr key={row.tip} className="border-t border-slate-100">
                      <td className="px-3 py-2">{row.tip}</td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="form-input w-20 ml-auto text-right"
                          value={row.oran}
                          onChange={(e) => {
                            const v = Number(e.target.value) || 0
                            setFonGrid((g) => g.map((r, j) => (j === i ? { ...r, oran: v } : r)))
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                    <td className="px-3 py-2">Toplam</td>
                    <td className={`px-3 py-2 text-right tabular-nums ${fonToplam !== 100 ? 'text-red-600' : 'text-emerald-700'}`}>{fonToplam}%</td>
                  </tr>
                </tbody>
              </table>
              {fonToplam !== 100 && <p className="text-xs text-red-600 mt-1">Toplam %100 olmalıdır.</p>}
            </SectionCard>
          </div>
        )}
      </div>

      <div className="shrink-0 px-4 md:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80">
        <OutlineButton onClick={handleOnceki} disabled={step <= 1}>
          <ChevronLeft className="w-4 h-4" /> Önceki
        </OutlineButton>
        {step < 7 ? (
          <PrimaryButton onClick={handleSonraki}>
            Sonraki <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={handleTamamla} disabled={fonToplam !== 100}>
            Teklifi Tamamla
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}
