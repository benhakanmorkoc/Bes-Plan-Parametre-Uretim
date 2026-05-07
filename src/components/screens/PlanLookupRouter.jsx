import LookupTable from './LookupTable'
import * as data from '../../data/mockData'

const REGISTRY = {
  endeksTanimlari: {
    title: 'Endeks Tanimlari',
    description: 'Sistemde tanimli endeks listesi',
    data: data.endeksTanimlari,
    columns: [
      { key: 'kod', label: 'Endeks Kodu' },
      { key: 'aciklama', label: 'Aciklama' },
      { key: 'inUse', label: 'Aktif', render: (r) => r.inUse ? 'Evet' : 'Hayir' },
    ],
  },
  asgariUcretTablosu: {
    title: 'Asgari Ucret Tablosu',
    description: 'Donemsel asgari ucret degerleri',
    data: data.asgariUcretTablosu,
    columns: [
      { key: 'gecerlilikTarihi', label: 'Gecerlilik Tarihi' },
      { key: 'asgariUcret', label: 'Asgari Ucret', className: 'text-right' },
      { key: 'katkiPayiOrani', label: 'Katki Payi Orani', className: 'text-right' },
      { key: 'girisAidatiOrani', label: 'Giris Aidati Orani', className: 'text-right' },
    ],
  },
  katkiPayiHesaplama: {
    title: 'Katki Payi Hesaplama',
    description: 'Katki payi hesaplama yontemleri',
    data: data.katkiPayiHesaplama,
    columns: [
      { key: 'hesapKodu', label: 'Kod' },
      { key: 'hesapAdi', label: 'Ad' },
      { key: 'hesapMetod', label: 'Metod' },
      { key: 'hesapKaynak', label: 'Kaynak' },
      { key: 'tablo', label: 'Tablo' },
      { key: 'hesapDeger', label: 'Deger' },
      { key: 'doviz', label: 'Doviz' },
      { key: 'dovizCinsi', label: 'Doviz Cinsi' },
    ],
  },
  sozlesmeTipi: {
    title: 'Sozlesme Tipi',
    data: data.sozlesmeTipi,
    columns: [
      { key: 'brans', label: 'Brans' },
      { key: 'kod', label: 'Kod' },
      { key: 'aciklama', label: 'Aciklama' },
    ],
  },
  borcTipleri: {
    title: 'Borc Tipleri',
    data: data.borcTipleri,
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'bsmv', label: 'BSMV' },
      { key: 'tahakkuk', label: 'Tahakkuk' },
      { key: 'tumBorcOde', label: 'Tum Borc Ode' },
      { key: 'birikimeTransfer', label: 'Birikime Transfer' },
    ],
  },
  odemeAraclari: {
    title: 'Odeme Araclari',
    data: data.odemeAraclari,
    columns: [
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'makbuzBasilacak', label: 'Makbuz Basilacak' },
      { key: 'besTahsilatListesi', label: 'BES Tahsilat Listesi' },
      { key: 'hesapZorunlu', label: 'Hesap Zorunlu' },
      { key: 'krediKartiZorunlu', label: 'Kredi Karti Zorunlu' },
      { key: 'olusturan', label: 'Olusturan' },
    ],
  },
  degisiklikTipleri: {
    title: 'Degisiklik Tipleri',
    data: data.degisiklikTipleri,
    columns: [
      { key: 'brans', label: 'Brans' },
      { key: 'zeyilKodu', label: 'Zeyil Kodu' },
      { key: 'zeyilAdi', label: 'Zeyil Adi' },
      { key: 'yilLimit', label: 'Yil Limit' },
      { key: 'primDegistirir', label: 'Prim Degistirir' },
      { key: 'uwVarMi', label: 'UW Var mi' },
    ],
  },
  gecerliSozlesmeCinsi: {
    title: 'Gecerli Sozlesme Cinsi',
    data: data.gecerliSozlesmeCinsi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  basvuruTipleri: {
    title: 'Basvuru Tipleri',
    data: data.basvuruTipleri,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  tarifePlanDurum: {
    title: 'Tarife Plan Durum',
    data: data.tarifePlanDurum,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  kurTipleri: {
    title: 'Kur Tipleri',
    data: data.kurTipleri,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  vakifUyeKurum: {
    title: 'Vakif Uye Kurum',
    data: data.vakifUyeKurum,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  odemeDonemiTurleri: {
    title: 'Odeme Donemi Turleri',
    data: data.odemeDonemiTurleri,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  girisAidatiTurleri: {
    title: 'Giris Aidati Turleri',
    data: data.girisAidatiTurleri,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  tarifeOzguBelgeTipleri: {
    title: 'Tarife Ozgu Belge Tipleri',
    data: data.tarifeOzguBelgeTipleri,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  altBranslar: {
    title: 'Alt Branslar',
    data: data.altBranslar,
    columns: [
      { key: 'brans', label: 'Brans' },
      { key: 'kod', label: 'Kod' },
      { key: 'ad', label: 'Ad' },
      { key: 'aciklama', label: 'Aciklama' },
    ],
  },
  yuvarlamaTipleri: {
    title: 'Yuvarlama Tipleri',
    data: data.yuvarlamaTipleri,
    columns: [{ key: 'ad', label: 'Ad' }, { key: 'kod', label: 'Kod' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  ygkYilTipi: {
    title: 'YGK Yil Tipi',
    data: data.ygkYilTipi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  ygkLimitTutarTipi: {
    title: 'YGK Limit Tutar Tipi',
    data: data.ygkLimitTutarTipi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  ygkKademeTipi: {
    title: 'YGK Kademe Tipi',
    data: data.ygkKademeTipi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  ygkYillikKademeDonemi: {
    title: 'YGK Yillik Kademe Donemi',
    data: data.ygkYillikKademeDonemi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  ygkYillikOdemeDonemi: {
    title: 'YGK Yillik Odeme Donemi',
    data: data.ygkYillikOdemeDonemi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  araVermeTip: {
    title: 'Ara Verme Tip',
    data: data.araVermeTip,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  egpBireyTipi: {
    title: 'EGP Birey Tipi',
    data: data.egpBireyTipi,
    columns: [{ key: 'kod', label: 'Kod' }, { key: 'ad', label: 'Ad' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  soruTipleri: {
    title: 'Soru Tipleri',
    data: data.soruTipleri,
    columns: [{ key: 'ad', label: 'Soru Tipi' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  cevapTipleri: {
    title: 'Cevap Tipleri',
    data: data.cevapTipleri,
    columns: [{ key: 'cevapTipi', label: 'Cevap Tipi' }, { key: 'aciklama', label: 'Aciklama' }],
  },
  soruBankasi: {
    title: 'Soru Bankasi',
    description: 'Anketlerde kullanilacak sorular',
    data: data.soruBankasi,
    columns: [
      { key: 'soruNo', label: 'Soru No' },
      { key: 'soruTipi', label: 'Soru Tipi' },
      { key: 'cevapTipi', label: 'Cevap Tipi' },
      { key: 'soru', label: 'Soru' },
      { key: 'siraNo', label: 'Sira' },
    ],
  },
  soruKumeleri: {
    title: 'Soru Kumeleri',
    data: data.soruKumeleri,
    columns: [{ key: 'kumeNo', label: 'Kume No' }, { key: 'aciklama', label: 'Aciklama' }],
  },
}

export default function PlanLookupRouter({ id }) {
  const cfg = REGISTRY[id]
  if (!cfg) return null
  return <LookupTable {...cfg} />
}
