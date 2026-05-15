import { FileText } from 'lucide-react'
import { ScreenHeader } from '../ui/Toolbar'

export default function TeklifAgito() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Agito Teklif"
        description="Agito kanalı teklif giriş süreci — sonraki sprintte adım adım eklenecek."
      />
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Yakında</h3>
        <p className="text-sm text-slate-500 max-w-md">
          Agito teklif ekranları Allianz sürecine paralel olarak geliştirilecek. Şimdilik Allianz Teklif menüsünü kullanabilirsiniz.
        </p>
      </div>
    </div>
  )
}
