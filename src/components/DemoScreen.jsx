import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, Search, Check, FilePlus, Pencil, Trash2, Eye, HelpCircle, Calculator, LayoutGrid } from 'lucide-react'
import { urunPlanTarifeKartlari, urunPlanlari, odemeDonemiTurleri, katkiPayiHesaplama } from '../data/mockData'
import Modal from './ui/Modal'

const MOCK_CUSTOMERS = [
  {
    kisiNo: '10001234',
    ad: 'Ahmet',
    soyad: 'Yılmaz',
    cinsiyet: 'Erkek',
    dogumTarihi: '15.03.1985',
    kimlikTipi: 'Nüfus',
    tcKimlik: '12345678901',
    evAlan: '',
    evNumara: '',
    isAlan: '',
    isNumara: '',
    faxAlan: '',
    faxNumara: '',
    cepAlan: '532',
    cepNumara: '111 22 33',
    email: 'ahmet.yilmaz@ornek.com',
    sirketAdi: '—',
    uyruk: 'TR',
    segmentKodu: 'SEG-01',
    altSegmentKodu: 'ALT-A',
    tarafTipi: 'Katılımcı',
    vergiNo: '—',
    sozlesmeler: [
      { sozlesmeNo: 'SZL-2024-001', statu: 'Aktif', musteriNo: 'M-8891', ad: 'Ahmet', soyad: 'Yılmaz', kimlik: '12345678901', cinsiyet: 'Erkek' },
    ],
  },
  {
    kisiNo: '10005678',
    ad: 'Ayşe',
    soyad: 'Demir',
    cinsiyet: 'Kadın',
    dogumTarihi: '22.07.1992',
    kimlikTipi: 'Nüfus',
    tcKimlik: '98765432109',
    evAlan: '212',
    evNumara: '555 01 02',
    isAlan: '216',
    isNumara: '444 99 88',
    faxAlan: '',
    faxNumara: '',
    cepAlan: '505',
    cepNumara: '987 65 43',
    email: 'ayse.d@ornek.com',
    sirketAdi: 'ABC Şirketi A.Ş.',
    uyruk: 'TR',
    segmentKodu: 'SEG-02',
    altSegmentKodu: 'ALT-B',
    tarafTipi: 'Katılımcı',
    vergiNo: '1234567890',
    sozlesmeler: [],
  },
  {
    kisiNo: '10007890',
    ad: 'Mehmet',
    soyad: 'Kaya',
    cinsiyet: 'Erkek',
    dogumTarihi: '08.11.1978',
    kimlikTipi: 'Ehliyet',
    tcKimlik: '11223344556',
    evAlan: '312',
    evNumara: '222 33 44',
    isAlan: 'Seçiniz',
    isNumara: '',
    faxAlan: 'Seçiniz',
    faxNumara: '',
    cepAlan: '533',
    cepNumara: '445 66 77',
    email: 'mehmet.kaya@ornek.com',
    sirketAdi: 'XYZ Holding A.Ş.',
    uyruk: 'TR',
    segmentKodu: 'SEG-03',
    altSegmentKodu: 'ALT-C',
    tarafTipi: 'Katılımcı',
    vergiNo: '9988776655',
    sozlesmeler: [],
  },
  {
    kisiNo: '10009901',
    ad: 'Zeynep',
    soyad: 'Arslan',
    cinsiyet: 'Kadın',
    dogumTarihi: '19.02.1995',
    kimlikTipi: 'Pasaport',
    tcKimlik: '55667788990',
    evAlan: 'Seçiniz',
    evNumara: '',
    isAlan: '232',
    isNumara: '333 44 55',
    faxAlan: '',
    faxNumara: '',
    cepAlan: '542',
    cepNumara: '123 45 67',
    email: 'zeynep.arslan@ornek.com',
    sirketAdi: '—',
    uyruk: 'TR',
    segmentKodu: 'SEG-01',
    altSegmentKodu: 'ALT-A',
    tarafTipi: 'Vekil',
    vergiNo: '—',
    sozlesmeler: [
      { sozlesmeNo: 'SZL-2023-088', statu: 'Kapalı', musteriNo: 'M-7701', ad: 'Zeynep', soyad: 'Arslan', kimlik: '55667788990', cinsiyet: 'Kadın' },
    ],
  },
  {
    kisiNo: '10008877',
    ad: 'Can',
    soyad: 'Öztürk',
    cinsiyet: 'Erkek',
    dogumTarihi: '03.06.1988',
    kimlikTipi: 'Yabancı',
    tcKimlik: '66778899001',
    evAlan: '216',
    evNumara: '888 99 00',
    isAlan: '216',
    isNumara: '777 88 99',
    faxAlan: '212',
    faxNumara: '111 22 33',
    cepAlan: '534',
    cepNumara: '998 87 76',
    email: 'can.ozturk@ornek.com',
    sirketAdi: 'Delta Sigorta Ltd.',
    uyruk: 'TR',
    segmentKodu: 'SEG-02',
    altSegmentKodu: 'ALT-B',
    tarafTipi: 'Katılımcı',
    vergiNo: '5544332211',
    sozlesmeler: [],
  },
]

const KISI_TIPI = ['Gerçek', 'Tüzel', 'Sanal']
const KIMLIK_TURU_ERP = ['Yabancı', 'Nüfus', 'Ehliyet', 'Pasaport', 'Vergi']
const NUMARA_TIPI = ['Vergi No', 'Takasbank Sicil No', 'Mavi Kart No']
const EVET_HAYIR = ['Seçiniz', 'Evet', 'Hayır']

const CINSIYET = ['Erkek', 'Kadın']
const ALAN_KODLARI = ['Seçiniz', '212', '216', '312', '232', '242', '332', '352', '362', '384', '422', '424', '426', '428', '432', '436', '438', '442', '446', '452', '454', '456', '458', '462', '464', '472', '474', '476', '478', '482', '484', '486', '488']
const CEP_PREFIX = ['532', '533', '534', '535', '536', '537', '538', '539', '541', '542', '543', '544', '545', '546', '505', '506', '507', '530', '531']

const emptyPerson = () => ({
  kisiNo: '',
  baskaFirmadanAktarim: false,
  ad: '',
  soyad: '',
  cinsiyet: 'Erkek',
  dogumTarihi: '',
  kimlikTipi: 'Nüfus',
  tcKimlik: '',
  evAlan: 'Seçiniz',
  evNumara: '',
  isAlan: 'Seçiniz',
  isNumara: '',
  faxAlan: 'Seçiniz',
  faxNumara: '',
  cepAlan: '532',
  cepNumara: '',
  email: '',
})

const fmtTl = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value || 0)

const ANALIZ_TIPLERI = ['Katkı Payından Birikime', 'Birikimden Katkı Payına', 'Süreden Katkı Payına']

