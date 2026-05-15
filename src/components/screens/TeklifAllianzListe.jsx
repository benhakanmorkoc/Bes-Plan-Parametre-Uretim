import { useMemo, useState } from 'react'
import { Plus, Search, Eye, Filter } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import { ALLIANZ_TEKLIF_DURUM_FILTRE } from '../../data/mockData'

const ONAY_BEKLEYEN_DURUMLAR = new Set([
  'Onay Bekliyor',
  'Müşteri Onayı Bekliyor',
  'KVKK Onayı Bekliyor',
  'Elektronik İleti Onayı Bekliyor',
])

function durumBadgeVariant(durum) {
  if (ONAY_BEKLEYEN_DURUMLAR.has(durum)) return 'Taslak'
  if (durum === 'Onaylandı') return 'Aktif'
  return 'Pasif'
}

function kayitFiltrele(kayit, durumFiltre) {
  if (durumFiltre === 'tumu') return true
  if (durumFiltre === 'onay_bekleyen') return ONAY_BEKLEYEN_DURUMLAR.has(kayit.durum)
  if (durumFiltre === 'musteri_onay') return kayit.durum === 'Müşteri Onayı Bekliyor' || kayit.onaylar?.musteri === 'Bekliyor'
  if (durumFiltre === 'kvkk') return kayit.durum === 'KVKK Onayı Bekliyor' || kayit.onaylar?.kvkk === 'Bekliyor'
  if (durumFiltre === 'elektronik_ileti') return kayit.durum === 'Elektronik İleti Onayı Bekliyor' || kayit.onaylar?.elektronikIleti === 'Bekliyor'
  return true
}

export default function TeklifAllianzListe({ kayitlar, onYeniEkle, onIzle }) {
  const [arama, setArama] = useState('')
  const [durumFiltre, setDurumFiltre] = useState('onay_bekleyen')
  const [acenteFiltre, setAcenteFiltre] = useState('')

  const acenteler = useMemo(() => {
    const set = new Set(kayitlar.map((k) => k.acenteAd).filter(Boolean))
    return [...set]
  }, [kayitlar])

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase()
    return kayitlar.filter((k) => {
      if (!kayitFiltrele(k, durumFiltre)) return false
      if (acenteFiltre && k.acenteAd !== acenteFiltre) return false
      if (!q) return true
      return [k.teklifNo, k.tckn, k.adSoyad, k.plan, k.durum, k.acenteAd]
        .some((v) => String(v || '').toLowerCase().includes(q))
    })
  }, [kayitlar, arama, durumFiltre, acenteFiltre])

  const onayBekleyenSayisi = useMemo(
    () => kayitlar.filter((k) => ONAY_BEKLEYEN_DURUMLAR.has(k.durum)).length,
    [kayitlar],
  )

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Allianz Teklif"
        description="Teklif izleme ve filtreleme — onay bekleyen kayıtlar varsayılan listede."
        right={
          <PrimaryButton onClick={onYeniEkle}>
            <Plus className="w-4 h-4" /> Yeni Ekle
          </PrimaryButton>
        }
      />

      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <Filter className="w-3.5 h-3.5" />
          Onay bekleyen: {onayBekleyenSayisi}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              className="form-input w-full pl-9"
              placeholder="Teklif no, TCKN, ad, plan..."
              value={arama}
              onChange={(e) => setArama(e.target.value)}
            />
          </div>
          <select className="form-select" value={durumFiltre} onChange={(e) => setDurumFiltre(e.target.value)}>
            {ALLIANZ_TEKLIF_DURUM_FILTRE.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <select className="form-select" value={acenteFiltre} onChange={(e) => setAcenteFiltre(e.target.value)}>
            <option value="">Tüm acenteler</option>
            {acenteler.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm">
          <thead>
            <tr>
              <th>Teklif No</th>
              <th>Katılımcı</th>
              <th>Plan</th>
              <th>Tarih</th>
              <th className="text-right">Tutar</th>
              <th>Durum</th>
              <th>Onaylar</th>
              <th>Tahsilat</th>
              <th className="w-28">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtreli.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50/80">
                <td className="font-mono text-xs font-semibold">{k.teklifNo}</td>
                <td>
                  <div className="font-medium text-slate-800">{k.adSoyad}</div>
                  <div className="text-xs text-slate-500 font-mono">{k.tckn}</div>
                </td>
                <td className="max-w-[140px] truncate" title={k.plan}>
                  {k.plan}
                </td>
                <td>{k.tarih}</td>
                <td className="text-right tabular-nums">{Number(k.tutar).toLocaleString('tr-TR')} TL</td>
                <td>
                  <StatusBadge status={durumBadgeVariant(k.durum)}>{k.durum}</StatusBadge>
                </td>
                <td>
                  <OnayOzet onaylar={k.onaylar} />
                </td>
                <td>
                  <TahsilatOzet tahsilat={k.tahsilat} />
                </td>
                <td>
                  <OutlineButton small onClick={() => onIzle(k.id)}>
                    <Eye className="w-3.5 h-3.5" /> İzle
                  </OutlineButton>
                </td>
              </tr>
            ))}
            {filtreli.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-500">
                  Filtreye uygun teklif bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OnayOzet({ onaylar }) {
  if (!onaylar) return <span className="text-slate-400">—</span>
  const items = [
    { k: 'Müşteri', v: onaylar.musteri },
    { k: 'KVKK', v: onaylar.kvkk },
    { k: 'E-İleti', v: onaylar.elektronikIleti },
  ]
  return (
    <div className="flex flex-col gap-0.5 text-[10px]">
      {items.map((x) => (
        <span key={x.k} className={x.v === 'Bekliyor' ? 'text-amber-700 font-semibold' : 'text-slate-600'}>
          {x.k}: {x.v}
        </span>
      ))}
    </div>
  )
}

function TahsilatOzet({ tahsilat }) {
  if (!tahsilat) return <span className="text-slate-400">—</span>
  if (!tahsilat.girildi) {
    return <span className="text-xs text-amber-700 font-semibold">Girilmedi</span>
  }
  return (
    <div className="text-[10px] leading-snug">
      <span className="text-emerald-700 font-semibold block">PCI-DSS uyumlu</span>
      <span className="font-mono text-slate-600">{tahsilat.kartMaskeli}</span>
    </div>
  )
}
