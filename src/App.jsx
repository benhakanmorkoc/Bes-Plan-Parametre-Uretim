import { useMemo, useState } from 'react'
import DemoScreen from './components/DemoScreen'

const menu = [
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

  const content = useMemo(() => {
    if (activeTab === 'demo') return <DemoScreen />
    if (activeTab === 'teklif') return <div className="placeholder">Teklif ekrani bir sonraki adimda eklenecek.</div>
    if (activeTab === 'basvuru') return <div className="placeholder">Basvuru ekrani bir sonraki adimda eklenecek.</div>
    return <div className="placeholder">Sozlesmeler ekrani bir sonraki adimda eklenecek.</div>
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
              {group.children.map((item) => (
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
