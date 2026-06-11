import { Suspense, lazy, useMemo, useState } from 'react'
import { ChevronDown, Search, X, Settings } from 'lucide-react'

const DemoScreen = lazy(() => import('./components/DemoScreen'))
const UrunPlanTarifeTanimlari = lazy(() => import('./components/screens/UrunPlanTarifeTanimlari'))
const KatkiPayiTemplateleri = lazy(() => import('./components/screens/KatkiPayiTemplateleri'))
const GirisAidati = lazy(() => import('./components/screens/GirisAidati'))
const KesintiRouter = lazy(() => import('./components/screens/KesintiRouter'))
const PlanLookupRouter = lazy(() => import('./components/screens/PlanLookupRouter'))
const TeklifAllianzWizard = lazy(() => import('./components/screens/TeklifAllianzWizard'))
const TeklifAgito = lazy(() => import('./components/screens/TeklifAgito'))
const Basvuru = lazy(() => import('./components/screens/Basvuru'))
const Sozlesmeler = lazy(() => import('./components/screens/Sozlesmeler'))

const KESINTI_IDS = new Set(['ygk', 'ygkMuafiyet', 'araverme', 'bes30', 'ygkBes30', 'egpGenel', 'egpGeriOdeme', 'egpAraOdeme'])
const PLAN_LOOKUP_IDS = new Set([
  'endeksTanimlari', 'asgariUcretTablosu', 'katkiPayiHesaplama', 'sozlesmeTipi', 'borcTipleri',
  'odemeAraclari', 'degisiklikTipleri', 'gecerliSozlesmeCinsi', 'basvuruTipleri', 'tarifePlanDurum',
  'kurTipleri', 'vakifUyeKurum', 'odemeDonemiTurleri', 'girisAidatiTurleri', 'tarifeOzguBelgeTipleri',
  'altBranslar', 'yuvarlamaTipleri', 'ygkYilTipi', 'ygkLimitTutarTipi', 'ygkKademeTipi',
  'ygkYillikKademeDonemi', 'ygkYillikOdemeDonemi', 'araVermeTip',
  'ygkBes30BirikimTipi', 'ygkBes30KesintiDonemi', 'ygkBes30KesintiZamani', 'ygkBes30YgkKesintiTipi',
  'egpBireyTipi', 'egpGeriOdemeTipleri',
  'soruTipleri', 'cevapTipleri', 'soruBankasi', 'soruKumeleri',
])

const menu = [
  {
    id: 'katkiPayiTanimlari',
    label: 'Katki Payi Tanimlari',
    children: [{ id: 'katkiPayiTemplateleri', label: 'Katki Payi Templateleri' }],
  },
  {
    id: 'kesintiTanimlari',
    label: 'Kesinti Tanimlari',
    children: [
      { id: 'girisAidati', label: 'Giris Aidati' },
      { id: 'ygk', label: 'YGK Parametreleri' },
      { id: 'ygkMuafiyet', label: 'YGK Muafiyet' },
      { id: 'araverme', label: 'Ara Verme Kesintisi' },
      { id: 'bes30', label: 'Kesinti BES 3.0' },
      { id: 'ygkBes30', label: 'YGK BES 3.0 Parametreleri' },
    ],
  },
  {
    id: 'egpParametreleri',
    label: 'EGP Parametreleri',
    children: [
      { id: 'egpGenel', label: 'Genel EGP Parametreleri' },
      { id: 'egpGeriOdeme', label: 'EGP Geri Odeme Tipleri' },
      { id: 'egpAraOdeme', label: 'EGP Ara Odeme' },
    ],
  },
  {
    id: 'urunPlanTarife',
    label: 'Urun Plan Tarife',
    children: [{ id: 'urunPlanTarifeTanimlari', label: 'Urun-Plan-Tarife Tanimlari' }],
  },
  {
    id: 'planParametreleri',
    label: 'Plan Parametreleri',
    children: [
      { id: 'endeksTanimlari', label: 'Endeks Tanimlari' },
      { id: 'asgariUcretTablosu', label: 'Asgari Ucret Tablosu' },
      { id: 'katkiPayiHesaplama', label: 'Katki Payi Hesaplama' },
      { id: 'sozlesmeTipi', label: 'Sozlesme Tipi' },
      { id: 'borcTipleri', label: 'Borc Tipleri' },
      { id: 'odemeAraclari', label: 'Odeme Araclari' },
      { id: 'degisiklikTipleri', label: 'Degisiklik Tipleri' },
      { id: 'gecerliSozlesmeCinsi', label: 'Gecerli Sozlesme Cinsi' },
      { id: 'basvuruTipleri', label: 'Basvuru Tipleri' },
      { id: 'tarifePlanDurum', label: 'Tarife Plan Durum' },
      { id: 'kurTipleri', label: 'Kur Tipleri' },
      { id: 'vakifUyeKurum', label: 'Vakif Uye Kurum' },
      { id: 'odemeDonemiTurleri', label: 'Odeme Donemi Turleri' },
      { id: 'girisAidatiTurleri', label: 'Giris Aidati Turleri' },
      { id: 'tarifeOzguBelgeTipleri', label: 'Tarife Ozgu Belge Tipleri' },
      { id: 'altBranslar', label: 'Alt Branslar' },
      { id: 'yuvarlamaTipleri', label: 'Yuvarlama Tipleri' },
      { id: 'ygkYilTipi', label: 'YGK Yil Tipi' },
      { id: 'ygkLimitTutarTipi', label: 'YGK Limit Tutar Tipi' },
      { id: 'ygkKademeTipi', label: 'YGK Kademe Tipi' },
      { id: 'ygkYillikKademeDonemi', label: 'YGK Yillik Kademe Donemi' },
      { id: 'ygkYillikOdemeDonemi', label: 'YGK Yillik Odeme Donemi' },
      { id: 'araVermeTip', label: 'Ara Verme Tip' },
      { id: 'ygkBes30BirikimTipi', label: 'YGK BES3.0 Birikim Tipi' },
      { id: 'ygkBes30KesintiDonemi', label: 'YGK BES3.0 Kesinti Dönemi' },
      { id: 'ygkBes30KesintiZamani', label: 'YGK BES3.0 Kesinti Zamanı' },
      { id: 'ygkBes30YgkKesintiTipi', label: 'YGK BES3.0 YGK Kesinti Tipi' },
      { id: 'egpBireyTipi', label: 'EGP Birey Tipi' },
      { id: 'egpGeriOdemeTipleri', label: 'EGP Geri Odeme Tipleri' },
    ],
  },
  {
    id: 'anketSoruParametreleri',
    label: 'Anket-Soru Parametreleri',
    children: [
      { id: 'soruTipleri', label: 'Soru Tipleri' },
      { id: 'cevapTipleri', label: 'Cevap Tipleri' },
      { id: 'soruBankasi', label: 'Soru Bankasi' },
      { id: 'soruKumeleri', label: 'Soru Kumeleri' },
    ],
  },
  {
    id: 'besUretim',
    label: 'Üretim',
    children: [
      { id: 'demo', label: 'Demo' },
      { id: 'teklifAllianz', label: 'Allianz Teklif' },
      { id: 'teklifAgito', label: 'Agito Teklif' },
      { id: 'basvuru', label: 'Basvuru' },
      { id: 'sozlesmeler', label: 'Sozlesmeler' },
    ],
  },
]

