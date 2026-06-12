import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search, ArrowLeft, LayoutGrid, List as ListIcon, MoreHorizontal, Eye, Pencil, Copy, List, Trash2, Settings, Filter, Heart, Activity, PiggyBank, Briefcase, FilePlus, BookOpen, Sparkles, Upload, ArrowRight, ChevronRight, ChevronDown, CheckCircle2, SlidersHorizontal, FileText, Calendar, RefreshCw, Save, Link2, HelpCircle, Download, History, Ban, CircleOff } from 'lucide-react'
import {
  urunPlanTarifeKartlari,
  urunPlanlari,
  katkiPayiTemplateleri,
  basvuruTipleri,
  kurTipleri,
  odemeAraclari,
  borcTipleri,
  tarifePlanDurum,
  vakifUyeKurum,
  egpBireyTipi,
  katkiPayiHesaplama,
  egpGeriOdemeTipleri,
  egpGenel,
  egpGeriOdeme,
  egpAraOdeme,
  odemeDonemiTurleri,
  ekFaydaTanimlari,
  satisKanaliTanimlari,
  degisiklikTipleri,
} from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

function planRowActions(plan) {
  const isTaslak = plan?.durum === 'Taslak'
  const isYururlukte = plan?.durum === 'Yururlukte'
  const actions = [
    { key: 'view', label: 'İncele', icon: 'view' },
    { key: 'edit', label: 'Düzenle', icon: 'edit' },
    { key: 'history', label: 'Versiyonlar', icon: 'history' },
    { key: 'copy', label: 'Kopyala', icon: 'copy' },
    { key: 'export', label: 'Dışarı Aktar', icon: 'download' },
  ]
  if (isTaslak) {
    actions.push({ key: 'yururlugeAl', label: 'Yürürlüğe Al', icon: 'version' })
  }
  if (isYururlukte) {
    actions.push({ key: 'satisaKapa', label: 'Satışa Kapa', icon: 'link' })
    actions.push({ key: 'yururluktenKaldir', label: 'Yürürlükten Kaldır', icon: 'copy' })
  }
  actions.push({ key: 'delete', label: 'Sil', icon: 'delete', danger: true })
  return actions
}

function planCardMenuItems(plan) {
  const isTaslak = plan?.durum === 'Taslak'
  const isYururlukte = plan?.durum === 'Yururlukte'
  const items = [
    { key: 'view', label: 'İncele', Icon: Eye },
    { key: 'edit', label: 'Düzenle', Icon: Pencil },
    { key: 'history', label: 'Versiyonlar', Icon: History, accent: true },
    { key: 'copy', label: 'Kopyala', Icon: Copy },
    { key: 'export', label: 'Dışarı Aktar', Icon: Download },
  ]
  if (isTaslak) {
    items.push({ key: 'yururlugeAl', label: 'Yürürlüğe Al', Icon: CheckCircle2, accent: true })
  }
  if (isYururlukte) {
    items.push({ key: 'satisaKapa', label: 'Satışa Kapa', Icon: Ban })
    items.push({ key: 'yururluktenKaldir', label: 'Yürürlükten Kaldır', Icon: CircleOff })
  }
  items.push({ key: 'delete', label: 'Sil', Icon: Trash2, danger: true })
  return items
}

const URUN_ACTIONS = [
  { key: 'view', label: 'Planlarını Görüntüle', icon: 'view' },
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'copy', label: 'Ürünü Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const BRANCH_OPTIONS = [
  { key: 'saglik', label: 'Sağlık', description: 'ÖSS, TSS ve Seyahat', icon: Heart },
  { key: 'hayat', label: 'Hayat & Kaza', description: 'Hayat ve Ferdi Kaza', icon: Activity },
  { key: 'bireysel', label: 'Bireysel Emeklilik', description: 'BES ve OKS', icon: PiggyBank },
  { key: 'elementer', label: 'Elementer', description: 'Mühendislik, Oto, Yangın', icon: Briefcase },
]

const SOZLESME_TIPLERI = ['Ferdi', 'Grup', 'EGP', 'OKS', 'OKS-EGP']

const HAYAT_ALT_BRANS = ['Hayat', 'Ferdi Kaza']
const HAYAT_URUN_TIPI_HAYAT = ['Risk', 'Birikimli', 'İrat']
const HAYAT_URUN_TIPI_FERDI = ['Risk']
const HAYAT_SURE_TIPI = ['Yıllık', 'Uzun Süreli', 'Kısa Süreli (Günlük)']

const emptyHayatCreateForm = () => ({
  altBrans: 'Hayat',
  urunTipi: 'Risk',
  sureTipi: 'Yıllık',
  urunNo: '',
  urunAdi: '',
  aciklama: '',
})

const emptyBireyselCreateForm = () => ({
  sozlesmeTipi: 'Ferdi',
  urunNo: '',
  urunAdi: '',
  aciklama: '',
})

const SAGMER_BRANS_OPTIONS = ['Sağlık', 'Seyahat', 'Acil', 'TSS', 'Gündelik', 'Yabancılar', 'Hastalık']
const SAGLIK_URUN_TIPI = ['Ferdi', 'Grup']

const emptySaglikCreateForm = () => ({
  sagmerBrans: 'Sağlık',
  urunTipi: 'Ferdi',
  urunNo: '',
  urunAdi: '',
  baslangicTarihi: new Date().toISOString().slice(0, 10),
  sagmerTarifeKodu: '',
  aciklama: '',
})

const ELEMENTER_ANA_BRANS = [
  'Araç',
  'Finansal',
  'Genel Zararlar',
  'Sağlık',
  'Kaza',
  'Mühendislik',
  'Nakliyat',
  'Araç Sorumluluk',
  'Sorumluluk',
  'Yangın',
]

const emptyElementerCreateForm = () => ({
  anaBrans: 'Araç',
  urunNo: '',
  urunAdi: '',
  baslangicTarihi: new Date().toISOString().slice(0, 10),
  yasalUrunKodu: '',
  aciklama: '',
})

const createFormForBranch = (branchKey) => {
  if (branchKey === 'hayat') return emptyHayatCreateForm()
  if (branchKey === 'saglik') return emptySaglikCreateForm()
  if (branchKey === 'elementer') return emptyElementerCreateForm()
  return emptyBireyselCreateForm()
}

