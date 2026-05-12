import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, ArrowLeft, LayoutGrid, List as ListIcon, MoreHorizontal, Eye, Pencil, Copy, List, Trash2, Settings, Filter, Heart, Activity, PiggyBank, Briefcase, FilePlus, BookOpen, Sparkles, Upload, ArrowRight, ChevronRight } from 'lucide-react'
import { urunPlanTarifeKartlari, urunPlanlari, katkiPayiTemplateleri } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

const PLAN_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'copy', label: 'Planı Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const URUN_ACTIONS = [
  { key: 'view', label: 'Planlarını Görüntüle', icon: 'view' },
  { key: 'edit', label: 'Güncelle', icon: 'edit' },
  { key: 'copy', label: 'Ürünü Kopyala', icon: 'copy' },
  { key: 'version', label: 'Yeni Versiyon', icon: 'version' },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]

const BRANCH_OPTIONS = [
  { key: 'saglik', label: 'Sağlık', description: 'ÖSS, TSS ve Seyahat', icon: Heart },
  { key: 'hayat', label: 'Hayat & Kaza', description: 'Hayat ve Ferdi Kaza', icon: Activity },
  { key: 'bireysel', label: 'Bireysel Emeklilik', description: 'BES ve OKS', icon: PiggyBank },
  { key: 'elementer', label: 'Elementer', description: 'Mühendislik, Oto, Yangın', icon: Briefcase },
]

const SOZLESME_TIPLERI = ['Ferdi', 'Grup', 'EGP', 'OKS', 'OKS-EGP']
const PLAN_SETUP_CARDS = [
  { id: 'genel', title: 'Genel Bilgiler', update: '20.02.2025', bar: 32, score: '2/6', color: 'bg-orange-500', lines: ['Kategori Kodu: BES-AD', 'Sözleşme Tipi: Ferdi'] },
  { id: 'fonlar', title: 'Fonlar ve Fon Karmaları', update: '30.12.2023', bar: 34, score: '2/6', color: 'bg-orange-500', lines: ['TANIMLANAN FON: 5 Adet', 'DEVLET KATKI FONU', 'ACİL EMEKLİLİK FONU'] },
  { id: 'katki', title: 'Katkı Payı Tanımları', update: '30.12.2025', bar: 8, score: '0/6', color: 'bg-red-500', lines: ['TANIMLANAN KATKI PAYI', '5 Adet', 'ASGARİ KATKI PAYI 1200 TL'] },
  { id: 'kesinti', title: 'Kesintiler', update: '10.12.2025', bar: 55, score: '3/6', color: 'bg-yellow-400', lines: ['ÖZET', 'Giriş Aidatı, YKG tanımlanmıştır', 'ÇIKIŞ AİDATI', 'Çıkışa erteleme'] },
  { id: 'diger', title: 'Diğer Tanımlar', update: '10.12.2025', bar: 82, score: '3/6', color: 'bg-lime-500', lines: ['İstisna Planları, Endeksler, Ek göstergeler tanımlanmıştır.'] },
  { id: 'belge', title: 'Plan Belgeleri', update: '10.12.2025', bar: 100, score: '6/6', color: 'bg-emerald-500', lines: ['Kayıtlı belge listesi mevcuttur', 'TANIMLANAN BELGE SAYISI', '1 Adet'] },
]