const DEMO_ACENTELER = [
  { kod: '935113', ad: 'GÖKHAN' },
  { kod: 'A001', ad: 'Merkez Acente İstanbul' },
  { kod: 'A002', ad: 'Anadolu Acente A.Ş.' },
  { kod: 'A003', ad: 'Ege Bölge Acentesi' },
  { kod: 'A004', ad: 'Karadeniz Satış Ofisi' },
]

function trToday() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

function dovizlerForUrunPlan(urunKod, planId) {
  if (!urunKod || !planId) return []
  const urun = urunPlanTarifeKartlari.find((u) => u.id === urunKod)
  const tip = (urun?.sozlesmeTipi || '').toUpperCase()
  if (tip === 'EGP' || tip === 'OKS-EGP') return ['TRL', 'USD', 'EUR']
  const h = (planId + urunKod).length
  return h % 2 === 0 ? ['TL', 'USD'] : ['TL', 'USD', 'EUR']
}

function endekslerForPlan(planId) {
  if (!planId) return []
  const seed = planId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pick = (i) => katkiPayiHesaplama[i % katkiPayiHesaplama.length]
  const a = pick(seed)
  const b = pick(seed + 1)
  const donemFor = (h, s) => {
    const ad = (h.hesapAdi || '').toLowerCase()
    if (ad.includes('artış') || ad.includes('artissiz') || h.hesapMetod === 'Sabit Tutar') return ['—']
    if (s % 2 === 0) return ['1. Dönem', '2. Dönem', '3. Dönem', '4. Dönem']
    return ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs']
  }
  return [
    { kod: String(a.hesapKodu), ad: a.hesapAdi, donemler: donemFor(a, seed) },
    { kod: String(b.hesapKodu), ad: b.hesapAdi, donemler: donemFor(b, seed + 1) },
  ]
}

const emptyMusteriArama = () => ({
  kisiTipi: 'Gerçek',
  musteriNo: '',
  ad: '',
  soyad: '',
  dogumT: '',
  firma: '',
  tcKimlik: '',
  yabanciKimlikNo: '',
  cepIrtibat: 'Seçiniz',
  cep: '',
  epostaIrtibat: 'Seçiniz',
  eposta: '',
  kimlikTuru: 'Nüfus',
  kimlikNo: '',
  numaraTipi: 'Vergi No',
  numara: '',
  birim: '',
  bilgi: '',
  deger: '',
  musteriSicilNo: '',
  maviKartNo: '',
  pasaportNo: '',
})

function mockToListeRow(c) {
  return {
    musteriNo: c.kisiNo,
    sirketAdi: c.sirketAdi || '—',
    ad: c.ad,
    soyad: c.soyad,
    dogumT: c.dogumTarihi,
    uyruk: c.uyruk || 'TR',
    kimlikNo: c.tcKimlik,
    segmentKodu: c.segmentKodu || '—',
    altSegmentKodu: c.altSegmentKodu || '—',
    tarafTipi: c.tarafTipi || '—',
    vergiNo: c.vergiNo || '—',
    refKisiNo: c.kisiNo,
  }
}

function aramaYeterli(a) {
  if ((a.musteriNo || '').trim()) return true
  if ((a.tcKimlik || '').replace(/\D/g, '').length >= 11) return true
  const parca = [a.ad, a.soyad, a.dogumT, a.firma].filter((x) => (x || '').trim())
  if (parca.length >= 2) return true
  if ((a.numara || '').trim() && a.numaraTipi) return true
  if ((a.bilgi || '').trim() && (a.deger || '').trim()) return true
  return false
}

function filterMockMusteriler(arama, mocks) {
  const q = (s) => (s || '').trim().toLowerCase()
  return mocks.filter((m) => {
    if (arama.musteriNo.trim() && m.kisiNo !== arama.musteriNo.trim()) return false
    if (arama.ad.trim() && !q(m.ad).includes(q(arama.ad))) return false
    if (arama.soyad.trim() && !q(m.soyad).includes(q(arama.soyad))) return false
    if (arama.dogumT.trim() && m.dogumTarihi !== arama.dogumT.trim()) return false
    if (arama.tcKimlik.trim() && m.tcKimlik !== arama.tcKimlik.trim()) return false
    if (arama.firma.trim() && !(m.sirketAdi || '').toLowerCase().includes(arama.firma.toLowerCase())) return false
    if (arama.cep.trim()) {
      const cepFlat = (m.cepAlan || '') + (m.cepNumara || '').replace(/\s/g, '')
      if (!cepFlat.includes(arama.cep.replace(/\s/g, ''))) return false
    }
    if (arama.eposta.trim() && !(m.email || '').toLowerCase().includes(arama.eposta.toLowerCase())) return false
    return true
  })
}

