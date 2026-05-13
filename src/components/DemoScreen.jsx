import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Search, Check, FilePlus, Pencil, Trash2, Eye, HelpCircle, Calculator, LayoutGrid, Menu } from 'lucide-react'
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

const fmtTr2 = (value) =>
  new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0)

const fmtTr0 = (value) =>
  new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value) || 0))

/** TR giriş: 1.000.000,50 veya 1000000 */
function parseTrDecimal(raw) {
  if (raw == null) return NaN
  const s = String(raw).trim().replace(/\s/g, '')
  if (!s) return NaN
  const lastComma = s.lastIndexOf(',')
  const lastDot = s.lastIndexOf('.')
  let norm = s
  if (lastComma > -1 && lastDot > -1) {
    norm = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '')
  } else if (lastComma > -1) {
    norm = s.replace(/\./g, '').replace(',', '.')
  } else {
    norm = s.replace(/,/g, '')
  }
  return Number(norm)
}

/** Simülasyon özeti ile aynı nominal birikim modelinde hedef tutara göre aylık katkı payı */
function solveAylikKatkiForNominalHedef(hedefNominal, simForm) {
  const yil = Math.max(0.1, Number(simForm.sureYil) || 30)
  const ay = Math.round(yil * 12)
  const r = (Number(simForm.yillikFonGetirisi) || 0) / 12 / 100
  const d = Math.max(0, (Number(simForm.devletKatkisiOrani) || 20) / 100)
  const hedef = Math.max(0, Number(hedefNominal) || 0)
  if (hedef <= 0) return 0
  const eff = 1 + d
  const fvPerAylik =
    r > 1e-12 ? eff * ((Math.pow(1 + r, ay) - 1) / r) : eff * ay
  return fvPerAylik > 0 ? hedef / fvPerAylik : 0
}

/** gg.aa.yyyy / gg.aa.yyyy benzeri doğum tarihi */
function parseDogumTrToDate(raw) {
  const s = String(raw || '').trim()
  const p = s.split(/[./-]/).map((x) => x.trim())
  if (p.length !== 3) return null
  const gun = Number(p[0])
  const ay = Number(p[1])
  const yil = Number(p[2])
  if (!yil || ay < 1 || ay > 12 || gun < 1 || gun > 31) return null
  const d = new Date(yil, ay - 1, gun)
  if (d.getFullYear() !== yil || d.getMonth() !== ay - 1 || d.getDate() !== gun) return null
  return d
}

/** Demo referans tarihi (ürün ekranıyla uyumlu) */
function yasDogumdan(dogumStr, ref = new Date(2026, 4, 13)) {
  const b = parseDogumTrToDate(dogumStr)
  if (!b || b.getTime() > ref.getTime()) return null
  let yas = ref.getFullYear() - b.getFullYear()
  const md = ref.getMonth() - b.getMonth()
  if (md < 0 || (md === 0 && ref.getDate() < b.getDate())) yas -= 1
  return yas
}

/** 56 yaş kuralı: kalan tam yıl (0–50). Doğum yoksa başlangıç yaşı yedek. */
function yil56Kurali(dogumStr, baslangicYasFallback) {
  const y = yasDogumdan(dogumStr)
  if (y != null && Number.isFinite(y)) {
    return Math.max(0, Math.min(50, 56 - y))
  }
  const by = Number(baslangicYasFallback)
  if (Number.isFinite(by) && by >= 18 && by < 56) {
    return Math.max(0, Math.min(50, 56 - by))
  }
  return null
}

/** Aylık ödemeli birikim — yıllık reel net getiri (efektif), ay bileşik */
function fvAylikReelBirikim(aylikYatirim, annualRealRate, yilAdet) {
  const n = Math.max(0, Math.floor(Number(yilAdet) || 0) * 12)
  if (n <= 0 || aylikYatirim <= 0) return 0
  const ar = Math.max(-0.99, Number(annualRealRate) || 0)
  const rm = Math.pow(1 + ar, 1 / 12) - 1
  if (Math.abs(rm) < 1e-14) return aylikYatirim * n
  return aylikYatirim * ((Math.pow(1 + rm, n) - 1) / rm)
}

function planlarTaslakHaric(plans) {
  return (plans || []).filter((p) => (p.durum || '').trim() !== 'Taslak')
}

/** Demo: simülasyon girdilerine göre yaş bazlı birikim serisi (grafik + tablo) */
function buildBirikimSerisi(simForm, iyimser) {
  const aylik = Number(simForm.aylikKatkiPayi) || 0
  const yillik = aylik * 12
  const basYas = Math.max(18, Math.min(80, Number(simForm.baslangicYas) || 26))
  const yilAdet = Math.max(1, Math.min(50, Number(simForm.sureYil) || 30))
  const g = Math.max(0, (Number(simForm.yillikFonGetirisi) || 0) / 100) * 0.85
  const devOran = Math.max(0, (Number(simForm.devletKatkisiOrani) || 20) / 100)
  const scen = iyimser ? 1 : 0.62
  const rows = []
  for (let i = 0; i < yilAdet; i++) {
    const yil = i + 1
    const age = basYas + i
    const t = yil / yilAdet
    const kontrib = yillik * yil * scen
    const yatirim = kontrib * (1 - devOran * 0.55) * (0.62 + 0.12 * t)
    const devlet = kontrib * devOran * (0.38 + 0.1 * t)
    const yatirimGetiri = yatirim * (Math.pow(1 + g, yil) - 1) * (iyimser ? 0.92 : 0.78)
    const devletGetiri = devlet * (Math.pow(1 + g * 0.93, yil) - 1) * (iyimser ? 0.9 : 0.75)
    const katilimciBrut = yatirim + yatirimGetiri * 0.58
    const katilimciNet = (yatirim + yatirimGetiri) * 0.93
    const dkpBrut = devlet + devletGetiri * 0.52
    const dkpNet = (devlet + devletGetiri) * 0.93
    const tahminiBrut = katilimciBrut + dkpBrut
    const tahminiNet = katilimciNet + dkpNet
    rows.push({
      age,
      yil,
      yatirim,
      yatirimGetiri,
      devlet,
      devletGetiri,
      katilimciBrut,
      katilimciNet,
      dkpBrut,
      dkpNet,
      tahminiBrut,
      tahminiNet,
    })
  }
  return rows
}

