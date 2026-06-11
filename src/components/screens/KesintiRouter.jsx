import KesintiList from './KesintiList'
import YgkParametreleri from './YgkParametreleri'
import YgkMuafiyet from './YgkMuafiyet'
import AraVermeKesintisi from './AraVermeKesintisi'
import KesintiBes30 from './KesintiBes30'
import YgkBes30Parametreleri from './YgkBes30Parametreleri'
import EgpGenelParametreleri from './EgpGenelParametreleri'
import EgpGeriOdemeTipleri from './EgpGeriOdemeTipleri'
import EgpAraOdemeParametresi from './EgpAraOdemeParametresi'
import * as data from '../../data/mockData'

const REGISTRY = {
  ygk: {
    title: 'YGK Parametreleri',
    description: 'Yonetim Gider Kesintisi (YGK) tanimlari',
    data: data.ygk,
    columns: [
      { key: 'kod', label: 'YGK Kodu' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'doviz', label: 'Doviz' },
      { key: 'borcTipi', label: 'Borc Tipi' },
      { key: 'yil', label: 'Yil Tipi' },
      { key: 'limit', label: 'Limit Tutar' },
      { key: 'kademe', label: 'Kademe' },
      { key: 'sifirla', label: 'Sifirla' },
    ],
  },
  ygkMuafiyet: {
    title: 'YGK Muafiyet',
    description: 'YGK muafiyet kosullari',
    data: data.ygkMuafiyet,
    columns: [
      { key: 'kod', label: 'Muafiyet Kodu' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'yil', label: 'Yil' },
      { key: 'toplamKp', label: 'Toplam KP' },
      { key: 'doviz', label: 'Doviz' },
      { key: 'oran', label: 'Oran' },
    ],
  },
  araverme: {
    title: 'Ara Verme Kesintisi',
    description: 'Ara verme durumlarinda uygulanacak kesinti',
    data: data.araverme,
    columns: [
      { key: 'kod', label: 'AVK Kodu' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'tutar', label: 'Tutar' },
      { key: 'hesaplama', label: 'Hesaplama' },
      { key: 'onKosul', label: 'On Kosul' },
    ],
  },
  bes30: {
    title: 'Kesinti BES 3.0',
    description: 'BES 3.0 kapsaminda kesinti tanimlari',
    data: data.bes30,
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'yil', label: 'Yil' },
      { key: 'oran', label: 'Oran' },
      { key: 'tutar', label: 'Tutar' },
    ],
  },
  ygkBes30: {
    title: 'YGK BES 3.0 Parametreleri',
    description: 'BES 3.0 icin YGK kosullari',
    data: data.ygkBes30,
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'doviz', label: 'Doviz' },
      { key: 'tip', label: 'Hesaplama Tipi' },
      { key: 'oran', label: 'Oran' },
      { key: 'donem', label: 'Donem' },
      { key: 'yil', label: 'Yil' },
      { key: 'birikim', label: 'Birikim' },
    ],
  },
  egpGenel: {
    title: 'Genel EGP Parametreleri',
    description: 'EGP planı için genel parametre tanımları',
    data: data.egpGenel,
    searchKeys: ['kod', 'ad', 'doviz', 'bireyTipi', 'endeksTipi'],
    requiredFields: ['kod', 'ad', 'doviz', 'bireyTipi'],
    formDefaults: { versiyon: '1', tarih: new Date().toLocaleDateString('tr-TR') },
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'doviz', label: 'Döviz' },
      { key: 'bireyTipi', label: 'Birey Tipi' },
      { key: 'minBirikim', label: 'Min. Birikim' },
      { key: 'kacYil', label: 'Yil' },
      { key: 'endeksTipi', label: 'Endeks Tipi' },
    ],
  },
  egpGeriOdeme: {
    title: 'EGP Geri Ödeme Tipleri',
    description: 'EGP geri ödeme limit, oran ve faiz tanımları',
    data: data.egpGeriOdeme,
    searchKeys: ['kod', 'ad', 'tip', 'tarih'],
    requiredFields: ['kod', 'ad', 'tip'],
    formDefaults: { versiyon: '1', tarih: new Date().toLocaleDateString('tr-TR') },
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tip', label: 'Geri Ödeme Tipi' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'sureAlt', label: 'Süre Alt' },
      { key: 'sureUst', label: 'Süre Üst' },
      { key: 'tutarAlt', label: 'Tutar Alt' },
      { key: 'tutarUst', label: 'Tutar Üst' },
      { key: 'oranUst', label: 'Oran Üst' },
      { key: 'faiz', label: 'Faiz' },
    ],
  },
  egpAraOdeme: {
    title: 'EGP Ara Ödeme',
    description: 'EGP ara ödeme adet, tutar ve oran parametreleri',
    data: data.egpAraOdeme,
    searchKeys: ['kod', 'ad', 'tarih'],
    requiredFields: ['kod', 'ad'],
    formDefaults: { versiyon: '1', tarih: new Date().toLocaleDateString('tr-TR') },
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'versiyon', label: 'V' },
      { key: 'tarih', label: 'Tarih' },
      { key: 'sayiAlt', label: 'Sayı Alt' },
      { key: 'sayiUst', label: 'Sayı Üst' },
      { key: 'tutarUst', label: 'Tutar Üst' },
      { key: 'oranBirikim', label: 'Oran (Birikim)' },
      { key: 'oranMaas', label: 'Oran (Maaş)' },
    ],
  },
}

export default function KesintiRouter({ id }) {
  if (id === 'ygk') return <YgkParametreleri />
  if (id === 'ygkMuafiyet') return <YgkMuafiyet />
  if (id === 'araverme') return <AraVermeKesintisi />
  if (id === 'bes30') return <KesintiBes30 />
  if (id === 'ygkBes30') return <YgkBes30Parametreleri />
  if (id === 'egpGenel') return <EgpGenelParametreleri />
  if (id === 'egpGeriOdeme') return <EgpGeriOdemeTipleri />
  if (id === 'egpAraOdeme') return <EgpAraOdemeParametresi />
  const cfg = REGISTRY[id]
  if (!cfg) return null
  return <KesintiList {...cfg} />
}