function DemoScreen() {
  const [step, setStep] = useState(1)
  const [mainTab, setMainTab] = useState('kisi')
  const [person, setPerson] = useState(emptyPerson)
  const [kisiSecimKaynagi, setKisiSecimKaynagi] = useState(null)

  const [musteriArama, setMusteriArama] = useState(emptyMusteriArama)
  const [musteriListe, setMusteriListe] = useState([])
  const [musteriSeciliRef, setMusteriSeciliRef] = useState(null)
  const [basvuruPanelAcik, setBasvuruPanelAcik] = useState(false)
  const [hesapPanelAcik, setHesapPanelAcik] = useState(false)

  const [simForm, setSimForm] = useState({
    aylikKatkiPayi: 2000,
    sureYil: 20,
    yillikFonGetirisi: 20,
    yillikEnflasyon: 15,
    devletKatkisiOrani: 30,
  })

  const [urunParamForm, setUrunParamForm] = useState({
    satici: '935113 GÖKHAN',
    partajKod: '',
    partajAd: '',
    urunKod: '',
    planId: '',
    analizTipi: ANALIZ_TIPLERI[0],
    paraBirimi: '',
    demoTarihi: '',
    sistemGirisTarihi: '',
    taksitAdedi: '',
    endeksKod: '',
    endeksDonemleri: [],
    donemselKp: '',
    bauOrani: '',
    ekSureYil: '',
    baslangicKapitali: '',
  })
  const [partajModalOpen, setPartajModalOpen] = useState(false)
  const [endeksDonemPanelAcik, setEndeksDonemPanelAcik] = useState(false)

  const sozlesmeRows = useMemo(() => {
    if (!person.kisiNo.trim()) return []
    const m = MOCK_CUSTOMERS.find((c) => c.kisiNo === person.kisiNo.trim())
    return m?.sozlesmeler || []
  }, [person.kisiNo])

  const ilkSozlesmeNo = sozlesmeRows[0]?.sozlesmeNo || ''

  useEffect(() => {
    if (step !== 2 || mainTab !== 'urun') return
    const t = trToday()
    setUrunParamForm((prev) => {
      if (prev.demoTarihi && prev.sistemGirisTarihi) return prev
      return {
        ...prev,
        demoTarihi: prev.demoTarihi || t,
        sistemGirisTarihi: prev.sistemGirisTarihi || t,
      }
    })
  }, [step, mainTab])

  const plansForUrun = useMemo(() => {
    if (!urunParamForm.urunKod) return []
    return urunPlanlari[urunParamForm.urunKod] || []
  }, [urunParamForm.urunKod])

  const planDovizler = useMemo(
    () => dovizlerForUrunPlan(urunParamForm.urunKod, urunParamForm.planId),
    [urunParamForm.urunKod, urunParamForm.planId],
  )

  const planEndeksler = useMemo(() => endekslerForPlan(urunParamForm.planId), [urunParamForm.planId])

  const secilenEndeksSatir = useMemo(
    () => planEndeksler.find((e) => e.kod === urunParamForm.endeksKod),
    [planEndeksler, urunParamForm.endeksKod],
  )

  const kpAnalizAktif = urunParamForm.analizTipi === ANALIZ_TIPLERI[0]

  const applyMockCustomer = (kisiNo) => {
    const c = MOCK_CUSTOMERS.find((x) => x.kisiNo === kisiNo.trim())
    if (!c) return false
    setPerson({
      kisiNo: c.kisiNo,
      baskaFirmadanAktarim: false,
      ad: c.ad,
      soyad: c.soyad,
      cinsiyet: c.cinsiyet,
      dogumTarihi: c.dogumTarihi,
      kimlikTipi: c.kimlikTipi,
      tcKimlik: c.tcKimlik,
      evAlan: c.evAlan && c.evAlan !== '' ? c.evAlan : 'Seçiniz',
      evNumara: c.evNumara,
      isAlan: c.isAlan && c.isAlan !== '' ? c.isAlan : 'Seçiniz',
      isNumara: c.isNumara,
      faxAlan: c.faxAlan && c.faxAlan !== '' ? c.faxAlan : 'Seçiniz',
      faxNumara: c.faxNumara,
      cepAlan: c.cepAlan || '532',
      cepNumara: c.cepNumara,
      email: c.email,
    })
    return true
  }

  const selectMusteriFromListe = (refKisiNo) => {
    if (!refKisiNo) return
    setMusteriSeciliRef(refKisiNo)
    if (applyMockCustomer(refKisiNo)) {
      setKisiSecimKaynagi('kayitli')
      setMusteriArama((prev) => ({ ...prev, musteriNo: refKisiNo }))
    }
  }

  const handleMusteriAramaCalistir = () => {
    if (!aramaYeterli(musteriArama)) {
      alert(
        'Arama yapmak için ** ile işaretli alanlardan en az iki veri giriniz (ör. Ad + Soyad), veya Müşteri No / tam T.C. Kimlik No kullanın; Numara Tipi + Numara veya Bilgi + Değer çiftleri de kullanılabilir.',
      )
      return
    }
    let kaynak = filterMockMusteriler(musteriArama, MOCK_CUSTOMERS)
    if (kaynak.length === 0) kaynak = [...MOCK_CUSTOMERS]
    const rows = kaynak.map(mockToListeRow)
    setMusteriListe(rows)
    setMusteriSeciliRef(null)
  }

  const handleMusteriAramaTemizle = () => {
    setMusteriArama(emptyMusteriArama())
    setMusteriListe([])
    setMusteriSeciliRef(null)
    setPerson(emptyPerson())
    setKisiSecimKaynagi(null)
  }

  const handleMusteriSec = () => {
    if (!musteriSeciliRef) {
      alert('Önce müşteri listesinden bir satır seçiniz.')
      return
    }
    selectMusteriFromListe(musteriSeciliRef)
  }

  const setMa = (patch) => setMusteriArama((prev) => ({ ...prev, ...patch }))

  const cepDoluMu = () => {
    const n = (person.cepNumara || '').replace(/\s/g, '').trim()
    const alanOk = person.cepAlan && person.cepAlan !== 'Seçiniz'
    return alanOk && n.length >= 7
  }

  const yeniMusteriZorunluDolu = () =>
    person.ad.trim() &&
    person.soyad.trim() &&
    person.cinsiyet &&
    person.dogumTarihi.trim() &&
    cepDoluMu()

  const handleDevam = () => {
    const idFromUi = musteriSeciliRef || person.kisiNo.trim() || musteriArama.musteriNo.trim()
    const matched = MOCK_CUSTOMERS.find((x) => x.kisiNo === idFromUi)

    if (idFromUi && matched) {
      applyMockCustomer(idFromUi)
      setKisiSecimKaynagi('kayitli')
      setMusteriArama((prev) => ({ ...prev, musteriNo: idFromUi }))
      setStep(2)
      setMainTab('urun')
      return
    }

    if (idFromUi && !matched) {
      alert(
        `"${idFromUi}" için kayıt bulunamadı. Demo müşteri no: ${MOCK_CUSTOMERS.map((m) => m.kisiNo).join(', ')} — veya Kişi No / Müşteri No alanlarını temizleyip yeni müşteri bilgileri + cep telefonu giriniz.`,
      )
      return
    }

    if (!idFromUi && yeniMusteriZorunluDolu()) {
      setKisiSecimKaynagi('yeni')
      setStep(2)
      setMainTab('urun')
      return
    }

    alert(
      'Devam etmek için:\n• Kayıtlı müşteri: Arama yapıp listeden seçip «Seç» kullanın veya geçerli Müşteri No girin (ör. 10001234),\n• Yeni müşteri: müşteri nosu boş; Ad, Soyad, Cinsiyet, Doğum tarihi ve cep telefonu (alan + numara) giriniz.',
    )
  }

  const summary = useMemo(() => {
    const aylikKatki = Number(simForm.aylikKatkiPayi) || 0
    const yil = Number(simForm.sureYil) || 0
    const ay = Math.max(0, yil * 12)
    const aylikGetiri = (Number(simForm.yillikFonGetirisi) || 0) / 12 / 100
    const devletKatkiOrani = (Number(simForm.devletKatkisiOrani) || 0) / 100
    const enflasyon = (Number(simForm.yillikEnflasyon) || 0) / 100

    const katilimciOdeme = aylikKatki * ay
    const devletKatkisi = katilimciOdeme * devletKatkiOrani
    const aylikToplamYatirim = aylikKatki * (1 + devletKatkiOrani)
    const nominalBirikim =
      aylikGetiri > 0
        ? aylikToplamYatirim * ((Math.pow(1 + aylikGetiri, ay) - 1) / aylikGetiri)
        : aylikToplamYatirim * ay
    const reelBirikim = nominalBirikim / Math.pow(1 + enflasyon, yil || 0)

    return { katilimciOdeme, devletKatkisi, nominalBirikim, reelBirikim }
  }, [simForm])

  const onSimNumberChange = (key) => (e) => {
    setSimForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const setU = (patch) => setUrunParamForm((prev) => ({ ...prev, ...patch }))

  const partajSecildi = (row) => {
    setUrunParamForm((p) => ({
      ...p,
      partajKod: row.kod,
      partajAd: row.ad,
      urunKod: '',
      planId: '',
      paraBirimi: '',
      endeksKod: '',
      endeksDonemleri: [],
    }))
    setPartajModalOpen(false)
  }

  const toggleEndeksDonem = (d) => {
    setUrunParamForm((prev) => {
      const set = new Set(prev.endeksDonemleri)
      if (set.has(d)) set.delete(d)
      else set.add(d)
      return { ...prev, endeksDonemleri: [...set] }
    })
  }

  const handleUrunParamHesapla = () => {
    const f = urunParamForm
    if (!f.partajKod.trim()) {
      alert('Partaj seçiniz.')
      return
    }
    if (!f.urunKod) {
      alert('Ürün kodu seçiniz.')
      return
    }
    if (!f.planId) {
      alert('Plan seçiniz.')
      return
    }
    if (!f.paraBirimi) {
      alert('Para birimi seçiniz.')
      return
    }
    if (!f.demoTarihi.trim() || !f.sistemGirisTarihi.trim()) {
      alert('Demo tarihi ve sisteme giriş tarihi giriniz.')
      return
    }
    if (!f.taksitAdedi) {
      alert('Taksit adedi seçiniz.')
      return
    }
    if (kpAnalizAktif) {
      const kp = String(f.donemselKp).replace(',', '.').trim()
      if (kp === '' || Number.isNaN(Number(kp))) {
        alert('Dönemsel KP tutarı giriniz.')
        return
      }
    }
    if (f.bauOrani.trim()) {
      const b = Number(String(f.bauOrani).replace(',', '.'))
      if (Number.isNaN(b) || b < 0 || b > 1) {
        alert('BAU oranı 0 ile 1 arasında olmalıdır.')
        return
      }
    }
    setMainTab('hesap')
  }

  const handleUrunGeri = () => {
    setStep(1)
    setMainTab('kisi')
  }

  const setP = (key, value) => setPerson((prev) => ({ ...prev, [key]: value }))

  const musteriFormKilitli = kisiSecimKaynagi === 'kayitli'
  const kilitCls = musteriFormKilitli ? 'bg-slate-100 text-slate-800 cursor-not-allowed' : ''

  const tabs = [
    { id: 'kisi', label: 'Kişi Bilgileri' },
    { id: 'urun', label: 'Ürün Parametreleri' },
    { id: 'hesap', label: 'Hesaplamalar' },
  ]

  return (
    <div className="min-h-full bg-slate-100/80 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Demo</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adım {step}/2 — {step === 1 ? 'Kişi ve iletişim' : 'Ürün parametreleri ve hesaplama'}
          </p>
        </div>
        {step === 2 && (
          <button
            type="button"
            onClick={() => {
              setStep(1)
              setMainTab('kisi')
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Kişi adımına dön
          </button>
        )}
      </div>

      <div className="bg-slate-50 border-b border-slate-200 px-4 flex gap-1">
        {tabs.map((t) => {
          const locked = step === 1 && t.id !== 'kisi'
          const active = mainTab === t.id
          return (
            <button
              key={t.id}
              type="button"
              disabled={locked}
              onClick={() => {
                if (locked) return
                setMainTab(t.id)
              }}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                active ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
              } ${locked ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {step === 1 && mainTab === 'kisi' && (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* ERP: Müşteri Tanımlama */}
            <div className="rounded-lg border border-slate-300 bg-slate-100/90 shadow-md overflow-hidden">
              <div className="px-3 py-2 flex items-center justify-between bg-gradient-to-b from-slate-200 to-slate-300 border-b border-slate-400">
                <h3 className="text-sm font-bold text-slate-800">Müşteri Tanımlama</h3>
                <button type="button" className="text-slate-500 hover:text-slate-800 p-0.5 rounded" aria-label="Kapat" title="Demo">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 md:p-4 bg-slate-50/95 space-y-3">
                <div className="rounded border border-slate-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 bg-gradient-to-r from-slate-100 to-white border-b border-slate-200"
                  >
                    Arama Paneli
                  </button>
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <ErpSearchField label="Kişi Tipi" required>
                      <select className="form-select text-sm" value={musteriArama.kisiTipi} onChange={(e) => setMa({ kisiTipi: e.target.value })}>
                        {KISI_TIPI.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="Müşteri No">
                      <input
                        className="form-input text-sm font-mono"
                        value={musteriArama.musteriNo}
                        onChange={(e) => setMa({ musteriNo: e.target.value })}
                        list="demo-musteri-no"
                      />
                      <datalist id="demo-musteri-no">
                        {MOCK_CUSTOMERS.map((c) => (
                          <option key={c.kisiNo} value={c.kisiNo}>
                            {c.ad} {c.soyad}
                          </option>
                        ))}
                      </datalist>
                    </ErpSearchField>
                    <ErpSearchField label="Adı" required>
                      <input className="form-input text-sm" value={musteriArama.ad} onChange={(e) => setMa({ ad: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="Soyadı" required>
                      <input className="form-input text-sm" value={musteriArama.soyad} onChange={(e) => setMa({ soyad: e.target.value })} />
                    </ErpSearchField>

                    <ErpSearchField label="Doğum T." required>
                      <input className="form-input text-sm" placeholder="gg.aa.yyyy" value={musteriArama.dogumT} onChange={(e) => setMa({ dogumT: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="Firma" required>
                      <input className="form-input text-sm" value={musteriArama.firma} onChange={(e) => setMa({ firma: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="T.C. Kimlik No">
                      <input className="form-input text-sm font-mono" value={musteriArama.tcKimlik} onChange={(e) => setMa({ tcKimlik: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="Yabancı Kimlik No/KimlikNo2">
                      <input className="form-input text-sm" value={musteriArama.yabanciKimlikNo} onChange={(e) => setMa({ yabanciKimlikNo: e.target.value })} />
                    </ErpSearchField>

                    <ErpSearchField label="Cep Telefonu İrtibat mı?">
                      <select className="form-select text-sm" value={musteriArama.cepIrtibat} onChange={(e) => setMa({ cepIrtibat: e.target.value })}>
                        {EVET_HAYIR.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="Cep Telefonu">
                      <input className="form-input text-sm" value={musteriArama.cep} onChange={(e) => setMa({ cep: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="E-Posta İrtibat mı?">
                      <select className="form-select text-sm" value={musteriArama.epostaIrtibat} onChange={(e) => setMa({ epostaIrtibat: e.target.value })}>
                        {EVET_HAYIR.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="E-Posta">
                      <input type="email" className="form-input text-sm" value={musteriArama.eposta} onChange={(e) => setMa({ eposta: e.target.value })} />
                    </ErpSearchField>

                    <ErpSearchField label="Kimlik Türü">
                      <select className="form-select text-sm" value={musteriArama.kimlikTuru} onChange={(e) => setMa({ kimlikTuru: e.target.value })}>
                        {KIMLIK_TURU_ERP.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="Kimlik No">
                      <input className="form-input text-sm" value={musteriArama.kimlikNo} onChange={(e) => setMa({ kimlikNo: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="Numara Tipi">
                      <select className="form-select text-sm" value={musteriArama.numaraTipi} onChange={(e) => setMa({ numaraTipi: e.target.value })}>
                        {NUMARA_TIPI.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="Numara">
                      <input className="form-input text-sm" value={musteriArama.numara} onChange={(e) => setMa({ numara: e.target.value })} />
                    </ErpSearchField>

                    <ErpSearchField label="Birim">
                      <select className="form-select text-sm" value={musteriArama.birim} onChange={(e) => setMa({ birim: e.target.value })}>
                        <option value="">Seçiniz</option>
                        <option value="MERKEZ">Merkez</option>
                        <option value="SUBE">Şube</option>
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="Bilgi">
                      <select className="form-select text-sm" value={musteriArama.bilgi} onChange={(e) => setMa({ bilgi: e.target.value })}>
                        <option value="">Seçiniz</option>
                        <option value="segment">Segment</option>
                        <option value="risk">Risk</option>
                      </select>
                    </ErpSearchField>
                    <ErpSearchField label="Değer">
                      <input className="form-input text-sm" value={musteriArama.deger} onChange={(e) => setMa({ deger: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="Müşteri Sicil No">
                      <input className="form-input text-sm" value={musteriArama.musteriSicilNo} onChange={(e) => setMa({ musteriSicilNo: e.target.value })} />
                    </ErpSearchField>

                    <ErpSearchField label="Mavi Kart No">
                      <input className="form-input text-sm" value={musteriArama.maviKartNo} onChange={(e) => setMa({ maviKartNo: e.target.value })} />
                    </ErpSearchField>
                    <ErpSearchField label="Pasaport No">
                      <input className="form-input text-sm" value={musteriArama.pasaportNo} onChange={(e) => setMa({ pasaportNo: e.target.value })} />
                    </ErpSearchField>
                  </div>
                </div>

                <div className="rounded border border-slate-200 bg-white">
                  <button type="button" onClick={() => setBasvuruPanelAcik((v) => !v)} className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                    Başvuru/Poliçe/Sözleşme Bilgileri
                    <span className="text-slate-400">{basvuruPanelAcik ? '▼' : '▶'}</span>
                  </button>
                  {basvuruPanelAcik && <div className="p-4 text-sm text-slate-500">Demo: Bu bölüm sonraki sürümde doldurulacaktır.</div>}
                </div>
                <div className="rounded border border-slate-200 bg-white">
                  <button type="button" onClick={() => setHesapPanelAcik((v) => !v)} className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                    Hesap Bilgileri
                    <span className="text-slate-400">{hesapPanelAcik ? '▼' : '▶'}</span>
                  </button>
                  {hesapPanelAcik && <div className="p-4 text-sm text-slate-500">Demo: Hesap bilgisi araması yakında.</div>}
                </div>

                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 leading-relaxed">
                  <strong>Arama kuralları:</strong> ** ile işaretli alanlardan en az ikisi veya belirtilen alternatif kombinasyonlar (ör. Numara Tipi + Numara, Bilgi + Değer) ile arama yapılabilir.
                  Müşteri No veya geçerli T.C. Kimlik No tek başına aramayı başlatır.
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleMusteriAramaCalistir}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-sm font-semibold text-slate-800 hover:from-slate-50 shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    Ara
                  </button>
                  <button
                    type="button"
                    onClick={handleMusteriAramaTemizle}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-sm font-semibold text-slate-800 hover:from-slate-50 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Temizle
                  </button>
                  <span className="text-sm text-slate-600">
                    Toplam Müşteri Sayısı: <strong className="tabular-nums text-slate-900">{musteriListe.length}</strong>
                  </span>
                </div>

                <div className="rounded border border-slate-200 bg-white overflow-hidden">
                  <div className="px-3 py-2 text-xs font-bold text-slate-800 bg-gradient-to-r from-slate-100 to-white border-b border-slate-200">Müşteri Listesi</div>
                  <div className="overflow-x-auto">
                    <table className="w-full grid-table text-xs min-w-[900px]">
                      <thead>
                        <tr>
                          <th className="w-10" />
                          <th>Müşteri No</th>
                          <th>Şirket Adı</th>
                          <th>Adı</th>
                          <th>Soyadı</th>
                          <th>Doğum T.</th>
                          <th>Uyruk</th>
                          <th>Kimlik No</th>
                          <th>Segment Kodu</th>
                          <th>Alt Segment Kodu</th>
                          <th>Taraf Tipi</th>
                          <th>Vergi No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {musteriListe.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="text-center text-slate-500 py-10">
                              Kayıt bulunamadı
                            </td>
                          </tr>
                        ) : (
                          musteriListe.map((row) => (
                            <tr
                              key={row.refKisiNo}
                              onClick={() => setMusteriSeciliRef(row.refKisiNo)}
                              onDoubleClick={(e) => {
                                e.preventDefault()
                                selectMusteriFromListe(row.refKisiNo)
                              }}
                              className={`cursor-pointer ${musteriSeciliRef === row.refKisiNo ? 'bg-violet-50' : ''}`}
                            >
                              <td className="text-center">
                                <input
                                  type="radio"
                                  name="demo-musteri-sec"
                                  checked={musteriSeciliRef === row.refKisiNo}
                                  onChange={() => setMusteriSeciliRef(row.refKisiNo)}
                                  className="border-slate-400"
                                />
                              </td>
                              <td className="font-mono">{row.musteriNo}</td>
                              <td>{row.sirketAdi}</td>
                              <td>{row.ad}</td>
                              <td>{row.soyad}</td>
                              <td className="tabular-nums">{row.dogumT}</td>
                              <td>{row.uyruk}</td>
                              <td className="font-mono">{row.kimlikNo}</td>
                              <td>{row.segmentKodu}</td>
                              <td>{row.altSegmentKodu}</td>
                              <td>{row.tarafTipi}</td>
                              <td className="font-mono">{row.vergiNo}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-600">
                    <select className="border border-slate-200 rounded px-2 py-1 bg-white">
                      <option>10</option>
                    </select>
                    <span className="tabular-nums">
                      {musteriListe.length ? `1-${musteriListe.length}` : '0-0'} / {musteriListe.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200">
                  <ErpFooterBtn icon={Check} label="Seç" onClick={handleMusteriSec} />
                  <ErpFooterBtn icon={FilePlus} label="Yeni" onClick={() => alert('Demo: Yeni müşteri kaydı bu prototipte alt formdan yapılır.')} />
                  <ErpFooterBtn icon={Pencil} label="Güncelle" onClick={() => alert('Demo: Güncelleme yakında.')} />
                  <ErpFooterBtn icon={Trash2} label="Sil" onClick={() => alert('Demo: Silme yakında.')} />
                  <ErpFooterBtn icon={Eye} label="Görüntüle" onClick={() => alert('Demo: Detay yakında.')} />
                  <ErpFooterBtn
                    icon={X}
                    label="Vazgeç"
                    onClick={() => {
                      setMusteriSeciliRef(null)
                      setPerson(emptyPerson())
                      setKisiSecimKaynagi(null)
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 px-1">
              <label className="block">
                <span className="block text-xs font-semibold text-slate-600 mb-1">Branş</span>
                <input className="form-input bg-slate-50 max-w-[200px] text-sm" readOnly value="Emeklilik" />
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer mt-6">
                <input type="checkbox" checked={person.baskaFirmadanAktarim} onChange={(e) => setP('baskaFirmadanAktarim', e.target.checked)} className="rounded border-slate-300" />
                Başka Firmadan Aktarım Var Mı?
              </label>
            </div>

            <p className="text-xs text-slate-500 px-1">
              Listeden <strong className="text-slate-700">Seç</strong> veya satıra <strong className="text-slate-700">çift tıklayın</strong>; kişisel ve iletişim alanları müşteri verisiyle dolar ve kilitlenir. Yeni giriş için <strong>Temizle</strong> kullanın.
            </p>

            {musteriFormKilitli ? (
              <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                Kayıtlı müşteri seçildi — Kişisel ve İletişim bilgileri salt okunur.
              </p>
            ) : null}

            <ErpSection title="Kişisel Bilgiler">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Adı" required>
                  <input className={`form-input ${kilitCls}`} disabled={musteriFormKilitli} value={person.ad} onChange={(e) => setP('ad', e.target.value)} />
                </Field>
                <Field label="Soyadı" required>
                  <input className={`form-input ${kilitCls}`} disabled={musteriFormKilitli} value={person.soyad} onChange={(e) => setP('soyad', e.target.value)} />
                </Field>
                <Field label="Cinsiyet" required>
                  <select className={`form-select ${kilitCls}`} disabled={musteriFormKilitli} value={person.cinsiyet} onChange={(e) => setP('cinsiyet', e.target.value)}>
                    {CINSIYET.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Doğum Tarihi" required>
                  <input className={`form-input ${kilitCls}`} disabled={musteriFormKilitli} placeholder="gg.aa.yyyy" value={person.dogumTarihi} onChange={(e) => setP('dogumTarihi', e.target.value)} />
                </Field>
                <Field label="Kimlik Tipi">
                  <select className={`form-select ${kilitCls}`} disabled={musteriFormKilitli} value={person.kimlikTipi} onChange={(e) => setP('kimlikTipi', e.target.value)}>
                    {KIMLIK_TURU_ERP.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="TC Kimlik No">
                  <input className={`form-input font-mono text-sm ${kilitCls}`} disabled={musteriFormKilitli} value={person.tcKimlik} onChange={(e) => setP('tcKimlik', e.target.value)} />
                </Field>
              </div>
            </ErpSection>

            <ErpSection title="İletişim Bilgileri">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PhoneRow disabled={musteriFormKilitli} kilitCls={kilitCls} label="Ev Telefonu" alan={person.evAlan} numara={person.evNumara} onAlan={(v) => setP('evAlan', v)} onNumara={(v) => setP('evNumara', v)} />
                <PhoneRow disabled={musteriFormKilitli} kilitCls={kilitCls} label="İş Telefonu" alan={person.isAlan} numara={person.isNumara} onAlan={(v) => setP('isAlan', v)} onNumara={(v) => setP('isNumara', v)} />
                <PhoneRow disabled={musteriFormKilitli} kilitCls={kilitCls} label="Faks Numarası" alan={person.faxAlan} numara={person.faxNumara} onAlan={(v) => setP('faxAlan', v)} onNumara={(v) => setP('faxNumara', v)} />
                <PhoneRow
                  disabled={musteriFormKilitli}
                  kilitCls={kilitCls}
                  label="Cep Telefonu"
                  alan={person.cepAlan}
                  numara={person.cepNumara}
                  onAlan={(v) => setP('cepAlan', v)}
                  onNumara={(v) => setP('cepNumara', v)}
                  alanOptions={CEP_PREFIX}
                  isCep
                />
                <label className="block md:col-span-2">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">E-Posta</span>
                  <input type="email" className={`form-input ${kilitCls}`} disabled={musteriFormKilitli} value={person.email} onChange={(e) => setP('email', e.target.value)} />
                </label>
              </div>
            </ErpSection>

            <ErpSection title="Sözleşme Arama Listesi">
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full grid-table text-sm min-w-[640px]">
                    <thead>
                      <tr>
                        <th>Sözleşme No</th>
                        <th>Statü</th>
                        <th>Müşteri No</th>
                        <th>Adı</th>
                        <th>Soyadı</th>
                        <th>TC Kimlik/YKN/Mavi Kart No</th>
                        <th>Cinsiyet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sozlesmeRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center text-slate-500 py-10">
                            Kayıt bulunamadı
                          </td>
                        </tr>
                      ) : (
                        sozlesmeRows.map((r) => (
                          <tr key={r.sozlesmeNo}>
                            <td className="font-mono text-xs">{r.sozlesmeNo}</td>
                            <td>{r.statu}</td>
                            <td>{r.musteriNo}</td>
                            <td>{r.ad}</td>
                            <td>{r.soyad}</td>
                            <td className="font-mono text-xs">{r.kimlik}</td>
                            <td>{r.cinsiyet}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-600">
                  <select className="border border-slate-200 rounded px-2 py-1 bg-white">
                    <option>10</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">0-0 / 0</span>
                    <span className="text-slate-400">|</span>
                    <button type="button" className="p-1 rounded hover:bg-slate-200 disabled:opacity-40" disabled>
                      ‹
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-slate-200 disabled:opacity-40" disabled>
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </ErpSection>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500 max-w-xl">
                Demo: Müşteri listesinde arayıp <strong className="text-slate-700">Seç</strong> kullanın veya Müşteri No <strong className="text-slate-700">10001234</strong> / <strong className="text-slate-700">10005678</strong> ile devam edin. Yeni müşteri için müşteri aramasını temizleyip zorunlu alanları doldurun.
              </p>
              <button
                type="button"
                onClick={handleDevam}
                className="h-10 px-6 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Devam
              </button>
            </div>
          </div>
        )}

        {step === 1 && mainTab !== 'kisi' && (
          <div className="max-w-xl mx-auto py-16 text-center text-slate-500 text-sm">Önce kişi bilgileri adımını tamamlayınız.</div>
        )}

        {step === 2 && mainTab === 'kisi' && (
          <div className="max-w-3xl mx-auto">
            <ErpSection title="Seçilen kişi özeti">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500">Kaynak</dt>
                  <dd className="font-medium text-slate-800">{kisiSecimKaynagi === 'kayitli' ? 'Kayıtlı müşteri (Kişi No)' : 'Yeni müşteri'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Kişi No</dt>
                  <dd className="font-mono font-medium text-slate-800">{person.kisiNo || '— (yeni)'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Ad Soyad</dt>
                  <dd className="font-medium text-slate-800">
                    {person.ad} {person.soyad}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Cep</dt>
                  <dd className="font-medium text-slate-800">
                    {person.cepAlan} {person.cepNumara}
                  </dd>
                </div>
              </dl>
            </ErpSection>
          </div>
        )}

        {step === 2 && mainTab === 'urun' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <ErpSection title="Kişisel Bilgiler">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1">TC Kimlik/YKN/Mavi Kart No</span>
                  <input type="text" readOnly className="form-input bg-slate-100 cursor-not-allowed" value={person.tcKimlik || ''} />
                </label>
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1">Kişi No</span>
                  <input type="text" readOnly className="form-input bg-slate-100 cursor-not-allowed" value={person.kisiNo || ''} />
                </label>
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1">Adı Soyadı</span>
                  <input
                    type="text"
                    readOnly
                    className="form-input bg-slate-100 cursor-not-allowed"
                    value={`${person.ad || ''} ${person.soyad || ''}`.trim()}
                  />
                </label>
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1">Doğum Tarihi</span>
                  <input type="text" readOnly className="form-input bg-slate-100 cursor-not-allowed" value={person.dogumTarihi || ''} />
                </label>
                <label className="block min-w-0 sm:col-span-2">
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1">Sözleşme No</span>
                  <input type="text" readOnly className="form-input bg-slate-100 cursor-not-allowed" value={ilkSozlesmeNo} />
                </label>
              </div>
            </ErpSection>

            <ErpSection title="Demo Bilgileri">
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Satan<span className="text-red-600"> *</span>
                    </span>
                    <div className="flex gap-1">
                      <input type="text" className="form-input flex-1 min-w-0" value={urunParamForm.satici} onChange={(e) => setU({ satici: e.target.value })} />
                      <button type="button" className="shrink-0 h-9 w-9 flex items-center justify-center border border-slate-300 rounded bg-gradient-to-b from-white to-slate-100 hover:from-slate-50" title="Ara">
                        <Search className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Partaj<span className="text-red-600"> *</span>
                    </span>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        readOnly
                        className="form-input flex-1 min-w-0 bg-slate-50"
                        placeholder="Acente seçiniz"
                        value={urunParamForm.partajKod ? `${urunParamForm.partajKod} ${urunParamForm.partajAd}` : ''}
                      />
                      <button
                        type="button"
                        onClick={() => setPartajModalOpen(true)}
                        className="shrink-0 h-9 w-9 flex items-center justify-center border border-slate-300 rounded bg-gradient-to-b from-white to-slate-100 hover:from-slate-50"
                        title="Acente listesi"
                      >
                        <LayoutGrid className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ürün Kodu<span className="text-red-600"> *</span>
                    </span>
                    <select
                      className="form-select w-full"
                      disabled={!urunParamForm.partajKod}
                      value={urunParamForm.urunKod}
                      onChange={(e) => {
                        const uk = e.target.value
                        setUrunParamForm((p) => ({
                          ...p,
                          urunKod: uk,
                          planId: '',
                          paraBirimi: '',
                          endeksKod: '',
                          endeksDonemleri: [],
                        }))
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {urunPlanTarifeKartlari.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.sozlesmeTipi} — {u.ad}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="block min-w-0">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                      Plan<span className="text-red-600"> *</span>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" title="Ürüne bağlı planlar" />
                    </span>
                    <select
                      className="form-select w-full"
                      disabled={!urunParamForm.urunKod}
                      value={urunParamForm.planId}
                      onChange={(e) => {
                        const pid = e.target.value
                        if (!pid) {
                          setUrunParamForm((p) => ({ ...p, planId: '', paraBirimi: '', endeksKod: '', endeksDonemleri: [] }))
                          return
                        }
                        const dov = dovizlerForUrunPlan(urunParamForm.urunKod, pid)
                        setUrunParamForm((p) => ({
                          ...p,
                          planId: pid,
                          paraBirimi: dov[0] || '',
                          endeksKod: '',
                          endeksDonemleri: [],
                        }))
                      }}
                    >
                      <option value="">Seçiniz</option>
                      {plansForUrun.map((pl) => (
                        <option key={pl.id} value={pl.id}>
                          {pl.ad}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                      Analiz Tipi<span className="text-red-600"> *</span>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <select
                      className="form-select w-full"
                      disabled={!urunParamForm.planId}
                      value={urunParamForm.analizTipi}
                      onChange={(e) => {
                        const v = e.target.value
                        setUrunParamForm((p) => ({
                          ...p,
                          analizTipi: v,
                          donemselKp: v === ANALIZ_TIPLERI[0] ? p.donemselKp : '',
                        }))
                      }}
                    >
                      {ANALIZ_TIPLERI.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">Para Birimi</span>
                    <select
                      className="form-select w-full"
                      disabled={!urunParamForm.planId}
                      value={urunParamForm.paraBirimi}
                      onChange={(e) => setU({ paraBirimi: e.target.value })}
                    >
                      <option value="">Seçiniz</option>
                      {planDovizler.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Demo Tarihi<span className="text-red-600"> *</span>
                    </span>
                    <input type="text" readOnly disabled className="form-input bg-slate-200 text-slate-600 cursor-not-allowed" value={urunParamForm.demoTarihi} />
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Sisteme Giriş Tarihi<span className="text-red-600"> *</span>
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="gg.aa.yyyy"
                      value={urunParamForm.sistemGirisTarihi}
                      onChange={(e) => setU({ sistemGirisTarihi: e.target.value })}
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Taksit Adedi<span className="text-red-600"> *</span>
                    </span>
                    <select className="form-select w-full" value={urunParamForm.taksitAdedi} onChange={(e) => setU({ taksitAdedi: e.target.value })}>
                      <option value="">Seçiniz</option>
                      {odemeDonemiTurleri.map((o) => (
                        <option key={o.id} value={String(o.kod)}>
                          {o.aciklama}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">Endeks Tipi</span>
                    <select
                      className="form-select w-full"
                      disabled={!urunParamForm.planId}
                      value={urunParamForm.endeksKod}
                      onChange={(e) => setUrunParamForm((p) => ({ ...p, endeksKod: e.target.value, endeksDonemleri: [] }))}
                    >
                      <option value="">Seçiniz</option>
                      {planEndeksler.map((ex) => (
                        <option key={ex.kod} value={ex.kod}>
                          {ex.ad}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="block min-w-0 relative">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">Endeks Dönemi</span>
                    <button
                      type="button"
                      disabled={!urunParamForm.endeksKod}
                      onClick={() => setEndeksDonemPanelAcik((x) => !x)}
                      className="form-input w-full text-left flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate text-slate-700">
                        {urunParamForm.endeksDonemleri.length === 0
                          ? '0 tane seçildi'
                          : `${urunParamForm.endeksDonemleri.length} tane seçildi`}
                      </span>
                      <span className="text-slate-400 text-xs shrink-0">▼</span>
                    </button>
                    {endeksDonemPanelAcik && urunParamForm.endeksKod && secilenEndeksSatir && (
                      <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded border border-slate-200 bg-white shadow-lg p-2 space-y-1">
                        {secilenEndeksSatir.donemler.map((d) => (
                          <label key={d} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={urunParamForm.endeksDonemleri.includes(d)}
                              onChange={() => toggleEndeksDonem(d)}
                            />
                            {d}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Dönemsel KP Tutarı
                      {kpAnalizAktif ? <span className="text-red-600"> *</span> : null}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input w-full disabled:bg-slate-100 disabled:cursor-not-allowed"
                      disabled={!kpAnalizAktif}
                      placeholder={kpAnalizAktif ? '0' : '—'}
                      value={urunParamForm.donemselKp}
                      onChange={(e) => setU({ donemselKp: e.target.value })}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="block min-w-0">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                      BAU Oranı
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" title="0 ile 1 arası" />
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input w-full"
                      placeholder="0 — 1"
                      value={urunParamForm.bauOrani}
                      onChange={(e) => setU({ bauOrani: e.target.value })}
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">Ek Süre (Yıl)</span>
                    <input
                      type="number"
                      min="0"
                      className="form-input w-full"
                      value={urunParamForm.ekSureYil}
                      onChange={(e) => setU({ ekSureYil: e.target.value })}
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-700 mb-1">Başlangıç Kapitali</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-input w-full"
                      value={urunParamForm.baslangicKapitali}
                      onChange={(e) => setU({ baslangicKapitali: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            </ErpSection>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <ErpFooterBtn icon={ChevronLeft} label="Geri Dön" onClick={handleUrunGeri} />
              <ErpFooterBtn icon={Calculator} label="Hesapla" onClick={handleUrunParamHesapla} />
            </div>

            <Modal open={partajModalOpen} onClose={() => setPartajModalOpen(false)} title="Acente (Partaj) seçimi" description="Acente kodu ve adı" size="lg">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold">Acente Kodu</th>
                      <th className="text-left px-3 py-2 font-semibold">Adı</th>
                      <th className="w-24 px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_ACENTELER.map((a) => (
                      <tr key={a.kod} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono">{a.kod}</td>
                        <td className="px-3 py-2">{a.ad}</td>
                        <td className="px-3 py-2">
                          <button type="button" className="text-xs font-semibold text-blue-700 hover:underline" onClick={() => partajSecildi(a)}>
                            Seç
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Modal>
          </div>
        )}

        {step === 2 && mainTab === 'hesap' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {(urunParamForm.urunKod || urunParamForm.planId) && (
              <ErpSection title="Seçilen ürün parametreleri (özet)">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500">Partaj</dt>
                    <dd className="font-medium text-slate-800">
                      {urunParamForm.partajKod ? `${urunParamForm.partajKod} ${urunParamForm.partajAd}` : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Ürün</dt>
                    <dd className="font-medium text-slate-800">
                      {urunPlanTarifeKartlari.find((u) => u.id === urunParamForm.urunKod)?.ad || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Plan</dt>
                    <dd className="font-medium text-slate-800">
                      {plansForUrun.find((p) => p.id === urunParamForm.planId)?.ad || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Analiz / Para / Taksit</dt>
                    <dd className="font-medium text-slate-800">
                      {urunParamForm.analizTipi || '—'} · {urunParamForm.paraBirimi || '—'} ·{' '}
                      {odemeDonemiTurleri.find((o) => String(o.kod) === String(urunParamForm.taksitAdedi))?.aciklama || urunParamForm.taksitAdedi || '—'}
                    </dd>
                  </div>
                </dl>
              </ErpSection>
            )}
            <ErpSection title="Hesaplama özeti">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Toplam Katılımcı Ödemesi</span>
                  <strong className="text-slate-900 tabular-nums">{fmtTl(summary.katilimciOdeme)}</strong>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Toplam Devlet Katkısı</span>
                  <strong className="text-slate-900 tabular-nums">{fmtTl(summary.devletKatkisi)}</strong>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Nominal Birikim</span>
                  <strong className="text-slate-900 tabular-nums">{fmtTl(summary.nominalBirikim)}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Reel Birikim</span>
                  <strong className="text-blue-800 tabular-nums text-base">{fmtTl(summary.reelBirikim)}</strong>
                </div>
              </div>
            </ErpSection>
          </div>
        )}
      </div>
    </div>
  )
}

function ErpSearchField({ label, required, children }) {
  return (
    <label className="block min-w-0">
      <span className="block text-[11px] font-semibold text-slate-700 mb-1">
        {label}
        {required ? <span className="text-red-600"> **</span> : null}
      </span>
      {children}
    </label>
  )
}

function ErpFooterBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-xs font-semibold text-slate-800 hover:from-slate-50 shadow-sm"
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </button>
  )
}

function ErpSection({ title, children }) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

function PhoneRow({ label, alan, numara, onAlan, onNumara, alanOptions = ALAN_KODLARI, isCep, disabled, kilitCls = '' }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>
      <div className="flex gap-2">
        <select className={`form-select w-28 shrink-0 text-sm ${kilitCls}`} disabled={disabled} value={alan} onChange={(e) => onAlan(e.target.value)}>
          {(isCep ? ['Seçiniz', ...CEP_PREFIX] : alanOptions).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <input className={`form-input flex-1 ${kilitCls}`} disabled={disabled} placeholder={isCep ? '391 68 06' : ''} value={numara} onChange={(e) => onNumara(e.target.value)} />
      </div>
    </label>
  )
}

export default DemoScreen