const ScreenLoader = () => (
  <div className="h-full min-h-[240px] flex items-center justify-center text-slate-500 text-sm">Ekran yukleniyor...</div>
)

const Placeholder = ({ label }) => (
  <div className="h-full bg-white rounded-xl border border-slate-200 p-10 text-center flex flex-col items-center justify-center">
    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
      <Settings className="w-6 h-6" />
    </div>
    <h2 className="text-lg font-bold text-slate-800 mb-1">{label}</h2>
    <p className="text-sm text-slate-500 max-w-md">Bu ekran bir sonraki adimda gercek prototipi ile eklenecek.</p>
  </div>
)

function App() {
  const [activeTab, setActiveTab] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(() => Object.fromEntries(menu.map((m) => [m.id, false])))
  const [search, setSearch] = useState('')

  const labelMap = useMemo(() => {
    const m = {}
    menu.forEach((g) => g.children.forEach((c) => { m[c.id] = c.label }))
    return m
  }, [])

  const filteredMenu = useMemo(() => {
    if (!search.trim()) return menu
    const q = search.toLowerCase()
    return menu
      .map((g) => {
        const groupMatch = g.label.toLowerCase().includes(q)
        const children = g.children.filter((c) => c.label.toLowerCase().includes(q))
        if (groupMatch || children.length) return { ...g, children: groupMatch ? g.children : children }
        return null
      })
      .filter(Boolean)
  }, [search])

  const screen = useMemo(() => {
    if (!activeTab) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Settings className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Hos Geldiniz</h2>
          <p className="text-sm text-slate-500 max-w-sm text-center">Soldaki menuden secim yaparak BES ve EGP planlarina ait parametre ekranlarini acabilirsiniz.</p>
        </div>
      )
    }
    if (activeTab === 'urunPlanTarifeTanimlari') return <UrunPlanTarifeTanimlari />
    if (activeTab === 'katkiPayiTemplateleri') return <KatkiPayiTemplateleri />
    if (activeTab === 'girisAidati') return <GirisAidati />
    if (activeTab === 'demo') return <DemoScreen />
    if (activeTab === 'teklifAllianz') return <TeklifAllianzWizard />
    if (activeTab === 'teklifAgito') return <TeklifAgito />
    if (activeTab === 'basvuru') return <Basvuru />
    if (activeTab === 'sozlesmeler') return <Sozlesmeler />
    if (KESINTI_IDS.has(activeTab)) return <KesintiRouter id={activeTab} />
    if (PLAN_LOOKUP_IDS.has(activeTab)) return <PlanLookupRouter id={activeTab} />
    return <Placeholder label={labelMap[activeTab] || activeTab} />
  }, [activeTab, labelMap])

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <h1 className="font-bold text-base text-slate-800">BES Plan Parametre Uretim</h1>
          </div>
          <span className="text-xs text-slate-500 hidden md:inline">React + Vite hizli prototip</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-screen-2xl w-full mx-auto">
        <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Menude ara..."
                className="w-full h-9 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {filteredMenu.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">Sonuc bulunamadi</div>
            )}
            {filteredMenu.map((group) => {
              const expanded = expandedGroups[group.id] !== false
              const isActiveChild = group.children.some((c) => c.id === activeTab)
              return (
                <div key={group.id}>
                  <button
                    onClick={() => setExpandedGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                    className={`w-full text-left px-3 py-2.5 text-sm font-bold rounded-lg flex items-center justify-between text-slate-700 hover:bg-slate-100 ${isActiveChild ? 'bg-slate-50' : ''}`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="ml-4 pl-3 border-l-2 border-slate-100 mt-1 mb-1 space-y-0.5">
                      {group.children.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all ${activeTab === item.id ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Suspense fallback={<ScreenLoader />}>
            {screen}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