const FON_DELETE_ACTION = [{ key: 'delete', label: 'Sil', icon: 'delete', danger: true }]
const FON_KARMA_ACTIONS = [
  { key: 'details', label: 'Detaylar', icon: 'view' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
]
const INITIAL_FON_ROWS = [
  { fonKodu: 'FON-001', fonAdi: 'Esnek', fonTipi: 'T', min: '0%', max: '100%', zorunlu: 'Hayır', standart: 'Evet', devletKatkisi: 'Hayır', katilimEsasli: 'Hayır', fonDurumu: 'Pasif', kullanimda: 'Evet' },
  { fonKodu: 'FON-002', fonAdi: 'Büyüme', fonTipi: 'K', min: '0%', max: '100%', zorunlu: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', katilimEsasli: 'Hayır', fonDurumu: 'Aktif', kullanimda: 'Evet' },
  { fonKodu: 'FON-003', fonAdi: 'Dengeli', fonTipi: 'D', min: '10%', max: '90%', zorunlu: 'Hayır', standart: 'Hayır', devletKatkisi: 'Evet', katilimEsasli: 'Hayır', fonDurumu: 'Aktif', kullanimda: 'Hayır' },
  { fonKodu: 'FON-004', fonAdi: 'Korunmacı', fonTipi: 'K', min: '0%', max: '50%', zorunlu: 'Hayır', standart: 'Hayır', devletKatkisi: 'Hayır', katilimEsasli: 'Evet', fonDurumu: 'Aktif', kullanimda: 'Evet' },
  { fonKodu: 'FON-005', fonAdi: 'Hisse Ağırlıklı', fonTipi: 'T', min: '0%', max: '100%', zorunlu: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', katilimEsasli: 'Hayır', fonDurumu: 'Aktif', kullanimda: 'Evet' },
]
const INITIAL_KARMA_ROWS = [
  { karmaNo: '22328382', aciklama: 'Korumacı', mpRefKod: '—', katilimEsasli: 'Hayır', standart: 'Hayır', devletKatkisi: 'Hayır', baslangic: 'Hayır', rgpf: 'Evet' },
  { karmaNo: '22328383', aciklama: 'Dengeli', mpRefKod: '—', katilimEsasli: 'Hayır', standart: 'Evet', devletKatkisi: 'Hayır', baslangic: 'Evet', rgpf: 'Hayır' },
  { karmaNo: '22328384', aciklama: 'Girişimci', mpRefKod: '—', katilimEsasli: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', baslangic: 'Hayır', rgpf: 'Evet' },
  { karmaNo: '22328385', aciklama: 'Esnek', mpRefKod: '—', katilimEsasli: 'Hayır', standart: 'Evet', devletKatkisi: 'Evet', baslangic: 'Hayır', rgpf: 'Hayır' },
  { karmaNo: '22328386', aciklama: 'Büyüme', mpRefKod: '—', katilimEsasli: 'Evet', standart: 'Hayır', devletKatkisi: 'Hayır', baslangic: 'Hayır', rgpf: 'Hayır' },
]
const INITIAL_KARMA_FON_DETAY = [
  { fonKodu: 'AER', fonAciklama: 'Agito Para Piyasaları Fonu', fonTipi: 'Z', katilimEsasli: false, minOran: 0, maxOran: 100, oran: 30 },
  { fonKodu: 'AEG', fonAciklama: 'Agito Borçlanma Araçları Fonu', fonTipi: 'Z', katilimEsasli: false, minOran: 0, maxOran: 100, oran: 50 },
  { fonKodu: 'AEA', fonAciklama: 'Agito Hisse Senedi Emeklilik Fonu', fonTipi: 'Z', katilimEsasli: false, minOran: 0, maxOran: 100, oran: 20 },
]

const KP_TEMPLATE_ROW_ACTIONS = [
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const KESINTI_MENU_KEYS = [
  { id: 'girisAidati', label: 'Giriş Aidatı' },
  { id: 'ygkParam', label: 'YGK Parametreleri' },
  { id: 'ygkMuafiyet', label: 'YGK Muafiyet' },
  { id: 'araVerme', label: 'Ara Verme Kesintisi' },
  { id: 'kesintiBes30', label: 'Kesinti BES 3.0' },
  { id: 'ygkBes30', label: 'YGK BES 3.0 Parametreleri' },
]

const GA_LINKED_INITIAL = [
  { gaKodu: 'GA-01', doviz: 'TL', gaTipi: 'Peşin', taksitTipi: 'Ardışık', taksitAdedi: '12', pesinat: '500', taksit: '0', erteleme: '0', toplamTutar: '6.000' },
  { gaKodu: 'GA-02', doviz: 'USD', gaTipi: 'Çıkışa Ertelenmiş', taksitTipi: 'Dönem', taksitAdedi: '1', pesinat: '0', taksit: '0', erteleme: '100', toplamTutar: '1.500' },
]

const GA_CATALOG_ALL = [
  { gaKodu: 'GA-01', doviz: 'TL', gaTipi: 'Peşin', taksitTipi: 'Ardışık', taksitAdedi: '12', pesinat: '1000', taksit: '150', erteleme: '0', toplamTutar: '2800' },
  { gaKodu: 'GA-02', doviz: 'USD', gaTipi: 'Çıkışa Ertelenmiş', taksitTipi: '—', taksitAdedi: '—', pesinat: '0', taksit: '0', erteleme: '50', toplamTutar: '50' },
  { gaKodu: 'GA-03', doviz: 'TL', gaTipi: 'Peşin + Çıkışa Ert.', taksitTipi: 'Dönem', taksitAdedi: 'Aylık', pesinat: '500', taksit: '200', erteleme: '100', toplamTutar: '2900' },
  { gaKodu: 'GA-04', doviz: 'EUR', gaTipi: 'Giriş Aidatı Yok', taksitTipi: '—', taksitAdedi: '—', pesinat: '0', taksit: '0', erteleme: '0', toplamTutar: '0' },
  { gaKodu: 'GA-05', doviz: 'TL', gaTipi: 'Peşin', taksitTipi: 'Peşin', taksitAdedi: '1', pesinat: '1500', taksit: '0', erteleme: '0', toplamTutar: '1500' },
]

const GA_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
]

const YGK_LINKED_INITIAL = [
  {
    rowKey: 'YGK-001-1',
    gecerlilikTarihi: '01.01.2025',
    doviz: 'TRL',
    tabloTipi: 'P - Katkı Payı',
    ygkAdi: 'YGK Standart Kural',
    versiyon: '1',
    yilTipi: 'Yürürlük Tarihi',
    limitTutarTipi: 'Sözleşme Birikimi',
    kademeTipi: 'Kümülatif Kademe',
    yilBazindaSifirla: false,
    ygkHesaplamaKurali: '—',
    ygkKodu: 'YGK-001',
  },
  {
    rowKey: 'YGK-002-2',
    gecerlilikTarihi: '01.01.2025',
    doviz: 'USD',
    tabloTipi: 'B - Birikim Trans.',
    ygkAdi: 'YGK Alternatif Kural',
    versiyon: '2',
    yilTipi: 'Tahsilat Tarihi',
    limitTutarTipi: 'Toplam Tahsilat',
    kademeTipi: 'Kademe',
    yilBazindaSifirla: true,
    ygkHesaplamaKurali: '—',
    ygkKodu: 'YGK-002',
  },
]

const YGK_CATALOG_ALL = [
  { ygkKodu: 'YGK-001', ygkAdi: 'YGK Standart Kural', versiyon: '1', gecerlilikTarihi: '01.01.2025', doviz: 'TRL', tabloTipi: 'P - Katkı Payı', yilTipi: 'Yürürlük Tarihi', limitTutarTipi: 'Sözleşme Birikimi', ygkHesaplamaKurali: '—', kademeTipi: 'Kümülatif Kademe', yilBazindaSifirla: false },
  { ygkKodu: 'YGK-002', ygkAdi: 'YGK Alternatif Kural', versiyon: '2', gecerlilikTarihi: '01.06.2025', doviz: 'USD', tabloTipi: 'B - Birikim Trans.', yilTipi: 'Tahsilat Tarihi', limitTutarTipi: 'Toplam Tahsilat', ygkHesaplamaKurali: '—', kademeTipi: 'Kademe', yilBazindaSifirla: true },
  { ygkKodu: 'YGK-000', ygkAdi: 'YGK Kesinti Yok', versiyon: '1', gecerlilikTarihi: '01.01.2024', doviz: 'TRL', tabloTipi: 'Yok', yilTipi: '—', limitTutarTipi: '—', ygkHesaplamaKurali: '—', kademeTipi: '—', yilBazindaSifirla: false },
]

const YGK_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const YGK_VERSIONS_BY_KOD = {
  'YGK-001': [
    { versiyon: '1', aciklama: 'YGK Standart Kural', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '0', aciklama: 'YGK Standart Kural (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YGK-002': [
    { versiyon: '2', aciklama: 'YGK Alternatif Kural', durum: 'Aktif', gecerlilik: '01.06.2025' },
    { versiyon: '1', aciklama: 'YGK Alternatif Kural', durum: 'Arşiv', gecerlilik: '01.01.2025' },
  ],
  'YGK-000': [{ versiyon: '1', aciklama: 'YGK Kesinti Yok', durum: 'Aktif', gecerlilik: '01.01.2024' }],
}

const YGK_MUAF_LINKED_INITIAL = [
  { rowKey: 'YGKM-001-1', muafKodu: 'YGKM-001', muafAdi: 'YGK Muafiyet Kuralı', versiyon: '1', yil: '2', toplamOdenmisKp: '850', doviz: 'TRL', oran: '0.6' },
]

const YGK_MUAF_CATALOG_ALL = [
  { muafKodu: 'YGKM-001', muafAdi: 'YGK Muafiyet Kuralı', versiyon: '1', gecerlilikTarihi: '30.07.2024', yil: '2', toplamOdenmisKp: '850', doviz: 'TRL', oran: '0.6' },
  { muafKodu: 'YGKM-002', muafAdi: 'Alternatif Muafiyet Kuralı', versiyon: '2', gecerlilikTarihi: '01.01.2025', yil: '3', toplamOdenmisKp: '1200', doviz: 'USD', oran: '0.5' },
  { muafKodu: 'YGKM-000', muafAdi: 'Muafiyet Yok', versiyon: '1', gecerlilikTarihi: '01.01.2026', yil: '0', toplamOdenmisKp: '0', doviz: 'TRL', oran: '0' },
]

const YGK_MUAF_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const YGK_MUAF_VERSIONS_BY_KOD = {
  'YGKM-001': [
    { versiyon: '1', aciklama: 'YGK Muafiyet Kuralı', durum: 'Aktif', gecerlilik: '30.07.2024' },
    { versiyon: '0', aciklama: 'YGK Muafiyet Kuralı (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2024' },
  ],
  'YGKM-002': [
    { versiyon: '2', aciklama: 'Alternatif Muafiyet Kuralı', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '1', aciklama: 'Alternatif Muafiyet Kuralı', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YGKM-000': [{ versiyon: '1', aciklama: 'Muafiyet Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

const ARA_VERME_LINKED_INITIAL = [
  { rowKey: 'AVK-001-1', avKodu: 'AVK-001', avAdi: 'Ara Verme Standart', versiyon: '1', tutar: '2 TL', hesaplamaKurali: '—', onKosul: '—' },
]

const ARA_VERME_CATALOG_ALL = [
  { avKodu: 'AVK-001', avAdi: 'Ara Verme Standart', versiyon: '1', gecerlilikTarihi: '01.01.2026', tutar: '2 TL', hesaplamaKurali: '—', onKosul: '—' },
  { avKodu: 'AVK-002', avAdi: 'Ara Verme Esnek', versiyon: '1', gecerlilikTarihi: '15.06.2025', tutar: '5 TL', hesaplamaKurali: 'Oran', onKosul: 'Min 12 ay' },
  { avKodu: 'AVK-000', avAdi: 'Ara Verme Yok', versiyon: '1', gecerlilikTarihi: '01.01.2026', tutar: '0 TL', hesaplamaKurali: '—', onKosul: '—' },
]

const ARA_VERME_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'delete', label: 'Sil', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const ARA_VERME_VERSIONS_BY_KOD = {
  'AVK-001': [
    { versiyon: '1', aciklama: 'Ara Verme Standart', durum: 'Aktif', gecerlilik: '01.01.2026' },
    { versiyon: '0', aciklama: 'Ara Verme Standart (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2025' },
  ],
  'AVK-002': [
    { versiyon: '1', aciklama: 'Ara Verme Esnek', durum: 'Aktif', gecerlilik: '15.06.2025' },
  ],
  'AVK-000': [{ versiyon: '1', aciklama: 'Ara Verme Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

const KESINTI_BES30_LINKED_INITIAL = [
  { rowKey: 'KB30-001-1', kbKodu: 'KB30-001', kbAdi: 'Kesinti BES3.0 Kuralı 1', versiyon: '1', yil: '1', maxKesintiOrani: '0.63', maxKesintiTutari: '—' },
  { rowKey: 'KB30-002-2', kbKodu: 'KB30-002', kbAdi: 'Kesinti BES3.0 Kuralı 2', versiyon: '2', yil: '2', maxKesintiOrani: '0.50', maxKesintiTutari: '—' },
  { rowKey: 'KB30-003-1', kbKodu: 'KB30-003', kbAdi: 'Kesinti BES3.0 Kuralı 3', versiyon: '1', yil: '3', maxKesintiOrani: '0.40', maxKesintiTutari: '—' },
]

const KESINTI_BES30_CATALOG_ALL = [
  { kbKodu: 'KB30-001', kbAdi: 'Kesinti BES3.0 Kural 1', versiyon: '1', gecerlilikTarihi: '30.07.2024', yil: '1', maxKesintiOrani: '0.63', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-002', kbAdi: 'Kesinti BES3.0 Kural 2', versiyon: '2', gecerlilikTarihi: '15.03.2025', yil: '2', maxKesintiOrani: '0.50', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-003', kbAdi: 'Kesinti BES3.0 Kural 3', versiyon: '1', gecerlilikTarihi: '01.01.2026', yil: '3', maxKesintiOrani: '0.40', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-004', kbAdi: 'Kesinti BES3.0 Kural 4', versiyon: '1', gecerlilikTarihi: '01.06.2026', yil: '4', maxKesintiOrani: '0.35', maxKesintiTutari: '—' },
  { kbKodu: 'KB30-000', kbAdi: 'Kesinti BES3.0 Yok', versiyon: '1', gecerlilikTarihi: '01.01.2026', yil: '0', maxKesintiOrani: '0', maxKesintiTutari: '0' },
]

const KESINTI_BES30_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
]

const KESINTI_BES30_VERSIONS_BY_KOD = {
  'KB30-001': [
    { versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 1', durum: 'Aktif', gecerlilik: '30.07.2024' },
    { versiyon: '0', aciklama: 'Kesinti BES3.0 Kural 1 (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2024' },
  ],
  'KB30-002': [
    { versiyon: '2', aciklama: 'Kesinti BES3.0 Kural 2', durum: 'Aktif', gecerlilik: '15.03.2025' },
    { versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 2 (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2025' },
  ],
  'KB30-003': [{ versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 3', durum: 'Aktif', gecerlilik: '01.01.2026' }],
  'KB30-004': [{ versiyon: '1', aciklama: 'Kesinti BES3.0 Kural 4', durum: 'Aktif', gecerlilik: '01.06.2026' }],
  'KB30-000': [{ versiyon: '1', aciklama: 'Kesinti BES3.0 Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

const YGK_BES30_LINKED_INITIAL = [
  {
    rowKey: 'YB30-001-1',
    ybKodu: 'YB30-001',
    ybAdi: 'YGK BES3.0 Kuralı 1',
    versiyon: '1',
    dovizKodu: 'TRL',
    ygkKesintiTipi: 'Katkı Payı Aralığı',
    oran: '—',
    yillikTutar: '—',
    ygkFormulu: '—',
    kesintiDonemi: 'Aylık',
    sozlesmeYiliAraligi: '1-1',
    birikim: 'Anapara',
    gecerlilikTarihi: '01.01.2025',
    birikimTipi: 'Anapara BRK',
  },
  {
    rowKey: 'YB30-002-2',
    ybKodu: 'YB30-002',
    ybAdi: 'YGK BES3.0 Kuralı 2',
    versiyon: '2',
    dovizKodu: 'TRL',
    ygkKesintiTipi: 'Oran',
    oran: '0.03',
    yillikTutar: '—',
    ygkFormulu: '—',
    kesintiDonemi: 'Yıllık',
    sozlesmeYiliAraligi: '5-5',
    birikim: 'Toplam',
    gecerlilikTarihi: '01.01.2025',
    birikimTipi: 'Toplam BRK',
  },
]

const YGK_BES30_CATALOG_ALL = [
  { ybKodu: 'YB30-001', ybAdi: 'YGK BES3.0 Kuralı 1', versiyon: '1', gecerlilikTarihi: '01.01.2025', doviz: 'TRL', ygkKesintiTipi: 'Katkı Payı Aralığı', oran: '—', yillikTutar: '—', ygkFormulu: '—', kesintiDonemi: 'Aylık', sozlesmeYili: '1', birikim: 'Anapara', birikimTipi: 'Anapara BRK' },
  { ybKodu: 'YB30-002', ybAdi: 'YGK BES3.0 Kuralı 2', versiyon: '2', gecerlilikTarihi: '01.01.2025', doviz: 'TRL', ygkKesintiTipi: 'Oran', oran: '0.03', yillikTutar: '—', ygkFormulu: '—', kesintiDonemi: 'Yıllık', sozlesmeYili: '5', birikim: 'Toplam', birikimTipi: 'Toplam BRK' },
  { ybKodu: 'YB30-003', ybAdi: 'YGK BES3.0 Kuralı 3', versiyon: '1', gecerlilikTarihi: '01.06.2025', doviz: 'USD', ygkKesintiTipi: 'Yok', oran: '—', yillikTutar: '—', ygkFormulu: '—', kesintiDonemi: 'Yok', sozlesmeYili: '0', birikim: '—', birikimTipi: '—' },
]

const YGK_BES30_ROW_ACTIONS = [
  { key: 'view', label: 'İncele', icon: 'view' },
  { key: 'remove', label: 'Çıkar', icon: 'delete', danger: true },
  { key: 'history', label: 'Versiyonlar', icon: 'history' },
  { key: 'details', label: 'Detaylar', icon: 'details' },
]

const YGK_BES30_VERSIONS_BY_KOD = {
  'YB30-001': [
    { versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 1', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '0', aciklama: 'YGK BES3.0 Kuralı 1 (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2024' },
  ],
  'YB30-002': [
    { versiyon: '2', aciklama: 'YGK BES3.0 Kuralı 2', durum: 'Aktif', gecerlilik: '01.01.2025' },
    { versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 2 (önceki)', durum: 'Arşiv', gecerlilik: '15.09.2024' },
  ],
  'YB30-003': [{ versiyon: '1', aciklama: 'YGK BES3.0 Kuralı 3', durum: 'Aktif', gecerlilik: '01.06.2025' }],
}

const YGK_BES30_MUAF_BANDS_BY_KOD = {
  'YB30-001': [
    { id: '1', minTutar: '1001', maxTutar: '2000', oran: '0.08', tutar: '—' },
    { id: '2', minTutar: '2001', maxTutar: '3500', oran: '0.10', tutar: '—' },
    { id: '3', minTutar: '3501', maxTutar: '5000', oran: '0.12', tutar: '—' },
    { id: '4', minTutar: '5001', maxTutar: '7500', oran: '0.14', tutar: '—' },
    { id: '5', minTutar: '7501', maxTutar: '10000', oran: '0.16', tutar: '—' },
  ],
  'YB30-002': [
    { id: '1', minTutar: '0', maxTutar: '50000', oran: '0.03', tutar: '—' },
    { id: '2', minTutar: '50001', maxTutar: '100000', oran: '0.025', tutar: '—' },
  ],
  'YB30-003': [],
}

const YGK_BES30_KP_ARALIK_BY_KOD = {
  'YB30-001': [
    { id: '1', minKp: '500', maxKp: '2500', oran: '0.08', tutar: '—' },
    { id: '2', minKp: '2501', maxKp: '10000', oran: '0.10', tutar: '—' },
  ],
  'YB30-002': [{ id: '1', minKp: '1000', maxKp: '999999', oran: '0.03', tutar: '—' }],
  'YB30-003': [],
}

const YGK_BES30_MUAF_BAND_INNER_ACTIONS = [{ key: 'view', label: 'İncele', icon: 'view' }]

const KP_TEMPLATE_VERSIONS_BY_KOD = {
  'KPT-001': [
    { versiyon: '1', aciklama: 'Standart KP', durum: 'Aktif', olusturulma: '15.09.2025', olusturan: 'endeksleme' },
    { versiyon: '0', aciklama: 'Standart KP (önceki)', durum: 'Arşiv', olusturulma: '01.06.2025', olusturan: 'admin' },
  ],
  'KPT-002': [
    { versiyon: '2', aciklama: 'Yıllık KP', durum: 'Aktif', olusturulma: '21.09.2025', olusturan: 'endeksleme' },
    { versiyon: '1', aciklama: 'Yıllık KP', durum: 'Arşiv', olusturulma: '20.09.2025', olusturan: 'endeksleme' },
  ],
}

function kptToLinkedRow(t) {
  return {
    rowKey: `${t.kpTemplateKodu}-${t.versiyon}`,
    kpTemplateKodu: t.kpTemplateKodu,
    adi: t.adi,
    versiyon: t.versiyon,
    katkiPayiTutari: t.katkiPayiTutari,
    baslangicKapitali: t.baslangicKapitali,
    girisFonBuyuklugu: t.girisFonBuyuklugu,
    dovizKp: t.dovizKp,
    odemePeriyodu: t.odemePeriyodu,
    azamiKp: t.azamiKp,
    dovizDiger: t.dovizDiger,
    olusturan: t.olusturan,
    olusturulmaTarihi: t.olusturulmaTarihi,
    guncelleyen: t.guncelleyen || t.olusturan,
    guncellemeTarihi: t.guncellemeTarihi || t.olusturulmaTarihi,
  }
}

function normalizeDate(value) {
  return value || new Date().toLocaleDateString('tr-TR')
}

function normalizeProduct(payload, source = {}) {
  const toplam = Number(payload.toplam ?? source.toplam ?? 0)
  const aktif = Number(payload.aktif ?? source.aktif ?? 0)
  const kapali = Number(payload.kapali ?? source.kapali ?? Math.max(toplam - aktif, 0))
  return {
    ...source,
    ...payload,
    tip: 'plan',
    toplam,
    aktif,
    kapali,
    tarih: normalizeDate(payload.tarih ?? source.tarih),
  }
}

function normalizePlan(payload, source = {}) {
  return {
    ...source,
    ...payload,
    oran: Number(payload.oran ?? source.oran ?? 0),
    tarih: normalizeDate(payload.tarih ?? source.tarih),
  }
}

function ProductCard({ urun, onOpen, onAction, menuOpenId, setMenuOpenId }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="cursor-pointer p-5 pb-0" onClick={() => onOpen(urun)}>
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[11px] font-semibold">{urun.id}</div>
          <h3 className="text-[42px] leading-[1.05] font-bold text-slate-800 group-hover:text-violet-700 mt-3">{urun.ad}</h3>
        </div>
        <div className="flex items-start gap-2 p-4 pb-0">
          <button
            type="button"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
            onClick={(e) => { e.stopPropagation(); setMenuOpenId((prev) => (prev === urun.id ? null : urun.id)) }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button type="button" className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-500">
            <Settings className="w-4 h-4" />
          </button>
          {menuOpenId === urun.id && (
            <div className="absolute z-30 top-12 right-14 w-44 bg-white border border-slate-200 rounded-xl shadow-[0_12px_30px_rgba(15,23,42,0.14)] py-1 text-sm">
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('view', urun)}><Eye className="w-3.5 h-3.5 text-violet-500" /> İncele</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('edit', urun)}><Pencil className="w-3.5 h-3.5 text-violet-500" /> Güncelle</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('copy', urun)}><Copy className="w-3.5 h-3.5 text-violet-500" /> Kopyala</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2" onClick={() => onAction('newPlan', urun)}><Plus className="w-3.5 h-3.5 text-violet-500" /> Yeni Plan Ekle</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50 inline-flex items-center gap-2 text-violet-700" onClick={() => onAction('view', urun)}><List className="w-3.5 h-3.5 text-violet-500" /> Planlar</button>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-red-50 inline-flex items-center gap-2 text-red-600" onClick={() => onAction('delete', urun)}><Trash2 className="w-3.5 h-3.5 text-red-500" /> Sil</button>
            </div>
          )}
        </div>
      </div>
      <div className="cursor-pointer px-5 pb-4" onClick={() => onOpen(urun)}>
        <p className="text-[13px] text-slate-500 mb-3">{urun.tipler}</p>
        <div className="space-y-1.5 text-slate-600 text-sm">
          <p>Toplam Plan Sayısı {urun.toplam}</p>
          <p>Aktif Plan Sayısı {urun.aktif}</p>
          <p>Satışa Kapalı Plan {urun.kapali}</p>
        </div>
      </div>
      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-white">
        <span className="text-xs text-slate-400">{urun.tarih}</span>
        <button type="button" className="px-3 py-1 rounded-full border border-violet-200 text-violet-700 text-xs font-medium bg-violet-50/30">Aktif Planlar</button>
      </div>
    </div>
  )
}

function PlanList({ urun, planlar, onBack, onSavePlan, onPlanAction, onStartNewPlanFlow }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', durum: 'Taslak', oran: 30, tarih: '' })

  const filtered = planlar.filter((p) => {
    const matchSearch = !search || p.ad.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.durum === statusFilter
    return matchSearch && matchStatus
  })

  const openCreate = () => {
    onStartNewPlanFlow?.(urun)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ ...row })
    setFormOpen(true)
  }

  const save = () => {
    if (!form.id.trim()) return alert('Plan No zorunludur.')
    if (!form.ad.trim()) return alert('Plan Adi zorunludur.')
    const payload = normalizePlan(form)
    const duplicate = planlar.some((p) => p.id === payload.id && p.id !== editingId)
    if (duplicate) return alert('Bu Plan No zaten kullaniliyor.')
    onSavePlan(payload, editingId)
    setFormOpen(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OutlineButton onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Ürün Listesi
          </OutlineButton>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{urun.ad}</h2>
            <div className="text-xs text-slate-500">{urun.tipler}</div>
          </div>
        </div>
        <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Plan</PrimaryButton>
      </div>

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Plan Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Plan adı veya kodu..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Durum</label>
          <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tümü</option>
            <option value="Yururlukte">Yürürlükte</option>
            <option value="Taslak">Taslak</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th>Plan No</th>
              <th>Plan Adı</th>
              <th>Durum</th>
              <th>Tamamlanma</th>
              <th>Tarih</th>
              <th className="w-12 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-xs">{p.id}</td>
                <td>{p.ad}</td>
                <td><StatusBadge value={p.durum} /></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${p.oran}%` }} /></div>
                    <span className="text-xs text-slate-600 w-10 text-right">{p.oran}%</span>
                  </div>
                </td>
                <td>{p.tarih}</td>
                <td className="text-right">
                  <RowActions
                    row={p}
                    actions={PLAN_ACTIONS}
                    onAction={(key, row) => {
                      if (key === 'edit') openEdit(row)
                      else onPlanAction(key, row)
                    }}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${editingId ? 'Plan Güncelle' : 'Yeni Plan'} - ${urun.ad}`}
        size="lg"
        footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={save}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[{ k: 'id', l: 'Plan No' }, { k: 'ad', l: 'Plan Adi' }, { k: 'durum', l: 'Durum' }, { k: 'oran', l: 'Tamamlanma %' }, { k: 'tarih', l: 'Tarih' }].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}

function PlanConfigurationBoard({ plan, urun, onBack, onOpenCard }) {
  const visibleCards = (urun?.sozlesmeTipi || '').toUpperCase() === 'OKS'
    ? PLAN_SETUP_CARDS.filter((card) => card.id !== 'katki' && card.id !== 'kesinti')
    : PLAN_SETUP_CARDS

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">TASLAK</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{plan?.id || '-'}  ·  {urun?.sozlesmeTipi || 'Ferdi'}  ·  {plan?.tarih || normalizeDate()}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: '52%' }} /></div>
          <div className="text-xs text-slate-600 text-right mt-1">%52 1/6</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 md:p-4 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {visibleCards.map((card) => (
            <button key={card.id} data-card-id={card.id} type="button" onClick={() => onOpenCard?.(card.id)} className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{card.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">Son Güncelleme Tarihi: {card.update}</div>
                </div>
                <span className="w-4 h-4 rounded-full border border-emerald-300 text-emerald-500 inline-flex items-center justify-center text-[10px]">✓</span>
              </div>
              <div className="mt-3">
                <div className="text-[10px] text-slate-500 mb-1">TANIMLAMA</div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${card.color}`} style={{ width: `${card.bar}%` }} />
                </div>
                <div className="text-[11px] text-slate-500 text-right mt-1">%{card.bar} {card.score}</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
                {card.lines.map((line) => <div key={line}>{line}</div>)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlanGenelBilgilerScreen({ plan, urun, onBack }) {
  const [form, setForm] = useState({
    sozlesmeTipi: urun?.sozlesmeTipi || 'Ferdi',
    versiyonNo: '1',
    planKodu: plan?.id || '',
    kategoriKodu: 'BES-AP',
    planAdi: plan?.ad || '',
    planKisaAdi: '',
    baslangicTarihi: plan?.tarih || normalizeDate(),
    hazinePlanKodu: '',
    hazineTescilTarihi: '',
    basvuruTipi: '',
    durum: plan?.durum || 'Taslak',
    doviz: '',
    kurTipi: '',
    minGirisYasi: '',
    maxGirisYasi: '',
    emanetFon: 'FON1',
    gecerliSozlesmeCinsi: '',
    vakifAktarim: '',
    vakifAktarimSuresi: '',
    odemeAraclari: '',
    bosTipleri: '',
    katilimEsasli: Boolean(plan?.katilimEsasli),
    vatandaslikPlani: false,
    aktarimaOzelPlan: false,
    masrafliSatis: false,
    betas: false,
    hedefKitle: plan?.hedefKitle || '',
    mevzuatIstisnaMetni: '',
  })

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">{plan?.ad || `${urun?.ad || 'Plan'} - Yeni Plan`}</h2>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-semibold">TASLAK</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{plan?.id || '-'}  ·  {urun?.sozlesmeTipi || 'Ferdi'}  ·  {plan?.tarih || normalizeDate()}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500" style={{ width: '20%' }} /></div>
          <div className="text-xs text-slate-600 text-right mt-1">%20 2/6</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-slate-50/30">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Plan Konfigürasyonu</h3>
        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-4">
          <div>Branş: bes</div>
          <div>Ürün Kodu: {urun?.id || '-'}</div>
          <div>Ürün Adı: {urun?.ad || '-'}</div>
          <div>Oluşturan: Sistem Kullanıcısı</div>
          <div>Oluşturulma: {normalizeDate()}</div>
          <div>Son Güncelleme / Güncelleyen: {normalizeDate()} / Sistem Kullanıcısı</div>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-4">Genel Bilgiler</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Sözleşme Tipi *</span>
              <input className="form-input bg-slate-50" value={form.sozlesmeTipi} disabled />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Versiyon No</span>
              <input className="form-input" value={form.versiyonNo} onChange={(e) => setValue('versiyonNo', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Plan Kodu *</span>
              <input className="form-input bg-slate-50" value={form.planKodu} disabled />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Kategori Kodu</span>
              <input className="form-input" value={form.kategoriKodu} onChange={(e) => setValue('kategoriKodu', e.target.value)} />
            </label>

            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Plan Adı *</span>
              <input className="form-input" value={form.planAdi} onChange={(e) => setValue('planAdi', e.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Plan kısa adı</span>
              <input className="form-input" value={form.planKisaAdi} onChange={(e) => setValue('planKisaAdi', e.target.value)} />
            </label>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Başlangıç Tarihi *</span>
              <input className="form-input" value={form.baslangicTarihi} onChange={(e) => setValue('baslangicTarihi', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Hazine Plan Kodu *</span>
              <input className="form-input" value={form.hazinePlanKodu} onChange={(e) => setValue('hazinePlanKodu', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Hazine Tescil Tarihi *</span>
              <input className="form-input" placeholder="dd......yyyy" value={form.hazineTescilTarihi} onChange={(e) => setValue('hazineTescilTarihi', e.target.value)} />
            </label>
            <label className="inline-flex items-center gap-2 h-11 mt-5 text-sm text-slate-700">
              <input type="checkbox" checked={form.katilimEsasli} onChange={(e) => setValue('katilimEsasli', e.target.checked)} />
              Katılım Esaslı
            </label>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Başvuru Tipi *</span>
              <select className="form-select" value={form.basvuruTipi} onChange={(e) => setValue('basvuruTipi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Durum</span>
              <select className="form-select" value={form.durum} onChange={(e) => setValue('durum', e.target.value)}><option value="Taslak">Taslak</option><option value="Yururlukte">Yürürlükte</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Döviz *</span>
              <select className="form-select" value={form.doviz} onChange={(e) => setValue('doviz', e.target.value)}><option value="">Seçiniz</option><option value="TL">TL</option><option value="USD">USD</option><option value="EUR">EUR</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Kur Tipi *</span>
              <select className="form-select" value={form.kurTipi} onChange={(e) => setValue('kurTipi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>

            <label className="block"><span className="block text-xs text-slate-600 mb-1">Min. Giriş Yaşı</span><input className="form-input" value={form.minGirisYasi} onChange={(e) => setValue('minGirisYasi', e.target.value)} /></label>
            <label className="block"><span className="block text-xs text-slate-600 mb-1">Max. Giriş Yaşı</span><input className="form-input" value={form.maxGirisYasi} onChange={(e) => setValue('maxGirisYasi', e.target.value)} /></label>
            <label className="block md:col-span-2"><span className="block text-xs text-slate-600 mb-1">Emanet Fon</span><select className="form-select" value={form.emanetFon} onChange={(e) => setValue('emanetFon', e.target.value)}><option value="FON1">FON1</option></select></label>

            <label className="block md:col-span-2">
              <span className="block text-xs text-slate-600 mb-1">Geçerli Sözleşme Cinsi</span>
              <select className="form-select" value={form.gecerliSozlesmeCinsi} onChange={(e) => setValue('gecerliSozlesmeCinsi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>
            <div className="md:col-span-2" />

            <div className="md:col-span-2">
              <div className="text-xs text-slate-600 mb-1">Özellikler</div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.katilimEsasli} onChange={(e) => setValue('katilimEsasli', e.target.checked)} /> Katılım Esaslı</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.vatandaslikPlani} onChange={(e) => setValue('vatandaslikPlani', e.target.checked)} /> Vatandaşlık Planı</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.aktarimaOzelPlan} onChange={(e) => setValue('aktarimaOzelPlan', e.target.checked)} /> Aktarıma Özel Plan</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.masrafliSatis} onChange={(e) => setValue('masrafliSatis', e.target.checked)} /> Masraflı Satış</label>
                <label className="inline-flex items-center gap-1"><input type="checkbox" checked={form.betas} onChange={(e) => setValue('betas', e.target.checked)} /> Betas</label>
              </div>
            </div>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Vakf Aktarımı</span>
              <select className="form-select" value={form.vakifAktarim} onChange={(e) => setValue('vakifAktarim', e.target.value)}><option value="">Seçiniz</option><option value="yes">Vakıf Aktarımı</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Vakf. Aktarım Süresi</span>
              <select className="form-select" value={form.vakifAktarimSuresi} onChange={(e) => setValue('vakifAktarimSuresi', e.target.value)}><option value="">Seçiniz</option></select>
            </label>

            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Ödeme Araçları *</span>
              <select className="form-select" value={form.odemeAraclari} onChange={(e) => setValue('odemeAraclari', e.target.value)}><option value="">Seçiniz</option></select>
            </label>
            <label className="block">
              <span className="block text-xs text-slate-600 mb-1">Boş Tipleri *</span>
              <select className="form-select" value={form.bosTipleri} onChange={(e) => setValue('bosTipleri', e.target.value)}><option value="">Seçiniz</option></select>
            </label>

            <label className="block md:col-span-4">
              <span className="block text-xs text-slate-600 mb-1">Hedef Kitle Açıklaması *</span>
              <textarea className="form-input min-h-[76px]" placeholder="Hedef kitle açıklaması..." value={form.hedefKitle} onChange={(e) => setValue('hedefKitle', e.target.value)} />
            </label>
            <label className="block md:col-span-4">
              <span className="block text-xs text-slate-600 mb-1">Mevzuat İstisna Metni *</span>
              <textarea className="form-input min-h-[76px]" placeholder="Mevzuat istisna metni..." value={form.mevzuatIstisnaMetni} onChange={(e) => setValue('mevzuatIstisnaMetni', e.target.value)} />
            </label>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
            <OutlineButton>İptal</OutlineButton>
            <PrimaryButton>Kaydet</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function FonlarVeFonKarmalariScreen({ plan, urun, onBack }) {
  const [tab, setTab] = useState('fonlar')
  const [rows, setRows] = useState(INITIAL_FON_ROWS)
  const [karmaRows, setKarmaRows] = useState(INITIAL_KARMA_ROWS)
  const [selectedKarma, setSelectedKarma] = useState(null)
  const [karmaDetailRows, setKarmaDetailRows] = useState(INITIAL_KARMA_FON_DETAY)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [karmaModalOpen, setKarmaModalOpen] = useState(false)
  const [oranModalOpen, setOranModalOpen] = useState(false)
  const [fonForm, setFonForm] = useState({
    fonKodu: '',
    fonTipi: '',
    fonAdi: '',
    katilimEsasli: '',
    devletKatkisi: '',
    standart: '',
    minOran: '0.00',
    maxOran: '0.00',
    zorunlu: '',
  })
  const [karmaForm, setKarmaForm] = useState({
    karmaNo: 'EMK-FNK-756',
    aciklama: '',
    devletKatkisi: '',
    katilimEsasli: '',
    baslangic: '',
    standart: '',
  })

  const filteredRows = rows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.fonKodu.toLowerCase().includes(q) || r.fonAdi.toLowerCase().includes(q)
  })
  const filteredKarmaRows = karmaRows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.karmaNo.toLowerCase().includes(q) || r.aciklama.toLowerCase().includes(q)
  })

  const saveFon = () => {
    if (!fonForm.fonKodu) return alert('Fon Kodu zorunludur.')
    const payload = {
      fonKodu: fonForm.fonKodu,
      fonAdi: fonForm.fonAdi || '-',
      fonTipi: fonForm.fonTipi || '-',
      min: `${fonForm.minOran || '0'}%`,
      max: `${fonForm.maxOran || '0'}%`,
      zorunlu: fonForm.zorunlu || 'Hayır',
      standart: fonForm.standart || 'Hayır',
      devletKatkisi: fonForm.devletKatkisi || 'Hayır',
      katilimEsasli: fonForm.katilimEsasli || 'Hayır',
      fonDurumu: 'Aktif',
      kullanimda: 'Evet',
    }
    setRows((prev) => [...prev, payload])
    setModalOpen(false)
    setFonForm({ fonKodu: '', fonTipi: '', fonAdi: '', katilimEsasli: '', devletKatkisi: '', standart: '', minOran: '0.00', maxOran: '0.00', zorunlu: '' })
  }

  const pill = (value) => (
    <span className={`px-2 py-0.5 rounded text-[11px] border ${value === 'Evet' || value === 'Aktif' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>{value}</span>
  )
  const boolBadge = (value) => (
    <span className={`px-2 py-0.5 rounded text-[11px] border inline-flex items-center gap-1 ${value === 'Evet' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-sky-700 bg-sky-50 border-sky-200'}`}>
      {value === 'Evet' ? '✓' : '×'} {value}
    </span>
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 border-b border-slate-100">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Ürün Yönetimi / Ürün Planları / Plan Detay Sayfası / Fonlar
        </button>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs text-slate-600">
          <div>Branş: <strong>{(urun?.tipler || '').includes('Bireysel Emeklilik') ? 'Bireysel Emeklilik' : '-'}</strong></div>
          <div>Sözleşme Tipi: <strong>{urun?.sozlesmeTipi || '-'}</strong></div>
          <div>Ürün Kodu: <strong>{urun?.id || '-'}</strong></div>
          <div>Plan Kodu: <strong>{plan?.id || '-'}</strong></div>
          <div>Plan Adı: <strong>{plan?.ad || '-'}</strong></div>
          <div>Aktif mi: <strong>Hayır</strong></div>
        </div>
      </div>

      <div className="px-6 pt-3">
        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
          <button type="button" onClick={() => setTab('fonlar')} className={`px-4 h-9 text-sm ${tab === 'fonlar' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}>Fonlar</button>
          <button type="button" onClick={() => setTab('karmalar')} className={`px-4 h-9 text-sm ${tab === 'karmalar' ? 'bg-violet-600 text-white' : 'bg-white text-slate-600'}`}>Fon Karmaları</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tab === 'fonlar' ? (
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <PrimaryButton onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
            </div>
            <div className="overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th>FON KODU</th><th>FON ADI</th><th>FON TİPİ</th><th>MİN %</th><th>MAX %</th><th>ZORUNLU</th><th>STANDART</th><th>DEVLET KATKISI</th><th>KATILIM ESASLI</th><th>FON DURUMU</th><th>KULLANIMDA</th><th className="w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.fonKodu}>
                      <td className="font-semibold">{row.fonKodu}</td>
                      <td>{row.fonAdi}</td>
                      <td>{row.fonTipi}</td>
                      <td>{row.min}</td>
                      <td>{row.max}</td>
                      <td>{pill(row.zorunlu)}</td>
                      <td>{pill(row.standart)}</td>
                      <td>{pill(row.devletKatkisi)}</td>
                      <td>{pill(row.katilimEsasli)}</td>
                      <td>{pill(row.fonDurumu)}</td>
                      <td>{pill(row.kullanimda)}</td>
                      <td className="text-right">
                        <RowActions row={row} actions={FON_DELETE_ACTION} onAction={(key) => {
                          if (key === 'delete' && window.confirm('Fon kaydı silinsin mi?')) setRows((prev) => prev.filter((x) => x.fonKodu !== row.fonKodu))
                        }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !selectedKarma ? (
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <PrimaryButton onClick={() => setKarmaModalOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
            </div>
            <div className="overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead><tr><th>KARMA NO</th><th>AÇIKLAMA</th><th>MP REF KOD</th><th>KATILIM ESASLI</th><th>STANDART</th><th>DEVLET KATKISI</th><th>BAŞLANGIÇ</th><th>RGPF</th><th className="w-12 text-right"></th></tr></thead>
                <tbody>
                  {filteredKarmaRows.map((row) => (
                    <tr key={row.karmaNo}>
                      <td className="font-semibold">{row.karmaNo}</td>
                      <td>{row.aciklama}</td>
                      <td>{row.mpRefKod}</td>
                      <td>{boolBadge(row.katilimEsasli)}</td>
                      <td>{boolBadge(row.standart)}</td>
                      <td>{boolBadge(row.devletKatkisi)}</td>
                      <td>{boolBadge(row.baslangic)}</td>
                      <td>{boolBadge(row.rgpf)}</td>
                      <td className="text-right">
                        <RowActions row={row} actions={FON_KARMA_ACTIONS} onAction={(key) => {
                          if (key === 'delete' && window.confirm('Fon karması silinsin mi?')) {
                            setKarmaRows((prev) => prev.filter((x) => x.karmaNo !== row.karmaNo))
                          }
                          if (key === 'details') setSelectedKarma(row)
                        }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 grid grid-cols-2 md:grid-cols-8 gap-2">
              <div>Karma No: <strong>{selectedKarma.karmaNo}</strong></div>
              <div>Açıklama: <strong>{selectedKarma.aciklama}</strong></div>
              <div>MP Ref Kod: <strong>{selectedKarma.mpRefKod}</strong></div>
              <div>Faizsiz: <strong>{selectedKarma.katilimEsasli}</strong></div>
              <div>Standart: <strong>{selectedKarma.standart}</strong></div>
              <div>Devlet Katkısı: <strong>{selectedKarma.devletKatkisi}</strong></div>
              <div>Başlangıç: <strong>{selectedKarma.baslangic}</strong></div>
              <div>RGPF: <strong>{selectedKarma.rgpf}</strong></div>
            </div>
            <div className="flex justify-end">
              <PrimaryButton onClick={() => setOranModalOpen(true)}>Oranları Güncelle</PrimaryButton>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white overflow-auto">
              <table className="w-full grid-table text-sm">
                <thead><tr><th>FON KODU</th><th>FON AÇIKLAMASI</th><th>FON TİPİ</th><th>KATILIM ESASLI</th><th>MİN. ORAN</th><th>MAX. ORAN</th><th>ORAN</th><th className="w-10"></th></tr></thead>
                <tbody>
                  {karmaDetailRows.map((row) => (
                    <tr key={row.fonKodu}>
                      <td>{row.fonKodu}</td>
                      <td>{row.fonAciklama}</td>
                      <td>{row.fonTipi}</td>
                      <td>
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={row.katilimEsasli} onChange={(e) => setKarmaDetailRows((prev) => prev.map((x) => x.fonKodu === row.fonKodu ? { ...x, katilimEsasli: e.target.checked } : x))} />
                          {row.katilimEsasli ? 'Evet' : 'Hayır'}
                        </label>
                      </td>
                      <td>{row.minOran}</td>
                      <td>{row.maxOran}</td>
                      <td className="text-violet-700 font-semibold">%{row.oran}</td>
                      <td className="text-right"><RowActions row={row} actions={FON_DELETE_ACTION} onAction={(key) => {
                        if (key === 'delete' && window.confirm('Fon satırı silinsin mi?')) setKarmaDetailRows((prev) => prev.filter((x) => x.fonKodu !== row.fonKodu))
                      }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={() => setSelectedKarma(null)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"><ArrowLeft className="w-4 h-4" /> Fon Karmaları Listesine Dön</button>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Fon Ekle"
        size="md"
        footer={<><OutlineButton onClick={() => setModalOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={saveFon}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Fon Kodu</span><select className="form-select" value={fonForm.fonKodu} onChange={(e) => setFonForm((p) => ({ ...p, fonKodu: e.target.value }))}><option value="">Seçiniz</option><option value="FON-006">FON-006</option><option value="FON-007">FON-007</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Fon Tipi</span><input className="form-input" value={fonForm.fonTipi} onChange={(e) => setFonForm((p) => ({ ...p, fonTipi: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Fon Adı</span><input className="form-input" value={fonForm.fonAdi} onChange={(e) => setFonForm((p) => ({ ...p, fonAdi: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Katılım Esaslı</span><input className="form-input" value={fonForm.katilimEsasli} onChange={(e) => setFonForm((p) => ({ ...p, katilimEsasli: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Devlet Katkısı</span><input className="form-input" value={fonForm.devletKatkisi} onChange={(e) => setFonForm((p) => ({ ...p, devletKatkisi: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Standart</span><select className="form-select" value={fonForm.standart} onChange={(e) => setFonForm((p) => ({ ...p, standart: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Min. Oran (0-1)</span><input className="form-input" value={fonForm.minOran} onChange={(e) => setFonForm((p) => ({ ...p, minOran: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Max. Oran (0-1)</span><input className="form-input" value={fonForm.maxOran} onChange={(e) => setFonForm((p) => ({ ...p, maxOran: e.target.value }))} /></label>
          <label className="block md:col-span-2"><span className="block text-sm text-slate-700 mb-1">Zorunlu</span><select className="form-select" value={fonForm.zorunlu} onChange={(e) => setFonForm((p) => ({ ...p, zorunlu: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
        </div>
      </Modal>

      <Modal
        open={karmaModalOpen}
        onClose={() => setKarmaModalOpen(false)}
        title="Fon Karması Ekle"
        size="md"
        footer={<><OutlineButton onClick={() => setKarmaModalOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={() => {
          if (!karmaForm.karmaNo.trim()) return alert('Karma No zorunludur.')
          if (!karmaForm.aciklama.trim()) return alert('Fon Karma Açıklaması zorunludur.')
          setKarmaRows((prev) => [...prev, {
            karmaNo: karmaForm.karmaNo.trim(),
            aciklama: karmaForm.aciklama.trim(),
            mpRefKod: '—',
            katilimEsasli: karmaForm.katilimEsasli || 'Hayır',
            standart: karmaForm.standart || 'Hayır',
            devletKatkisi: karmaForm.devletKatkisi || 'Hayır',
            baslangic: karmaForm.baslangic || 'Hayır',
            rgpf: 'Evet',
          }])
          setKarmaModalOpen(false)
        }}>Kaydet</PrimaryButton></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block md:col-span-1"><span className="block text-sm text-slate-700 mb-1">Karma No</span><input className="form-input bg-slate-50" value={karmaForm.karmaNo} onChange={(e) => setKarmaForm((p) => ({ ...p, karmaNo: e.target.value }))} /></label>
          <div />
          <label className="block md:col-span-2"><span className="block text-sm text-slate-700 mb-1">Fon Karma Açıklaması</span><input className="form-input" placeholder="Açıklama giriniz" value={karmaForm.aciklama} onChange={(e) => setKarmaForm((p) => ({ ...p, aciklama: e.target.value }))} /></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Devlet Katkısı</span><select className="form-select" value={karmaForm.devletKatkisi} onChange={(e) => setKarmaForm((p) => ({ ...p, devletKatkisi: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Katılım Esaslı</span><select className="form-select" value={karmaForm.katilimEsasli} onChange={(e) => setKarmaForm((p) => ({ ...p, katilimEsasli: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Başlangıç</span><select className="form-select" value={karmaForm.baslangic} onChange={(e) => setKarmaForm((p) => ({ ...p, baslangic: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select><span className="text-xs text-slate-400 mt-1 block">OKS planları için özel parametre; bu ekranda düzenlenemez.</span></label>
          <label className="block"><span className="block text-sm text-slate-700 mb-1">Standart</span><select className="form-select" value={karmaForm.standart} onChange={(e) => setKarmaForm((p) => ({ ...p, standart: e.target.value }))}><option value="">Seçiniz</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></select></label>
        </div>
      </Modal>

      <Modal
        open={oranModalOpen}
        onClose={() => setOranModalOpen(false)}
        title="Fon Oranlarını Güncelle"
        size="lg"
        footer={<><OutlineButton onClick={() => setOranModalOpen(false)}>İptal</OutlineButton><PrimaryButton onClick={() => setOranModalOpen(false)}>Güncelle</PrimaryButton></>}
      >
        <div className="overflow-auto">
          <table className="w-full grid-table text-sm">
            <thead><tr><th>FON KODU</th><th>FON AÇIKLAMASI</th><th>FON TİPİ</th><th>KATILIM ESASLI</th><th>MİN. ORAN</th><th>MAX. ORAN</th><th>ORAN (%)</th></tr></thead>
            <tbody>
              {karmaDetailRows.map((row) => (
                <tr key={row.fonKodu}>
                  <td>{row.fonKodu}</td>
                  <td>{row.fonAciklama}</td>
                  <td>{row.fonTipi}</td>
                  <td>{row.katilimEsasli ? 'Evet' : 'Hayır'}</td>
                  <td>{row.minOran}</td>
                  <td>{row.maxOran}</td>
                  <td><input type="number" className="form-input h-9 w-24" value={row.oran} onChange={(e) => setKarmaDetailRows((prev) => prev.map((x) => x.fonKodu === row.fonKodu ? { ...x, oran: Number(e.target.value) } : x))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}

function KatkiPayiTanimlariScreen({ plan, urun, onBack }) {
  const [linked, setLinked] = useState(() => katkiPayiTemplateleri.map(kptToLinkedRow))
  const [catalog, setCatalog] = useState(() => [...katkiPayiTemplateleri])
  const [bindOpen, setBindOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [kayitGoster, setKayitGoster] = useState(10)
  const [modalPageSize, setModalPageSize] = useState(10)
  const [versionsModal, setVersionsModal] = useState({ open: false, title: '', rows: [] })

  const breadcrumb = `${String(urun?.id || '').replace(/-/g, ' ')} PS • ${String(plan?.ad || urun?.ad || '').replace(/\s*-\s*/g, ' ').trim()}`

  const selectTemplate = (raw) => {
    const row = kptToLinkedRow(raw)
    if (linked.some((l) => l.rowKey === row.rowKey)) {
      alert('Bu KP şablonu zaten bağlı.')
      return
    }
    setLinked((prev) => [...prev, row])
  }

  const openVersionsForKod = (kod) => {
    const rows = KP_TEMPLATE_VERSIONS_BY_KOD[kod] || []
    setVersionsModal({
      open: true,
      title: `${kod} — Versiyonlar`,
      rows,
    })
  }

  const handleRowAction = (key, row, fromCatalog) => {
    if (key === 'history') {
      openVersionsForKod(row.kpTemplateKodu)
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Kayıt silinsin mi?')) return
      if (fromCatalog) {
        setCatalog((prev) => prev.filter((x) => !(x.kpTemplateKodu === row.kpTemplateKodu && String(x.versiyon) === String(row.versiyon))))
      } else {
        setLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
      }
    }
  }

  const linkedSlice = linked.slice(0, kayitGoster)
  const linkedRange = linked.length ? `1-${Math.min(linked.length, kayitGoster)}/${linked.length}` : '0/0'

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onBack} className="mt-0.5 text-slate-500 hover:text-slate-700"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Katkı Payı</h2>
            <div className="text-xs text-slate-500 mt-0.5">{breadcrumb}</div>
          </div>
        </div>
        <div className="min-w-[140px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide text-right">Tamamlanma</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500" style={{ width: '20%' }} /></div>
          <div className="text-xs text-slate-600 text-right mt-1">%20 2/6</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/40">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Bağlı Katkı Payı Templateleri</h3>
            <PrimaryButton onClick={() => setBindOpen(true)}>KP Template Bağla</PrimaryButton>
          </div>
          <div className="overflow-auto">
            <table className="w-full grid-table text-xs">
              <thead>
                <tr>
                  <th>KP Template Kodu</th>
                  <th>Adı</th>
                  <th>Versiyon</th>
                  <th>Katkı Payı Tutarı</th>
                  <th>Başlangıç Kapitali</th>
                  <th>Giriş Fon Büyüklüğü</th>
                  <th>Döviz Türü(KP)</th>
                  <th>Ödeme Periyodu</th>
                  <th>Azami KP</th>
                  <th>Döviz Türü(Diğer)</th>
                  <th>Oluşturan</th>
                  <th>Oluşturma Tarihi</th>
                  <th>Güncelleyen</th>
                  <th>Güncelleme Tarihi</th>
                  <th className="text-right">Liste İşlemleri</th>
                </tr>
              </thead>
              <tbody>
                {linkedSlice.map((row) => (
                  <tr key={row.rowKey}>
                    <td className="font-semibold">{row.kpTemplateKodu}</td>
                    <td>{row.adi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.katkiPayiTutari}</td>
                    <td>{row.baslangicKapitali}</td>
                    <td>{row.girisFonBuyuklugu}</td>
                    <td>{row.dovizKp}</td>
                    <td>{row.odemePeriyodu}</td>
                    <td>{row.azamiKp}</td>
                    <td>{row.dovizDiger}</td>
                    <td>{row.olusturan}</td>
                    <td>{row.olusturulmaTarihi}</td>
                    <td>{row.guncelleyen}</td>
                    <td>{row.guncellemeTarihi}</td>
                    <td className="text-right">
                      <RowActions row={row} actions={KP_TEMPLATE_ROW_ACTIONS} onAction={(key, r) => handleRowAction(key, r, false)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <label className="inline-flex items-center gap-2">
              Kayıt Göster
              <select className="form-select h-8 py-0 text-xs min-w-[4rem]" value={kayitGoster} onChange={(e) => setKayitGoster(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
            <span>{linkedRange}</span>
          </div>
        </div>
      </div>

      <Modal
        open={bindOpen}
        onClose={() => setBindOpen(false)}
        title="Katkı Payı Templateleri"
        description="KP template tanımlarının listelendiği, filtrelenip sıralandığı ekrandır."
        size="xl"
        footer={null}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
            <span className="text-sm font-medium text-slate-700">Filtre Seçenekleri</span>
            <button type="button" className="text-sm text-violet-600 font-medium" onClick={() => setFilterOpen((v) => !v)}>{filterOpen ? 'Gizle' : 'Göster'}</button>
          </div>
          {filterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <input className="form-input" placeholder="KP Template Kodu" />
              <input className="form-input" placeholder="Adı" />
              <select className="form-select"><option value="">Ödeme Periyodu</option><option>Aylık</option><option>Yıllık</option></select>
            </div>
          )}
          <div className="overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full grid-table text-xs">
              <thead>
                <tr>
                  <th>KP Template Kodu</th>
                  <th>Adı</th>
                  <th>Versiyon</th>
                  <th>Katkı Payı Tutarı</th>
                  <th>Başlangıç Kapitali</th>
                  <th>Giriş Fon Büyüklüğü</th>
                  <th>Doviz Türü(KP)</th>
                  <th>Ödeme Periyodu</th>
                  <th>Azami KP</th>
                  <th>Doviz Türü(Diğer)</th>
                  <th>Oluşturan</th>
                  <th>Oluşturulma Tarihi</th>
                  <th>Seç</th>
                  <th className="text-right">Liste İşlemleri</th>
                </tr>
              </thead>
              <tbody>
                {catalog.slice(0, modalPageSize).map((t) => (
                  <tr
                    key={`${t.kpTemplateKodu}-${t.versiyon}`}
                    className="cursor-pointer hover:bg-slate-50/80"
                    onDoubleClick={() => selectTemplate(t)}
                  >
                    <td className="font-semibold">{t.kpTemplateKodu}</td>
                    <td>{t.adi}</td>
                    <td>{t.versiyon}</td>
                    <td>{t.katkiPayiTutari}</td>
                    <td>{t.baslangicKapitali}</td>
                    <td>{t.girisFonBuyuklugu}</td>
                    <td>{t.dovizKp}</td>
                    <td>{t.odemePeriyodu}</td>
                    <td>{t.azamiKp}</td>
                    <td>{t.dovizDiger}</td>
                    <td>{t.olusturan}</td>
                    <td>{t.olusturulmaTarihi}</td>
                    <td>
                      <OutlineButton className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); selectTemplate(t) }}>Seç</OutlineButton>
                    </td>
                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                      <RowActions row={t} actions={KP_TEMPLATE_ROW_ACTIONS} onAction={(key, r) => handleRowAction(key, r, true)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <label className="inline-flex items-center gap-2">
              Sayfa başına
              <select className="form-select h-8 py-0 text-xs min-w-[4rem]" value={modalPageSize} onChange={(e) => setModalPageSize(Number(e.target.value))}>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </label>
            <span>Toplam {catalog.length} kayıt</span>
          </div>
          <div className="flex justify-end pt-2">
            <OutlineButton onClick={() => setBindOpen(false)}>Kapat</OutlineButton>
          </div>
        </div>
      </Modal>

      <Modal
        open={versionsModal.open}
        onClose={() => setVersionsModal({ open: false, title: '', rows: [] })}
        title={versionsModal.title}
        footer={<PrimaryButton onClick={() => setVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {versionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Oluşturulma</th><th>Oluşturan</th></tr></thead>
            <tbody>
              {versionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.olusturulma}</td>
                  <td>{v.olusturan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Bu şablon için versiyon kaydı yok.</p>
        )}
      </Modal>
    </div>
  )
}

function KesintilerScreen({ plan, urun, onBack }) {
  const [menuKey, setMenuKey] = useState('girisAidati')
  const [gaLinked, setGaLinked] = useState(() => GA_LINKED_INITIAL.map((x) => ({ ...x })))
  const [gaCatalog] = useState(() => GA_CATALOG_ALL.map((x) => ({ ...x })))
  const [gaBindOpen, setGaBindOpen] = useState(false)
  const [gaCatSearch, setGaCatSearch] = useState('')
  const [gaMainSearch, setGaMainSearch] = useState('')
  const [gaInspectRow, setGaInspectRow] = useState(null)

  const [ygkLinked, setYgkLinked] = useState(() => YGK_LINKED_INITIAL.map((x) => ({ ...x })))
  const [ygkCatalog] = useState(() => YGK_CATALOG_ALL.map((x) => ({ ...x })))
  const [ygkBindOpen, setYgkBindOpen] = useState(false)
  const [ygkCatSearch, setYgkCatSearch] = useState('')
  const [ygkMainSearch, setYgkMainSearch] = useState('')
  const [ygkInspectRow, setYgkInspectRow] = useState(null)
  const [ygkVersionsModal, setYgkVersionsModal] = useState({ open: false, title: '', rows: [] })

  const [ygkMuafLinked, setYgkMuafLinked] = useState(() => YGK_MUAF_LINKED_INITIAL.map((x) => ({ ...x })))
  const [ygkMuafCatalog] = useState(() => YGK_MUAF_CATALOG_ALL.map((x) => ({ ...x })))
  const [ygkMuafBindOpen, setYgkMuafBindOpen] = useState(false)
  const [ygkMuafCatSearch, setYgkMuafCatSearch] = useState('')
  const [ygkMuafMainSearch, setYgkMuafMainSearch] = useState('')
  const [ygkMuafInspectRow, setYgkMuafInspectRow] = useState(null)
  const [ygkMuafVersionsModal, setYgkMuafVersionsModal] = useState({ open: false, title: '', rows: [] })

  const [araVermeLinked, setAraVermeLinked] = useState(() => ARA_VERME_LINKED_INITIAL.map((x) => ({ ...x })))
  const [araVermeCatalog] = useState(() => ARA_VERME_CATALOG_ALL.map((x) => ({ ...x })))
  const [araVermeBindOpen, setAraVermeBindOpen] = useState(false)
  const [araVermeCatSearch, setAraVermeCatSearch] = useState('')
  const [araVermeMainSearch, setAraVermeMainSearch] = useState('')
  const [araVermeInspectRow, setAraVermeInspectRow] = useState(null)
  const [araVermeVersionsModal, setAraVermeVersionsModal] = useState({ open: false, title: '', rows: [] })

  const [kesintiBes30Linked, setKesintiBes30Linked] = useState(() => KESINTI_BES30_LINKED_INITIAL.map((x) => ({ ...x })))
  const [kesintiBes30Catalog] = useState(() => KESINTI_BES30_CATALOG_ALL.map((x) => ({ ...x })))
  const [kesintiBes30BindOpen, setKesintiBes30BindOpen] = useState(false)
  const [kesintiBes30CatSearch, setKesintiBes30CatSearch] = useState('')
  const [kesintiBes30MainSearch, setKesintiBes30MainSearch] = useState('')
  const [kesintiBes30InspectRow, setKesintiBes30InspectRow] = useState(null)
  const [kesintiBes30VersionsModal, setKesintiBes30VersionsModal] = useState({ open: false, title: '', rows: [] })

  const [ygkBes30Linked, setYgkBes30Linked] = useState(() => YGK_BES30_LINKED_INITIAL.map((x) => ({ ...x })))
  const [ygkBes30Catalog] = useState(() => YGK_BES30_CATALOG_ALL.map((x) => ({ ...x })))
  const [ygkBes30BindOpen, setYgkBes30BindOpen] = useState(false)
  const [ygkBes30CatSearch, setYgkBes30CatSearch] = useState('')
  const [ygkBes30MainSearch, setYgkBes30MainSearch] = useState('')
  const [ygkBes30InspectRow, setYgkBes30InspectRow] = useState(null)
  const [ygkBes30VersionsModal, setYgkBes30VersionsModal] = useState({ open: false, title: '', rows: [] })
  const [ygkBes30DetailsRow, setYgkBes30DetailsRow] = useState(null)
  const [ygkBes30DetailsTab, setYgkBes30DetailsTab] = useState('muafiyet')
  const [ygkBes30DetailsMuafSearch, setYgkBes30DetailsMuafSearch] = useState('')

  const branchLabel = (urun?.tipler || '').toLowerCase().includes('bireysel emeklilik') ? 'Bireysel Emeklilik' : '-'

  const filteredGaCatalog = gaCatalog.filter((r) => {
    if (!gaCatSearch.trim()) return true
    const q = gaCatSearch.toLowerCase()
    return [r.gaKodu, r.doviz, r.gaTipi].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredGaLinked = gaLinked.filter((r) => {
    if (!gaMainSearch.trim()) return true
    const q = gaMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredYgkCatalog = ygkCatalog.filter((r) => {
    if (!ygkCatSearch.trim()) return true
    const q = ygkCatSearch.toLowerCase()
    return [r.ygkKodu, r.ygkAdi, r.doviz].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredYgkLinked = ygkLinked.filter((r) => {
    if (!ygkMainSearch.trim()) return true
    const q = ygkMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredYgkMuafCatalog = ygkMuafCatalog.filter((r) => {
    if (!ygkMuafCatSearch.trim()) return true
    const q = ygkMuafCatSearch.toLowerCase()
    return [r.muafKodu, r.muafAdi, r.doviz].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredYgkMuafLinked = ygkMuafLinked.filter((r) => {
    if (!ygkMuafMainSearch.trim()) return true
    const q = ygkMuafMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredAraVermeCatalog = araVermeCatalog.filter((r) => {
    if (!araVermeCatSearch.trim()) return true
    const q = araVermeCatSearch.toLowerCase()
    return [r.avKodu, r.avAdi, r.tutar].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredAraVermeLinked = araVermeLinked.filter((r) => {
    if (!araVermeMainSearch.trim()) return true
    const q = araVermeMainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredKesintiBes30Catalog = kesintiBes30Catalog.filter((r) => {
    if (!kesintiBes30CatSearch.trim()) return true
    const q = kesintiBes30CatSearch.toLowerCase()
    return [r.kbKodu, r.kbAdi, r.yil, r.maxKesintiOrani].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredKesintiBes30Linked = kesintiBes30Linked.filter((r) => {
    if (!kesintiBes30MainSearch.trim()) return true
    const q = kesintiBes30MainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const filteredYgkBes30Catalog = ygkBes30Catalog.filter((r) => {
    if (!ygkBes30CatSearch.trim()) return true
    const q = ygkBes30CatSearch.toLowerCase()
    return [r.ybKodu, r.ybAdi, r.doviz, r.ygkKesintiTipi].some((s) => String(s).toLowerCase().includes(q))
  })

  const filteredYgkBes30Linked = ygkBes30Linked.filter((r) => {
    if (!ygkBes30MainSearch.trim()) return true
    const q = ygkBes30MainSearch.toLowerCase()
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q))
  })

  const ygkBes30MuafBandsFiltered = (() => {
    const row = ygkBes30DetailsRow
    if (!row) return []
    const bands = YGK_BES30_MUAF_BANDS_BY_KOD[row.ybKodu] || []
    const q = ygkBes30DetailsMuafSearch.trim().toLowerCase()
    if (!q) return bands
    return bands.filter((b) => [b.minTutar, b.maxTutar, b.oran, b.tutar].some((s) => String(s).toLowerCase().includes(q)))
  })()

  useEffect(() => {
    if (!ygkBes30DetailsRow) setYgkBes30DetailsMuafSearch('')
  }, [ygkBes30DetailsRow])

  const addGaFromCatalog = (row) => {
    if (gaLinked.some((l) => l.gaKodu === row.gaKodu)) {
      alert('Bu GA şablonu planda zaten bağlı.')
      return
    }
    setGaLinked((prev) => [...prev, { ...row }])
    setGaBindOpen(false)
  }

  const addYgkFromCatalog = (row) => {
    const rowKey = `${row.ygkKodu}-${row.versiyon}`
    if (ygkLinked.some((l) => l.rowKey === rowKey)) {
      alert('Bu YGK şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setYgkLinked((prev) => [...prev, { ...row, rowKey }])
    setYgkBindOpen(false)
  }

  const addYgkMuafFromCatalog = (row) => {
    const rowKey = `${row.muafKodu}-${row.versiyon}`
    if (ygkMuafLinked.some((l) => l.rowKey === rowKey)) {
      alert('Bu muafiyet şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setYgkMuafLinked((prev) => [...prev, {
      rowKey,
      muafKodu: row.muafKodu,
      muafAdi: row.muafAdi,
      versiyon: row.versiyon,
      yil: row.yil,
      toplamOdenmisKp: row.toplamOdenmisKp,
      doviz: row.doviz,
      oran: row.oran,
    }])
    setYgkMuafBindOpen(false)
  }

  const addAraVermeFromCatalog = (row) => {
    const rowKey = `${row.avKodu}-${row.versiyon}`
    if (araVermeLinked.some((l) => l.rowKey === rowKey)) {
      alert('Bu ara verme şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setAraVermeLinked((prev) => [...prev, {
      rowKey,
      avKodu: row.avKodu,
      avAdi: row.avAdi,
      versiyon: row.versiyon,
      tutar: row.tutar,
      hesaplamaKurali: row.hesaplamaKurali,
      onKosul: row.onKosul,
    }])
    setAraVermeBindOpen(false)
  }

  const addKesintiBes30FromCatalog = (row) => {
    const rowKey = `${row.kbKodu}-${row.versiyon}`
    if (kesintiBes30Linked.some((l) => l.rowKey === rowKey)) {
      alert('Bu Kesinti BES3.0 şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    setKesintiBes30Linked((prev) => [...prev, {
      rowKey,
      kbKodu: row.kbKodu,
      kbAdi: row.kbAdi,
      versiyon: row.versiyon,
      yil: row.yil,
      maxKesintiOrani: row.maxKesintiOrani,
      maxKesintiTutari: row.maxKesintiTutari,
    }])
    setKesintiBes30BindOpen(false)
  }

  const addYgkBes30FromCatalog = (row) => {
    const rowKey = `${row.ybKodu}-${row.versiyon}`
    if (ygkBes30Linked.some((l) => l.rowKey === rowKey)) {
      alert('Bu YGK BES3.0 şablonu bu versiyonla planda zaten bağlı.')
      return
    }
    const y = String(row.sozlesmeYili || '')
    const sozlesmeYiliAraligi = y.includes('-') ? y : `${y}-${y}`
    setYgkBes30Linked((prev) => [...prev, {
      rowKey,
      ybKodu: row.ybKodu,
      ybAdi: row.ybAdi,
      versiyon: row.versiyon,
      dovizKodu: row.doviz,
      ygkKesintiTipi: row.ygkKesintiTipi,
      oran: row.oran,
      yillikTutar: row.yillikTutar,
      ygkFormulu: row.ygkFormulu,
      kesintiDonemi: row.kesintiDonemi,
      sozlesmeYiliAraligi,
      birikim: row.birikim,
      gecerlilikTarihi: row.gecerlilikTarihi,
      birikimTipi: row.birikimTipi,
    }])
    setYgkBes30BindOpen(false)
  }

  const handleGaRowAction = (key, row) => {
    if (key === 'view') setGaInspectRow(row)
    if (key === 'remove' && window.confirm('Bu giriş aidatı bağlantısı çıkarılsın mı?')) {
      setGaLinked((prev) => prev.filter((x) => x.gaKodu !== row.gaKodu))
    }
  }

  const handleYgkRowAction = (key, row) => {
    if (key === 'view') setYgkInspectRow(row)
    if (key === 'remove' && window.confirm('Bu YGK bağlantısı çıkarılsın mı?')) {
      setYgkLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = YGK_VERSIONS_BY_KOD[row.ygkKodu] || []
      setYgkVersionsModal({ open: true, title: `${row.ygkKodu} — Versiyonlar`, rows })
    }
  }

  const handleYgkMuafRowAction = (key, row) => {
    if (key === 'view') setYgkMuafInspectRow(row)
    if (key === 'delete' && window.confirm('Bu muafiyet kaydı silinsin mi?')) {
      setYgkMuafLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = YGK_MUAF_VERSIONS_BY_KOD[row.muafKodu] || []
      setYgkMuafVersionsModal({ open: true, title: `${row.muafKodu} — Versiyonlar`, rows })
    }
  }

  const handleAraVermeRowAction = (key, row) => {
    if (key === 'view') setAraVermeInspectRow(row)
    if (key === 'delete' && window.confirm('Bu ara verme kaydı silinsin mi?')) {
      setAraVermeLinked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = ARA_VERME_VERSIONS_BY_KOD[row.avKodu] || []
      setAraVermeVersionsModal({ open: true, title: `${row.avKodu} — Versiyonlar`, rows })
    }
  }

  const handleKesintiBes30RowAction = (key, row) => {
    if (key === 'view') setKesintiBes30InspectRow(row)
    if (key === 'remove' && window.confirm('Bu Kesinti BES3.0 bağlantısı çıkarılsın mı?')) {
      setKesintiBes30Linked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
    }
    if (key === 'history') {
      const rows = KESINTI_BES30_VERSIONS_BY_KOD[row.kbKodu] || []
      setKesintiBes30VersionsModal({ open: true, title: `${row.kbKodu} — Versiyonlar`, rows })
    }
  }

  const handleYgkBes30RowAction = (key, row) => {
    if (key === 'view') setYgkBes30InspectRow(row)
    if (key === 'remove' && window.confirm('Bu YGK BES3.0 bağlantısı çıkarılsın mı?')) {
      setYgkBes30Linked((prev) => prev.filter((x) => x.rowKey !== row.rowKey))
      setYgkBes30DetailsRow((d) => (d?.rowKey === row.rowKey ? null : d))
    }
    if (key === 'history') {
      const rows = YGK_BES30_VERSIONS_BY_KOD[row.ybKodu] || []
      setYgkBes30VersionsModal({ open: true, title: `${row.ybKodu} — Versiyonlar`, rows })
    }
    if (key === 'details') {
      setYgkBes30DetailsTab('muafiyet')
      setYgkBes30DetailsMuafSearch('')
      setYgkBes30DetailsRow(row)
    }
  }

  const ygkSifirlaCell = (v) => (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded border text-xs ${v ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>{v ? '✓' : '×'}</span>
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-500 shrink-0">
        <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <span>Ürün Yönetimi / Ürün Planları / Plan Detay Sayfası / Kesintiler</span>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="text-sm font-semibold text-slate-800 leading-tight">{plan?.ad || 'Plan'}</div>
            <div className="text-[11px] text-slate-500 mt-1">Plan Kodu: <span className="font-mono text-slate-700">{plan?.id || '—'}</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Branş: <span className="text-slate-700">{branchLabel}</span></div>
            <div className="text-[11px] text-slate-500">Sözleşme Tipi: <span className="text-slate-700">{urun?.sozlesmeTipi || '—'}</span></div>
          </div>
          <nav className="flex-1 overflow-auto py-2">
            {KESINTI_MENU_KEYS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMenuKey(item.id)}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between gap-2 ${menuKey === item.id ? 'bg-violet-50 text-violet-800 font-medium' : 'text-slate-700 hover:bg-white'}`}
              >
                {item.label}
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          {menuKey === 'girisAidati' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={gaMainSearch} onChange={(e) => setGaMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setGaBindOpen(true)}>GA Template Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>GA Kodu</th>
                        <th>Döviz</th>
                        <th>GA Tipi</th>
                        <th>Taksit Tipi</th>
                        <th>Taksit Adedi</th>
                        <th>Peşinat</th>
                        <th>Taksit</th>
                        <th>Erteleme</th>
                        <th>Toplam Tutar</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGaLinked.map((row) => (
                        <tr key={row.gaKodu}>
                          <td className="font-semibold">{row.gaKodu}</td>
                          <td>{row.doviz}</td>
                          <td>{row.gaTipi}</td>
                          <td>{row.taksitTipi}</td>
                          <td>{row.taksitAdedi}</td>
                          <td>{row.pesinat}</td>
                          <td>{row.taksit}</td>
                          <td>{row.erteleme}</td>
                          <td>{row.toplamTutar}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={GA_ROW_ACTIONS} onAction={handleGaRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'ygkParam' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={ygkMainSearch} onChange={(e) => setYgkMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setYgkBindOpen(true)}>YGK Template Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-xs">
                    <thead>
                      <tr>
                        <th>YGK Kodu</th>
                        <th>Geçerlilik Tarihi</th>
                        <th>Döviz</th>
                        <th>Tablo Tipi</th>
                        <th>YGK Adı</th>
                        <th>Versiyon</th>
                        <th>Yıl Tipi</th>
                        <th>Limit Tutar Tipi</th>
                        <th>Kademe Tipi</th>
                        <th>Yıl Bazında Sıfırla</th>
                        <th>YGK Hesaplama Kuralı</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYgkLinked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.ygkKodu}</td>
                          <td>{row.gecerlilikTarihi}</td>
                          <td>{row.doviz}</td>
                          <td>{row.tabloTipi}</td>
                          <td className="font-medium">{row.ygkAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.yilTipi}</td>
                          <td>{row.limitTutarTipi}</td>
                          <td>{row.kademeTipi}</td>
                          <td>{ygkSifirlaCell(row.yilBazindaSifirla)}</td>
                          <td>{row.ygkHesaplamaKurali}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={YGK_ROW_ACTIONS} onAction={handleYgkRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'ygkMuafiyet' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={ygkMuafMainSearch} onChange={(e) => setYgkMuafMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setYgkMuafBindOpen(true)}>Muafiyet Template Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>YGK Muafiyet Kodu</th>
                        <th>YGK Muafiyet Adı</th>
                        <th>Versiyon</th>
                        <th>Yıl</th>
                        <th>Toplam Ödenmiş Kp</th>
                        <th>Döviz</th>
                        <th>YGK Muafiyet Oranı</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYgkMuafLinked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.muafKodu}</td>
                          <td>{row.muafAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.yil}</td>
                          <td>{row.toplamOdenmisKp}</td>
                          <td>{row.doviz}</td>
                          <td>{row.oran}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={YGK_MUAF_ROW_ACTIONS} onAction={handleYgkMuafRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'araVerme' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={araVermeMainSearch} onChange={(e) => setAraVermeMainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setAraVermeBindOpen(true)}>Ara Verme Template&apos;i Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>Ara Verme Kodu</th>
                        <th>Ara Verme Adı</th>
                        <th>Versiyon</th>
                        <th>Tutar</th>
                        <th>Hesaplama Kuralı</th>
                        <th>Ön Koşul</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAraVermeLinked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.avKodu}</td>
                          <td>{row.avAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.tutar}</td>
                          <td>{row.hesaplamaKurali}</td>
                          <td>{row.onKosul}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={ARA_VERME_ROW_ACTIONS} onAction={handleAraVermeRowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'kesintiBes30' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={kesintiBes30MainSearch} onChange={(e) => setKesintiBes30MainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setKesintiBes30BindOpen(true)}>Kesinti BES3.0 Templatı Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>Kesinti BES3.0 Kodu</th>
                        <th>Kesinti BES3.0 Adı</th>
                        <th>Versiyon</th>
                        <th>Yıl</th>
                        <th>Max Kesinti Oranı</th>
                        <th>Max Kesinti Tutarı</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKesintiBes30Linked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.kbKodu}</td>
                          <td>{row.kbAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.yil}</td>
                          <td>{row.maxKesintiOrani}</td>
                          <td>{row.maxKesintiTutari}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={KESINTI_BES30_ROW_ACTIONS} onAction={handleKesintiBes30RowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : menuKey === 'ygkBes30' ? (
            <>
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ara..." value={ygkBes30MainSearch} onChange={(e) => setYgkBes30MainSearch(e.target.value)} />
                </div>
                <PrimaryButton onClick={() => setYgkBes30BindOpen(true)}>YGK BES3.0 Templatı Bağla</PrimaryButton>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="overflow-auto border border-slate-200 rounded-lg">
                  <table className="w-full grid-table text-sm min-w-[1100px]">
                    <thead>
                      <tr>
                        <th>YGK BES3.0 Kodu</th>
                        <th>YGK BES3.0 Adı</th>
                        <th>Versiyon</th>
                        <th>Döviz Kodu</th>
                        <th>YGK Kesinti Tipi</th>
                        <th>Oran</th>
                        <th>Yıllık Tutar</th>
                        <th>YGK Formülü</th>
                        <th>Kesinti Dönemi</th>
                        <th>Sözleşme Yılı Aralığı</th>
                        <th>Birikim</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYgkBes30Linked.map((row) => (
                        <tr key={row.rowKey}>
                          <td className="font-semibold">{row.ybKodu}</td>
                          <td>{row.ybAdi}</td>
                          <td>{row.versiyon}</td>
                          <td>{row.dovizKodu}</td>
                          <td>{row.ygkKesintiTipi}</td>
                          <td>{row.oran}</td>
                          <td>{row.yillikTutar}</td>
                          <td>{row.ygkFormulu}</td>
                          <td>{row.kesintiDonemi}</td>
                          <td>{row.sozlesmeYiliAraligi}</td>
                          <td>{row.birikim}</td>
                          <td className="text-right">
                            <RowActions row={row} actions={YGK_BES30_ROW_ACTIONS} onAction={handleYgkBes30RowAction} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-sm text-slate-500">
              Bu kesinti bölümü henüz tanımlanmadı.
            </div>
          )}
        </main>
      </div>

      <Modal
        open={gaBindOpen}
        onClose={() => setGaBindOpen(false)}
        title="Giriş Aidatı Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setGaBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="GA kodu, döviz veya tip ile ara..."
              value={gaCatSearch}
              onChange={(e) => setGaCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>GA Kodu</th>
                  <th>Doviz</th>
                  <th>GA Tipi</th>
                  <th>Taksit Tipi</th>
                  <th>Taksit Adedi</th>
                  <th>Peşinat</th>
                  <th>Taksit</th>
                  <th>Erteleme</th>
                  <th>Toplam Tutar</th>
                </tr>
              </thead>
              <tbody>
                {filteredGaCatalog.map((row) => (
                  <tr
                    key={row.gaKodu}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addGaFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.gaKodu}</td>
                    <td>{row.doviz}</td>
                    <td>{row.gaTipi}</td>
                    <td>{row.taksitTipi}</td>
                    <td>{row.taksitAdedi}</td>
                    <td>{row.pesinat}</td>
                    <td>{row.taksit}</td>
                    <td>{row.erteleme}</td>
                    <td>{row.toplamTutar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={ygkBindOpen}
        onClose={() => setYgkBindOpen(false)}
        title="YGK Parametreleri Detayları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setYgkBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="YGK kodu, ad veya döviz ile ara..."
              value={ygkCatSearch}
              onChange={(e) => setYgkCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-xs">
              <thead>
                <tr>
                  <th>YGK Kodu</th>
                  <th>YGK Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Döviz</th>
                  <th>Tablo Tipi</th>
                  <th>Yıl Tipi</th>
                  <th>Limit Tutar Tipi</th>
                  <th>YGK Hesaplama Kuralı</th>
                  <th>Kademe Tipi</th>
                  <th>Yıl Bazında Sıfırla</th>
                </tr>
              </thead>
              <tbody>
                {filteredYgkCatalog.map((row) => (
                  <tr
                    key={`${row.ygkKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addYgkFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.ygkKodu}</td>
                    <td>{row.ygkAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.doviz}</td>
                    <td>{row.tabloTipi}</td>
                    <td>{row.yilTipi}</td>
                    <td>{row.limitTutarTipi}</td>
                    <td>{row.ygkHesaplamaKurali}</td>
                    <td>{row.kademeTipi}</td>
                    <td>{ygkSifirlaCell(row.yilBazindaSifirla)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(gaInspectRow)}
        onClose={() => setGaInspectRow(null)}
        title={gaInspectRow ? `İncele — ${gaInspectRow.gaKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setGaInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {gaInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(gaInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={Boolean(ygkInspectRow)}
        onClose={() => setYgkInspectRow(null)}
        title={ygkInspectRow ? `İncele — ${ygkInspectRow.ygkKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setYgkInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {ygkInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(ygkInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{typeof v === 'boolean' ? (v ? 'Evet' : 'Hayır') : String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={ygkVersionsModal.open}
        onClose={() => setYgkVersionsModal({ open: false, title: '', rows: [] })}
        title={ygkVersionsModal.title}
        footer={<PrimaryButton onClick={() => setYgkVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {ygkVersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {ygkVersionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Versiyon kaydı yok.</p>
        )}
      </Modal>

      <Modal
        open={ygkMuafBindOpen}
        onClose={() => setYgkMuafBindOpen(false)}
        title="YGK Muafiyet Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setYgkMuafBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Muafiyet kodu, ad veya döviz ile ara..."
              value={ygkMuafCatSearch}
              onChange={(e) => setYgkMuafCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>YGK Muafiyet Kodu</th>
                  <th>YGK Muafiyet Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Yıl</th>
                  <th>Toplam Ödenmiş Kp</th>
                  <th>Döviz</th>
                  <th>YGK Muafiyet Oranı</th>
                </tr>
              </thead>
              <tbody>
                {filteredYgkMuafCatalog.map((row) => (
                  <tr
                    key={`${row.muafKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addYgkMuafFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.muafKodu}</td>
                    <td>{row.muafAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.yil}</td>
                    <td>{row.toplamOdenmisKp}</td>
                    <td>{row.doviz}</td>
                    <td>{row.oran}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(ygkMuafInspectRow)}
        onClose={() => setYgkMuafInspectRow(null)}
        title={ygkMuafInspectRow ? `İncele — ${ygkMuafInspectRow.muafKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setYgkMuafInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {ygkMuafInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(ygkMuafInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={ygkMuafVersionsModal.open}
        onClose={() => setYgkMuafVersionsModal({ open: false, title: '', rows: [] })}
        title={ygkMuafVersionsModal.title}
        footer={<PrimaryButton onClick={() => setYgkMuafVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {ygkMuafVersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {ygkMuafVersionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Versiyon kaydı yok.</p>
        )}
      </Modal>

      <Modal
        open={araVermeBindOpen}
        onClose={() => setAraVermeBindOpen(false)}
        title="Ara Verme Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setAraVermeBindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Ara verme kodu, ad veya tutar ile ara..."
              value={araVermeCatSearch}
              onChange={(e) => setAraVermeCatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Ara Verme Kodu</th>
                  <th>Ara Verme Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Tutar</th>
                  <th>Hesaplama Kuralı</th>
                  <th>Ön Koşul</th>
                </tr>
              </thead>
              <tbody>
                {filteredAraVermeCatalog.map((row) => (
                  <tr
                    key={`${row.avKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addAraVermeFromCatalog(row)}
                  >
                    <td className="font-semibold">{row.avKodu}</td>
                    <td>{row.avAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.tutar}</td>
                    <td>{row.hesaplamaKurali}</td>
                    <td>{row.onKosul}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(araVermeInspectRow)}
        onClose={() => setAraVermeInspectRow(null)}
        title={araVermeInspectRow ? `İncele — ${araVermeInspectRow.avKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setAraVermeInspectRow(null)}>Tamam</PrimaryButton>}
      >
        {araVermeInspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(araVermeInspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={araVermeVersionsModal.open}
        onClose={() => setAraVermeVersionsModal({ open: false, title: '', rows: [] })}
        title={araVermeVersionsModal.title}
        footer={<PrimaryButton onClick={() => setAraVermeVersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {araVermeVersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {araVermeVersionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Versiyon kaydı yok.</p>
        )}
      </Modal>

      <Modal
        open={kesintiBes30BindOpen}
        onClose={() => setKesintiBes30BindOpen(false)}
        title="Kesinti BES3.0 Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setKesintiBes30BindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Kod, ad, yıl veya oran ile ara..."
              value={kesintiBes30CatSearch}
              onChange={(e) => setKesintiBes30CatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Kesinti BES3.0 Kodu</th>
                  <th>Kesinti BES3.0 Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Yıl</th>
                  <th>Max Kesinti Oranı</th>
                  <th>Max Kesinti Tutarı</th>
                </tr>
              </thead>
              <tbody>
                {filteredKesintiBes30Catalog.map((row) => (
                  <tr
                    key={`${row.kbKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addKesintiBes30FromCatalog(row)}
                  >
                    <td className="font-semibold">{row.kbKodu}</td>
                    <td>{row.kbAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.yil}</td>
                    <td>{row.maxKesintiOrani}</td>
                    <td>{row.maxKesintiTutari}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(kesintiBes30InspectRow)}
        onClose={() => setKesintiBes30InspectRow(null)}
        title={kesintiBes30InspectRow ? `İncele — ${kesintiBes30InspectRow.kbKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setKesintiBes30InspectRow(null)}>Tamam</PrimaryButton>}
      >
        {kesintiBes30InspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(kesintiBes30InspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={kesintiBes30VersionsModal.open}
        onClose={() => setKesintiBes30VersionsModal({ open: false, title: '', rows: [] })}
        title={kesintiBes30VersionsModal.title}
        footer={<PrimaryButton onClick={() => setKesintiBes30VersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {kesintiBes30VersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {kesintiBes30VersionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Versiyon kaydı yok.</p>
        )}
      </Modal>

      <Modal
        open={ygkBes30BindOpen}
        onClose={() => setYgkBes30BindOpen(false)}
        title="YGK BES3.0 Parametre Tanımları"
        description="Plan listesine eklemek için bir satıra çift tıklayın."
        size="xl"
        footer={<OutlineButton onClick={() => setYgkBes30BindOpen(false)}>Kapat</OutlineButton>}
      >
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Kod, ad, döviz veya kesinti tipi ile ara..."
              value={ygkBes30CatSearch}
              onChange={(e) => setYgkBes30CatSearch(e.target.value)}
            />
          </div>
          <div className="overflow-auto border border-slate-200 rounded-lg max-h-[420px]">
            <table className="w-full grid-table text-sm min-w-[1000px]">
              <thead>
                <tr>
                  <th>YGK BES3.0 Kodu</th>
                  <th>YGK BES3.0 Adı</th>
                  <th>Versiyon</th>
                  <th>Geçerlilik Tarihi</th>
                  <th>Döviz</th>
                  <th>YGK Kesinti Tipi</th>
                  <th>Oran</th>
                  <th>Yıllık Tutar</th>
                  <th>YGK Formülü</th>
                  <th>Kesinti Dönemi</th>
                  <th>Sözleşme Yılı</th>
                  <th>Birikim</th>
                </tr>
              </thead>
              <tbody>
                {filteredYgkBes30Catalog.map((row) => (
                  <tr
                    key={`${row.ybKodu}-${row.versiyon}`}
                    className="cursor-pointer hover:bg-violet-50/40"
                    onDoubleClick={() => addYgkBes30FromCatalog(row)}
                  >
                    <td className="font-semibold">{row.ybKodu}</td>
                    <td>{row.ybAdi}</td>
                    <td>{row.versiyon}</td>
                    <td>{row.gecerlilikTarihi}</td>
                    <td>{row.doviz}</td>
                    <td>{row.ygkKesintiTipi}</td>
                    <td>{row.oran}</td>
                    <td>{row.yillikTutar}</td>
                    <td>{row.ygkFormulu}</td>
                    <td>{row.kesintiDonemi}</td>
                    <td>{row.sozlesmeYili}</td>
                    <td>{row.birikim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(ygkBes30InspectRow)}
        onClose={() => setYgkBes30InspectRow(null)}
        title={ygkBes30InspectRow ? `İncele — ${ygkBes30InspectRow.ybKodu}` : 'İncele'}
        footer={<PrimaryButton onClick={() => setYgkBes30InspectRow(null)}>Tamam</PrimaryButton>}
      >
        {ygkBes30InspectRow && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {Object.entries(ygkBes30InspectRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-800 text-right">{String(v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={ygkBes30VersionsModal.open}
        onClose={() => setYgkBes30VersionsModal({ open: false, title: '', rows: [] })}
        title={ygkBes30VersionsModal.title}
        footer={<PrimaryButton onClick={() => setYgkBes30VersionsModal({ open: false, title: '', rows: [] })}>Tamam</PrimaryButton>}
      >
        {ygkBes30VersionsModal.rows.length ? (
          <table className="w-full grid-table text-sm">
            <thead><tr><th>Versiyon</th><th>Açıklama</th><th>Durum</th><th>Geçerlilik</th></tr></thead>
            <tbody>
              {ygkBes30VersionsModal.rows.map((v) => (
                <tr key={v.versiyon}>
                  <td>{v.versiyon}</td>
                  <td>{v.aciklama}</td>
                  <td>{v.durum}</td>
                  <td>{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Versiyon kaydı yok.</p>
        )}
      </Modal>

      <Modal
        open={Boolean(ygkBes30DetailsRow)}
        onClose={() => { setYgkBes30DetailsRow(null); setYgkBes30DetailsTab('muafiyet') }}
        title={ygkBes30DetailsRow ? `${ygkBes30DetailsRow.ybKodu} — ${ygkBes30DetailsRow.ybAdi}` : ''}
        description="YGK BES 3.0 parametre detayı"
        size="xl"
        footer={<PrimaryButton onClick={() => { setYgkBes30DetailsRow(null); setYgkBes30DetailsTab('muafiyet') }}>Tamam</PrimaryButton>}
      >
        {ygkBes30DetailsRow && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Geçerlilik Tarihi: </span>
                <span className="font-medium text-slate-800">{ygkBes30DetailsRow.gecerlilikTarihi}</span>
              </div>
              <div>
                <span className="text-slate-500">YGK Kesinti Tipi: </span>
                <span className="font-medium text-slate-800">{ygkBes30DetailsRow.ygkKesintiTipi}</span>
              </div>
              <div>
                <span className="text-slate-500">Birikim Tipi: </span>
                <span className="font-medium text-slate-800">{ygkBes30DetailsRow.birikimTipi || '—'}</span>
              </div>
            </div>

            <div className="flex gap-0 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setYgkBes30DetailsTab('muafiyet')}
                className={`px-4 py-2.5 text-sm font-medium border border-b-0 rounded-t-md -mb-px ${ygkBes30DetailsTab === 'muafiyet' ? 'bg-violet-50 text-violet-800 border-slate-200' : 'text-slate-600 border-transparent hover:bg-slate-50'}`}
              >
                Muafiyet Parametreleri
              </button>
              <button
                type="button"
                onClick={() => setYgkBes30DetailsTab('kp')}
                className={`px-4 py-2.5 text-sm font-medium border border-b-0 rounded-t-md -mb-px ${ygkBes30DetailsTab === 'kp' ? 'bg-violet-50 text-violet-800 border-slate-200' : 'text-slate-600 border-transparent hover:bg-slate-50'}`}
              >
                Katkı Payı Aralık Tanımları
              </button>
            </div>

            {ygkBes30DetailsTab === 'muafiyet' ? (
              <div className="space-y-3">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    className="w-full h-9 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
                    placeholder="Ara..."
                    value={ygkBes30DetailsMuafSearch}
                    onChange={(e) => setYgkBes30DetailsMuafSearch(e.target.value)}
                  />
                </div>
                <div className="overflow-auto border border-slate-200 rounded-lg max-h-[320px]">
                  <table className="w-full grid-table text-sm">
                    <thead>
                      <tr>
                        <th>Min. Tutar</th>
                        <th>Max. Tutar</th>
                        <th>Oran</th>
                        <th>Tutar</th>
                        <th className="text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ygkBes30MuafBandsFiltered.length ? (
                        ygkBes30MuafBandsFiltered.map((b) => (
                          <tr key={b.id}>
                            <td>{b.minTutar}</td>
                            <td>{b.maxTutar}</td>
                            <td>{b.oran}</td>
                            <td>{b.tutar}</td>
                            <td className="text-right">
                              <RowActions row={b} actions={YGK_BES30_MUAF_BAND_INNER_ACTIONS} onAction={() => {}} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-slate-500 py-6">Kayıt bulunamadı.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span>Listelenen: {ygkBes30MuafBandsFiltered.length}</span>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums">2 / 16</span>
                    <select className="border border-slate-200 rounded-md px-2 py-1 text-xs bg-white text-slate-700" aria-label="Sayfa başına">
                      <option>10 Sayfa Başına Listelenen</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-auto border border-slate-200 rounded-lg max-h-[360px]">
                <table className="w-full grid-table text-sm">
                  <thead>
                    <tr>
                      <th>Min. KP</th>
                      <th>Max. KP</th>
                      <th>Oran</th>
                      <th>Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(YGK_BES30_KP_ARALIK_BY_KOD[ygkBes30DetailsRow.ybKodu] || []).length ? (
                      YGK_BES30_KP_ARALIK_BY_KOD[ygkBes30DetailsRow.ybKodu].map((r) => (
                        <tr key={r.id}>
                          <td>{r.minKp}</td>
                          <td>{r.maxKp}</td>
                          <td>{r.oran}</td>
                          <td>{r.tutar}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-slate-500 py-6">Tanımlı katkı payı aralığı yok.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default function UrunPlanTarifeTanimlari() {
  const [view, setView] = useState('grid')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(() => urunPlanTarifeKartlari.map((x) => ({ ...x })))
  const [plansByProduct, setPlansByProduct] = useState(() => Object.fromEntries(Object.entries(urunPlanlari).map(([k, v]) => [k, v.map((x) => ({ ...x }))])))
  const [formOpen, setFormOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [form, setForm] = useState({ id: '', ad: '', tipler: 'Bireysel  ·  Bireysel Emeklilik', sozlesmeTipi: 'Ferdi', tarih: '', toplam: 0, aktif: 0, kapali: 0 })
  const [createWizardOpen, setCreateWizardOpen] = useState(false)
  const [createStep, setCreateStep] = useState(1)
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [createMethod, setCreateMethod] = useState('')
  const [existingProductSearch, setExistingProductSearch] = useState('')
  const [createForm, setCreateForm] = useState({ sozlesmeTipi: 'Ferdi', urunNo: '', urunAdi: '', aciklama: '' })
  const [selectedExistingProductId, setSelectedExistingProductId] = useState('')
  const [planForm, setPlanForm] = useState({ planAdi: '', planKodu: '', baslangicTarihi: normalizeDate(), katilimEsasli: false, hedefKitle: '' })
  const [planSetupContext, setPlanSetupContext] = useState(null)
  const [planSetupView, setPlanSetupView] = useState('board')
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })
  const [menuOpenId, setMenuOpenId] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return products
    return products.filter((u) => u.ad.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()))
  }, [search, products])

  const getPlans = (urunId) => plansByProduct[urunId] || []
  const bireyselProducts = useMemo(() => products.filter((p) => (p.tipler || '').toLowerCase().includes('bireysel emeklilik')), [products])
  const selectedExistingProduct = useMemo(() => products.find((p) => p.id === selectedExistingProductId) || null, [products, selectedExistingProductId])

  const recalcCounts = (urunId, currentProducts, currentPlansByProduct) => {
    const plans = currentPlansByProduct[urunId] || []
    const toplam = plans.length
    const aktif = plans.filter((p) => p.durum === 'Yururlukte').length
    const kapali = Math.max(toplam - aktif, 0)
    return currentProducts.map((p) => (p.id === urunId ? { ...p, toplam, aktif, kapali } : p))
  }

  const showVersions = (title, rows, renderRow) => {
    const first = rows[0] ? renderRow(rows[0]) : null
    const columns = first ? Object.keys(first) : []
    setInfoModal({
      open: true,
      title,
      body: rows.length ? (
        <div className="overflow-auto border border-slate-200 rounded-md">
          <table className="w-full grid-table text-sm">
            <thead><tr>{columns.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, idx) => {
              const mapped = renderRow(r)
              return <tr key={idx}>{columns.map((c) => <td key={c}>{mapped[c]}</td>)}</tr>
            })}</tbody>
          </table>
        </div>
      ) : <div className="text-sm text-slate-500">Kayit bulunamadi.</div>,
    })
  }

  const createCopiedId = (baseId, existsFn) => {
    let i = 1
    let candidate = `${baseId}-CP`
    while (existsFn(candidate)) {
      i += 1
      candidate = `${baseId}-CP${i}`
    }
    return candidate
  }

  const startExistingProductPlanFlow = (product) => {
    if (!product) return
    setSelected(null)
    setSelectedExistingProductId(product.id)
    const nextNo = getPlans(product.id).length + 1
    setPlanForm({
      planAdi: `${product.ad} - Yeni Plan`,
      planKodu: `${product.id}-P${nextNo}`,
      baslangicTarihi: normalizeDate(),
      katilimEsasli: false,
      hedefKitle: '',
    })
    setCreateWizardOpen(true)
    setCreateStep(5)
  }

  const openCreateProduct = () => {
    setCreateWizardOpen(true)
    setCreateStep(1)
    setSelectedBranch(null)
    setCreateMethod('')
    setCreateForm({ sozlesmeTipi: 'Ferdi', urunNo: '', urunAdi: '', aciklama: '' })
  }

  const openEditProduct = (row) => {
    setEditingProductId(row.id)
    setForm({ ...row })
    setFormOpen(true)
  }

  const saveProduct = () => {
    if (!form.id.trim()) return alert('Ürün Kodu zorunludur.')
    if (!form.ad.trim()) return alert('Ürün Adı zorunludur.')
    const payload = normalizeProduct(form)
    const duplicate = products.some((p) => p.id === payload.id && p.id !== editingProductId)
    if (duplicate) return alert('Bu Ürün Kodu zaten mevcut.')

    if (editingProductId) {
      setProducts((prev) => prev.map((p) => (p.id === editingProductId ? payload : p)))
      if (editingProductId !== payload.id) {
        setPlansByProduct((prev) => {
          const existingPlans = prev[editingProductId] || []
          const { [editingProductId]: _, ...rest } = prev
          return { ...rest, [payload.id]: existingPlans }
        })
      }
      if (selected?.id === editingProductId) setSelected(payload)
    } else {
      setProducts((prev) => [...prev, payload])
      setPlansByProduct((prev) => ({ ...prev, [payload.id]: [] }))
    }
    setFormOpen(false)
  }

  const closeCreateWizard = () => {
    setCreateWizardOpen(false)
    setCreateStep(1)
    setSelectedBranch(null)
    setCreateMethod('')
    setExistingProductSearch('')
    setSelectedExistingProductId('')
  }

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch)
    if (branch.key === 'bireysel') {
      setCreateStep(2)
      return
    }
    alert('Bu branş için akış henüz eklenmedi. Şimdilik Bireysel Emeklilik ile ilerleyebilirsiniz.')
  }

  const handleMethodSelect = (method) => {
    setCreateMethod(method)
    if (method === 'new') {
      setCreateStep(3)
      return
    }
    setCreateStep(4)
  }

  const selectExistingProduct = (product) => {
    startExistingProductPlanFlow(product)
    setCreateStep(5)
  }

  const handlePlanMethodSelect = (method) => {
    if (method === 'new') {
      setCreateStep(6)
      return
    }
    alert('Bu plan oluşturma yöntemi sonraki adımda tamamlanacak.')
  }

  const handleSavePlanFromWizard = () => {
    if (!selectedExistingProduct) return alert('Lütfen bir ürün seçiniz.')
    if (!planForm.planAdi.trim()) return alert('Plan adı zorunludur.')
    if (!planForm.planKodu.trim()) return alert('Plan kodu zorunludur.')
    const existing = getPlans(selectedExistingProduct.id)
    if (existing.some((p) => p.id === planForm.planKodu.trim())) return alert('Bu plan kodu zaten mevcut.')
    const payload = normalizePlan({
      id: planForm.planKodu.trim(),
      ad: planForm.planAdi.trim(),
      durum: 'Taslak',
      oran: 0,
      tarih: planForm.baslangicTarihi || normalizeDate(),
      katilimEsasli: planForm.katilimEsasli,
      hedefKitle: planForm.hedefKitle,
    })
    setPlansByProduct((prev) => {
      const next = [...(prev[selectedExistingProduct.id] || []), payload]
      const nextMap = { ...prev, [selectedExistingProduct.id]: next }
      setProducts((prodPrev) => recalcCounts(selectedExistingProduct.id, prodPrev, nextMap))
      return nextMap
    })
    const isBireysel = (selectedExistingProduct.tipler || '').toLowerCase().includes('bireysel emeklilik')
    const tip = (selectedExistingProduct.sozlesmeTipi || '').toUpperCase()
    if (isBireysel && (tip === 'FERDI' || tip === 'OKS')) {
      setPlanSetupContext({ urun: selectedExistingProduct, plan: payload })
      setPlanSetupView('board')
    }
    closeCreateWizard()
  }

  const handleCreateFromWizard = () => {
    if (!createForm.urunNo.trim()) return alert('Ürün No zorunludur.')
    if (!createForm.urunAdi.trim()) return alert('Ürün Adı zorunludur.')
    const payload = normalizeProduct({
      id: createForm.urunNo.trim(),
      ad: createForm.urunAdi.trim(),
      tipler: `Bireysel  ·  ${selectedBranch?.label || 'Bireysel Emeklilik'}`,
      sozlesmeTipi: createForm.sozlesmeTipi,
      tarih: normalizeDate(),
      toplam: 0,
      aktif: 0,
      kapali: 0,
    })
    const duplicate = products.some((p) => p.id === payload.id)
    if (duplicate) return alert('Bu Ürün No zaten mevcut.')
    setProducts((prev) => [...prev, payload])
    setPlansByProduct((prev) => ({ ...prev, [payload.id]: [] }))
    setSelected(payload)
    closeCreateWizard()
  }

  const handleSavePlan = (payload, editingId) => {
    if (!selected) return
    setPlansByProduct((prev) => {
      const existing = prev[selected.id] || []
      const next = editingId ? existing.map((p) => (p.id === editingId ? payload : p)) : [...existing, payload]
      const nextMap = { ...prev, [selected.id]: next }
      setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
      return nextMap
    })
  }

  const handlePlanAction = (key, row) => {
    if (!selected) return
    if (key === 'view') {
      setInfoModal({
        open: true,
        title: 'Plan İncele',
        body: <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(row, null, 2)}</pre>,
      })
      return
    }
    if (key === 'copy') {
      const newId = createCopiedId(row.id, (id) => getPlans(selected.id).some((p) => p.id === id))
      handleSavePlan(normalizePlan({ ...row, id: newId, ad: `${row.ad} (Kopya)`, tarih: normalizeDate() }), null)
      return
    }
    if (key === 'version') {
      const base = row.id.split('-V')[0]
      const versionNo = getPlans(selected.id).filter((p) => p.id.startsWith(base)).length + 1
      handleSavePlan(normalizePlan({ ...row, id: `${base}-V${versionNo}`, ad: `${row.ad} v${versionNo}`, tarih: normalizeDate(), durum: 'Taslak' }), null)
      return
    }
    if (key === 'history') {
      const base = row.id.split('-V')[0]
      const versions = getPlans(selected.id).filter((p) => p.id.startsWith(base))
      showVersions(`${row.id} - Versiyonlar`, versions, (r) => ({
        'Plan No': r.id,
        'Plan Adi': r.ad,
        Durum: r.durum,
        'Tamamlanma %': r.oran,
        Tarih: r.tarih,
      }))
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Plan silinsin mi?')) return
      setPlansByProduct((prev) => {
        const existing = prev[selected.id] || []
        const next = existing.filter((p) => p.id !== row.id)
        const nextMap = { ...prev, [selected.id]: next }
        setProducts((prodPrev) => recalcCounts(selected.id, prodPrev, nextMap))
        return nextMap
      })
    }
  }

  const handleUrunAction = (key, row) => {
    setMenuOpenId(null)
    if (key === 'view') { setSelected(row); return }
    if (key === 'edit') { openEditProduct(row); return }
    if (key === 'newPlan') { startExistingProductPlanFlow(row); return }
    if (key === 'copy') {
      const newId = createCopiedId(row.id, (id) => products.some((p) => p.id === id))
      const copied = normalizeProduct({ ...row, id: newId, ad: `${row.ad} (Kopya)`, tarih: normalizeDate() }, row)
      setProducts((prev) => [...prev, copied])
      setPlansByProduct((prev) => ({ ...prev, [newId]: (prev[row.id] || []).map((p) => ({ ...p, id: p.id.replace(row.id, newId), ad: `${p.ad} (Kopya)` })) }))
      return
    }
    if (key === 'version') {
      const base = row.id.split('-V')[0]
      const versions = products.filter((p) => p.id.startsWith(base))
      const newId = `${base}-V${versions.length + 1}`
      const versioned = normalizeProduct({ ...row, id: newId, ad: `${row.ad} v${versions.length + 1}`, tarih: normalizeDate() }, row)
      setProducts((prev) => [...prev, versioned])
      setPlansByProduct((prev) => ({ ...prev, [newId]: (prev[row.id] || []).map((p) => ({ ...p, id: p.id.replace(row.id, newId) })) }))
      return
    }
    if (key === 'history') {
      const versions = products.filter((p) => p.id.startsWith(row.id.split('-V')[0])).sort((a, b) => b.id.localeCompare(a.id))
      showVersions(`${row.id} - Versiyonlar`, versions, (r) => ({
        'Ürün Kodu': r.id,
        'Ürün Adı': r.ad,
        'Sözleşme Tipi': r.sozlesmeTipi,
        Tarih: r.tarih,
      }))
      return
    }
    if (key === 'delete') {
      if (!window.confirm('Ürün silinsin mi?')) return
      setProducts((prev) => prev.filter((p) => p.id !== row.id))
      setPlansByProduct((prev) => {
        const { [row.id]: _, ...rest } = prev
        return rest
      })
      if (selected?.id === row.id) setSelected(null)
    }
  }

  if (selected) {
    return <PlanList urun={selected} planlar={getPlans(selected.id)} onBack={() => setSelected(null)} onSavePlan={handleSavePlan} onPlanAction={handlePlanAction} onStartNewPlanFlow={startExistingProductPlanFlow} />
  }

  if (planSetupContext) {
    if (planSetupView === 'genel') {
      return <PlanGenelBilgilerScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'fonlar') {
      return <FonlarVeFonKarmalariScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'katki') {
      return <KatkiPayiTanimlariScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    if (planSetupView === 'kesinti') {
      return <KesintilerScreen plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupView('board')} />
    }
    return <PlanConfigurationBoard plan={planSetupContext.plan} urun={planSetupContext.urun} onBack={() => setPlanSetupContext(null)} onOpenCard={(cardId) => {
      if (cardId === 'genel') setPlanSetupView('genel')
      else if (cardId === 'fonlar') setPlanSetupView('fonlar')
      else if (cardId === 'katki') setPlanSetupView('katki')
      else if (cardId === 'kesinti') setPlanSetupView('kesinti')
      else alert('Bu kartın detay ekranı sıradaki adımda eklenecek.')
    }} />
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Ürün - Plan - Tarife Tanımları"
        description=""
        right={
          <>
            <OutlineButton className="text-slate-600"><Filter className="w-4 h-4" /> Filtrele</OutlineButton>
            <OutlineButton onClick={() => setView('grid')} className={view === 'grid' ? 'border-violet-300 text-violet-700 bg-violet-50' : ''}><LayoutGrid className="w-4 h-4" /></OutlineButton>
            <OutlineButton onClick={() => setView('list')} className={view === 'list' ? 'border-violet-300 text-violet-700 bg-violet-50' : ''}><ListIcon className="w-4 h-4" /></OutlineButton>
            <PrimaryButton onClick={openCreateProduct}><Plus className="w-4 h-4" /> Yeni Ürün</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-3xl">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Ürün Adı, kodu, Tarife/Plan Kodu, Tarife/Plan Adı, Branş ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((u) => <ProductCard key={u.id} urun={u} onOpen={setSelected} onAction={handleUrunAction} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />)}
          </div>
        ) : (
          <table className="w-full grid-table bg-white border border-slate-200 rounded-md overflow-hidden">
            <thead><tr><th>Ürün Kodu</th><th>Ürün Adı</th><th>Sözleşme Tipi</th><th>Aktif Plan</th><th>Toplam Plan</th><th>Tarih</th><th className="w-12 text-right">İşlemler</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="cursor-pointer" onClick={() => setSelected(u)}>
                  <td className="font-mono text-xs">{u.id}</td>
                  <td className="font-semibold text-slate-800">{u.ad}</td>
                  <td>{u.sozlesmeTipi}</td>
                  <td>{u.aktif}</td>
                  <td>{u.toplam}</td>
                  <td>{u.tarih}</td>
                  <td className="text-right" onClick={(e) => e.stopPropagation()}><RowActions row={u} actions={URUN_ACTIONS} onAction={handleUrunAction} /></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-slate-500 py-6 text-sm">Sonuç bulunamadı</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingProductId ? 'Ürün Güncelle' : 'Yeni Ürün'} size="lg" footer={<><OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton><PrimaryButton onClick={saveProduct}>Kaydet</PrimaryButton></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[{ k: 'id', l: 'Ürün Kodu' }, { k: 'ad', l: 'Ürün Adı' }, { k: 'tipler', l: 'Tipler' }, { k: 'sozlesmeTipi', l: 'Sözleşme Tipi' }, { k: 'tarih', l: 'Tarih' }, { k: 'toplam', l: 'Toplam Plan' }, { k: 'aktif', l: 'Aktif Plan' }].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        open={createWizardOpen}
        onClose={closeCreateWizard}
        title={createStep === 1 ? 'Branş Seçimi' : createStep === 2 ? 'Tanımlama Yöntemi' : createStep === 3 ? 'Ürün Tanımlama' : createStep === 4 ? 'Ürün Seçimi' : createStep === 5 ? 'Tanım Yöntemi' : 'Plan Genel Bilgileri'}
        description={createStep === 1 ? 'İşlem yapmak istediğiniz sigorta branşını seçiniz.' : createStep === 2 ? 'Bireysel Emeklilik branşı için ilerleme yönteminizi belirleyin.' : createStep === 3 ? 'Yeni ürün için temel parametreleri belirleyiniz.' : createStep === 4 ? 'Lütfen plan eklemek istediğiniz ana ürünü seçiniz.' : createStep === 5 ? 'Plan oluşturma yöntemini seçiniz.' : 'Temel plan bilgilerini giriniz'}
        size="lg"
        footer={createStep === 3 ? (
          <>
            <OutlineButton onClick={() => setCreateStep(2)}><ArrowLeft className="w-4 h-4" /> Geri Dön</OutlineButton>
            <PrimaryButton onClick={handleCreateFromWizard}>Oluştur & Yapılandır</PrimaryButton>
          </>
        ) : createStep === 6 ? (
          <>
            <OutlineButton onClick={() => setCreateStep(5)}><ArrowLeft className="w-4 h-4" /> Geri Dön</OutlineButton>
            <PrimaryButton onClick={handleSavePlanFromWizard}>KAYDET VE DEVAM ET <ArrowRight className="w-4 h-4" /></PrimaryButton>
          </>
        ) : null}
      >
        {createStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BRANCH_OPTIONS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => handleBranchSelect(item)}
                  className="text-left flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4 hover:border-violet-300 hover:bg-violet-50/30 transition"
                >
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-2xl leading-tight font-semibold text-slate-800">{item.label}</span>
                    <span className="block text-sm text-slate-500 mt-1">{item.description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {createStep === 2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleMethodSelect('new')}
                className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition"
              >
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Sıfırdan Ürün Tanımla</span>
                <span className="block text-lg text-slate-500 mt-2">Yeni teminat yapıları ve kuralları ile sıfırdan bir ürün oluşturun.</span>
              </button>
              <button
                type="button"
                onClick={() => handleMethodSelect('existing')}
                className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition"
              >
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center">
                  <FilePlus className="w-5 h-5" />
                </span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Mevcut Ürüne Plan Ekle</span>
                <span className="block text-lg text-slate-500 mt-2">Var olan bir ürün yapısı altına yeni bir plan kurgusu ekleyin.</span>
              </button>
            </div>
            <div className="pt-4">
              <button type="button" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800" onClick={() => setCreateStep(1)}>
                <ArrowLeft className="w-4 h-4" /> Geri Dön
              </button>
            </div>
          </div>
        )}

        {createStep === 3 && (
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Branş</span>
              <input className="form-input bg-slate-50" value={selectedBranch?.label || 'Bireysel Emeklilik'} disabled />
            </label>
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Sözleşme Tipi <span className="text-red-500">*</span></div>
              <div className="flex flex-wrap gap-2">
                {SOZLESME_TIPLERI.map((tip) => (
                  <button
                    type="button"
                    key={tip}
                    onClick={() => setCreateForm((prev) => ({ ...prev, sozlesmeTipi: tip }))}
                    className={`px-4 h-10 rounded-xl border text-sm font-semibold transition ${createForm.sozlesmeTipi === tip ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-300 hover:border-violet-300'}`}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün No <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün No" value={createForm.urunNo} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunNo: e.target.value }))} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Ürün Adı <span className="text-red-500">*</span></span>
                <input className="form-input" placeholder="Ürün Adı" value={createForm.urunAdi} onChange={(e) => setCreateForm((prev) => ({ ...prev, urunAdi: e.target.value }))} />
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Açıklama</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Ürün hakkında kısa açıklama..." value={createForm.aciklama} onChange={(e) => setCreateForm((prev) => ({ ...prev, aciklama: e.target.value }))} />
            </label>
          </div>
        )}

        {createStep === 4 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                className="w-full h-11 pl-9 pr-3 border border-slate-300 rounded-xl text-sm"
                placeholder="Ürün adı veya kodu ile ara..."
                value={existingProductSearch}
                onChange={(e) => setExistingProductSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[420px] overflow-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bireyselProducts.filter((p) => !existingProductSearch || p.ad.toLowerCase().includes(existingProductSearch.toLowerCase()) || p.id.toLowerCase().includes(existingProductSearch.toLowerCase())).map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => selectExistingProduct(p)}
                    className="text-left rounded-2xl border border-slate-200 hover:border-violet-300 transition overflow-hidden bg-white"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex px-2 py-1 rounded bg-sky-50 text-sky-700 text-xs font-semibold">{p.id}</span>
                        <span className="w-7 h-7 rounded-lg border border-amber-200 bg-amber-50 text-amber-600 inline-flex items-center justify-center"><PiggyBank className="w-4 h-4" /></span>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">Toplam {p.toplam} Plan</div>
                      <div className="text-[28px] leading-tight font-semibold text-slate-800">{p.ad}</div>
                      <div className="text-xs text-slate-500 mt-2">{p.tipler}</div>
                    </div>
                    <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{p.tarih}</span>
                      <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-white font-medium text-slate-600">{p.toplam} Plan</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800" onClick={() => setCreateStep(2)}>
              <ArrowLeft className="w-4 h-4" /> Geri Dön
            </button>
          </div>
        )}

        {createStep === 5 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button type="button" onClick={() => handlePlanMethodSelect('new')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><Plus className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Yeni</span>
                <span className="block text-lg text-slate-500 mt-2">Sıfırdan oluştur.</span>
              </button>
              <button type="button" onClick={() => handlePlanMethodSelect('catalog')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><BookOpen className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Katalogdan</span>
                <span className="block text-lg text-slate-500 mt-2">Şablondan kopyala.</span>
              </button>
              <button type="button" onClick={() => handlePlanMethodSelect('ai')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><Sparkles className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">AI ile</span>
                <span className="block text-lg text-slate-500 mt-2">Yapay zeka ile.</span>
              </button>
              <button type="button" onClick={() => handlePlanMethodSelect('file')} className="text-left rounded-xl border border-slate-200 px-5 py-5 hover:border-violet-300 hover:bg-violet-50/30 transition">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 text-white inline-flex items-center justify-center"><Upload className="w-5 h-5" /></span>
                <span className="block text-3xl leading-tight font-semibold text-slate-800 mt-4">Dosyadan</span>
                <span className="block text-lg text-slate-500 mt-2">Excel/XML yükle.</span>
              </button>
            </div>
            <div className="pt-4">
              <button type="button" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800" onClick={() => setCreateStep(4)}>
                <ArrowLeft className="w-4 h-4" /> Geri Dön
              </button>
            </div>
          </div>
        )}

        {createStep === 6 && (
          <div className="space-y-4">
            <div className="px-4 py-3 rounded-md bg-slate-50 border border-slate-100 text-sm text-slate-600">
              <span className="mr-6">Bağlı Ürün: <strong className="text-slate-800">{selectedExistingProduct?.ad || '-'}</strong></span>
              <span>Sözleşme Tipi: <strong className="text-slate-800">{selectedExistingProduct?.sozlesmeTipi || '-'}</strong></span>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Plan adı <span className="text-red-500">*</span></span>
              <input className="form-input" value={planForm.planAdi} onChange={(e) => setPlanForm((prev) => ({ ...prev, planAdi: e.target.value }))} />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Plan kodu <span className="text-red-500">*</span></span>
              <input className="form-input" value={planForm.planKodu} onChange={(e) => setPlanForm((prev) => ({ ...prev, planKodu: e.target.value }))} />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1">Başlangıç tarihi <span className="text-red-500">*</span></span>
                <input className="form-input" value={planForm.baslangicTarihi} onChange={(e) => setPlanForm((prev) => ({ ...prev, baslangicTarihi: e.target.value }))} />
              </label>
              <label className="inline-flex items-center gap-2 h-11 text-slate-700 font-semibold">
                <input type="checkbox" checked={planForm.katilimEsasli} onChange={(e) => setPlanForm((prev) => ({ ...prev, katilimEsasli: e.target.checked }))} />
                Katılım Esaslı
              </label>
            </div>
            <label className="block">
              <span className="block text-sm font-semibold text-slate-700 mb-1">Hedef kitle açıklaması</span>
              <textarea className="form-input min-h-[112px] resize-none" placeholder="Hedef kitle açıklamasını giriniz" value={planForm.hedefKitle} onChange={(e) => setPlanForm((prev) => ({ ...prev, hedefKitle: e.target.value }))} />
            </label>
          </div>
        )}
      </Modal>

      <Modal open={infoModal.open} onClose={() => setInfoModal({ open: false, title: '', body: null })} title={infoModal.title} footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}>
        {infoModal.body}
      </Modal>
    </div>
  )
}
