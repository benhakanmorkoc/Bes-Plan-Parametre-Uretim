import { useMemo, useState } from 'react'
import { Plus, Search, FileText, ArrowRight } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import { teklifler, tariffeListesi } from '../../data/mockData'

export default function Teklif() {
  const [tab, setTab] = useState('liste')
  const [form, setForm] = useState({ tckn: '', adSoyad: '', dogum: '', plan: '', tutar: '', donem: 'Aylik' })
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return teklifler
    const q = search.toLowerCase()
    return teklifler.filter((t) => [t.id, t.tckn, t.adSoyad, t.plan].some((v) => String(v).toLowerCase().includes(q)))
  }, [search])

  const planOzeti = useMemo(() => tariffeListesi.find((p) => p.ad === form.plan), [form.plan])

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Teklif Yonetimi"
        description="Yeni teklif olustur, mevcut teklifleri listele ve yonet"
        right={
          tab === 'liste' ? (
            <PrimaryButton onClick={() => setTab('yeni')}><Plus className="w-4 h-4" /> Yeni Teklif</PrimaryButton>
          ) : (
            <OutlineButton onClick={() => setTab('liste')}>Listeye Don</OutlineButton>
          )
        }
      />

      <div className="px-6 pt-3 border-b border-slate-100 flex gap-2">
        {[
          { k: 'liste', l: 'Teklif Listesi' },
          { k: 'yeni', l: 'Yeni Teklif' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-3 py-2 text-sm rounded-t-md border-b-2 ${tab === t.k ? 'border-indigo-600 text-indigo-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'liste' && (
        <>
          <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                placeholder="Teklif No / TCKN / Ad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full grid-table">
              <thead>
                <tr>
                  <th>Teklif No</th>
                  <th>TCKN</th>
                  <th>Ad Soyad</th>
                  <th>Plan</th>
                  <th>Tarih</th>
                  <th className="text-right">Tutar</th>
                  <th>Durum</th>
                  <th className="w-24">Islem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs">{t.id}</td>
                    <td>{t.tckn}</td>
                    <td className="font-medium text-slate-700">{t.adSoyad}</td>
                    <td>{t.plan}</td>
                    <td>{t.tarih}</td>
                    <td className="text-right">{t.tutar.toLocaleString('tr-TR')} TL</td>
                    <td><StatusBadge status={t.durum === 'Onayli' ? 'Aktif' : t.durum === 'Iptal' ? 'Pasif' : 'Taslak'}>{t.durum}</StatusBadge></td>
                    <td><OutlineButton small={true}><FileText className="w-3.5 h-3.5" /> Detay</OutlineButton></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'yeni' && (
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-50/60 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Katilimci Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="TCKN"><input className="form-input" value={form.tckn} maxLength={11} onChange={(e) => setForm({ ...form, tckn: e.target.value.replace(/\D/g, '') })} /></Field>
                <Field label="Ad Soyad"><input className="form-input" value={form.adSoyad} onChange={(e) => setForm({ ...form, adSoyad: e.target.value })} /></Field>
                <Field label="Dogum Tarihi"><input type="date" className="form-input" value={form.dogum} onChange={(e) => setForm({ ...form, dogum: e.target.value })} /></Field>
              </div>
            </section>

            <section className="bg-slate-50/60 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Plan ve Katki</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Plan">
                  <select className="form-input" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                    <option value="">Plan seciniz</option>
                    {tariffeListesi.map((p) => <option key={p.id} value={p.ad}>{p.ad}</option>)}
                  </select>
                </Field>
                <Field label="Aylik Katki Tutari (TL)">
                  <input type="number" className="form-input" value={form.tutar} onChange={(e) => setForm({ ...form, tutar: e.target.value })} />
                </Field>
                <Field label="Odeme Donemi">
                  <select className="form-input" value={form.donem} onChange={(e) => setForm({ ...form, donem: e.target.value })}>
                    <option>Aylik</option><option>Uc Aylik</option><option>Alti Aylik</option><option>Yillik</option>
                  </select>
                </Field>
              </div>
            </section>

            <div className="flex justify-end gap-2">
              <OutlineButton onClick={() => setTab('liste')}>Iptal</OutlineButton>
              <PrimaryButton>Teklifi Olustur <ArrowRight className="w-4 h-4" /></PrimaryButton>
            </div>
          </div>

          <aside className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-4 h-fit">
            <h3 className="text-sm font-semibold text-indigo-900 mb-3">Teklif Ozeti</h3>
            <dl className="text-sm space-y-2 text-indigo-900/80">
              <Row label="TCKN" value={form.tckn || '-'} />
              <Row label="Plan" value={form.plan || '-'} />
              <Row label="Sozlesme Tipi" value={planOzeti?.sozlesmeTipi || '-'} />
              <Row label="Min Katki" value={planOzeti ? `${planOzeti.minKatki} TL` : '-'} />
              <Row label="Aylik Katki" value={form.tutar ? `${Number(form.tutar).toLocaleString('tr-TR')} TL` : '-'} />
              <Row label="Odeme Donemi" value={form.donem} />
            </dl>
          </aside>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>
      {children}
    </label>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-indigo-100 pb-1 last:border-0">
      <dt className="text-xs uppercase tracking-wide text-indigo-700/70">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
