import { FileText, User, PieChart, CreditCard, CheckCircle } from 'lucide-react'

export const URUN_TIPI_18_YAS_ALTI = '18 Yaş Altı'

const isYasalTemsilciRequired = (d) => d.urunTipi === URUN_TIPI_18_YAS_ALTI

const STEP_DEFS = [
  { key: 'teklif', label: 'Teklif Bilgileri', Icon: FileText },
  { key: 'katilimci', label: 'Katılımcı', Icon: User },
  {
    key: 'katki',
    label: (d) => (d.urunTipi === URUN_TIPI_18_YAS_ALTI ? 'Ödeyen' : 'Katkı Yapan'),
    Icon: User,
    when: (d) => d.ayniKisi === 'Hayır',
  },
  { key: 'yt1', label: 'Yasal Temsilci 1', Icon: User, when: isYasalTemsilciRequired },
  { key: 'yt2', label: 'Yasal Temsilci 2', Icon: User, when: isYasalTemsilciRequired },
  { key: 'lehdar', label: 'Lehdar', Icon: User },
  { key: 'plan', label: 'Plan/Fon', Icon: PieChart },
  { key: 'odeme', label: 'Ödeme', Icon: CreditCard },
  { key: 'ozet', label: 'Özet', Icon: CheckCircle },
]

export function buildVisibleSteps(formData) {
  return STEP_DEFS.filter((s) => !s.when || s.when(formData)).map((s, i) => ({
    key: s.key,
    label: typeof s.label === 'function' ? s.label(formData) : s.label,
    Icon: s.Icon,
    id: i + 1,
  }))
}

export function getStepKey(visibleSteps, stepIndex) {
  return visibleSteps[stepIndex - 1]?.key
}