function BirikimStackedBarChart({ rows }) {
  const [tip, setTip] = useState(null)
  const max = useMemo(() => Math.max(...rows.map((r) => r.yatirim + r.yatirimGetiri + r.devlet + r.devletGetiri), 1), [rows])
  const pct = (v) => `${(v / max) * 100}%`
  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-bold text-slate-800 text-center flex-1">Birikim Tutarının Değişimi</h4>
        <button
          type="button"
          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
          title="Dışa aktar (demo)"
          onClick={() => alert('Demo: PNG / PDF dışa aktarma yakında.')}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
      <div className="text-[10px] text-slate-500 mb-1">Birikim Tutarı (TL)</div>
      <div className="relative flex h-64 items-end gap-px overflow-x-auto border-b border-slate-200 pb-1">
        {rows.map((r, idx) => (
          <div
            key={r.age}
            className="flex flex-col items-center shrink-0 w-5 group"
            onMouseEnter={(e) => setTip({ idx, r, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setTip((prev) => (prev && prev.idx === idx ? { ...prev, x: e.clientX, y: e.clientY } : prev))}
            onMouseLeave={() => setTip(null)}
          >
            <div className="flex w-full flex-col-reverse h-56 rounded-sm overflow-hidden ring-1 ring-transparent group-hover:ring-blue-300">
              <div style={{ height: pct(r.yatirim) }} className="bg-sky-300 w-full min-h-[1px]" title="" />
              <div style={{ height: pct(r.yatirimGetiri) }} className="bg-slate-700 w-full min-h-[1px]" />
              <div style={{ height: pct(r.devlet) }} className="bg-emerald-400 w-full min-h-[1px]" />
              <div style={{ height: pct(r.devletGetiri) }} className="bg-orange-300 w-full min-h-[1px]" />
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 tabular-nums">{r.age}</span>
          </div>
        ))}
      </div>
      {tip ? (
        <div
          className="fixed z-[80] pointer-events-none rounded border border-slate-300 bg-white px-3 py-2 text-xs shadow-lg max-w-[240px]"
          style={{ left: Math.min(tip.x + 12, typeof window !== 'undefined' ? window.innerWidth - 260 : tip.x + 12), top: tip.y + 12 }}
        >
          <div className="font-bold text-slate-800 mb-1 border-b border-slate-100 pb-1">{tip.r.age} YAŞ</div>
          <div className="space-y-0.5 text-slate-700">
            <div>Yatırıma Yönlenen Kümülatif Tutar (TL): {fmtTr2(tip.r.yatirim)}</div>
            <div>Yatırıma Yönlenen Kümülatif Tutarın Getirisi (TL): {fmtTr2(tip.r.yatirimGetiri)}</div>
            <div>Kümülatif Devlet Katkısı (TL): {fmtTr2(tip.r.devlet)}</div>
            <div>Kümülatif Devlet Katkısının Getirisi (TL): {fmtTr2(tip.r.devletGetiri)}</div>
            <div className="font-semibold pt-1 border-t border-slate-100 mt-1">
              Toplam: {fmtTr2(tip.r.yatirim + tip.r.yatirimGetiri + tip.r.devlet + tip.r.devletGetiri)}
            </div>
          </div>
        </div>
      ) : null}
      <div className="text-[10px] text-center text-slate-500 mt-1">Yaş</div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[10px] text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-sky-300" /> Yatırıma Yönlenen Kümülatif Tutar (TL)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-700" /> Yatırıma Yönlenen Kümülatif Tutarın Getirisi (TL)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Kümülatif Devlet Katkısı (TL)
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-orange-300" /> Kümülatif Devlet Katkısının Getirisi (TL)
        </span>
      </div>
    </div>
  )
}

function SenaryoTablo({ rows, baslik, yillikKp }) {
  const [page, setPage] = useState(1)
  const perPage = 10
  const total = rows.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  const slice = rows.slice((page - 1) * perPage, page * perPage)
  const sonNet = rows.length ? rows[rows.length - 1].tahminiNet : 0

  useEffect(() => {
    setPage(1)
  }, [baslik, rows])

  return (
    <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
      <legend className="text-sm font-bold text-slate-800 px-1">{baslik}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 mb-1">Tahmini Emeklilik Birikimi</span>
          <input readOnly className="form-input bg-slate-50 tabular-nums" value={fmtTr2(sonNet)} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 mb-1">Yıllık Katkı Payı</span>
          <input readOnly className="form-input bg-slate-50 tabular-nums" value={fmtTr2(yillikKp)} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-slate-600 mb-1">Yıllık Düzenli Katkı Payı</span>
          <input readOnly className="form-input bg-slate-50 tabular-nums" value={fmtTr2(yillikKp)} />
        </label>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-xs min-w-[900px]">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="text-left px-2 py-2 font-semibold">Yaş</th>
              <th className="text-left px-2 py-2 font-semibold">Yıl</th>
              <th className="text-right px-2 py-2 font-semibold">Katılımcı Birikim (Brüt)</th>
              <th className="text-right px-2 py-2 font-semibold">Katılımcı Birikim (Net)</th>
              <th className="text-right px-2 py-2 font-semibold">DKP Birikim (Brüt)</th>
              <th className="text-right px-2 py-2 font-semibold">DKP Birikim (Net)</th>
              <th className="text-right px-2 py-2 font-semibold">Tahmini Birikim (Brüt)</th>
              <th className="text-right px-2 py-2 font-semibold">Tahmini Birikim (Net)</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.age} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-2 py-1.5 tabular-nums">{r.age}</td>
                <td className="px-2 py-1.5 tabular-nums">{r.yil}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtTr2(r.katilimciBrut)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtTr2(r.katilimciNet)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtTr2(r.dkpBrut)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtTr2(r.dkpNet)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtTr2(r.tahminiBrut)}</td>
                <td className="px-2 py-1.5 text-right tabular-nums">{fmtTr2(r.tahminiNet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-slate-600">
        <button type="button" className="h-8 px-3 rounded border border-slate-300 bg-white text-xs font-semibold">
          Detay
        </button>
        <div className="flex items-center gap-2">
          <select className="border border-slate-200 rounded px-2 py-1 bg-white" value={perPage} disabled>
            <option>10</option>
          </select>
          <button type="button" className="p-1 rounded border border-slate-200 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(1)}>
            «
          </button>
          <button type="button" className="p-1 rounded border border-slate-200 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            ‹
          </button>
          <span className="tabular-nums">
            {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} / {total}
          </span>
          <button type="button" className="p-1 rounded border border-slate-200 disabled:opacity-40" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
            ›
          </button>
          <button type="button" className="p-1 rounded border border-slate-200 disabled:opacity-40" disabled={page >= pages} onClick={() => setPage(pages)}>
            »
          </button>
        </div>
      </div>
    </fieldset>
  )
}

const ANALIZ_TIPLERI = ['Katkı Payından Birikime', 'Birikimden Katkı Payına', 'Süreden Katkı Payına']

const DEMO_BILGI_ADIMLAR = [
  { id: 1, title: 'Acente ve ürün', hint: 'Satıcı, partaj, ürün ve plan' },
  { id: 2, title: 'Analiz ve dönem', hint: 'Analiz tipi, para birimi ve tarihler' },
  { id: 3, title: 'Ödeme ve tutarlar', hint: 'Taksit ve katkı payı bilgileri' },
  { id: 4, title: 'Endeks ve oranlar', hint: 'Endeks, BAU, ek süre ve başlangıç' },
]
const DEMO_TURLERI = ['Aktif Sözleşmeye', 'Potansiyel Müşteriye', 'Mevcut Müşteriye']

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
  const [kisiPopupOpen, setKisiPopupOpen] = useState(false)
  const [demoTuru, setDemoTuru] = useState('Mevcut Müşteriye')
  const [seciliSozlesmeNo, setSeciliSozlesmeNo] = useState('')
  const [aktifSozlesmeRows, setAktifSozlesmeRows] = useState([])

  const [musteriArama, setMusteriArama] = useState(emptyMusteriArama)
  const [musteriListe, setMusteriListe] = useState([])
  const [musteriSeciliRef, setMusteriSeciliRef] = useState(null)
  const [basvuruPanelAcik, setBasvuruPanelAcik] = useState(false)
  const [hesapPanelAcik, setHesapPanelAcik] = useState(false)

  const [simForm, setSimForm] = useState({
    aylikKatkiPayi: 2000,
    baslangicYas: 26,
    sureYil: 31,
    yillikFonGetirisi: 20,
    yillikEnflasyon: 15,
    devletKatkisiOrani: 20,
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
    hedefBirikimTutari: '',
  })
  const [partajModalOpen, setPartajModalOpen] = useState(false)
  const [endeksDonemPanelAcik, setEndeksDonemPanelAcik] = useState(false)
  const [hesapSenaryo, setHesapSenaryo] = useState('iyimser')
  const [hesapIcerikTab, setHesapIcerikTab] = useState('grafik')
  const [demoBilgiAdim, setDemoBilgiAdim] = useState(1)
  const [aktifUrunSecimModalOpen, setAktifUrunSecimModalOpen] = useState(false)
  const [aktifPlanSecimModalOpen, setAktifPlanSecimModalOpen] = useState(false)
  const [aktifUrunKod, setAktifUrunKod] = useState('')
  const [aktifPlanId, setAktifPlanId] = useState('')
  const [aktifUrunAra, setAktifUrunAra] = useState('')
  const [aktifPlanAra, setAktifPlanAra] = useState('')

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
    return planlarTaslakHaric(urunPlanlari[urunParamForm.urunKod] || [])
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
  const birikimdenKpAnalizAktif = urunParamForm.analizTipi === ANALIZ_TIPLERI[1]
  const aktifUrun = useMemo(() => urunPlanTarifeKartlari.find((u) => u.id === aktifUrunKod) || null, [aktifUrunKod])
  const aktifPlanlar = useMemo(() => (aktifUrunKod ? planlarTaslakHaric(urunPlanlari[aktifUrunKod] || []) : []), [aktifUrunKod])
  const filtreliAktifUrunler = useMemo(() => {
    const q = aktifUrunAra.trim().toLowerCase()
    if (!q) return urunPlanTarifeKartlari
    return urunPlanTarifeKartlari.filter((u) => `${u.id} ${u.ad} ${u.sozlesmeTipi}`.toLowerCase().includes(q))
  }, [aktifUrunAra])
  const filtreliAktifPlanlar = useMemo(() => {
    const q = aktifPlanAra.trim().toLowerCase()
    if (!q) return aktifPlanlar
    return aktifPlanlar.filter((p) => `${p.id} ${p.ad} ${p.durum}`.toLowerCase().includes(q))
  }, [aktifPlanAra, aktifPlanlar])
  const aktifSozlesmeSeciliMi = useMemo(() => aktifSozlesmeRows.some((r) => r.sozlesmeNo === seciliSozlesmeNo), [aktifSozlesmeRows, seciliSozlesmeNo])

  useEffect(() => {
    const { urunKod, planId } = urunParamForm
    if (!planId || !urunKod) return
    const p = (urunPlanlari[urunKod] || []).find((x) => x.id === planId)
    if (p && String(p.durum || '').trim() === 'Taslak') {
      setUrunParamForm((prev) => ({ ...prev, planId: '', paraBirimi: '', endeksKod: '', endeksDonemleri: [] }))
    }
  }, [urunParamForm.urunKod, urunParamForm.planId])

  /** Birikimden KP: hedef + mevcut getiri/süre ile türetilen aylık (sekme Hesapla olmadan da tutarlı) */
  const simFormEfektif = useMemo(() => {
    if (!birikimdenKpAnalizAktif) return simForm
    const hedef = parseTrDecimal(urunParamForm.hedefBirikimTutari)
    if (!Number.isFinite(hedef) || hedef <= 0) return simForm
    const a = solveAylikKatkiForNominalHedef(hedef, simForm)
    if (!Number.isFinite(a) || a <= 0) return simForm
    return { ...simForm, aylikKatkiPayi: String(Math.max(1, Math.round(a))) }
  }, [birikimdenKpAnalizAktif, urunParamForm.hedefBirikimTutari, simForm])

  const birikimRows = useMemo(() => buildBirikimSerisi(simFormEfektif, hesapSenaryo === 'iyimser'), [simFormEfektif, hesapSenaryo])

  const birikimdenHesapOzeti = useMemo(() => {
    if (!birikimdenKpAnalizAktif) return null
    const hedefNum = parseTrDecimal(urunParamForm.hedefBirikimTutari)
    const basYas = Math.max(18, Math.min(80, Number(simForm.baslangicYas) || 26))
    const yilAdet = Math.max(1, Math.min(50, Number(simForm.sureYil) || 30))
    const hedefYas = basYas + yilAdet - 1
    const aylik = Number(simFormEfektif.aylikKatkiPayi) || 0
    if (!Number.isFinite(hedefNum) || hedefNum <= 0 || aylik <= 0) return null
    return { hedefNum, basYas, hedefYas, aylik }
  }, [birikimdenKpAnalizAktif, urunParamForm.hedefBirikimTutari, simForm.baslangicYas, simForm.sureYil, simFormEfektif.aylikKatkiPayi])

  const yillikKpDegeri = useMemo(() => (Number(simFormEfektif.aylikKatkiPayi) || 0) * 12, [simFormEfektif.aylikKatkiPayi])

  const kesintiFigkOranlari = useMemo(() => {
    const raw = String(urunParamForm.bauOrani || '').replace(',', '.').trim()
    const n = raw === '' ? NaN : Number(raw)
    // Ekran örneği: FİGK ve DK FİGK aynı oran (BAU 0–1 arası → %; yoksa demo 2,73)
    const pct = !Number.isNaN(n) && n >= 0 && n <= 1 ? n * 100 : 2.73
    return { figk: pct, dkFigk: pct }
  }, [urunParamForm.bauOrani])

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
    setSeciliSozlesmeNo('')
    setAktifSozlesmeRows([])
    if (applyMockCustomer(refKisiNo)) {
      setKisiSecimKaynagi('kayitli')
      setMusteriArama((prev) => ({ ...prev, musteriNo: refKisiNo }))
    }
  }

  const handleMusteriAramaCalistir = () => {
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
    setSeciliSozlesmeNo('')
    setAktifSozlesmeRows([])
    setPerson(emptyPerson())
    setKisiSecimKaynagi(null)
  }

  const handleMusteriSec = () => {
    if (!musteriSeciliRef) {
      alert('Önce müşteri listesinden bir satır seçiniz.')
      return
    }
    selectMusteriFromListe(musteriSeciliRef)
    setKisiPopupOpen(false)
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
    if (demoTuru === 'Potansiyel Müşteriye') {
      if (!person.cinsiyet || !person.dogumTarihi.trim()) {
        alert('Potansiyel müşteri için Cinsiyet ve Doğum Tarihi giriniz.')
        return
      }
      setKisiSecimKaynagi('yeni')
      setStep(2)
      setMainTab('urun')
      return
    }

    if (demoTuru === 'Mevcut Müşteriye') {
      if (kisiSecimKaynagi !== 'kayitli') {
        alert('Önce müşteri arama ekranından bir müşteri seçiniz.')
        return
      }
      setStep(2)
      setMainTab('urun')
      return
    }

    if (demoTuru === 'Aktif Sözleşmeye') {
      if (kisiSecimKaynagi !== 'kayitli') {
        alert('Önce müşteri arayıp seçiniz.')
        return
      }
      if (!aktifSozlesmeSeciliMi) {
        alert('Devam etmek için sözleşme listesinden bir kayıt seçiniz.')
        return
      }
      setStep(2)
      setMainTab('urun')
      return
    }

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
    const aylikKatki = Number(simFormEfektif.aylikKatkiPayi) || 0
    const yilKural = yil56Kurali(person.dogumTarihi, simFormEfektif.baslangicYas)
    const yillar =
      yilKural != null ? yilKural : Math.max(1, Math.min(50, Number(simFormEfektif.sureYil) || 30))

    const dkOran = (Number(simFormEfektif.devletKatkisiOrani) || 20) / 100
    const katilimciOdeme = aylikKatki * 12 * yillar
    const devletKatkisi = aylikKatki * 12 * dkOran * yillar

    const reelYillik = hesapSenaryo === 'iyimser' ? 0.03 : 0.01
    const aylikToplamKatki = aylikKatki * (1 + dkOran)
    const reelBirikim = fvAylikReelBirikim(aylikToplamKatki, reelYillik, yillar)

    return { katilimciOdeme, devletKatkisi, reelBirikim, yillar }
  }, [simFormEfektif, person.dogumTarihi, hesapSenaryo])

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
    if (demoBilgiAdim < 4) {
      alert('Lütfen demo bilgilerinde «Sonraki adım» ile 4. adıma kadar ilerleyiniz; ardından Hesapla ile devam ediniz.')
      return
    }
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
      const kp = parseTrDecimal(f.donemselKp)
      if (!Number.isFinite(kp) || kp <= 0) {
        alert('Dönemsel KP tutarı giriniz.')
        return
      }
      setSimForm((prev) => ({ ...prev, aylikKatkiPayi: String(kp) }))
    } else if (birikimdenKpAnalizAktif) {
      const hedef = parseTrDecimal(f.hedefBirikimTutari)
      if (!Number.isFinite(hedef) || hedef <= 0) {
        alert('Hedef birikim tutarını giriniz.')
        return
      }
      const aylik = solveAylikKatkiForNominalHedef(hedef, simForm)
      if (!Number.isFinite(aylik) || aylik <= 0) {
        alert('Hedef tutar için aylık katkı payı hesaplanamadı. Süre ve getiri değerlerini kontrol ediniz.')
        return
      }
      setSimForm((prev) => ({ ...prev, aylikKatkiPayi: String(Math.max(1, Math.round(aylik))) }))
    } else {
      const aylik = parseTrDecimal(String(simForm.aylikKatkiPayi))
      if (!Number.isFinite(aylik) || aylik <= 0) {
        alert('Aylık katkı payı tutarını giriniz.')
        return
      }
      setSimForm((prev) => ({ ...prev, aylikKatkiPayi: String(aylik) }))
    }
    if (f.bauOrani.trim()) {
      const b = Number(String(f.bauOrani).replace(',', '.'))
      if (Number.isNaN(b) || b < 0 || b > 1) {
        alert('BAU oranı 0 ile 1 arasında olmalıdır.')
        return
      }
    }
    setDemoBilgiAdim(1)
    setMainTab('hesap')
  }

  const handleUrunGeri = () => {
    setDemoBilgiAdim(1)
    setStep(1)
    setMainTab('kisi')
  }

  useEffect(() => {
    if (step !== 2 || mainTab !== 'urun') setDemoBilgiAdim(1)
  }, [step, mainTab])

  const demoWizardOnceki = () => setDemoBilgiAdim((x) => Math.max(1, x - 1))

  const demoWizardSonraki = () => {
    if (demoBilgiAdim >= 4) return
    const f = urunParamForm
    if (demoBilgiAdim === 1) {
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
    } else if (demoBilgiAdim === 2) {
      if (!f.paraBirimi) {
        alert('Para birimi seçiniz.')
        return
      }
      if (!f.demoTarihi.trim() || !f.sistemGirisTarihi.trim()) {
        alert('Demo tarihi ve sisteme giriş tarihini giriniz.')
        return
      }
    } else if (demoBilgiAdim === 3) {
      if (!f.taksitAdedi) {
        alert('Taksit adedi seçiniz.')
        return
      }
      if (kpAnalizAktif) {
        const kp = parseTrDecimal(f.donemselKp)
        if (!Number.isFinite(kp) || kp <= 0) {
          alert('Dönemsel KP tutarı giriniz.')
          return
        }
      }
      if (birikimdenKpAnalizAktif) {
        const h = parseTrDecimal(f.hedefBirikimTutari)
        if (!Number.isFinite(h) || h <= 0) {
          alert('Hedef birikim tutarını giriniz.')
          return
        }
      }
      if (f.analizTipi === ANALIZ_TIPLERI[2]) {
        const a = parseTrDecimal(String(simForm.aylikKatkiPayi))
        if (!Number.isFinite(a) || a <= 0) {
          alert('Aylık katkı payı tutarını giriniz.')
          return
        }
      }
    }
    setDemoBilgiAdim((x) => Math.min(4, x + 1))
  }

  const aktifUrunSec = (urun) => {
    setAktifUrunKod(urun.id)
    setAktifPlanId('')
    setSeciliSozlesmeNo('')
    setAktifSozlesmeRows([])
    setAktifUrunSecimModalOpen(false)
  }

  const aktifPlanSec = (plan) => {
    setAktifPlanId(plan.id)
    setSeciliSozlesmeNo('')
    setAktifSozlesmeRows([])
    setAktifPlanSecimModalOpen(false)
  }

  const handleAktifSozlesmeAra = () => {
    if (!musteriBulundu) {
      alert('Önce müşteri seçiniz.')
      return
    }
    const plan = aktifPlanlar.find((p) => p.id === aktifPlanId)
    const base = `${aktifPlanId || aktifUrunKod || 'SZL'}`
    const rows = [
      {
        sozlesmeNo: `${base}-A1`,
        statu: 'Aktif',
        musteriNo: person.kisiNo || 'M-0001',
        ad: person.ad || 'Ad',
        soyad: person.soyad || 'Soyad',
        kimlik: person.tcKimlik || '—',
        cinsiyet: person.cinsiyet || '—',
      },
      {
        sozlesmeNo: `${base}-A2`,
        statu: plan?.durum || 'Taslak',
        musteriNo: person.kisiNo || 'M-0001',
        ad: person.ad || 'Ad',
        soyad: person.soyad || 'Soyad',
        kimlik: person.tcKimlik || '—',
        cinsiyet: person.cinsiyet || '—',
      },
    ]
    setAktifSozlesmeRows(rows)
    setSeciliSozlesmeNo('')
  }

  const setP = (key, value) => setPerson((prev) => ({ ...prev, [key]: value }))

  const musteriFormKilitli = kisiSecimKaynagi === 'kayitli'
  const kilitCls = musteriFormKilitli ? 'bg-slate-100 text-slate-800 cursor-not-allowed' : ''
  const demoPotansiyel = demoTuru === 'Potansiyel Müşteriye'
  const demoMevcut = demoTuru === 'Mevcut Müşteriye'
  const demoAktif = demoTuru === 'Aktif Sözleşmeye'
  const musteriBulundu = kisiSecimKaynagi === 'kayitli'
  const devamAktif =
    (demoPotansiyel && Boolean(person.cinsiyet && person.dogumTarihi.trim())) ||
    (demoMevcut && musteriBulundu) ||
    (demoAktif && musteriBulundu && aktifSozlesmeSeciliMi)

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
            <ErpSection title="Demo Türü">
              <div className="max-w-md">
                <label className="block">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">Demo Türü</span>
                  <select
                    className="form-select"
                    value={demoTuru}
                    onChange={(e) => {
                      setDemoTuru(e.target.value)
                      setKisiPopupOpen(false)
                      setMusteriSeciliRef(null)
                      setSeciliSozlesmeNo('')
                      if (e.target.value !== 'Potansiyel Müşteriye') {
                        setPerson(emptyPerson())
                        setKisiSecimKaynagi(null)
                      } else {
                        setPerson((prev) => ({
                          ...emptyPerson(),
                          cinsiyet: prev.cinsiyet,
                          dogumTarihi: prev.dogumTarihi,
                        }))
                        setKisiSecimKaynagi('yeni')
                      }
                    }}
                  >
                    {DEMO_TURLERI.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </ErpSection>

            {!demoPotansiyel && (
              <div className="rounded-lg border border-slate-300 bg-white shadow-sm">
              <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Arama Bilgileri</h3>
              </div>
              <div className="px-3 py-3 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_280px] gap-3 items-end">
                <label className="block min-w-0">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">Branş</span>
                  <input className="form-input bg-slate-50 text-sm" readOnly value="Emeklilik" />
                </label>
                <label className="block min-w-0">
                  <span className="block text-xs font-semibold text-slate-600 mb-1">Kişi No</span>
                  <div className="flex items-center gap-1">
                    <input
                      className="form-input text-sm font-mono"
                      value={person.kisiNo}
                      onChange={(e) => setP('kisiNo', e.target.value)}
                      list="demo-musteri-no"
                    />
                    <button
                      type="button"
                      onClick={() => setKisiPopupOpen(true)}
                      className="h-9 w-9 shrink-0 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-slate-700 hover:from-slate-50"
                      title="Müşteri ara"
                    >
                      <Search className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer pb-2">
                  <input type="checkbox" checked={person.baskaFirmadanAktarim} onChange={(e) => setP('baskaFirmadanAktarim', e.target.checked)} className="rounded border-slate-300" />
                  Başka Firmadan Aktarım Var Mı?
                </label>
              </div>
              </div>
            )}

            <Modal open={!demoPotansiyel && kisiPopupOpen} onClose={() => setKisiPopupOpen(false)} title="Müşteri Tanımlama" size="xl">
              <div className="rounded-lg border border-slate-300 bg-slate-100/90 shadow-md overflow-hidden">
              <div className="px-3 py-2 flex items-center justify-between bg-gradient-to-b from-slate-200 to-slate-300 border-b border-slate-400">
                <h3 className="text-sm font-bold text-slate-800">Müşteri Tanımlama</h3>
                <button type="button" onClick={() => setKisiPopupOpen(false)} className="text-slate-500 hover:text-slate-800 p-0.5 rounded" aria-label="Kapat" title="Demo">
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
                                setKisiPopupOpen(false)
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
            </Modal>

            {!demoPotansiyel && (
              <p className="text-xs text-slate-500 px-1">
              Listeden <strong className="text-slate-700">Seç</strong> veya satıra <strong className="text-slate-700">çift tıklayın</strong>; kişisel ve iletişim alanları müşteri verisiyle dolar ve kilitlenir. Yeni giriş için <strong>Temizle</strong> kullanın.
              </p>
            )}

            {!demoPotansiyel && musteriFormKilitli ? (
              <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                Kayıtlı müşteri seçildi — Kişisel ve İletişim bilgileri salt okunur.
              </p>
            ) : null}

            {demoPotansiyel ? (
              <ErpSection title="Kişisel Bilgiler">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Cinsiyet" required>
                    <select className="form-select" value={person.cinsiyet} onChange={(e) => setP('cinsiyet', e.target.value)}>
                      {CINSIYET.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Doğum Tarihi" required>
                    <input className="form-input" placeholder="gg.aa.yyyy" value={person.dogumTarihi} onChange={(e) => setP('dogumTarihi', e.target.value)} />
                  </Field>
                </div>
              </ErpSection>
            ) : null}

            {(demoMevcut && musteriBulundu) ? (
              <>
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
              </>
            ) : null}

            {(demoAktif && musteriBulundu) ? (
              <>
                <ErpSection title="Başvuru/Poliçe/Sözleşme Bilgileri">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                    <label className="block">
                      <span className="block text-xs font-semibold text-slate-600 mb-1">Ürün Kodu</span>
                      <div className="flex items-center gap-1">
                        <input className="form-input bg-slate-50" readOnly value={aktifUrun ? `${aktifUrun.id} - ${aktifUrun.ad}` : ''} placeholder="Seçiniz" />
                        <button
                          type="button"
                          onClick={() => setAktifUrunSecimModalOpen(true)}
                          className="h-9 w-9 shrink-0 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-slate-700 hover:from-slate-50"
                          title="Ürün listesi"
                        >
                          <LayoutGrid className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </label>
                    <label className="block">
                      <span className="block text-xs font-semibold text-slate-600 mb-1">Planlar</span>
                      <div className="flex items-center gap-1">
                        <input
                          className="form-input bg-slate-50"
                          readOnly
                          value={aktifPlanId ? `${aktifPlanId} - ${aktifPlanlar.find((x) => x.id === aktifPlanId)?.ad || ''}` : ''}
                          placeholder="Seçiniz"
                        />
                        <button
                          type="button"
                          disabled={!aktifUrunKod}
                          onClick={() => setAktifPlanSecimModalOpen(true)}
                          className="h-9 w-9 shrink-0 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-slate-700 hover:from-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Plan listesi"
                        >
                          <LayoutGrid className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="block text-xs font-semibold text-slate-600 mb-1">Sözleşme No</span>
                      <div className="flex items-center gap-2">
                        <input className="form-input" value={seciliSozlesmeNo} onChange={(e) => setSeciliSozlesmeNo(e.target.value)} />
                        <button
                          type="button"
                          onClick={handleAktifSozlesmeAra}
                          className="h-9 px-3 shrink-0 rounded border border-slate-400 bg-gradient-to-b from-white to-slate-100 text-xs font-semibold text-slate-800 hover:from-slate-50"
                        >
                          Ara
                        </button>
                      </div>
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
                      {aktifSozlesmeRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center text-slate-500 py-10">
                            Kayıt bulunamadı
                          </td>
                        </tr>
                      ) : (
                        aktifSozlesmeRows.map((r) => (
                          <tr
                            key={r.sozlesmeNo}
                            onClick={() => setSeciliSozlesmeNo(r.sozlesmeNo)}
                            className={`cursor-pointer ${seciliSozlesmeNo === r.sozlesmeNo ? 'bg-violet-50' : ''}`}
                          >
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
              </>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500 max-w-xl">
                {demoPotansiyel && 'Potansiyel müşteri için sadece Cinsiyet ve Doğum Tarihi bilgileri ile devam edilir.'}
                {demoMevcut && 'Önce müşteri arayıp seçiniz; müşteri bulunduğunda kişisel/iletişim alanları salt okunur görünür.'}
                {demoAktif && 'Önce müşteri arayıp seçiniz; ardından sözleşme listesinden kayıt seçildiğinde Devam aktif olur.'}
              </p>
              <button
                type="button"
                onClick={handleDevam}
                disabled={!devamAktif}
                className="h-10 px-6 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed text-white shadow-sm"
              >
                Devam
              </button>
            </div>

            <Modal open={demoAktif && aktifUrunSecimModalOpen} onClose={() => setAktifUrunSecimModalOpen(false)} title="Ürün Listesi" size="xl">
              <div className="space-y-3">
                <input className="form-input" placeholder="Ürün ara..." value={aktifUrunAra} onChange={(e) => setAktifUrunAra(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-auto pr-1">
                  {filtreliAktifUrunler.map((u) => (
                    <div key={u.id} onDoubleClick={() => aktifUrunSec(u)} className="rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-300 cursor-pointer">
                      <div className="text-xs font-mono text-violet-700">{u.id}</div>
                      <div className="text-lg font-bold text-slate-800 leading-tight mt-1">{u.ad}</div>
                      <div className="text-xs text-slate-500 mt-1">{u.tipler}</div>
                      <div className="text-xs text-slate-600 mt-2">Toplam Plan: {u.toplam}</div>
                      <div className="flex justify-end pt-2">
                        <button type="button" className="text-xs font-semibold text-blue-700 hover:underline" onClick={() => aktifUrunSec(u)}>
                          Seç
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Modal>

            <Modal open={demoAktif && aktifPlanSecimModalOpen} onClose={() => setAktifPlanSecimModalOpen(false)} title="Planlar" description={aktifUrun ? `${aktifUrun.id} - ${aktifUrun.ad}` : ''} size="xl">
              <div className="space-y-3">
                <input className="form-input" placeholder="Plan ara..." value={aktifPlanAra} onChange={(e) => setAktifPlanAra(e.target.value)} />
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 text-left">Plan No</th>
                        <th className="px-3 py-2 text-left">Plan Adı</th>
                        <th className="px-3 py-2 text-left">Durum</th>
                        <th className="px-3 py-2 text-left">Tamamlanma</th>
                        <th className="px-3 py-2 text-left">Tarih</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtreliAktifPlanlar.map((pl) => (
                        <tr key={pl.id} onDoubleClick={() => aktifPlanSec(pl)} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                          <td className="px-3 py-2 font-mono text-xs">{pl.id}</td>
                          <td className="px-3 py-2">{pl.ad}</td>
                          <td className="px-3 py-2">{pl.durum}</td>
                          <td className="px-3 py-2">{pl.oran}%</td>
                          <td className="px-3 py-2">{pl.tarih}</td>
                          <td className="px-3 py-2">
                            <button type="button" className="text-xs font-semibold text-blue-700 hover:underline" onClick={() => aktifPlanSec(pl)}>
                              Seç
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal>
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
                <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                  <p className="text-xs font-bold text-slate-700 mb-2">Adım {demoBilgiAdim} / 4 — {DEMO_BILGI_ADIMLAR[demoBilgiAdim - 1]?.title}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {DEMO_BILGI_ADIMLAR.map((a) => (
                      <div
                        key={a.id}
                        className={`rounded-md border px-2 py-2 text-left transition-colors ${
                          demoBilgiAdim === a.id
                            ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-200'
                            : demoBilgiAdim > a.id
                              ? 'border-emerald-300 bg-emerald-50/50'
                              : 'border-slate-200 bg-white/70'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Adım {a.id}</span>
                        <span className="block text-xs font-bold text-slate-900 leading-snug mt-0.5">{a.title}</span>
                        <span className="block text-[10px] text-slate-600 mt-1 leading-snug">{a.hint}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {demoBilgiAdim === 1 ? (
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
                    <label className="block min-w-0 sm:col-span-2 lg:col-span-3">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1">
                        Plan<span className="text-red-600"> *</span>
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" title="Ürüne bağlı planlar" />
                      </span>
                      <select
                        className="form-select w-full max-w-xl"
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
                  </div>
                ) : null}

                {demoBilgiAdim === 2 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <label className="block min-w-0 sm:col-span-2 lg:col-span-1">
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
                            hedefBirikimTutari: v === ANALIZ_TIPLERI[1] ? p.hedefBirikimTutari : '',
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
                    <label className="block min-w-0">
                      <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Demo Tarihi<span className="text-red-600"> *</span>
                      </span>
                      <input type="text" readOnly disabled className="form-input bg-slate-200 text-slate-600 cursor-not-allowed" value={urunParamForm.demoTarihi} />
                    </label>
                    <label className="block min-w-0 sm:col-span-2 lg:col-span-1">
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
                  </div>
                ) : null}

                {demoBilgiAdim === 3 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <label className="block min-w-0 sm:col-span-2">
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
                    {urunParamForm.analizTipi !== ANALIZ_TIPLERI[0] ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <label className="block min-w-0">
                          <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Aylık Katkı Payı Tutarı (TL)
                            {urunParamForm.analizTipi === ANALIZ_TIPLERI[2] ? <span className="text-red-600"> *</span> : null}
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="form-input w-full disabled:bg-slate-100 disabled:cursor-not-allowed"
                            disabled={birikimdenKpAnalizAktif}
                            placeholder={birikimdenKpAnalizAktif ? 'Hesapla ile hesaplanır' : '0'}
                            value={simForm.aylikKatkiPayi}
                            onChange={(e) => setSimForm((prev) => ({ ...prev, aylikKatkiPayi: e.target.value }))}
                          />
                        </label>
                        {birikimdenKpAnalizAktif ? (
                          <label className="block min-w-0 sm:col-span-2">
                            <span className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Hedef birikim tutarı (TL)
                              <span className="text-red-600"> *</span>
                            </span>
                            <input
                              type="text"
                              inputMode="decimal"
                              className="form-input w-full"
                              placeholder="Örn. 1.000.000"
                              value={urunParamForm.hedefBirikimTutari}
                              onChange={(e) => setU({ hedefBirikimTutari: e.target.value })}
                            />
                          </label>
                        ) : (
                          <div className="hidden lg:block min-w-0 sm:col-span-2" aria-hidden />
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {demoBilgiAdim === 4 ? (
                  <div className="space-y-3">
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
                      <div className="block min-w-0 relative sm:col-span-2 lg:col-span-1">
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
                                <input type="checkbox" checked={urunParamForm.endeksDonemleri.includes(d)} onChange={() => toggleEndeksDonem(d)} />
                                {d}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
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
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={demoWizardOnceki}
                    disabled={demoBilgiAdim <= 1}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Önceki adım
                  </button>
                  {demoBilgiAdim < 4 ? (
                    <button
                      type="button"
                      onClick={demoWizardSonraki}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-blue-600 bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
                    >
                      Sonraki adım
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-xs text-slate-600 max-w-md text-right">
                      Son adımdasınız. Kontrolleri tamamladıktan sonra alttaki <strong className="text-slate-800">Hesapla</strong> ile hesaplamaya geçin.
                    </p>
                  )}
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
          <div className="max-w-6xl mx-auto space-y-4">
            {birikimdenHesapOzeti ? (
              <div className="rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white text-center px-6 py-8 shadow-md space-y-2">
                <p className="text-sm font-medium text-white/95">{birikimdenHesapOzeti.hedefYas} yaşında</p>
                <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">{fmtTr0(birikimdenHesapOzeti.hedefNum)} TL</p>
                <p className="text-sm font-medium text-white/95">tutarında birikime ulaşabilmek için</p>
                <p className="text-sm font-medium text-white/95 max-w-xl mx-auto leading-snug">
                  {birikimdenHesapOzeti.basYas} yaşından itibaren düzenli ödemeniz gereken aylık katkı payı:
                </p>
                <p className="text-3xl sm:text-4xl font-bold tabular-nums pt-2">{fmtTr0(birikimdenHesapOzeti.aylik)} TL</p>
              </div>
            ) : null}

            <ErpSection title="Seçimler ve kesinti oranları">
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">Demo türü</dt>
                  <dd className="font-medium text-slate-800">{demoTuru}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Partaj</dt>
                  <dd className="font-medium text-slate-800">
                    {urunParamForm.partajKod ? `${urunParamForm.partajKod} ${urunParamForm.partajAd}` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Ürün</dt>
                  <dd className="font-medium text-slate-800">{urunPlanTarifeKartlari.find((u) => u.id === urunParamForm.urunKod)?.ad || '—'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Plan</dt>
                  <dd className="font-medium text-slate-800">{plansForUrun.find((p) => p.id === urunParamForm.planId)?.ad || '—'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Analiz tipi</dt>
                  <dd className="font-medium text-slate-800">{urunParamForm.analizTipi || '—'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Para birimi / Taksit</dt>
                  <dd className="font-medium text-slate-800">
                    {urunParamForm.paraBirimi || '—'} ·{' '}
                    {odemeDonemiTurleri.find((o) => String(o.kod) === String(urunParamForm.taksitAdedi))?.aciklama || urunParamForm.taksitAdedi || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Endeks tipi</dt>
                  <dd className="font-medium text-slate-800">{secilenEndeksSatir?.ad || urunParamForm.endeksKod || '—'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">FİGK oranı (kesinti)</dt>
                  <dd className="font-mono font-semibold text-slate-900">
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(kesintiFigkOranlari.figk)} %
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">DK FİGK oranı (kesinti)</dt>
                  <dd className="font-mono font-semibold text-slate-900">
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(kesintiFigkOranlari.dkFigk)} %
                  </dd>
                </div>
              </dl>
            </ErpSection>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 mb-2">Senaryo</p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-6">
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="hesap-senaryo" checked={hesapSenaryo === 'iyimser'} onChange={() => setHesapSenaryo('iyimser')} />
                    İyimser
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="hesap-senaryo" checked={hesapSenaryo === 'kotumser'} onChange={() => setHesapSenaryo('kotumser')} />
                    Kötümser
                  </label>
                </div>
                <p className="text-sm font-semibold text-slate-800 tabular-nums shrink-0">
                  Yıllık Reel Getiri: %{hesapSenaryo === 'iyimser' ? '3' : '1'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 px-2">
                <button
                  type="button"
                  onClick={() => setHesapIcerikTab('grafik')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px ${hesapIcerikTab === 'grafik' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'}`}
                >
                  Grafik
                </button>
                <button
                  type="button"
                  onClick={() => setHesapIcerikTab('tablo')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px ${hesapIcerikTab === 'tablo' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'}`}
                >
                  Tablo veriler
                </button>
              </div>
              <div className="p-4">
                {hesapIcerikTab === 'grafik' ? <BirikimStackedBarChart rows={birikimRows} /> : null}
                {hesapIcerikTab === 'tablo' ? (
                  <SenaryoTablo rows={birikimRows} baslik={hesapSenaryo === 'iyimser' ? 'İyimser Senaryo' : 'Kötümser Senaryo'} yillikKp={yillikKpDegeri} />
                ) : null}
              </div>
            </div>

            <ErpSection title="Simülasyon özeti (BES)">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Toplam Katılımcı Ödemesi</span>
                  <strong className="text-slate-900 tabular-nums">{fmtTl(summary.katilimciOdeme)}</strong>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Toplam Devlet Katkısı</span>
                  <strong className="text-slate-900 tabular-nums">{fmtTl(summary.devletKatkisi)}</strong>
                </div>
                <div className="flex justify-between gap-4 items-center rounded-md bg-blue-600 text-white px-3 py-2.5 -mx-0.5">
                  <span className="font-medium">Reel Birikim</span>
                  <strong className="tabular-nums text-base">{fmtTl(summary.reelBirikim)}</strong>
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
