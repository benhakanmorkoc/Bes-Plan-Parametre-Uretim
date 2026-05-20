import { useEffect } from 'react'
import { ArrowLeft, ArrowUp, Info } from 'lucide-react'
import {
  PLAN_OPTIONS,
  PLAN_FONLARI,
  planFonlariOranSifir,
  planFonlariOnerilen,
  SECILEN_FON_ONERILEN,
  FON_SATIR_ONERILEN,
  PIE_SEGMENTS,
} from './planFonData'

const VARLIK_ONERILEN = 'ÖNERİLEN FON'
const VARLIK_SERBEST = 'SERBEST DAĞILIM'

function ThInfo({ children }) {
  return (
    <span className="inline-flex items-center justify-center gap-1">
      {children}
      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden />
    </span>
  )
}

function FonPieChart() {
  let cursor = 0
  const stops = PIE_SEGMENTS.map((s) => {
    const start = cursor
    cursor += s.pct
    return `${s.color} ${start}% ${cursor}%`
  }).join(', ')

  return (
    <div className="flex justify-center py-8 border-t border-slate-200 mt-2">
      <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
        <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${stops})` }} />
        <div className="absolute inset-[22%] rounded-full bg-white shadow-inner" />
        <span className="absolute left-[-8%] top-[22%] text-[11px] font-bold text-slate-800 whitespace-nowrap">
          TL SABİT GETİRİ %31
        </span>
        <span className="absolute right-[-12%] top-[8%] text-[11px] font-bold text-slate-800 whitespace-nowrap">
          YABANCI HİSSE %18
        </span>
        <span className="absolute bottom-[6%] left-[18%] text-[11px] font-bold text-slate-800 whitespace-nowrap">
          ALTIN %11
        </span>
      </div>
    </div>
  )
}

function OnerilenFonView() {
  const row = FON_SATIR_ONERILEN
  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold uppercase px-4 py-2 rounded"
        >
          <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} />
          Daha Fazla TL
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase px-4 py-2 rounded"
        >
          <ArrowUp className="w-3.5 h-3.5" strokeWidth={3} />
          Daha Fazla Döviz
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-white border border-blue-700 text-blue-800 text-[11px] font-bold uppercase px-4 py-2 rounded hover:bg-blue-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={3} />
          Önerilene Dön
        </button>
      </div>

      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide border-b border-slate-100 pb-3">
        Seçilen Fon :{' '}
        <span className="text-slate-800 font-semibold normal-case">{SECILEN_FON_ONERILEN}</span>
      </p>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="text-[11px] font-bold text-slate-500 uppercase border-b-2 border-slate-200">
              <th className="py-3 pr-4 font-bold">Fon Kodu</th>
              <th className="py-3 px-2 text-center font-bold">
                <ThInfo>TL Sabit Getiri</ThInfo>
              </th>
              <th className="py-3 px-2 text-center font-bold">
                <ThInfo>TL Hisse Senedi</ThInfo>
              </th>
              <th className="py-3 px-2 text-center font-bold">
                <ThInfo>Eurobond</ThInfo>
              </th>
              <th className="py-3 px-2 text-center font-bold">
                <ThInfo>Yabancı Hisse</ThInfo>
              </th>
              <th className="py-3 px-2 text-center font-bold">
                <ThInfo>Altın</ThInfo>
              </th>
              <th className="py-3 pl-4 text-center font-bold">Toplam</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-sm font-bold text-slate-800 border-b border-slate-100">
              <td className="py-4 pr-4">{row.kod}</td>
              <td className="py-4 px-2 text-center">% {row.tlSabit}</td>
              <td className="py-4 px-2 text-center">% {row.tlHisse}</td>
              <td className="py-4 px-2 text-center">% {row.eurobond}</td>
              <td className="py-4 px-2 text-center">% {row.yabanciHisse}</td>
              <td className="py-4 px-2 text-center">% {row.altin}</td>
              <td className="py-4 pl-4 text-center">% 100</td>
            </tr>
          </tbody>
        </table>
      </div>

      <FonPieChart />
    </>
  )
}

function SerbestDagilimView({ fonlar, onOranChange }) {
  const toplam = fonlar.reduce((s, f) => s + (Number(f.oran) || 0), 0)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <th className="py-3 px-4 w-24">Fon Kodu</th>
              <th className="py-3 px-4">Fon Açıklaması</th>
              <th className="py-3 px-4 w-28 text-right">Oran</th>
            </tr>
          </thead>
          <tbody>
            {fonlar.map((f) => (
              <tr key={f.kod} className="border-b border-slate-100 text-sm text-slate-800 hover:bg-slate-50/80">
                <td className="py-2.5 px-4 font-bold font-mono text-slate-900">{f.kod}</td>
                <td className="py-2.5 px-4 text-slate-700 leading-snug">{f.ad}</td>
                <td className="py-2.5 px-4 text-right">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-16 border border-slate-300 rounded px-2 py-1 text-sm font-bold text-right focus:border-blue-600 outline-none"
                    value={f.oran ?? 0}
                    onChange={(e) => onOranChange(f.kod, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex justify-end gap-2 text-xs font-bold">
        <span className="text-slate-500 uppercase">Toplam Oran</span>
        <span className={toplam === 100 ? 'text-green-700' : toplam > 100 ? 'text-red-600' : 'text-amber-600'}>
          % {toplam}
        </span>
        {toplam !== 100 && <span className="text-slate-400 font-normal normal-case">(toplam %100 olmalı)</span>}
      </div>
    </div>
  )
}

export default function PlanFonStep({ formData, onChange }) {
  const serbest = formData.varlikDagilimi === VARLIK_SERBEST
  const fonlar = formData.fonlar || []

  const handlePlanChange = (plan) => {
    if (formData.varlikDagilimi === VARLIK_SERBEST) {
      onChange({ plan, fonlar: planFonlariOranSifir(plan) })
    } else {
      onChange({ plan, fonlar: planFonlariOnerilen(plan) })
    }
  }

  const handleVarlikChange = (varlikDagilimi) => {
    if (varlikDagilimi === VARLIK_SERBEST) {
      onChange({ varlikDagilimi, fonlar: planFonlariOranSifir(formData.plan) })
    } else {
      onChange({ varlikDagilimi, fonlar: planFonlariOnerilen(formData.plan) })
    }
  }

  const handleOranChange = (kod, raw) => {
    const oran = raw === '' ? 0 : Math.max(0, Math.min(100, parseInt(raw, 10) || 0))
    onChange({
      fonlar: fonlar.map((f) => (f.kod === kod ? { ...f, oran } : f)),
    })
  }

  const planFonList = PLAN_FONLARI[formData.plan] || []
  const fonlarUyumlu =
    fonlar.length === planFonList.length && planFonList.every((pf) => fonlar.some((f) => f.kod === pf.kod))

  useEffect(() => {
    if (!planFonList.length) return
    if (serbest && !fonlarUyumlu) {
      onChange({ fonlar: planFonlariOranSifir(formData.plan) })
    }
  }, [formData.plan, serbest, fonlarUyumlu, planFonList.length])

  const gosterilecekFonlar =
    serbest && fonlarUyumlu ? fonlar : serbest ? planFonlariOranSifir(formData.plan) : fonlar

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h3 className="text-sm font-bold text-slate-800">Plan / Fon Bilgileri</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plan</label>
          <select
            className="w-full border border-slate-200 p-3 rounded font-bold text-blue-900 shadow-sm focus:border-blue-600 outline-none bg-white"
            value={formData.plan}
            onChange={(e) => handlePlanChange(e.target.value)}
          >
            {PLAN_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Varlık Dağılımı</label>
          <select
            className="w-full border border-slate-200 p-3 rounded font-bold text-blue-900 shadow-sm focus:border-blue-600 outline-none bg-white"
            value={formData.varlikDagilimi}
            onChange={(e) => handleVarlikChange(e.target.value)}
          >
            <option value={VARLIK_ONERILEN}>{VARLIK_ONERILEN}</option>
            <option value={VARLIK_SERBEST}>{VARLIK_SERBEST}</option>
          </select>
        </div>
      </div>

      {serbest ? (
        <SerbestDagilimView fonlar={gosterilecekFonlar} onOranChange={handleOranChange} />
      ) : (
        <OnerilenFonView />
      )}
    </div>
  )
}
