// --- URUN / PLAN ---
export const urunPlanTarifeKartlari = [
  { id: 'EMK-001', ad: 'BES - Ferdi', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'Ferdi', toplam: 4, aktif: 3, kapali: 1, tarih: '12.01.2024', tip: 'plan' },
  { id: 'EGP-002', ad: 'Emeklilik Gelir Plani', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'EGP', toplam: 2, aktif: 2, kapali: 0, tarih: '01.12.2023', tip: 'plan' },
  { id: 'GBE-001', ad: 'BES - Grup', tipler: 'Grup  ·  Bireysel Emeklilik', sozlesmeTipi: 'Grup', toplam: 3, aktif: 3, kapali: 0, tarih: '08.01.2024', tip: 'plan' },
  { id: 'OKS-003', ad: 'Otomatik Katilim', tipler: 'Kurumsal  ·  Bireysel Emeklilik', sozlesmeTipi: 'OKS', toplam: 5, aktif: 4, kapali: 1, tarih: '05.01.2024', tip: 'plan' },
  { id: 'OKS-EGP-001', ad: 'Otomatik Katilim - Emeklilik Gelir Plani', tipler: 'Kurumsal  ·  Bireysel Emeklilik', sozlesmeTipi: 'OKS-EGP', toplam: 3, aktif: 2, kapali: 1, tarih: '02.02.2024', tip: 'plan' },
]

export const urunPlanlari = {
  'EMK-001': [
    { id: 'EMK-001-P1', ad: 'BES - Ferdi - Plan 1', durum: 'Yururlukte', oran: 100, tarih: '15.01.2024' },
    { id: 'EMK-001-P2', ad: 'BES - Ferdi - Plan 2', durum: 'Taslak', oran: 65, tarih: '15.01.2024' },
    { id: 'EMK-001-P3', ad: 'BES - Ferdi - Plan 3', durum: 'Taslak', oran: 65, tarih: '15.01.2024' },
    { id: 'EMK-001-P4', ad: 'BES - Ferdi - Plan 4', durum: 'Taslak', oran: 30, tarih: '15.01.2024' },
  ],
  'EGP-002': [
    { id: 'EGP-002-P1', ad: 'EGP - Plan 1', durum: 'Yururlukte', oran: 100, tarih: '01.12.2023' },
    { id: 'EGP-002-P2', ad: 'EGP - Plan 2', durum: 'Taslak', oran: 70, tarih: '01.12.2023' },
  ],
  'GBE-001': [
    { id: 'GBE-001-P1', ad: 'BES - Grup - Plan 1', durum: 'Yururlukte', oran: 100, tarih: '08.01.2024' },
    { id: 'GBE-001-P2', ad: 'BES - Grup - Plan 2', durum: 'Yururlukte', oran: 90, tarih: '08.01.2024' },
    { id: 'GBE-001-P3', ad: 'BES - Grup - Plan 3', durum: 'Taslak', oran: 55, tarih: '08.01.2024' },
  ],
  'OKS-003': [
    { id: 'OKS-003-P1', ad: 'OKS - Plan 1', durum: 'Yururlukte', oran: 100, tarih: '05.01.2024' },
    { id: 'OKS-003-P2', ad: 'OKS - Plan 2', durum: 'Yururlukte', oran: 95, tarih: '05.01.2024' },
    { id: 'OKS-003-P3', ad: 'OKS - Plan 3', durum: 'Taslak', oran: 65, tarih: '05.01.2024' },
  ],
  'OKS-EGP-001': [
    { id: 'OKS-EGP-001-P1', ad: 'OKS-EGP - Plan 1', durum: 'Yururlukte', oran: 100, tarih: '02.02.2024' },
    { id: 'OKS-EGP-001-P2', ad: 'OKS-EGP - Plan 2', durum: 'Taslak', oran: 60, tarih: '02.02.2024' },
  ],
}

// --- KATKI PAYI (BES Parametreleri.html ile ayni yapi) ---
export const katkiPayiTemplateleri = [
  { id: 1, kpTemplateKodu: 'KPT-001', adi: 'Standart KP', versiyon: '1', katkiPayiTutari: '1000', katkiPayiTutariIges: '', gecerlilik: 'Aktif', baslangicKapitali: '5000', girisFonBuyuklugu: '10000', dovizKp: 'TL', odemePeriyodu: 'Aylık', azamiKp: '5000', dovizDiger: 'TL', kpHesaplamaTuru: '', kpDonemGun: '', kpDonemAy: '', yuvarlama: 'Yok', yuvarlamaDegeri: '', olusturan: 'endeksleme', olusturulmaTarihi: '15.09.2025', guncelleyen: 'endeksleme', guncellemeTarihi: '15.09.2025' },
  { id: 2, kpTemplateKodu: 'KPT-002', adi: 'Yıllık KP', versiyon: '2', katkiPayiTutari: '12000', katkiPayiTutariIges: '', gecerlilik: 'Aktif', baslangicKapitali: '0', girisFonBuyuklugu: '0', dovizKp: 'TL', odemePeriyodu: 'Yıllık', azamiKp: '20000', dovizDiger: 'TL', kpHesaplamaTuru: '', kpDonemGun: '', kpDonemAy: '', yuvarlama: 'Yok', yuvarlamaDegeri: '', olusturan: 'endeksleme', olusturulmaTarihi: '20.09.2025', guncelleyen: 'endeksleme', guncellemeTarihi: '21.09.2025' },
]

/** Planlara bagla modali - BES Parametreleri.html initialMockPlans */
export const kptBaglantiMockPlans = [
  { id: '001', ad: 'Limitli Plan', versiyon: '1', durum: 'Taslak' },
  { id: '002', ad: 'Aile Planı', versiyon: '1', durum: 'Taslak' },
  { id: '003', ad: 'Aslan Bireysel Emeklilik Planı', versiyon: '1', durum: 'Taslak' },
  { id: '004', ad: 'Meridyen Bireysel Emeklilik Planı', versiyon: '1', durum: 'Taslak' },
  { id: '005', ad: 'Gruba Bağlı Bireysel Emeklilik Planı', versiyon: '1', durum: 'Taslak' },
]

export const katkiPayiHesaplama = [
  { id: 1, hesapKodu: '1', hesapAdi: 'TEFE1', hesapMetod: 'Endeks', hesapKaynak: 'Tablo', tablo: 'DIE TEFE Endeksleri', hesapDeger: '-', doviz: 'TRL', dovizCinsi: 'Efektif Alis' },
  { id: 2, hesapKodu: '2', hesapAdi: 'TUFE', hesapMetod: 'Endeks', hesapKaynak: 'Tablo', tablo: 'DIE TUFE Endeksleri', hesapDeger: '-', doviz: 'TRL', dovizCinsi: 'Efektif Satis' },
  { id: 3, hesapKodu: '6', hesapAdi: 'Sabit Oran Artisli', hesapMetod: 'Sabit Oran', hesapKaynak: 'Sabit', tablo: '-', hesapDeger: '0.2', doviz: '-', dovizCinsi: '-' },
  { id: 4, hesapKodu: '7', hesapAdi: 'Artissiz', hesapMetod: 'Sabit Tutar', hesapKaynak: 'Sabit', tablo: '-', hesapDeger: '0', doviz: '-', dovizCinsi: '-' },
  { id: 5, hesapKodu: '11', hesapAdi: '(YI-UFE+TUFE)/2', hesapMetod: 'Endeks', hesapKaynak: 'Tablo', tablo: '(YI-UFE+TUFE)/2', hesapDeger: '-', doviz: '-', dovizCinsi: '-' },
]

export const katkiPayiHesaplamaDetaylari = {
  '1': [
    { id: 1, parametre: 'Kaynak Endeks', deger: 'DIE TEFE Endeksleri', aciklama: 'Ana hesaplama tablosu' },
    { id: 2, parametre: 'Ortalama Donem', deger: '3 Ay', aciklama: 'Aritmetik ortalama uygulanir' },
  ],
  '2': [
    { id: 1, parametre: 'Kaynak Endeks', deger: 'DIE TUFE Endeksleri', aciklama: 'Ana hesaplama tablosu' },
    { id: 2, parametre: 'Kur Tipi', deger: 'Efektif Satis', aciklama: 'Kur cevrimi uygulanir' },
  ],
  '6': [
    { id: 1, parametre: 'Sabit Oran', deger: '0.2', aciklama: 'Yillik artis katsayisi' },
    { id: 2, parametre: 'Uygulama Donemi', deger: 'Yillik', aciklama: 'Yilda bir guncellenir' },
  ],
  '7': [
    { id: 1, parametre: 'Sabit Tutar', deger: '0', aciklama: 'Artissiz tanim' },
  ],
  '11': [
    { id: 1, parametre: 'Formul', deger: '(YI-UFE+TUFE)/2', aciklama: 'Karma endeks hesabi' },
    { id: 2, parametre: 'Yuvarlama', deger: '2 hane', aciklama: 'Bankaci yuvarlama' },
  ],
}

