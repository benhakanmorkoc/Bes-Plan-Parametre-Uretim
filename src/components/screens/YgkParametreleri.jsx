import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon, ArrowLeft, Trash2, Edit2, BookOpen } from 'lucide-react'
import { ygk as seedYgk, katkiPayiHesaplama } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const BORC_TIPI_OPTIONS = ['Katkı Payı Tahsilatı', 'Ek Katkı Payı', 'Birikim Transferi']
const YIL_TIPI_OPTIONS = ['Tahsilat Tarihi', 'Vade Tarihi', 'Yürürlük Tarihi']
const KADEME_TIPI_OPTIONS = ['Kademe', 'Kümül Kademe']
const LIMIT_TUTAR_TIPI_OPTIONS = [
  'Tahsilat Tutarı',
  'Sözleşme Birikim Tutarı',
  'Katılımcı Birikim Tutarı',
  'Katkı Payı Tutarı',
  'Toplam Tahsilat',
  'Kişi Sayısı',
  'Kural',
]
const LIMIT_TUTAR_GUNCELLEME_OPTIONS = katkiPayiHesaplama.map((r) => ({
  value: r.hesapAdi,
  label: r.hesapAdi,
}))
const YUVARLAMA_OPTIONS = ['Yok', 'Tavana', 'Tabana']
const DOVIZ_OPTIONS = [
  { code: 'TL', label: 'Türk Lirası (TL)' },
  { code: 'USD', label: 'Amerikan Doları (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
]
const DONEM_OPTIONS = ['Aylık', 'Yıllık']
const ODEME_ARACI_OPTIONS = ['Havale', 'Kredi Kartı', 'Nakit']
const BANKA_OPTIONS = ['Garanti', 'İŞ Bankası', 'Ziraat Bankası']
const DEGER_TIPI_OPTIONS = ['Oran', 'Tutar']

const LIST_COLUMNS = [
  { key: 'kod', label: 'YGK Kodu' },
  { key: 'ad', label: 'YGK Adı' },
  { key: 'versiyon', label: 'Versiyon' },
  { key: 'tarih', label: 'Tarih' },
  { key: 'doviz', label: 'Döviz' },
  { key: 'borcTipi', label: 'Borç Tipi' },
  { key: 'yil', label: 'Yıl Tipi' },
  { key: 'limit', label: 'Limit Tutar Tipi' },
  { key: 'limitGuncelleme', label: 'Limit Tutar Güncelleme' },
  { key: 'araVermeKural', label: 'YGK Hesaplama Kuralı' },
  { key: 'donemGunAy', label: 'Dönem Gün/Ay', computed: 'donem' },
  { key: 'yuvarlama', label: 'Yuvarlama', computed: 'yuvarlama' },
  { key: 'yillikParametreler', label: 'Yıllık Parametreler', computed: 'yillik' },
  { key: 'kademe', label: 'Kademe Tipi' },
  { key: 'sifirla', label: 'Yıl Bazında Sıfırla', computed: 'sifirla' },
]

function mapTabloToBorcTipi(tablo, borcTipi) {
  if (borcTipi) return borcTipi
  if (!tablo || tablo === 'Yok') return 'Yok'
  if (/katk[iı]\s*pay/i.test(tablo)) return 'Katkı Payı Tahsilatı'
  if (/birikim/i.test(tablo)) return 'Birikim Transferi'
  return tablo
}

function normalizeSeedRow(r) {
  const borcTipi = mapTabloToBorcTipi(r.tablo, r.borcTipi)
  const isYok = borcTipi === 'Yok' || r.kod === 'YGK-000'
  return {
    ...r,
    borcTipi,
    yil: r.yil === 'Yururluk Tarihi' ? 'Yürürlük Tarihi' : (r.yil || 'Yok'),
    limit: r.limit === 'Sozlesme Birikim' ? 'Sözleşme Birikim Tutarı' : (r.limit || 'Yok'),
    kademe: r.kademe === 'Kumul Kademe' ? 'Kümül Kademe' : (r.kademe || 'Yok'),
    sifirla: r.sifirla === 'Hayir' ? 'Hayır' : (r.sifirla === 'Evet' ? 'Evet' : r.sifirla || 'Hayır'),
    limitGuncelleme: r.limitGuncelleme || '',
    araVermeKural: r.araVermeKural || '',
    yuvarlama: r.yuvarlama || 'Yok',
    yuvarlamaDegeri: r.yuvarlamaDegeri || '',
    donemGun: r.donemGun || '',
    donemAy: r.donemAy || '',
    yillikParametreler: isYok
      ? []
      : (r.yillikParametreler?.length
        ? r.yillikParametreler.map(normalizeYillikRow)
        : [normalizeYillikRow({ id: 1, yilAlt: '1', yilUst: '5', tutarAlt: '0', tutarUst: '5000', doviz: 'TL', kademeDonemi: 'Aylık', odemeDonemi: 'Aylık', odemeAraci: 'Havale', banka: 'Garanti', degerTipi: 'Oran', ygkOrani: '2' })]),
  }
}

function normalizeYillikRow(r) {
  const degerTipi = r.degerTipi || (r.oranTutar ? 'Oran' : 'Oran')
  const resolvedTip = DEGER_TIPI_OPTIONS.includes(r.degerTipi) ? r.degerTipi : degerTipi
  return {
    id: r.id ?? Date.now() + Math.random(),
    yilAlt: r.yilAlt || '',
    yilUst: r.yilUst || '',
    tutarAlt: r.tutarAlt || '',
    tutarUst: r.tutarUst || '',
    tutarAltLimitKurali: r.tutarAltLimitKurali || '',
    tutarUstLimitKurali: r.tutarUstLimitKurali || '',
    doviz: r.doviz || 'TL',
    kademeDonemi: r.kademeDonemi || 'Aylık',
    odemeDonemi: r.odemeDonemi || 'Aylık',
    odemeAraci: r.odemeAraci || 'Havale',
    banka: r.banka || 'Garanti',
    degerTipi: resolvedTip,
    ygkOrani: r.ygkOrani ?? (resolvedTip === 'Oran' ? (r.oranTutar || '') : ''),
    ygkTutari: r.ygkTutari ?? (resolvedTip === 'Tutar' ? (r.oranTutar || '') : ''),
  }
}

function displayYgkDeger(row) {
  if (row.degerTipi === 'Tutar') return row.ygkTutari || '—'
  return row.ygkOrani || '—'
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

function displayYillikOzet(rules) {
  if (!rules || rules.length === 0) return '—'
  const filled = rules.filter((r) => r.yilAlt || r.yilUst || r.tutarAlt || r.tutarUst || r.ygkOrani || r.ygkTutari)
  if (!filled.length) return `${rules.length} kademe (boş)`
  return `${rules.length} kademe`
}

function renderCellValue(row, col) {
  if (col.computed === 'donem') return displayDonemGunAy(row.donemGun, row.donemAy)
  if (col.computed === 'yuvarlama') return displayYuvarlama(row.yuvarlama, row.yuvarlamaDegeri)
  if (col.computed === 'yillik') return displayYillikOzet(row.yillikParametreler)
  if (col.computed === 'sifirla') {
    return (
      <input type="checkbox" className="rounded pointer-events-none" checked={row.sifirla === 'Evet'} readOnly />
    )
  }
  const val = row[col.key]
  return val === '' || val == null ? '—' : val
}

function emptyYillikRow() {
  return {
    id: Date.now() + Math.random(),
    yilAlt: '',
    yilUst: '',
    tutarAlt: '',
    tutarUst: '',
    tutarAltLimitKurali: '',
    tutarUstLimitKurali: '',
    doviz: '',
    kademeDonemi: '',
    odemeDonemi: '',
    odemeAraci: '',
    banka: '',
    degerTipi: 'Oran',
    ygkOrani: '',
    ygkTutari: '',
  }
}

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    ygkTanimiYok: false,
    doviz: 'TL',
    borcTipi: 'Katkı Payı Tahsilatı',
    yilTipi: 'Tahsilat Tarihi',
    kademeTipi: 'Kademe',
    limitTutarTipi: 'Tahsilat Tutarı',
    limitTutarGuncelleme: '',
    donemGun: '',
    donemAy: '',
    yuvarlama: 'Yok',
    yuvarlamaDegeri: '',
    araVermeKuralKodu: '',
    yilBazindaSifirla: false,
    yillikParametreler: [emptyYillikRow()],
  }
}

