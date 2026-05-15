import { useState } from 'react'
import { ChevronLeft, CreditCard, Shield, Users, PieChart, ClipboardList, MapPin } from 'lucide-react'
import { ScreenHeader, OutlineButton, StatusBadge } from '../ui/Toolbar'

const IZLE_SEKMELER = [
  { key: 'ozet', label: 'Özet ve onaylar' },
  { key: 'kisiler', label: 'Kişiler ve adres' },
  { key: 'plan', label: 'Plan, fon, RGPF' },
  { key: 'tahsilat', label: 'Tahsilat (PCI-DSS)' },
]

export default function TeklifAllianzIzle({ teklif, onGeri }) {
  const [sekme, setSekme] = useState('ozet')
  if (!teklif) return null

  const o = teklif.onaylar || {}
  const t = teklif.tahsilat || {}
  const r = teklif.rgpf || {}

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title={`Teklif ${teklif.teklifNo}`}
        description={`${teklif.adSoyad} · ${teklif.plan} · İzleme modu`}
        right={
          <OutlineButton onClick={onGeri}>
            <ChevronLeft className="w-4 h-4" /> Listeye dön
          </OutlineButton>
        }
      />

      <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-2 bg-slate-50/80">
        {IZLE_SEKMELER.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSekme(s.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              sekme === s.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6 max-w-5xl">
        {sekme === 'ozet' && (
          <div className="space-y-6">
            <IzleKart baslik="Genel" icon={ClipboardList}>
              <Dl>
                <Row k="Durum" v={<StatusBadge status="Taslak">{teklif.durum}</StatusBadge>} />
                <Row k="Teklif no" v={teklif.teklifNo} mono />
                <Row k="Tanzim" v={teklif.tarih} />
                <Row k="Acente" v={`${teklif.acenteKod} — ${teklif.acenteAd}`} />
                <Row k="Aylık tutar" v={`${Number(teklif.tutar).toLocaleString('tr-TR')} TL`} />
              </Dl>
            </IzleKart>

            <IzleKart baslik="Onay durumları" icon={Shield}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OnayKutu baslik="Müşteri onayı" durum={o.musteri} />
                <OnayKutu baslik="KVKK onayı" durum={o.kvkk} />
                <OnayKutu baslik="Elektronik ileti onayı" durum={o.elektronikIleti} />
                <OnayKutu baslik="İç onay" durum={o.icOnay} />
              </div>
            </IzleKart>
          </div>
        )}

        {sekme === 'kisiler' && (
          <div className="space-y-6">
            <KisiKart baslik="Katılımcı" kisi={teklif.katilimci} icon={Users} />
            <KisiKart
              baslik={teklif.katkiYapan?.ayni ? 'Katkı yapan (katılımcı ile aynı)' : 'Katkı yapan / ödeyen'}
              kisi={teklif.katkiYapan}
              icon={Users}
              ekstra={!teklif.katkiYapan?.ayni}
            />
            {teklif.yasalTemsilci && (
              <KisiKart baslik="Yasal temsilci" kisi={teklif.yasalTemsilci} icon={Users} yasal />
            )}
          </div>
        )}

        {sekme === 'plan' && (
          <div className="space-y-6">
            <IzleKart baslik="Ödeme planı" icon={ClipboardList}>
              <Dl>
                <Row k="Plan" v={teklif.plan} />
                <Row k="Dönem" v={teklif.odemePlani?.donem} />
                <Row k="Tutar" v={`${Number(teklif.odemePlani?.tutar || teklif.tutar).toLocaleString('tr-TR')} TL`} />
                <Row k="Başlangıç" v={teklif.odemePlani?.baslangic} />
                <Row k="Taksit" v={teklif.odemePlani?.taksitAdedi} />
              </Dl>
            </IzleKart>

            <IzleKart baslik="Seçilen fonlar" icon={PieChart}>
              {(teklif.fonlar || []).length === 0 ? (
                <p className="text-sm text-slate-500">Fon dağılımı henüz tanımlanmamış.</p>
              ) : (
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left px-3 py-2">Fon</th>
                      <th className="text-left px-3 py-2">Varlık</th>
                      <th className="text-right px-3 py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teklif.fonlar.map((f, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono">{f.kod}</td>
                        <td className="px-3 py-2">{f.varlik}</td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">{f.yuzde}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </IzleKart>

            <IzleKart baslik="RGPF anketi" icon={ClipboardList}>
              {r.yapildi ? (
                <Dl>
                  <Row k="Tarih" v={r.tarih} />
                  <Row k="Risk profili" v={r.profil} />
                  <Row k="Skor" v={r.skor} />
                  <Row k="Önerilen fon" v={r.onerilenFon} />
                </Dl>
              ) : (
                <p className="text-sm text-amber-700 font-medium">RGPF anketi henüz tamamlanmadı.</p>
              )}
            </IzleKart>
          </div>
        )}

        {sekme === 'tahsilat' && (
          <div className="space-y-6">
            <IzleKart baslik="Tahsilat bilgisi (PCI-DSS uyumlu görünüm)" icon={CreditCard}>
              {t.girildi ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-semibold">
                    <Shield className="w-5 h-5 shrink-0" />
                    Kart / hesap bilgisi tokenize edilmiş olarak kayıtlı — tam PAN saklanmaz.
                  </div>
                  <Dl>
                    <Row k="Kayıt durumu" v="Girildi" />
                    <Row k="Ödeme aracı" v={t.odemeAraci} />
                    <Row k="Maskeli gösterim" v={t.kartMaskeli} mono />
                    <Row k="Token referansı" v={t.tokenRef} mono />
                    <Row k="Son 4 hane" v={t.sonDortHane} mono />
                    <Row k="Kayıt zamanı" v={t.kayitTarihi} />
                    <Row k="PCI-DSS uyum" v={t.pciUyumlu ? 'Evet' : 'Hayır'} />
                  </Dl>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Bu ekranda yalnızca maskelenmiş kart numarası ve token referansı gösterilir. Gerçek kart verisi sistemde
                    şifreli vault / ödeme sağlayıcısında tutulur (demo).
                  </p>
                </div>
              ) : (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 font-medium">
                  Tahsilat bilgisi henüz girilmedi.
                </p>
              )}
            </IzleKart>
          </div>
        )}
      </div>
    </div>
  )
}

function IzleKart({ baslik, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
        <Icon className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-800">{baslik}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function KisiKart({ baslik, kisi, icon: Icon, ekstra, yasal }) {
  if (!kisi) return null
  const adSoyad = yasal ? `${kisi.ad} ${kisi.soyad}` : kisi.ayni ? `${kisi.ad} ${kisi.soyad} (aynı kişi)` : `${kisi.ad || ''} ${kisi.soyad || ''}`.trim()
  return (
    <IzleKart baslik={baslik} icon={Icon}>
      <Dl>
        {ekstra && <Row k="TCKN" v={kisi.tckn} mono />}
        <Row k="Ad soyad" v={adSoyad || '—'} />
        {kisi.dogum && <Row k="Doğum" v={kisi.dogum} />}
        {kisi.cinsiyet && <Row k="Cinsiyet" v={kisi.cinsiyet} />}
        {kisi.meslek && <Row k="Meslek" v={kisi.meslek} />}
        {kisi.iliski && <Row k="İlişki" v={kisi.iliski} />}
        {kisi.cep && <Row k="Cep" v={kisi.cep} mono />}
        {kisi.email && <Row k="E-posta" v={kisi.email} />}
        {kisi.adres && (
          <Row k="Adres" v={<span className="inline-flex items-start gap-1"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />{kisi.adres}</span>} />
        )}
      </Dl>
    </IzleKart>
  )
}

function OnayKutu({ baslik, durum }) {
  const bekliyor = durum === 'Bekliyor'
  return (
    <div className={`rounded-lg border p-3 ${bekliyor ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <p className="text-xs font-semibold text-slate-600 mb-1">{baslik}</p>
      <p className={`text-sm font-bold ${bekliyor ? 'text-amber-800' : 'text-emerald-800'}`}>{durum || '—'}</p>
    </div>
  )
}

function Dl({ children }) {
  return <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">{children}</dl>
}

function Row({ k, v, mono }) {
  return (
    <>
      <dt className="text-slate-500">{k}</dt>
      <dd className={`font-medium text-slate-800 text-right sm:text-left ${mono ? 'font-mono text-xs' : ''}`}>{v ?? '—'}</dd>
    </>
  )
}