// --- KESINTI ---
export const girisAidati = [
  { id: 1, gaKodu: 'GA-01', versiyon: '1', tarih: '01.01.2024', doviz: 'TL', tip: 'Pesin', taksitTipi: 'Ardisik', taksitAdedi: '12', pesinat: '1000', taksit: '150', erteleme: '0', toplam: '2800' },
  { id: 2, gaKodu: 'GA-02', versiyon: '2', tarih: '15.02.2024', doviz: 'USD', tip: 'Cikisa Ertelenmis', taksitTipi: '-', taksitAdedi: '-', pesinat: '0', taksit: '0', erteleme: '50', toplam: '50' },
  { id: 3, gaKodu: 'GA-03', versiyon: '1', tarih: '01.03.2024', doviz: 'TL', tip: 'Pesin+Cikisa Ert.', taksitTipi: 'Donem', taksitAdedi: 'Aylik', pesinat: '500', taksit: '200', erteleme: '100', toplam: '2900' },
  { id: 4, gaKodu: 'GA-04', versiyon: '3', tarih: '10.04.2024', doviz: 'EUR', tip: 'Yok', taksitTipi: '-', taksitAdedi: '-', pesinat: '0', taksit: '0', erteleme: '0', toplam: '0' },
  { id: 5, gaKodu: 'GA-05', versiyon: '1', tarih: '01.05.2024', doviz: 'TL', tip: 'Pesin', taksitTipi: 'Pesin', taksitAdedi: '1', pesinat: '1500', taksit: '0', erteleme: '0', toplam: '1500' },
]

export const ygk = [
  { id: 1, kod: 'YGK-001', ad: 'YGK Standart Kural', versiyon: '1', tarih: '30.07.2024', doviz: 'TRL', tablo: 'P - Katki Payi', yil: 'Yururluk Tarihi', limit: 'Sozlesme Birikim', kademe: 'Kumul Kademe', sifirla: 'Hayir' },
  { id: 2, kod: 'YGK-002', ad: 'YGK Alternatif', versiyon: '2', tarih: '01.01.2025', doviz: 'USD', tablo: 'B - Birikim Trans.', yil: 'Tahsilat Tarihi', limit: 'Toplam Tahsilat', kademe: 'Kademe', sifirla: 'Evet' },
  { id: 3, kod: 'YGK-000', ad: 'YGK Kesinti Yok', versiyon: '1', tarih: '01.01.2026', doviz: 'TRL', tablo: 'Yok', yil: 'Yok', limit: 'Yok', kademe: 'Yok', sifirla: 'Hayir' },
]

export const ygkMuafiyet = [
  { id: 1, kod: 'YGKM-001', ad: 'YGK Muafiyet Kurali', versiyon: '1', tarih: '30.07.2024', yil: '2', toplamKp: '850', doviz: 'TRL', oran: '0.6' },
  { id: 2, kod: 'YGKM-002', ad: 'Alternatif Muafiyet', versiyon: '2', tarih: '01.01.2025', yil: '3', toplamKp: '1200', doviz: 'USD', oran: '0.5' },
  { id: 3, kod: 'YGKM-000', ad: 'Muafiyet Yok', versiyon: '1', tarih: '01.01.2026', yil: '0', toplamKp: '0', doviz: 'TRL', oran: '0' },
]

export const araverme = [
  { id: 1, kod: 'AVK-001', ad: 'Ara Verme Standart', versiyon: '1', tarih: '01.01.2026', tutar: '2 TL', hesaplama: 'Sabit', onKosul: '-' },
  { id: 2, kod: 'AVK-002', ad: 'Ara Verme Esnek', versiyon: '1', tarih: '15.06.2025', tutar: '5 TL', hesaplama: 'Oran', onKosul: 'Min 12 ay' },
  { id: 3, kod: 'AVK-000', ad: 'Ara Verme Yok', versiyon: '1', tarih: '01.01.2026', tutar: '0 TL', hesaplama: '-', onKosul: '-' },
]

export const bes30 = [
  { id: 1, kod: 'KB30-001', ad: 'Kesinti BES3.0 Kural 1', versiyon: '1', tarih: '30.07.2024', yil: '1', oran: '0.63', tutar: '-' },
  { id: 2, kod: 'KB30-002', ad: 'Kesinti BES3.0 Kural 2', versiyon: '2', tarih: '15.03.2025', yil: '2', oran: '0.50', tutar: '-' },
  { id: 3, kod: 'KB30-003', ad: 'Kesinti BES3.0 Kural 3', versiyon: '1', tarih: '01.01.2026', yil: '3', oran: '0.40', tutar: '-' },
  { id: 4, kod: 'KB30-000', ad: 'Kesinti BES3.0 Yok', versiyon: '1', tarih: '01.01.2026', yil: '0', oran: '0', tutar: '0' },
]

export const ygkBes30 = [
  { id: 1, kod: 'YB30-001', ad: 'YGK BES3.0 Kural 1', versiyon: '1', tarih: '01.01.2025', doviz: 'TRL', tip: 'Katki Payi Araligi', oran: '-', formul: '-', donem: 'Aylik', yil: '1', birikim: 'Anapara' },
  { id: 2, kod: 'YB30-002', ad: 'YGK BES3.0 Kural 2', versiyon: '2', tarih: '31.07.2024', doviz: 'TRL', tip: 'Oran', oran: '0.03', formul: '-', donem: 'Yillik', yil: '5', birikim: 'Toplam' },
  { id: 3, kod: 'YB30-003', ad: 'YGK BES3.0 Kural 3', versiyon: '1', tarih: '01.03.2026', doviz: 'USD', tip: 'Oran', oran: '0.02', formul: '-', donem: 'Aylik', yil: '1', birikim: 'Anapara' },
]

// --- EGP ---
export const egpGenel = [
  { id: 1, kod: 'EGPG-001', ad: 'EGP Genel Parametre', versiyon: '1', tarih: '01.01.2024', doviz: 'TRY', bireyTipi: 'Fert', minBirikim: '5000', kacYil: '5', endeksTipi: 'TUFE' },
  { id: 2, kod: 'EGPG-002', ad: 'EGP Genel (Alternatif)', versiyon: '2', tarih: '01.06.2024', doviz: 'TRY', bireyTipi: 'Fert', minBirikim: '7500', kacYil: '7', endeksTipi: 'UFE' },
]

export const egpGeriOdeme = [
  { id: 1, kod: 'EGPGO-001', ad: 'EGP Geri Odeme Kurali', versiyon: '1', tip: 'Süre Bazlı Ödeme', tarih: '01.01.2024', sureAlt: '1', sureUst: '5', tutarAlt: '5000', tutarUst: '100000', oranUst: '25', faiz: '5' },
  { id: 2, kod: 'EGPGO-002', ad: 'EGP Geri Odeme Esnek', versiyon: '1', tip: 'Tutar Bazlı Ödeme', tarih: '01.06.2024', sureAlt: '2', sureUst: '8', tutarAlt: '7500', tutarUst: '150000', oranUst: '30', faiz: '6' },
]

export const egpAraOdeme = [
  { id: 1, kod: 'EGPAO-001', ad: 'EGP Ara Odeme Kurali', versiyon: '1', tarih: '01.01.2024', sayiAlt: '1', sayiUst: '5', tutarUst: '50000', oranBirikim: '25', oranMaas: '10' },
]

/** Parametre — Ek Fayda Tanımları (plan Diğer Tanımlar / Ek Fayda lookup) */
export const ekFaydaTanimlari = [
  {
    id: 1,
    ekFaydaNo: '229',
    resmiEkFaydaNo: '229',
    ekFaydaTipi: 'Periyodik',
    esasEkFayda: '—',
    aciklama: 'Bonus Uygulaması 2 - FİĞK',
    maliyetTarafi: 'Emeklilik Şirketi',
    iadeTipi: 'Fiğ İadesi',
    ilgiliFirma: '—',
    tesvikliEkFayda: 'Evet',
    odeme: 'İleriye Dönük',
    revizyonNu: 1,
    grubaOzel: 'Hayır',
  },
  {
    id: 2,
    ekFaydaNo: '3570',
    resmiEkFaydaNo: '3570',
    ekFaydaTipi: 'Periyodik',
    esasEkFayda: '—',
    aciklama: 'ING Bank ve İştirakleri',
    maliyetTarafi: 'Emeklilik Şirketi',
    iadeTipi: 'Bonus',
    ilgiliFirma: '—',
    tesvikliEkFayda: 'Evet',
    odeme: 'İleriye Dönük',
    revizyonNu: 1,
    grubaOzel: 'Evet',
  },
  {
    id: 3,
    ekFaydaNo: '3571',
    resmiEkFaydaNo: '3571',
    ekFaydaTipi: 'Periyodik',
    esasEkFayda: '—',
    aciklama: 'Zurich Çalışan ve Yakınları',
    maliyetTarafi: 'Emeklilik Şirketi',
    iadeTipi: 'Bonus',
    ilgiliFirma: '—',
    tesvikliEkFayda: 'Evet',
    odeme: 'İleriye Dönük',
    revizyonNu: 2,
    grubaOzel: 'Hayır',
  },
  {
    id: 4,
    ekFaydaNo: '3011',
    resmiEkFaydaNo: '3011',
    ekFaydaTipi: 'Periyodik',
    esasEkFayda: '—',
    aciklama: '1.00 Fiğ iadeli Ek Fayda_Tekfen',
    maliyetTarafi: 'Emeklilik Şirketi',
    iadeTipi: 'Fiğ İadesi',
    ilgiliFirma: '—',
    tesvikliEkFayda: 'Evet',
    odeme: 'İleriye Dönük',
    revizyonNu: 1,
    grubaOzel: 'Evet',
  },
]

