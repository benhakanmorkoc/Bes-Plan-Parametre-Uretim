import { useMemo, useState } from 'react'
import { Plus, Search, ArrowLeft, LayoutGrid, List as ListIcon, MoreHorizontal, Eye, Pencil, Copy, List, Trash2, Settings, Filter, Heart, Activity, PiggyBank, Briefcase, FilePlus, BookOpen, Sparkles, Upload, ArrowRight } from 'lucide-react'
import { urunPlanTarifeKartlari, urunPlanlari, katkiPayiTemplateleri } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

const PLAN_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'copy', label: 'Planı Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

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
const PLAN_SETUP_CARDS = [
  { id: 'genel', title: 'Genel Bilgiler', update: '20.02.2025', bar: 32, score: '2/6', color: 'bg-orange-500', lines: ['Kategori Kodu: BES-AD', 'Sözleşme Tipi: Ferdi'] },
  { id: 'fonlar', title: 'Fonlar ve Fon Karmaları', update: '30.12.2023', bar: 34, score: '2/6', color: 'bg-orange-500', lines: ['TANIMLANAN FON: 5 Adet', 'DEVLET KATKI FONU', 'ACİL EMEKLİLİK FONU'] },
  { id: 'katki', title: 'Katkı Payı Tanımları', update: '30.12.2025', bar: 8, score: '0/6', color: 'bg-red-500', lines: ['TANIMLANAN KATKI PAYI', '5 Adet', 'ASGARİ KATKI PAYI 1200 TL'] },
  { id: 'kesinti', title: 'Kesintiler', update: '10.12.2025', bar: 55, score: '3/6', color: 'bg-yellow-400', lines: ['ÖZET', 'Giriş Aidatı, YKG tanımlanmıştır', 'ÇIKIŞ AİDATI', 'Çıkışa erteleme'] },
  { id: 'diger', title: 'Diğer Tanımlar', update: '10.12.2025', bar: 82, score: '3/6', color: 'bg-lime-500', lines: ['İstisna Planları, Endeksler, Ek göstergeler tanımlanmıştır.'] },
  { id: 'belge', title: 'Plan Belgeleri', update: '10.12.2025', bar: 100, score: '6/6', color: 'bg-emerald-500', lines: ['Kayıtlı belge listesi mevcuttur', 'TANIMLANAN BELGE SAYISI', '1 Adet'] },
]

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

function ProductCard({ urun, onOpen, onAction, menuOpenId, setMenuOpenId }) {
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
        <button type="button" className="px-3 py-1 rounded-full border border-violet-200 text-violet-700 text-xs font-medium bg-violet-50/30">Aktif Planlar</button>
      </div>
    </div>
  )
}