function seedToForm(row) {
  const ygkTanimiYok = row.borcTipi === 'Yok' || row.kod === 'YGK-000'
  return {
    kod: row.kod || '',
    ad: row.ad || '',
    versiyon: String(row.versiyon || '1'),
    ygkTanimiYok,
    doviz: row.doviz === 'TRL' ? 'TL' : row.doviz || 'TL',
    borcTipi: ygkTanimiYok ? 'Yok' : (row.borcTipi || 'Katkı Payı Tahsilatı'),
    yilTipi: ygkTanimiYok ? 'Yok' : (row.yil || 'Tahsilat Tarihi'),
    kademeTipi: ygkTanimiYok ? 'Yok' : (row.kademe || 'Kademe'),
    limitTutarTipi: ygkTanimiYok ? 'Yok' : (row.limit || 'Tahsilat Tutarı'),
    limitTutarGuncelleme: row.limitGuncelleme || '',
    donemGun: row.donemGun || '',
    donemAy: row.donemAy || '',
    yuvarlama: row.yuvarlama || 'Yok',
    yuvarlamaDegeri: row.yuvarlamaDegeri || '',
    araVermeKuralKodu: row.araVermeKural || '',
    yilBazindaSifirla: row.sifirla === 'Evet',
    yillikParametreler: row.yillikParametreler?.length
      ? row.yillikParametreler.map((rule) => normalizeYillikRow(rule))
      : (ygkTanimiYok ? [] : [normalizeYillikRow({ yilAlt: '1', yilUst: '5', tutarAlt: '0', tutarUst: '5000', degerTipi: 'Oran', ygkOrani: '2' })]),
  }
}