/** Parametre — Satış kanalı listesi (plan Diğer Tanımlar / Satış Kanalı lookup) */
export const satisKanaliTanimlari = [
  { id: 1, kanalKodu: '1', kanalAdi: 'Test', aciklama: 'Acenta kanal testi' },
  { id: 2, kanalKodu: '2', kanalAdi: 'İnternet', aciklama: 'Dijital satış kanalı' },
  { id: 3, kanalKodu: '3', kanalAdi: 'Çağrı Merkezi', aciklama: 'Çağrı merkezi satış kanalı' },
  { id: 4, kanalKodu: '4', kanalAdi: 'Banka', aciklama: 'Banka şube satış kanalı' },
]

// --- PLAN PARAM ---
export const endeksTanimlari = [
  { id: 1, kod: 'TUFE', aciklama: 'Tuketici Fiyat Endeksi', inUse: true },
  { id: 2, kod: 'ABAU', aciklama: 'Aylik Brut Asgari Ucret', inUse: false },
  { id: 3, kod: 'TMR_FAIZ', aciklama: 'Temerrut Faizi', inUse: false },
]

export const endeksDetaylari = {
  TUFE: [
    { id: 1, gecerlilikTarihi: '01.01.2024', deger: '1245.52', kaynak: 'TUIK', aciklama: 'Aylik kapanis degeri' },
    { id: 2, gecerlilikTarihi: '01.02.2024', deger: '1268.41', kaynak: 'TUIK', aciklama: 'Aylik kapanis degeri' },
    { id: 3, gecerlilikTarihi: '01.03.2024', deger: '1281.77', kaynak: 'TUIK', aciklama: 'Aylik kapanis degeri' },
  ],
  ABAU: [
    { id: 1, gecerlilikTarihi: '01.01.2024', deger: '20002.50', kaynak: 'Bordro Parametre', aciklama: 'Brut asgari ucret' },
    { id: 2, gecerlilikTarihi: '01.01.2025', deger: '22104.67', kaynak: 'Bordro Parametre', aciklama: 'Brut asgari ucret' },
  ],
  TMR_FAIZ: [
    { id: 1, gecerlilikTarihi: '01.01.2024', deger: '0.24', kaynak: 'Yasal Oran', aciklama: 'Temerrut faiz orani' },
    { id: 2, gecerlilikTarihi: '01.07.2024', deger: '0.30', kaynak: 'Yasal Oran', aciklama: 'Temerrut faiz orani guncelleme' },
  ],
}

export const asgariUcretTablosu = [
  { id: 1, gecerlilikTarihi: '01.07.2023', asgariUcret: '13414.50', katkiPayiOrani: '0.30', girisAidatiOrani: '0.08' },
  { id: 2, gecerlilikTarihi: '01.01.2024', asgariUcret: '20002.50', katkiPayiOrani: '0.30', girisAidatiOrani: '0.08' },
  { id: 3, gecerlilikTarihi: '01.01.2025', asgariUcret: '22104.67', katkiPayiOrani: '0.30', girisAidatiOrani: '0.08' },
]

export const asgariUcretDetaylari = {
  '01.07.2023': [
    { id: 1, kanal: 'Ferdi', minKatkiPayi: '4024.35', maxGirisAidati: '1073.16', not: 'Ilk donem gecis kurali' },
    { id: 2, kanal: 'Grup', minKatkiPayi: '3500.00', maxGirisAidati: '980.00', not: 'Kampanya katsayisi uygulandi' },
  ],
  '01.01.2024': [
    { id: 1, kanal: 'Ferdi', minKatkiPayi: '6000.75', maxGirisAidati: '1600.20', not: 'Yillik revizyon' },
    { id: 2, kanal: 'OKS', minKatkiPayi: '4500.56', maxGirisAidati: '1200.15', not: 'OKS alt limit guncellemesi' },
  ],
  '01.01.2025': [
    { id: 1, kanal: 'Ferdi', minKatkiPayi: '6631.40', maxGirisAidati: '1768.37', not: 'Asgari ucret artis yansimasi' },
    { id: 2, kanal: 'Grup', minKatkiPayi: '5900.00', maxGirisAidati: '1570.00', not: 'Grup plan revizyonu' },
    { id: 3, kanal: 'OKS', minKatkiPayi: '5100.00', maxGirisAidati: '1360.00', not: 'OKS sabit oran' },
  ],
}

export const sozlesmeTipi = [
  { id: 1, brans: 'Bireysel Emeklilik', kod: 'F', aciklama: 'Ferdi' },
  { id: 2, brans: 'Bireysel Emeklilik', kod: 'G', aciklama: 'Grup' },
  { id: 3, brans: 'Bireysel Emeklilik', kod: 'OKS', aciklama: 'Otomatik Katilim' },
]

export const sozlesmeTipiDetaylari = {
  F: [
    { id: 1, parametre: 'Minimum Yas', deger: '18', not: 'Ferdi katilim alt limit' },
    { id: 2, parametre: 'Maksimum Yas', deger: '56', not: 'Ferdi katilim ust limit' },
  ],
  G: [
    { id: 1, parametre: 'Grup Min Kisi', deger: '10', not: 'Grup sozlesme acilis siniri' },
    { id: 2, parametre: 'Tahsilat Modeli', deger: 'Isveren odemeli', not: 'Kurumsal tahsilat modeli' },
  ],
  OKS: [
    { id: 1, parametre: 'Otomatik Dahil', deger: 'Evet', not: 'Calisan otomatik dahil olur' },
    { id: 2, parametre: 'Cayma Suresi', deger: '2 Ay', not: 'Yasal cayma suresi' },
  ],
}

export const borcTipleri = [
  { id: 1, kod: 'K', ad: 'Karma', bsmv: 'Hayir', tahakkuk: 'Hayir', tumBorcOde: 'Hayir', birikimeTransfer: 'Hayir' },
  { id: 2, kod: 'Z', ad: 'IKRAZ (Geri Odeme Zorunlu Degil)', bsmv: 'Hayir', tahakkuk: 'Hayir', tumBorcOde: 'Hayir', birikimeTransfer: 'Evet' },
  { id: 3, kod: 'T', ad: 'Tahsilat Masrafi', bsmv: 'Hayir', tahakkuk: 'Evet', tumBorcOde: 'Hayir', birikimeTransfer: 'Hayir' },
  { id: 4, kod: 'P', ad: 'Prim/Katki Payi Tahsilati', bsmv: 'Hayir', tahakkuk: 'Hayir', tumBorcOde: 'Hayir', birikimeTransfer: 'Evet' },
]

export const borcTipleriDetaylari = {
  K: [
    { id: 1, parametre: 'Tahsilat Onceligi', deger: 'Orta', not: 'Karma borc dagitimi' },
    { id: 2, parametre: 'Birikime Etki', deger: 'Pasif', not: 'Birikime otomatik aktarilmaz' },
  ],
  Z: [
    { id: 1, parametre: 'Geri Odeme', deger: 'Zorunlu Degil', not: 'Musteri tercihine bagli' },
    { id: 2, parametre: 'Birikime Transfer', deger: 'Evet', not: 'Tahsilat direkt birikime gider' },
  ],
  T: [
    { id: 1, parametre: 'Tahakkuk', deger: 'Evet', not: 'Donemsel tahakkuk calisir' },
    { id: 2, parametre: 'Masraf Kalemi', deger: 'Tahsilat', not: 'Tahsilat masrafina bagli' },
  ],
  P: [
    { id: 1, parametre: 'Ana Kaynak', deger: 'Prim/Katki', not: 'Katki tahsilatindan mahsup' },
    { id: 2, parametre: 'Birikime Transfer', deger: 'Evet', not: 'Fazla tahsilat birikime aktarilir' },
  ],
}

export const odemeAraclari = [
  { id: 1, kod: 'A', ad: 'Aktarim', makbuzBasilacak: 'Hayir', besTahsilatListesi: 'Hayir', hesapZorunlu: 'Hayir', krediKartiZorunlu: 'Hayir', olusturan: 'uaktas' },
  { id: 2, kod: 'AK', ad: 'Acente Komisyonu', makbuzBasilacak: 'Hayir', besTahsilatListesi: 'Hayir', hesapZorunlu: 'Hayir', krediKartiZorunlu: 'Hayir', olusturan: 'uaktas' },
  { id: 3, kod: 'BC', ad: 'Banka Ceki', makbuzBasilacak: 'Hayir', besTahsilatListesi: 'Hayir', hesapZorunlu: 'Hayir', krediKartiZorunlu: 'Hayir', olusturan: 'uaktas' },
  { id: 4, kod: 'BGE', ad: 'BES Gecici Hesap', makbuzBasilacak: 'Hayir', besTahsilatListesi: 'Hayir', hesapZorunlu: 'Hayir', krediKartiZorunlu: 'Hayir', olusturan: 'uaktas' },
  { id: 5, kod: 'KK', ad: 'Kredi Karti', makbuzBasilacak: 'Evet', besTahsilatListesi: 'Evet', hesapZorunlu: 'Hayir', krediKartiZorunlu: 'Evet', olusturan: 'uaktas' },
]