function PlanList({ urun, planlar, onBack, onSavePlan, onPlanAction, onStartNewPlanFlow }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
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
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OutlineButton onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Ürün Listesi
          </OutlineButton>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{urun.ad}</h2>
            <div className="text-xs text-slate-500">{urun.tipler}</div>
          </div>
        </div>
        <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Plan</PrimaryButton>
      </div>

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Plan adı veya kodu..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Durum</label>
          <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tümü</option>
            <option value="Yururlukte">Yürürlükte</option>
            <option value="Taslak">Taslak</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th>Plan No</th>
              <th>Plan Adı</th>
              <th>Durum</th>
              <th>Tamamlanma</th>
              <th>Tarih</th>
              <th className="w-12 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs">{p.id}</td>
                <td>{p.ad}</td>
                <td><StatusBadge value={p.durum} /></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${p.oran}%` }} /></div>
                    <span className="text-xs text-slate-600 w-10 text-right">{p.oran}%</span>
                  </div>
                </td>
                <td>{p.tarih}</td>
                <td className="text-right">
                  <RowActions
                    row={p}
                    actions={PLAN_ACTIONS}
                    onAction={(key, row) => {
                      if (key === 'edit') openEdit(row)
                      else onPlanAction(key, row)
                    }}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>}
          </tbody>
        </table>
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
            <div className="text-xs text-slate-500 mt-1">{plan?.id || '-'}  ·  {urun?.sozlesmeTipi || 'Ferdi'}  ·  {plan?.tarih || normalizeDate()}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: '52%' }} /></div>
          <div className="text-xs text-slate-600 text-right mt-1">%52 1/6</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 md:p-4 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PLAN_SETUP_CARDS.map((card) => (
            <button key={card.id} data-card-id={card.id} type="button" onClick={() => onOpenCard?.(card.id)} className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{card.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">Son Güncelleme Tarihi: {card.update}</div>
                </div>
                <span className="w-4 h-4 rounded-full border border-emerald-300 text-emerald-500 inline-flex items-center justify-center text-[10px]">✓</span>
              </div>
              <div className="mt-3">
                <div className="text-[10px] text-slate-500 mb-1">TANIMLAMA</div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${card.color}`} style={{ width: `${card.bar}%` }} />
                </div>
                <div className="text-[11px] text-slate-500 text-right mt-1">%{card.bar} {card.score}</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
                {card.lines.map((line) => <div key={line}>{line}</div>)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlanGenelBilgilerScreen({ plan, urun, onBack }) {
  const [form, setForm] = useState({
    sozlesmeTipi: urun?.sozlesmeTipi || 'Ferdi',
    versiyonNo: '1',
    planKodu: plan?.id || '',
    kategoriKodu: 'BES-AP',
    planAdi: plan?.ad || '',
    planKisaAdi: '',
    baslangicTarihi: plan?.tarih || normalizeDate(),
    hazinePlanKodu: '',
    hazineTescilTarihi: '',
    basvuruTipi: '',
    durum: plan?.durum || 'Taslak',
    doviz: '',
    kurTipi: '',
    minGirisYasi: '',
    maxGirisYasi: '',
    emanetFon: 'FON1',
    gecerliSozlesmeCinsi: '',
    vakifAktarim: '',
    vakifAktarimSuresi: '',
    odemeAraclari: '',
    bosTipleri: '',
    katilimEsasli: Boolean(plan?.katilimEsasli),
    vatandaslikPlani: false,
    aktarimaOzelPlan: false,
    masrafliSatis: false,
    betas: false,
    hedefKitle: plan?.hedefKitle || '',
    mevzuatIstisnaMetni: '',
  })

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

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
            <div className="text-xs text-slate-500 mt-1">{plan?.id || '-'}  ·  {urun?.sozlesmeTipi || 'Ferdi'}  ·  {plan?.tarih || normalizeDate()}</div>
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
              <input className="form-input bg-slate-50" value={form.sozlesmeTipi} disabled />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Versiyon No</span>
              <input className="form-input" value={form.versiyonNo} onChange={(e) => setValue('versiyonNo', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Plan Kodu *</span>
              <input className="form-input bg-slate-50" value={form.planKodu} disabled />
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
              <input className="form-input" value={form.baslangicTarihi} onChange={(e) => setValue('baslangicTarihi', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Hazine Plan Kodu *</span>
              <input className="form-input" value={form.hazinePlanKodu} onChange={(e) => setValue('hazinePlanKodu', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Hazine Tescil Tarihi *</span>
              <input className="form-input" placeholder="dd......yyyy" value={form.hazineTescilTarihi} onChange={(e) => setValue('hazineTescilTarihi', e.target.value)} />
            </label>
            <label className="inline-flex items-center gap-2 h-11 mt-5 text-sm text-slate-700">
              <input type="checkbox" checked={form.katilimEsasli} onChange={(e) => setValue('katilimEsasli', e.target.checked)} />
              Katılım Esaslı
            </label>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Başvuru Tipi *</span>
              <select className="form-select" value={form.basvuruTipi} onChange={(e) => setValue('basvuruTipi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Durum</span>
              <select className="form-select" value={form.durum} onChange={(e) => setValue('durum', e.target.value)}><option value="Taslak">Taslak</option><option value="Yururlukte">Yürürlükte</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Döviz *</span>
              <select className="form-select" value={form.doviz} onChange={(e) => setValue('doviz', e.target.value)}><option value="">Seçiniz</option><option value="TL">TL</option><option value="USD">USD</option><option value="EUR">EUR</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Kur Tipi *</span>
              <select className="form-select" value={form.kurTipi} onChange={(e) => setValue('kurTipi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>

            <label className="block"><span className="block text-xs text-slate-600 mb-1">Min. Giriş Yaşı</span><input className="form-input" value={form.minGirisYasi} onChange={(e) => setValue('minGirisYasi', e.target.value)} /></label>
            <label className="block"><span className="block text-xs text-slate-600 mb-1">Max. Giriş Yaşı</span><input className="form-input" value={form.maxGirisYasi} onChange={(e) => setValue('maxGirisYasi', e.target.value)} /></label>
            <label className="block md:col-span-2"><span className="block text-xs text-slate-600 mb-1">Emanet Fon</span><select className="form-select" value={form.emanetFon} onChange={(e) => setValue('emanetFon', e.target.value)}><option value="FON1">FON1</option></select></label>

            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Geçerli Sözleşme Cinsi</span>
              <select className="form-select" value={form.gecerliSozlesmeCinsi} onChange={(e) => setValue('gecerliSozlesmeCinsi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>
            <div className="md:col-span-2" />

            <div className="md:col-span-2">
              <div className="text-xs text-slate-600 mb-1">Özellikler</div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.katilimEsasli} onChange={(e) => setValue('katilimEsasli', e.target.checked)} /> Katılım Esaslı</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.vatandaslikPlani} onChange={(e) => setValue('vatandaslikPlani', e.target.checked)} /> Vatandaşlık Planı</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.aktarimaOzelPlan} onChange={(e) => setValue('aktarimaOzelPlan', e.target.checked)} /> Aktarıma Özel Plan</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.masrafliSatis} onChange={(e) => setValue('masrafliSatis', e.target.checked)} /> Masraflı Satış</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.betas} onChange={(e) => setValue('betas', e.target.checked)} /> Betas</label>
              </div>
            </div>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Vakf Aktarımı</span>
              <select className="form-select" value={form.vakifAktarim} onChange={(e) => setValue('vakifAktarim', e.target.value)}><option value="">Seçiniz</option><option value="yes">Vakıf Aktarımı</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Vakf. Aktarım Süresi</span>
              <select className="form-select" value={form.vakifAktarimSuresi} onChange={(e) => setValue('vakifAktarimSuresi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Ödeme Araçları *</span>
              <select className="form-select" value={form.odemeAraclari} onChange={(e) => setValue('odemeAraclari', e.target.value)}><option value="">Seçiniz</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Boş Tipleri *</span>
              <select className="form-select" value={form.bosTipleri} onChange={(e) => setValue('bosTipleri', e.target.value)}><option value="">Seçiniz</option></select>
            </label>

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
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })
  const [menuOpenId, setMenuOpenId] = useState(null)

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
    if (branch.key === 'bireysel') {
      setCreateStep(2)
      return
    }
    alert('Bu branş için akış henüz eklenmedi. Şimdilik Bireysel Emeklilik ile ilerleyebilirsiniz.')
  }

  const handleMethodSelect = (method) => {
    setCreateMethod(method)
    if (method === 'new') {
      setCreateStep(3)
      return
    }
    setCreateStep(4)
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
    if (selectedExistingProduct.sozlesmeTipi === 'Ferdi' && (selectedExistingProduct.tipler || '').toLowerCase().includes('bireysel emeklilik')) {
      setPlanSetupContext({ urun: selectedExistingProduct, plan: payload })
      setPlanSetupView('board')
    }
    closeCreateWizard()
  }

  const handleCreateFromWizard = () => {
    if (!createForm.urunNo.trim()) return alert('Ürün No zorunludur.')
    if (!createForm.urunAdi.trim()) return alert('Ürün Adı zorunludur.')
    const payload = normalizeProduct({
      id: createForm.urunNo.trim(),
      ad: createForm.urunAdi.trim(),
      tipler: `Bireysel  ·  ${selectedBranch?.label || 'Bireysel Emeklilik'}`,
      sozlesmeTipi: createForm.sozlesmeTipi,
      tarih: normalizeDate(),
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

  const handlePlanAction = (key, row) => {
    if (!selected) return
    if (key === 'view') {
      setInfoModal({
        open: true,
        title: 'Plan İncele',
        body: <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(row, null, 2)}</pre>,
      })
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
        Durum: r.durum,
        'Tamamlanma %': r.oran,
        Tarih: r.tarih,
      }))
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
    if (key === 'view') { setSelected(row); return }
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
    return <PlanList urun={selected} planlar={getPlans(selected.id)} onBack={() => setSelected(null)} onSavePlan={handleSavePlan} onPlanAction={handlePlanAction} onStartNewPlanFlow={startExistingProductPlanFlow} />
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
    return <PlanConfigurationBoard plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupContext(null)} onOpenCard={(cardId) => {
      if (cardId === 'genel') setPlanSetupView('genel')
      else if (cardId === 'fonlar') setPlanSetupView('fonlar')
      else if (cardId === 'katki') setPlanSetupView('katki')
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
            {filtered.map((u) => <ProductCard key={u.id} urun={u} onOpen={setSelected} onAction={handleUrunAction} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />)}
          </div>
        ) : (
          <table className="w-full grid-table bg-white border border-slate-200 rounded-md overflow-hidden">
            <thead><tr><th>Ürün Kodu</th><th>Ürün Adı</th><th>Sözleşme Tipi</th><th>Aktif Plan</th><th>Toplam Plan</th><th>Tarih</th><th className="w-12 text-right">İşlemler</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="cursor-pointer" onClick={() => setSelected(u)}>
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
        description={createStep === 1 ? 'İşlem yapmak istediğiniz sigorta branşını seçiniz.' : createStep === 2 ? 'Bireysel Emeklilik branşı için ilerleme yönteminizi belirleyin.' : createStep === 3 ? 'Yeni ürün için temel parametreleri belirleyiniz.' : createStep === 4 ? 'Lütfen plan eklemek istediğiniz ana ürünü seçiniz.' : createStep === 5 ? 'Plan oluşturma yöntemini seçiniz.' : 'Temel plan bilgilerini giriniz'}
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

        {createStep === 3 && (
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