function limitAltUstLabels(limitTutarTipi) {
  if (limitTutarTipi === 'Kişi Sayısı') {
    return { alt: 'Min Kişi Sayısı', ust: 'Max Kişi Sayısı' }
  }
  return { alt: 'Tutar Alt Limit', ust: 'Tutar Üst Limit' }
}

function YgkEkranAnlatimiContent() {
  return (
    <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-blue-900">
        <p className="font-semibold text-blue-950">Bireysel Emeklilik Sistemi (BES)</p>
        <p className="mt-1 text-blue-800">
          Bu ekran, sözleşmelerden yapılacak <strong>Yönetim Gider Kesintisi (YGK)</strong> oran veya tutarlarını;
          sözleşme yılı, katılımcının birikimi, ödeme aracı ve banka gibi dinamik kriterlere göre yapılandırmanızı sağlar.
          Tahsilat esnasında sistem, bu ekrandaki kuralları yukarıdan aşağıya tarayarak eşleşen satırdaki kesintiyi uygular.
        </p>
      </div>

      <section>
        <h4 className="text-base font-bold text-slate-900 mb-2">1. Ana Ekran Parametreleri (Üst Bölüm)</h4>
        <p className="text-slate-600 mb-3">
          Bu bölüm, kuralların genel çalışma mimarisini ve alt tablodaki limitlerin hangi kurallara göre işletileceğini belirler.
        </p>
        <ul className="space-y-2.5 list-none pl-0">
          <li><strong>Döviz:</strong> Alt tabloda yer alan &quot;Tutar Alt/Üst Limit&quot; alanlarının hangi para birimi cinsinden değerlendirileceğini belirler (Örn: Türk Lirası seçildiyse, limitler TL olarak okunur).</li>
          <li><strong>Borç Tipi:</strong> Kesintinin hangi tahsilat türüne uygulanacağını seçer (Örn: <em>Katkı Payı Tahsilatı</em>, bu kuralın sadece düzenli veya ek katkı payı ödemelerinde tetikleneceğini gösterir).</li>
          <li><strong>Yıl Tipi:</strong> Katılımcının sözleşme yılının neye göre hesaplanacağını belirler (Örn: <em>Tahsilat Tarihi</em> seçildiğinde, paranın şirkete ulaştığı andaki sözleşme yılı baz alınır).</li>
          <li>
            <strong>Kademe Tipi:</strong> Limitlerin hesaplama metodunu belirler:
            <ul className="mt-1.5 ml-4 space-y-1 list-disc text-slate-600">
              <li><strong>Kademe (Slab):</strong> Koşul sağlandığında, tanımlanan oran <strong>tahsilat tutarının tamamına</strong> uygulanır.</li>
              <li><strong>Kümül Kademe (Cumulative):</strong> Tutar parçalanarak kesinti hesaplanır (Örn: 0-5000 arası %2, üstü %1 ise; 6000 TL&apos;lik bir durumda ilk 5000 TL&apos;ye %2, kalan 1000 TL&apos;ye %1 uygulanır).</li>
            </ul>
          </li>
          <li>
            <strong>Limit Tutar Tipi:</strong> Kesinti oranını belirlemek için sistemin hangi veriyi kontrol edeceğini seçer.
            <ul className="mt-1.5 ml-4 space-y-1 list-disc text-slate-600">
              <li><strong>Katılımcı Birikim Tutarı:</strong> Sistem, kesinti oranını belirlemek için gelen tahsilata değil, <strong>katılımcının içerideki toplam birikmiş parasına</strong> bakar.</li>
            </ul>
          </li>
          <li><strong>Limit Tutar Güncelleme Türü:</strong> Tanımlanan limitlerin (Örn: 5000 TL sınırının) enflasyon, TÜFE veya asgari ücrete göre otomatik güncellenip güncellenmeyeceğini belirler.</li>
          <li><strong>Yuvarlama:</strong> Hesaplanan kesinti tutarında kuruş küsuratı oluşması durumunda yukarı/aşağı yuvarlama kuralını belirler.</li>
          <li><strong>Yıl Bazında Sıfırla:</strong> Seçildiğinde, kademe kontrollerini her sözleşme yılı başında sıfırdan başlatır.</li>
        </ul>
      </section>

      <section>
        <h4 className="text-base font-bold text-slate-900 mb-2">2. Yıllık Parametreler ve Kademeler (Alt Tablo)</h4>
        <p className="text-slate-600 mb-3">
          Bu bölüm, yukarıdaki ana kriterlere uyan bir tahsilat geldiğinde uygulanacak <strong>özel mikro kuralları (kombinasyonları)</strong> tanımladığınız alandır.
          <strong> Yıllık Parametreleri Yönet</strong> ile yeni satırlar oluşturabilirsiniz.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs min-w-[640px]">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="text-left font-semibold px-3 py-2.5 w-[22%]">Alan Adı</th>
                <th className="text-left font-semibold px-3 py-2.5">Ne İşe Yarar? / Nasıl Girilmeli?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ['Yıl Alt/Üst Limit', 'Sözleşmenin hangi yaş/yıl aralığında bu kurala tabi olacağını belirler (Örn: 1 - 5 yazılırsa, ilk 5 yıl bu satır çalışır. Mevzuat gereği 5. yıldan sonra YGK yapılamadığı için burası kritik önemdedir).'],
                ['Tutar Alt / Üst Limit', 'Üst dizede seçilen Limit Tutar Tipi\'ne ait alt ve üst sınırları belirler (Örn: Birikimi 0 - 5000 TL arası olanlar).'],
                ['Döviz (Satır)', 'Gelen tahsilatın endeksli olduğu para birimini filtreler. - (Tümü) seçilirse, tahsilat hangi döviz türünde olursa olsun (TL\'ye çevrilerek) bu limite dahil edilir. Dövize endeksli planlar için özel filtreleme sağlar.'],
                ['Kademe Dönemi', 'Birikim veya tahsilat kontrolünün hangi periyotta yapılacağını belirler (Aylık / Yıllık).'],
                ['Ödeme Dönemi', 'Sözleşmenin ödeme periyodunu filtreler (Örn: Sadece Aylık ödemeli sözleşmelerde bu oran geçerli olsun).'],
                ['Ödeme Aracı', 'Tahsilatın geldiği kaynağı filtreler (Kredi Kartı, Havale/EFT, Otomatik Ödeme Talimatı).'],
                ['Banka', 'Belirli bankaların kartlarına veya hesaplarına avantaj/dezavantaj tanımlamak için kullanılır. (Örn: Anlaşmalı bankanız olan Garanti seçilirse, o bankanın kartıyla ödeyenlere özel kesinti uygulanır).'],
                ['Oran (%) / Tutar', 'Tüm şartlar sağlandığında tahsilattan düşülecek kesinti yüzdesini veya sabit tutarı ifade eder (Örn: %2).'],
              ].map(([alan, aciklama]) => (
                <tr key={alan} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-semibold text-slate-800 align-top">{alan}</td>
                  <td className="px-3 py-2.5 text-slate-600">{aciklama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="text-base font-bold text-slate-900 mb-3">3. Sistem Operatörleri İçin Örnek İşleyiş Senaryoları</h4>
        <p className="text-slate-600 mb-4">Ekrana veri girişi yaparken sistemin tahsilat anında nasıl davranacağını anlamak için aşağıdaki senaryoları inceleyebilirsiniz:</p>
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
            <p className="font-semibold text-emerald-900 mb-2">Senaryo A: Tam Eşleşme (Kuralın Çalışması)</p>
            <p className="text-emerald-800 mb-1"><strong>Sistemdeki Durum:</strong> Katılımcı sözleşmesinin 3. yılında, içeride toplam 4.000 TL birikimi var ve o ayki borcunu sisteme tanımlı olan Garanti Kredi Kartı ile ödedi.</p>
            <p className="text-emerald-800"><strong>Sistemin Davranışı:</strong> Sistem yukarıdaki satırı okur; Yıl (3), Birikim (4000), Ödeme Aracı (Kredi) ve Banka (G...) kriterlerinin tamamı uyduğu için bu satırı tetikler. Gelen katkı payından %2 kesinti yapar.</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
            <p className="font-semibold text-amber-900 mb-2">Senaryo B: Limit Aşımı (Kuralın Atlanması)</p>
            <p className="text-amber-800 mb-1"><strong>Sistemdeki Durum:</strong> Katılımcı sözleşmesinin 2. yılında, yine aynı kredi kartıyla ödeme yaptı. Ancak içerideki toplam birikimi 12.000 TL&apos;ye ulaşmış durumda.</p>
            <p className="text-amber-800"><strong>Sistemin Davranışı:</strong> Sistem bu satıra bakar ancak Tutar Üst Limit = 5000 olduğu için bu satırı pas geçer. Bu satırın altında tanımlanmış olan bir sonraki (Örn: 5001 - 50.000 TL arası için tanımlanmış) kural satırını aramaya başlar.</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3">
            <p className="font-semibold text-sky-900 mb-2">Senaryo C: Farklı Ödeme Kanalı (Kuralın Atlanması)</p>
            <p className="text-sky-800 mb-1"><strong>Sistemdeki Durum:</strong> Katılımcı 1. yılında, birikimi 2000 TL (Yıl ve tutar limitlerine uyuyor). Ancak ödemeyi kredi kartıyla değil Banka Havalesi ile yaptı.</p>
            <p className="text-sky-800"><strong>Sistemin Davranışı:</strong> Sistem satırdaki Ödeme Aracı = Kredi filtresine takılır. Bu satırdaki %2&apos;lik avantajlı oranı uygulamaz. Havale için tanımlanmış olan (muhtemelen daha yüksek oranlı) diğer genel satırı aramaya geçer.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function YgkParametreleri() {
  const [rows, setRows] = useState(() => seedYgk.map(normalizeSeedRow))
  const [viewMode, setViewMode] = useState('list')
  const [formMode, setFormMode] = useState('create')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [actionInfo, setActionInfo] = useState(null)
  const [yillikListOpen, setYillikListOpen] = useState(false)
  const [yillikFormOpen, setYillikFormOpen] = useState(false)
  const [yillikDraft, setYillikDraft] = useState(emptyYillikRow)
  const [yillikEditId, setYillikEditId] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)

  const isKisiSayisi = form.limitTutarTipi === 'Kişi Sayısı'
  const isKuralLimit = form.limitTutarTipi === 'Kural'
  const limitLabels = limitAltUstLabels(form.limitTutarTipi)
  const yuvarlamaAktif = form.yuvarlama === 'Tavana' || form.yuvarlama === 'Tabana'
  const hasRules = !form.ygkTanimiYok
  const hasLimitGuncelleme = hasRules && Boolean(String(form.limitTutarGuncelleme || '').trim())

  useEffect(() => {
    const close = () => setOpenMenuRowId(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => `${r.kod} ${r.ad} ${r.doviz}`.toLowerCase().includes(q))
  }, [rows, search])

  const allChecked = filtered.length > 0 && selected.length === filtered.length
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map((r) => r.id))
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const openCreate = () => {
    setForm(emptyForm())
    setFormMode('create')
    setEditId(null)
    setViewMode('form')
  }

  const openUpdate = (row) => {
    setForm(seedToForm(row))
    setFormMode('update')
    setEditId(row.id)
    setViewMode('form')
    setOpenMenuRowId(null)
  }

  const openYillikCreate = () => {
    setYillikDraft(emptyYillikRow())
    setYillikEditId(null)
    setYillikFormOpen(true)
  }

  const openYillikEdit = (row) => {
    setYillikDraft(normalizeYillikRow(row))
    setYillikEditId(row.id)
    setYillikFormOpen(true)
  }

  const removeYillikRow = (id) => {
    setForm((f) => ({
      ...f,
      yillikParametreler: f.yillikParametreler.filter((r) => r.id !== id),
    }))
  }

  const saveYillikForm = () => {
    if (!yillikDraft.degerTipi) {
      alert('Değer Tipi zorunludur.')
      return
    }
    if (yillikDraft.degerTipi === 'Oran' && !String(yillikDraft.ygkOrani || '').trim()) {
      alert('YGK Oranı zorunludur.')
      return
    }
    if (yillikDraft.degerTipi === 'Tutar' && !String(yillikDraft.ygkTutari || '').trim()) {
      alert('YGK Tutarı zorunludur.')
      return
    }
    const row = normalizeYillikRow({ ...yillikDraft, id: yillikEditId ?? Date.now() })
    setForm((f) => ({
      ...f,
      yillikParametreler: yillikEditId
        ? f.yillikParametreler.map((r) => (r.id === yillikEditId ? row : r))
        : [...f.yillikParametreler, row],
    }))
    setYillikFormOpen(false)
  }

  const validateForm = () => {
    if (!form.kod.trim() || !form.ad.trim()) {
      alert('YGK Kodu ve YGK Adı zorunludur.')
      return false
    }
    if (formMode === 'create' && rows.some((r) => r.kod.toLowerCase() === form.kod.trim().toLowerCase())) {
      alert('Bu YGK kodu sistemde mevcuttur.')
      return false
    }
    if (isKuralLimit && !form.araVermeKuralKodu.trim()) {
      alert('Limit Tutar Tipi Kural seçildiğinde Ara Verme Hesaplama Kuralı zorunludur.')
      return false
    }
    if (yuvarlamaAktif && !String(form.yuvarlamaDegeri || '').trim()) {
      alert('Yuvarlama Tavana veya Tabana seçildiğinde Yuvarlama Değeri zorunludur.')
      return false
    }
    return true
  }

  const saveForm = () => {
    if (!validateForm()) return
    const today = new Date().toLocaleDateString('tr-TR')
    const ygkTanimiYok = form.ygkTanimiYok
    const payload = {
      kod: form.kod.trim(),
      ad: form.ad.trim(),
      versiyon: form.versiyon,
      tarih: today,
      doviz: form.doviz === 'TL' ? 'TRL' : form.doviz,
      borcTipi: ygkTanimiYok ? 'Yok' : form.borcTipi,
      yil: ygkTanimiYok ? 'Yok' : form.yilTipi,
      limit: ygkTanimiYok ? 'Yok' : form.limitTutarTipi,
      limitGuncelleme: ygkTanimiYok ? '' : form.limitTutarGuncelleme,
      kademe: ygkTanimiYok ? 'Yok' : form.kademeTipi,
      sifirla: form.yilBazindaSifirla ? 'Evet' : 'Hayır',
      araVermeKural: ygkTanimiYok ? '' : form.araVermeKuralKodu,
      donemGun: ygkTanimiYok ? '' : form.donemGun,
      donemAy: ygkTanimiYok ? '' : form.donemAy,
      yuvarlama: ygkTanimiYok ? 'Yok' : form.yuvarlama,
      yuvarlamaDegeri: ygkTanimiYok ? '' : form.yuvarlamaDegeri,
      yillikParametreler: ygkTanimiYok ? [] : form.yillikParametreler.map((rule) => normalizeYillikRow(rule)),
    }
    if (formMode === 'update' && editId) {
      setRows((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setViewMode('list')
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt çıkarılsın mı?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setSelected((prev) => prev.filter((id) => id !== row.id))
    setOpenMenuRowId(null)
  }

  if (viewMode === 'form') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100 shrink-0"
              aria-label="Geri"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 truncate">
              {formMode === 'create' ? 'YGK Parametreleri Ekle' : `YGK Parametreleri Güncelle (${form.kod})`}
            </h2>
          </div>
          <OutlineButton type="button" onClick={() => setHelpOpen(true)} className="shrink-0">
            <BookOpen className="w-4 h-4" /> Ekran Anlatımı
          </OutlineButton>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Kodu <span className="text-red-500">*</span></label>
                <input
                  className="form-input"
                  value={form.kod}
                  disabled={formMode === 'update'}
                  onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Adı <span className="text-red-500">*</span></label>
                <input className="form-input" value={form.ad} onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</label>
                <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" disabled readOnly value={form.versiyon} />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300"
                checked={form.ygkTanimiYok}
                onChange={(e) => setForm((f) => ({ ...f, ygkTanimiYok: e.target.checked }))}
              />
              YGK Tanımı Yok
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Döviz</label>
                <select
                  className="form-select"
                  value={form.doviz}
                  onChange={(e) => setForm((f) => ({ ...f, doviz: e.target.value }))}
                >
                  {DOVIZ_OPTIONS.map((d) => (
                    <option key={d.code} value={d.code}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Borç Tipi</label>
                <select
                  className="form-select"
                  disabled={!hasRules}
                  value={form.borcTipi}
                  onChange={(e) => setForm((f) => ({ ...f, borcTipi: e.target.value }))}
                >
                  {BORC_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Yıl Tipi</label>
                <select
                  className="form-select"
                  disabled={!hasRules}
                  value={form.yilTipi}
                  onChange={(e) => setForm((f) => ({ ...f, yilTipi: e.target.value }))}
                >
                  {YIL_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kademe Tipi</label>
                <select
                  className="form-select"
                  disabled={!hasRules}
                  value={form.kademeTipi}
                  onChange={(e) => setForm((f) => ({ ...f, kademeTipi: e.target.value }))}
                >
                  {KADEME_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Limit Tutar Tipi</label>
                <select
                  className="form-select"
                  disabled={!hasRules}
                  value={form.limitTutarTipi}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    limitTutarTipi: e.target.value,
                    araVermeKuralKodu: e.target.value === 'Kural' ? f.araVermeKuralKodu : '',
                  }))}
                >
                  {LIMIT_TUTAR_TIPI_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Limit Tutar Güncelleme Türü</label>
                <select
                  className="form-select"
                  disabled={!hasRules}
                  value={form.limitTutarGuncelleme}
                  onChange={(e) => setForm((f) => ({ ...f, limitTutarGuncelleme: e.target.value }))}
                >
                  <option value="">Seçiniz...</option>
                  {LIMIT_TUTAR_GUNCELLEME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dönem Gün/Ay</label>
                <div className="flex items-center gap-2">
                  <input
                    className={`form-input flex-1 ${!hasLimitGuncelleme ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                    placeholder="Gün"
                    disabled={!hasLimitGuncelleme}
                    value={form.donemGun}
                    onChange={(e) => setForm((f) => ({ ...f, donemGun: e.target.value }))}
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    className={`form-input flex-1 ${!hasLimitGuncelleme ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                    placeholder="Ay"
                    disabled={!hasLimitGuncelleme}
                    value={form.donemAy}
                    onChange={(e) => setForm((f) => ({ ...f, donemAy: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Yuvarlama</label>
                <select
                  className={`form-select ${!hasLimitGuncelleme ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                  disabled={!hasLimitGuncelleme}
                  value={form.yuvarlama}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    yuvarlama: e.target.value,
                    yuvarlamaDegeri: (e.target.value === 'Tavana' || e.target.value === 'Tabana') ? f.yuvarlamaDegeri : '',
                  }))}
                >
                  {YUVARLAMA_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {yuvarlamaAktif && (
                  <input
                    className={`form-input mt-2 ${!hasLimitGuncelleme ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                    placeholder="Yuvarlama Değeri"
                    disabled={!hasLimitGuncelleme}
                    value={form.yuvarlamaDegeri}
                    onChange={(e) => setForm((f) => ({ ...f, yuvarlamaDegeri: e.target.value }))}
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ara Verme Hesaplama Kuralı</label>
                <div className="flex gap-2">
                  <input
                    className={`form-input flex-1 ${!isKuralLimit ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                    placeholder="Kural Kodu"
                    disabled={!hasRules || !isKuralLimit}
                    value={form.araVermeKuralKodu}
                    onChange={(e) => setForm((f) => ({ ...f, araVermeKuralKodu: e.target.value }))}
                  />
                  <OutlineButton disabled={!hasRules || !isKuralLimit}>Seç</OutlineButton>
                </div>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300"
                disabled={!hasRules}
                checked={form.yilBazindaSifirla}
                onChange={(e) => setForm((f) => ({ ...f, yilBazindaSifirla: e.target.checked }))}
              />
              Yıl Bazında Sıfırla
            </label>

            {hasRules && (
              <div className="border border-slate-200 rounded-lg px-4 py-3 bg-sky-50/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Yıllık Parametreler (Limit ve Kademeler)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{displayYillikOzet(form.yillikParametreler)} tanımlı</p>
                </div>
                <OutlineButton onClick={() => setYillikListOpen(true)}>Yıllık Parametreleri Yönet</OutlineButton>
              </div>
            )}

            <Modal
              open={yillikListOpen}
              onClose={() => setYillikListOpen(false)}
              title="Yıllık Parametreler"
              description="Limit ve kademe tanımlarını listeleyin, ekleyin veya güncelleyin."
              size="xl"
              footer={<OutlineButton onClick={() => setYillikListOpen(false)}>Kapat</OutlineButton>}
            >
              <div className="flex justify-end mb-3">
                <PrimaryButton onClick={openYillikCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full grid-table text-xs min-w-[1200px]">
                  <thead>
                    <tr>
                      <th>Yıl Alt</th>
                      <th>Yıl Üst</th>
                      <th>{limitLabels.alt}</th>
                      <th>{limitLabels.ust}</th>
                      <th>Döviz</th>
                      <th>Kademe Ödeme Dönemi</th>
                      <th>Ödeme Aracı</th>
                      <th>Ödeme Dönemi</th>
                      <th>Banka</th>
                      <th>Değer Tipi</th>
                      <th>YGK Oranı/Tutarı</th>
                      <th className="text-center w-20">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.yillikParametreler.map((row) => (
                      <tr key={row.id}>
                        <td>{row.yilAlt || '—'}</td>
                        <td>{row.yilUst || '—'}</td>
                        <td>{row.tutarAlt || '—'}</td>
                        <td>{row.tutarUst || '—'}</td>
                        <td>{row.doviz || '—'}</td>
                        <td>{row.kademeDonemi || '—'}</td>
                        <td>{row.odemeAraci || '—'}</td>
                        <td>{row.odemeDonemi || '—'}</td>
                        <td>{row.banka || '—'}</td>
                        <td>{row.degerTipi || '—'}</td>
                        <td>{displayYgkDeger(row)}</td>
                        <td className="text-center">
                          <div className="inline-flex items-center gap-1">
                            <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-blue-600" onClick={() => openYillikEdit(row)} aria-label="Güncelle">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded hover:bg-red-50 text-red-600" onClick={() => removeYillikRow(row.id)} aria-label="Sil">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {form.yillikParametreler.length === 0 && (
                      <tr><td colSpan={12} className="text-center py-8 text-slate-500">Kayıt bulunamadı. Yeni Ekle ile tanım oluşturun.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Modal>

            <Modal
              open={yillikFormOpen}
              onClose={() => setYillikFormOpen(false)}
              title={yillikEditId ? 'Yıllık Parametre Güncelle' : 'Yıllık Parametre Ekle'}
              size="lg"
              footer={(
                <>
                  <OutlineButton onClick={() => setYillikFormOpen(false)}>İptal</OutlineButton>
                  <OutlineButton
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setYillikDraft(emptyYillikRow())}
                  >
                    <Trash2 className="w-4 h-4" /> Temizle
                  </OutlineButton>
                  <PrimaryButton onClick={saveYillikForm}>Kaydet</PrimaryButton>
                </>
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Yıl Alt Limiti</label>
                  <input className="form-input" value={yillikDraft.yilAlt} onChange={(e) => setYillikDraft((d) => ({ ...d, yilAlt: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Yıl Üst Limiti</label>
                  <input className="form-input" value={yillikDraft.yilUst} onChange={(e) => setYillikDraft((d) => ({ ...d, yilUst: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{limitLabels.alt}</label>
                  <input className="form-input" value={yillikDraft.tutarAlt} onChange={(e) => setYillikDraft((d) => ({ ...d, tutarAlt: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{limitLabels.ust}</label>
                  <input className="form-input" value={yillikDraft.tutarUst} onChange={(e) => setYillikDraft((d) => ({ ...d, tutarUst: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tutar Alt Limit Kuralı</label>
                  <div className="flex gap-2">
                    <input className="form-input flex-1" value={yillikDraft.tutarAltLimitKurali} onChange={(e) => setYillikDraft((d) => ({ ...d, tutarAltLimitKurali: e.target.value }))} />
                    <OutlineButton onClick={() => setYillikDraft((d) => ({ ...d, tutarAltLimitKurali: 'KRL-LMT-01' }))}>Seç</OutlineButton>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tutar Üst Limit Kuralı</label>
                  <div className="flex gap-2">
                    <input className="form-input flex-1" value={yillikDraft.tutarUstLimitKurali} onChange={(e) => setYillikDraft((d) => ({ ...d, tutarUstLimitKurali: e.target.value }))} />
                    <OutlineButton onClick={() => setYillikDraft((d) => ({ ...d, tutarUstLimitKurali: 'KRL-LMT-02' }))}>Seç</OutlineButton>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Limit Döviz</label>
                  <select className="form-select" value={yillikDraft.doviz} onChange={(e) => setYillikDraft((d) => ({ ...d, doviz: e.target.value }))}>
                    <option value="">Seçiniz...</option>
                    {['TL', 'USD', 'EUR'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kademe Ödeme Dönemi</label>
                  <select className="form-select" value={yillikDraft.kademeDonemi} onChange={(e) => setYillikDraft((d) => ({ ...d, kademeDonemi: e.target.value }))}>
                    <option value="">Seçiniz...</option>
                    {DONEM_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ödeme Araçları</label>
                  <select className="form-select" value={yillikDraft.odemeAraci} onChange={(e) => setYillikDraft((d) => ({ ...d, odemeAraci: e.target.value }))}>
                    <option value="">Seçiniz...</option>
                    {ODEME_ARACI_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ödeme Dönemi</label>
                  <select className="form-select" value={yillikDraft.odemeDonemi} onChange={(e) => setYillikDraft((d) => ({ ...d, odemeDonemi: e.target.value }))}>
                    <option value="">Seçiniz...</option>
                    {DONEM_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Banka</label>
                  <select className="form-select" value={yillikDraft.banka} onChange={(e) => setYillikDraft((d) => ({ ...d, banka: e.target.value }))}>
                    <option value="">Seçiniz...</option>
                    {BANKA_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Değer Tipi <span className="text-red-500">*</span></label>
                  <select
                    className="form-select"
                    value={yillikDraft.degerTipi}
                    onChange={(e) => setYillikDraft((d) => ({ ...d, degerTipi: e.target.value, ygkOrani: '', ygkTutari: '' }))}
                  >
                    {DEGER_TIPI_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {yillikDraft.degerTipi === 'Oran' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Oranı <span className="text-red-500">*</span></label>
                    <input className="form-input" value={yillikDraft.ygkOrani} onChange={(e) => setYillikDraft((d) => ({ ...d, ygkOrani: e.target.value }))} />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Tutarı <span className="text-red-500">*</span></label>
                    <input className="form-input" value={yillikDraft.ygkTutari} onChange={(e) => setYillikDraft((d) => ({ ...d, ygkTutari: e.target.value }))} />
                  </div>
                )}
              </div>
            </Modal>
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <OutlineButton onClick={() => setViewMode('list')}>İptal</OutlineButton>
          <OutlineButton
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setForm(emptyForm())}
          >
            <Trash2 className="w-4 h-4" /> Temizle
          </OutlineButton>
          <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
        </div>

        <Modal
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          size="xl"
          title="YGK Tanımlama Ekranı Kullanıcı Kılavuzu"
          description="Yönetim Gider Kesintisi (YGK) parametreleri ve kural tanımları"
          footer={<PrimaryButton onClick={() => setHelpOpen(false)}>Kapat</PrimaryButton>}
        >
          <YgkEkranAnlatimiContent />
        </Modal>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="YGK Parametreleri"
        description="Yönetim Gider Kesintisi (YGK) tanımları"
        right={(
          <>
            <OutlineButton disabled={selected.length === 0}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
              {selected.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full">{selected.length}</span>
              )}
            </OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        )}
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Kod / Ad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10"><input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} /></th>
              {LIST_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}
              <th className="w-12 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="rounded" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} /></td>
                {LIST_COLUMNS.map((c) => (
                  <td
                    key={c.key}
                    className={`${c.key === 'kod' ? 'font-semibold' : ''} ${c.computed === 'sifirla' ? 'text-center' : ''}`}
                  >
                    {renderCellValue(row, c)}
                  </td>
                ))}
                <td className="text-right relative">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuRowId((prev) => (prev === row.id ? null : row.id))
                    }}
                  >
                    ...
                  </button>
                  {openMenuRowId === row.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openUpdate(row)}>Güncelle</button>
                      <button type="button" className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => removeRow(row)}>Çıkar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={LIST_COLUMNS.length + 2} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!actionInfo}
        onClose={() => setActionInfo(null)}
        title={actionInfo?.label}
        footer={<PrimaryButton onClick={() => setActionInfo(null)}>Tamam</PrimaryButton>}
      >
        <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(actionInfo?.row || {}, null, 2)}</pre>
      </Modal>
    </div>
  )
}