export const odemeAraclariDetaylari = {
  A: [
    { id: 1, parametre: 'Entegrasyon Tipi', deger: 'Aktarim Servisi', not: 'Harici transfer ile tahsilat' },
    { id: 2, parametre: 'Mutabakat Periyodu', deger: 'Gunluk', not: 'Gun sonu mutabakat' },
  ],
  AK: [
    { id: 1, parametre: 'Komisyon Kanali', deger: 'Acente', not: 'Acente bazli komisyon' },
    { id: 2, parametre: 'Onay', deger: 'Yetkili', not: 'Yetkili onayi gerektirir' },
  ],
  BC: [
    { id: 1, parametre: 'Teminat Suresi', deger: '2 Is Gunu', not: 'Cek teyit suresi' },
    { id: 2, parametre: 'Banka Kontrol', deger: 'Zorunlu', not: 'Banka dogrulamasi gerekir' },
  ],
  BGE: [
    { id: 1, parametre: 'Hesap Tipi', deger: 'Gecici', not: 'BES gecici hesapta bekletilir' },
  ],
  KK: [
    { id: 1, parametre: '3D Secure', deger: 'Evet', not: 'Kart islemlerinde zorunlu' },
    { id: 2, parametre: 'Provizyon', deger: 'Anlik', not: 'Online provizyon alinir' },
  ],
}

export const degisiklikTipleri = [
  { id: 201, brans: 'BES', zeyilKodu: '93', zeyilAdi: 'Emeklilik', yilLimit: '2', primDegistirir: 'Hayir', uwVarMi: 'Hayir' },
  { id: 202, brans: 'BES', zeyilKodu: '95', zeyilAdi: 'Sistemden Cikis', yilLimit: '2', primDegistirir: 'Hayir', uwVarMi: 'Hayir' },
  { id: 204, brans: 'BES', zeyilKodu: '90', zeyilAdi: 'Sozlesmeden Cayma', yilLimit: '3', primDegistirir: 'Evet', uwVarMi: 'Hayir' },
  { id: 206, brans: 'BES', zeyilKodu: '99', zeyilAdi: 'Plan Degisikligi', yilLimit: '4', primDegistirir: 'Hayir', uwVarMi: 'Hayir' },
  { id: 207, brans: 'BES', zeyilKodu: '91', zeyilAdi: 'Fon Dagilimi Degisikligi', yilLimit: '12', primDegistirir: 'Hayir', uwVarMi: 'Hayir' },
  { id: 208, brans: 'BES', zeyilKodu: 'KTK', zeyilAdi: 'Kanuni Temsilci Kaldirma Degisikligi', yilLimit: '3', primDegistirir: 'Hayir', uwVarMi: 'Hayir' },
]

export const degisiklikTipleriDetaylari = {
  '93': [
    { id: 1, parametre: 'Onay Seviyesi', deger: 'Standart', not: 'Temel emeklilik zeyli' },
    { id: 2, parametre: 'Tahsilat Etkisi', deger: 'Yok', not: 'Prim etkisi bulunmaz' },
  ],
  '95': [
    { id: 1, parametre: 'Cikis Turu', deger: 'Sistemden Cikis', not: 'Tam cikis islemi' },
    { id: 2, parametre: 'Mutabakat', deger: 'Zorunlu', not: 'Cikis oncesi mutabakat' },
  ],
  '90': [
    { id: 1, parametre: 'Cayma Suresi', deger: '60 Gun', not: 'Yasal cayma suresi' },
    { id: 2, parametre: 'Prim Degisim', deger: 'Evet', not: 'Prim iadesi hesaplanir' },
  ],
  '99': [
    { id: 1, parametre: 'Plan Karsilastirma', deger: 'Zorunlu', not: 'Plan uyumluluk kontrolu' },
  ],
  '91': [
    { id: 1, parametre: 'Fon Dagilim Siniri', deger: '%100', not: 'Toplam dagilim kontrolu' },
    { id: 2, parametre: 'UW Kontrol', deger: 'Hayir', not: 'UW onayi gerektirmez' },
  ],
  KTK: [
    { id: 1, parametre: 'Kanuni Temsilci', deger: 'Kaldirma', not: 'Kanuni temsilci degisikligi' },
  ],
}

export const gecerliSozlesmeCinsi = [
  { id: 1, kod: 'IGES', aciklama: 'Isveren Grup Emeklilik Sozlesmesi' },
  { id: 2, kod: 'GBB', aciklama: 'Gruba Bagli Bireysel' },
]

export const gecerliSozlesmeCinsiDetaylari = {
  IGES: [
    { id: 1, parametre: 'Katilim Turu', deger: 'Isveren Katkili', not: 'Kurumsal katki modeli' },
    { id: 2, parametre: 'Tahsilat Kanali', deger: 'Bordro', not: 'Maas uzerinden tahsilat' },
  ],
  GBB: [
    { id: 1, parametre: 'Katilim Turu', deger: 'Gruba Bagli Bireysel', not: 'Bireysel sozlesme uzerinden' },
    { id: 2, parametre: 'Transfer Yetkisi', deger: 'Evet', not: 'Planlar arasi transfer acik' },
  ],
}

export const basvuruTipleri = [
  { id: 1, kod: 'O', aciklama: 'Online' },
  { id: 2, kod: 'M', aciklama: 'Matbu' },
]

export const basvuruTipleriDetaylari = {
  O: [
    { id: 1, parametre: 'Kanal', deger: 'Dijital', not: 'Web ve mobil basvuru kanali' },
    { id: 2, parametre: 'Onay Akisi', deger: 'Anlik', not: 'Anlik onay ve ilerleme' },
  ],
  M: [
    { id: 1, parametre: 'Kanal', deger: 'Fiziksel Evrak', not: 'Sube/acenteden matbu basvuru' },
    { id: 2, parametre: 'Onay Akisi', deger: 'Operasyon', not: 'Evrak kontrolu sonrasi onay' },
  ],
}

export const tarifePlanDurum = [
  { id: 1, kod: 'D', aciklama: 'Taslak' },
  { id: 2, kod: 'A', aciklama: 'Yururlukte' },
  { id: 3, kod: 'K', aciklama: 'Satisa Kapali' },
  { id: 4, kod: 'Y', aciklama: 'Yururlukten Kaldirildi' },
]

export const tarifePlanDurumDetaylari = {
  D: [
    { id: 1, parametre: 'Yayin Durumu', deger: 'Kapali', not: 'Taslak plan yayinlanmaz' },
    { id: 2, parametre: 'Degisiklik Yetkisi', deger: 'Tam', not: 'Tum alanlar duzenlenebilir' },
  ],
  A: [
    { id: 1, parametre: 'Yayin Durumu', deger: 'Acil', not: 'Satista aktif gorunur' },
    { id: 2, parametre: 'Degisiklik Yetkisi', deger: 'Sinirli', not: 'Kritik alanlar kilitli' },
  ],
  K: [
    { id: 1, parametre: 'Yayin Durumu', deger: 'Pasif', not: 'Yeni satisa kapali' },
    { id: 2, parametre: 'Mevcut Sozlesme', deger: 'Devam', not: 'Mevcutler etkilenmez' },
  ],
  Y: [
    { id: 1, parametre: 'Yayin Durumu', deger: 'Kaldirildi', not: 'Yururlukten cikarildi' },
    { id: 2, parametre: 'Arsiv', deger: 'Zorunlu', not: 'Arsivleme kaydi olusturulur' },
  ],
}

export const kurTipleri = [
  { id: 1, kod: 'EA', aciklama: 'Efektif Alis' },
  { id: 2, kod: 'ES', aciklama: 'Efektif Satis' },
  { id: 3, kod: 'DA', aciklama: 'Doviz Alis' },
  { id: 4, kod: 'DS', aciklama: 'Doviz Satis' },
]

export const kurTipleriDetaylari = {
  EA: [
    { id: 1, parametre: 'Kaynak', deger: 'TCMB', not: 'Efektif alis kuru kaynagi' },
    { id: 2, parametre: 'Guncelleme', deger: 'Gunluk', not: 'Her is gunu guncellenir' },
  ],
  ES: [
    { id: 1, parametre: 'Kaynak', deger: 'TCMB', not: 'Efektif satis kuru kaynagi' },
    { id: 2, parametre: 'Marj', deger: '0.001', not: 'Satis marj katsayisi' },
  ],
  DA: [
    { id: 1, parametre: 'Kaynak', deger: 'TCMB Doviz', not: 'Doviz alis kur bilgisi' },
  ],
  DS: [
    { id: 1, parametre: 'Kaynak', deger: 'TCMB Doviz', not: 'Doviz satis kur bilgisi' },
    { id: 2, parametre: 'Kontrol', deger: 'Min/Max', not: 'Sinir kontrolu uygulanir' },
  ],
}

export const vakifUyeKurum = [
  { id: 1, kod: 'V001', aciklama: 'TC. Basbakanlik Basin Yay. Enformasyon Yard. Vakfi' },
  { id: 2, kod: 'V002', aciklama: 'Nufus Hizmetleri Vakfi' },
  { id: 3, kod: 'V003', aciklama: 'TC. Noterleri Personeli Yardimlasma Vakfi' },
  { id: 4, kod: 'V004', aciklama: 'TC. Merkez Bankasi Mensuplari Sandigi Vakfi' },
]

