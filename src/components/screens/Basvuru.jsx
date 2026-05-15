import { useMemo, useState } from 'react'
import { CheckCircle2, FileSignature, Search } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import { basvurular, teklifler } from '../../data/mockData'

const ADIMLAR = [
  { k: 'kvkk', l: 'KVKK Onay' },
  { k: 'risk', l: 'Risk Profili' },
  { k: 'odeme', l: 'Odeme Araci' },
  { k: 'imza', l: 'E-Imza' },
]

export default function Basvuru() {
  const [tab, setTab] = useState('liste')
  const [adim, setAdim] = useState('kvkk')
  const [secilenTeklif, setSecilenTeklif] = useState('')
  const [kvkk, setKvkk] = useState(false)
  const [riskSeviye, setRiskSeviye] = useState('')
  const [odemeAraci, setOdemeAraci] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return basvurular
    const q = search.toLowerCase()
    return basvurular.filter((b) => [b.id, b.tckn, b.adSoyad, b.plan].some((v) => String(v).toLowerCase().includes(q)))
  }, [search])

  const adimIndex = ADIMLAR.findIndex((a) => a.k === adim)

  const ileri = () => {
    const next = ADIMLAR[adimIndex + 1]
    if (next) setAdim(next.k)
  }
  const geri = () => {
    const prev = ADIMLAR[adimIndex - 1]
    if (prev) setAdim(prev.k)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Basvuru Yonetimi"
        description="Teklif sonrasi basvuru islemleri ve onay adimlari"
        right={
          tab === 'liste'
            ? <PrimaryButton onClick={() => setTab('yeni')}><FileSignature className="w-4 h-4" /> Yeni Basvuru</PrimaryButton>
            : <OutlineButton onClick={() => setTab('liste')}>Listeye Don</OutlineButton>
        }
      />

      <div className="px-6 pt-3 border-b border-slate-100 flex gap-2">
        {[{ k: 'liste', l: 'Basvuru Listesi' }, { k: 'yeni', l: 'Yeni Basvuru' }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-3 py-2 text-sm rounded-t-md border-b-2 ${tab === t.k ? 'border-indigo-600 text-indigo-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'liste' && (
        <>
          <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Basvuru No / TCKN..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full grid-table">
              <thead><tr><th>Basvuru No</th><th>TCKN</th><th>Ad Soyad</th><th>Plan</th><th>Tarih</th><th>Durum</th></tr></thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="font-mono text-xs">{b.id}</td>
                    <td>{b.tckn}</td>
                    <td className="font-medium text-slate-700">{b.adSoyad}</td>
                    <td>{b.plan}</td>
                    <td>{b.tarih}</td>
                    <td><StatusBadge>{b.durum}</StatusBadge></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'yeni' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-3 mb-6">
            {ADIMLAR.map((a, i) => {
              const done = i < adimIndex
              const active = i === adimIndex
              return (
                <div key={a.k} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${active ? 'bg-blue-600 border-blue-600 text-white' : done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm ${active ? 'font-semibold text-slate-800' : done ? 'text-slate-600' : 'text-slate-400'}`}>{a.l}</span>
                  {i < ADIMLAR.length - 1 && <div className="w-8 h-0.5 bg-slate-200" />}
                </div>
              )
            })}
          </div>

          <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-5 max-w-3xl">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bagli Teklif</label>
              <select className="form-input max-w-md" value={secilenTeklif} onChange={(e) => setSecilenTeklif(e.target.value)}>
                <option value="">Teklif seciniz</option>
                {teklifler.map((t) => <option key={t.id} value={t.id}>{t.id} - {t.adSoyad} ({t.plan})</option>)}
              </select>
            </div>

            {adim === 'kvkk' && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">KVKK Aydinlatma Metni</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda kisisel verilerinizin islenmesine iliskin aydinlatma metnini okudum, anladim ve kabul ediyorum.</p>
                <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} /> KVKK metnini okudum, onayliyorum.</label>
              </div>
            )}

            {adim === 'risk' && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Risk Getiri Profili</h3>
                <p className="text-xs text-slate-500 mb-3">Anketi tamamladiginizi varsayiyoruz. Sonuc:</p>
                <select className="form-input max-w-xs" value={riskSeviye} onChange={(e) => setRiskSeviye(e.target.value)}>
                  <option value="">Risk seviyesi seciniz</option>
                  <option>Cok Dusuk</option><option>Dusuk</option><option>Orta</option><option>Yuksek</option><option>Cok Yuksek</option>
                </select>
              </div>
            )}

            {adim === 'odeme' && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Odeme Araci</h3>
                <select className="form-input max-w-xs" value={odemeAraci} onChange={(e) => setOdemeAraci(e.target.value)}>
                  <option value="">Odeme araci seciniz</option>
                  <option>Kredi Karti</option><option>Banka Hesabi (BES Tahsilat)</option><option>Banka Ceki</option>
                </select>
              </div>
            )}

            {adim === 'imza' && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">E-Imza & Sozlesmelesme</h3>
                <p className="text-xs text-slate-500 mb-3">Tum adimlar tamamlandi. Sozlesmenin imzalanmasi icin onaya gonderebilirsiniz.</p>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li>Bagli Teklif: <strong>{secilenTeklif || '-'}</strong></li>
                  <li>KVKK: <strong>{kvkk ? 'Onayli' : 'Beklemede'}</strong></li>
                  <li>Risk Profili: <strong>{riskSeviye || '-'}</strong></li>
                  <li>Odeme Araci: <strong>{odemeAraci || '-'}</strong></li>
                </ul>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <OutlineButton onClick={geri} disabled={adimIndex === 0}>Geri</OutlineButton>
              {adimIndex < ADIMLAR.length - 1
                ? <PrimaryButton onClick={ileri}>Devam</PrimaryButton>
                : <PrimaryButton>Sozlesmeye Donustur</PrimaryButton>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
