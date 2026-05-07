import { useMemo, useState } from 'react'
import DemoScreen from './components/DemoScreen'

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
      { id: 'egpBireyTipi', label: 'EGP Birey Tipi' },
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
    label: 'BES Uretim',
    children: [
      { id: 'demo', label: 'Demo' },
      { id: 'teklif', label: 'Teklif' },
      { id: 'basvuru', label: 'Basvuru' },
      { id: 'sozlesmeler', label: 'Sozlesmeler' },
    ],
  },
]

function App() {
  const [activeTab, setActiveTab] = useState('demo')
  const [expandedGroups] = useState(() => Object.fromEntries(menu.map((m) => [m.id, true])))

  const content = useMemo(() => {
    if (activeTab === 'demo') return <DemoScreen />
    if (activeTab === 'teklif') return <div className="placeholder">Teklif ekrani bir sonraki adimda eklenecek.</div>
    if (activeTab === 'basvuru') return <div className="placeholder">Basvuru ekrani bir sonraki adimda eklenecek.</div>
    if (activeTab === 'sozlesmeler') return <div className="placeholder">Sozlesmeler ekrani bir sonraki adimda eklenecek.</div>
    const selectedItem = menu.flatMap((group) => group.children).find((item) => item.id === activeTab)
    return <div className="placeholder">{selectedItem?.label || 'Secilen ekran'} icin prototip bir sonraki adimda eklenecek.</div>
  }, [activeTab])

  return (
    <div className="app">
      <header className="topbar">
        <h1>BES Plan Parametre Uretim</h1>
        <span>React + Vite hizli prototip</span>
      </header>
      <div className="layout">
        <aside className="sidebar">
          {menu.map((group) => (
            <div key={group.id} className="group">
              <div className="groupTitle">{group.label}</div>
              {expandedGroups[group.id] && group.children.map((item) => (
                <button
                  key={item.id}
                  className={activeTab === item.id ? 'menuBtn active' : 'menuBtn'}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>
        <main className="main">{content}</main>
      </div>
    </div>
  )
}

export default App