export const vakifUyeKurumDetaylari = {
  V001: [
    { id: 1, parametre: 'Uyelik Tipi', deger: 'Kamu', not: 'Kamu kurum uyeligi' },
    { id: 2, parametre: 'Katilim Modeli', deger: 'Toplu', not: 'Toplu uyelik modeli' },
  ],
  V002: [
    { id: 1, parametre: 'Uyelik Tipi', deger: 'Vakıf', not: 'Vakıf uyelik yapisi' },
  ],
  V003: [
    { id: 1, parametre: 'Uyelik Tipi', deger: 'Meslek Grubu', not: 'Noter personeli odakli' },
    { id: 2, parametre: 'Tahsilat', deger: 'Aylik', not: 'Periyodik tahsilat uygulanir' },
  ],
  V004: [
    { id: 1, parametre: 'Uyelik Tipi', deger: 'Sandik', not: 'Mensup sandigi modeli' },
    { id: 2, parametre: 'Aktivasyon', deger: 'Onayli', not: 'Kurum onayi ile aktif olur' },
  ],
}

export const odemeDonemiTurleri = [
  { id: 1, kod: '1', aciklama: 'Aylik' },
  { id: 2, kod: '3', aciklama: 'Uc Aylik' },
  { id: 3, kod: '6', aciklama: 'Alti Aylik' },
  { id: 4, kod: '12', aciklama: 'Yillik' },
]

export const odemeDonemiTurleriDetaylari = {
  '1': [
    { id: 1, parametre: 'Donem Tipi', deger: 'Aylik', not: 'Her ay tahsilat' },
    { id: 2, parametre: 'Odeme Gunu', deger: '1-30', not: 'Ay icinde secilebilir' },
  ],
  '3': [
    { id: 1, parametre: 'Donem Tipi', deger: 'Uc Aylik', not: 'Ceyreklik tahsilat' },
  ],
  '6': [
    { id: 1, parametre: 'Donem Tipi', deger: 'Alti Aylik', not: 'Yilda iki tahsilat' },
  ],
  '12': [
    { id: 1, parametre: 'Donem Tipi', deger: 'Yillik', not: 'Yilda bir tahsilat' },
    { id: 2, parametre: 'Hatirlatma', deger: '30 Gun Once', not: 'Yenileme bildirimi' },
  ],
}

export const girisAidatiTurleri = [
  { id: 1, kod: 'YOK', aciklama: 'Giris Aidati Yok' },
  { id: 2, kod: 'PESIN', aciklama: 'Pesin' },
  { id: 3, kod: 'ERT', aciklama: 'Cikisa Ertelenmis' },
  { id: 4, kod: 'PESIN_ERT', aciklama: 'Pesin+Cikisa Ertelenmis' },
]

export const girisAidatiTurleriDetaylari = {
  YOK: [
    { id: 1, parametre: 'Tahsilat', deger: 'Yok', not: 'Giris aidati alinmaz' },
  ],
  PESIN: [
    { id: 1, parametre: 'Tahsilat', deger: 'Pesin', not: 'Baslangicta tahsil edilir' },
    { id: 2, parametre: 'Taksit', deger: 'Opsiyonel', not: 'Taksitlendirilebilir' },
  ],
  ERT: [
    { id: 1, parametre: 'Tahsilat', deger: 'Cikista', not: 'Cikis aninda tahsil edilir' },
  ],
  PESIN_ERT: [
    { id: 1, parametre: 'Tahsilat', deger: 'Karma', not: 'Pesin + cikista tahsilat' },
    { id: 2, parametre: 'Dagilim', deger: '%50/%50', not: 'Ornek dagilim' },
  ],
}

export const tarifeOzguBelgeTipleri = [
  { id: 1, kod: 'H', aciklama: 'Hazine Plani' },
  { id: 2, kod: 'S', aciklama: 'Sozlesme/Police Ornegi' },
  { id: 3, kod: 'P', aciklama: 'Pazarlama Icerigi' },
  { id: 4, kod: 'E', aciklama: 'Ek Fayda Detaylari' },
  { id: 5, kod: 'T', aciklama: 'Test Onay Dokumani' },
]

export const tarifeOzguBelgeTipleriDetaylari = {
  H: [
    { id: 1, parametre: 'Belge Grubu', deger: 'Hazine', not: 'Resmi plan dokumani' },
    { id: 2, parametre: 'Yayin', deger: 'Zorunlu', not: 'Plan acilisinda zorunlu' },
  ],
  S: [
    { id: 1, parametre: 'Belge Grubu', deger: 'Sozlesme', not: 'Sozlesme ve police ornegi' },
  ],
  P: [
    { id: 1, parametre: 'Belge Grubu', deger: 'Pazarlama', not: 'Tanitim amacli belge' },
    { id: 2, parametre: 'Onay', deger: 'Pazarlama Onayi', not: 'Yayin oncesi onay gerekir' },
  ],
  E: [
    { id: 1, parametre: 'Belge Grubu', deger: 'Ek Fayda', not: 'Ek fayda kosullari' },
  ],
  T: [
    { id: 1, parametre: 'Belge Grubu', deger: 'Test', not: 'Test ortaminda kullanilir' },
    { id: 2, parametre: 'Aktivasyon', deger: 'Manuel', not: 'Manuel aktivasyon gerekir' },
  ],
}

export const altBranslar = [
  { id: 1, brans: 'Hayat', kod: 'H', ad: 'H', aciklama: 'Hayat' },
  { id: 2, brans: 'Hayat', kod: 'K', ad: 'K', aciklama: 'Ferdi Kaza' },
  { id: 3, brans: 'Saglik', kod: 'S', ad: 'S', aciklama: 'Saglik' },
  { id: 4, brans: 'Saglik', kod: 'T', ad: 'T', aciklama: 'Tamamlayici' },
  { id: 5, brans: 'Saglik', kod: 'SY', ad: 'SY', aciklama: 'Seyahat' },
  { id: 6, brans: 'Elementer', kod: 'M', ad: 'M', aciklama: 'Muhendislik' },
  { id: 7, brans: 'Elementer', kod: 'K', ad: 'K', aciklama: 'Kara Araclari' },
]

export const altBranslarDetaylari = {
  H: [
    { id: 1, parametre: 'Urun Grubu', deger: 'Hayat', not: 'Hayat urunlerinde kullanilir' },
    { id: 2, parametre: 'Risk Skoru', deger: 'Orta', not: 'Standart risk sinifi' },
  ],
  K: [
    { id: 1, parametre: 'Urun Grubu', deger: 'Ferdi Kaza', not: 'Kaza teminati odakli' },
  ],
  S: [
    { id: 1, parametre: 'Urun Grubu', deger: 'Saglik', not: 'Saglik poliçe alt branşi' },
  ],
  T: [
    { id: 1, parametre: 'Urun Grubu', deger: 'Tamamlayici Saglik', not: 'TSS urunlerinde kullanilir' },
  ],
  SY: [
    { id: 1, parametre: 'Urun Grubu', deger: 'Seyahat', not: 'Yurtici/yurtdisi seyahat planlari' },
  ],
  M: [
    { id: 1, parametre: 'Urun Grubu', deger: 'Muhendislik', not: 'Muhendislik sigorta urunleri' },
  ],
}

export const yuvarlamaTipleri = [
  { id: 1, ad: 'YY', kod: 'YY', aciklama: 'Yuvarlama Yok' },
  { id: 2, ad: 'TB', kod: 'TB', aciklama: 'Tabana' },
  { id: 3, ad: 'TV', kod: 'TV', aciklama: 'Tavana' },
]

export const yuvarlamaTipleriDetaylari = {
  YY: [
    { id: 1, parametre: 'Yontem', deger: 'Yuvarlama Yok', not: 'Ham deger korunur' },
  ],
  TB: [
    { id: 1, parametre: 'Yontem', deger: 'Tabana', not: 'Asagi yuvarlama uygulanir' },
    { id: 2, parametre: 'Hassasiyet', deger: '2 Hane', not: 'Kurallara gore hane kullanilir' },
  ],
  TV: [
    { id: 1, parametre: 'Yontem', deger: 'Tavana', not: 'Yukari yuvarlama uygulanir' },
    { id: 2, parametre: 'Hassasiyet', deger: '2 Hane', not: 'Kurallara gore hane kullanilir' },
  ],
}

export const ygkYilTipi = [
  { id: 1, kod: 'YT', ad: 'Yururluk Tarihi', aciklama: 'Yururluk Tarihi' },
  { id: 2, kod: 'TT', ad: 'Tahsilat Tarihi', aciklama: 'Tahsilat Tarihi' },
  { id: 3, kod: 'VT', ad: 'Vade Tarihi', aciklama: 'Vade Tarihi' },
]

export const ygkYilTipiDetaylari = {
  YT: [
    { id: 1, parametre: 'Hesaplama Baslangici', deger: 'Yururluk', not: 'Yururluk tarihine gore yil sayilir' },
    { id: 2, parametre: 'Kontrol', deger: 'Plan Durumu', not: 'Planin yururlukte olmasi gerekir' },
  ],
  TT: [
    { id: 1, parametre: 'Hesaplama Baslangici', deger: 'Tahsilat', not: 'Tahsilat tarihine gore yil sayilir' },
  ],
  VT: [
    { id: 1, parametre: 'Hesaplama Baslangici', deger: 'Vade', not: 'Vade tarihine gore yil sayilir' },
    { id: 2, parametre: 'Hatirlatma', deger: '30 Gun Once', not: 'Vade oncesi kontrol tetiklenir' },
  ],
}

