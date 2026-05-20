/** Plana bağlı fon tanımları (mock — API entegrasyonu sonrası değişecek) */
export const PLAN_OPTIONS = [
  { value: '518', label: '518 - KİŞİYE ÖZEL PLAN' },
  { value: '519', label: '519 - SAFRAN PLAN' },
  { value: '526', label: '526 - MERCAN PLAN' },
]

const F = 'Allianz Yaşam Ve Emeklilik A.Ş.'

export const PLAN_FONLARI = {
  '518': [
    { kod: 'AEN', ad: `${F} Standart Emeklilik Yatırım Fonu` },
    { kod: 'AEU', ad: `${F} Standart Katılım Emeklilik Yatırım Fonu` },
    { kod: 'AEZ', ad: `${F} Standart Grup Emeklilik Yatırım Fonu` },
    { kod: 'ALI', ad: `${F} Altın Emeklilik Yatırım Fonu` },
    { kod: 'ALR', ad: `${F} Altın Katılım Emeklilik Yatırım Fonu` },
    { kod: 'AUA', ad: `${F} Fon Sepeti Emeklilik Yatırım Fonu` },
    { kod: 'AUB', ad: `${F} Borçlanma Araçları Emeklilik Yatırım Fonu` },
    { kod: 'AUC', ad: `${F} Hisse Senedi Emeklilik Yatırım Fonu` },
    { kod: 'AUD', ad: `${F} Döviz Emeklilik Yatırım Fonu` },
    { kod: 'AUE', ad: `${F} Eurobond Emeklilik Yatırım Fonu` },
    { kod: 'AUF', ad: `${F} Fon Sepeti Katılım Emeklilik Yatırım Fonu` },
    { kod: 'AUG', ad: `${F} Kamu Dış Borçlanma Araçları Emeklilik Yatırım Fonu` },
  ],
  '519': [
    { kod: 'AEN', ad: `${F} Standart Emeklilik Yatırım Fonu` },
    { kod: 'AUA', ad: `${F} Fon Sepeti Emeklilik Yatırım Fonu` },
    { kod: 'AUC', ad: `${F} Hisse Senedi Emeklilik Yatırım Fonu` },
    { kod: 'ALI', ad: `${F} Altın Emeklilik Yatırım Fonu` },
    { kod: 'AUE', ad: `${F} Eurobond Emeklilik Yatırım Fonu` },
  ],
  '526': [
    { kod: 'AUA', ad: `${F} Fon Sepeti Emeklilik Yatırım Fonu` },
    { kod: 'AUC', ad: `${F} Hisse Senedi Emeklilik Yatırım Fonu` },
    { kod: 'AUD', ad: `${F} Döviz Emeklilik Yatırım Fonu` },
    { kod: 'AUB', ad: `${F} Borçlanma Araçları Emeklilik Yatırım Fonu` },
  ],
}

export function planFonlariOranSifir(planKod) {
  return (PLAN_FONLARI[planKod] || []).map((f) => ({ ...f, oran: 0 }))
}

export function planFonlariOnerilen(planKod) {
  const list = PLAN_FONLARI[planKod] || []
  const aua = list.find((f) => f.kod === 'AUA')
  if (aua) return [{ ...aua, oran: 100 }]
  if (list[0]) return [{ ...list[0], oran: 100 }]
  return [{ kod: 'AUA', ad: `${F} Fon Sepeti Emeklilik Yatırım Fonu`, oran: 100 }]
}

export const SECILEN_FON_ONERILEN = `${F} Fon Sepeti Emeklilik Yatırım Fonu`

export const FON_SATIR_ONERILEN = {
  kod: 'AUA',
  tlSabit: 31,
  tlHisse: 23,
  eurobond: 17,
  yabanciHisse: 18,
  altin: 11,
}

export const PIE_SEGMENTS = [
  { label: 'TL SABİT GETİRİ', pct: 31, color: '#9B1B30' },
  { label: 'TL HİSSE SENEDİ', pct: 23, color: '#1D4ED8' },
  { label: 'EUROBOND', pct: 17, color: '#B45309' },
  { label: 'YABANCI HİSSE', pct: 18, color: '#4338CA' },
  { label: 'ALTIN', pct: 11, color: '#38BDF8' },
]
