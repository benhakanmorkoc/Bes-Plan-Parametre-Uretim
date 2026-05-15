import { ArrowLeft, ArrowUp, Info } from 'lucide-react'

const PLAN_OPTIONS = [
  { value: '518', label: '518 - KİŞİYE ÖZEL PLAN' },
  { value: '519', label: '519 - SAFRAN PLAN' },
  { value: '526', label: '526 - MERCAN PLAN' },
]

const VARLIK_OPTIONS = ['ÖNERİLEN FON', 'SERBEST DAĞILIM']

const SECILEN_FON_AD =
  'Allianz Yaşam Ve Emeklilik A.Ş. Fon Sepeti Emeklilik Yatırım Fonu'

const FON_SATIR = {
  kod: 'AUA',
  tlSabit: 31,
  tlHisse: 23,
  eurobond: 17,
  yabanciHisse: 18,
  altin: 11,
}

const PIE_SEGMENTS = [
  { label: 'TL SABİT GETİRİ', pct: 31, color: '#9B1B30' },
  { label: 'TL HİSSE SENEDİ', pct: 23, color: '#1D4ED8' },
  { label: 'EUROBOND', pct: 17, color: '#B45309' },
  { label: 'YABANCI HİSSE', pct: 18, color: '#4338CA' },
  { label: 'ALTIN', pct: 11, color: '#38BDF8' },
]

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
        <div
          className="w-full h-full rounded-full"
          style={{ background: `conic-gradient(${stops})` }}
        />
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

export default function PlanFonStep({ formData, onChange }) {
  const set = (field, value) => onChange(field, value)

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h3 className="text-sm font-bold text-slate-800">Plan / Fon Bilgileri</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plan</label>
          <select
            className="w-full border border-slate-200 p-3 rounded font-bold text-blue-900 shadow-sm focus:border-blue-600 outline-none bg-white"
            value={formData.plan}
            onChange={(e) => set('plan', e.target.value)}
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
            onChange={(e) => set('varlikDagilimi', e.target.value)}
          >
            {VARLIK_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

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
        <span className="text-slate-800 font-semibold normal-case">{SECILEN_FON_AD}</span>
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
              <td className="py-4 pr-4">{FON_SATIR.kod}</td>
              <td className="py-4 px-2 text-center">% {FON_SATIR.tlSabit}</td>
              <td className="py-4 px-2 text-center">% {FON_SATIR.tlHisse}</td>
              <td className="py-4 px-2 text-center">% {FON_SATIR.eurobond}</td>
              <td className="py-4 px-2 text-center">% {FON_SATIR.yabanciHisse}</td>
              <td className="py-4 px-2 text-center">% {FON_SATIR.altin}</td>
              <td className="py-4 pl-4 text-center">% 100</td>
            </tr>
          </tbody>
        </table>
      </div>

      <FonPieChart />
    </div>
  )
}