export const ygkLimitTutarTipi = [
  { id: 1, kod: 'SBT', ad: 'Sozlesme Birikim Tutari', aciklama: 'Sozlesme Birikim Tutari' },
  { id: 2, kod: 'KBT', ad: 'Katilimci Birikim Tutari', aciklama: 'Katilimci Birikim Tutari' },
  { id: 3, kod: 'KPT', ad: 'Katki Payi Tutari', aciklama: 'Katki Payi Tutari' },
  { id: 4, kod: 'THT', ad: 'Tahsilat Tutari', aciklama: 'Tahsilat Tutari' },
  { id: 5, kod: 'TOP', ad: 'Toplam Tahsilat', aciklama: 'Toplam Tahsilat' },
]

export const ygkLimitTutarTipiDetaylari = {
  SBT: [
    { id: 1, parametre: 'Kaynak', deger: 'Sozlesme Birikim', not: 'Sozlesme bazli birikim tutari' },
    { id: 2, parametre: 'Guncelleme', deger: 'Gun Sonu', not: 'Gun sonu birikim degeri kullanilir' },
  ],
  KBT: [
    { id: 1, parametre: 'Kaynak', deger: 'Katilimci Birikim', not: 'Katilimci bazli birikim tutari' },
  ],
  KPT: [
    { id: 1, parametre: 'Kaynak', deger: 'Katki Payi', not: 'Tahsil edilen katki payi tutari' },
  ],
  THT: [
    { id: 1, parametre: 'Kaynak', deger: 'Tahsilat', not: 'Donemsel tahsilat tutari' },
    { id: 2, parametre: 'Kontrol', deger: 'Limit Asimi', not: 'Limit asim kontrolu yapilir' },
  ],
  TOP: [
    { id: 1, parametre: 'Kaynak', deger: 'Toplam Tahsilat', not: 'Kumulatif tahsilat degeri' },
    { id: 2, parametre: 'Donem', deger: 'Yillik', not: 'Yillik toplam kullanilir' },
  ],
}

export const ygkKademeTipi = [
  { id: 1, kod: 'KK', ad: 'Kumul Kademe', aciklama: 'Kumul Kademe' },
  { id: 2, kod: 'KD', ad: 'Kademe', aciklama: 'Kademe' },
]

export const ygkKademeTipiDetaylari = {
  KK: [
    { id: 1, parametre: 'Kademe Modeli', deger: 'Kumulatif', not: 'Limitler birikimli hesaplanir' },
    { id: 2, parametre: 'Sifirlama', deger: 'Yillik', not: 'Yil sonunda sifirlanir' },
  ],
  KD: [
    { id: 1, parametre: 'Kademe Modeli', deger: 'Bagimsiz', not: 'Her kademe ayrik hesaplanir' },
    { id: 2, parametre: 'Sifirlama', deger: 'Yok', not: 'Donem boyunca korunur' },
  ],
}

export const ygkYillikKademeDonemi = [
  { id: 1, kod: 'A', ad: 'Aylik', aciklama: 'Aylik' },
  { id: 2, kod: 'Y', ad: 'Yillik', aciklama: 'Yillik' },
  { id: 3, kod: 'T', ad: 'Tek Sefer', aciklama: 'Tek Sefer' },
]

export const ygkYillikKademeDonemiDetaylari = {
  A: [
    { id: 1, parametre: 'Donem', deger: 'Aylik', not: 'Her ay kademe kontrolu yapilir' },
    { id: 2, parametre: 'Yenileme', deger: 'Aylik', not: 'Aylik periyot yenileme' },
  ],
  Y: [
    { id: 1, parametre: 'Donem', deger: 'Yillik', not: 'Yilda bir kademe kontrolu' },
    { id: 2, parametre: 'Yenileme', deger: 'Yillik', not: 'Yillik periyot yenileme' },
  ],
  T: [
    { id: 1, parametre: 'Donem', deger: 'Tek Sefer', not: 'Bir kez uygulanir' },
  ],
}

export const ygkYillikOdemeDonemi = [
  { id: 1, kod: 'A', ad: 'Aylik', aciklama: 'Aylik' },
  { id: 2, kod: '3A', ad: 'Uc Aylik', aciklama: 'Uc Aylik' },
  { id: 3, kod: '6A', ad: 'Alti Aylik', aciklama: 'Alti Aylik' },
  { id: 4, kod: 'Y', ad: 'Yillik', aciklama: 'Yillik' },
]

export const ygkYillikOdemeDonemiDetaylari = {
  A: [
    { id: 1, parametre: 'Odeme Periyodu', deger: 'Aylik', not: 'Her ay odeme alinır' },
    { id: 2, parametre: 'Hatirlatma', deger: '5 Gun Once', not: 'Odemeden once bildirim' },
  ],
  '3A': [
    { id: 1, parametre: 'Odeme Periyodu', deger: 'Uc Aylik', not: '3 ayda bir odeme' },
  ],
  '6A': [
    { id: 1, parametre: 'Odeme Periyodu', deger: 'Alti Aylik', not: 'Yilda iki odeme' },
  ],
  Y: [
    { id: 1, parametre: 'Odeme Periyodu', deger: 'Yillik', not: 'Yilda bir odeme' },
    { id: 2, parametre: 'Yenileme', deger: 'Yillik', not: 'Yil sonu yenileme kontrolu' },
  ],
}

export const araVermeTip = [
  { id: 1, kod: 'A', ad: 'Aylik', aciklama: 'Aylik' },
  { id: 2, kod: 'Y', ad: 'Yillik', aciklama: 'Yillik' },
]

export const araVermeTipDetaylari = {
  A: [
    { id: 1, parametre: 'Donem', deger: 'Aylik', not: 'Ara verme kontrolu aylik yapilir' },
    { id: 2, parametre: 'Bekleme', deger: '30 Gun', not: 'Aylik bekleme suresi' },
  ],
  Y: [
    { id: 1, parametre: 'Donem', deger: 'Yillik', not: 'Ara verme kontrolu yillik yapilir' },
    { id: 2, parametre: 'Bekleme', deger: '365 Gun', not: 'Yillik bekleme suresi' },
  ],
}

export const egpBireyTipi = [
  { id: 1, kod: 'FP', ad: 'Fert-Personel', aciklama: 'Fert-Personel' },
  { id: 2, kod: 'C', ad: 'Cocuk', aciklama: 'Cocuk' },
  { id: 3, kod: 'E', ad: 'Es', aciklama: 'Es' },
  { id: 4, kod: 'AB', ad: 'Anne-Baba', aciklama: 'Anne-Baba' },
  { id: 5, kod: 'K', ad: 'Kardes', aciklama: 'Kardes' },
  { id: 6, kod: 'D', ad: 'Diger', aciklama: 'Diger' },
]

export const egpBireyTipiDetaylari = {
  FP: [
    { id: 1, parametre: 'Birey Grubu', deger: 'Calisan', not: 'Personel odakli birey tipi' },
    { id: 2, parametre: 'Uygunluk', deger: 'Standart', not: 'Varsayilan uygunluk kurali' },
  ],
  C: [
    { id: 1, parametre: 'Birey Grubu', deger: 'Cocuk', not: 'Cocuk planlari icin kullanilir' },
  ],
  E: [
    { id: 1, parametre: 'Birey Grubu', deger: 'Es', not: 'Es kapsami icin kullanilir' },
  ],
  AB: [
    { id: 1, parametre: 'Birey Grubu', deger: 'Anne-Baba', not: 'Ust soy kapsami' },
  ],
  K: [
    { id: 1, parametre: 'Birey Grubu', deger: 'Kardes', not: 'Kardes kapsami' },
  ],
  D: [
    { id: 1, parametre: 'Birey Grubu', deger: 'Diger', not: 'Genel kapsam' },
  ],
}

export const egpGeriOdemeTipleri = [
  { id: 1, tanimAdi: 'Sureye Bagli' },
  { id: 2, tanimAdi: 'Tutara Bagli' },
  { id: 3, tanimAdi: 'Mevduat' },
  { id: 4, tanimAdi: 'Kira' },
  { id: 5, tanimAdi: 'Faiz' },
]

// --- ANKET / SORU ---
export const soruTipleri = [
  { id: 1, ad: '1', aciklama: 'Saglik' },
  { id: 2, ad: '2', aciklama: 'Finansal' },
  { id: 3, ad: '3', aciklama: 'Risk Getiri Profili' },
]

export const soruTipleriDetaylari = {
  '1': [
    { id: 1, parametre: 'Kategori', deger: 'Saglik', not: 'Saglik odakli soru seti' },
    { id: 2, parametre: 'Zorunluluk', deger: 'Evet', not: 'Yanitsiz gecilemez' },
  ],
  '2': [
    { id: 1, parametre: 'Kategori', deger: 'Finansal', not: 'Finansal yeterlilik sorulari' },
  ],
  '3': [
    { id: 1, parametre: 'Kategori', deger: 'Risk Getiri', not: 'RGP hesaplamasinda kullanilir' },
    { id: 2, parametre: 'Skorlama', deger: 'Agirlikli', not: 'Agirlikli skor hesaplanir' },
  ],
}

export const cevapTipleri = [
  { id: 1, cevapTipi: 'E', aciklama: 'EVET/HAYIR' },
  { id: 2, cevapTipi: 'C', aciklama: 'COKLU SECIM' },
  { id: 3, cevapTipi: 'T', aciklama: 'TEKLI SECIM' },
  { id: 4, cevapTipi: 'N', aciklama: 'NUMERIK' },
  { id: 5, cevapTipi: 'M', aciklama: 'METIN' },
  { id: 6, cevapTipi: 'D', aciklama: 'TARIH' },
]

