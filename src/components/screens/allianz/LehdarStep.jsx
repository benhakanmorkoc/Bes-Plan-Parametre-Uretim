import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function ZorunluUyari() {
  return <p className="text-[11px] text-red-600 font-semibold mt-1">⚠ Zorunlu alan!</p>
}

function EvetHayirGroup({ label, name, value, onChange }) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</span>
      <div className="flex gap-6">
        {['Evet', 'Hayır'].map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === v}
              onChange={() => onChange(v)}
              className="w-4 h-4 text-blue-600"
            />
            {v}
          </label>
        ))}
      </div>
    </div>
  )
}

function AccordionPanel({ title, open, onToggle, children }) {
  return (
    <section className="border border-slate-200 rounded-lg overflow-hidden mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 bg-slate-100 px-4 py-3 text-left border-b border-slate-200 hover:bg-slate-200/80 transition"
      >
        <span className="text-sm font-bold text-slate-700">{title}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>
      {open && <div className="p-4 md:p-5 bg-white">{children}</div>}
    </section>
  )
}

export default function LehdarStep({ formData, onChange }) {
  const set = (field, value) => onChange(field, value)
  const evet = formData.lehdarBelirlenmis === 'Evet'
  const [aramaAcik, setAramaAcik] = useState(true)
  const [detayAcik, setDetayAcik] = useState(false)

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h3 className="text-sm font-bold text-slate-800">Lehdar Bilgileri</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
        <EvetHayirGroup
          label="Lehdar Belirlenmiş mi?"
          name="lehdarBelirlenmis"
          value={formData.lehdarBelirlenmis}
          onChange={(v) => set('lehdarBelirlenmis', v)}
        />
        {evet && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Müşteri Tipi</span>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="lehdarMusteriTipi"
                checked={formData.lehdarMusteriTipi === 'Gerçek'}
                onChange={() => set('lehdarMusteriTipi', 'Gerçek')}
                className="w-4 h-4 text-blue-600"
              />
              Gerçek
            </label>
          </div>
        )}
      </div>

      {formData.lehdarBelirlenmis === 'Hayır' && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded flex items-center gap-4">
          <p className="text-blue-900 font-semibold text-sm italic tracking-tight">
            Kanuni Varisler Lehdar Olarak Tanımlanacaktır.
          </p>
        </div>
      )}

      {evet && (
        <>
          <div className="border-t border-slate-200 pt-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                  <th className="pb-3 pr-4 font-bold">Lehdar Kimlik No</th>
                  <th className="pb-3 pr-4 font-bold">Lehdar Adı</th>
                  <th className="pb-3 pr-4 font-bold">Yüzde</th>
                  <th className="pb-3 text-right font-bold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {(formData.lehdarlar || []).map((l, i) => (
                  <tr key={i} className="border-b border-slate-100 text-sm text-slate-700">
                    <td className="py-3 pr-4 font-mono">{l.kimlikNo}</td>
                    <td className="py-3 pr-4">{l.ad}</td>
                    <td className="py-3 pr-4">{l.yuzde}%</td>
                    <td className="py-3 text-right text-blue-700 text-xs font-bold">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AccordionPanel
            title="(Gerçek) Lehdar Bilgileri Arama"
            open={aramaAcik}
            onToggle={() => setAramaAcik((o) => !o)}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-1">
                <label className="text-xs font-bold text-red-600 uppercase">TCKN/VKN/YKN</label>
                <input
                  className="w-full border-b border-slate-200 p-2 text-sm outline-none focus:border-blue-600 bg-transparent font-mono"
                  value={formData.searchLehdarTckn}
                  onChange={(e) => set('searchLehdarTckn', e.target.value)}
                />
                {!formData.searchLehdarTckn?.trim() && <ZorunluUyari />}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-red-600 uppercase">Doğum Tarihi</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full border-b border-slate-200 p-2 text-sm outline-none focus:border-blue-600 bg-transparent pr-8"
                    value={formData.searchLehdarDogumTarihi}
                    onChange={(e) => set('searchLehdarDogumTarihi', e.target.value)}
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none hidden sm:block">
                    GG/AA/YYYY
                  </span>
                </div>
                {!formData.searchLehdarDogumTarihi && <ZorunluUyari />}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Baba Adı</label>
                <input
                  className="w-full border-b border-slate-200 p-2 text-sm outline-none focus:border-blue-600 bg-transparent"
                  value={formData.searchLehdarBabaAdi}
                  onChange={(e) => set('searchLehdarBabaAdi', e.target.value)}
                />
              </div>
              <div className="flex justify-start md:justify-end pb-1">
                <button
                  type="button"
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-8 py-2 rounded shadow-sm"
                >
                  Ara
                </button>
              </div>
            </div>
          </AccordionPanel>

          <AccordionPanel
            title="(Gerçek) Lehdar Bilgileri Detay"
            open={detayAcik}
            onToggle={() => setDetayAcik((o) => !o)}
          >
            <div className="min-h-[48px]" />
          </AccordionPanel>
        </>
      )}
    </div>
  )
}