function WizardSegmentGroup({ label, required, options, value, onChange }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 h-10 rounded-xl border text-sm font-semibold transition ${value === opt ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-300 hover:border-violet-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Plan konfigürasyon kartı — demo oranları (çubuk rengi yüzdeye göre) */
function planKonfigProgressTone(pct) {
  const p = Number(pct) || 0
  if (p >= 100) return { bar: 'bg-emerald-600', text: 'text-emerald-700' }
  if (p >= 75) return { bar: 'bg-lime-500', text: 'text-lime-700' }
  if (p >= 50) return { bar: 'bg-yellow-400', text: 'text-yellow-700' }
  if (p >= 20) return { bar: 'bg-orange-500', text: 'text-orange-600' }
  return { bar: 'bg-red-500', text: 'text-red-600' }
}

function planKonfigRingStroke(pct) {
  const p = Number(pct) || 0
  if (p >= 100) return '#059669'
  if (p >= 75) return '#84cc16'
  if (p >= 50) return '#ca8a04'
  if (p >= 20) return '#ea580c'
  return '#dc2626'
}

function aggregatePlanSetupHeader(cards) {
  if (!cards?.length) return { pct: 0, score: '0/6' }
  const pct = Math.round(cards.reduce((s, c) => s + (Number(c.bar) || 0), 0) / cards.length)
  let sum = 0
  for (const c of cards) {
    const m = /^(\d+)\//.exec(String(c.score ?? ''))
    if (m) sum += Number(m[1])
  }
  const step = Math.round(sum / cards.length)
  return { pct, score: `${Math.min(6, Math.max(0, step))}/6` }
}

function aggregateEgpPlanHeader(cards) {
  if (!cards?.length) return { pct: 0, score: '0/6' }
  const pct = Math.round(cards.reduce((s, c) => s + (Number(c.progress?.pct) || 0), 0) / cards.length)
  let sum = 0
  for (const c of cards) {
    const m = /^(\d+)\//.exec(String(c.progress?.score ?? ''))
    if (m) sum += Number(m[1])
  }
  const step = Math.round(sum / cards.length)
  return { pct, score: `${Math.min(6, Math.max(0, step))}/6` }
}

const PLAN_SETUP_CARDS = [
  { id: 'genel', title: 'Genel Bilgiler', update: '30.12.2023', bar: 37, score: '2/6', lines: ['Kategori Kodu: BES-AD', 'Sözleşme Tipi: Ferdi'] },
  { id: 'fonlar', title: 'Fonlar ve Fon Karmaları', update: '30.12.2023', bar: 34, score: '2/6', lines: ['TANIMLANAN FON: 5 Adet', 'DEVLET KATKI FONU', 'ACİL EMEKLİLİK FONU'] },
  { id: 'katki', title: 'Katkı Payı Tanımları', update: '30.12.2025', bar: 8, score: '0/6', lines: ['TANIMLANAN KATKI PAYI', '5 Adet', 'ASGARİ KATKI PAYI 1200 TL'] },
  { id: 'kesinti', title: 'Kesintiler', update: '10.12.2025', bar: 55, score: '3/6', lines: ['ÖZET', 'Giriş Aidatı, YKG tanımlanmıştır', 'ÇIKIŞ AİDATI', 'Çıkışa erteleme'] },
  { id: 'diger', title: 'Diğer Tanımlar', update: '10.12.2025', bar: 82, score: '5/6', lines: ['İstisna Planları, Endeksler, Ek göstergeler tanımlanmıştır.'] },
  { id: 'belge', title: 'Plan Belgeleri', update: '10.12.2025', bar: 100, score: '6/6', lines: ['Kayıtlı belge listesi mevcuttur', 'TANIMLANAN BELGE SAYISI', '1 Adet'] },
]

/** EGP emeklilik gelir planı — kart ızgarası (referans UI) */
const PLAN_SETUP_CARDS_EGP = [
  {
    id: 'genel',
    title: 'Genel Bilgiler',
    update: '30.12.2023',
    icon: 'settings',
    iconClass: 'from-violet-500 to-violet-700',
    progress: { label: 'TANIMLAMA', pct: 37, score: '2/6' },
    lines: ['Kategori Kodu: BES-EGP', 'Sözleşme Tipi: EGP'],
  },
  {
    id: 'fonlar',
    title: 'Fonlar ve Fon Karmaları',
    update: '30.12.2023',
    icon: 'check',
    iconClass: 'from-emerald-500 to-teal-600',
    progress: { label: 'TANIMLAMA', pct: 34, score: '2/6' },
    lines: ['TANIMLANAN FON', '5 Adet', 'DEVLET KATKISI FONU', 'AGITO KATKI EMEKLİLİK FONU'],
    footerChips: ['Fon Karması'],
  },
  {
    id: 'egpDetay',
    title: 'EGP Detay Parametreleri',
    update: '30.12.2025',
    icon: 'sliders',
    iconClass: 'from-violet-500 to-indigo-700',
    progress: { label: 'TANIMLAMA', pct: 55, score: '3/6' },
    lines: ['EGP özel parametreleri tanımlanmıştır', 'GELİR PLANI TİPİ: Ömür Boyu Gelir'],
    footerChips: ['EGP Genel Parametreler', 'Geri Ödeme Tipleri', 'Ara Ödeme Parametreleri'],
  },
  {
    id: 'diger',
    title: 'Diğer Tanımlar',
    update: '10.12.2025',
    icon: 'check',
    iconClass: 'from-emerald-500 to-teal-600',
    progress: { label: 'TANIMLAMA', pct: 82, score: '5/6' },
    lines: ['İstisna Planları, Endeksler, Ek Faydalar, Kurallar ve Sevkiyatlar tanımlanmıştır.'],
    footerChips: ['İstisna Planlar', 'Endeksler', 'Ek Fayda', '+2'],
  },
  {
    id: 'belge',
    title: 'Plana Ait Belgeler',
    update: '10.12.2025',
    icon: 'file',
    iconClass: 'from-emerald-500 to-teal-600',
    progress: { label: 'TANIMLAMA', pct: 100, score: '6/6' },
    lines: ['Kayıtlı belge listesi mevcuttur', 'TANIMLANAN BELGE SAYISI', '1 Adet'],
  },
]

const DIGER_TANIMLAR_MENU = [
  { id: 'istisna', label: 'İstisna Planlar' },
  { id: 'endeks', label: 'Endeksler' },
  { id: 'ekFayda', label: 'Ek Fayda' },
  { id: 'satisKanali', label: 'Satış Kanalı' },
  { id: 'kurallar', label: 'Kurallar' },
  { id: 'gonderi', label: 'Gönderi/Basım' },
  { id: 'degisiklik', label: 'Değişiklik Tanımları' },
]

/** Plan Belgeleri — yeni belge formu (Belge Türü) */
const PLAN_BELGE_TURU_OPTIONS = [
  'Hazine Planı',
  'Sözleşme',
  'KVKK Metni',
  'Teklif',
  'Pazarlama İçeriği',
  'Ek Fayda Detay',
  'Test Onay Dokümanı',
]

function planBelgeleriStorageKey(urun, plan) {
  return `${urun?.id || ''}::${plan?.id || ''}`
}

const INITIAL_ISTISNA_PLAN_ROWS = [
  { id: 'ist-1', planId: '', planAdi: 'Emeklilik Fonu A Tipi Plan', baslangic: '2026-01-09', bitis: '2026-01-09' },
  { id: 'ist-2', planId: '', planAdi: 'Grup Emeklilik Katılım Planı', baslangic: '2026-01-09', bitis: '2026-01-09' },
  { id: 'ist-3', planId: '', planAdi: 'Standart Bireysel Emeklilik Planı', baslangic: '2026-01-09', bitis: '2026-01-09' },
]

const ISTISNA_PLAN_ROW_ACTIONS = [
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const EGP_DETAY_SUBMENU = [
  { id: 'genel', label: 'EGP Genel Parametreler' },
  { id: 'geriOdeme', label: 'Geri Ödeme Tipleri' },
  { id: 'araOdeme', label: 'Ara Ödeme Parametreleri' },
]

function egpBireyTipiLabel(kod) {
  const r = egpBireyTipi.find((x) => x.kod === kod)
  return r ? r.ad : kod || '—'
}

function katkiPayiHesaplamaEndeksLabel(hesapKodu) {
  const h = katkiPayiHesaplama.find((x) => String(x.hesapKodu) === String(hesapKodu))
  return h ? h.hesapAdi : hesapKodu || '—'
}

/** Parametre `egpGeriOdemeTipleri.tanimAdi` → ekranda kısa Türkçe etiket */
function formatEgpGeriOdemeTipEtiket(tanimAdi) {
  const m = {
    'Sureye Bagli': 'Süre',
    'Tutara Bagli': 'Tutar',
    Mevduat: 'Mevduat',
    Kira: 'Kira',
    Faiz: 'Faiz',
  }
  return m[tanimAdi] || tanimAdi || '—'
}

function parseDdMmYyyyToIso(tr) {
  const parts = String(tr || '').split('.')
  if (parts.length !== 3) return new Date().toISOString().slice(0, 10)
  const [d, m, y] = parts
  if (!y || !m || !d) return new Date().toISOString().slice(0, 10)
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** EGP genel şablon satırı → plan tablosu `bireyTipiKod` */
function mapEgpGenelBireyTipiToKod(label) {
  const raw = String(label || '').trim()
  if (!raw) return 'FP'
  const byKod = egpBireyTipi.find((x) => x.kod === raw)
  if (byKod) return byKod.kod
  const low = raw.toLowerCase()
  const byAd = egpBireyTipi.find((x) => x.ad.toLowerCase() === low)
  if (byAd) return byAd.kod
  if (low.includes('fert') || low.includes('bireysel')) return 'FP'
  if (low.includes('çocuk') || low.includes('cocuk')) return 'C'
  if (low.includes('eş') || low.includes('es')) return 'E'
  return 'FP'
}

/** Şablondaki endeks tipi (TUFE/UFE) → katkı payı hesaplama hesap kodu */
function mapEgpGenelEndeksTipiToHesapKodu(endeksTipi) {
  const k = String(endeksTipi || '').trim().toUpperCase()
  if (k === 'TUFE') {
    const t = katkiPayiHesaplama.find((h) => String(h.hesapAdi).toUpperCase() === 'TUFE')
    return t ? String(t.hesapKodu) : '2'
  }
  if (k === 'UFE' || k.includes('UFE')) {
    const u = katkiPayiHesaplama.find((h) => String(h.hesapAdi).toUpperCase().includes('UFE'))
    return u ? String(u.hesapKodu) : '11'
  }
  const exact = katkiPayiHesaplama.find((h) => String(h.hesapAdi).toUpperCase() === k)
  return exact ? String(exact.hesapKodu) : '2'
}

/** EGP geri ödeme şablonu `tip` metni → plan satırı `tanimAdi` (parametre listesi anahtarı) */
function geriOdemeTanimAdiFromTemplateTip(tip) {
  const t = String(tip || '').toLowerCase()
  if (t.includes('süre') && t.includes('bazlı')) return 'Sureye Bagli'
  if (t.includes('sure') && t.includes('bazli')) return 'Sureye Bagli'
  if (t.includes('tutar') && (t.includes('bazlı') || t.includes('bazli'))) return 'Tutara Bagli'
  if (t.includes('sureye') || t.includes('süreye')) return 'Sureye Bagli'
  if (t.includes('tutara')) return 'Tutara Bagli'
  return 'Sureye Bagli'
}

const EGP_GERI_ODEME_ROW_ACTIONS = [
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const EGP_ARA_ODEME_ROW_ACTIONS = EGP_GERI_ODEME_ROW_ACTIONS

const EGP_GERI_ODEME_FORM_DEFAULT = {
  tanimAdi: '',
  sureAlt: '0',
  sureUst: '0',
  tutarAlt: '0',
  tutarUst: '0',
  oranUst: '0',
  faiz: '0',
}

const EGP_ARA_ODEME_FORM_DEFAULT = {
  sayiAlt: '0',
  sayiUst: '0',
  tutarUst: '0',
  oranMaas: '0',
  oranBirikim: '0',
}

const FON_DELETE_ACTION = [{ key: 'delete', label: 'Sil', icon: 'delete', danger: true }]
const FON_KARMA_ACTIONS = [
  { key: 'details', label: 'Detaylar', icon: 'view' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]
const INITIAL_FON_ROWS = [
  { fonKodu: 'FON-001', fonAdi: 'Esnek', fonTipi: 'T', min: '0%', max: '100%', zorunlu: 'Hayır', standart: 'Evet', devletKatkisi: 'Hayır', katilimEsasli: 'Hayır', fonDurumu: 'Pasif', kullanimda: 'Evet' },
  { fonKodu: 'FON-002', fonAdi: 'Büyüme', fonTipi: 'K', min: '0%', max: '100%', zorunlu: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', katilimEsasli: 'Hayır', fonDurumu: 'Aktif', kullanimda: 'Evet' },
  { fonKodu: 'FON-003', fonAdi: 'Dengeli', fonTipi: 'D', min: '10%', max: '90%', zorunlu: 'Hayır', standart: 'Hayır', devletKatkisi: 'Evet', katilimEsasli: 'Hayır', fonDurumu: 'Aktif', kullanimda: 'Hayır' },
  { fonKodu: 'FON-004', fonAdi: 'Korunmacı', fonTipi: 'K', min: '0%', max: '50%', zorunlu: 'Hayır', standart: 'Hayır', devletKatkisi: 'Hayır', katilimEsasli: 'Evet', fonDurumu: 'Aktif', kullanimda: 'Evet' },
  { fonKodu: 'FON-005', fonAdi: 'Hisse Ağırlıklı', fonTipi: 'T', min: '0%', max: '100%', zorunlu: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', katilimEsasli: 'Hayır', fonDurumu: 'Aktif', kullanimda: 'Evet' },
]
const INITIAL_KARMA_ROWS = [
  { karmaNo: '22328382', aciklama: 'Korumacı', mpRefKod: '—', katilimEsasli: 'Hayır', standart: 'Hayır', devletKatkisi: 'Hayır', baslangic: 'Hayır', rgpf: 'Evet' },
  { karmaNo: '22328383', aciklama: 'Dengeli', mpRefKod: '—', katilimEsasli: 'Hayır', standart: 'Evet', devletKatkisi: 'Hayır', baslangic: 'Evet', rgpf: 'Hayır' },
  { karmaNo: '22328384', aciklama: 'Girişimci', mpRefKod: '—', katilimEsasli: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', baslangic: 'Hayır', rgpf: 'Evet' },
  { karmaNo: '22328385', aciklama: 'Esnek', mpRefKod: '—', katilimEsasli: 'Hayır', standart: 'Evet', devletKatkisi: 'Evet', baslangic: 'Hayır', rgpf: 'Hayır' },
  { karmaNo: '22328386', aciklama: 'Büyüme', mpRefKod: '—', katilimEsasli: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', baslangic: 'Hayır', rgpf: 'Hayır' },
]
const INITIAL_KARMA_FON_DETAY = [
  { fonKodu: 'AER', fonAciklama: 'Agito Para Piyasaları Fonu', fonTipi: 'Z', katilimEsasli: false, minOran: 0, maxOran: 100, oran: 30 },
  { fonKodu: 'AEG', fonAciklama: 'Agito Borçlanma Araçları Fonu', fonTipi: 'Z', katilimEsasli: false, minOran: 0, maxOran: 100, oran: 50 },
  { fonKodu: 'AEA', fonAciklama: 'Agito Hisse Senedi Emeklilik Fonu', fonTipi: 'Z', katilimEsasli: false, minOran: 0, maxOran: 100, oran: 20 },
]

const KP_TEMPLATE_ROW_ACTIONS = [
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const KESINTI_MENU_KEYS = [
  { id: 'girisAidati', label: 'Giriş Aidatı' },
  { id: 'ygkParam', label: 'YGK Parametreleri' },
  { id: 'ygkMuafiyet', label: 'YGK Muafiyet' },
  { id: 'araVerme', label: 'Ara Verme Kesintisi' },
  { id: 'kesintiBes30', label: 'Kesinti BES 3.0' },
  { id: 'ygkBes30', label: 'YGK BES 3.0 Parametreleri' },
]

const GA_LINKED_INITIAL = [
  { gaKodu: 'GA-01', doviz: 'TL', gaTipi: 'Peşin', taksitTipi: 'Ardışık', taksitAdedi: '12', pesinat: '500', taksit: '0', erteleme: '0', toplamTutar: '6.000' },
  { gaKodu: 'GA-02', doviz: 'USD', gaTipi: 'Çıkışa Ertelenmiş', taksitTipi: 'Dönem', taksitAdedi: '1', pesinat: '0', taksit: '0', erteleme: '100', toplamTutar: '1.500' },
]

const GA_CATALOG_ALL = [
  { gaKodu: 'GA-01', doviz: 'TL', gaTipi: 'Peşin', taksitTipi: 'Ardışık', taksitAdedi: '12', pesinat: '1000', taksit: '150', erteleme: '0', toplamTutar: '2800' },
  { gaKodu: 'GA-02', doviz: 'USD', gaTipi: 'Çıkışa Ertelenmiş', taksitTipi: '—', taksitAdedi: '—', pesinat: '0', taksit: '0', erteleme: '50', toplamTutar: '50' },
  { gaKodu: 'GA-03', doviz: 'TL', gaTipi: 'Peşin + Çıkışa Ert.', taksitTipi: 'Dönem', taksitAdedi: 'Aylık', pesinat: '500', taksit: '200', erteleme: '100', toplamTutar: '2900' },
  { gaKodu: 'GA-04', doviz: 'EUR', gaTipi: 'Giriş Aidatı Yok', taksitTipi: '—', taksitAdedi: '—', pesinat: '0', taksit: '0', erteleme: '0', toplamTutar: '0' },
  { gaKodu: 'GA-05', doviz: 'TL', gaTipi: 'Peşin', taksitTipi: 'Peşin', taksitAdedi: '1', pesinat: '1500', taksit: '0', erteleme: '0', toplamTutar: '1500' },
]

const GA_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
]

const YGK_LINKED_INITIAL = [
  {
    rowKey: 'YGK-001-1',
    gecerlilikTarihi: '01.01.2025',
    doviz: 'TRL',
    tabloTipi: 'P - Katkı Payı',
    ygkAdi: 'YGK Standart Kural',
    versiyon: '1',
    yilTipi: 'Yürürlük Tarihi',
    limitTutarTipi: 'Sözleşme Birikimi',
    kademeTipi: 'Kümülatif Kademe',
    yilBazindaSifirla: false,
    ygkHesaplamaKurali: '—',
    ygkKodu: 'YGK-001',
  },
  {
    rowKey: 'YGK-002-2',
    gecerlilikTarihi: '01.01.2025',
    doviz: 'USD',
    tabloTipi: 'B - Birikim Trans.',
    ygkAdi: 'YGK Alternatif Kural',
    versiyon: '2',
    yilTipi: 'Tahsilat Tarihi',
    limitTutarTipi: 'Toplam Tahsilat',
    kademeTipi: 'Kademe',
    yilBazindaSifirla: true,
    ygkHesaplamaKurali: '—',
    ygkKodu: 'YGK-002',
  },
]

const YGK_CATALOG_ALL = [
  { ygkKodu: 'YGK-001', ygkAdi: 'YGK Standart Kural', versiyon: '1', gecerlilikTarihi: '01.01.2025', doviz: 'TRL', tabloTipi: 'P - Katkı Payı', yilTipi: 'Yürürlük Tarihi', limitTutarTipi: 'Sözleşme Birikimi', ygkHesaplamaKurali: '—', kademeTipi: 'Kümülatif Kademe', yilBazindaSifirla: false },
  { ygkKodu: 'YGK-002', ygkAdi: 'YGK Alternatif Kural', versiyon: '2', gecerlilikTarihi: '01.06.2025', doviz: 'USD', tabloTipi: 'B - Birikim Trans.', yilTipi: 'Tahsilat Tarihi', limitTutarTipi: 'Toplam Tahsilat', ygkHesaplamaKurali: '—', kademeTipi: 'Kademe', yilBazindaSifirla: true },
  { ygkKodu: 'YGK-000', ygkAdi: 'YGK Kesinti Yok', versiyon: '1', gecerlilikTarihi: '01.01.2024', doviz: 'TRL', tabloTipi: 'Yok', yilTipi: '—', limitTutarTipi: '—', ygkHesaplamaKurali: '—', kademeTipi: '—', yilBazindaSifirla: false },
]

const YGK_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const YGK_VERSIONS_BY_KOD = {
  'YGK-001': [
    { versiyon: '1', aciklama: 'YGK Standart Kural', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '0', aciklama: 'YGK Standart Kural (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YGK-002': [
    { versiyon: '2', aciklama: 'YGK Alternatif Kural', durum: 'Aktif', gecerlilik: '01.06.2025' },
    { versiyon: '1', aciklama: 'YGK Alternatif Kural', durum: 'Arşiv', gecerlilik: '01.01.2025' },
  ],
  'YGK-000': [{ versiyon: '1', aciklama: 'YGK Kesinti Yok', durum: 'Aktif', gecerlilik: '01.01.2024' }],
}

const YGK_MUAF_LINKED_INITIAL = [
  { rowKey: 'YGKM-001-1', muafKodu: 'YGKM-001', muafAdi: 'YGK Muafiyet Kuralı', versiyon: '1', yil: '2', toplamOdenmisKp: '850', doviz: 'TRL', oran: '0.6' },
]

const YGK_MUAF_CATALOG_ALL = [
  { muafKodu: 'YGKM-001', muafAdi: 'YGK Muafiyet Kuralı', versiyon: '1', gecerlilikTarihi: '30.07.2024', yil: '2', toplamOdenmisKp: '850', doviz: 'TRL', oran: '0.6' },
  { muafKodu: 'YGKM-002', muafAdi: 'Alternatif Muafiyet Kuralı', versiyon: '2', gecerlilikTarihi: '01.01.2025', yil: '3', toplamOdenmisKp: '1200', doviz: 'USD', oran: '0.5' },
  { muafKodu: 'YGKM-000', muafAdi: 'Muafiyet Yok', versiyon: '1', gecerlilikTarihi: '01.01.2026', yil: '0', toplamOdenmisKp: '0', doviz: 'TRL', oran: '0' },
]

const YGK_MUAF_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const YGK_MUAF_VERSIONS_BY_KOD = {
  'YGKM-001': [
    { versiyon: '1', aciklama: 'YGK Muafiyet Kuralı', durum: 'Aktif', gecerlilik: '30.07.2024' },
    { versiyon: '0', aciklama: 'YGK Muafiyet Kuralı (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2024' },
  ],
  'YGKM-002': [
    { versiyon: '2', aciklama: 'Alternatif Muafiyet Kuralı', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '1', aciklama: 'Alternatif Muafiyet Kuralı', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YGKM-000': [{ versiyon: '1', aciklama: 'Muafiyet Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

const ARA_VERME_LINKED_INITIAL = [
  { rowKey: 'AVK-001-1', avKodu: 'AVK-001', avAdi: 'Ara Verme Standart', versiyon: '1', tutar: '2 TL', hesaplamaKurali: '—', onKosul: '—' },
]

const ARA_VERME_CATALOG_ALL = [
  { avKodu: 'AVK-001', avAdi: 'Ara Verme Standart', versiyon: '1', gecerlilikTarihi: '01.01.2026', tutar: '2 TL', hesaplamaKurali: '—', onKosul: '—' },
  { avKodu: 'AVK-002', avAdi: 'Ara Verme Esnek', versiyon: '1', gecerlilikTarihi: '15.06.2025', tutar: '5 TL', hesaplamaKurali: 'Oran', onKosul: 'Min 12 ay' },
  { avKodu: 'AVK-000', avAdi: 'Ara Verme Yok', versiyon: '1', gecerlilikTarihi: '01.01.2026', tutar: '0 TL', hesaplamaKurali: '—', onKosul: '—' },
]

const ARA_VERME_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const ARA_VERME_VERSIONS_BY_KOD = {
  'AVK-001': [
    { versiyon: '1', aciklama: 'Ara Verme Standart', durum: 'Aktif', gecerlilik: '01.01.2026' },
    { versiyon: '0', aciklama: 'Ara Verme Standart (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2025' },
  ],
  'AVK-002': [
    { versiyon: '1', aciklama: 'Ara Verme Esnek', durum: 'Aktif', gecerlilik: '15.06.2025' },
  ],
  'AVK-000': [{ versiyon: '1', aciklama: 'Ara Verme Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

const KESINTI_BES30_LINKED_INITIAL = [
  { rowKey: 'KB30-001-1', kbKodu: 'KB30-001', kbAdi: 'Kesinti BES3.0 Kuralı 1', versiyon: '1', yil: '1', maxKesintiOrani: '0.63', maxKesintiTutari: '—' },
  { rowKey: 'KB30-002-2', kbKodu: 'KB30-002', kbAdi: 'Kesinti BES3.0 Kuralı 2', versiyon: '2', yil: '2', maxKesintiOrani: '0.50', maxKesintiTutari: '—' },
  { rowKey: 'KB30-003-1', kbKodu: 'KB30-003', kbAdi: 'Kesinti BES3.0 Kuralı 3', versiyon: '1', yil: '3', maxKesintiOrani: '0.40', maxKesintiTutari: '—' },
]

const KESINTI_BES30_CATALOG_ALL = [
  { kbKodu: 'KB30-001', kbAdi: 'Kesinti BES3.0 Kural 1', versiyon: '1', gecerlilikTarihi: '30.07.2024', yil: '1', maxKesintiOrani: '0.63', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-002', kbAdi: 'Kesinti BES3.0 Kural 2', versiyon: '2', gecerlilikTarihi: '15.03.2025', yil: '2', maxKesintiOrani: '0.50', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-003', kbAdi: 'Kesinti BES3.0 Kural 3', versiyon: '1', gecerlilikTarihi: '01.01.2026', yil: '3', maxKesintiOrani: '0.40', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-004', kbAdi: 'Kesinti BES3.0 Kural 4', versiyon: '1', gecerlilikTarihi: '01.06.2026', yil: '4', maxKesintiOrani: '0.35', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-000', kbAdi: 'Kesinti BES3.0 Yok', versiyon: '1', gecerlilikTarihi: '01.01.2026', yil: '0', maxKesintiOrani: '0', maxKesintiTutari: '0' },
]

const KESINTI_BES30_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const KESINTI_BES30_VERSIONS_BY_KOD = {
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

const YGK_BES30_LINKED_INITIAL = [
  {
    rowKey: 'YB30-001-1',
    ybKodu: 'YB30-001',
    ybAdi: 'YGK BES3.0 Kuralı 1',
    versiyon: '1',
    dovizKodu: 'TRL',
    ygkKesintiTipi: 'Katkı Payı Aralığı',
    oran: '—',
    yillikTutar: '—',
    ygkFormulu: '—',
    kesintiDonemi: 'Aylık',
    sozlesmeYiliAraligi: '1-1',
    birikim: 'Anapara',
    gecerlilikTarihi: '01.01.2025',
    birikimTipi: 'Anapara BRK',
  },
  {
    rowKey: 'YB30-002-2',
    ybKodu: 'YB30-002',
    ybAdi: 'YGK BES3.0 Kuralı 2',
    versiyon: '2',
    dovizKodu: 'TRL',
    ygkKesintiTipi: 'Oran',
    oran: '0.03',
    yillikTutar: '—',
    ygkFormulu: '—',
    kesintiDonemi: 'Yıllık',
    sozlesmeYiliAraligi: '5-5',
    birikim: 'Toplam',
    gecerlilikTarihi: '01.01.2025',
    birikimTipi: 'Toplam BRK',
  },
]

const YGK_BES30_CATALOG_ALL = [
  { ybKodu: 'YB30-001', ybAdi: 'YGK BES3.0 Kuralı 1', versiyon: '1', gecerlilikTarihi: '01.01.2025', doviz: 'TRL', ygkKesintiTipi: 'Katkı Payı Aralığı', oran: '—', yillikTutar: '—', ygkFormulu: '—', kesintiDonemi: 'Aylık', sozlesmeYili: '1', birikim: 'Anapara', birikimTipi: 'Anapara BRK' },
  { ybKodu: 'YB30-002', ybAdi: 'YGK BES3.0 Kuralı 2', versiyon: '2', gecerlilikTarihi: '01.01.2025', doviz: 'TRL', ygkKesintiTipi: 'Oran', oran: '0.03', yillikTutar: '—', ygkFormulu: '—', kesintiDonemi: 'Yıllık', sozlesmeYili: '5', birikim: 'Toplam', birikimTipi: 'Toplam BRK' },
  { ybKodu: 'YB30-003', ybAdi: 'YGK BES3.0 Kuralı 3', versiyon: '1', gecerlilikTarihi: '01.06.2025', doviz: 'USD', ygkKesintiTipi: 'Yok', oran: '—', yillikTutar: '—', ygkFormulu: '—', kesintiDonemi: 'Yok', sozlesmeYili: '0', birikim: '—', birikimTipi: '—' },
]

const YGK_BES30_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'details', label: 'Detaylar', icon: 'details' },
]

const YGK_BES30_VERSIONS_BY_KOD = {
  'YB30-001': [
    { versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 1', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '0', aciklama: 'YGK BES3.0 Kuralı 1 (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YB30-002': [
    { versiyon: '2', aciklama: 'YGK BES3.0 Kuralı 2', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 2 (önceki)', durum: 'Arşiv', gecerlilik: '15.09.2024' },
  ],
  'YB30-003': [{ versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 3', durum: 'Aktif', gecerlilik: '01.06.2025' }],
}

const YGK_BES30_MUAF_BANDS_BY_KOD = {
  'YB30-001': [
    { id: '1', minTutar: '1001', maxTutar: '2000', oran: '0.08', tutar: '—' },
    { id: '2', minTutar: '2001', maxTutar: '3500', oran: '0.10', tutar: '—' },
    { id: '3', minTutar: '3501', maxTutar: '5000', oran: '0.12', tutar: '—' },
    { id: '4', minTutar: '5001', maxTutar: '7500', oran: '0.14', tutar: '—' },
    { id: '5', minTutar: '7501', maxTutar: '10000', oran: '0.16', tutar: '—' },
  ],
  'YB30-002': [
    { id: '1', minTutar: '0', maxTutar: '50000', oran: '0.03', tutar: '—' },
    { id: '2', minTutar: '50001', maxTutar: '100000', oran: '0.025', tutar: '—' },
  ],
  'YB30-003': [],
}

const YGK_BES30_KP_ARALIK_BY_KOD = {
  'YB30-001': [
    { id: '1', minKp: '500', maxKp: '2500', oran: '0.08', tutar: '—' },
    { id: '2', minKp: '2501', maxKp: '10000', oran: '0.10', tutar: '—' },
  ],
  'YB30-002': [{ id: '1', minKp: '1000', maxKp: '999999', oran: '0.03', tutar: '—' }],
  'YB30-003': [],
}

const YGK_BES30_MUAF_BAND_INNER_ACTIONS = [{ key: 'view', label: 'İncele', icon: 'view' }]

const KP_TEMPLATE_VERSIONS_BY_KOD = {
  'KPT-001': [
    { versiyon: '1', aciklama: 'Standart KP', durum: 'Aktif', olusturulma: '15.09.2025', olusturan: 'endeksleme' },
    { versiyon: '0', aciklama: 'Standart KP (önceki)', durum: 'Arşiv', olusturulma: '01.06.2025', olusturan: 'admin' },
  ],
  'KPT-002': [
    { versiyon: '2', aciklama: 'Yıllık KP', durum: 'Aktif', olusturulma: '21.09.2025', olusturan: 'endeksleme' },
    { versiyon: '1', aciklama: 'Yıllık KP', durum: 'Arşiv', olusturulma: '20.09.2025', olusturan: 'endeksleme' },
  ],
}

function kptToLinkedRow(t) {
  return {
    rowKey: `${t.kpTemplateKodu}-${t.versiyon}`,
    kpTemplateKodu: t.kpTemplateKodu,
    adi: t.adi,
    versiyon: t.versiyon,
    katkiPayiTutari: t.katkiPayiTutari,
    baslangicKapitali: t.baslangicKapitali,
    girisFonBuyuklugu: t.girisFonBuyuklugu,
    dovizKp: t.dovizKp,
    odemePeriyodu: t.odemePeriyodu,
    azamiKp: t.azamiKp,
    dovizDiger: t.dovizDiger,
    olusturan: t.olusturan,
    olusturulmaTarihi: t.olusturulmaTarihi,
    guncelleyen: t.guncelleyen || t.olusturan,
    guncellemeTarihi: t.guncellemeTarihi || t.olusturulmaTarihi,
  }
}

function normalizeDate(value) {
  return value || new Date().toLocaleDateString('tr-TR')
}

function branchLabelFromUrun(urun) {
  const parts = (urun?.tipler || '').split('·').map((s) => s.trim()).filter(Boolean)
  return parts[parts.length - 1] || 'Bireysel Emeklilik'
}

function formatPlanDurum(durum) {
  if (durum === 'Yururlukte') return 'Yürürlükte'
  if (durum === 'Taslak') return 'Taslak'
  return durum || '—'
}

function sozlesmeTipiUpper(sozlesmeTipi) {
  return (sozlesmeTipi || '').toUpperCase()
}

/** Emeklilik Gelir Planı akışı (EGP + Otomatik Katılım EGP) */
function isEgpLikeSozlesmeTipi(sozlesmeTipi) {
  const tip = sozlesmeTipiUpper(sozlesmeTipi)
  return tip === 'EGP' || tip === 'OKS-EGP'
}

function isOksOnlySozlesmeTipi(sozlesmeTipi) {
  return sozlesmeTipiUpper(sozlesmeTipi) === 'OKS'
}

function planKategoriKodu(urun) {
  const tip = sozlesmeTipiUpper(urun?.sozlesmeTipi)
  if (isEgpLikeSozlesmeTipi(tip)) return 'EGP.AP'
  if (tip === 'OKS') return 'OKS.AP'
  if (tip === 'GRUP') return 'BES.GP'
  return 'BES.AP'
}

function toHeaderIsoDate(raw) {
  if (!raw) return new Date().toISOString().slice(0, 10)
  const s = String(raw)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const p = s.split('.')
  if (p.length === 3) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`
  return new Date().toISOString().slice(0, 10)
}

function toInputDateValue(raw) {
  return toHeaderIsoDate(raw)
}

function formatIsoToTrDate(iso) {
  if (!iso) return '—'
  const s = String(iso)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-')
    return `${d}.${m}.${y}`
  }
  return s
}

/** Plan — Diğer Tanımlar / Endeksler tablosu için ay seçenekleri */
const TURKCE_AYLAR = [
  { value: '1', label: 'Ocak' },
  { value: '2', label: 'Şubat' },
  { value: '3', label: 'Mart' },
  { value: '4', label: 'Nisan' },
  { value: '5', label: 'Mayıs' },
  { value: '6', label: 'Haziran' },
  { value: '7', label: 'Temmuz' },
  { value: '8', label: 'Ağustos' },
  { value: '9', label: 'Eylül' },
  { value: '10', label: 'Ekim' },
  { value: '11', label: 'Kasım' },
  { value: '12', label: 'Aralık' },
]

function planEndeksTipiTableLabel(hesapKodu) {
  const h = katkiPayiHesaplama.find((x) => String(x.hesapKodu) === String(hesapKodu))
  if (!h) return String(hesapKodu || '—')
  const ad = h.hesapAdi
  if (ad === 'TEFE1') return 'TEFE'
  if (ad === 'TUFE') return 'TÜFE'
  if (ad === 'Artissiz') return 'Artışsız'
  return ad
}

const PLAN_ENDEKS_ROW_ACTIONS = [
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const INITIAL_PLAN_ENDEKS_ROWS = [
  { id: 'pl-end-1', hesapKodu: '1', artisTipi: 'Dönem', artisDonemi: '1', ekstraOranUst: 5 },
  { id: 'pl-end-2', hesapKodu: '2', artisTipi: 'Ay', artisDonemi: '3', ekstraOranUst: 3.5 },
  { id: 'pl-end-3', hesapKodu: '7', artisTipi: 'Dönem', artisDonemi: '4', ekstraOranUst: 0 },
]

const PLAN_ENDEKS_FORM_DEFAULT = () => ({
  hesapKodu: '',
  artisTipi: '',
  artisDonemi: '',
  ekstraOran: '0.00',
})

const EK_FAYDA_PLAN_ROW_ACTIONS = [
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const INITIAL_EK_FAYDA_PLAN_ROWS = [
  {
    id: 'efp-1',
    tanimId: null,
    planKod: 'EF001',
    katalogNo: '501',
    revizyonNu: 1,
    aciklama: 'Vefat Teminatı',
    durum: 'Aktif',
    grubaOzel: 'Hayır',
    eklemeBy: 'Ali Simit',
    eklemeTarih: '2026-01-01',
    guncelBy: 'Ali Simit',
    guncelTarih: '2026-01-01',
  },
  {
    id: 'efp-2',
    tanimId: null,
    planKod: 'EF002',
    katalogNo: '502',
    revizyonNu: 2,
    aciklama: 'Maluliyet Teminatı',
    durum: 'Pasif',
    grubaOzel: 'Evet',
    eklemeBy: 'Ali Simit',
    eklemeTarih: '2026-01-01',
    guncelBy: 'Ali Simit',
    guncelTarih: '2026-01-01',
  },
  {
    id: 'efp-3',
    tanimId: null,
    planKod: 'EF003',
    katalogNo: '503',
    revizyonNu: 3,
    aciklama: 'Kaza Sonucu Vefat',
    durum: 'Aktif',
    grubaOzel: 'Hayır',
    eklemeBy: 'Ali Simit',
    eklemeTarih: '2026-01-01',
    guncelBy: 'Ali Simit',
    guncelTarih: '2026-01-01',
  },
]

function nextEkFaydaPlanKod(rows) {
  let maxN = 0
  rows.forEach((r) => {
    const m = /^EF(\d+)$/i.exec(String(r.planKod || ''))
    if (m) maxN = Math.max(maxN, Number(m[1]))
  })
  return `EF${String(maxN + 1).padStart(3, '0')}`
}

function formatPlanEkFaydaAuditLine(name, isoDate) {
  if (!name && !isoDate) return '—'
  return `${name || '—'} ${isoDate ? formatIsoToTrDate(isoDate) : ''}`.trim()
}

const EK_FAYDA_FORM_DEFAULT = () => ({
  tanimId: null,
  katalogNo: '',
  revizyonNu: '',
  aciklama: '',
  durum: '',
  grubaOzel: '',
})

function applyEkFaydaTanimToFormFields(t) {
  return {
    tanimId: t.id,
    katalogNo: String(t.ekFaydaNo ?? ''),
    revizyonNu: String(t.revizyonNu ?? ''),
    aciklama: t.aciklama || '',
    grubaOzel: t.grubaOzel || 'Hayır',
  }
}

const SATIS_KANALI_PLAN_ROW_ACTIONS = [
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const INITIAL_SATIS_KANALI_PLAN_ROWS = [
  {
    id: 'sk-1',
    tanimId: 1,
    kanalKodu: '1',
    kanalAdi: 'Test',
    satisAdedi: 9,
    baslangic: '2025-01-01',
    bitis: '2025-01-01',
    sozlesmeBasimi: 'Evet',
  },
  {
    id: 'sk-2',
    tanimId: 2,
    kanalKodu: '2',
    kanalAdi: 'İnternet',
    satisAdedi: 100,
    baslangic: '2025-01-01',
    bitis: '2025-01-01',
    sozlesmeBasimi: 'Hayır',
  },
  {
    id: 'sk-3',
    tanimId: null,
    kanalKodu: '3',
    kanalAdi: 'Test',
    satisAdedi: 20,
    baslangic: '2025-01-01',
    bitis: '2025-01-01',
    sozlesmeBasimi: 'Evet',
  },
]

const SATIS_KANALI_FORM_DEFAULT = () => ({
  tanimId: null,
  kanalKodu: '',
  kanalAdi: '',
  baslangic: '',
  bitis: '',
  satisAdedi: '',
  sozlesmeBasimi: 'Hayır',
})

const DEGISIKLIK_PLAN_ROW_ACTIONS = [
  { key: 'cikar', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'bagliKanallar', label: 'Bağlı Kanallar', icon: 'link' },
]

function degisiklikKisaKoduFromTip(tip) {
  const z = String(tip.zeyilKodu)
  if (z === '91') return 'FND'
  if (z === '99') return 'PLN'
  if (z === 'KTK') return 'KTK'
  return z
}

function degisiklikPlanAdiTr(tip) {
  const m = {
    207: 'Fon Dağılımı Değişikliği',
    206: 'Plan Değişikliği',
    208: 'Kanuni Temsilci Kaldırma Değişikliği',
    201: 'Emeklilik',
    202: 'Sistemden Çıkış',
    204: 'Sözleşmeden Cayma',
  }
  return m[tip.id] || tip.zeyilAdi
}

const INITIAL_DEGISIKLIK_PLAN_ROWS = [
  {
    id: 'deg-1',
    tanimId: 207,
    degisiklikKodu: 'FND',
    degisiklikAdi: 'Fon Dağılımı Değişikliği',
    degisiklikAdedi: 12,
    eklemeBy: 'Ali Simit',
    eklemeTarih: '2026-01-01',
    guncelBy: 'Ali Simit',
    guncelTarih: '2026-01-01',
    bagliKanallar: { hepsi: false, kanalKodlari: ['1'] },
  },
  {
    id: 'deg-2',
    tanimId: 206,
    degisiklikKodu: 'PLN',
    degisiklikAdi: 'Plan Değişikliği',
    degisiklikAdedi: 6,
    eklemeBy: 'Ali Simit',
    eklemeTarih: '2026-01-01',
    guncelBy: 'Ali Simit',
    guncelTarih: '2026-01-01',
    bagliKanallar: { hepsi: true, kanalKodlari: [] },
  },
  {
    id: 'deg-3',
    tanimId: 208,
    degisiklikKodu: 'KTK',
    degisiklikAdi: 'Kanuni Temsilci Kaldırma Değişikliği',
    degisiklikAdedi: 3,
    eklemeBy: 'Ali Simit',
    eklemeTarih: '2026-01-01',
    guncelBy: 'Ali Simit',
    guncelTarih: '2026-01-01',
    bagliKanallar: { hepsi: false, kanalKodlari: ['2'] },
  },
]

/** Plan kaydındaki durum metnini Tarife Plan Durum parametre koduna çevirir */
function planDurumToKod(durum) {
  const s = String(durum || '').toLowerCase()
  if (s === 'yururlukte' || s.includes('yürürlük')) return 'A'
  if (s.includes('satisa') || s.includes('satışa')) return 'K'
  if (s.includes('kaldir') || s.includes('kaldır')) return 'Y'
  return 'D'
}

const OKS_PLAN_DURUM_ETIKET = { D: 'Taslak', A: 'Yürürlükte', K: 'Satışa Kapalı', Y: 'Yürürlükten Kaldırıldı' }
const OKS_PLAN_DURUM_SECENEKLERI = tarifePlanDurum.map((r) => ({ kod: r.kod, label: OKS_PLAN_DURUM_ETIKET[r.kod] || r.aciklama }))
const PLAN_DOVIZ_SECENEKLERI = [
  { kod: 'TL', label: 'TL' },
  { kod: 'USD', label: 'USD' },
  { kod: 'EUR', label: 'EUR' },
]
const BASVURU_TIPI_SECENEKLERI = basvuruTipleri.map((b) => ({ kod: b.kod, label: b.aciklama }))

function kurTipiEtiket(row) {
  const m = { EA: 'Efektif Alış', ES: 'Efektif Satış', DA: 'Döviz Alış', DS: 'Döviz Satış' }
  return m[row.kod] || row.aciklama
}

/** OKS Genel Bilgiler — çoklu seçim, kapalıyken "N tane seçildi" özeti */
function OksMultiSelectDropdown({ label, required, options, selectedKodlar, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const n = selectedKodlar.length
  const summary = n === 0 ? 'Seçiniz' : `${n} tane seçildi`

  const toggle = (kod) => {
    const next = selectedKodlar.includes(kod)
      ? selectedKodlar.filter((k) => k !== kod)
      : [...selectedKodlar, kod]
    onChange([...new Set(next)])
  }

  return (
    <div className="relative" ref={wrapRef}>
      <span className="block text-xs font-medium text-slate-600 mb-1">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-h-10 px-3 py-2 border border-slate-300 rounded-md text-sm text-left bg-white flex items-center justify-between gap-2 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={n === 0 ? 'text-slate-400' : 'text-slate-800'}>{summary}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
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

function PlanHeaderProgressRing({ pct = 20, stepText = '2/6' }) {
  const r = 15.5
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  const stroke = planKonfigRingStroke(pct)
  const tone = planKonfigProgressTone(pct)
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-[10px] text-slate-400 uppercase tracking-wide">Tamamlanma</div>
        <div className={`text-sm font-semibold tabular-nums ${tone.text}`}>{pct}%</div>
      </div>
      <div className="relative w-[52px] h-[52px] shrink-0">
        <svg className="w-[52px] h-[52px] -rotate-90" viewBox="0 0 36 36" aria-hidden>
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums ${tone.text}`}>{stepText}</span>
      </div>
    </div>
  )
}

function normalizeProduct(payload, source = {}) {
  const toplam = Number(payload.toplam ?? source.toplam ?? 0)
  const aktif = Number(payload.aktif ?? source.aktif ?? 0)
  const kapali = Number(payload.kapali ?? source.kapali ?? Math.max(toplam - aktif, 0))
  return {
    ...source,
    ...payload,
    tip: 'plan',
    toplam,
    aktif,
    kapali,
    tarih: normalizeDate(payload.tarih ?? source.tarih),
  }
}

function normalizePlan(payload, source = {}) {
  return {
    ...source,
    ...payload,
    oran: Number(payload.oran ?? source.oran ?? 0),
    tarih: normalizeDate(payload.tarih ?? source.tarih),
  }
}

function ProductCard({ urun, onOpen, onOpenPlans, onAction, menuOpenId, setMenuOpenId }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="cursor-pointer p-5 pb-0" onClick={() => onOpen(urun)}>
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[11px] font-semibold">{urun.id}</div>
          <h3 className="text-[42px] leading-[1.05] font-bold text-slate-800 group-hover:text-violet-700 mt-3">{urun.ad}</h3>
        </div>
        <div className="flex items-start gap-2 p-4 pb-0">
          <button
            type="button"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
            onClick={(e) => { e.stopPropagation(); setMenuOpenId((prev) => (prev === urun.id ? null : urun.id)) }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button type="button" className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-500">
            <Settings className="w-4 h-4" />
          </button>
          {menuOpenId === urun.id && (
            <div className="absolute z-30 top-12 right-14 w-44 bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(15,23,42,0.14)] py-1 text-sm">
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('view', urun)}><Eye className="w-3.5 h-3.5 text-violet-500" /> İncele</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('edit', urun)}><Pencil className="w-3.5 h-3.5 text-violet-500" /> Güncelle</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('copy', urun)}><Copy className="w-3.5 h-3.5 text-violet-500" /> Kopyala</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('newPlan', urun)}><Plus className="w-3.5 h-3.5 text-violet-500" /> Yeni Plan Ekle</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2 text-violet-700" onClick={() => onAction('view', urun)}><List className="w-3.5 h-3.5 text-violet-500" /> Planlar</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-red-50 inline-flex items-center gap-2 text-red-600" onClick={() => onAction('delete', urun)}><Trash2 className="w-3.5 h-3.5 text-red-500" /> Sil</button>
            </div>
          )}
        </div>
      </div>
      <div className="cursor-pointer px-5 pb-4" onClick={() => onOpen(urun)}>
        <p className="text-[13px] text-slate-500 mb-3">{urun.tipler}</p>
        <div className="space-y-1.5 text-slate-600 text-sm">
          <p>Toplam Plan Sayısı {urun.toplam}</p>
          <p>Aktif Plan Sayısı {urun.aktif}</p>
          <p>Satışa Kapalı Plan {urun.kapali}</p>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-white">
        <span className="text-xs text-slate-400">{urun.tarih}</span>
        <button
          type="button"
          className="px-3 py-1 rounded-full border border-violet-200 text-violet-700 text-xs font-medium bg-violet-50/30 hover:bg-violet-50"
          onClick={(e) => {
            e.stopPropagation()
            onOpenPlans?.(urun, { activeOnly: true })
          }}
        >
          Aktif Planlar
        </button>
      </div>
    </div>
  )
}

function PlanCard({ plan, urun, onDetail, onPlanAction, menuOpenId, setMenuOpenId }) {
  const progressColor = Number(plan.oran) >= 100 ? 'bg-emerald-500' : 'bg-amber-500'

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-violet-200 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all flex flex-col h-full">
      <div className="p-4 pb-2 flex items-start justify-between gap-2">
        <span className="inline-flex px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[11px] font-semibold">{plan.id}</span>
        <div className="relative">
          <button
            type="button"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpenId((prev) => (prev === plan.id ? null : plan.id))
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpenId === plan.id && (
            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-sm">
              {planCardMenuItems(plan).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2 ${
                    item.danger ? 'text-red-600 hover:bg-red-50' : item.accent ? 'text-violet-700' : 'text-slate-700'
                  }`}
                  onClick={() => {
                    onPlanAction(item.key, plan)
                    setMenuOpenId(null)
                  }}
                >
                  <item.Icon className={`w-3.5 h-3.5 shrink-0 ${item.danger ? 'text-red-500' : item.accent ? 'text-violet-500' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-3">
        <StatusBadge value={plan.durum}>{formatPlanDurum(plan.durum)}</StatusBadge>
        <h3 className="text-lg font-bold text-slate-800 mt-2 leading-snug">{plan.ad}</h3>
      </div>

      <div className="px-4 pb-3">
        <p className="text-[10px] font-bold text-slate-400 tracking-wide mb-2">ÖZET</p>
        <div className="text-sm space-y-1 text-slate-700">
          <p><span className="text-slate-500">Kategori Kodu:</span> {planKategoriKodu(urun)}</p>
          <p><span className="text-slate-500">Sözleşme Tipi:</span> {urun.sozlesmeTipi || '—'}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          <span>Tanımlanma</span>
          <span className="font-semibold tabular-nums">%{plan.oran}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor} transition-all`} style={{ width: `${Math.min(Number(plan.oran) || 0, 100)}%` }} />
        </div>
      </div>

      <div className="mt-auto border-t border-slate-100 px-4 py-3 flex items-center justify-between bg-white">
        <span className="text-xs text-slate-400">{plan.tarih}</span>
        <button
          type="button"
          className="px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-semibold"
          onClick={() => onDetail(plan)}
        >
          Detaylar
        </button>
      </div>
    </div>
  )
}

function PlanList({
  urun,
  planlar,
  activeOnly = false,
  onBack,
  onSavePlan,
  onPlanAction,
  onStartNewPlanFlow,
  onPlanDetail,
}) {
  const [planView, setPlanView] = useState('grid')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(activeOnly ? 'Yururlukte' : '')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', durum: 'Taslak', oran: 30, tarih: '' })

  const filtered = planlar.filter((p) => {
    const matchSearch = !search || p.ad.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.durum === statusFilter
    return matchSearch && matchStatus
  })

  const openCreate = () => {
    onStartNewPlanFlow?.(urun)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ ...row })
    setFormOpen(true)
  }

  const handlePlanAction = (key, row) => {
    if (key === 'edit') {
      openEdit(row)
      return
    }
    if (key === 'view') {
      onPlanDetail?.(row)
      return
    }
    onPlanAction(key, row)
  }

  const save = () => {
    if (!form.id.trim()) return alert('Plan No zorunludur.')
    if (!form.ad.trim()) return alert('Plan Adi zorunludur.')
    const payload = normalizePlan(form)
    const duplicate = planlar.some((p) => p.id === payload.id && p.id !== editingId)
    if (duplicate) return alert('Bu Plan No zaten kullaniliyor.')
    onSavePlan(payload, editingId)
    setFormOpen(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Ürün listesine dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-800 truncate">{urun.ad}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 text-[10px] font-bold tracking-wide">PLANLAR LİSTESİ</span>
              <span className="text-xs text-slate-500">Seçili ürünün planları</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <OutlineButton onClick={() => setPlanView('grid')} className={planView === 'grid' ? 'border-violet-300 text-violet-700 bg-violet-50' : ''}><LayoutGrid className="w-4 h-4" /></OutlineButton>
          <OutlineButton onClick={() => setPlanView('list')} className={planView === 'list' ? 'border-violet-300 text-violet-700 bg-violet-50' : ''}><ListIcon className="w-4 h-4" /></OutlineButton>
          <PrimaryButton onClick={openCreate} className="bg-violet-600 hover:bg-violet-700"><Plus className="w-4 h-4" /> Yeni Plan Ekle</PrimaryButton>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="w-44 h-10 px-3 border border-slate-300 rounded-md text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="Yururlukte">Yürürlükte</option>
          <option value="Taslak">Taslak</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {planView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                urun={urun}
                onDetail={onPlanDetail}
                onPlanAction={handlePlanAction}
                menuOpenId={menuOpenId}
                setMenuOpenId={setMenuOpenId}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-slate-500 py-12 text-sm">Sonuç bulunamadı</div>
            )}
          </div>
        ) : (
          <div className="overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>KOD</th>
                  <th>AD</th>
                  <th>DURUM</th>
                  <th>SON GÜNCELLEME</th>
                  <th className="w-12 text-right">İŞLEM</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold text-violet-700">{p.id}</td>
                    <td>{p.ad}</td>
                    <td><StatusBadge value={p.durum}>{formatPlanDurum(p.durum)}</StatusBadge></td>
                    <td>{p.tarih}</td>
                    <td className="text-right">
                      <RowActions
                        row={p}
                        actions={planRowActions(p)}
                        onAction={handlePlanAction}
                      />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-slate-500 py-8 text-sm">Sonuç bulunamadı</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${editingId ? 'Plan Güncelle' : 'Yeni Plan'} - ${urun.ad}`}
        size="lg"
        footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={save}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[{ k: 'id', l: 'Plan No' }, { k: 'ad', l: 'Plan Adi' }, { k: 'durum', l: 'Durum' }, { k: 'oran', l: 'Tamamlanma %' }, { k: 'tarih', l: 'Tarih' }].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}

function PlanConfigurationBoard({ plan, urun, onBack, onOpenCard }) {
  const tip = sozlesmeTipiUpper(urun?.sozlesmeTipi)
  const isEgp = isEgpLikeSozlesmeTipi(tip)
  const visibleCards = isOksOnlySozlesmeTipi(tip)
    ? PLAN_SETUP_CARDS.filter((card) => card.id !== 'katki' && card.id !== 'kesinti')
    : PLAN_SETUP_CARDS

  const headerAgg = useMemo(() => aggregatePlanSetupHeader(visibleCards), [visibleCards])
  const egpHeaderAgg = useMemo(() => aggregateEgpPlanHeader(PLAN_SETUP_CARDS_EGP), [])
  const headerTone = planKonfigProgressTone(headerAgg.pct)

  const subtitle = `${plan?.id || '-'} • ${branchLabelFromUrun(urun)} • ${toHeaderIsoDate(plan?.tarih)}`

  const CardIcon = ({ name }) => {
    const cls = 'w-5 h-5 text-white'
    if (name === 'check') return <CheckCircle2 className={cls} />
    if (name === 'sliders') return <SlidersHorizontal className={cls} />
    if (name === 'file') return <FileText className={cls} />
    return <Settings className={cls} />
  }

  if (isEgp) {
    return (
      <div className="bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <button type="button" onClick={onBack} className="mt-1 text-slate-500 hover:text-slate-700 shrink-0"><ArrowLeft className="w-5 h-5" /></button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 truncate">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold shrink-0">Taslak</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
            </div>
          </div>
          <PlanHeaderProgressRing pct={egpHeaderAgg.pct} stepText={egpHeaderAgg.score} />
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Plan Konfigürasyonu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            {PLAN_SETUP_CARDS_EGP.map((card) => {
              const tone = card.progress ? planKonfigProgressTone(card.progress.pct) : { bar: 'bg-slate-300', text: 'text-slate-500' }
              return (
              <div
                key={card.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenCard?.(card.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpenCard?.(card.id)
                  }
                }}
                className="text-left bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-violet-300 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${card.iconClass} shrink-0 inline-flex items-center justify-center shadow-sm`}>
                    <CardIcon name={card.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{card.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Son Güncelleme Tarihi: {card.update}</p>
                      </div>
                      <button
                        type="button"
                        className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-violet-600 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenCard?.(card.id)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>

                    {card.progress ? (
                      <div className="mt-3">
                        <div className="text-[10px] text-slate-500 mb-1">{card.progress.label}</div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${card.progress.pct}%` }} />
                        </div>
                        <div className={`text-[11px] text-right mt-1 font-medium tabular-nums ${tone.text}`}>
                          %{card.progress.pct} {card.progress.score}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-3">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Özet</div>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        {card.lines.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                    </div>

                    {card.footerChips?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {card.footerChips.map((chip) => (
                          <span key={chip} className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700">{chip}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">TASLAK</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${headerTone.bar}`} style={{ width: `${headerAgg.pct}%` }} />
          </div>
          <div className={`text-xs font-semibold text-right mt-1 tabular-nums ${headerTone.text}`}>
            %{headerAgg.pct} {headerAgg.score}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 md:p-4 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {visibleCards.map((card) => {
            const tone = planKonfigProgressTone(card.bar)
            const showCheck = card.score !== '0/6'
            return (
            <button key={card.id} data-card-id={card.id} type="button" onClick={() => onOpenCard?.(card.id)} className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{card.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">Son Güncelleme Tarihi: {card.update}</div>
                </div>
                {showCheck ? (
                  <span className="w-4 h-4 rounded-full border border-emerald-300 text-emerald-500 inline-flex items-center justify-center text-[10px] shrink-0" aria-hidden>✓</span>
                ) : (
                  <span className="w-4 h-4 shrink-0" aria-hidden />
                )}
              </div>
              <div className="mt-3">
                <div className="text-[10px] text-slate-500 mb-1">TANIMLAMA</div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${tone.bar}`} style={{ width: `${card.bar}%` }} />
                </div>
                <div className={`text-[11px] text-right mt-1 font-medium tabular-nums ${tone.text}`}>
                  %{card.bar} {card.score}
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
                {card.lines.map((line) => <div key={line}>{line}</div>)}
              </div>
            </button>
          )})}
        </div>
      </div>
    </div>
  )
}

function DigerTanimlarScreen({ plan, urun, onBack }) {
  const [activeMenu, setActiveMenu] = useState('istisna')
  const [istisnaTanimlanmayacak, setIstisnaTanimlanmayacak] = useState(false)
  const [istisnaSearch, setIstisnaSearch] = useState('')
  const [istisnaRows, setIstisnaRows] = useState(() => INITIAL_ISTISNA_PLAN_ROWS.map((r) => ({ ...r })))
  const [istisnaModalOpen, setIstisnaModalOpen] = useState(false)
  const [istisnaEditingId, setIstisnaEditingId] = useState(null)
  const [istisnaForm, setIstisnaForm] = useState({ planId: '', baslangic: '', bitis: '' })

  const [endeksRows, setEndeksRows] = useState(() => INITIAL_PLAN_ENDEKS_ROWS.map((r) => ({ ...r })))
  const [endeksModalOpen, setEndeksModalOpen] = useState(false)
  const [endeksEditingId, setEndeksEditingId] = useState(null)
  const [endeksForm, setEndeksForm] = useState(() => PLAN_ENDEKS_FORM_DEFAULT())

  const [ekFaydaRows, setEkFaydaRows] = useState(() => INITIAL_EK_FAYDA_PLAN_ROWS.map((r) => ({ ...r })))
  const [ekFaydaTanimlanmayacak, setEkFaydaTanimlanmayacak] = useState(false)
  const [ekFaydaSearch, setEkFaydaSearch] = useState('')
  const [ekFaydaModalOpen, setEkFaydaModalOpen] = useState(false)
  const [ekFaydaEditingId, setEkFaydaEditingId] = useState(null)
  const [ekFaydaForm, setEkFaydaForm] = useState(() => EK_FAYDA_FORM_DEFAULT())
  const [ekFaydaPickerOpen, setEkFaydaPickerOpen] = useState(false)

  const [satisKanaliRows, setSatisKanaliRows] = useState(() => INITIAL_SATIS_KANALI_PLAN_ROWS.map((r) => ({ ...r })))
  const [satisKanaliSearch, setSatisKanaliSearch] = useState('')
  const [satisKanaliModalOpen, setSatisKanaliModalOpen] = useState(false)
  const [satisKanaliEditingId, setSatisKanaliEditingId] = useState(null)
  const [satisKanaliForm, setSatisKanaliForm] = useState(() => SATIS_KANALI_FORM_DEFAULT())
  const [satisKanaliPickerOpen, setSatisKanaliPickerOpen] = useState(false)

  const [degisiklikRows, setDegisiklikRows] = useState(() => INITIAL_DEGISIKLIK_PLAN_ROWS.map((r) => ({ ...r, bagliKanallar: { ...r.bagliKanallar, kanalKodlari: [...(r.bagliKanallar?.kanalKodlari || [])] } })))
  const [degisiklikSearch, setDegisiklikSearch] = useState('')
  const [degisiklikSelectedIds, setDegisiklikSelectedIds] = useState([])
  const [degisiklikEkleModalOpen, setDegisiklikEkleModalOpen] = useState(false)
  const [degisiklikModalSearch, setDegisiklikModalSearch] = useState('')
  const [degisiklikModalSecIds, setDegisiklikModalSecIds] = useState([])
  const [degisiklikKanalModalOpen, setDegisiklikKanalModalOpen] = useState(false)
  const [kanalModalHepsi, setKanalModalHepsi] = useState(true)
  const [kanalModalKodSec, setKanalModalKodSec] = useState({})
  const [degisiklikAdetEditing, setDegisiklikAdetEditing] = useState(null)
  const [degisiklikAdetDraft, setDegisiklikAdetDraft] = useState('')
  const [bagliKanallarModalRow, setBagliKanallarModalRow] = useState(null)

  const planLookupOptions = useMemo(() => {
    const out = []
    Object.entries(urunPlanlari).forEach(([, plans]) => {
      plans.forEach((p) => {
        out.push({ id: p.id, ad: p.ad })
      })
    })
    return out.sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
  }, [])

  const filteredIstisna = useMemo(() => {
    const q = istisnaSearch.trim().toLowerCase()
    if (!q) return istisnaRows
    return istisnaRows.filter((r) => r.planAdi.toLowerCase().includes(q))
  }, [istisnaRows, istisnaSearch])

  const filteredEkFayda = useMemo(() => {
    const q = ekFaydaSearch.trim().toLowerCase()
    if (!q) return ekFaydaRows
    return ekFaydaRows.filter((r) => {
      const blob = `${r.planKod} ${r.katalogNo} ${r.aciklama} ${r.durum} ${r.grubaOzel}`.toLowerCase()
      return blob.includes(q)
    })
  }, [ekFaydaRows, ekFaydaSearch])

  const filteredSatisKanali = useMemo(() => {
    const q = satisKanaliSearch.trim().toLowerCase()
    if (!q) return satisKanaliRows
    return satisKanaliRows.filter((r) => {
      const blob = `${r.kanalKodu} ${r.kanalAdi} ${r.satisAdedi} ${r.sozlesmeBasimi}`.toLowerCase()
      return blob.includes(q)
    })
  }, [satisKanaliRows, satisKanaliSearch])

  const filteredDegisiklik = useMemo(() => {
    const q = degisiklikSearch.trim().toLowerCase()
    if (!q) return degisiklikRows
    return degisiklikRows.filter((r) => {
      const blob = `${r.degisiklikKodu} ${r.degisiklikAdi} ${r.degisiklikAdedi}`.toLowerCase()
      return blob.includes(q)
    })
  }, [degisiklikRows, degisiklikSearch])

  const filteredDegisiklikTipleriModal = useMemo(() => {
    const q = degisiklikModalSearch.trim().toLowerCase()
    if (!q) return degisiklikTipleri
    return degisiklikTipleri.filter((t) => {
      const blob = `${t.brans} ${t.zeyilKodu} ${t.zeyilAdi} ${degisiklikPlanAdiTr(t)}`.toLowerCase()
      return blob.includes(q)
    })
  }, [degisiklikModalSearch])

  const degisiklikKanalSecimiAktif = degisiklikSelectedIds.length > 0

  const toggleDegisiklikRowSelect = (rowId) => {
    setDegisiklikSelectedIds((prev) => (prev.includes(rowId) ? prev.filter((x) => x !== rowId) : [...prev, rowId]))
  }

  const toggleDegisiklikSelectAllFiltered = () => {
    const ids = filteredDegisiklik.map((r) => r.id)
    const allOn = ids.length > 0 && ids.every((id) => degisiklikSelectedIds.includes(id))
    if (allOn) {
      setDegisiklikSelectedIds((prev) => prev.filter((id) => !ids.includes(id)))
    } else {
      setDegisiklikSelectedIds((prev) => [...new Set([...prev, ...ids])])
    }
  }

  const openDegisiklikEkleModal = () => {
    setDegisiklikModalSearch('')
    setDegisiklikModalSecIds([])
    setDegisiklikEkleModalOpen(true)
  }

  const toggleDegisiklikModalSec = (tipId) => {
    setDegisiklikModalSecIds((prev) => (prev.includes(tipId) ? prev.filter((x) => x !== tipId) : [...prev, tipId]))
  }

  const applyDegisiklikModalSec = () => {
    if (degisiklikModalSecIds.length === 0) return alert('En az bir değişiklik tipi seçiniz.')
    const today = new Date().toISOString().slice(0, 10)
    setDegisiklikRows((prev) => {
      const existingTanim = new Set(prev.map((r) => r.tanimId))
      const additions = []
      for (const tipId of degisiklikModalSecIds) {
        if (existingTanim.has(tipId)) continue
        const tip = degisiklikTipleri.find((t) => t.id === tipId)
        if (!tip) continue
        const yil = Number(String(tip.yilLimit).trim())
        additions.push({
          id: `deg-${Date.now()}-${tipId}`,
          tanimId: tip.id,
          degisiklikKodu: degisiklikKisaKoduFromTip(tip),
          degisiklikAdi: degisiklikPlanAdiTr(tip),
          degisiklikAdedi: Number.isNaN(yil) ? 1 : yil,
          eklemeBy: 'Ali Simit',
          eklemeTarih: today,
          guncelBy: 'Ali Simit',
          guncelTarih: today,
          bagliKanallar: { hepsi: true, kanalKodlari: [] },
        })
      }
      if (additions.length === 0) {
        alert('Seçilen tipler planda zaten tanımlı.')
        return prev
      }
      return [...prev, ...additions]
    })
    setDegisiklikEkleModalOpen(false)
    setDegisiklikModalSecIds([])
  }

  const openDegisiklikKanalModal = () => {
    const sel = degisiklikRows.filter((r) => degisiklikSelectedIds.includes(r.id))
    const first = sel[0]
    if (first?.bagliKanallar?.hepsi) {
      setKanalModalHepsi(true)
      setKanalModalKodSec({})
    } else {
      setKanalModalHepsi(false)
      const m = {}
      satisKanaliTanimlari.forEach((c) => {
        m[c.kanalKodu] = (first?.bagliKanallar?.kanalKodlari || []).includes(c.kanalKodu)
      })
      setKanalModalKodSec(m)
    }
    setDegisiklikKanalModalOpen(true)
  }

  const saveDegisiklikKanalModal = () => {
    const bagli = kanalModalHepsi
      ? { hepsi: true, kanalKodlari: [] }
      : {
          hepsi: false,
          kanalKodlari: satisKanaliTanimlari.filter((c) => kanalModalKodSec[c.kanalKodu]).map((c) => c.kanalKodu),
        }
    if (!kanalModalHepsi && bagli.kanalKodlari.length === 0) {
      return alert('Kanal seçin veya "Tüm Satış Kanalları (Hepsi)" seçeneğini işaretleyin.')
    }
    const today = new Date().toISOString().slice(0, 10)
    setDegisiklikRows((prev) =>
      prev.map((r) =>
        degisiklikSelectedIds.includes(r.id)
          ? { ...r, bagliKanallar: bagli, guncelBy: 'Ali Simit', guncelTarih: today }
          : r,
      ),
    )
    setDegisiklikKanalModalOpen(false)
  }

  const commitDegisiklikAdet = (rowId) => {
    const n = Number(String(degisiklikAdetDraft).trim())
    if (degisiklikAdetDraft === '' || Number.isNaN(n) || n < 0) {
      setDegisiklikAdetEditing(null)
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    setDegisiklikRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, degisiklikAdedi: n, guncelBy: 'Ali Simit', guncelTarih: today } : r,
      ),
    )
    setDegisiklikAdetEditing(null)
  }

  const openIstisnaModalNew = () => {
    setIstisnaEditingId(null)
    setIstisnaForm({ planId: '', baslangic: '', bitis: '' })
    setIstisnaModalOpen(true)
  }

  const openIstisnaModalEdit = (row) => {
    setIstisnaEditingId(row.id)
    setIstisnaForm({
      planId: row.planId || planLookupOptions.find((o) => o.ad === row.planAdi)?.id || '',
      baslangic: row.baslangic || '',
      bitis: row.bitis || '',
    })
    setIstisnaModalOpen(true)
  }

  const saveIstisnaModal = () => {
    if (!istisnaForm.planId) return alert('Geçiş yapılamayacak plan seçiniz.')
    if (!istisnaForm.baslangic) return alert('Başlangıç tarihi zorunludur.')
    const opt = planLookupOptions.find((o) => o.id === istisnaForm.planId)
    const planAdi = opt?.ad || istisnaForm.planId
    if (istisnaEditingId) {
      setIstisnaRows((prev) =>
        prev.map((r) =>
          r.id === istisnaEditingId
            ? { ...r, planId: istisnaForm.planId, planAdi, baslangic: istisnaForm.baslangic, bitis: istisnaForm.bitis || '' }
            : r,
        ),
      )
    } else {
      setIstisnaRows((prev) => [
        ...prev,
        {
          id: `ist-${Date.now()}`,
          planId: istisnaForm.planId,
          planAdi,
          baslangic: istisnaForm.baslangic,
          bitis: istisnaForm.bitis || '',
        },
      ])
    }
    setIstisnaModalOpen(false)
  }

  const openEndeksModalNew = () => {
    setEndeksEditingId(null)
    setEndeksForm(PLAN_ENDEKS_FORM_DEFAULT())
    setEndeksModalOpen(true)
  }

  const openEndeksModalEdit = (row) => {
    setEndeksEditingId(row.id)
    setEndeksForm({
      hesapKodu: String(row.hesapKodu ?? ''),
      artisTipi: row.artisTipi || '',
      artisDonemi: String(row.artisDonemi ?? ''),
      ekstraOran: row.ekstraOranUst != null ? String(row.ekstraOranUst).replace('.', ',') : '0,00',
    })
    setEndeksModalOpen(true)
  }

  const saveEndeksModal = () => {
    if (!endeksForm.hesapKodu) return alert('Tip seçiniz.')
    if (!endeksForm.artisTipi) return alert('Artış tipi seçiniz.')
    if (!String(endeksForm.artisDonemi).trim()) return alert('Artış dönemi seçiniz.')
    const rawOran = String(endeksForm.ekstraOran).trim().replace(',', '.')
    if (rawOran === '' || Number.isNaN(Number(rawOran))) return alert('Ekstra artış oranı geçerli bir sayı olmalıdır.')
    const payload = {
      id: endeksEditingId || `pl-end-${Date.now()}`,
      hesapKodu: endeksForm.hesapKodu,
      artisTipi: endeksForm.artisTipi,
      artisDonemi: endeksForm.artisDonemi,
      ekstraOranUst: Number(rawOran),
    }
    if (endeksEditingId) {
      setEndeksRows((prev) => prev.map((r) => (r.id === endeksEditingId ? payload : r)))
    } else {
      setEndeksRows((prev) => [...prev, payload])
    }
    setEndeksModalOpen(false)
  }

  const openEkFaydaModalNew = () => {
    setEkFaydaEditingId(null)
    setEkFaydaForm(EK_FAYDA_FORM_DEFAULT())
    setEkFaydaModalOpen(true)
  }

  const openEkFaydaModalEdit = (row) => {
    setEkFaydaEditingId(row.id)
    setEkFaydaForm({
      tanimId: row.tanimId,
      katalogNo: String(row.katalogNo ?? ''),
      revizyonNu: String(row.revizyonNu ?? ''),
      aciklama: row.aciklama || '',
      durum: row.durum || '',
      grubaOzel: row.grubaOzel || '',
    })
    setEkFaydaModalOpen(true)
  }

  const pickEkFaydaTanim = (t) => {
    const picked = applyEkFaydaTanimToFormFields(t)
    setEkFaydaForm((f) => ({
      ...picked,
      durum: f.durum || '',
    }))
    setEkFaydaPickerOpen(false)
  }

  const saveEkFaydaModal = () => {
    if (!String(ekFaydaForm.katalogNo).trim()) return alert('Ek fayda tanımı seçiniz (Ek Fayda No).')
    if (!ekFaydaForm.durum) return alert('Durum seçiniz.')
    const rev = Number(String(ekFaydaForm.revizyonNu).trim())
    if (ekFaydaForm.revizyonNu === '' || Number.isNaN(rev)) return alert('Revizyon bilgisi geçersiz.')
    const today = new Date().toISOString().slice(0, 10)
    if (ekFaydaEditingId) {
      setEkFaydaRows((prev) =>
        prev.map((r) =>
          r.id === ekFaydaEditingId
            ? {
                ...r,
                tanimId: ekFaydaForm.tanimId,
                katalogNo: ekFaydaForm.katalogNo,
                revizyonNu: rev,
                aciklama: ekFaydaForm.aciklama,
                durum: ekFaydaForm.durum,
                grubaOzel: ekFaydaForm.grubaOzel,
                guncelBy: 'Ali Simit',
                guncelTarih: today,
              }
            : r,
        ),
      )
    } else {
      setEkFaydaRows((prev) => [
        ...prev,
        {
          id: `efp-${Date.now()}`,
          tanimId: ekFaydaForm.tanimId,
          planKod: nextEkFaydaPlanKod(prev),
          katalogNo: ekFaydaForm.katalogNo,
          revizyonNu: rev,
          aciklama: ekFaydaForm.aciklama,
          durum: ekFaydaForm.durum,
          grubaOzel: ekFaydaForm.grubaOzel,
          eklemeBy: 'Ali Simit',
          eklemeTarih: today,
          guncelBy: 'Ali Simit',
          guncelTarih: today,
        },
      ])
    }
    setEkFaydaModalOpen(false)
  }

  const openSatisKanaliModalNew = () => {
    setSatisKanaliEditingId(null)
    setSatisKanaliForm(SATIS_KANALI_FORM_DEFAULT())
    setSatisKanaliModalOpen(true)
  }

  const openSatisKanaliModalEdit = (row) => {
    setSatisKanaliEditingId(row.id)
    setSatisKanaliForm({
      tanimId: row.tanimId,
      kanalKodu: String(row.kanalKodu ?? ''),
      kanalAdi: row.kanalAdi || '',
      baslangic: row.baslangic || '',
      bitis: row.bitis || '',
      satisAdedi: String(row.satisAdedi ?? ''),
      sozlesmeBasimi: row.sozlesmeBasimi || 'Hayır',
    })
    setSatisKanaliModalOpen(true)
  }

  const pickSatisKanaliTanim = (t) => {
    setSatisKanaliForm((f) => ({
      ...f,
      tanimId: t.id,
      kanalKodu: String(t.kanalKodu ?? ''),
      kanalAdi: t.kanalAdi || '',
    }))
    setSatisKanaliPickerOpen(false)
  }

  const saveSatisKanaliModal = () => {
    if (!String(satisKanaliForm.kanalKodu).trim()) return alert('Kanal seçiniz.')
    if (!satisKanaliForm.baslangic) return alert('Başlangıç tarihi zorunludur.')
    const adet = Number(String(satisKanaliForm.satisAdedi).trim().replace(',', '.'))
    if (satisKanaliForm.satisAdedi === '' || !Number.isFinite(adet) || adet < 0) return alert('Geçerli bir satış adedi giriniz.')
    if (!satisKanaliForm.sozlesmeBasimi) return alert('Sözleşme basımı seçiniz.')
    const payload = {
      id: satisKanaliEditingId || `sk-${Date.now()}`,
      tanimId: satisKanaliForm.tanimId,
      kanalKodu: satisKanaliForm.kanalKodu,
      kanalAdi: satisKanaliForm.kanalAdi,
      satisAdedi: adet,
      baslangic: satisKanaliForm.baslangic,
      bitis: satisKanaliForm.bitis || satisKanaliForm.baslangic,
      sozlesmeBasimi: satisKanaliForm.sozlesmeBasimi,
    }
    if (satisKanaliEditingId) {
      setSatisKanaliRows((prev) => prev.map((r) => (r.id === satisKanaliEditingId ? payload : r)))
    } else {
      setSatisKanaliRows((prev) => [...prev, payload])
    }
    setSatisKanaliModalOpen(false)
  }

  const subtitle = `${plan?.id || '-'} • ${branchLabelFromUrun(urun)} • ${toHeaderIsoDate(plan?.tarih)}`

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-4 md:px-6 py-3 border-b border-slate-100 bg-white shrink-0">
        <div className="text-[11px] text-slate-500 mb-2">
          Ürün Yönetimi / Ürün Planları / Plan Detay Sayfası / <span className="text-slate-700 font-medium">Diğer Tanımlar</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-md hover:bg-slate-100" aria-label="Geri">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 truncate">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-auto">
          <div className="p-3 border-b border-slate-100">
            <div className="text-sm font-semibold text-slate-800 leading-snug">{urun?.ad || 'Ürün'}</div>
            <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
              <div><span className="text-slate-400">Plan Kodu:</span> {plan?.id || '—'}</div>
              <div><span className="text-slate-400">Branş:</span> {branchLabelFromUrun(urun)}</div>
              <div><span className="text-slate-400">Sözleşme Tipi:</span> {urun?.sozlesmeTipi || '—'}</div>
            </div>
          </div>
          <nav className="p-2 flex flex-col gap-0.5">
            {DIGER_TANIMLAR_MENU.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                  activeMenu === item.id
                    ? 'bg-violet-50 text-violet-900 font-medium border border-violet-100'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeMenu === 'istisna' ? (
            <div className="max-w-5xl">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">İstisna Planlar</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara..."
                    value={istisnaSearch}
                    onChange={(e) => setIstisnaSearch(e.target.value)}
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 shrink-0">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-violet-600"
                    checked={istisnaTanimlanmayacak}
                    onChange={(e) => setIstisnaTanimlanmayacak(e.target.checked)}
                  />
                  İstisna Plan Tanımlanmayacak
                </label>
                <div className="sm:ml-auto">
                  <PrimaryButton
                    disabled={istisnaTanimlanmayacak}
                    onClick={openIstisnaModalNew}
                  >
                    <Plus className="w-4 h-4" /> Yeni Ekle
                  </PrimaryButton>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <table className="w-full grid-table text-sm">
                  <thead>
                    <tr>
                      <th>
                        <span className="inline-flex items-center gap-1.5">
                          Geçiş Yapılamayacak Planlar
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </th>
                      <th className="whitespace-nowrap w-36">
                        <span className="inline-flex items-center gap-1.5">
                          Başlangıç Tarihi
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </th>
                      <th className="whitespace-nowrap w-36">
                        <span className="inline-flex items-center gap-1.5">
                          Bitiş Tarihi
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </th>
                      <th className="w-12 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIstisna.map((row) => (
                      <tr key={row.id}>
                        <td>{row.planAdi}</td>
                        <td>{formatIsoToTrDate(row.baslangic)}</td>
                        <td>{row.bitis ? formatIsoToTrDate(row.bitis) : '—'}</td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={ISTISNA_PLAN_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'edit') openIstisnaModalEdit(r)
                              if (key === 'delete') {
                                if (!window.confirm('Kayıt silinsin mi?')) return
                                setIstisnaRows((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {filteredIstisna.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-slate-500 py-8">
                          {istisnaSearch ? 'Arama sonucu bulunamadı.' : 'Kayıt yok.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeMenu === 'endeks' ? (
            <div className="max-w-5xl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-semibold text-violet-700">Endeksler</h3>
                <PrimaryButton onClick={openEndeksModalNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> Ekle
                </PrimaryButton>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[520px]">
                  <thead>
                    <tr>
                      <th>Endeks Tipi</th>
                      <th>Artış Tipi</th>
                      <th className="text-right whitespace-nowrap">Ekstra Artış Oranı Üst Limit</th>
                      <th className="text-right w-28">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endeksRows.map((row) => (
                      <tr key={row.id}>
                        <td>{planEndeksTipiTableLabel(row.hesapKodu)}</td>
                        <td>{row.artisTipi}</td>
                        <td className="text-right tabular-nums">
                          {Number(row.ekstraOranUst).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={PLAN_ENDEKS_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'edit') openEndeksModalEdit(r)
                              if (key === 'delete') {
                                if (!window.confirm('Kayıt silinsin mi?')) return
                                setEndeksRows((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeMenu === 'ekFayda' ? (
            <div className="max-w-6xl">
              <h3 className="text-sm font-semibold text-violet-700 mb-4">Ek Fayda</h3>
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara..."
                    value={ekFaydaSearch}
                    onChange={(e) => setEkFaydaSearch(e.target.value)}
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 shrink-0 lg:ml-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-violet-600"
                    checked={ekFaydaTanimlanmayacak}
                    onChange={(e) => setEkFaydaTanimlanmayacak(e.target.checked)}
                  />
                  Ekfayda Tanımlanmayacak
                </label>
                <div className="lg:ml-auto">
                  <PrimaryButton
                    disabled={ekFaydaTanimlanmayacak}
                    onClick={openEkFaydaModalNew}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="w-4 h-4" /> Yeni Ekle
                  </PrimaryButton>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[960px]">
                  <thead>
                    <tr>
                      <th>Ek Fayda Nu</th>
                      <th className="text-right whitespace-nowrap">Revizyon Nu</th>
                      <th>Açıklama</th>
                      <th>Durum</th>
                      <th>Gruba Özel</th>
                      <th className="whitespace-nowrap">Ekleme</th>
                      <th className="whitespace-nowrap">Güncelleme</th>
                      <th className="text-right w-24">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEkFayda.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <button
                            type="button"
                            className="text-blue-600 font-medium hover:underline"
                            onClick={() => openEkFaydaModalEdit(row)}
                          >
                            {row.planKod}
                          </button>
                        </td>
                        <td className="text-right tabular-nums">{row.revizyonNu}</td>
                        <td>{row.aciklama}</td>
                        <td>
                          {row.durum === 'Aktif' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200">
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                              Pasif
                            </span>
                          )}
                        </td>
                        <td>
                          {row.grubaOzel === 'Evet' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200">
                              Evet
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-sky-50 text-sky-800 border-sky-200">
                              Hayır
                            </span>
                          )}
                        </td>
                        <td className="text-slate-600 whitespace-nowrap text-xs">{formatPlanEkFaydaAuditLine(row.eklemeBy, row.eklemeTarih)}</td>
                        <td className="text-slate-600 whitespace-nowrap text-xs">{formatPlanEkFaydaAuditLine(row.guncelBy, row.guncelTarih)}</td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={EK_FAYDA_PLAN_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'edit') openEkFaydaModalEdit(r)
                              if (key === 'delete') {
                                if (!window.confirm('Kayıt silinsin mi?')) return
                                setEkFaydaRows((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {filteredEkFayda.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center text-slate-500 py-8">
                          {ekFaydaSearch ? 'Arama sonucu bulunamadı.' : 'Kayıt yok.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeMenu === 'satisKanali' ? (
            <div className="max-w-6xl">
              <h3 className="text-sm font-semibold text-violet-700 mb-4">Satış Kanalı</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara..."
                    value={satisKanaliSearch}
                    onChange={(e) => setSatisKanaliSearch(e.target.value)}
                  />
                </div>
                <div className="sm:ml-auto">
                  <PrimaryButton onClick={openSatisKanaliModalNew} className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="w-4 h-4" /> Yeni Ekle
                  </PrimaryButton>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[860px]">
                  <thead>
                    <tr>
                      <th>Kanal Kodu</th>
                      <th>Kanal Adı</th>
                      <th className="text-right whitespace-nowrap">Satış Adedi</th>
                      <th className="whitespace-nowrap">Başlangıç Tarihi</th>
                      <th className="whitespace-nowrap">Bitiş Tarihi</th>
                      <th>Sözleşme Basımı</th>
                      <th className="text-right w-24">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSatisKanali.map((row) => (
                      <tr key={row.id}>
                        <td className="tabular-nums">{row.kanalKodu}</td>
                        <td>{row.kanalAdi}</td>
                        <td className="text-right tabular-nums">{row.satisAdedi}</td>
                        <td>{formatIsoToTrDate(row.baslangic)}</td>
                        <td>{formatIsoToTrDate(row.bitis)}</td>
                        <td>
                          {row.sozlesmeBasimi === 'Evet' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200">
                              Evet
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border bg-sky-50 text-sky-800 border-sky-200">
                              Hayır
                            </span>
                          )}
                        </td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={SATIS_KANALI_PLAN_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'edit') openSatisKanaliModalEdit(r)
                              if (key === 'delete') {
                                if (!window.confirm('Kayıt silinsin mi?')) return
                                setSatisKanaliRows((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {filteredSatisKanali.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-slate-500 py-8">
                          {satisKanaliSearch ? 'Arama sonucu bulunamadı.' : 'Kayıt yok.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeMenu === 'degisiklik' ? (
            <div className="max-w-6xl">
              <h3 className="text-sm font-semibold text-violet-700 mb-4">Değişiklik Tanımları</h3>
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara..."
                    value={degisiklikSearch}
                    onChange={(e) => setDegisiklikSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                  <OutlineButton
                    type="button"
                    onClick={openDegisiklikEkleModal}
                    className="border-violet-300 text-violet-700 hover:bg-violet-50"
                  >
                    <Plus className="w-4 h-4" /> Yeni Ekle
                  </OutlineButton>
                  <PrimaryButton
                    type="button"
                    disabled={!degisiklikKanalSecimiAktif}
                    onClick={openDegisiklikKanalModal}
                    className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Link2 className="w-4 h-4" /> Kanal Bağla
                  </PrimaryButton>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[900px]">
                  <thead>
                    <tr>
                      <th className="w-10">
                        {(() => {
                          const ids = filteredDegisiklik.map((r) => r.id)
                          const allOn = ids.length > 0 && ids.every((id) => degisiklikSelectedIds.includes(id))
                          const someOn = ids.some((id) => degisiklikSelectedIds.includes(id)) && !allOn
                          return (
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-violet-600"
                              checked={allOn}
                              ref={(el) => {
                                if (el) el.indeterminate = someOn
                              }}
                              onChange={toggleDegisiklikSelectAllFiltered}
                              aria-label="Tümünü seç"
                            />
                          )
                        })()}
                      </th>
                      <th>Değişiklik Kodu</th>
                      <th>Değişiklik Adı</th>
                      <th className="whitespace-nowrap">Değişiklik Adedi</th>
                      <th className="whitespace-nowrap">Ekleme</th>
                      <th className="whitespace-nowrap">Güncelleme</th>
                      <th className="text-right w-24">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDegisiklik.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-violet-600"
                            checked={degisiklikSelectedIds.includes(row.id)}
                            onChange={() => toggleDegisiklikRowSelect(row.id)}
                            aria-label="Satır seç"
                          />
                        </td>
                        <td className="font-medium text-slate-800">{row.degisiklikKodu}</td>
                        <td>{row.degisiklikAdi}</td>
                        <td>
                          {degisiklikAdetEditing === row.id ? (
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                className="w-20 h-9 border border-violet-300 rounded-md px-2 text-sm tabular-nums"
                                value={degisiklikAdetDraft}
                                autoFocus
                                onChange={(e) => setDegisiklikAdetDraft(e.target.value)}
                                onBlur={() => commitDegisiklikAdet(row.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') commitDegisiklikAdet(row.id)
                                  if (e.key === 'Escape') setDegisiklikAdetEditing(null)
                                }}
                              />
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-2 tabular-nums">
                              {row.degisiklikAdedi}
                              <button
                                type="button"
                                className="p-1 rounded text-violet-600 hover:bg-violet-50"
                                aria-label="Değişiklik adedi düzenle"
                                onClick={() => {
                                  setDegisiklikAdetEditing(row.id)
                                  setDegisiklikAdetDraft(String(row.degisiklikAdedi))
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </span>
                          )}
                        </td>
                        <td className="text-slate-600 whitespace-nowrap text-xs">{formatPlanEkFaydaAuditLine(row.eklemeBy, row.eklemeTarih)}</td>
                        <td className="text-slate-600 whitespace-nowrap text-xs">{formatPlanEkFaydaAuditLine(row.guncelBy, row.guncelTarih)}</td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={DEGISIKLIK_PLAN_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'cikar') {
                                if (!window.confirm('Satır plandan çıkarılsın mı?')) return
                                setDegisiklikRows((prev) => prev.filter((x) => x.id !== r.id))
                                setDegisiklikSelectedIds((prev) => prev.filter((id) => id !== r.id))
                              }
                              if (key === 'bagliKanallar') setBagliKanallarModalRow(r)
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {filteredDegisiklik.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-slate-500 py-8">
                          {degisiklikSearch ? 'Arama sonucu bulunamadı.' : 'Kayıt yok.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>Listelenen: {filteredDegisiklik.length}</span>
                <span className="text-slate-400">Sayfa başına: 10</span>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700 mb-1">{DIGER_TANIMLAR_MENU.find((m) => m.id === activeMenu)?.label}</p>
              <p>Bu modülün ekranı yakında eklenecek.</p>
            </div>
          )}
        </main>
      </div>

      <Modal
        open={satisKanaliModalOpen}
        onClose={() => setSatisKanaliModalOpen(false)}
        title={satisKanaliEditingId ? 'Satış Kanalı Güncelle' : 'Satış Kanalı Ekle'}
        footer={
          <>
            <OutlineButton type="button" onClick={() => setSatisKanaliModalOpen(false)} className="border-violet-300 text-violet-700 hover:bg-violet-50">
              İptal
            </OutlineButton>
            <PrimaryButton type="button" onClick={saveSatisKanaliModal} className="bg-violet-600 hover:bg-violet-700">
              Kaydet
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <span className="block text-xs font-medium text-slate-600 mb-1">Kanal</span>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                className="form-input flex-1 cursor-pointer"
                placeholder="Seçiniz"
                value={satisKanaliForm.kanalKodu ? `${satisKanaliForm.kanalKodu} — ${satisKanaliForm.kanalAdi}` : ''}
                onClick={() => setSatisKanaliPickerOpen(true)}
              />
              <button
                type="button"
                className="shrink-0 h-10 w-10 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600"
                aria-label="Satış kanalı listesi"
                onClick={() => setSatisKanaliPickerOpen(true)}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">
                Başlangıç Tarihi <span className="text-red-500">*</span>
              </span>
              <input
                type="date"
                className="form-input"
                value={satisKanaliForm.baslangic}
                onChange={(e) => setSatisKanaliForm((f) => ({ ...f, baslangic: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Bitiş Tarihi</span>
              <input
                type="date"
                className="form-input"
                value={satisKanaliForm.bitis}
                onChange={(e) => setSatisKanaliForm((f) => ({ ...f, bitis: e.target.value }))}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
                Satış Adedi
                <span title="Bu kanal için planda tanımlanan satış adedi." className="text-slate-400 cursor-help">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </span>
              <input
                type="text"
                inputMode="decimal"
                className="form-input tabular-nums"
                placeholder="0"
                value={satisKanaliForm.satisAdedi}
                onChange={(e) => setSatisKanaliForm((f) => ({ ...f, satisAdedi: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
                Sözleşme Basımı
                <span title="Bu kanalda sözleşme basımı yapılıp yapılmayacağı." className="text-slate-400 cursor-help">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </span>
              <select
                className="form-select"
                value={satisKanaliForm.sozlesmeBasimi}
                onChange={(e) => setSatisKanaliForm((f) => ({ ...f, sozlesmeBasimi: e.target.value }))}
              >
                <option value="Hayır">Hayır</option>
                <option value="Evet">Evet</option>
              </select>
            </label>
          </div>
        </div>
      </Modal>

      <Modal
        open={satisKanaliPickerOpen}
        onClose={() => setSatisKanaliPickerOpen(false)}
        size="lg"
        title="Satış Kanalı Listesi"
        description="Seçmek için satıra çift tıklayın."
        footer={<OutlineButton type="button" onClick={() => setSatisKanaliPickerOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="rounded-lg border border-slate-200 overflow-x-auto max-h-[55vh]">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-slate-100 text-slate-700 sticky top-0">
              <tr>
                <th className="text-left font-semibold px-3 py-2.5">Kanal Kodu</th>
                <th className="text-left font-semibold px-3 py-2.5">Kanal Adı</th>
                <th className="text-left font-semibold px-3 py-2.5">Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {satisKanaliTanimlari.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-slate-100 hover:bg-violet-50/50 cursor-pointer"
                  onDoubleClick={() => pickSatisKanaliTanim(t)}
                >
                  <td className="px-3 py-2 tabular-nums">{t.kanalKodu}</td>
                  <td className="px-3 py-2">{t.kanalAdi}</td>
                  <td className="px-3 py-2 text-slate-700">{t.aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        open={degisiklikEkleModalOpen}
        onClose={() => setDegisiklikEkleModalOpen(false)}
        size="xl"
        title="Planda Yapılabilecek Değişiklik Tanımı Ekle"
        footer={
          <>
            <OutlineButton type="button" onClick={() => setDegisiklikEkleModalOpen(false)}>İptal</OutlineButton>
            <PrimaryButton type="button" onClick={applyDegisiklikModalSec} className="bg-violet-600 hover:bg-violet-700">
              Seç
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Değişiklik adı veya tipi ile ara..."
              value={degisiklikModalSearch}
              onChange={(e) => setDegisiklikModalSearch(e.target.value)}
            />
          </div>
          <div className="rounded-lg border border-slate-200 overflow-x-auto max-h-[50vh]">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="text-left font-semibold px-2 py-2 w-12">Seç</th>
                  <th className="text-left font-semibold px-2 py-2">Branş Kodu</th>
                  <th className="text-left font-semibold px-2 py-2">Branş</th>
                  <th className="text-left font-semibold px-2 py-2">Zeyil Kodu</th>
                  <th className="text-left font-semibold px-2 py-2 min-w-[180px]">Zeyil Adı</th>
                  <th className="text-right font-semibold px-2 py-2 whitespace-nowrap">Yılda Kaç Kez Yapılabilir?</th>
                </tr>
              </thead>
              <tbody>
                {filteredDegisiklikTipleriModal.map((tip) => (
                  <tr
                    key={tip.id}
                    className="border-t border-slate-100 hover:bg-violet-50/40 cursor-pointer"
                    onDoubleClick={() => toggleDegisiklikModalSec(tip.id)}
                  >
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-violet-600"
                        checked={degisiklikModalSecIds.includes(tip.id)}
                        onChange={() => toggleDegisiklikModalSec(tip.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-2 py-2">{tip.brans}</td>
                    <td className="px-2 py-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {tip.brans}
                      </span>
                    </td>
                    <td className="px-2 py-2 tabular-nums">{tip.zeyilKodu}</td>
                    <td className="px-2 py-2">{degisiklikPlanAdiTr(tip)}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{tip.yilLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500">Çift tıklama ile seçim kutusunu işaretleyebilirsiniz.</p>
        </div>
      </Modal>

      <Modal
        open={degisiklikKanalModalOpen}
        onClose={() => setDegisiklikKanalModalOpen(false)}
        title="Satış Kanalları"
        footer={
          <>
            <OutlineButton type="button" onClick={() => setDegisiklikKanalModalOpen(false)}>İptal</OutlineButton>
            <PrimaryButton type="button" onClick={saveDegisiklikKanalModal} className="bg-violet-600 hover:bg-violet-700">
              Kaydet
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-violet-600"
              checked={kanalModalHepsi}
              onChange={(e) => {
                setKanalModalHepsi(e.target.checked)
                if (e.target.checked) setKanalModalKodSec({})
              }}
            />
            Tüm Satış Kanalları (Hepsi)
          </label>
          <div className={`space-y-2 pl-1 border-t border-slate-100 pt-3 ${kanalModalHepsi ? 'opacity-50 pointer-events-none' : ''}`}>
            {satisKanaliTanimlari.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-violet-600"
                  disabled={kanalModalHepsi}
                  checked={!!kanalModalKodSec[c.kanalKodu]}
                  onChange={(e) =>
                    setKanalModalKodSec((prev) => ({
                      ...prev,
                      [c.kanalKodu]: e.target.checked,
                    }))
                  }
                />
                {c.kanalAdi}
              </label>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={!!bagliKanallarModalRow}
        onClose={() => setBagliKanallarModalRow(null)}
        title="Bağlı Kanallar"
        footer={<OutlineButton type="button" onClick={() => setBagliKanallarModalRow(null)}>Kapat</OutlineButton>}
      >
        {bagliKanallarModalRow && (
          <div className="text-sm text-slate-700 space-y-2">
            <p>
              <span className="text-slate-500">Değişiklik: </span>
              <span className="font-medium">{bagliKanallarModalRow.degisiklikKodu} — {bagliKanallarModalRow.degisiklikAdi}</span>
            </p>
            {bagliKanallarModalRow.bagliKanallar?.hepsi ? (
              <p>Tüm satış kanalları</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {(bagliKanallarModalRow.bagliKanallar?.kanalKodlari || []).length === 0 ? (
                  <li className="text-slate-500">Kanal tanımlı değil</li>
                ) : (
                  bagliKanallarModalRow.bagliKanallar.kanalKodlari.map((k) => {
                    const c = satisKanaliTanimlari.find((x) => x.kanalKodu === k)
                    return (
                      <li key={k}>{c ? `${c.kanalAdi} (${k})` : k}</li>
                    )
                  })
                )}
              </ul>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={ekFaydaModalOpen}
        onClose={() => setEkFaydaModalOpen(false)}
        title={ekFaydaEditingId ? 'Ek Fayda Güncelle' : 'Ek Fayda Ekle'}
        footer={
          <>
            <OutlineButton type="button" onClick={() => setEkFaydaModalOpen(false)}>İptal</OutlineButton>
            <PrimaryButton type="button" onClick={saveEkFaydaModal} className="bg-violet-600 hover:bg-violet-700">Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-slate-600 mb-1">Ek Fayda No</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  className="form-input flex-1 cursor-pointer"
                  placeholder="Seçiniz"
                  value={ekFaydaForm.katalogNo}
                  onClick={() => setEkFaydaPickerOpen(true)}
                />
                <button
                  type="button"
                  className="shrink-0 h-10 w-10 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600"
                  aria-label="Ek fayda tanımlarında ara"
                  onClick={() => setEkFaydaPickerOpen(true)}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Revizyon No</span>
              <input type="text" className="form-input bg-slate-50" disabled value={ekFaydaForm.revizyonNu} />
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">Açıklama</span>
            <textarea className="form-input min-h-[88px] resize-y bg-slate-50" disabled rows={4} value={ekFaydaForm.aciklama} readOnly />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Durum</span>
              <select
                className="form-select"
                value={ekFaydaForm.durum}
                onChange={(e) => setEkFaydaForm((f) => ({ ...f, durum: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 mb-1">Gruba Özel</span>
              <input type="text" className="form-input bg-slate-50" disabled value={ekFaydaForm.grubaOzel} />
            </label>
          </div>
        </div>
      </Modal>

      <Modal
        open={ekFaydaPickerOpen}
        onClose={() => setEkFaydaPickerOpen(false)}
        size="xl"
        title="Ek Fayda Tanımları"
        description="Kayıt seçmek için satıra çift tıklayın."
        footer={<OutlineButton type="button" onClick={() => setEkFaydaPickerOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="rounded-lg border border-slate-200 overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10">
              <tr>
                <th className="text-left font-semibold px-2 py-2">Ek Fayda No</th>
                <th className="text-left font-semibold px-2 py-2">Resmi Ek Fayda No</th>
                <th className="text-left font-semibold px-2 py-2">Ek Fayda Tipi</th>
                <th className="text-left font-semibold px-2 py-2">Esas Ek Fayda</th>
                <th className="text-left font-semibold px-2 py-2 min-w-[200px]">Açıklama</th>
                <th className="text-left font-semibold px-2 py-2">Maliyeti Karşılayan Taraf</th>
                <th className="text-left font-semibold px-2 py-2">Ek Fayda İade Tipi</th>
                <th className="text-left font-semibold px-2 py-2">İlgili Firma</th>
                <th className="text-left font-semibold px-2 py-2">Teşvikli Ek Fayda</th>
                <th className="text-left font-semibold px-2 py-2">Ödeme</th>
              </tr>
            </thead>
            <tbody>
              {ekFaydaTanimlari.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-slate-100 hover:bg-violet-50/40 cursor-pointer"
                  onDoubleClick={() => pickEkFaydaTanim(t)}
                >
                  <td className="px-2 py-2 tabular-nums">{t.ekFaydaNo}</td>
                  <td className="px-2 py-2 tabular-nums">{t.resmiEkFaydaNo}</td>
                  <td className="px-2 py-2">{t.ekFaydaTipi}</td>
                  <td className="px-2 py-2">{t.esasEkFayda}</td>
                  <td className="px-2 py-2">{t.aciklama}</td>
                  <td className="px-2 py-2">{t.maliyetTarafi}</td>
                  <td className="px-2 py-2">{t.iadeTipi}</td>
                  <td className="px-2 py-2">{t.ilgiliFirma}</td>
                  <td className="px-2 py-2">{t.tesvikliEkFayda}</td>
                  <td className="px-2 py-2">{t.odeme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        open={endeksModalOpen}
        onClose={() => setEndeksModalOpen(false)}
        title={endeksEditingId ? 'Endeks Tanımları Güncelle' : 'Endeks Tanımları Ekle'}
        footer={
          <>
            <OutlineButton type="button" onClick={() => setEndeksModalOpen(false)}>Vazgeç</OutlineButton>
            <PrimaryButton type="button" onClick={saveEndeksModal} className="bg-violet-600 hover:bg-violet-700">Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Tip <span className="text-red-500">*</span>
            </span>
            <select
              className="form-select"
              value={endeksForm.hesapKodu}
              onChange={(e) => setEndeksForm((f) => ({ ...f, hesapKodu: e.target.value }))}
            >
              <option value="">Seçiniz...</option>
              {katkiPayiHesaplama.map((h) => (
                <option key={h.id} value={String(h.hesapKodu)}>
                  {h.hesapAdi} ({h.hesapKodu})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">Artış tipi</span>
            <select
              className="form-select"
              value={endeksForm.artisTipi}
              onChange={(e) => setEndeksForm((f) => ({ ...f, artisTipi: e.target.value, artisDonemi: '' }))}
            >
              <option value="">Seçiniz...</option>
              <option value="Ay">Ay</option>
              <option value="Dönem">Dönem</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">Artış dönemi</span>
            <select
              className="form-select"
              value={endeksForm.artisDonemi}
              onChange={(e) => setEndeksForm((f) => ({ ...f, artisDonemi: e.target.value }))}
              disabled={!endeksForm.artisTipi}
            >
              <option value="">Seçiniz...</option>
              {endeksForm.artisTipi === 'Ay' &&
                TURKCE_AYLAR.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              {endeksForm.artisTipi === 'Dönem' &&
                odemeDonemiTurleri.map((o) => (
                  <option key={o.id} value={String(o.id)}>{o.aciklama}</option>
                ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">Ekstra artış oranı</span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input"
              placeholder="0.00"
              value={endeksForm.ekstraOran}
              onChange={(e) => setEndeksForm((f) => ({ ...f, ekstraOran: e.target.value }))}
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={istisnaModalOpen}
        onClose={() => setIstisnaModalOpen(false)}
        title={istisnaEditingId ? 'İstisna Planlar Güncelle' : 'İstisna Planlar Ekle'}
        footer={
          <>
            <OutlineButton type="button" onClick={() => setIstisnaModalOpen(false)}>Vazgeç</OutlineButton>
            <PrimaryButton type="button" onClick={saveIstisnaModal}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">LOOKUP</span>
              <span className="text-xs font-medium text-slate-700">
                Geçiş Yapılamayacak Planlar <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative">
              <select
                className="form-select w-full appearance-none pr-10"
                value={istisnaForm.planId}
                onChange={(e) => setIstisnaForm((f) => ({ ...f, planId: e.target.value }))}
              >
                <option value="">Plan seçiniz...</option>
                {planLookupOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.ad}</option>
                ))}
              </select>
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Başlangıç Tarihi <span className="text-red-500">*</span>
            </span>
            <input
              type="date"
              className="form-input"
              value={istisnaForm.baslangic}
              onChange={(e) => setIstisnaForm((f) => ({ ...f, baslangic: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">Bitiş Tarihi</span>
            <input
              type="date"
              className="form-input"
              value={istisnaForm.bitis}
              onChange={(e) => setIstisnaForm((f) => ({ ...f, bitis: e.target.value }))}
            />
          </label>
        </div>
      </Modal>
    </div>
  )
}

function EgpDetaySubmenuIcon({ menuId }) {
  if (menuId === 'genel') return <SlidersHorizontal className="w-4 h-4 shrink-0 opacity-80" />
  if (menuId === 'geriOdeme') return <RefreshCw className="w-4 h-4 shrink-0 opacity-80" />
  return <Calendar className="w-4 h-4 shrink-0 opacity-80" />
}

/** EGP planı — Detay Parametreleri (Genel / Geri ödeme / Ara ödeme) */
function EgpDetayParametreleriScreen({ plan, urun, onBack }) {
  const [activeTab, setActiveTab] = useState('genel')
  const [genelRows, setGenelRows] = useState(() => [
    { id: 'pegp-1', gecerlilikTarihi: '2025-01-01', dovizKodu: 'TRL', bireyTipiKod: 'FP', minBirikim: '50000', endeksYil: 1, endeksHesapKodu: '2' },
    { id: 'pegp-2', gecerlilikTarihi: '2024-06-01', dovizKodu: 'USD', bireyTipiKod: 'FP', minBirikim: '30000', endeksYil: 2, endeksHesapKodu: '1' },
    { id: 'pegp-3', gecerlilikTarihi: '2024-01-01', dovizKodu: 'TRL', bireyTipiKod: 'C', minBirikim: '10000', endeksYil: 1, endeksHesapKodu: '2' },
  ])
  /** EGP şablon seçici: genel / geri ödeme / ara ödeme */
  const [egpTemplatePicker, setEgpTemplatePicker] = useState({ open: false, kind: null })

  const [geriOdemeRows, setGeriOdemeRows] = useState(() => [
    { id: 'ego-1', tanimAdi: 'Sureye Bagli', sureAlt: 5, sureUst: 10, tutarAlt: 10000, tutarUst: 500000, oranUst: 80, faiz: 5.5 },
    { id: 'ego-2', tanimAdi: 'Tutara Bagli', sureAlt: 3, sureUst: 15, tutarAlt: 5000, tutarUst: 100000, oranUst: 70, faiz: 4.2 },
    { id: 'ego-3', tanimAdi: 'Kira', sureAlt: 1, sureUst: 20, tutarAlt: 15000, tutarUst: 250000, oranUst: 90, faiz: 6.0 },
    { id: 'ego-4', tanimAdi: 'Faiz', sureAlt: 2, sureUst: 12, tutarAlt: 20000, tutarUst: 300000, oranUst: 75, faiz: 5.0 },
  ])
  const [geriOdemeModalOpen, setGeriOdemeModalOpen] = useState(false)
  const [geriOdemeEditingId, setGeriOdemeEditingId] = useState(null)
  const [geriOdemeForm, setGeriOdemeForm] = useState(() => ({ ...EGP_GERI_ODEME_FORM_DEFAULT }))

  const subtitle = `${plan?.id || '-'} • ${branchLabelFromUrun(urun)} • ${toHeaderIsoDate(plan?.tarih)}`

  const openEgpTemplatePicker = (kind) => {
    setEgpTemplatePicker({ open: true, kind })
  }

  const closeEgpTemplatePicker = () => {
    setEgpTemplatePicker({ open: false, kind: null })
  }

  const applyEgpGenelTemplate = (tpl) => {
    const yil = Number(String(tpl.kacYil).trim())
    if (Number.isNaN(yil)) return
    setGenelRows((prev) => [
      ...prev,
      {
        id: `pegp-tpl-${tpl.id}-${Date.now()}`,
        gecerlilikTarihi: parseDdMmYyyyToIso(tpl.tarih),
        dovizKodu: tpl.doviz,
        bireyTipiKod: mapEgpGenelBireyTipiToKod(tpl.bireyTipi),
        minBirikim: String(tpl.minBirikim).replace(/\s/g, ''),
        endeksYil: yil,
        endeksHesapKodu: mapEgpGenelEndeksTipiToHesapKodu(tpl.endeksTipi),
      },
    ])
    closeEgpTemplatePicker()
  }

  const applyEgpGeriOdemeTemplate = (tpl) => {
    setGeriOdemeRows((prev) => [
      ...prev,
      {
        id: `ego-tpl-${tpl.id}-${Date.now()}`,
        tanimAdi: geriOdemeTanimAdiFromTemplateTip(tpl.tip),
        sureAlt: Number(tpl.sureAlt),
        sureUst: Number(tpl.sureUst),
        tutarAlt: Number(tpl.tutarAlt),
        tutarUst: Number(tpl.tutarUst),
        oranUst: Number(tpl.oranUst),
        faiz: Number(tpl.faiz),
      },
    ])
    closeEgpTemplatePicker()
  }

  const applyEgpAraOdemeTemplate = (tpl) => {
    setAraOdemeRows((prev) => [
      ...prev,
      {
        id: `eao-tpl-${tpl.id}-${Date.now()}`,
        sayiAlt: Number(tpl.sayiAlt),
        sayiUst: Number(tpl.sayiUst),
        tutarUst: Number(tpl.tutarUst),
        oranBirikim: Number(tpl.oranBirikim),
        oranMaas: Number(tpl.oranMaas),
      },
    ])
    closeEgpTemplatePicker()
  }

  const openGeriOdemeModalNew = () => {
    openEgpTemplatePicker('geriOdeme')
  }

  const clearGeriOdemeForm = () => {
    setGeriOdemeForm({ ...EGP_GERI_ODEME_FORM_DEFAULT })
  }

  const openGeriOdemeModalEdit = (row) => {
    setGeriOdemeEditingId(row.id)
    setGeriOdemeForm({
      tanimAdi: row.tanimAdi || '',
      sureAlt: String(row.sureAlt ?? ''),
      sureUst: String(row.sureUst ?? ''),
      tutarAlt: String(row.tutarAlt ?? ''),
      tutarUst: String(row.tutarUst ?? ''),
      oranUst: String(row.oranUst ?? ''),
      faiz: String(row.faiz ?? ''),
    })
    setGeriOdemeModalOpen(true)
  }

  const saveGeriOdemeModal = () => {
    if (!geriOdemeForm.tanimAdi) return alert('Geri ödeme tipi seçiniz.')
    const nums = ['sureAlt', 'sureUst', 'tutarAlt', 'tutarUst', 'oranUst', 'faiz']
    const parsed = {}
    for (const k of nums) {
      const raw = String(geriOdemeForm[k]).trim().replace(',', '.')
      if (raw === '' || Number.isNaN(Number(raw))) return alert('Tüm sayısal alanlar geçerli olmalıdır.')
      parsed[k] = Number(raw)
    }
    const payload = {
      id: geriOdemeEditingId || `ego-${Date.now()}`,
      tanimAdi: geriOdemeForm.tanimAdi,
      ...parsed,
    }
    if (geriOdemeEditingId) {
      setGeriOdemeRows((prev) => prev.map((r) => (r.id === geriOdemeEditingId ? payload : r)))
    } else {
      setGeriOdemeRows((prev) => [...prev, payload])
    }
    setGeriOdemeModalOpen(false)
  }

  const [araOdemeRows, setAraOdemeRows] = useState(() => [
    { id: 'eao-1', sayiAlt: 1, sayiUst: 10, tutarUst: 50000, oranBirikim: 30, oranMaas: 25 },
    { id: 'eao-2', sayiAlt: 2, sayiUst: 15, tutarUst: 75000, oranBirikim: 40, oranMaas: 35 },
    { id: 'eao-3', sayiAlt: 1, sayiUst: 5, tutarUst: 30000, oranBirikim: 20, oranMaas: 15 },
  ])
  const [araOdemeModalOpen, setAraOdemeModalOpen] = useState(false)
  const [araOdemeEditingId, setAraOdemeEditingId] = useState(null)
  const [araOdemeForm, setAraOdemeForm] = useState(() => ({ ...EGP_ARA_ODEME_FORM_DEFAULT }))

  const openAraOdemeModalNew = () => {
    openEgpTemplatePicker('araOdeme')
  }

  const openAraOdemeModalEdit = (row) => {
    setAraOdemeEditingId(row.id)
    setAraOdemeForm({
      sayiAlt: String(row.sayiAlt ?? ''),
      sayiUst: String(row.sayiUst ?? ''),
      tutarUst: String(row.tutarUst ?? ''),
      oranBirikim: String(row.oranBirikim ?? ''),
      oranMaas: String(row.oranMaas ?? ''),
    })
    setAraOdemeModalOpen(true)
  }

  const saveAraOdemeModal = () => {
    const keys = ['sayiAlt', 'sayiUst', 'tutarUst', 'oranBirikim', 'oranMaas']
    const parsed = {}
    for (const k of keys) {
      const raw = String(araOdemeForm[k]).trim().replace(',', '.')
      if (raw === '' || Number.isNaN(Number(raw))) return alert('Tüm alanlar geçerli sayı olmalıdır.')
      parsed[k] = Number(raw)
    }
    const payload = {
      id: araOdemeEditingId || `eao-${Date.now()}`,
      ...parsed,
    }
    if (araOdemeEditingId) {
      setAraOdemeRows((prev) => prev.map((r) => (r.id === araOdemeEditingId ? payload : r)))
    } else {
      setAraOdemeRows((prev) => [...prev, payload])
    }
    setAraOdemeModalOpen(false)
  }

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <button type="button" onClick={onBack} className="mt-1 text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-md hover:bg-slate-100 shrink-0" aria-label="Geri">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 truncate">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold shrink-0">Taslak</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          </div>
        </div>
        <PlanHeaderProgressRing pct={20} stepText="2/6" />
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-auto">
          <div className="px-3 py-3 border-b border-slate-100 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 p-0.5 rounded-md hover:bg-slate-100 -ml-0.5" aria-label="Geri">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="truncate">EGP Detay Parametreleri</span>
          </div>
          <nav className="p-2 flex flex-col gap-0.5">
            {EGP_DETAY_SUBMENU.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 text-left text-sm px-3 py-2.5 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-violet-50 text-violet-900 font-medium border border-violet-100'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <EgpDetaySubmenuIcon menuId={item.id} />
                <span className="leading-snug">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === 'genel' ? (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-800">EGP Genel Parametreler</h3>
                <PrimaryButton onClick={() => openEgpTemplatePicker('genel')} className="bg-violet-600 hover:bg-violet-700">
                  <Link2 className="w-4 h-4" /> Template Bağla
                </PrimaryButton>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Geçerlilik Tarihi</th>
                      <th>Döviz Kodu</th>
                      <th>Birey Tipi</th>
                      <th>Minimum Birikim Tutarı</th>
                      <th className="min-w-[200px]">Minimum Birikim Tutarı Kaç Yılda Bir Endekslenecek?</th>
                      <th className="min-w-[140px]">Min. Birikim Tutarı Endeks Tipi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genelRows.map((row) => (
                      <tr key={row.id}>
                        <td>{formatIsoToTrDate(row.gecerlilikTarihi)}</td>
                        <td>{row.dovizKodu}</td>
                        <td>{egpBireyTipiLabel(row.bireyTipiKod)}</td>
                        <td className="text-right tabular-nums">{Number(row.minBirikim).toLocaleString('tr-TR')}</td>
                        <td className="text-center">{row.endeksYil}</td>
                        <td>{katkiPayiHesaplamaEndeksLabel(row.endeksHesapKodu)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Kayıt Göster</span>
                  <select className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white" defaultValue={10}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
                <span>
                  1-{genelRows.length} / {genelRows.length}
                </span>
              </div>
            </div>
          ) : activeTab === 'geriOdeme' ? (
            <div className="max-w-[1100px]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Geri Ödeme Tipleri</h3>
                <PrimaryButton onClick={openGeriOdemeModalNew} className="bg-blue-600 hover:bg-blue-700">
                  <Link2 className="w-4 h-4" /> Template Bağla
                </PrimaryButton>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[960px]">
                  <thead>
                    <tr>
                      <th>Geri Ödeme Tipi</th>
                      <th className="text-right whitespace-nowrap">Geri Ödeme Süresi(Yıl) Alt Limiti</th>
                      <th className="text-right whitespace-nowrap">Geri Ödeme Süresi(Yıl) Üst Limiti</th>
                      <th className="text-right whitespace-nowrap">Alt Limit Geri Ödeme Tutarı</th>
                      <th className="text-right whitespace-nowrap">Üst Limit Geri Ödeme Tutarı</th>
                      <th className="text-right whitespace-nowrap">Geri Ödeme Oranı Üst Limiti</th>
                      <th className="text-right whitespace-nowrap">Faiz Oran</th>
                      <th className="text-right w-24">Liste İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geriOdemeRows.map((row) => (
                      <tr key={row.id}>
                        <td>{formatEgpGeriOdemeTipEtiket(row.tanimAdi)}</td>
                        <td className="text-right tabular-nums">{row.sureAlt}</td>
                        <td className="text-right tabular-nums">{row.sureUst}</td>
                        <td className="text-right tabular-nums">{Number(row.tutarAlt).toLocaleString('tr-TR')}</td>
                        <td className="text-right tabular-nums">{Number(row.tutarUst).toLocaleString('tr-TR')}</td>
                        <td className="text-right tabular-nums">{row.oranUst}</td>
                        <td className="text-right tabular-nums">{Number(row.faiz).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={EGP_GERI_ODEME_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'edit') openGeriOdemeModalEdit(r)
                              if (key === 'delete') {
                                if (!window.confirm('Kayıt silinsin mi?')) return
                                setGeriOdemeRows((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Kayıt Göster</span>
                  <select className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white" defaultValue={10}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
                <span>
                  1-{geriOdemeRows.length} / {geriOdemeRows.length}
                </span>
              </div>
            </div>
          ) : activeTab === 'araOdeme' ? (
            <div className="max-w-[1000px]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Ara Ödeme Parametreleri</h3>
                <PrimaryButton onClick={openAraOdemeModalNew} className="bg-blue-600 hover:bg-blue-700">
                  <Link2 className="w-4 h-4" /> Template Bağla
                </PrimaryButton>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full grid-table text-sm min-w-[880px]">
                  <thead>
                    <tr>
                      <th className="text-right whitespace-nowrap">Ara Ödeme Sayısı Alt Limiti</th>
                      <th className="text-right whitespace-nowrap">Ara Ödeme Sayısı Üst Limiti</th>
                      <th className="text-right whitespace-nowrap">Ara Ödeme Tutarı Üst Limiti</th>
                      <th className="text-right whitespace-nowrap min-w-[180px]">Üst Limit Ara Ödeme Oranı(Birikim)</th>
                      <th className="text-right whitespace-nowrap min-w-[200px]">Üst Limit Ara Ödeme Oranı (Yıllık Maaş)</th>
                      <th className="text-right w-28 whitespace-nowrap">Liste İşlemi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {araOdemeRows.map((row) => (
                      <tr key={row.id}>
                        <td className="text-right tabular-nums">{row.sayiAlt}</td>
                        <td className="text-right tabular-nums">{row.sayiUst}</td>
                        <td className="text-right tabular-nums">{Number(row.tutarUst).toLocaleString('tr-TR')}</td>
                        <td className="text-right tabular-nums">{row.oranBirikim}</td>
                        <td className="text-right tabular-nums">{row.oranMaas}</td>
                        <td className="text-right">
                          <RowActions
                            row={row}
                            actions={EGP_ARA_ODEME_ROW_ACTIONS}
                            onAction={(key, r) => {
                              if (key === 'edit') openAraOdemeModalEdit(r)
                              if (key === 'delete') {
                                if (!window.confirm('Kayıt silinsin mi?')) return
                                setAraOdemeRows((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Kayıt Göster</span>
                  <select className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white" defaultValue={10}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
                <span>
                  1-{araOdemeRows.length} / {araOdemeRows.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700 mb-1">{EGP_DETAY_SUBMENU.find((m) => m.id === activeTab)?.label}</p>
              <p>Bu bölümün ekranı yakında eklenecek.</p>
            </div>
          )}
        </main>
      </div>

      <Modal
        open={egpTemplatePicker.open}
        onClose={closeEgpTemplatePicker}
        size="xl"
        title="Template Bağla"
        description="Plana eklemek istediğiniz şablon satırına çift tıklayın."
        footer={<OutlineButton type="button" onClick={closeEgpTemplatePicker}>Kapat</OutlineButton>}
      >
        {egpTemplatePicker.kind === 'genel' && (
          <div className="rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="text-left font-semibold px-3 py-2.5">EGP Parametre Kodu</th>
                  <th className="text-left font-semibold px-3 py-2.5">EGP Parametre Adı</th>
                  <th className="text-left font-semibold px-3 py-2.5">Versiyon</th>
                  <th className="text-left font-semibold px-3 py-2.5">Döviz Kodu</th>
                  <th className="text-left font-semibold px-3 py-2.5">Birey Tipi</th>
                  <th className="text-right font-semibold px-3 py-2.5">Minimum Birikim Tutarı</th>
                  <th className="text-right font-semibold px-3 py-2.5">Endekslem Frekansı</th>
                </tr>
              </thead>
              <tbody>
                {egpGenel.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-violet-50/50 cursor-pointer"
                    onDoubleClick={() => applyEgpGenelTemplate(row)}
                  >
                    <td className="px-3 py-2 text-slate-800">{row.kod}</td>
                    <td className="px-3 py-2 text-slate-800">{row.ad}</td>
                    <td className="px-3 py-2 tabular-nums">{row.versiyon}</td>
                    <td className="px-3 py-2">{row.doviz}</td>
                    <td className="px-3 py-2">{row.bireyTipi}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{Number(String(row.minBirikim).replace(/\s/g, '')).toLocaleString('tr-TR')}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.kacYil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {egpTemplatePicker.kind === 'geriOdeme' && (
          <div className="rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[920px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="text-left font-semibold px-3 py-2.5">Geri Ödeme Kodu</th>
                  <th className="text-left font-semibold px-3 py-2.5">Geri Ödeme Adı</th>
                  <th className="text-left font-semibold px-3 py-2.5">Geri Ödeme Tipi</th>
                  <th className="text-left font-semibold px-3 py-2.5">Versiyon</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Geri Ödeme Süresi(Yıl) Alt Limiti</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Geri Ödeme Süresi(Yıl) Üst Limiti</th>
                </tr>
              </thead>
              <tbody>
                {egpGeriOdeme.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-violet-50/50 cursor-pointer"
                    onDoubleClick={() => applyEgpGeriOdemeTemplate(row)}
                  >
                    <td className="px-3 py-2 text-slate-800">{row.kod}</td>
                    <td className="px-3 py-2 text-slate-800">{row.ad}</td>
                    <td className="px-3 py-2">{row.tip}</td>
                    <td className="px-3 py-2 tabular-nums">{row.versiyon}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.sureAlt}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.sureUst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {egpTemplatePicker.kind === 'araOdeme' && (
          <div className="rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="text-left font-semibold px-3 py-2.5">Ara Ödeme Kodu</th>
                  <th className="text-left font-semibold px-3 py-2.5">Ara Ödeme Adı</th>
                  <th className="text-left font-semibold px-3 py-2.5">Versiyon</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Ara Ödeme Sayısı Alt Limiti</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Ara Ödeme Sayısı Üst Limiti</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Ara Ödeme Tutarı Üst Limiti</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Üst Limit Ara Ödeme Oranı Birikim</th>
                  <th className="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Üst Limit Ara Ödeme Oranı Yıllık Maaş</th>
                </tr>
              </thead>
              <tbody>
                {egpAraOdeme.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-violet-50/50 cursor-pointer"
                    onDoubleClick={() => applyEgpAraOdemeTemplate(row)}
                  >
                    <td className="px-3 py-2 text-slate-800">{row.kod}</td>
                    <td className="px-3 py-2 text-slate-800">{row.ad}</td>
                    <td className="px-3 py-2 tabular-nums">{row.versiyon}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.sayiAlt}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.sayiUst}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{Number(row.tutarUst).toLocaleString('tr-TR')}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.oranBirikim}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.oranMaas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        open={geriOdemeModalOpen}
        onClose={() => setGeriOdemeModalOpen(false)}
        title={geriOdemeEditingId ? 'Geri Ödeme Tipi Güncelle' : 'Yeni Geri Ödeme Tipi Ekle'}
        description={geriOdemeEditingId ? 'Geri ödeme tipi kaydını güncelleyin' : 'EGP için yeni geri ödeme tipi tanımlayın'}
        footer={
          <>
            <OutlineButton type="button" onClick={clearGeriOdemeForm}>TEMİZLE</OutlineButton>
            <PrimaryButton type="button" onClick={saveGeriOdemeModal} className="bg-violet-600 hover:bg-violet-700">
              <Save className="w-4 h-4" /> KAYDET
            </PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Geri Ödeme Tipi <span className="text-red-500">*</span>
            </span>
            <select
              className="form-select"
              value={geriOdemeForm.tanimAdi}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, tanimAdi: e.target.value }))}
            >
              <option value="">Seçiniz</option>
              {egpGeriOdemeTipleri.map((t) => (
                <option key={t.id} value={t.tanimAdi}>{formatEgpGeriOdemeTipEtiket(t.tanimAdi)}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Geri Ödeme Süresi(Yıl) Alt Limiti <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              min={0}
              className="form-input"
              value={geriOdemeForm.sureAlt}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, sureAlt: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Geri Ödeme Süresi(Yıl) Üst Limiti <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              min={0}
              className="form-input"
              value={geriOdemeForm.sureUst}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, sureUst: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Alt Limit Geri Ödeme Tutarı <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input"
              placeholder="0,00"
              value={geriOdemeForm.tutarAlt}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, tutarAlt: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Üst Limit Geri Ödeme Tutarı <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input"
              placeholder="0,00"
              value={geriOdemeForm.tutarUst}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, tutarUst: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Faiz Oran <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input"
              placeholder="0,00"
              value={geriOdemeForm.faiz}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, faiz: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Geri Ödeme Oranı Üst Limiti <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input"
              placeholder="0,00"
              value={geriOdemeForm.oranUst}
              onChange={(e) => setGeriOdemeForm((f) => ({ ...f, oranUst: e.target.value }))}
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={araOdemeModalOpen}
        onClose={() => setAraOdemeModalOpen(false)}
        title={araOdemeEditingId ? 'Ara Ödeme Parametresi Güncelle' : 'Ara Ödeme Parametresi Ekle'}
        description={araOdemeEditingId ? 'Ara ödeme parametresini güncelleyin' : 'EGP için yeni ara ödeme parametresi tanımlayın'}
        footer={
          <>
            <OutlineButton type="button" onClick={() => setAraOdemeModalOpen(false)}>İPTAL</OutlineButton>
            <PrimaryButton type="button" onClick={saveAraOdemeModal} className="bg-violet-600 hover:bg-violet-700">
              <Save className="w-4 h-4" /> KAYDET
            </PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Ara Ödeme Sayısı Alt Limiti <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              min={0}
              className="form-input"
              value={araOdemeForm.sayiAlt}
              onChange={(e) => setAraOdemeForm((f) => ({ ...f, sayiAlt: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Ara Ödeme Sayısı Üst Limiti <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              min={0}
              className="form-input"
              value={araOdemeForm.sayiUst}
              onChange={(e) => setAraOdemeForm((f) => ({ ...f, sayiUst: e.target.value }))}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Ara Ödeme Tutarı Üst Limiti <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input"
              placeholder="0,00"
              value={araOdemeForm.tutarUst}
              onChange={(e) => setAraOdemeForm((f) => ({ ...f, tutarUst: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Üst Limit Ara Ödeme Oranı (Yıllık Maaş) <span className="text-red-500">*</span>
            </span>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                className="form-input pr-9"
                placeholder="0,00"
                value={araOdemeForm.oranMaas}
                onChange={(e) => setAraOdemeForm((f) => ({ ...f, oranMaas: e.target.value }))}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">%</span>
            </div>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Üst Limit Ara Ödeme Oranı (Birikim) <span className="text-red-500">*</span>
            </span>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                className="form-input pr-9"
                placeholder="0,00"
                value={araOdemeForm.oranBirikim}
                onChange={(e) => setAraOdemeForm((f) => ({ ...f, oranBirikim: e.target.value }))}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">%</span>
            </div>
          </label>
        </div>
      </Modal>
    </div>
  )
}

function PlanBelgeleriScreen({ onBack, rows, onRowsChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    belgeTuru: '',
    belgeIcerigi: '',
    yuklemeTarihi: toInputDateValue(new Date().toISOString().slice(0, 10)),
  })
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  const openModal = () => {
    setForm({
      belgeTuru: '',
      belgeIcerigi: '',
      yuklemeTarihi: toInputDateValue(new Date().toISOString().slice(0, 10)),
    })
    setFile(null)
    setModalOpen(true)
  }

  const saveModal = () => {
    if (!form.belgeTuru) return alert('Belge türü seçiniz.')
    if (!form.belgeIcerigi.trim()) return alert('Belge içeriği giriniz.')
    if (!file) return alert('Dosya seçiniz.')
    const yukleme = formatIsoToTrDate(form.yuklemeTarihi)
    const row = {
      id: `belge-${Date.now()}`,
      belgeTuru: form.belgeTuru,
      belgeIcerigi: form.belgeIcerigi.trim(),
      dosyaAdi: file.name,
      yuklemeTarihi: yukleme,
    }
    onRowsChange((list) => [...(list || []), row])
    setModalOpen(false)
  }

  const removeRow = (id) => {
    if (!window.confirm('Belge silinsin mi?')) return
    onRowsChange((list) => (list || []).filter((r) => r.id !== id))
  }

  const pickFile = (f) => {
    if (f) setFile(f)
  }

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs text-slate-500 mb-4 flex flex-wrap items-center gap-1">
            <span>Ürün Yönetimi</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" aria-hidden />
            <span>Ürün Planları</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" aria-hidden />
            <span>Plan Detay Sayfası</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" aria-hidden />
            <span className="text-slate-700 font-medium">Plan Belgeleri</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onBack}
                className="shrink-0 w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 inline-flex items-center justify-center shadow-sm"
                aria-label="Geri"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-slate-900">Plan Belgeleri</h2>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Yeni Belge Ekle
            </button>
          </div>

          <div className="overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Belge Türü</th>
                  <th>Belge İçeriği</th>
                  <th>Dosya Adı</th>
                  <th>Yükleme Tarihi</th>
                  <th className="text-right w-36">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {(rows || []).length ? (
                  (rows || []).map((row) => (
                    <tr key={row.id}>
                      <td className="font-medium text-slate-800">{row.belgeTuru}</td>
                      <td className="text-slate-700 max-w-[220px] truncate" title={row.belgeIcerigi}>
                        {row.belgeIcerigi}
                      </td>
                      <td className="font-mono text-xs text-slate-600">{row.dosyaAdi}</td>
                      <td className="tabular-nums text-slate-700">{row.yuklemeTarihi}</td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-0.5 justify-end">
                          <button
                            type="button"
                            className="p-1.5 rounded-md text-violet-600 hover:bg-violet-50"
                            title="Görüntüle"
                            onClick={() =>
                              alert(`Önizleme: ${row.belgeIcerigi}\nDosya: ${row.dosyaAdi}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50"
                            title="İndir"
                            onClick={() => alert(`İndirme simülasyonu: ${row.dosyaAdi}`)}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                            title="Sil"
                            onClick={() => removeRow(row.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-500 py-10 text-sm">
                      Henüz belge eklenmedi. &quot;Yeni Belge Ekle&quot; ile kayıt oluşturabilirsiniz.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Plan Belgeleri"
        size="lg"
        footer={
          <>
            <OutlineButton onClick={() => setModalOpen(false)}>Vazgeç</OutlineButton>
            <PrimaryButton onClick={saveModal}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Belge Türü</span>
            <select
              className="form-input w-full"
              value={form.belgeTuru}
              onChange={(e) => setForm((f) => ({ ...f, belgeTuru: e.target.value }))}
            >
              <option value="">Seçiniz</option>
              {PLAN_BELGE_TURU_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Belge İçeriği</span>
            <textarea
              className="form-input w-full min-h-[100px] resize-y"
              placeholder="Belge içeriğini giriniz..."
              value={form.belgeIcerigi}
              onChange={(e) => setForm((f) => ({ ...f, belgeIcerigi: e.target.value }))}
            />
          </label>
          <div>
            <span className="block text-xs font-semibold text-slate-600 mb-1">Dosya</span>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                pickFile(e.dataTransfer.files?.[0])
              }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 rounded-lg py-10 px-4 text-center hover:border-violet-300 hover:bg-violet-50/30 transition cursor-pointer bg-slate-50/50"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm text-slate-600 font-medium">Sürükle Bırak veya Dosyadan Seç</div>
              {file ? <div className="text-xs text-violet-700 mt-2 font-medium">{file.name}</div> : null}
            </button>
          </div>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Yükleme Tarihi</span>
            <div className="relative">
              <input
                type="date"
                className="form-input w-full pr-10"
                value={form.yuklemeTarihi}
                onChange={(e) => setForm((f) => ({ ...f, yuklemeTarihi: e.target.value }))}
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </label>
        </div>
      </Modal>
    </div>
  )
}

const GRUP_GECERLI_SOZLESME_TURU_SECENEKLERI = [
  { kod: 'IGES', label: 'İGES' },
  { kod: 'GBB', label: 'GBB' },
]

/** BES plan özellik flag görünürlüğü — sözleşme tipine göre (Ferdi / Grup / OKS / EGP) */
function planOzellikVisibility(sozlesmeTipi) {
  const tip = sozlesmeTipiUpper(sozlesmeTipi || 'Ferdi')
  return {
    vatandaslik: tip === 'FERDI',
    aktarimaOzel: true,
    mesafeliSatis: true,
    befas: !isEgpLikeSozlesmeTipi(tip),
    vakifAktarim: !isOksOnlySozlesmeTipi(tip),
  }
}

function PlanGenelBilgilerScreen({ plan, urun, onBack }) {
  /** Otomatik Katılım (yalnızca OKS) — OKS-EGP Emeklilik Gelir Planı akışını kullanır */
  const isOksProduct = isOksOnlySozlesmeTipi(urun?.sozlesmeTipi)
  const isGrupProduct = sozlesmeTipiUpper(urun?.sozlesmeTipi) === 'GRUP'
  const [form, setForm] = useState(() => {
    const oks = isOksOnlySozlesmeTipi(urun?.sozlesmeTipi)
    return {
      sozlesmeTipi: urun?.sozlesmeTipi || 'Ferdi',
      versiyonNo: '0',
      planKodu: plan?.id || '',
      kategoriKodu: oks ? '' : planKategoriKodu(urun),
      planAdi: plan?.ad || '',
      planKisaAdi: '',
      baslangicTarihi: toInputDateValue(plan?.tarih),
      hazinePlanKodu: '',
      hazineTescilTarihi: '',
      egmPlanKodu: '',
      egmYururlukTarihi: '',
      basvuruKodlari: [],
      durum: plan?.durum || 'Taslak',
      durumKod: planDurumToKod(plan?.durum),
      dovizKodlari: [],
      kurTipKod: '',
      minGirisYasi: '',
      maxGirisYasi: '',
      emanetFon: 'FON1',
      gecerliSozlesmeCinsi: '',
      vakifAktarim: false,
      uyeKurumKod: '',
      odemeAraciKodlari: [],
      borcTipiKodlari: [],
      katilimEsasli: Boolean(plan?.katilimEsasli),
      gecerliSozlesmeTurleri: [],
      vatandaslikPlani: false,
      aktarimaOzelPlan: false,
      masrafliSatis: false,
      betas: false,
      hedefKitle: plan?.hedefKitle || '',
      mevzuatIstisnaMetni: '',
      mevzuatFarkliUygulama: '',
    }
  })

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const ozellikFlags = planOzellikVisibility(form.sozlesmeTipi)

  const headerSubtitle = `${plan?.id || '-'} • ${branchLabelFromUrun(urun)} • ${toHeaderIsoDate(plan?.tarih)}`

  if (isOksProduct) {
    return (
      <div className="bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold">Taslak</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{headerSubtitle}</p>
          </div>
          <PlanHeaderProgressRing pct={20} stepText="2/6" />
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-md hover:bg-slate-100" aria-label="Geri">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-semibold text-slate-800">Genel Bilgiler</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Sözleşme Tipi <span className="text-red-500">*</span></span>
                <div className="form-input bg-slate-50 flex items-center gap-2 text-slate-800 h-10">
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" aria-hidden />
                  <span className="truncate">{form.sozlesmeTipi}</span>
                </div>
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Versiyon No</span>
                <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" value={form.versiyonNo} readOnly disabled title="Sistem yönetiminde tanımlıdır" />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Plan Kodu <span className="text-red-500">*</span></span>
                <input className="form-input bg-slate-50" value={form.planKodu} readOnly />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Kategori Kodu <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="" value={form.kategoriKodu} onChange={(e) => setValue('kategoriKodu', e.target.value)} />
              </label>

              <label className="block md:col-span-4">
                <span className="block text-xs font-medium text-slate-600 mb-1">Plan Adı <span className="text-red-500">*</span></span>
                <input className="form-input" value={form.planAdi} onChange={(e) => setValue('planAdi', e.target.value)} />
              </label>

              <label className="block md:col-span-4">
                <span className="block text-xs font-medium text-slate-600 mb-1">Plan kısa adı <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Plan kısa adını giriniz" value={form.planKisaAdi} onChange={(e) => setValue('planKisaAdi', e.target.value)} />
              </label>

              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Başlangıç Tarihi <span className="text-red-500">*</span></span>
                <input type="date" className="form-input" value={form.baslangicTarihi} onChange={(e) => setValue('baslangicTarihi', e.target.value)} />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">EGM Plan Kodu</span>
                <input className="form-input" value={form.egmPlanKodu} onChange={(e) => setValue('egmPlanKodu', e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-xs font-medium text-slate-600 mb-1">EGM Yürürlük Tarihi</span>
                <input type="date" className="form-input" value={form.egmYururlukTarihi} onChange={(e) => setValue('egmYururlukTarihi', e.target.value)} />
              </label>

              <OksMultiSelectDropdown
                label="Başvuru Tipi"
                required
                options={BASVURU_TIPI_SECENEKLERI}
                selectedKodlar={form.basvuruKodlari}
                onChange={(kodlar) => setForm((prev) => ({ ...prev, basvuruKodlari: kodlar }))}
              />
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Durum <span className="text-red-500">*</span></span>
                <select className="form-select" value={form.durumKod} onChange={(e) => setValue('durumKod', e.target.value)}>
                  {OKS_PLAN_DURUM_SECENEKLERI.map((d) => (
                    <option key={d.kod} value={d.kod}>{d.label}</option>
                  ))}
                </select>
              </label>
              <OksMultiSelectDropdown
                label="Döviz"
                required
                options={PLAN_DOVIZ_SECENEKLERI}
                selectedKodlar={form.dovizKodlari}
                onChange={(kodlar) => setForm((prev) => ({ ...prev, dovizKodlari: kodlar }))}
              />
              <label className="block">
                <span className="block text-xs font-medium text-slate-600 mb-1">Kur Tipi</span>
                <select className="form-select" value={form.kurTipKod} onChange={(e) => setValue('kurTipKod', e.target.value)}>
                  <option value="">Seçiniz</option>
                  {kurTipleri.map((k) => (
                    <option key={k.kod} value={k.kod}>{kurTipiEtiket(k)}</option>
                  ))}
                </select>
              </label>

              <div className="md:col-span-4 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5">
                <span className="block text-xs font-medium text-slate-600 mb-1">Katılım Esaslı</span>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.katilimEsasli} disabled className="rounded border-slate-300 opacity-80 cursor-not-allowed" />
                  <span>{form.katilimEsasli ? 'Evet' : 'Hayır'}</span>
                  <span className="text-[11px] text-slate-400">(önceki adımdan, değiştirilemez)</span>
                </label>
              </div>

              {!form.katilimEsasli ? (
                <label className="block md:col-span-2">
                  <span className="block text-xs font-medium text-slate-600 mb-1">Emanet Fon</span>
                  <select className="form-select" value={form.emanetFon} onChange={(e) => setValue('emanetFon', e.target.value)}>
                    <option value="FON1">FON1</option>
                  </select>
                </label>
              ) : null}

              <div className="md:col-span-4">
                <span className="block text-xs font-medium text-slate-600 mb-2">Özellikler</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
                  {ozellikFlags.aktarimaOzel ? (
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.aktarimaOzelPlan} onChange={(e) => setValue('aktarimaOzelPlan', e.target.checked)} className="rounded border-slate-300" />
                      Aktarım Özel Planı
                    </label>
                  ) : null}
                  {ozellikFlags.mesafeliSatis ? (
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.masrafliSatis} onChange={(e) => setValue('masrafliSatis', e.target.checked)} className="rounded border-slate-300" />
                      Mesafeli Satış
                    </label>
                  ) : null}
                  {ozellikFlags.befas ? (
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.betas} onChange={(e) => setValue('betas', e.target.checked)} className="rounded border-slate-300" />
                      BEFAS
                    </label>
                  ) : null}
                </div>
              </div>

              <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <OksMultiSelectDropdown
                  label="Ödeme Araçları"
                  required
                  options={odemeAraclari.map((o) => ({ kod: o.kod, label: `${o.ad} (${o.kod})` }))}
                  selectedKodlar={form.odemeAraciKodlari}
                  onChange={(kodlar) => setForm((prev) => ({ ...prev, odemeAraciKodlari: kodlar }))}
                />
                <OksMultiSelectDropdown
                  label="Borç Tipleri"
                  required
                  options={borcTipleri.map((b) => ({ kod: b.kod, label: `${b.ad} (${b.kod})` }))}
                  selectedKodlar={form.borcTipiKodlari}
                  onChange={(kodlar) => setForm((prev) => ({ ...prev, borcTipiKodlari: kodlar }))}
                />
              </div>

              <label className="block md:col-span-4">
                <span className="block text-xs font-medium text-slate-600 mb-1">Hedef Kitle Açıklaması</span>
                <textarea className="form-input min-h-[88px]" placeholder="Hedef kitle açıklaması..." value={form.hedefKitle} onChange={(e) => setValue('hedefKitle', e.target.value)} />
              </label>
              <label className="block md:col-span-4">
                <span className="block text-xs font-medium text-slate-600 mb-1">Mevzuat Farklı Uygulama</span>
                <textarea className="form-input min-h-[88px]" placeholder="Mevzuat farklı uygulama açıklaması..." value={form.mevzuatFarkliUygulama} onChange={(e) => setValue('mevzuatFarkliUygulama', e.target.value)} />
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-2">İptal</button>
              <PrimaryButton>Kaydet</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">TASLAK</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{headerSubtitle}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500" style={{ width: '20%' }} /></div>
          <div className="text-xs text-slate-600 text-right mt-1">%20 2/6</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-slate-50/30">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Plan Konfigürasyonu</h3>
        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-4">
          <div>Branş: bes</div>
          <div>Ürün Kodu: {urun?.id || '-'}</div>
          <div>Ürün Adı: {urun?.ad || '-'}</div>
          <div>Oluşturan: Sistem Kullanıcısı</div>
          <div>Oluşturulma: {normalizeDate()}</div>
          <div>Son Güncelleme / Güncelleyen: {normalizeDate()} / Sistem Kullanıcısı</div>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-4">Genel Bilgiler</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Sözleşme Tipi *</span>
              <input className="form-input bg-slate-50 text-slate-800" value={form.sozlesmeTipi} readOnly disabled />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Versiyon No</span>
              <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" value={form.versiyonNo} readOnly disabled title="Sistem yönetiminde tanımlıdır" />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Plan Kodu *</span>
              <input className="form-input bg-slate-50" value={form.planKodu} readOnly disabled />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Kategori Kodu</span>
              <input className="form-input" value={form.kategoriKodu} onChange={(e) => setValue('kategoriKodu', e.target.value)} />
            </label>

            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Plan Adı *</span>
              <input className="form-input" value={form.planAdi} onChange={(e) => setValue('planAdi', e.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Plan kısa adı</span>
              <input className="form-input" value={form.planKisaAdi} onChange={(e) => setValue('planKisaAdi', e.target.value)} />
            </label>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Başlangıç Tarihi *</span>
              <input type="date" className="form-input" value={form.baslangicTarihi} onChange={(e) => setValue('baslangicTarihi', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Hazine Plan Kodu *</span>
              <input className="form-input" value={form.hazinePlanKodu} onChange={(e) => setValue('hazinePlanKodu', e.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Hazine Tescil Tarihi *</span>
              <input className="form-input" placeholder="dd......yyyy" value={form.hazineTescilTarihi} onChange={(e) => setValue('hazineTescilTarihi', e.target.value)} />
            </label>

            <OksMultiSelectDropdown
              label="Başvuru Tipi"
              required
              options={BASVURU_TIPI_SECENEKLERI}
              selectedKodlar={form.basvuruKodlari}
              onChange={(kodlar) => setForm((prev) => ({ ...prev, basvuruKodlari: kodlar }))}
            />
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Durum *</span>
              <select className="form-select" value={form.durumKod} onChange={(e) => setValue('durumKod', e.target.value)}>
                {OKS_PLAN_DURUM_SECENEKLERI.map((d) => (
                  <option key={d.kod} value={d.kod}>{d.label}</option>
                ))}
              </select>
            </label>
            <OksMultiSelectDropdown
              label="Döviz"
              required
              options={PLAN_DOVIZ_SECENEKLERI}
              selectedKodlar={form.dovizKodlari}
              onChange={(kodlar) => setForm((prev) => ({ ...prev, dovizKodlari: kodlar }))}
            />
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Kur Tipi *</span>
              <select className="form-select" value={form.kurTipKod} onChange={(e) => setValue('kurTipKod', e.target.value)}>
                <option value="">Seçiniz</option>
                {kurTipleri.map((k) => (
                  <option key={k.kod} value={k.kod}>{kurTipiEtiket(k)}</option>
                ))}
              </select>
            </label>

            {isGrupProduct ? (
              <div className="md:col-span-4 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-3">
                <span className="block text-xs font-medium text-slate-600 mb-2">Geçerli Sözleşme Türleri <span className="text-red-500">*</span></span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
                  {GRUP_GECERLI_SOZLESME_TURU_SECENEKLERI.map(({ kod, label }) => (
                    <label key={kod} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.gecerliSozlesmeTurleri.includes(kod)}
                        onChange={(e) => {
                          const on = e.target.checked
                          setForm((prev) => ({
                            ...prev,
                            gecerliSozlesmeTurleri: on
                              ? [...prev.gecerliSozlesmeTurleri, kod]
                              : prev.gecerliSozlesmeTurleri.filter((x) => x !== kod),
                          }))
                        }}
                        className="rounded border-slate-300"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="md:col-span-4 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5">
              <span className="block text-xs font-medium text-slate-600 mb-1">Katılım Esaslı</span>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.katilimEsasli} disabled className="rounded border-slate-300 opacity-80 cursor-not-allowed" />
                <span>{form.katilimEsasli ? 'Evet' : 'Hayır'}</span>
                <span className="text-[11px] text-slate-400">(önceki adımdan, değiştirilemez)</span>
              </label>
            </div>

            {!form.katilimEsasli ? (
              <label className="block md:col-span-2">
                <span className="block text-xs text-slate-600 mb-1">Emanet Fon</span>
                <select className="form-select" value={form.emanetFon} onChange={(e) => setValue('emanetFon', e.target.value)}>
                  <option value="FON1">FON1</option>
                </select>
              </label>
            ) : null}

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Min. Giriş Yaşı</span>
              <input className="form-input" value={form.minGirisYasi} onChange={(e) => setValue('minGirisYasi', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Max. Giriş Yaşı</span>
              <input className="form-input" value={form.maxGirisYasi} onChange={(e) => setValue('maxGirisYasi', e.target.value)} />
            </label>

            <div className="md:col-span-4">
              <div className="text-xs font-medium text-slate-600 mb-2">Özellikler</div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                {ozellikFlags.vatandaslik ? (
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.vatandaslikPlani} onChange={(e) => setValue('vatandaslikPlani', e.target.checked)} className="rounded border-slate-300" />
                    Vatandaşlık Planı
                  </label>
                ) : null}
                {ozellikFlags.aktarimaOzel ? (
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.aktarimaOzelPlan} onChange={(e) => setValue('aktarimaOzelPlan', e.target.checked)} className="rounded border-slate-300" />
                    Aktarım Özel Planı
                  </label>
                ) : null}
                {ozellikFlags.mesafeliSatis ? (
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.masrafliSatis} onChange={(e) => setValue('masrafliSatis', e.target.checked)} className="rounded border-slate-300" />
                    Mesafeli Satış
                  </label>
                ) : null}
                {ozellikFlags.befas ? (
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.betas} onChange={(e) => setValue('betas', e.target.checked)} className="rounded border-slate-300" />
                    BEFAS
                  </label>
                ) : null}
              </div>
            </div>

            {ozellikFlags.vakifAktarim ? (
              <div className="md:col-span-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 shrink-0">
                  <input
                    type="checkbox"
                    checked={form.vakifAktarim}
                    onChange={(e) => {
                      const c = e.target.checked
                      setForm((prev) => ({ ...prev, vakifAktarim: c, uyeKurumKod: c ? prev.uyeKurumKod : '' }))
                    }}
                    className="rounded border-slate-300"
                  />
                  Vakıf Aktarım
                </label>
                {form.vakifAktarim ? (
                  <label className="block flex-1 min-w-[220px] max-w-xl">
                    <span className="block text-xs font-medium text-slate-600 mb-1">Üye Kurum</span>
                    <select className="form-select" value={form.uyeKurumKod} onChange={(e) => setValue('uyeKurumKod', e.target.value)}>
                      <option value="">Seçiniz</option>
                      {vakifUyeKurum.map((v) => (
                        <option key={v.kod} value={v.kod}>{v.aciklama}</option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
            ) : null}

            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <OksMultiSelectDropdown
                label="Ödeme Araçları"
                required
                options={odemeAraclari.map((o) => ({ kod: o.kod, label: `${o.ad} (${o.kod})` }))}
                selectedKodlar={form.odemeAraciKodlari}
                onChange={(kodlar) => setForm((prev) => ({ ...prev, odemeAraciKodlari: kodlar }))}
              />
              <OksMultiSelectDropdown
                label="Borç Tipleri"
                required
                options={borcTipleri.map((b) => ({ kod: b.kod, label: `${b.ad} (${b.kod})` }))}
                selectedKodlar={form.borcTipiKodlari}
                onChange={(kodlar) => setForm((prev) => ({ ...prev, borcTipiKodlari: kodlar }))}
              />
            </div>

            <label className="block md:col-span-4">
              <span className="block text-xs text-slate-600 mb-1">Hedef Kitle Açıklaması *</span>
              <textarea className="form-input min-h-[76px]" placeholder="Hedef kitle açıklaması..." value={form.hedefKitle} onChange={(e) => setValue('hedefKitle', e.target.value)} />
            </label>
            <label className="block md:col-span-4">
              <span className="block text-xs text-slate-600 mb-1">Mevzuat İstisna Metni *</span>
              <textarea className="form-input min-h-[76px]" placeholder="Mevzuat istisna metni..." value={form.mevzuatIstisnaMetni} onChange={(e) => setValue('mevzuatIstisnaMetni', e.target.value)} />
            </label>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
            <OutlineButton>İptal</OutlineButton>
            <PrimaryButton>Kaydet</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function FonlarVeFonKarmalariScreen({ plan, urun, onBack }) {
  const [tab, setTab] = useState('fonlar')
  const [rows, setRows] = useState(INITIAL_FON_ROWS)
  const [karmaRows, setKarmaRows] = useState(INITIAL_KARMA_ROWS)
  const [selectedKarma, setSelectedKarma] = useState(null)
  const [karmaDetailRows, setKarmaDetailRows] = useState(INITIAL_KARMA_FON_DETAY)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [karmaModalOpen, setKarmaModalOpen] = useState(false)
  const [oranModalOpen, setOranModalOpen] = useState(false)
  const [fonForm, setFonForm] = useState({
    fonKodu: '',
    fonTipi: '',
    fonAdi: '',
    katilimEsasli: '',
    devletKatkisi: '',
    standart: '',
    minOran: '0.00',
    maxOran: '0.00',
    zorunlu: '',
  })
  const [karmaForm, setKarmaForm] = useState({
    karmaNo: 'EMK-FNK-756',
    aciklama: '',
    devletKatkisi: '',
    katilimEsasli: '',
    baslangic: '',
    standart: '',
  })

  const filteredRows = rows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.fonKodu.toLowerCase().includes(q) || r.fonAdi.toLowerCase().includes(q)
  })
  const filteredKarmaRows = karmaRows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.karmaNo.toLowerCase().includes(q) || r.aciklama.toLowerCase().includes(q)
  })

  const saveFon = () => {
    if (!fonForm.fonKodu) return alert('Fon Kodu zorunludur.')
    const payload = {
      fonKodu: fonForm.fonKodu,
      fonAdi: fonForm.fonAdi || '-',
      fonTipi: fonForm.fonTipi || '-',
      min: `${fonForm.minOran || '0'}%`,
      max: `${fonForm.maxOran || '0'}%`,
      zorunlu: fonForm.zorunlu || 'Hayır',
      standart: fonForm.standart || 'Hayır',
      devletKatkisi: fonForm.devletKatkisi || 'Hayır',
      katilimEsasli: fonForm.katilimEsasli || 'Hayır',
      fonDurumu: 'Aktif',
      kullanimda: 'Evet',
    }
    setRows((prev) => [...prev, payload])
    setModalOpen(false)
    setFonForm({ fonKodu: '', fonTipi: '', fonAdi: '', katilimEsasli: '', devletKatkisi: '', standart: '', minOran: '0.00', maxOran: '0.00', zorunlu: '' })
  }

  const pill = (value) => (
    <span className={`px-2 py-0.5 rounded text-[11px] border ${value === 'Evet' || value === 'Aktif' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>{value}</span>
  )
  const boolBadge = (value) => (
    <span className={`px-2 py-0.5 rounded text-[11px] border inline-flex items-center gap-1 ${value === 'Evet' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-sky-700 bg-sky-50 border-sky-200'}`}>
      {value === 'Evet' ? '✓' : '×'} {value}
    </span>
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 border-b border-slate-100">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Ürün Yönetimi / Ürün Planları / Plan Detay Sayfası / Fonlar
        </button>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs text-slate-600">
          <div>Branş: <strong>{(urun?.tipler || '').includes('Bireysel Emeklilik') ? 'Bireysel Emeklilik' : '-'}</strong></div>
          <div>Sözleşme Tipi: <strong>{urun?.sozlesmeTipi || '-'}</strong></div>
          <div>Ürün Kodu: <strong>{urun?.id || '-'}</strong></div>
          <div>Plan Kodu: <strong>{plan?.id || '-'}</strong></div>
          <div>Plan Adı: <strong>{plan?.ad || '-'}</strong></div>
          <div>Aktif mi: <strong>Hayır</strong></div>
        </div>
      </div>

      <div className="px-6 pt-3">
        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
          <button type="button" onClick={() => setTab('fonlar')} className={`px-4 h-9 text-sm ${tab === 'fonlar' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}>Fonlar</button>
          <button type="button" onClick={() => setTab('karmalar')} className={`px-4 h-9 text-sm ${tab === 'karmalar' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}>Fon Karmaları</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'fonlar' ? (
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <PrimaryButton onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
            </div>
            <div className="overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th>FON KODU</th><th>FON ADI</th><th>FON TİPİ</th><th>MİN %</th><th>MAX %</th><th>ZORUNLU</th><th>STANDART</th><th>DEVLET KATKISI</th><th>KATILIM ESASLI</th><th>FON DURUMU</th><th>KULLANIMDA</th><th className="w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.fonKodu}>
                      <td className="font-semibold">{row.fonKodu}</td>
                      <td>{row.fonAdi}</td>
                      <td>{row.fonTipi}</td>
                      <td>{row.min}</td>
                      <td>{row.max}</td>
                      <td>{pill(row.zorunlu)}</td>
                      <td>{pill(row.standart)}</td>
                      <td>{pill(row.devletKatkisi)}</td>
                      <td>{pill(row.katilimEsasli)}</td>
                      <td>{pill(row.fonDurumu)}</td>
                      <td>{pill(row.kullanimda)}</td>
                      <td className="text-right">
                        <RowActions row={row} actions={FON_DELETE_ACTION} onAction={(key) => {
                          if (key === 'delete' && window.confirm('Fon kaydı silinsin mi?')) setRows((prev) => prev.filter((x) => x.fonKodu !== row.fonKodu))
                        }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !selectedKarma ? (
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <PrimaryButton onClick={() => setKarmaModalOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
            </div>
            <div className="overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead><tr><th>KARMA NO</th><th>AÇIKLAMA</th><th>MP REF KOD</th><th>KATILIM ESASLI</th><th>STANDART</th><th>DEVLET KATKISI</th><th>BAŞLANGIÇ</th><th>RGPF</th><th className="w-12 text-right"></th></tr></thead>
                <tbody>
                  {filteredKarmaRows.map((row) => (
                    <tr key={row.karmaNo}>
                      <td className="font-semibold">{row.karmaNo}</td>
                      <td>{row.aciklama}</td>
                      <td>{row.mpRefKod}</td>
                      <td>{boolBadge(row.katilimEsasli)}</td>
                      <td>{boolBadge(row.standart)}</td>
                      <td>{boolBadge(row.devletKatkisi)}</td>
                      <td>{boolBadge(row.baslangic)}</td>
                      <td>{boolBadge(row.rgpf)}</td>
                      <td className="text-right">
                        <RowActions row={row} actions={FON_KARMA_ACTIONS} onAction={(key) => {
                          if (key === 'delete' && window.confirm('Fon karması silinsin mi?')) {
                            setKarmaRows((prev) => prev.filter((x) => x.karmaNo !== row.karmaNo))
                          }
                          if (key === 'details') setSelectedKarma(row)
                        }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 grid grid-cols-2 md:grid-cols-8 gap-2">
              <div>Karma No: <strong>{selectedKarma.karmaNo}</strong></div>
              <div>Açıklama: <strong>{selectedKarma.aciklama}</strong></div>
              <div>MP Ref Kod: <strong>{selectedKarma.mpRefKod}</strong></div>
              <div>Faizsiz: <strong>{selectedKarma.katilimEsasli}</strong></div>
              <div>Standart: <strong>{selectedKarma.standart}</strong></div>
              <div>Devlet Katkısı: <strong>{selectedKarma.devletKatkisi}</strong></div>
              <div>Başlangıç: <strong>{selectedKarma.baslangic}</strong></div>
              <div>RGPF: <strong>{selectedKarma.rgpf}</strong></div>
            </div>
            <div className="flex justify-end">
              <PrimaryButton onClick={() => setOranModalOpen(true)}>Oranları Güncelle</PrimaryButton>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead><tr><th>FON KODU</th><th>FON AÇIKLAMASI</th><th>FON TİPİ</th><th>KATILIM ESASLI</th><th>MİN. ORAN</th><th>MAX. ORAN</th><th>ORAN</th><th className="w-10"></th></tr></thead>
                <tbody>
                  {karmaDetailRows.map((row) => (
                    <tr key={row.fonKodu}>
                      <td>{row.fonKodu}</td>
                      <td>{row.fonAciklama}</td>
                      <td>{row.fonTipi}</td>
                      <td>
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={row.katilimEsasli} onChange={(e) => setKarmaDetailRows((prev) => prev.map((x) => x.fonKodu === row.fonKodu ? { ...x, katilimEsasli: e.target.checked } : x))} />
                          {row.katilimEsasli ? 'Evet' : 'Hayır'}
                        </label>
                      </td>
                      <td>{row.minOran}</td>
                      <td>{row.maxOran}</td>
                      <td className="text-violet-700 font-semibold">%{row.oran}</td>
                      <td className="text-right"><RowActions row={row} actions={FON_DELETE_ACTION} onAction={(key) => {
                        if (key === 'delete' && window.confirm('Fon satırı silinsin mi?')) setKarmaDetailRows((prev) => prev.filter((x) => x.fonKodu !== row.fonKodu))
                      }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={() => setSelectedKarma(null)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"><ArrowLeft className="w-4 h-4" /> Fon Karmaları Listesine Dön</button>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Fon Ekle"
        size="md"
        footer={<><OutlineButton onClick={() => setModalOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={saveFon}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Fon Kodu</span><select className="form-select" value={fonForm.fonKodu} onChange={(e) => setFonForm((p) => ({ ...p, fonKodu: e.target.value }))}><option value="">Seçiniz</option><option value="FON-006">FON-006</option><option value="FON-007">FON-007</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Fon Tipi</span><input className="form-input" value={fonForm.fonTipi} onChange={(e) => setFonForm((p) => ({ ...p, fonTipi: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Fon Adı</span><input className="form-input" value={fonForm.fonAdi} onChange={(e) => setFonForm((p) => ({ ...p, fonAdi: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Katılım Esaslı</span><input className="form-input" value={fonForm.katilimEsasli} onChange={(e) => setFonForm((p) => ({ ...p, katilimEsasli: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Devlet Katkısı</span><input className="form-input" value={fonForm.devletKatkisi} onChange={(e) => setFonForm((p) => ({ ...p, devletKatkisi: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Standart</span><select className="form-select" value={fonForm.standart} onChange={(e) => setFonForm((p) => ({ ...p, standart: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Min. Oran (0-1)</span><input className="form-input" value={fonForm.minOran} onChange={(e) => setFonForm((p) => ({ ...p, minOran: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Max. Oran (0-1)</span><input className="form-input" value={fonForm.maxOran} onChange={(e) => setFonForm((p) => ({ ...p, maxOran: e.target.value }))} /></label>
          <label className="block md:col-span-2"><span className="block text-sm text-slate-700 mb-1">Zorunlu</span><select className="form-select" value={fonForm.zorunlu} onChange={(e) => setFonForm((p) => ({ ...p, zorunlu: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
        </div>
      </Modal>

      <Modal
        open={karmaModalOpen}
        onClose={() => setKarmaModalOpen(false)}
        title="Fon Karması Ekle"
        size="md"
        footer={<><OutlineButton onClick={() => setKarmaModalOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={() => {
          if (!karmaForm.karmaNo.trim()) return alert('Karma No zorunludur.')
          if (!karmaForm.aciklama.trim()) return alert('Fon Karma Açıklaması zorunludur.')
          setKarmaRows((prev) => [...prev, {
            karmaNo: karmaForm.karmaNo.trim(),
            aciklama: karmaForm.aciklama.trim(),
            mpRefKod: '—',
            katilimEsasli: karmaForm.katilimEsasli || 'Hayır',
            standart: karmaForm.standart || 'Hayır',
            devletKatkisi: karmaForm.devletKatkisi || 'Hayır',
            baslangic: karmaForm.baslangic || 'Hayır',
            rgpf: 'Evet',
          }])
          setKarmaModalOpen(false)
        }}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block md:col-span-1"><span className="block text-sm text-slate-700 mb-1">Karma No</span><input className="form-input bg-slate-50" value={karmaForm.karmaNo} onChange={(e) => setKarmaForm((p) => ({ ...p, karmaNo: e.target.value }))} /></label>
          <div />
          <label className="block md:col-span-2"><span className="block text-sm text-slate-700 mb-1">Fon Karma Açıklaması</span><input className="form-input" placeholder="Açıklama giriniz" value={karmaForm.aciklama} onChange={(e) => setKarmaForm((p) => ({ ...p, aciklama: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Devlet Katkısı</span><select className="form-select" value={karmaForm.devletKatkisi} onChange={(e) => setKarmaForm((p) => ({ ...p, devletKatkisi: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Katılım Esaslı</span><select className="form-select" value={karmaForm.katilimEsasli} onChange={(e) => setKarmaForm((p) => ({ ...p, katilimEsasli: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Başlangıç</span><select className="form-select" value={karmaForm.baslangic} onChange={(e) => setKarmaForm((p) => ({ ...p, baslangic: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select><span className="text-xs text-slate-400 mt-1 block">OKS planları için özel parametre; bu ekranda düzenlenemez.</span></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Standart</span><select className="form-select" value={karmaForm.standart} onChange={(e) => setKarmaForm((p) => ({ ...p, standart: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
        </div>
      </Modal>

      <Modal
        open={oranModalOpen}
        onClose={() => setOranModalOpen(false)}
        title="Fon Oranlarını Güncelle"
        size="lg"
        footer={<><OutlineButton onClick={() => setOranModalOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={() => setOranModalOpen(false)}>Güncelle</PrimaryButton></>}
      >
        <div className="overflow-auto">
          <table className="w-full grid-table text-sm">
            <thead><tr><th>FON KODU</th><th>FON AÇIKLAMASI</th><th>FON TİPİ</th><th>KATILIM ESASLI</th><th>MİN. ORAN</th><th>MAX. ORAN</th><th>ORAN (%)</th></tr></thead>
            <tbody>
              {karmaDetailRows.map((row) => (
                <tr key={row.fonKodu}>
                  <td>{row.fonKodu}</td>
                  <td>{row.fonAciklama}</td>
                  <td>{row.fonTipi}</td>
                  <td>{row.katilimEsasli ? 'Evet' : 'Hayır'}</td>
                  <td>{row.minOran}</td>
                  <td>{row.maxOran}</td>
                  <td><input type="number" className="form-input h-9 w-24" value={row.oran} onChange={(e) => setKarmaDetailRows((prev) => prev.map((x) => x.fonKodu === row.fonKodu ? { ...x, oran: Number(e.target.value) } : x))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}

function KatkiPayiTanimlariScreen({ plan, urun, onBack }) {
  const [linked, setLinked] = useState(() => katkiPayiTemplateleri.map(kptToLinkedRow))
  const [catalog, setCatalog] = useState(() => [...katkiPayiTemplateleri])
  const [bindOpen, setBindOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [kayitGoster, setKayitGoster] = useState(10)
  const [modalPageSize, setModalPageSize] = useState(10)
  const [versionsModal, setVersionsModal] = useState({ open: false, title: '', rows: [] })

  const breadcrumb = `${String(urun?.id || '').replace(/-/g, ' ')} PS • ${String(plan?.ad || urun?.ad || '').replace(/\s*-\s*/g, ' ').trim()}`

  const selectTemplate = (raw) => {
    const row = kptToLinkedRow(raw)
    if (linked.some((l) => l.rowKey === row.rowKey)) {
      alert('Bu KP şablonu zaten bağlı.')
      return
    }
    setLinked((prev) => [...prev, row])
  }

  const openVersionsForKod = (kod) => {
    const rows = KP_TEMPLATE_VERSIONS_BY_KOD[kod] || []
    setVersionsModal({
      open: true,
      title: `${kod} — Versiyonlar`,
      rows,
    })
  }

  const handleRowAction = (key, row, fromCatalog) => {
    if (key === 'history') {
      openVersionsForKod(row.kpTemplateKodu)
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Kayıt silinsin mi?')) return
      if (fromCatalog) {
        setCatalog((prev) => prev.filter((x) => !(x.kpTemplateKodu === row.kpTemplateKodu && String(x.versiyon) === String(row.versiyon))))
      } else {
        setLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
      }
    }
  }

  const linkedSlice = linked.slice(0, kayitGoster)
  const linkedRange = linked.length ? `1-${Math.min(linked.length, kayitGoster)}/${linked.length}` : '0/0'

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Katkı Payı</h2>
            <div className="text-xs text-slate-500 mt-0.5">{breadcrumb}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500" style={{ width: '20%' }} /></div>
          <div className="text-xs text-slate-600 text-right mt-1">%20 2/6</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/40">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Bağlı Katkı Payı Templateleri</h3>
            <PrimaryButton onClick={() => setBindOpen(true)}>KP Template Bağla</PrimaryButton>
          </div>
          <div className="overflow-auto">
            <table className="w-full grid-table text-xs">
              <thead>
                <tr>
                  <th>KP Template Kodu</th>
                  <th>Adı</th>
                  <th>Versiyon</th>
                  <th>Katkı Payı Tutarı</th>
                  <th>Başlangıç Kapitali</th>
                  <th>Giriş Fon Büyüklüğü</th>
                  <th>Döviz Türü(KP)</th>
                  <th>Ödeme Periyodu</th>
                  <th>Azami KP</th>
                  <th>Döviz Türü(Diğer)</th>
                  <th>Oluşturan</th>
                  <th>Oluşturma Tarihi</th>
                  <th>Güncelleyen</th>
                  <th>Güncelleme Tarihi</th>
                  <th className="text-right">Liste İşlemleri</th>
                </tr>
              </thead>
              <tbody>
                {linkedSlice.map((row) => (
                  <tr key={row.rowKey}>
                    <td className="font-semibold">{row.kpTemplateKodu}</td>
                    <td>{row.adi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.katkiPayiTutari}</td>
                    <td>{row.baslangicKapitali}</td>
                    <td>{row.girisFonBuyuklugu}</td>
                    <td>{row.dovizKp}</td>
                    <td>{row.odemePeriyodu}</td>
                    <td>{row.azamiKp}</td>
                    <td>{row.dovizDiger}</td>
                    <td>{row.olusturan}</td>
                    <td>{row.olusturulmaTarihi}</td>
                    <td>{row.guncelleyen}</td>
                    <td>{row.guncellemeTarihi}</td>
                    <td className="text-right">
                      <RowActions row={row} actions={KP_TEMPLATE_ROW_ACTIONS} onAction={(key, r) => handleRowAction(key, r, false)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <label className="inline-flex items-center gap-2">
              Kayıt Göster
              <select className="form-select h-8 py-0 text-xs min-w-[4rem]" value={kayitGoster} onChange={(e) => setKayitGoster(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
            <span>{linkedRange}</span>
          </div>
        </div>
      </div>

      <Modal
        open={bindOpen}
        onClose={() => setBindOpen(false)}
        title="Katkı Payı Templateleri"
        description="KP template tanımlarının listelendiği, filtrelenip sıralandığı ekrandır."
        size="xl"
        footer={null}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
            <span className="text-sm font-medium text-slate-700">Filtre Seçenekleri</span>
            <button type="button" className="text-sm text-violet-600 font-medium" onClick={() => setFilterOpen((v) => !v)}>{filterOpen ? 'Gizle' : 'Göster'}</button>
          </div>
          {filterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <input className="form-input" placeholder="KP Template Kodu" />
              <input className="form-input" placeholder="Adı" />
              <select className="form-select"><option value="">Ödeme Periyodu</option><option>Aylık</option><option>Yıllık</option></select>
            </div>
          )}
          <div className="overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full grid-table text-xs">
              <thead>
                <tr>
                  <th>KP Template Kodu</th>
                  <th>Adı</th>
                  <th>Versiyon</th>
                  <th>Katkı Payı Tutarı</th>
                  <th>Başlangıç Kapitali</th>
                  <th>Giriş Fon Büyüklüğü</th>
                  <th>Doviz Türü(KP)</th>
                  <th>Ödeme Periyodu</th>
                  <th>Azami KP</th>
                  <th>Doviz Türü(Diğer)</th>
                  <th>Oluşturan</th>
                  <th>Oluşturulma Tarihi</th>
                  <th>Seç</th>
                  <th className="text-right">Liste İşlemleri</th>
                </tr>
              </thead>
              <tbody>
                {catalog.slice(0, modalPageSize).map((t) => (
                  <tr
                    key={`${t.kpTemplateKodu}-${t.versiyon}`}
                    className="cursor-pointer hover:bg-slate-50/80"
                    onDoubleClick={() => selectTemplate(t)}
                  >
                    <td className="font-semibold">{t.kpTemplateKodu}</td>
                    <td>{t.adi}</td>
                    <td>{t.versiyon}</td>
                    <td>{t.katkiPayiTutari}</td>
                    <td>{t.baslangicKapitali}</td>
                    <td>{t.girisFonBuyuklugu}</td>
                    <td>{t.dovizKp}</td>
                    <td>{t.odemePeriyodu}</td>
                    <td>{t.azamiKp}</td>
                    <td>{t.dovizDiger}</td>
                    <td>{t.olusturan}</td>
                    <td>{t.olusturulmaTarihi}</td>
                    <td>
                      <OutlineButton className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); selectTemplate(t) }}>Seç</OutlineButton>
                    </td>
                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                      <RowActions row={t} actions={KP_TEMPLATE_ROW_ACTIONS} onAction={(key, r) => handleRowAction(key, r, true)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <label className="inline-flex items-center gap-2">
              Sayfa başına
              <select className="form-select h-8 py-0 text-xs min-w-[4rem]" value={modalPageSize} onChange={(e) => setModalPageSize(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </label>
            <span>Toplam {catalog.length} kayıt</span>
          </div>
          <div className="flex justify-end pt-2">
            <OutlineButton onClick={() => setBindOpen(false)}>Kapat</OutlineButton>
          </div>
        </div>
      </Modal>

      <Modal
        open={versionsModal.open}
        onClose={() => setVersionsModal({ open: false, title: '', rows: [] })}
        title={versionsModal.title}
        footer={<PrimaryButton onClick={() => setVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {versionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Oluşturulma</th><th>Oluşturan</th></tr></thead>
            <tbody>
              {versionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.olusturulma}</td>
                  <td>{v.olusturan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Bu şablon için versiyon kaydı yok.</p>
        )}
      </Modal>
    </div>
  )
}

function KesintilerScreen({ plan, urun, onBack }) {
  const [menuKey, setMenuKey] = useState('girisAidati')
  const [gaLinked, setGaLinked] = useState(() => GA_LINKED_INITIAL.map((x) => ({ ...x })))
  const [gaCatalog] = useState(() => GA_CATALOG_ALL.map((x) => ({ ...x })))
  const [gaBindOpen, setGaBindOpen] = useState(false)
  const [gaCatSearch, setGaCatSearch] = useState('')
  const [gaMainSearch, setGaMainSearch] = useState('')
  const [gaInspectRow, setGaInspectRow] = useState(null)

  const [ygkLinked, setYgkLinked] = useState(() => YGK_LINKED_INITIAL.map((x) => ({ ...x })))
  const [ygkCatalog] = useState(() => YGK_CATALOG_ALL.map((x) => ({ ...x })))
  const [ygkBindOpen, setYgkBindOpen] = useState(false)
  const [ygkCatSearch, setYgkCatSearch] = useState('')
  const [ygkMainSearch, setYgkMainSearch] = useState('')
  const [ygkInspectRow, setYgkInspectRow] = useState(null)
  const [ygkVersionsModal, setYgkVersionsModal] = useState({ open: false, title: '', rows: [] })

  const [ygkMuafLinked, setYgkMuafLinked] = useState(() => YGK_MUAF_LINKED_INITIAL.map((x) => ({ ...x })))
  const [ygkMuafCatalog] = useState(() => YGK_MUAF_CATALOG_ALL.map((x) => ({ ...x })))
  const [ygkMuafBindOpen, setYgkMuafBindOpen] = useState(false)
  const [ygkMuafCatSearch, setYgkMuafCatSearch] = useState('')
  const [ygkMuafMainSearch, setYgkMuafMainSearch] = useState('')
  const [ygkMuafInspectRow, setYgkMuafInspectRow] = useState(null)
  const [ygkMuafVersionsModal, setYgkMuafVersionsModal] = useState({ open: false, title: '', rows: [] })

  const [araVermeLinked, setAraVermeLinked] = useState(() => ARA_VERME_LINKED_INITIAL.map((x) => ({ ...x })))
  const [araVermeCatalog] = useState(() => ARA_VERME_CATALOG_ALL.map((x) => ({ ...x })))
  const [araVermeBindOpen, setAraVermeBindOpen] = useState(false)
  const [araVermeCatSearch, setAraVermeCatSearch] = useState('')
  const [araVermeMainSearch, setAraVermeMainSearch] = useState('')
  const [araVermeInspectRow, setAraVermeInspectRow] = useState(null)
  const [araVermeVersionsModal, setAraVermeVersionsModal] = useState({ open: false, title: '', rows: [] })

  const [kesintiBes30Linked, setKesintiBes30Linked] = useState(() => KESINTI_BES30_LINKED_INITIAL.map((x) => ({ ...x })))
  const [kesintiBes30Catalog] = useState(() => KESINTI_BES30_CATALOG_ALL.map((x) => ({ ...x })))
  const [kesintiBes30BindOpen, setKesintiBes30BindOpen] = useState(false)
  const [kesintiBes30CatSearch, setKesintiBes30CatSearch] = useState('')
  const [kesintiBes30MainSearch, setKesintiBes30MainSearch] = useState('')
  const [kesintiBes30InspectRow, setKesintiBes30InspectRow] = useState(null)
  const [kesintiBes30VersionsModal, setKesintiBes30VersionsModal] = useState({ open: false, title: '', rows: [] })

  const [ygkBes30Linked, setYgkBes30Linked] = useState(() => YGK_BES30_LINKED_INITIAL.map((x) => ({ ...x })))
  const [ygkBes30Catalog] = useState(() => YGK_BES30_CATALOG_ALL.map((x) => ({ ...x })))
  const [ygkBes30BindOpen, setYgkBes30BindOpen] = useState(false)
  const [ygkBes30CatSearch, setYgkBes30CatSearch] = useState('')
  const [ygkBes30MainSearch, setYgkBes30MainSearch] = useState('')
  const [ygkBes30InspectRow, setYgkBes30InspectRow] = useState(null)
  const [ygkBes30VersionsModal, setYgkBes30VersionsModal] = useState({ open: false, title: '', rows: [] })
  const [ygkBes30DetailsRow, setYgkBes30DetailsRow] = useState(null)
  const [ygkBes30DetailsTab, setYgkBes30DetailsTab] = useState('muafiyet')
  const [ygkBes30DetailsMuafSearch, setYgkBes30DetailsMuafSearch] = useState('')

  const branchLabel = (urun?.tipler || '').toLowerCase().includes('bireysel emeklilik') ? 'Bireysel Emeklilik' : '-'

  const filteredGaCatalog = gaCatalog.filter((r) => {
    if (!gaCatSearch.trim()) return true
    const q = gaCatSearch.toLowerCase()
    return [r.gaKodu, r.doviz, r.gaTipi].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredGaLinked = gaLinked.filter((r) => {
    if (!gaMainSearch.trim()) return true
    const q = gaMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredYgkCatalog = ygkCatalog.filter((r) => {
    if (!ygkCatSearch.trim()) return true
    const q = ygkCatSearch.toLowerCase()
    return [r.ygkKodu, r.ygkAdi, r.doviz].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredYgkLinked = ygkLinked.filter((r) => {
    if (!ygkMainSearch.trim()) return true
    const q = ygkMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredYgkMuafCatalog = ygkMuafCatalog.filter((r) => {
    if (!ygkMuafCatSearch.trim()) return true
    const q = ygkMuafCatSearch.toLowerCase()
    return [r.muafKodu, r.muafAdi, r.doviz].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredYgkMuafLinked = ygkMuafLinked.filter((r) => {
    if (!ygkMuafMainSearch.trim()) return true
    const q = ygkMuafMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredAraVermeCatalog = araVermeCatalog.filter((r) => {
    if (!araVermeCatSearch.trim()) return true
    const q = araVermeCatSearch.toLowerCase()
    return [r.avKodu, r.avAdi, r.tutar].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredAraVermeLinked = araVermeLinked.filter((r) => {
    if (!araVermeMainSearch.trim()) return true
    const q = araVermeMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredKesintiBes30Catalog = kesintiBes30Catalog.filter((r) => {
    if (!kesintiBes30CatSearch.trim()) return true
    const q = kesintiBes30CatSearch.toLowerCase()
    return [r.kbKodu, r.kbAdi, r.yil, r.maxKesintiOrani].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredKesintiBes30Linked = kesintiBes30Linked.filter((r) => {
    if (!kesintiBes30MainSearch.trim()) return true
    const q = kesintiBes30MainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredYgkBes30Catalog = ygkBes30Catalog.filter((r) => {
    if (!ygkBes30CatSearch.trim()) return true
    const q = ygkBes30CatSearch.toLowerCase()
    return [r.ybKodu, r.ybAdi, r.doviz, r.ygkKesintiTipi].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredYgkBes30Linked = ygkBes30Linked.filter((r) => {
    if (!ygkBes30MainSearch.trim()) return true
    const q = ygkBes30MainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const ygkBes30MuafBandsFiltered = (() => {
    const row = ygkBes30DetailsRow
    if (!row) return []
    const bands = YGK_BES30_MUAF_BANDS_BY_KOD[row.ybKodu] || []
    const q = ygkBes30DetailsMuafSearch.trim().toLowerCase()
    if (!q) return bands
    return bands.filter((b) => [b.minTutar, b.maxTutar, b.oran, b.tutar].some((s) => String(s).toLowerCase().includes(q)))
  })()

  useEffect(() => {
    if (!ygkBes30DetailsRow) setYgkBes30DetailsMuafSearch('')
  }, [ygkBes30DetailsRow])

  const addGaFromCatalog = (row) => {
    if (gaLinked.some((l) => l.gaKodu === row.gaKodu)) {
      alert('Bu GA şablonu planda zaten bağlı.')
      return
    }
    setGaLinked((prev) => [...prev, { ...row }])
    setGaBindOpen(false)
  }

  const addYgkFromCatalog = (row) => {
    const rowKey = `${row.ygkKodu}-${row.versiyon}`
    if (ygkLinked.some((l) => l.rowKey === rowKey)) {
      alert('Bu YGK şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setYgkLinked((prev) => [...prev, { ...row, rowKey }])
    setYgkBindOpen(false)
  }

  const addYgkMuafFromCatalog = (row) => {
    const rowKey = `${row.muafKodu}-${row.versiyon}`
    if (ygkMuafLinked.some((l) => l.rowKey === rowKey)) {
      alert('Bu muafiyet şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setYgkMuafLinked((prev) => [...prev, {
      rowKey,
      muafKodu: row.muafKodu,
      muafAdi: row.muafAdi,
      versiyon: row.versiyon,
      yil: row.yil,
      toplamOdenmisKp: row.toplamOdenmisKp,
      doviz: row.doviz,
      oran: row.oran,
    }])
    setYgkMuafBindOpen(false)
  }

  const addAraVermeFromCatalog = (row) => {
    const rowKey = `${row.avKodu}-${row.versiyon}`
    if (araVermeLinked.some((l) => l.rowKey === rowKey)) {
      alert('Bu ara verme şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setAraVermeLinked((prev) => [...prev, {
      rowKey,
      avKodu: row.avKodu,
      avAdi: row.avAdi,
      versiyon: row.versiyon,
      tutar: row.tutar,
      hesaplamaKurali: row.hesaplamaKurali,
      onKosul: row.onKosul,
    }])
    setAraVermeBindOpen(false)
  }

  const addKesintiBes30FromCatalog = (row) => {
    const rowKey = `${row.kbKodu}-${row.versiyon}`
    if (kesintiBes30Linked.some((l) => l.rowKey === rowKey)) {
      alert('Bu Kesinti BES3.0 şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setKesintiBes30Linked((prev) => [...prev, {
      rowKey,
      kbKodu: row.kbKodu,
      kbAdi: row.kbAdi,
      versiyon: row.versiyon,
      yil: row.yil,
      maxKesintiOrani: row.maxKesintiOrani,
      maxKesintiTutari: row.maxKesintiTutari,
    }])
    setKesintiBes30BindOpen(false)
  }

  const addYgkBes30FromCatalog = (row) => {
    const rowKey = `${row.ybKodu}-${row.versiyon}`
    if (ygkBes30Linked.some((l) => l.rowKey === rowKey)) {
      alert('Bu YGK BES3.0 şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    const y = String(row.sozlesmeYili || '')
    const sozlesmeYiliAraligi = y.includes('-') ? y : `${y}-${y}`
    setYgkBes30Linked((prev) => [...prev, {
      rowKey,
      ybKodu: row.ybKodu,
      ybAdi: row.ybAdi,
      versiyon: row.versiyon,
      dovizKodu: row.doviz,
      ygkKesintiTipi: row.ygkKesintiTipi,
      oran: row.oran,
      yillikTutar: row.yillikTutar,
      ygkFormulu: row.ygkFormulu,
      kesintiDonemi: row.kesintiDonemi,
      sozlesmeYiliAraligi,
      birikim: row.birikim,
      gecerlilikTarihi: row.gecerlilikTarihi,
      birikimTipi: row.birikimTipi,
    }])
    setYgkBes30BindOpen(false)
  }

  const handleGaRowAction = (key, row) => {
    if (key === 'view') setGaInspectRow(row)
    if (key === 'remove' && window.confirm('Bu giriş aidatı bağlantısı çıkarılsın mı?')) {
      setGaLinked((prev) => prev.filter((x) => x.gaKodu !== row.gaKodu))
    }
  }

  const handleYgkRowAction = (key, row) => {
    if (key === 'view') setYgkInspectRow(row)
    if (key === 'remove' && window.confirm('Bu YGK bağlantısı çıkarılsın mı?')) {
      setYgkLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = YGK_VERSIONS_BY_KOD[row.ygkKodu] || []
      setYgkVersionsModal({ open: true, title: `${row.ygkKodu} — Versiyonlar`, rows })
    }
  }

  const handleYgkMuafRowAction = (key, row) => {
    if (key === 'view') setYgkMuafInspectRow(row)
    if (key === 'delete' && window.confirm('Bu muafiyet kaydı silinsin mi?')) {
      setYgkMuafLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = YGK_MUAF_VERSIONS_BY_KOD[row.muafKodu] || []
      setYgkMuafVersionsModal({ open: true, title: `${row.muafKodu} — Versiyonlar`, rows })
    }
  }

  const handleAraVermeRowAction = (key, row) => {
    if (key === 'view') setAraVermeInspectRow(row)
    if (key === 'delete' && window.confirm('Bu ara verme kaydı silinsin mi?')) {
      setAraVermeLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = ARA_VERME_VERSIONS_BY_KOD[row.avKodu] || []
      setAraVermeVersionsModal({ open: true, title: `${row.avKodu} — Versiyonlar`, rows })
    }
  }

  const handleKesintiBes30RowAction = (key, row) => {
    if (key === 'view') setKesintiBes30InspectRow(row)
    if (key === 'remove' && window.confirm('Bu Kesinti BES3.0 bağlantısı çıkarılsın mı?')) {
      setKesintiBes30Linked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = KESINTI_BES30_VERSIONS_BY_KOD[row.kbKodu] || []
      setKesintiBes30VersionsModal({ open: true, title: `${row.kbKodu} — Versiyonlar`, rows })
    }
  }

  const handleYgkBes30RowAction = (key, row) => {
    if (key === 'view') setYgkBes30InspectRow(row)
    if (key === 'remove' && window.confirm('Bu YGK BES3.0 bağlantısı çıkarılsın mı?')) {
      setYgkBes30Linked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
      setYgkBes30DetailsRow((d) => (d?.rowKey === row.rowKey ? null : d))
    }
    if (key === 'history') {
      const rows = YGK_BES30_VERSIONS_BY_KOD[row.ybKodu] || []
      setYgkBes30VersionsModal({ open: true, title: `${row.ybKodu} — Versiyonlar`, rows })
    }
    if (key === 'details') {
      setYgkBes30DetailsTab('muafiyet')
      setYgkBes30DetailsMuafSearch('')
      setYgkBes30DetailsRow(row)
    }
  }

  const ygkSifirlaCell = (v) => (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded border text-xs ${v ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>{v ? '✓' : '×'}</span>
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-500 shrink-0">
        <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <span>Ürün Yönetimi / Ürün Planları / Plan Detay Sayfası / Kesintiler</span>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="text-sm font-semibold text-slate-800 leading-tight">{plan?.ad || 'Plan'}</div>
            <div className="text-[11px] text-slate-500 mt-1">Plan Kodu: <span className="font-mono text-slate-700">{plan?.id || '—'}</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Branş: <span className="text-slate-700">{branchLabel}</span></div>
            <div className="text-[11px] text-slate-500">Sözleşme Tipi: <span className="text-slate-700">{urun?.sozlesmeTipi || '—'}</span></div>
          </div>
          <nav className="flex-1 overflow-auto py-2">
            {KESINTI_MENU_KEYS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMenuKey(item.id)}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between gap-2 ${menuKey === item.id ? 'bg-violet-50 text-violet-800 font-medium' : 'text-slate-700 hover:bg-white'}`}
              >
                {item.label}
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          {menuKey === 'girisAidati' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={gaMainSearch} onChange={(e) => setGaMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setGaBindOpen(true)}>GA Template Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>GA Kodu</th>
                        <th>Döviz</th>
                        <th>GA Tipi</th>
                        <th>Taksit Tipi</th>
                        <th>Taksit Adedi</th>
                        <th>Peşinat</th>
                        <th>Taksit</th>
                        <th>Erteleme</th>
                        <th>Toplam Tutar</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGaLinked.map((row) => (
                        <tr key={row.gaKodu}>
                          <td className="font-semibold">{row.gaKodu}</td>
                          <td>{row.doviz}</td>
                          <td>{row.gaTipi}</td>
                          <td>{row.taksitTipi}</td>
                          <td>{row.taksitAdedi}</td>
                          <td>{row.pesinat}</td>
                          <td>{row.taksit}</td>
                          <td>{row.erteleme}</td>
                          <td>{row.toplamTutar}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={GA_ROW_ACTIONS} onAction={handleGaRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'ygkParam' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={ygkMainSearch} onChange={(e) => setYgkMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setYgkBindOpen(true)}>YGK Template Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-xs">
                    <thead>
                      <tr>
                        <th>YGK Kodu</th>
                        <th>Geçerlilik Tarihi</th>
                        <th>Döviz</th>
                        <th>Tablo Tipi</th>
                        <th>YGK Adı</th>
                        <th>Versiyon</th>
                        <th>Yıl Tipi</th>
                        <th>Limit Tutar Tipi</th>
                        <th>Kademe Tipi</th>
                        <th>Yıl Bazında Sıfırla</th>
                        <th>YGK Hesaplama Kuralı</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYgkLinked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.ygkKodu}</td>
                          <td>{row.gecerlilikTarihi}</td>
                          <td>{row.doviz}</td>
                          <td>{row.tabloTipi}</td>
                          <td className="font-medium">{row.ygkAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.yilTipi}</td>
                          <td>{row.limitTutarTipi}</td>
                          <td>{row.kademeTipi}</td>
                          <td>{ygkSifirlaCell(row.yilBazindaSifirla)}</td>
                          <td>{row.ygkHesaplamaKurali}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={YGK_ROW_ACTIONS} onAction={handleYgkRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'ygkMuafiyet' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={ygkMuafMainSearch} onChange={(e) => setYgkMuafMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setYgkMuafBindOpen(true)}>Muafiyet Template Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>YGK Muafiyet Kodu</th>
                        <th>YGK Muafiyet Adı</th>
                        <th>Versiyon</th>
                        <th>Yıl</th>
                        <th>Toplam Ödenmiş Kp</th>
                        <th>Döviz</th>
                        <th>YGK Muafiyet Oranı</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYgkMuafLinked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.muafKodu}</td>
                          <td>{row.muafAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.yil}</td>
                          <td>{row.toplamOdenmisKp}</td>
                          <td>{row.doviz}</td>
                          <td>{row.oran}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={YGK_MUAF_ROW_ACTIONS} onAction={handleYgkMuafRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'araVerme' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={araVermeMainSearch} onChange={(e) => setAraVermeMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setAraVermeBindOpen(true)}>Ara Verme Template&apos;i Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>Ara Verme Kodu</th>
                        <th>Ara Verme Adı</th>
                        <th>Versiyon</th>
                        <th>Tutar</th>
                        <th>Hesaplama Kuralı</th>
                        <th>Ön Koşul</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAraVermeLinked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.avKodu}</td>
                          <td>{row.avAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.tutar}</td>
                          <td>{row.hesaplamaKurali}</td>
                          <td>{row.onKosul}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={ARA_VERME_ROW_ACTIONS} onAction={handleAraVermeRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'kesintiBes30' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={kesintiBes30MainSearch} onChange={(e) => setKesintiBes30MainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setKesintiBes30BindOpen(true)}>Kesinti BES3.0 Templatı Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>Kesinti BES3.0 Kodu</th>
                        <th>Kesinti BES3.0 Adı</th>
                        <th>Versiyon</th>
                        <th>Yıl</th>
                        <th>Max Kesinti Oranı</th>
                        <th>Max Kesinti Tutarı</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKesintiBes30Linked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.kbKodu}</td>
                          <td>{row.kbAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.yil}</td>
                          <td>{row.maxKesintiOrani}</td>
                          <td>{row.maxKesintiTutari}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={KESINTI_BES30_ROW_ACTIONS} onAction={handleKesintiBes30RowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'ygkBes30' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={ygkBes30MainSearch} onChange={(e) => setYgkBes30MainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setYgkBes30BindOpen(true)}>YGK BES3.0 Templatı Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm min-w-[1100px]">
                    <thead>
                      <tr>
                        <th>YGK BES3.0 Kodu</th>
                        <th>YGK BES3.0 Adı</th>
                        <th>Versiyon</th>
                        <th>Döviz Kodu</th>
                        <th>YGK Kesinti Tipi</th>
                        <th>Oran</th>
                        <th>Yıllık Tutar</th>
                        <th>YGK Formülü</th>
                        <th>Kesinti Dönemi</th>
                        <th>Sözleşme Yılı Aralığı</th>
                        <th>Birikim</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYgkBes30Linked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.ybKodu}</td>
                          <td>{row.ybAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.dovizKodu}</td>
                          <td>{row.ygkKesintiTipi}</td>
                          <td>{row.oran}</td>
                          <td>{row.yillikTutar}</td>
                          <td>{row.ygkFormulu}</td>
                          <td>{row.kesintiDonemi}</td>
                          <td>{row.sozlesmeYiliAraligi}</td>
                          <td>{row.birikim}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={YGK_BES30_ROW_ACTIONS} onAction={handleYgkBes30RowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-sm text-slate-500">
              Bu kesinti bölümü henüz tanımlanmadı.
            </div>
          )}
        </main>
      </div>

      <Modal
        open={gaBindOpen}
        onClose={() => setGaBindOpen(false)}
        title="Giriş Aidatı Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setGaBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="GA kodu, döviz veya tip ile ara..."
              value={gaCatSearch}
              onChange={(e) => setGaCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>GA Kodu</th>
                  <th>Doviz</th>
                  <th>GA Tipi</th>
                  <th>Taksit Tipi</th>
                  <th>Taksit Adedi</th>
                  <th>Peşinat</th>
                  <th>Taksit</th>
                  <th>Erteleme</th>
                  <th>Toplam Tutar</th>
                </tr>
              </thead>
              <tbody>
                {filteredGaCatalog.map((row) => (
                  <tr
                    key={row.gaKodu}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addGaFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.gaKodu}</td>
                    <td>{row.doviz}</td>
                    <td>{row.gaTipi}</td>
                    <td>{row.taksitTipi}</td>
                    <td>{row.taksitAdedi}</td>
                    <td>{row.pesinat}</td>
                    <td>{row.taksit}</td>
                    <td>{row.erteleme}</td>
                    <td>{row.toplamTutar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={ygkBindOpen}
        onClose={() => setYgkBindOpen(false)}
        title="YGK Parametreleri Detayları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setYgkBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="YGK kodu, ad veya döviz ile ara..."
              value={ygkCatSearch}
              onChange={(e) => setYgkCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-xs">
              <thead>
                <tr>
                  <th>YGK Kodu</th>
                  <th>YGK Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Döviz</th>
                  <th>Tablo Tipi</th>
                  <th>Yıl Tipi</th>
                  <th>Limit Tutar Tipi</th>
                  <th>YGK Hesaplama Kuralı</th>
                  <th>Kademe Tipi</th>
                  <th>Yıl Bazında Sıfırla</th>
                </tr>
              </thead>
              <tbody>
                {filteredYgkCatalog.map((row) => (
                  <tr
                    key={`${row.ygkKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addYgkFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.ygkKodu}</td>
                    <td>{row.ygkAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.doviz}</td>
                    <td>{row.tabloTipi}</td>
                    <td>{row.yilTipi}</td>
                    <td>{row.limitTutarTipi}</td>
                    <td>{row.ygkHesaplamaKurali}</td>
                    <td>{row.kademeTipi}</td>
                    <td>{ygkSifirlaCell(row.yilBazindaSifirla)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(gaInspectRow)}
        onClose={() => setGaInspectRow(null)}
        title={gaInspectRow ? `İncele — ${gaInspectRow.gaKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setGaInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {gaInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(gaInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={Boolean(ygkInspectRow)}
        onClose={() => setYgkInspectRow(null)}
        title={ygkInspectRow ? `İncele — ${ygkInspectRow.ygkKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setYgkInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {ygkInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(ygkInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{typeof v === 'boolean' ? (v ? 'Evet' : 'Hayır') : String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={ygkVersionsModal.open}
        onClose={() => setYgkVersionsModal({ open: false, title: '', rows: [] })}
        title={ygkVersionsModal.title}
        footer={<PrimaryButton onClick={() => setYgkVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {ygkVersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {ygkVersionsModal.rows.map((v) => (
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
        open={ygkMuafBindOpen}
        onClose={() => setYgkMuafBindOpen(false)}
        title="YGK Muafiyet Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setYgkMuafBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Muafiyet kodu, ad veya döviz ile ara..."
              value={ygkMuafCatSearch}
              onChange={(e) => setYgkMuafCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>YGK Muafiyet Kodu</th>
                  <th>YGK Muafiyet Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Yıl</th>
                  <th>Toplam Ödenmiş Kp</th>
                  <th>Döviz</th>
                  <th>YGK Muafiyet Oranı</th>
                </tr>
              </thead>
              <tbody>
                {filteredYgkMuafCatalog.map((row) => (
                  <tr
                    key={`${row.muafKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addYgkMuafFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.muafKodu}</td>
                    <td>{row.muafAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.yil}</td>
                    <td>{row.toplamOdenmisKp}</td>
                    <td>{row.doviz}</td>
                    <td>{row.oran}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(ygkMuafInspectRow)}
        onClose={() => setYgkMuafInspectRow(null)}
        title={ygkMuafInspectRow ? `İncele — ${ygkMuafInspectRow.muafKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setYgkMuafInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {ygkMuafInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(ygkMuafInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={ygkMuafVersionsModal.open}
        onClose={() => setYgkMuafVersionsModal({ open: false, title: '', rows: [] })}
        title={ygkMuafVersionsModal.title}
        footer={<PrimaryButton onClick={() => setYgkMuafVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {ygkMuafVersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {ygkMuafVersionsModal.rows.map((v) => (
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
        open={araVermeBindOpen}
        onClose={() => setAraVermeBindOpen(false)}
        title="Ara Verme Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setAraVermeBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Ara verme kodu, ad veya tutar ile ara..."
              value={araVermeCatSearch}
              onChange={(e) => setAraVermeCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Ara Verme Kodu</th>
                  <th>Ara Verme Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Tutar</th>
                  <th>Hesaplama Kuralı</th>
                  <th>Ön Koşul</th>
                </tr>
              </thead>
              <tbody>
                {filteredAraVermeCatalog.map((row) => (
                  <tr
                    key={`${row.avKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addAraVermeFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.avKodu}</td>
                    <td>{row.avAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.tutar}</td>
                    <td>{row.hesaplamaKurali}</td>
                    <td>{row.onKosul}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(araVermeInspectRow)}
        onClose={() => setAraVermeInspectRow(null)}
        title={araVermeInspectRow ? `İncele — ${araVermeInspectRow.avKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setAraVermeInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {araVermeInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(araVermeInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={araVermeVersionsModal.open}
        onClose={() => setAraVermeVersionsModal({ open: false, title: '', rows: [] })}
        title={araVermeVersionsModal.title}
        footer={<PrimaryButton onClick={() => setAraVermeVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {araVermeVersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {araVermeVersionsModal.rows.map((v) => (
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
        open={kesintiBes30BindOpen}
        onClose={() => setKesintiBes30BindOpen(false)}
        title="Kesinti BES3.0 Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setKesintiBes30BindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Kod, ad, yıl veya oran ile ara..."
              value={kesintiBes30CatSearch}
              onChange={(e) => setKesintiBes30CatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Kesinti BES3.0 Kodu</th>
                  <th>Kesinti BES3.0 Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Yıl</th>
                  <th>Max Kesinti Oranı</th>
                  <th>Max Kesinti Tutarı</th>
                </tr>
              </thead>
              <tbody>
                {filteredKesintiBes30Catalog.map((row) => (
                  <tr
                    key={`${row.kbKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addKesintiBes30FromCatalog(row)}
                  >
                    <td className="font-semibold">{row.kbKodu}</td>
                    <td>{row.kbAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.yil}</td>
                    <td>{row.maxKesintiOrani}</td>
                    <td>{row.maxKesintiTutari}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(kesintiBes30InspectRow)}
        onClose={() => setKesintiBes30InspectRow(null)}
        title={kesintiBes30InspectRow ? `İncele — ${kesintiBes30InspectRow.kbKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setKesintiBes30InspectRow(null)}>Tamam</PrimaryButton>}
      >
        {kesintiBes30InspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(kesintiBes30InspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={kesintiBes30VersionsModal.open}
        onClose={() => setKesintiBes30VersionsModal({ open: false, title: '', rows: [] })}
        title={kesintiBes30VersionsModal.title}
        footer={<PrimaryButton onClick={() => setKesintiBes30VersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {kesintiBes30VersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {kesintiBes30VersionsModal.rows.map((v) => (
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
        open={ygkBes30BindOpen}
        onClose={() => setYgkBes30BindOpen(false)}
        title="YGK BES3.0 Parametre Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setYgkBes30BindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Kod, ad, döviz veya kesinti tipi ile ara..."
              value={ygkBes30CatSearch}
              onChange={(e) => setYgkBes30CatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm min-w-[1000px]">
              <thead>
                <tr>
                  <th>YGK BES3.0 Kodu</th>
                  <th>YGK BES3.0 Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Döviz</th>
                  <th>YGK Kesinti Tipi</th>
                  <th>Oran</th>
                  <th>Yıllık Tutar</th>
                  <th>YGK Formülü</th>
                  <th>Kesinti Dönemi</th>
                  <th>Sözleşme Yılı</th>
                  <th>Birikim</th>
                </tr>
              </thead>
              <tbody>
                {filteredYgkBes30Catalog.map((row) => (
                  <tr
                    key={`${row.ybKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addYgkBes30FromCatalog(row)}
                  >
                    <td className="font-semibold">{row.ybKodu}</td>
                    <td>{row.ybAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.doviz}</td>
                    <td>{row.ygkKesintiTipi}</td>
                    <td>{row.oran}</td>
                    <td>{row.yillikTutar}</td>
                    <td>{row.ygkFormulu}</td>
                    <td>{row.kesintiDonemi}</td>
                    <td>{row.sozlesmeYili}</td>
                    <td>{row.birikim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(ygkBes30InspectRow)}
        onClose={() => setYgkBes30InspectRow(null)}
        title={ygkBes30InspectRow ? `İncele — ${ygkBes30InspectRow.ybKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setYgkBes30InspectRow(null)}>Tamam</PrimaryButton>}
      >
        {ygkBes30InspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(ygkBes30InspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={ygkBes30VersionsModal.open}
        onClose={() => setYgkBes30VersionsModal({ open: false, title: '', rows: [] })}
        title={ygkBes30VersionsModal.title}
        footer={<PrimaryButton onClick={() => setYgkBes30VersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {ygkBes30VersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {ygkBes30VersionsModal.rows.map((v) => (
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
        open={Boolean(ygkBes30DetailsRow)}
        onClose={() => { setYgkBes30DetailsRow(null); setYgkBes30DetailsTab('muafiyet') }}
        title={ygkBes30DetailsRow ? `${ygkBes30DetailsRow.ybKodu} — ${ygkBes30DetailsRow.ybAdi}` : ''}
        description="YGK BES 3.0 parametre detayı"
        size="xl"
        footer={<PrimaryButton onClick={() => { setYgkBes30DetailsRow(null); setYgkBes30DetailsTab('muafiyet') }}>Tamam</PrimaryButton>}
      >
        {ygkBes30DetailsRow && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Geçerlilik Tarihi: </span>
                <span className="font-medium text-slate-800">{ygkBes30DetailsRow.gecerlilikTarihi}</span>
              </div>
              <div>
                <span className="text-slate-500">YGK Kesinti Tipi: </span>
                <span className="font-medium text-slate-800">{ygkBes30DetailsRow.ygkKesintiTipi}</span>
              </div>
              <div>
                <span className="text-slate-500">Birikim Tipi: </span>
                <span className="font-medium text-slate-800">{ygkBes30DetailsRow.birikimTipi || '—'}</span>
              </div>
            </div>

            <div className="flex gap-0 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setYgkBes30DetailsTab('muafiyet')}
                className={`px-4 py-2.5 text-sm font-medium border border-b-0 rounded-t-md -mb-px ${ygkBes30DetailsTab === 'muafiyet' ? 'bg-violet-50 text-violet-800 border-slate-200' : 'text-slate-600 border-transparent hover:bg-slate-50'}`}
              >
                Muafiyet Parametreleri
              </button>
              <button
                type="button"
                onClick={() => setYgkBes30DetailsTab('kp')}
                className={`px-4 py-2.5 text-sm font-medium border border-b-0 rounded-t-md -mb-px ${ygkBes30DetailsTab === 'kp' ? 'bg-violet-50 text-violet-800 border-slate-200' : 'text-slate-600 border-transparent hover:bg-slate-50'}`}
              >
                Katkı Payı Aralık Tanımları
              </button>
            </div>

            {ygkBes30DetailsTab === 'muafiyet' ? (
              <div className="space-y-3">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara..."
                    value={ygkBes30DetailsMuafSearch}
                    onChange={(e) => setYgkBes30DetailsMuafSearch(e.target.value)}
                  />
                </div>
                <div className="overflow-auto border border-slate-200 rounded-lg max-h-[320px]">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>Min. Tutar</th>
                        <th>Max. Tutar</th>
                        <th>Oran</th>
                        <th>Tutar</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ygkBes30MuafBandsFiltered.length ? (
                        ygkBes30MuafBandsFiltered.map((b) => (
                          <tr key={b.id}>
                            <td>{b.minTutar}</td>
                            <td>{b.maxTutar}</td>
                            <td>{b.oran}</td>
                            <td>{b.tutar}</td>
                            <td className="text-right">
                              <RowActions row={b} actions={YGK_BES30_MUAF_BAND_INNER_ACTIONS} onAction={() => {}} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-slate-500 py-6">Kayıt bulunamadı.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span>Listelenen: {ygkBes30MuafBandsFiltered.length}</span>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums">2 / 16</span>
                    <select className="border border-slate-200 rounded-md px-2 py-1 text-xs bg-white text-slate-700" aria-label="Sayfa başına">
                      <option>10 Sayfa Başına Listelenen</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-auto border border-slate-200 rounded-lg max-h-[360px]">
                <table className="w-full grid-table text-sm">
                  <thead>
                    <tr>
                      <th>Min. KP</th>
                      <th>Max. KP</th>
                      <th>Oran</th>
                      <th>Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(YGK_BES30_KP_ARALIK_BY_KOD[ygkBes30DetailsRow.ybKodu] || []).length ? (
                      YGK_BES30_KP_ARALIK_BY_KOD[ygkBes30DetailsRow.ybKodu].map((r) => (
                        <tr key={r.id}>
                          <td>{r.minKp}</td>
                          <td>{r.maxKp}</td>
                          <td>{r.oran}</td>
                          <td>{r.tutar}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-slate-500 py-6">Tanımlı katkı payı aralığı yok.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default function UrunPlanTarifeTanimlari() {
  const [view, setView] = useState('grid')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(() => urunPlanTarifeKartlari.map((x) => ({ ...x })))
  const [plansByProduct, setPlansByProduct] = useState(() => Object.fromEntries(Object.entries(urunPlanlari).map(([k, v]) => [k, v.map((x) => ({ ...x }))])))
  const [formOpen, setFormOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'Ferdi', tarih: '', toplam: 0, aktif: 0, kapali: 0 })
  const [createWizardOpen, setCreateWizardOpen] = useState(false)
  const [createStep, setCreateStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [createMethod, setCreateMethod] = useState('')
  const [existingProductSearch, setExistingProductSearch] = useState('')
  const [createForm, setCreateForm] = useState({ sozlesmeTipi: 'Ferdi', urunNo: '', urunAdi: '', aciklama: '' })
  const [selectedExistingProductId, setSelectedExistingProductId] = useState('')
  const [planForm, setPlanForm] = useState({ planAdi: '', planKodu: '', baslangicTarihi: normalizeDate(), katilimEsasli: false, hedefKitle: '' })
  const [planSetupContext, setPlanSetupContext] = useState(null)
  const [planSetupView, setPlanSetupView] = useState('board')
  const [planBelgeleriByPlanKey, setPlanBelgeleriByPlanKey] = useState({})
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [planListActiveOnly, setPlanListActiveOnly] = useState(false)

  const openPlanList = (urun, { activeOnly = false } = {}) => {
    setSelected(urun)
    setPlanListActiveOnly(activeOnly)
    setMenuOpenId(null)
  }

  const openPlanDetail = (plan) => {
    if (!selected) return
    setPlanSetupContext({ urun: selected, plan, returnToPlans: true, activeOnly: planListActiveOnly })
    setPlanSetupView('board')
    setSelected(null)
  }

  const filtered = useMemo(() => {
    if (!search) return products
    return products.filter((u) => u.ad.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()))
  }, [search, products])

  const getPlans = (urunId) => plansByProduct[urunId] || []
  const bireyselProducts = useMemo(() => products.filter((p) => (p.tipler || '').toLowerCase().includes('bireysel emeklilik')), [products])
  const selectedExistingProduct = useMemo(() => products.find((p) => p.id === selectedExistingProductId) || null, [products, selectedExistingProductId])

  const recalcCounts = (urunId, currentProducts, currentPlansByProduct) => {
    const plans = currentPlansByProduct[urunId] || []
    const toplam = plans.length
    const aktif = plans.filter((p) => p.durum === 'Yururlukte').length
    const kapali = Math.max(toplam - aktif, 0)
    return currentProducts.map((p) => (p.id === urunId ? { ...p, toplam, aktif, kapali } : p))
  }

  const showVersions = (title, rows, renderRow) => {
    const first = rows[0] ? renderRow(rows[0]) : null
    const columns = first ? Object.keys(first) : []
    setInfoModal({
      open: true,
      title,
      body: rows.length ? (
        <div className="overflow-auto border border-slate-200 rounded-md">
          <table className="w-full grid-table text-sm">
            <thead><tr>{columns.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, idx) => {
              const mapped = renderRow(r)
              return <tr key={idx}>{columns.map((c) => <td key={c}>{mapped[c]}</td>)}</tr>
            })}</tbody>
          </table>
        </div>
      ) : <div className="text-sm text-slate-500">Kayit bulunamadi.</div>,
    })
  }

  const createCopiedId = (baseId, existsFn) => {
    let i = 1
    let candidate = `${baseId}-CP`
    while (existsFn(candidate)) {
      i += 1
      candidate = `${baseId}-CP${i}`
    }
    return candidate
  }

  const startExistingProductPlanFlow = (product) => {
    if (!product) return
    setSelected(null)
    setSelectedExistingProductId(product.id)
    const nextNo = getPlans(product.id).length + 1
    setPlanForm({
      planAdi: `${product.ad} - Yeni Plan`,
      planKodu: `${product.id}-P${nextNo}`,
      baslangicTarihi: normalizeDate(),
      katilimEsasli: false,
      hedefKitle: '',
    })
    setCreateWizardOpen(true)
    setCreateStep(5)
  }

  const openCreateProduct = () => {
    setCreateWizardOpen(true)
    setCreateStep(1)
    setSelectedBranch(null)
    setCreateMethod('')
    setCreateForm({ sozlesmeTipi: 'Ferdi', urunNo: '', urunAdi: '', aciklama: '' })
  }

  const openEditProduct = (row) => {
    setEditingProductId(row.id)
    setForm({ ...row })
    setFormOpen(true)
  }

  const saveProduct = () => {
    if (!form.id.trim()) return alert('Ürün Kodu zorunludur.')
    if (!form.ad.trim()) return alert('Ürün Adı zorunludur.')
    const payload = normalizeProduct(form)
    const duplicate = products.some((p) => p.id === payload.id && p.id !== editingProductId)
    if (duplicate) return alert('Bu Ürün Kodu zaten mevcut.')

    if (editingProductId) {
      setProducts((prev) => prev.map((p) => (p.id === editingProductId ? payload : p)))
      if (editingProductId !== payload.id) {
        setPlansByProduct((prev) => {
          const existingPlans = prev[editingProductId] || []
          const { [editingProductId]: _, ...rest } = prev
          return { ...rest, [payload.id]: existingPlans }
        })
      }
      if (selected?.id === editingProductId) setSelected(payload)
    } else {
      setProducts((prev) => [...prev, payload])
      setPlansByProduct((prev) => ({ ...prev, [payload.id]: [] }))
    }
    setFormOpen(false)
  }

  const closeCreateWizard = () => {
    setCreateWizardOpen(false)
    setCreateStep(1)
    setSelectedBranch(null)
    setCreateMethod('')
    setExistingProductSearch('')
    setSelectedExistingProductId('')
  }

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch)
    if (branch.key === 'bireysel' || branch.key === 'hayat' || branch.key === 'saglik' || branch.key === 'elementer') {
      setCreateStep(2)
      return
    }
    alert('Bu branş için akış henüz eklenmedi.')
  }

  const handleMethodSelect = (method) => {
    setCreateMethod(method)
    if (method === 'new') {
      setCreateForm(createFormForBranch(selectedBranch?.key))
      setCreateStep(3)
      return
    }
    setCreateStep(4)
  }

  const hayatUrunTipiOptions =
    createForm.altBrans === 'Ferdi Kaza' ? HAYAT_URUN_TIPI_FERDI : HAYAT_URUN_TIPI_HAYAT
  const hayatSureTipiAktif = createForm.urunTipi === 'Risk'

  const setHayatAltBrans = (altBrans) => {
    setCreateForm((prev) => {
      const next = { ...prev, altBrans }
      if (altBrans === 'Ferdi Kaza') {
        next.urunTipi = 'Risk'
        next.sureTipi = prev.sureTipi || 'Yıllık'
      }
      return next
    })
  }

  const setHayatUrunTipi = (urunTipi) => {
    setCreateForm((prev) => {
      const next = { ...prev, urunTipi }
      if (urunTipi !== 'Risk') {
        next.sureTipi = ''
      } else if (!next.sureTipi) {
        next.sureTipi = 'Yıllık'
      }
      return next
    })
  }

  const selectExistingProduct = (product) => {
    startExistingProductPlanFlow(product)
    setCreateStep(5)
  }

  const handlePlanMethodSelect = (method) => {
    if (method === 'new') {
      setCreateStep(6)
      return
    }
    alert('Bu plan oluşturma yöntemi sonraki adımda tamamlanacak.')
  }

  const handleSavePlanFromWizard = () => {
    if (!selectedExistingProduct) return alert('Lütfen bir ürün seçiniz.')
    if (!planForm.planAdi.trim()) return alert('Plan adı zorunludur.')
    if (!planForm.planKodu.trim()) return alert('Plan kodu zorunludur.')
    const existing = getPlans(selectedExistingProduct.id)
    if (existing.some((p) => p.id === planForm.planKodu.trim())) return alert('Bu plan kodu zaten mevcut.')
    const payload = normalizePlan({
      id: planForm.planKodu.trim(),
      ad: planForm.planAdi.trim(),
      durum: 'Taslak',
      oran: 0,
      tarih: planForm.baslangicTarihi || normalizeDate(),
      katilimEsasli: planForm.katilimEsasli,
      hedefKitle: planForm.hedefKitle,
    })
    setPlansByProduct((prev) => {
      const next = [...(prev[selectedExistingProduct.id] || []), payload]
      const nextMap = { ...prev, [selectedExistingProduct.id]: next }
      setProducts((prodPrev) => recalcCounts(selectedExistingProduct.id, prodPrev, nextMap))
      return nextMap
    })
    const isBireysel = (selectedExistingProduct.tipler || '').toLowerCase().includes('bireysel emeklilik')
    const tip = (selectedExistingProduct.sozlesmeTipi || '').toUpperCase()
    if (isBireysel && (tip === 'FERDI' || tip === 'GRUP' || tip === 'OKS' || tip === 'EGP' || tip === 'OKS-EGP')) {
      setPlanSetupContext({ urun: selectedExistingProduct, plan: payload })
      setPlanSetupView(isOksOnlySozlesmeTipi(tip) ? 'genel' : 'board')
    }
    closeCreateWizard()
  }

  const handleCreateFromWizard = () => {
    if (!createForm.urunNo.trim()) return alert('Ürün No zorunludur.')
    if (!createForm.urunAdi.trim()) return alert('Ürün Adı zorunludur.')
    const branchKey = selectedBranch?.key
    const isHayat = branchKey === 'hayat'
    const isSaglik = branchKey === 'saglik'
    const isElementer = branchKey === 'elementer'
    if (isHayat) {
      if (!createForm.urunTipi) return alert('Ürün Tipi zorunludur.')
      if (createForm.urunTipi === 'Risk' && !createForm.sureTipi) return alert('Süre Tipi zorunludur.')
    }
    if (isSaglik) {
      if (!createForm.urunTipi) return alert('Ürün Tipi zorunludur.')
      if (!createForm.baslangicTarihi) return alert('Başlangıç Tarihi zorunludur.')
    }
    if (isElementer) {
      if (!createForm.anaBrans) return alert('Ana Branş zorunludur.')
      if (!createForm.baslangicTarihi) return alert('Başlangıç Tarihi zorunludur.')
    }
    const tipler = isHayat
      ? [
          'Hayat & Kaza',
          createForm.altBrans,
          createForm.urunTipi,
          createForm.urunTipi === 'Risk' ? createForm.sureTipi : null,
        ]
          .filter(Boolean)
          .join('  ·  ')
      : isSaglik
        ? ['Sağlık', createForm.sagmerBrans, createForm.urunTipi].join('  ·  ')
        : isElementer
          ? ['Elementer', createForm.anaBrans].join('  ·  ')
          : `Bireysel  ·  ${selectedBranch?.label || 'Bireysel Emeklilik'}`
    const payload = normalizeProduct({
      id: createForm.urunNo.trim(),
      ad: createForm.urunAdi.trim(),
      tipler,
      sozlesmeTipi: isHayat ? createForm.altBrans : isSaglik ? createForm.urunTipi : isElementer ? createForm.anaBrans : createForm.sozlesmeTipi,
      altBrans: isHayat ? createForm.altBrans : undefined,
      anaBrans: isElementer ? createForm.anaBrans : undefined,
      sagmerBrans: isSaglik ? createForm.sagmerBrans : undefined,
      urunTipi: isHayat || isSaglik ? createForm.urunTipi : undefined,
      sureTipi: isHayat && createForm.urunTipi === 'Risk' ? createForm.sureTipi : undefined,
      sagmerTarifeKodu: isSaglik ? createForm.sagmerTarifeKodu : undefined,
      yasalUrunKodu: isElementer ? createForm.yasalUrunKodu : undefined,
      aciklama: createForm.aciklama,
      tarih: isSaglik || isElementer ? normalizeDate(createForm.baslangicTarihi) : normalizeDate(),
      toplam: 0,
      aktif: 0,
      kapali: 0,
    })
    const duplicate = products.some((p) => p.id === payload.id)
    if (duplicate) return alert('Bu Ürün No zaten mevcut.')
    setProducts((prev) => [...prev, payload])
    setPlansByProduct((prev) => ({ ...prev, [payload.id]: [] }))
    setSelected(payload)
    closeCreateWizard()
  }

  const handleSavePlan = (payload, editingId) => {
    if (!selected) return
    setPlansByProduct((prev) => {
      const existing = prev[selected.id] || []
      const next = editingId ? existing.map((p) => (p.id === editingId ? payload : p)) : [...existing, payload]
      const nextMap = { ...prev, [selected.id]: next }
      setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
      return nextMap
    })
  }

  const updatePlanRow = (rowId, patch) => {
    if (!selected) return
    setPlansByProduct((prev) => {
      const existing = prev[selected.id] || []
      const next = existing.map((p) => (p.id === rowId ? normalizePlan({ ...p, ...patch, tarih: normalizeDate() }) : p))
      const nextMap = { ...prev, [selected.id]: next }
      setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
      return nextMap
    })
  }

  const handlePlanAction = (key, row) => {
    if (!selected) return
    if (key === 'view') {
      openPlanDetail(row)
      return
    }
    if (key === 'copy') {
      const newId = createCopiedId(row.id, (id) => getPlans(selected.id).some((p) => p.id === id))
      handleSavePlan(normalizePlan({ ...row, id: newId, ad: `${row.ad} (Kopya)`, tarih: normalizeDate() }), null)
      return
    }
    if (key === 'version') {
      const base = row.id.split('-V')[0]
      const versionNo = getPlans(selected.id).filter((p) => p.id.startsWith(base)).length + 1
      handleSavePlan(normalizePlan({ ...row, id: `${base}-V${versionNo}`, ad: `${row.ad} v${versionNo}`, tarih: normalizeDate(), durum: 'Taslak' }), null)
      return
    }
    if (key === 'history') {
      const base = row.id.split('-V')[0]
      const versions = getPlans(selected.id).filter((p) => p.id.startsWith(base))
      showVersions(`${row.id} - Versiyonlar`, versions, (r) => ({
        'Plan No': r.id,
        'Plan Adi': r.ad,
        Durum: formatPlanDurum(r.durum),
        'Tamamlanma %': r.oran,
        Tarih: r.tarih,
      }))
      return
    }
    if (key === 'export') {
      const blob = new Blob([JSON.stringify(row, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${row.id}.json`
      a.click()
      URL.revokeObjectURL(url)
      return
    }
    if (key === 'yururlugeAl') {
      if (row.durum !== 'Taslak') return
      if (!window.confirm(`${row.ad} yürürlüğe alınsın mı?`)) return
      updatePlanRow(row.id, { durum: 'Yururlukte', oran: 100, satisKapali: false })
      return
    }
    if (key === 'satisaKapa') {
      if (row.durum !== 'Yururlukte') return
      if (!window.confirm(`${row.ad} satışa kapatılsın mı?`)) return
      updatePlanRow(row.id, { satisKapali: true })
      return
    }
    if (key === 'yururluktenKaldir') {
      if (row.durum !== 'Yururlukte') return
      if (!window.confirm(`${row.ad} yürürlükten kaldırılsın mı?`)) return
      updatePlanRow(row.id, { durum: 'Taslak', satisKapali: false })
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Plan silinsin mi?')) return
      setPlansByProduct((prev) => {
        const existing = prev[selected.id] || []
        const next = existing.filter((p) => p.id !== row.id)
        const nextMap = { ...prev, [selected.id]: next }
        setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
        return nextMap
      })
    }
  }

  const handleUrunAction = (key, row) => {
    setMenuOpenId(null)
    if (key === 'view') { openPlanList(row); return }
    if (key === 'edit') { openEditProduct(row); return }
    if (key === 'newPlan') { startExistingProductPlanFlow(row); return }
    if (key === 'copy') {
      const newId = createCopiedId(row.id, (id) => products.some((p) => p.id === id))
      const copied = normalizeProduct({ ...row, id: newId, ad: `${row.ad} (Kopya)`, tarih: normalizeDate() }, row)
      setProducts((prev) => [...prev, copied])
      setPlansByProduct((prev) => ({ ...prev, [newId]: (prev[row.id] || []).map((p) => ({ ...p, id: p.id.replace(row.id, newId), ad: `${p.ad} (Kopya)` })) }))
      return
    }
    if (key === 'version') {
      const base = row.id.split('-V')[0]
      const versions = products.filter((p) => p.id.startsWith(base))
      const newId = `${base}-V${versions.length + 1}`
      const versioned = normalizeProduct({ ...row, id: newId, ad: `${row.ad} v${versions.length + 1}`, tarih: normalizeDate() }, row)
      setProducts((prev) => [...prev, versioned])
      setPlansByProduct((prev) => ({ ...prev, [newId]: (prev[row.id] || []).map((p) => ({ ...p, id: p.id.replace(row.id, newId) })) }))
      return
    }
    if (key === 'history') {
      const versions = products.filter((p) => p.id.startsWith(row.id.split('-V')[0])).sort((a, b) => b.id.localeCompare(a.id))
      showVersions(`${row.id} - Versiyonlar`, versions, (r) => ({
        'Ürün Kodu': r.id,
        'Ürün Adı': r.ad,
        'Sözleşme Tipi': r.sozlesmeTipi,
        Tarih: r.tarih,
      }))
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Ürün silinsin mi?')) return
      setProducts((prev) => prev.filter((p) => p.id !== row.id))
      setPlansByProduct((prev) => {
        const { [row.id]: _, ...rest } = prev
        return rest
      })
      if (selected?.id === row.id) setSelected(null)
    }
  }

  if (selected) {
    return (
      <PlanList
        urun={selected}
        planlar={getPlans(selected.id)}
        activeOnly={planListActiveOnly}
        onBack={() => {
          setSelected(null)
          setPlanListActiveOnly(false)
        }}
        onSavePlan={handleSavePlan}
        onPlanAction={handlePlanAction}
        onStartNewPlanFlow={startExistingProductPlanFlow}
        onPlanDetail={openPlanDetail}
      />
    )
  }

  if (planSetupContext) {
    if (planSetupView === 'genel') {
      return <PlanGenelBilgilerScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'fonlar') {
      return <FonlarVeFonKarmalariScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'katki') {
      return <KatkiPayiTanimlariScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'kesinti') {
      return <KesintilerScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'diger') {
      return <DigerTanimlarScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'egpDetay') {
      return <EgpDetayParametreleriScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'belgeler') {
      const belgeKey = planBelgeleriStorageKey(planSetupContext.urun, planSetupContext.plan)
      return (
        <PlanBelgeleriScreen
          plan={planSetupContext.plan}
          urun={planSetupContext.urun}
          onBack={() => setPlanSetupView('board')}
          rows={planBelgeleriByPlanKey[belgeKey] || []}
          onRowsChange={(updater) => {
            setPlanBelgeleriByPlanKey((prev) => {
              const cur = prev[belgeKey] || []
              const next = typeof updater === 'function' ? updater(cur) : updater
              return { ...prev, [belgeKey]: next }
            })
          }}
        />
      )
    }
    return <PlanConfigurationBoard plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => {
      if (planSetupContext.returnToPlans) {
        setSelected(planSetupContext.urun)
        setPlanListActiveOnly(planSetupContext.activeOnly ?? false)
        setPlanSetupContext(null)
        setPlanSetupView('board')
        return
      }
      setPlanSetupContext(null)
    }} onOpenCard={(cardId) => {
      if (cardId === 'genel') setPlanSetupView('genel')
      else if (cardId === 'fonlar') setPlanSetupView('fonlar')
      else if (cardId === 'katki') setPlanSetupView('katki')
      else if (cardId === 'kesinti') setPlanSetupView('kesinti')
      else if (cardId === 'diger') setPlanSetupView('diger')
      else if (cardId === 'egpDetay') setPlanSetupView('egpDetay')
      else if (cardId === 'belge') setPlanSetupView('belgeler')
      else alert('Bu kartın detay ekranı sıradaki adımda eklenecek.')
    }} />
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Ürün - Plan - Tarife Tanımları"
        description=""
        right={
          <>
            <OutlineButton className="text-slate-600"><Filter className="w-4 h-4" /> Filtrele</OutlineButton>
            <OutlineButton onClick={() => setView('grid')} className={view === 'grid' ? 'border-violet-300 text-violet-700 bg-violet-50' : ''}><LayoutGrid className="w-4 h-4" /></OutlineButton>
            <OutlineButton onClick={() => setView('list')} className={view === 'list' ? 'border-violet-300 text-violet-700 bg-violet-50' : ''}><ListIcon className="w-4 h-4" /></OutlineButton>
            <PrimaryButton onClick={openCreateProduct}><Plus className="w-4 h-4" /> Yeni Ürün</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-3xl">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ürün Adı, kodu, Tarife/Plan Kodu, Tarife/Plan Adı, Branş ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((u) => (
              <ProductCard
                key={u.id}
                urun={u}
                onOpen={(row) => openPlanList(row)}
                onOpenPlans={openPlanList}
                onAction={handleUrunAction}
                menuOpenId={menuOpenId}
                setMenuOpenId={setMenuOpenId}
              />
            ))}
          </div>
        ) : (
          <table className="w-full grid-table bg-white border border-slate-200 rounded-md overflow-hidden">
            <thead><tr><th>Ürün Kodu</th><th>Ürün Adı</th><th>Sözleşme Tipi</th><th>Aktif Plan</th><th>Toplam Plan</th><th>Tarih</th><th className="w-12 text-right">İşlemler</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="cursor-pointer" onClick={() => openPlanList(u)}>
                  <td className="font-mono text-xs">{u.id}</td>
                  <td className="font-semibold text-slate-800">{u.ad}</td>
                  <td>{u.sozlesmeTipi}</td>
                  <td>{u.aktif}</td>
                  <td>{u.toplam}</td>
                  <td>{u.tarih}</td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}><RowActions row={u} actions={URUN_ACTIONS} onAction={handleUrunAction} /></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingProductId ? 'Ürün Güncelle' : 'Yeni Ürün'} size="lg" footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={saveProduct}>Kaydet</PrimaryButton></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[{ k: 'id', l: 'Ürün Kodu' }, { k: 'ad', l: 'Ürün Adı' }, { k: 'tipler', l: 'Tipler' }, { k: 'sozlesmeTipi', l: 'Sözleşme Tipi' }, { k: 'tarih', l: 'Tarih' }, { k: 'toplam', l: 'Toplam Plan' }, { k: 'aktif', l: 'Aktif Plan' }].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        open={createWizardOpen}
        onClose={closeCreateWizard}
        title={createStep === 1 ? 'Branş Seçimi' : createStep === 2 ? 'Tanımlama Yöntemi' : createStep === 3 ? 'Ürün Tanımlama' : createStep === 4 ? 'Ürün Seçimi' : createStep === 5 ? 'Tanım Yöntemi' : 'Plan Genel Bilgileri'}
        description={
          createStep === 1
            ? 'İşlem yapmak istediğiniz sigorta branşını seçiniz.'
            : createStep === 2
              ? selectedBranch?.key === 'hayat'
                ? 'Hayat & Kaza branşı için ilerleme yönteminizi belirleyin.'
                : selectedBranch?.key === 'saglik'
                  ? 'Sağlık branşı için ilerleme yönteminizi belirleyin.'
                  : selectedBranch?.key === 'elementer'
                    ? 'Elementer branşı için ilerleme yönteminizi belirleyin.'
                    : 'Bireysel Emeklilik branşı için ilerleme yönteminizi belirleyin.'
              : createStep === 3
                ? 'Yeni ürün için temel parametreleri belirleyiniz.'
                : createStep === 4
                  ? 'Lütfen plan eklemek istediğiniz ana ürünü seçiniz.'
                  : createStep === 5
                    ? 'Plan oluşturma yöntemini seçiniz.'
                    : 'Temel plan bilgilerini giriniz'
        }
        size="lg"
        footer={createStep === 3 ? (
          <>
            <OutlineButton onClick={() => setCreateStep(2)}><ArrowLeft className="w-4 h-4" /> Geri Dön</OutlineButton>
            <PrimaryButton onClick={handleCreateFromWizard}>Oluştur & Yapılandır</PrimaryButton>
          </>
        ) : createStep === 6 ? (
          <>
            <OutlineButton onClick={() => setCreateStep(5)}><ArrowLeft className="w-4 h-4" /> Geri Dön</OutlineButton>
            <PrimaryButton onClick={handleSavePlanFromWizard}>KAYDET VE DEVAM ET <ArrowRight className="w-4 h-4" /></PrimaryButton>
          </>
        ) : null}
      >
        {createStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BRANCH_OPTIONS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => handleBranchSelect(item)}
                  className="text-left flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4 hover:border-violet-300 hover:bg-violet-50/30 transition"
                >
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-2xl leading-tight font-semibold text-slate-800">{item.label}</span>
                    <span className="block text-sm text-slate-500 mt-1">{item.description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {createStep === 2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleMethodSelect('new')}
                className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition"
              >
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Sıfırdan Ürün Tanımla</span>
                <span className="block text-lg text-slate-500 mt-2">Yeni teminat yapıları ve kuralları ile sıfırdan bir ürün oluşturun.</span>
              </button>
              <button
                type="button"
                onClick={() => handleMethodSelect('existing')}
                className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition"
              >
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center">
                  <FilePlus className="w-5 h-5" />
                </span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Mevcut Ürüne Plan Ekle</span>
                <span className="block text-lg text-slate-500 mt-2">Var olan bir ürün yapısı altına yeni bir plan kurgusu ekleyin.</span>
              </button>
            </div>
            <div className="pt-4">
              <button type="button" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800" onClick={() => setCreateStep(1)}>
                <ArrowLeft className="w-4 h-4" /> Geri Dön
              </button>
            </div>
          </div>
        )}

        {createStep === 3 && selectedBranch?.key === 'hayat' && (
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Branş</span>
              <input className="form-input bg-slate-50" value="Hayat & Kaza" disabled />
            </label>
            <WizardSegmentGroup
              label="Alt Branş"
              options={HAYAT_ALT_BRANS}
              value={createForm.altBrans}
              onChange={setHayatAltBrans}
            />
            <WizardSegmentGroup
              label="Ürün Tipi"
              required
              options={hayatUrunTipiOptions}
              value={createForm.urunTipi}
              onChange={setHayatUrunTipi}
            />
            {hayatSureTipiAktif && (
              <WizardSegmentGroup
                label="Süre Tipi"
                required
                options={HAYAT_SURE_TIPI}
                value={createForm.sureTipi}
                onChange={(sureTipi) => setCreateForm((prev) => ({ ...prev, sureTipi }))}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün No <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün No" value={createForm.urunNo} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunNo: e.target.value }))} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün Adı <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün Adı" value={createForm.urunAdi} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunAdi: e.target.value }))} />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Ürün hakkında kısa açıklama..." value={createForm.aciklama} onChange={(e) => setCreateForm((prev) => ({ ...prev, aciklama: e.target.value }))} />
            </label>
          </div>
        )}

        {createStep === 3 && selectedBranch?.key === 'saglik' && (
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Branş</span>
              <input className="form-input bg-slate-50" value="Sağlık" disabled />
            </label>
            <WizardSegmentGroup
              label="SAGMER Branş"
              options={SAGMER_BRANS_OPTIONS}
              value={createForm.sagmerBrans}
              onChange={(sagmerBrans) => setCreateForm((prev) => ({ ...prev, sagmerBrans }))}
            />
            <WizardSegmentGroup
              label="Ürün Tipi"
              required
              options={SAGLIK_URUN_TIPI}
              value={createForm.urunTipi}
              onChange={(urunTipi) => setCreateForm((prev) => ({ ...prev, urunTipi }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün No <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün No" value={createForm.urunNo} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunNo: e.target.value }))} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün Adı <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün Adı" value={createForm.urunAdi} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunAdi: e.target.value }))} />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Başlangıç Tarihi <span className="text-red-500">*</span></span>
                <input
                  type="date"
                  className="form-input"
                  value={createForm.baslangicTarihi || ''}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, baslangicTarihi: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Sagmer Tarife Kodu</span>
                <input
                  className="form-input"
                  placeholder="Örn: Sag-001"
                  value={createForm.sagmerTarifeKodu || ''}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, sagmerTarifeKodu: e.target.value }))}
                />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Ürün hakkında kısa açıklama..." value={createForm.aciklama} onChange={(e) => setCreateForm((prev) => ({ ...prev, aciklama: e.target.value }))} />
            </label>
          </div>
        )}

        {createStep === 3 && selectedBranch?.key === 'elementer' && (
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Branş</span>
              <input className="form-input bg-slate-50" value="Elementer" disabled />
            </label>
            <WizardSegmentGroup
              label="Ana Branş"
              required
              options={ELEMENTER_ANA_BRANS}
              value={createForm.anaBrans}
              onChange={(anaBrans) => setCreateForm((prev) => ({ ...prev, anaBrans }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün No <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün No" value={createForm.urunNo} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunNo: e.target.value }))} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün Adı <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün Adı" value={createForm.urunAdi} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunAdi: e.target.value }))} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Başlangıç Tarihi <span className="text-red-500">*</span></span>
                <input
                  type="date"
                  className="form-input"
                  value={createForm.baslangicTarihi || ''}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, baslangicTarihi: e.target.value }))}
                />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Yasal Ürün Kodu</span>
              <input
                className="form-input"
                placeholder="Yasal Ürün Kodu"
                value={createForm.yasalUrunKodu || ''}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, yasalUrunKodu: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Ürün hakkında kısa açıklama..." value={createForm.aciklama} onChange={(e) => setCreateForm((prev) => ({ ...prev, aciklama: e.target.value }))} />
            </label>
          </div>
        )}

        {createStep === 3 && selectedBranch?.key === 'bireysel' && (
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Branş</span>
              <input className="form-input bg-slate-50" value={selectedBranch?.label || 'Bireysel Emeklilik'} disabled />
            </label>
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Sözleşme Tipi <span className="text-red-500">*</span></div>
              <div className="flex flex-wrap gap-2">
                {SOZLESME_TIPLERI.map((tip) => (
                  <button
                    type="button"
                    key={tip}
                    onClick={() => setCreateForm((prev) => ({ ...prev, sozlesmeTipi: tip }))}
                    className={`px-4 h-10 rounded-xl border text-sm font-semibold transition ${createForm.sozlesmeTipi === tip ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-300 hover:border-violet-300'}`}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün No <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün No" value={createForm.urunNo} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunNo: e.target.value }))} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün Adı <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün Adı" value={createForm.urunAdi} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunAdi: e.target.value }))} />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Ürün hakkında kısa açıklama..." value={createForm.aciklama} onChange={(e) => setCreateForm((prev) => ({ ...prev, aciklama: e.target.value }))} />
            </label>
          </div>
        )}

        {createStep === 4 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                className="w-full h-11 pl-9 pr-3 border border-slate-300 rounded-xl text-sm"
                placeholder="Ürün adı veya kodu ile ara..."
                value={existingProductSearch}
                onChange={(e) => setExistingProductSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[420px] overflow-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bireyselProducts.filter((p) => !existingProductSearch || p.ad.toLowerCase().includes(existingProductSearch.toLowerCase()) || p.id.toLowerCase().includes(existingProductSearch.toLowerCase())).map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => selectExistingProduct(p)}
                    className="text-left rounded-2xl border border-slate-200 hover:border-violet-300 transition overflow-hidden bg-white"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex px-2 py-1 rounded bg-sky-50 text-sky-700 text-xs font-semibold">{p.id}</span>
                        <span className="w-7 h-7 rounded-lg border border-amber-200 bg-amber-50 text-amber-600 inline-flex items-center justify-center"><PiggyBank className="w-4 h-4" /></span>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">Toplam {p.toplam} Plan</div>
                      <div className="text-[28px] leading-tight font-semibold text-slate-800">{p.ad}</div>
                      <div className="text-xs text-slate-500 mt-2">{p.tipler}</div>
                    </div>
                    <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{p.tarih}</span>
                      <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-white font-medium text-slate-600">{p.toplam} Plan</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800" onClick={() => setCreateStep(2)}>
              <ArrowLeft className="w-4 h-4" /> Geri Dön
            </button>
          </div>
        )}

        {createStep === 5 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button type="button" onClick={() => handlePlanMethodSelect('new')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><Plus className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Yeni</span>
                <span className="block text-lg text-slate-500 mt-2">Sıfırdan oluştur.</span>
              </button>
              <button type="button" onClick={() => handlePlanMethodSelect('catalog')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><BookOpen className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Katalogdan</span>
                <span className="block text-lg text-slate-500 mt-2">Şablondan kopyala.</span>
              </button>
              <button type="button" onClick={() => handlePlanMethodSelect('ai')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><Sparkles className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">AI ile</span>
                <span className="block text-lg text-slate-500 mt-2">Yapay zeka ile.</span>
              </button>
              <button type="button" onClick={() => handlePlanMethodSelect('file')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><Upload className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Dosyadan</span>
                <span className="block text-lg text-slate-500 mt-2">Excel/XML yükle.</span>
              </button>
            </div>
            <div className="pt-4">
              <button type="button" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800" onClick={() => setCreateStep(4)}>
                <ArrowLeft className="w-4 h-4" /> Geri Dön
              </button>
            </div>
          </div>
        )}

        {createStep === 6 && (
          <div className="space-y-4">
            <div className="px-4 py-3 rounded-md bg-slate-50 border border-slate-100 text-sm text-slate-600">
              <span className="mr-6">Bağlı Ürün: <strong className="text-slate-800">{selectedExistingProduct?.ad || '-'}</strong></span>
              <span>Sözleşme Tipi: <strong className="text-slate-800">{selectedExistingProduct?.sozlesmeTipi || '-'}</strong></span>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Plan adı <span className="text-red-500">*</span></span>
              <input className="form-input" value={planForm.planAdi} onChange={(e) => setPlanForm((prev) => ({ ...prev, planAdi: e.target.value }))} />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Plan kodu <span className="text-red-500">*</span></span>
              <input className="form-input" value={planForm.planKodu} onChange={(e) => setPlanForm((prev) => ({ ...prev, planKodu: e.target.value }))} />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Başlangıç tarihi <span className="text-red-500">*</span></span>
                <input className="form-input" value={planForm.baslangicTarihi} onChange={(e) => setPlanForm((prev) => ({ ...prev, baslangicTarihi: e.target.value }))} />
              </label>
              <label className="inline-flex items-center gap-2 h-11 text-slate-700 font-semibold">
                <input type="checkbox" checked={planForm.katilimEsasli} onChange={(e) => setPlanForm((prev) => ({ ...prev, katilimEsasli: e.target.checked }))} />
                Katılım Esaslı
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Hedef kitle açıklaması</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Hedef kitle açıklamasını giriniz" value={planForm.hedefKitle} onChange={(e) => setPlanForm((prev) => ({ ...prev, hedefKitle: e.target.value }))} />
            </label>
          </div>
        )}
      </Modal>

      <Modal open={infoModal.open} onClose={() => setInfoModal({ open: false, title: '', body: null })} title={infoModal.title} footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}>
        {infoModal.body}
      </Modal>
    </div>
  )
}
