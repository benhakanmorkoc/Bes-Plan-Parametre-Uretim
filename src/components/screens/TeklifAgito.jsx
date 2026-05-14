import { ScreenHeader } from '../ui/Toolbar'
import { Construction } from 'lucide-react'

export default function TeklifAgito() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Agito Teklif"
        description="Agito kanalı teklif süreci — prototip bir sonraki sprintte bağlanacak."
      />
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Construction className="w-8 h-8" />
        </div>
        <p className="text-slate-600 text-sm max-w-md">
          Bu ekran üretim menüsünde yer alır. Allianz Teklif akışı ile aynı çerçevede, Agito entegrasyonu ve alan eşlemesi tanımlandığında adım adım doldurulacaktır.
        </p>
      </div>
    </div>
  )
}
