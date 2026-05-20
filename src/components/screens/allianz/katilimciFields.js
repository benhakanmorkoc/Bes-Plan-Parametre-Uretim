/** Katılımcı / Katkı Yapan ortak alan şeması */
export const emptyKatilimciBlock = () => ({
  tckn: '',
  searchDogumTarihi: '',
  babaAdi: '',
  ad: '',
  soyad: '',
  cinsiyet: 'Erkek',
  anneAdi: '',
  uyruk: 'TÜRKİYE',
  medeniHal: 'Evli',
  kimlikTuru: 'NÜFUS CÜZDANI',
  kimlikSeriNo: '',
  vergiKimlikNo: '',
  vergiDairesi: '',
  cocukSayisi: '',
  maviKartTarihi: '',
  meslek: 'ACENTE',
  meslekDetay: 'ACENTE',
  egitimDurumu: 'ÜNİVERSİTE',
  gelir: '150-750',
  kurumSicilNo: '',
  isyeriUnvani: '',
  ikametgah: '',
  ikametgahAdres: '',
  ikametUlke: 'TÜRKİYE',
  ikametIl: '',
  ikametIlce: '',
  ikametAdres1: '',
  ikametAdres2: '',
  ikametAdres3: '',
  iletisimAdresAyni: '',
  cepTel: '',
  evIsTel: '',
  faks: '',
  email: '',
  fatcaAbdIkamet: 'Hayır',
  mukimUlkeVarmi: 'Hayır',
  vergiMukkellefUlke: 'TÜRKİYE',
  dogduguUlke: 'TÜRKİYE',
  usGreenCard: 'Hayır',
})

export const YAKINLIK_DERECESI_OPTIONS = ['Annesi', 'Babası', 'Diğer']

export const emptyYasalTemsilciBlock = () => ({
  ...emptyKatilimciBlock(),
  yakinlikDerecesi: '',
})

export function ikametgahFromBlock(block) {
  if (!block) return { ulke: 'TÜRKİYE', il: '', ilce: '', adres1: '', adres2: '', adres3: '' }
  return {
    ulke: block.ikametUlke || 'TÜRKİYE',
    il: block.ikametIl || '',
    ilce: block.ikametIlce || '',
    adres1: block.ikametAdres1 || '',
    adres2: block.ikametAdres2 || '',
    adres3: block.ikametAdres3 || '',
  }
}
