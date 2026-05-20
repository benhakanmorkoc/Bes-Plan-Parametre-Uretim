/** Geçici adım kabuğu — detay ekranları sonraki sprintte doldurulacak */
export default function WizardSectionStep({ title, description }) {
  return (
    <div className="p-6 md:p-8 space-y-4">
      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-400 text-sm italic">
        Bu adımın form alanları yakında eklenecek.
      </div>
    </div>
  )
}