export const cevapTipleriDetaylari = {
  E: [
    { id: 1, parametre: 'Format', deger: 'Boolean', not: 'Evet/Hayir secimi' },
    { id: 2, parametre: 'Secim Sayisi', deger: 'Tek', not: 'Tek cevap secilir' },
  ],
  C: [
    { id: 1, parametre: 'Format', deger: 'Liste', not: 'Coklu secim listesi' },
    { id: 2, parametre: 'Secim Sayisi', deger: 'Coklu', not: 'Birden fazla cevap secilir' },
  ],
  T: [
    { id: 1, parametre: 'Format', deger: 'Liste', not: 'Tekli secim listesi' },
    { id: 2, parametre: 'Secim Sayisi', deger: 'Tek', not: 'Tek cevap secilir' },
  ],
  N: [
    { id: 1, parametre: 'Format', deger: 'Sayisal', not: 'Numerik deger girisi' },
  ],
  M: [
    { id: 1, parametre: 'Format', deger: 'Metin', not: 'Serbest metin girisi' },
  ],
  D: [
    { id: 1, parametre: 'Format', deger: 'Tarih', not: 'Tarih secimi' },
    { id: 2, parametre: 'Giris Tipi', deger: 'Takvim', not: 'Takvim uzerinden secim' },
  ],
}

export const soruBankasi = [
  { id: 1, soruNo: '14', soruTipi: 'Risk Getiri Profili-2018', cevapTipi: 'TEKLI SECIM', soru: 'Emeklilik doneminizde, yeteri kadar geliriniz olacagini dusunuyor musunuz?', siraNo: '7' },
  { id: 2, soruNo: '15', soruTipi: 'Risk Getiri Profili-2018', cevapTipi: 'TEKLI SECIM', soru: 'Yatiriminizin faiz icermesi onemli midir?', siraNo: '8' },
  { id: 3, soruNo: '8', soruTipi: 'Risk Getiri Profili-2018', cevapTipi: 'TEKLI SECIM', soru: 'Asagida belirtilen sure boyunca sistemde kalmayi dusunuyorum.', siraNo: '1' },
  { id: 4, soruNo: '9', soruTipi: 'Risk Getiri Profili-2018', cevapTipi: 'TEKLI SECIM', soru: 'Finansal yatirim islemleri hakkinda bilginiz nasildir?', siraNo: '2' },
  { id: 5, soruNo: '10', soruTipi: 'Risk Getiri Profili-2018', cevapTipi: 'TEKLI SECIM', soru: 'Getiri ve risk alma hususlarinda ne dusunuyorsunuz?', siraNo: '3' },
]

export const soruBankasiDetaylari = {
  14: [
    { id: 1, parametre: 'Zorunlu', deger: 'Evet', not: 'Soru atlanamaz' },
    { id: 2, parametre: 'Skor', deger: '10', not: 'Pozitif etki' },
  ],
  15: [
    { id: 1, parametre: 'Zorunlu', deger: 'Evet', not: 'Soru atlanamaz' },
    { id: 2, parametre: 'Skor', deger: '8', not: 'Orta etki' },
  ],
  8: [
    { id: 1, parametre: 'Zorunlu', deger: 'Evet', not: 'Temel risk sorusu' },
    { id: 2, parametre: 'Skor', deger: '12', not: 'Yuksek etki' },
  ],
  9: [
    { id: 1, parametre: 'Zorunlu', deger: 'Evet', not: 'Bilgi seviyesi olcumu' },
    { id: 2, parametre: 'Skor', deger: '9', not: 'Orta etki' },
  ],
  10: [
    { id: 1, parametre: 'Zorunlu', deger: 'Evet', not: 'Risk istahi sorusu' },
    { id: 2, parametre: 'Skor', deger: '11', not: 'Yuksek etki' },
  ],
}

export const soruKumeleri = [
  { id: 1, kumeNo: '1', aciklama: 'Musteri Bilgi Formu' },
  { id: 2, kumeNo: '2', aciklama: 'RGP BES' },
  { id: 3, kumeNo: '3', aciklama: 'Hazir RGP' },
  { id: 4, kumeNo: '4', aciklama: 'Risk Getiri Anketi-2018' },
  { id: 5, kumeNo: '5', aciklama: 'Saglik Sorulari' },
]

export const soruKumeleriDetaylari = {
  1: [
    { id: 1, parametre: 'Soru Adedi', deger: '12', not: 'Temel musteri sorulari' },
    { id: 2, parametre: 'Zorunlu', deger: 'Evet', not: 'Basvuru asamasinda zorunlu' },
  ],
  2: [
    { id: 1, parametre: 'Soru Adedi', deger: '8', not: 'RGP hesaplama sorulari' },
    { id: 2, parametre: 'Skorlama', deger: 'Aktif', not: 'Skorlama kullanilir' },
  ],
  3: [
    { id: 1, parametre: 'Soru Adedi', deger: '6', not: 'Hazir profil seti' },
  ],
  4: [
    { id: 1, parametre: 'Soru Adedi', deger: '15', not: '2018 risk anketi' },
    { id: 2, parametre: 'Skorlama', deger: 'Aktif', not: 'Skor uretir' },
  ],
  5: [
    { id: 1, parametre: 'Soru Adedi', deger: '10', not: 'Saglik beyan sorulari' },
  ],
}

// --- BES URETIM ---
export const tariffeListesi = [
  { id: 'PLN-1001', ad: 'BES Standart Plan', sozlesmeTipi: 'Ferdi', minYas: 18, maxYas: 56, minKatki: 750, durum: 'Aktif' },
  { id: 'PLN-1002', ad: 'BES Yillik Plan', sozlesmeTipi: 'Ferdi', minYas: 18, maxYas: 56, minKatki: 1500, durum: 'Aktif' },
  { id: 'PLN-1003', ad: 'BES Esnek Plan', sozlesmeTipi: 'Ferdi', minYas: 18, maxYas: 56, minKatki: 500, durum: 'Aktif' },
  { id: 'PLN-1004', ad: 'BES OKS Plan', sozlesmeTipi: 'OKS', minYas: 18, maxYas: 45, minKatki: 250, durum: 'Aktif' },
]

export const teklifler = [
  { id: 'TKL-2025-0001', tckn: '11111111110', adSoyad: 'Ayse Demir', plan: 'BES Standart Plan', tarih: '01.10.2025', tutar: 1000, durum: 'Onayda' },
  { id: 'TKL-2025-0002', tckn: '22222222220', adSoyad: 'Mehmet Kaya', plan: 'BES Yillik Plan', tarih: '03.10.2025', tutar: 2000, durum: 'Onayli' },
  { id: 'TKL-2025-0003', tckn: '33333333330', adSoyad: 'Ali Yildiz', plan: 'BES Esnek Plan', tarih: '05.10.2025', tutar: 750, durum: 'Iptal' },
]

