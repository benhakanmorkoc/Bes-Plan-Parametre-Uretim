import { useMemo, useState } from 'react'
import { Search, FileText } from 'lucide-react'
import { ScreenHeader, OutlineButton, StatusBadge } from '../ui/Toolbar'
import { sozlesmelerListe } from '../../data/mockData'

export default function Sozlesmeler() {
  const [search, setSearch] = useState('')
  const [secili, setSecili] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return sozlesmelerListe
    const q = search.toLowerCase()
    return sozlesmelerListe.filter((s) => [s.id, s.tckn, s.adSoyad, s.plan].some((v) => String(v).toLowerCase().includes(q)))
  }, [search])

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Sozlesmeler"
        description="Aktif sozlesmelerinizi listeleyin, detay ve yasal dokumantasyona erisin"
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Sozlesme No / TCKN..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        <div className="lg:col-span-2 overflow-auto border-r border-slate-100">
          <table className="w-full grid-table">
            <thead><tr><th>Sozlesme No</th><th>TCKN</th><th>Ad Soyad</th><th>Plan</th><th>Baslangic</th><th>Durum</th><th className="w-16"></th></tr></thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} onClick={() => setSecili(s)} className={`cursor-pointer ${secili?.id === s.id ? 'bg-blue-50' : ''}`}>
                  <td className="font-mono text-xs">{s.id}</td>
                  <td>{s.tckn}</td>
                  <td className="font-medium text-slate-700">{s.adSoyad}</td>
                  <td>{s.plan}</td>
                  <td>{s.baslangic}</td>
                  <td><StatusBadge>{s.durum}</StatusBadge></td>
                  <td><OutlineButton small={true}><FileText className="w-3.5 h-3.5" /></OutlineButton></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>}
            </tbody>
          </table>
        </div>

        <aside className="p-5 overflow-auto">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Sozlesme Detayi</h3>
          {!secili && <p className="text-sm text-slate-500">Detaylari gormek icin bir sozlesme seciniz.</p>}
          {secili && (
            <dl className="text-sm space-y-2">
              <Row label="Sozlesme No" value={secili.id} />
              <Row label="Ad Soyad" value={secili.adSoyad} />
              <Row label="TCKN" value={secili.tckn} />
              <Row label="Plan" value={secili.plan} />
              <Row label="Baslangic" value={secili.baslangic} />
              <Row label="Durum" value={secili.durum} />
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <OutlineButton small={true}><FileText className="w-3.5 h-3.5" /> Sozlesme PDF</OutlineButton>
                <OutlineButton small={true}><FileText className="w-3.5 h-3.5" /> Plan Ozelligi</OutlineButton>
                <OutlineButton small={true}><FileText className="w-3.5 h-3.5" /> Tahsilat Gecmisi</OutlineButton>
              </div>
            </dl>
          )}
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 pb-1 last:border-0">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-700">{value}</dd>
    </div>
  )
}