/** Allianz teklif izleme / listeleme (detaylı mock) */
export const allianzTeklifler = [
  {
    id: '32253978',
    teklifNo: '32253978',
    tckn: '12345678901',
    adSoyad: 'Ali Örnek',
    plan: '518 - Kişiye Özel Plan',
    tarih: '13.05.2025',
    tutar: 1500,
    durum: 'Onay Bekliyor',
    acenteKod: '001122',
    acenteAd: 'EGE BÖLGE MÜDÜRLÜĞÜ',
    onaylar: { musteri: 'Bekliyor', kvkk: 'Bekliyor', elektronikIleti: 'Bekliyor', icOnay: 'Bekliyor' },
    tahsilat: { girildi: true, pciUyumlu: true, odemeAraci: 'Kredi Kartı', kartMaskeli: '**** **** **** 4242', tokenRef: 'tok_••••••••8f2a', sonDortHane: '4242', kayitTarihi: '13.05.2025 14:32' },
    odemePlani: { donem: 'Aylık', tutar: 1500, baslangic: '01.06.2025', taksitAdedi: 12 },
    fonlar: [
      { kod: 'AUA', varlik: 'TL Sabit Getiri', yuzde: 31 },
      { kod: 'AUA', varlik: 'TL Hisse Senedi', yuzde: 23 },
      { kod: 'AUA', varlik: 'Eurobond', yuzde: 17 },
      { kod: 'AUA', varlik: 'Yabancı Hisse', yuzde: 18 },
      { kod: 'AUA', varlik: 'Altın', yuzde: 11 },
    ],
    rgpf: { yapildi: true, tarih: '13.05.2025', profil: 'Dengeli', skor: 72, onerilenFon: 'AUA — Önerilen Sepet' },
    katilimci: { tckn: '12345678901', ad: 'ALI', soyad: 'ÖRNEK', dogum: '20.08.1985', cinsiyet: 'Erkek', meslek: 'Mühendis', cep: '532***2233', email: 'a***@mail.com', adres: 'İZMİR / KONAK — Örnek Mah. No:12' },
    katkiYapan: { ayni: true, tckn: '12345678901', ad: 'ALI', soyad: 'ÖRNEK' },
    yasalTemsilci: null,
  },
  {
    id: '32254102',
    teklifNo: '32254102',
    tckn: '98765432109',
    adSoyad: 'Zeynep Kaya',
    plan: 'BES Standart Plan',
    tarih: '14.05.2025',
    tutar: 2000,
    durum: 'Onay Bekliyor',
    acenteKod: '001122',
    acenteAd: 'EGE BÖLGE MÜDÜRLÜĞÜ',
    onaylar: { musteri: 'Bekliyor', kvkk: 'Onaylandı', elektronikIleti: 'Bekliyor', icOnay: 'Bekliyor' },
    tahsilat: { girildi: false, pciUyumlu: true, odemeAraci: '', kartMaskeli: '', tokenRef: '', sonDortHane: '', kayitTarihi: '' },
    odemePlani: { donem: 'Aylık', tutar: 2000, baslangic: '—', taksitAdedi: 12 },
    fonlar: [],
    rgpf: { yapildi: false, tarih: '', profil: '', skor: null, onerilenFon: '' },
    katilimci: { tckn: '98765432109', ad: 'ZEYNEP', soyad: 'KAYA', dogum: '15.03.1990', cinsiyet: 'Kadın', meslek: 'Öğretmen', cep: '533***4455', email: 'z***@mail.com', adres: 'ANKARA / ÇANKAYA — Atatürk Bulvarı' },
    katkiYapan: { ayni: false, tckn: '11122233344', ad: 'MEHMET', soyad: 'KAYA' },
    yasalTemsilci: null,
  },
  {
    id: '32253890',
    teklifNo: '32253890',
    tckn: '55544433322',
    adSoyad: 'Can Yılmaz (Velayet)',
    plan: 'BES Esnek Plan',
    tarih: '12.05.2025',
    tutar: 500,
    durum: 'Müşteri Onayı Bekliyor',
    acenteKod: '001155',
    acenteAd: 'İSTANBUL MERKEZ',
    onaylar: { musteri: 'Bekliyor', kvkk: 'Onaylandı', elektronikIleti: 'Onaylandı', icOnay: 'Onaylandı' },
    tahsilat: { girildi: true, pciUyumlu: true, odemeAraci: 'Banka Hesabı', kartMaskeli: 'TR** **** **** **89 01', tokenRef: 'iban_••••••8901', sonDortHane: '8901', kayitTarihi: '12.05.2025 09:15' },
    odemePlani: { donem: 'Aylık', tutar: 500, baslangic: '01.06.2025', taksitAdedi: 24 },
    fonlar: [{ kod: 'AUA', varlik: 'TL Sabit Getiri', yuzde: 100 }],
    rgpf: { yapildi: true, tarih: '12.05.2025', profil: 'Temkinli', skor: 45, onerilenFon: 'AUA — Temkinli' },
    katilimci: { tckn: '55544433322', ad: 'CAN', soyad: 'YILMAZ', dogum: '10.06.2012', cinsiyet: 'Erkek', meslek: 'Öğrenci', cep: '534***6677', email: '', adres: 'İSTANBUL / KADIKÖY' },
    katkiYapan: { ayni: false, tckn: '66677788899', ad: 'AYŞE', soyad: 'YILMAZ' },
    yasalTemsilci: { tckn: '66677788899', ad: 'AYŞE', soyad: 'YILMAZ', iliski: 'Anne (Yasal Temsilci)' },
  },
  {
    id: '32253701',
    teklifNo: '32253701',
    tckn: '44433322211',
    adSoyad: 'Deniz Arslan',
    plan: 'BES Yıllık Plan',
    tarih: '11.05.2025',
    tutar: 12000,
    durum: 'KVKK Onayı Bekliyor',
    acenteKod: '001122',
    acenteAd: 'EGE BÖLGE MÜDÜRLÜĞÜ',
    onaylar: { musteri: 'Onaylandı', kvkk: 'Bekliyor', elektronikIleti: 'Onaylandı', icOnay: 'Onaylandı' },
    tahsilat: { girildi: true, pciUyumlu: true, odemeAraci: 'Kredi Kartı', kartMaskeli: '**** **** **** 9012', tokenRef: 'tok_••••••••c4d1', sonDortHane: '9012', kayitTarihi: '11.05.2025 16:40' },
    odemePlani: { donem: 'Yıllık', tutar: 12000, baslangic: '01.01.2026', taksitAdedi: 1 },
    fonlar: [{ kod: 'AUA', varlik: 'Döviz Ağırlıklı', yuzde: 100 }],
    rgpf: { yapildi: true, tarih: '11.05.2025', profil: 'Agresif', skor: 88, onerilenFon: 'AUA — Agresif' },
    katilimci: { tckn: '44433322211', ad: 'DENİZ', soyad: 'ARSLAN', dogum: '22.07.1992', cinsiyet: 'Kadın', meslek: 'Avukat', cep: '535***8899', email: 'd***@mail.com', adres: 'İZMİR / BORNOVA' },
    katkiYapan: { ayni: true, tckn: '44433322211', ad: 'DENİZ', soyad: 'ARSLAN' },
    yasalTemsilci: null,
  },
  {
    id: '32253650',
    teklifNo: '32253650',
    tckn: '33322211100',
    adSoyad: 'Emre Demir',
    plan: '518 - Kişiye Özel Plan',
    tarih: '10.05.2025',
    tutar: 1750,
    durum: 'Elektronik İleti Onayı Bekliyor',
    acenteKod: '001188',
    acenteAd: 'ANKARA BÖLGE',
    onaylar: { musteri: 'Onaylandı', kvkk: 'Onaylandı', elektronikIleti: 'Bekliyor', icOnay: 'Onaylandı' },
    tahsilat: { girildi: true, pciUyumlu: true, odemeAraci: 'Kredi Kartı', kartMaskeli: '**** **** **** 5567', tokenRef: 'tok_••••••••91ab', sonDortHane: '5567', kayitTarihi: '10.05.2025 11:05' },
    odemePlani: { donem: 'Aylık', tutar: 1750, baslangic: '01.06.2025', taksitAdedi: 12 },
    fonlar: [{ kod: 'AUA', varlik: 'Önerilen Sepet', yuzde: 100 }],
    rgpf: { yapildi: true, tarih: '10.05.2025', profil: 'Dengeli', skor: 65, onerilenFon: 'AUA — Önerilen' },
    katilimci: { tckn: '33322211100', ad: 'EMRE', soyad: 'DEMİR', dogum: '05.01.1988', cinsiyet: 'Erkek', meslek: 'Mimar', cep: '536***1122', email: 'e***@mail.com', adres: 'ANKARA / ÇANKAYA' },
    katkiYapan: { ayni: true, tckn: '33322211100', ad: 'EMRE', soyad: 'DEMİR' },
    yasalTemsilci: null,
  },
  {
    id: '32253500',
    teklifNo: '32253500',
    tckn: '22211100099',
    adSoyad: 'Fatma Öztürk',
    plan: 'BES Standart Plan',
    tarih: '08.05.2025',
    tutar: 1000,
    durum: 'Onaylandı',
    acenteKod: '001122',
    acenteAd: 'EGE BÖLGE MÜDÜRLÜĞÜ',
    onaylar: { musteri: 'Onaylandı', kvkk: 'Onaylandı', elektronikIleti: 'Onaylandı', icOnay: 'Onaylandı' },
    tahsilat: { girildi: true, pciUyumlu: true, odemeAraci: 'Kredi Kartı', kartMaskeli: '**** **** **** 7788', tokenRef: 'tok_••••••••22ef', sonDortHane: '7788', kayitTarihi: '08.05.2025 10:00' },
    odemePlani: { donem: 'Aylık', tutar: 1000, baslangic: '01.05.2025', taksitAdedi: 12 },
    fonlar: [{ kod: 'AUA', varlik: 'TL Sabit Getiri', yuzde: 100 }],
    rgpf: { yapildi: true, tarih: '08.05.2025', profil: 'Temkinli', skor: 40, onerilenFon: 'AUA — Temkinli' },
    katilimci: { tckn: '22211100099', ad: 'FATMA', soyad: 'ÖZTÜRK', dogum: '18.11.1980', cinsiyet: 'Kadın', meslek: 'Hemşire', cep: '537***3344', email: 'f***@mail.com', adres: 'BURSA / OSMANGAZİ' },
    katkiYapan: { ayni: true, tckn: '22211100099', ad: 'FATMA', soyad: 'ÖZTÜRK' },
    yasalTemsilci: null,
  },
]

export const ALLIANZ_TEKLIF_DURUM_FILTRE = [
  { value: 'onay_bekleyen', label: 'Onay bekleyen (tümü)' },
  { value: 'musteri_onay', label: 'Müşteri onayı bekliyor' },
  { value: 'kvkk', label: 'KVKK onayı bekliyor' },
  { value: 'elektronik_ileti', label: 'Elektronik ileti onayı bekliyor' },
  { value: 'tumu', label: 'Tüm teklifler' },
]

export const basvurular = [
  { id: 'BSV-2025-0001', tckn: '11111111110', adSoyad: 'Ayse Demir', plan: 'BES Standart Plan', tarih: '02.10.2025', durum: 'Tahsilat Bekleniyor' },
  { id: 'BSV-2025-0002', tckn: '22222222220', adSoyad: 'Mehmet Kaya', plan: 'BES Yillik Plan', tarih: '03.10.2025', durum: 'Sozlesmelesti' },
]

export const sozlesmelerListe = [
  { id: 'SZL-2025-0001', tckn: '22222222220', adSoyad: 'Mehmet Kaya', plan: 'BES Yillik Plan', baslangic: '03.10.2025', durum: 'Aktif' },
]
