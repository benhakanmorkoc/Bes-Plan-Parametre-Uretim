import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, CheckCircle2, Plus, Trash2, AlertCircle } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { tariffeListesi } from '../../data/mockData'

const IL_LISTE = ['İSTANBUL', 'ANKARA', 'İZMİR', 'BURSA']
const ILCE_LISTE = ['KADIKÖY', 'ÇANKAYA', 'KONAK', 'OSMANGAZİ']

const FON_SATIRLARI = [
  { kod: 'AUA', varlik: 'TL Sabit Getiri', yuzde: 31 },
  { kod: 'AUA', varlik: 'TL Hisse Senedi', yuzde: 23 },
  { kod: 'AUA', varlik: 'Eurobond', yuzde: 17 },
  { kod: 'AUA', varlik: 'Yabancı Hisse', yuzde: 18 },
  { kod: 'AUA', varlik: 'Altın', yuzde: 11 },
]

function yasHesapla(dogumTarihi) {
  if (!dogumTarihi) return null
  const d = new Date(dogumTarihi)
  if (Number.isNaN(d.getTime())) return null
  const bugun = new Date()
  let yas = bugun.getFullYear() - d.getFullYear()
  const ayFark = bugun.getMonth() - d.getMonth()
  if (ayFark < 0 || (ayFark === 0 && bugun.getDate() < d.getDate())) yas -= 1
  return yas
}

function lehdarId() {
  return `L-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function emptyKisi() {
  return {
    kpsYuklendi: false,
    tckn: '',
    dogumTarihi: '',
    babaAdi: '',
    ad: '',
    soyad: '',
    kimlikTuru: 'NÜFUS CÜZDANI',
    kimlikSeri: '',
    cinsiyet: '',
    anneAdi: '',
    uyruk: 'TÜRKİYE',
    medeniHal: '',
    egitim: '',
    ortalamaGelir: '',
    meslek: '',
    isyeriUnvani: '',
    ikametAyni: 'Evet',
    mukimUlkeVar: 'Hayır',
    ulke: 'TÜRKİYE',
    il: 'İZMİR',
    ilce: 'KONAK',
    adres1: '',
    adres2: '',
    adres3: '',
    evTel: '',
    fax: '',
    cepTel: '',
    email: '',
    fatcaVergiUlke: 'TÜRKİYE',
    fatcaDogumUlke: 'TÜRKİYE',
    fatcaAbdIkamat: 'Hayır',
    fatcaGreenCard: 'Hayır',
    mukimBelge: 'Hayır',
    mukimVergiKimlikNo: '',
    mukimAciklama: '',
  }
}

function emptyLehdar() {
  return { id: lehdarId(), musteriTipi: 'Gerçek', tckn: '', dogumTarihi: '', babaAdi: '', ad: '', soyad: '', yuzde: '', kpsYuklendi: false }
}

const initialForm = () => ({
  teklifNo: String(Math.floor(30000000 + Math.random() * 9000000)),
  teklifTipi: 'BGD',
  sirket: 'Allianz Yaşam ve Emeklilik A.Ş.',
  acenteKod: '001122',
  acenteAd: 'EGE BÖLGE MÜDÜRLÜĞÜ',
  urunTipi: 'Bireysel Teklif Girişi',
  dijitalForm: 'Evet',
  mesafeliSatis: 'Hayır',
  araciSicil: '11270208416 - SEMA ARIK',
  tanzimTarihi: new Date().toISOString().slice(0, 10),
  katilimciKatkiciAyni: 'Evet',
  tckn: '',
  dogumTarihi: '',
  babaAdiArama: '',
  kimlikTuru: 'NÜFUS CÜZDANI',
  kimlikSeri: '',
  cinsiyet: '',
  ad: '',
  soyad: '',
  anneAdi: '',
  uyruk: 'TÜRKİYE',
  medeniHal: '',
  egitim: 'ÜNİVERSİTE',
  ortalamaGelir: '150-750 (USD)',
  meslek: 'ACENTE',
  isyeriUnvani: '',
  ikametAyni: 'Evet',
  mukimUlkeVar: 'Hayır',
  ulke: 'TÜRKİYE',
  il: 'İZMİR',
  ilce: 'KONAK',
  adres1: '',
  adres2: '',
  adres3: '',
  evTel: '',
  fax: '',
  cepTel: '',
  email: '',
  fatcaVergiUlke: 'TÜRKİYE',
  fatcaDogumUlke: 'TÜRKİYE',
  fatcaAbdIkamat: 'Hayır',
  fatcaGreenCard: 'Hayır',
  mukimBelge: 'Hayır',
  mukimVergiKimlikNo: '',
  mukimAciklama: '',
  yasalTemsilci: emptyKisi(),
  odeyen: emptyKisi(),
  lehdarVar: 'Hayır',
  lehdarlar: [],
  planKod: '',
  fonSablon: 'onerilen',
})

function mockKpsSonuc(kisi, patchFn) {
  patchFn({
    kpsYuklendi: true,
    kimlikSeri: 'A123456',
    cinsiyet: 'Erkek',
    ad: 'ÖRNEK',
    soyad: 'SOYAD',
    anneAdi: 'AYŞE',
    babaAdi: kisi.babaAdi || kisi.babaAdiArama || 'MEHMET',
    medeniHal: 'Evli',
    adres1: kisi.adres1 || 'Örnek Mah. BES Cad.',
    adres2: kisi.adres2 || 'No: 12',
    adres3: kisi.adres3 || 'D: 4',
    cepTel: kisi.cepTel || '5321112233',
    email: kisi.email || 'ornek@mail.com',
  })
}

export default function TeklifAllianzWizard({ onTamamla, onVazgec }) {
  const [adim, setAdim] = useState(0)
  const [f, setF] = useState(initialForm)
  const [kpsYuklendi, setKpsYuklendi] = useState(false)

  const katilimciYas = useMemo(() => yasHesapla(f.dogumTarihi), [f.dogumTarihi])
  const reşitOlmayan = katilimciYas !== null && katilimciYas < 18
  const odeyenFarkli = f.katilimciKatkiciAyni === 'Hayır'

  const steps = useMemo(() => {
    const list = [
      { key: 'satis', title: 'Teklif ve satış', hint: 'Kanal, acente, katılımcı ile ödeyenin aynı olup olmadığı.' },
      { key: 'katilimci', title: 'Katılımcı arama', hint: 'TCKN, doğum tarihi; Ara ile KPS / müşteri master.' },
      { key: 'kimlik', title: 'Kimlik ve KYC', hint: 'Katılımcı kimlik ve meslek bilgileri.' },
      { key: 'adres', title: 'Adres ve iletişim', hint: 'Katılımcı ikamet ve iletişim.' },
      { key: 'uyum', title: 'FATCA / CRS (Katılımcı)', hint: 'Katılımcı vergi uyumu ve mukimlik.' },
    ]
    if (reşitOlmayan) {
      list.push({ key: 'yasal', title: 'Yasal temsilci', hint: '18 yaş altı için yasal temsilci — arama, adres, FATCA/CRS.' })
    }
    if (odeyenFarkli) {
      list.push(
        { key: 'odeyen-arama', title: 'Ödeyen — arama', hint: 'Katkı yapan / ödeyen kişi sorgusu ve kimlik.' },
        { key: 'odeyen-adres', title: 'Ödeyen — adres', hint: 'Ödeyen ikamet ve iletişim.' },
        { key: 'odeyen-uyum', title: 'Ödeyen — FATCA / CRS', hint: 'Ödeyen vergi uyumu ve mukimlik.' },
      )
    }
    list.push({ key: 'plan', title: 'Lehdar, plan ve fon', hint: 'Lehdar payları toplamı %100 olmalıdır.' })
    return list
  }, [reşitOlmayan, odeyenFarkli])

  useEffect(() => {
    setAdim((a) => Math.min(a, Math.max(0, steps.length - 1)))
  }, [steps.length])

  const patch = (p) => setF((prev) => ({ ...prev, ...p }))
  const patchYasal = (p) => setF((prev) => ({ ...prev, yasalTemsilci: { ...prev.yasalTemsilci, ...p } }))
  const patchOdeyen = (p) => setF((prev) => ({ ...prev, odeyen: { ...prev.odeyen, ...p } }))

  const planSecenekleri = useMemo(
    () => tariffeListesi.map((p) => ({ value: p.ad, label: `${p.id} — ${p.ad}` })),
    [],
  )

  const lehdarPayToplam = useMemo(
    () => f.lehdarlar.reduce((acc, l) => acc + (Number(String(l.yuzde).replace(',', '.')) || 0), 0),
    [f.lehdarlar],
  )
  const lehdarPayGecerli = Math.abs(lehdarPayToplam - 100) < 0.01
  const fonToplam = useMemo(() => FON_SATIRLARI.reduce((a, r) => a + r.yuzde, 0), [])

  const aktifStepKey = steps[adim]?.key

  const kpsAraKatilimci = () => {
    if (!f.tckn || f.tckn.length < 10 || !f.dogumTarihi) {
      window.alert('TCKN ve doğum tarihi zorunludur.')
      return
    }
    setKpsYuklendi(true)
    patch({
      kimlikSeri: 'A123456',
      cinsiyet: 'Erkek',
      ad: 'ÖRNEK',
      soyad: 'SOYAD',
      anneAdi: 'AYŞE',
      babaAdiArama: f.babaAdiArama || 'MEHMET',
      medeniHal: 'Evli',
      adres1: 'Örnek Mah. BES Cad.',
      adres2: 'No: 12',
      adres3: 'D: 4',
      cepTel: '5321112233',
      email: 'ornek@mail.com',
    })
  }

  const validateKisiAdres = (kisi, etiket) => {
    if (!kisi.adres1?.trim() || !kisi.cepTel?.trim() || !kisi.email?.trim()) {
      window.alert(`${etiket}: adres satırı 1, cep telefonu ve e-posta zorunludur.`)
      return false
    }
    return true
  }

  const validateUyum = (kisi, etiket) => {
    if (!kisi.fatcaVergiUlke?.trim() || !kisi.fatcaDogumUlke?.trim()) {
      window.alert(`${etiket}: FATCA ülke alanları zorunludur.`)
      return false
    }
    if (kisi.mukimUlkeVar === 'Evet' && !kisi.mukimVergiKimlikNo?.trim()) {
      window.alert(`${etiket}: mukim ülke "Evet" ise vergi kimlik no (TIN) zorunludur.`)
      return false
    }
    return true
  }

  const validateLehdarlar = () => {
    if (f.lehdarVar !== 'Evet') return true
    if (f.lehdarlar.length === 0) {
      window.alert('En az bir lehdar ekleyiniz.')
      return false
    }
    for (const l of f.lehdarlar) {
      if (!l.tckn?.trim() || !l.dogumTarihi || l.yuzde === '' || l.yuzde === undefined) {
        window.alert('Her lehdar için TCKN, doğum tarihi ve pay (%) zorunludur.')
        return false
      }
      if (!l.kpsYuklendi) {
        window.alert(`Lehdar (${l.tckn}): önce Ara ile sorgulama yapınız.`)
        return false
      }
    }
    if (!lehdarPayGecerli) {
      window.alert(`Lehdar payları toplamı %100 olmalıdır. Mevcut toplam: %${lehdarPayToplam.toFixed(2)}`)
      return false
    }
    return true
  }

  const sonraki = () => {
    if (aktifStepKey === 'katilimci' && !kpsYuklendi) {
      window.alert('Önce Ara ile katılımcı sorgusunu tamamlayınız.')
      return
    }
    if (aktifStepKey === 'adres' && !validateKisiAdres(f, 'Katılımcı')) return
    if (aktifStepKey === 'uyum' && !validateUyum(f, 'Katılımcı')) return
    if (aktifStepKey === 'yasal') {
      const y = f.yasalTemsilci
      if (!y.kpsYuklendi) {
        window.alert('Yasal temsilci için Ara ile sorgulama yapınız.')
        return
      }
      if (!validateKisiAdres(y, 'Yasal temsilci')) return
      if (!validateUyum(y, 'Yasal temsilci')) return
    }
    if (aktifStepKey === 'odeyen-arama' && !f.odeyen.kpsYuklendi) {
      window.alert('Ödeyen için Ara ile sorgulama yapınız.')
      return
    }
    if (aktifStepKey === 'odeyen-adres' && !validateKisiAdres(f.odeyen, 'Ödeyen')) return
    if (aktifStepKey === 'odeyen-uyum' && !validateUyum(f.odeyen, 'Ödeyen')) return
    if (aktifStepKey === 'plan' && f.lehdarVar === 'Evet' && !lehdarPayGecerli) {
      window.alert(`Lehdar payları toplamı %100 olmalıdır. Mevcut: %${lehdarPayToplam.toFixed(2)}`)
      return
    }
    setAdim((x) => Math.min(steps.length - 1, x + 1))
  }

  const sifirla = () => {
    setF(initialForm())
    setKpsYuklendi(false)
    setAdim(0)
  }

  const lehdarEkle = () => patch({ lehdarlar: [...f.lehdarlar, emptyLehdar()] })
  const lehdarSil = (id) => patch({ lehdarlar: f.lehdarlar.filter((l) => l.id !== id) })
  const lehdarGuncelle = (id, alanlar) => {
    patch({ lehdarlar: f.lehdarlar.map((l) => (l.id === id ? { ...l, ...alanlar } : l)) })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Yeni Allianz Teklif"
        description="Katılımcı, yasal temsilci (18 altı), ödeyen ve lehdar bilgileri."
        right={
          <OutlineButton onClick={() => (onVazgec ? onVazgec() : sifirla())}>
            Listeye dön
          </OutlineButton>
        }
      />

      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setAdim(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                i === adim ? 'bg-blue-600 text-white border-blue-600' : i < adim ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 leading-snug mt-2">{steps[adim]?.hint}</p>
        {reşitOlmayan && aktifStepKey !== 'yasal' && adim > 0 && (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5 mt-2">
            Katılımcı {katilimciYas} yaşında — yasal temsilci adımı sürece dahildir.
          </p>
        )}
        {odeyenFarkli && (
          <p className="text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5 mt-2">
            Ödeyen katılımcıdan farklı — ödeyen için ayrı FATCA / mukimlik adımları açılır.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {aktifStepKey === 'satis' && (
          <div className="max-w-3xl space-y-6">
            <Section title="Teklif bilgileri">
              <Grid>
                <Field label="Teklif tipi"><input className="form-input" value={f.teklifTipi} onChange={(e) => patch({ teklifTipi: e.target.value })} /></Field>
                <Field label="Şirket"><input className="form-input bg-slate-50" readOnly value={f.sirket} /></Field>
                <Field label="Acente kodu"><input className="form-input" value={f.acenteKod} onChange={(e) => patch({ acenteKod: e.target.value })} /></Field>
                <Field label="Acente adı"><input className="form-input" value={f.acenteAd} onChange={(e) => patch({ acenteAd: e.target.value })} /></Field>
              </Grid>
            </Section>
            <Section title="Ek bilgiler">
              <Grid>
                <Field label="Acente tanzim tarihi"><input type="date" className="form-input" value={f.tanzimTarihi} onChange={(e) => patch({ tanzimTarihi: e.target.value })} /></Field>
                <Field label="Katılımcı ve katkı yapan aynı mı?" hint="Hayır → ödeyen adımları açılır">
                  <select className="form-input" value={f.katilimciKatkiciAyni} onChange={(e) => patch({ katilimciKatkiciAyni: e.target.value })}>
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </Field>
              </Grid>
            </Section>
          </div>
        )}

        {aktifStepKey === 'katilimci' && (
          <div className="max-w-3xl space-y-6">
              <InfoBox>
                <strong>Teklif no:</strong> <span className="font-mono">{f.teklifNo}</span>
                {katilimciYas !== null && <span className="ml-2">— Yaş: {katilimciYas}{reşitOlmayan ? ' (18 altı)' : ''}</span>}
              </InfoBox>
              <KisiAramaBlok
                baslik="Katılımcı — arama"
                kisi={{ tckn: f.tckn, dogumTarihi: f.dogumTarihi, babaAdi: f.babaAdiArama }}
                onChange={(p) => patch({ tckn: p.tckn, dogumTarihi: p.dogumTarihi, babaAdiArama: p.babaAdi })}
                onAra={kpsAraKatilimci}
                yuklendi={kpsYuklendi}
                sonuc={{ ad: f.ad, soyad: f.soyad, cinsiyet: f.cinsiyet }}
              />
          </div>
        )}

        {aktifStepKey === 'kimlik' && <KimlikBlok kisi={f} onChange={patch} />}
        {aktifStepKey === 'adres' && <AdresIletisimBlok kisi={f} onChange={patch} />}
        {aktifStepKey === 'uyum' && <FatcaCrsBlok kisi={f} onChange={patch} baslik="Katılımcı — FATCA / CRS" />}

        {aktifStepKey === 'yasal' && (
          <div className="max-w-3xl space-y-6">
              <InfoBox>18 yaş altı katılımcı için yasal temsilci bilgileri zorunludur.</InfoBox>
              <KisiAramaBlok
                baslik="Yasal temsilci — arama"
                kisi={f.yasalTemsilci}
                onChange={patchYasal}
                onAra={() => mockKpsSonuc(f.yasalTemsilci, patchYasal)}
                yuklendi={f.yasalTemsilci.kpsYuklendi}
                sonuc={f.yasalTemsilci}
              />
              {f.yasalTemsilci.kpsYuklendi && (
                <>
                  <KimlikBlok kisi={f.yasalTemsilci} onChange={patchYasal} />
                  <AdresIletisimBlok kisi={f.yasalTemsilci} onChange={patchYasal} />
                  <FatcaCrsBlok kisi={f.yasalTemsilci} onChange={patchYasal} baslik="Yasal temsilci — FATCA / CRS" />
                </>
              )}
          </div>
        )}

        {aktifStepKey === 'odeyen-arama' && (
          <div className="max-w-3xl space-y-6">
              <KisiAramaBlok
                baslik="Ödeyen / katkı yapan — arama"
                kisi={f.odeyen}
                onChange={patchOdeyen}
                onAra={() => mockKpsSonuc(f.odeyen, patchOdeyen)}
                yuklendi={f.odeyen.kpsYuklendi}
                sonuc={f.odeyen}
              />
              {f.odeyen.kpsYuklendi && <KimlikBlok kisi={f.odeyen} onChange={patchOdeyen} />}
          </div>
        )}

        {aktifStepKey === 'odeyen-adres' && <AdresIletisimBlok kisi={f.odeyen} onChange={patchOdeyen} />}
        {aktifStepKey === 'odeyen-uyum' && <FatcaCrsBlok kisi={f.odeyen} onChange={patchOdeyen} baslik="Ödeyen — FATCA / CRS" />}

        {aktifStepKey === 'plan' && (
          <div className="max-w-4xl space-y-6">
              <Section title="Lehdar">
                <Grid>
                  <Field label="Lehdar belirlenmiş mi?">
                    <select
                      className="form-input"
                      value={f.lehdarVar}
                      onChange={(e) => {
                        const v = e.target.value
                        patch({ lehdarVar: v, lehdarlar: v === 'Evet' && f.lehdarlar.length === 0 ? [emptyLehdar()] : f.lehdarlar })
                      }}
                    >
                      <option>Hayır</option>
                      <option>Evet</option>
                    </select>
                  </Field>
                </Grid>
                {f.lehdarVar === 'Hayır' && (
                  <p className="text-xs text-slate-600 mt-3 p-3 bg-slate-100 rounded-md border">Vefat halinde ödeme kanuni varislere yapılır.</p>
                )}
                {f.lehdarVar === 'Evet' && (
                  <div className="mt-4 space-y-4">
                    <LehdarToplam toplam={lehdarPayToplam} gecerli={lehdarPayGecerli} />
                    {f.lehdarlar.map((l, idx) => (
                      <div key={l.id} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold">Lehdar {idx + 1}</h4>
                          {f.lehdarlar.length > 1 && (
                            <button type="button" onClick={() => lehdarSil(l.id)} className="text-red-600 text-xs font-semibold inline-flex items-center gap-1">
                              <Trash2 className="w-3.5 h-3.5" /> Kaldır
                            </button>
                          )}
                        </div>
                        <Grid>
                          <Field label="Pay (%)">
                            <input type="number" min={0} max={100} step={0.01} className="form-input" value={l.yuzde} onChange={(e) => lehdarGuncelle(l.id, { yuzde: e.target.value })} />
                          </Field>
                        </Grid>
                        <KisiAramaBlok
                          baslik="Lehdar arama"
                          compact
                          kisi={l}
                          onChange={(p) => lehdarGuncelle(l.id, p)}
                          onAra={() => {
                            if (!l.tckn || !l.dogumTarihi) {
                              window.alert('TCKN ve doğum tarihi zorunludur.')
                              return
                            }
                            lehdarGuncelle(l.id, { kpsYuklendi: true, ad: 'LEHDAR', soyad: 'ÖRNEK' })
                          }}
                          yuklendi={l.kpsYuklendi}
                          sonuc={l}
                        />
                      </div>
                    ))}
                    <OutlineButton onClick={lehdarEkle}><Plus className="w-4 h-4" /> Lehdar ekle</OutlineButton>
                  </div>
                )}
              </Section>

              <Section title="Plan">
                <Field label="Plan">
                  <select className="form-input max-w-xl" value={f.planKod} onChange={(e) => patch({ planKod: e.target.value })}>
                    <option value="">Seçiniz</option>
                    {planSecenekleri.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </Section>

              <Section title="Özet">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm border rounded-lg p-4 bg-slate-50/60">
                  <Ozet k="Yaş" v={katilimciYas ?? '—'} />
                  <Ozet k="Yasal temsilci" v={reşitOlmayan ? f.yasalTemsilci.tckn || '—' : '—'} />
                  <Ozet k="Ödeyen" v={odeyenFarkli ? f.odeyen.tckn || '—' : 'Aynı'} />
                  <Ozet k="Lehdar pay" v={f.lehdarVar === 'Evet' ? `%${lehdarPayToplam.toFixed(2)}` : '—'} />
                </dl>
                <div className="mt-4">
                  <PrimaryButton
                    onClick={() => {
                      if (!f.planKod) {
                        window.alert('Plan seçiniz.')
                        return
                      }
                      if (!validateLehdarlar()) return
                      const kayit = {
                        id: f.teklifNo,
                        teklifNo: f.teklifNo,
                        tckn: f.tckn,
                        adSoyad: `${f.ad || ''} ${f.soyad || ''}`.trim() || '—',
                        plan: f.planKod || '—',
                        tarih: new Date().toLocaleDateString('tr-TR'),
                        tutar: Number(f.ortalamaGelir) || 1500,
                        durum: 'Onay Bekliyor',
                        acenteKod: f.acenteKod,
                        acenteAd: f.acenteAd,
                        onaylar: { musteri: 'Bekliyor', kvkk: 'Bekliyor', elektronikIleti: 'Bekliyor', icOnay: 'Bekliyor' },
                        tahsilat: { girildi: false, pciUyumlu: true, odemeAraci: '', kartMaskeli: '', tokenRef: '', sonDortHane: '', kayitTarihi: '' },
                        odemePlani: { donem: 'Aylık', tutar: 1500, baslangic: '—', taksitAdedi: 12 },
                        fonlar: FON_SATIRLARI,
                        rgpf: { yapildi: false, tarih: '', profil: '', skor: null, onerilenFon: '' },
                        katilimci: {
                          tckn: f.tckn,
                          ad: f.ad,
                          soyad: f.soyad,
                          dogum: f.dogumTarihi,
                          cinsiyet: f.cinsiyet,
                          meslek: f.meslek,
                          cep: f.cepTel,
                          email: f.email,
                          adres: `${f.il} / ${f.ilce} — ${f.adres1}`,
                        },
                        katkiYapan: odeyenFarkli
                          ? { ayni: false, tckn: f.odeyen.tckn, ad: f.odeyen.ad, soyad: f.odeyen.soyad }
                          : { ayni: true, tckn: f.tckn, ad: f.ad, soyad: f.soyad },
                        yasalTemsilci: reşitOlmayan
                          ? { tckn: f.yasalTemsilci.tckn, ad: f.yasalTemsilci.ad, soyad: f.yasalTemsilci.soyad, iliski: 'Yasal Temsilci' }
                          : null,
                      }
                      if (onTamamla) onTamamla(kayit)
                      else {
                        window.alert('Teklif oluşturuldu (demo).')
                        sifirla()
                      }
                    }}
                  >
                    Teklifi tamamla (demo)
                  </PrimaryButton>
                </div>
              </Section>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex justify-between gap-3 bg-white">
        <OutlineButton onClick={() => setAdim((x) => Math.max(0, x - 1))} disabled={adim <= 0}>
          <ChevronLeft className="w-4 h-4" /> Önceki
        </OutlineButton>
        {adim < steps.length - 1 ? (
          <PrimaryButton onClick={sonraki}>Sonraki <ChevronRight className="w-4 h-4" /></PrimaryButton>
        ) : (
          <span className="text-xs text-slate-500 self-center">Son adımda tamamlayın.</span>
        )}
      </div>
    </div>
  )
}


function InfoBox({ children }) {
  return <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-900">{children}</div>
}

function KisiAramaBlok({ baslik, kisi, onChange, onAra, yuklendi, sonuc, compact }) {
  return (
    <Section title={baslik}>
      <Grid>
        <Field label="TCKN / VKN / YKN">
          <input className="form-input font-mono" maxLength={11} value={kisi.tckn || ''} onChange={(e) => onChange({ tckn: e.target.value.replace(/\D/g, '') })} />
        </Field>
        <Field label="Doğum tarihi">
          <input type="date" className="form-input" value={kisi.dogumTarihi || ''} onChange={(e) => onChange({ dogumTarihi: e.target.value })} />
        </Field>
        <Field label="Baba adı">
          <input className="form-input" value={kisi.babaAdi || ''} onChange={(e) => onChange({ babaAdi: e.target.value })} />
        </Field>
      </Grid>
      <div>
        <PrimaryButton onClick={onAra}><Search className="w-4 h-4" /> Ara</PrimaryButton>
      </div>
      {yuklendi && !compact && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-emerald-700 font-semibold mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Sorgu başarılı</p>
          <Grid>
            <Field label="Ad"><input className="form-input bg-slate-50" readOnly value={sonuc.ad || ''} /></Field>
            <Field label="Soyad"><input className="form-input bg-slate-50" readOnly value={sonuc.soyad || ''} /></Field>
          </Grid>
        </div>
      )}
      {yuklendi && compact && sonuc?.ad && <p className="text-sm text-emerald-700 mt-2">{sonuc.ad} {sonuc.soyad}</p>}
    </Section>
  )
}

function KimlikBlok({ kisi, onChange }) {
  return (
    <div className="max-w-3xl">
      <Section title="Kimlik ve KYC">
        <Grid>
          <Field label="Kimlik türü">
            <select className="form-input" value={kisi.kimlikTuru} onChange={(e) => onChange({ kimlikTuru: e.target.value })}>
              <option>NÜFUS CÜZDANI</option>
              <option>Yeni T.C. Kimlik Kartı</option>
            </select>
          </Field>
          <Field label="Kimlik seri no"><input className="form-input" value={kisi.kimlikSeri || ''} onChange={(e) => onChange({ kimlikSeri: e.target.value })} /></Field>
          <Field label="Meslek"><input className="form-input" value={kisi.meslek || ''} onChange={(e) => onChange({ meslek: e.target.value })} /></Field>
        </Grid>
      </Section>
    </div>
  )
}

function AdresIletisimBlok({ kisi, onChange }) {
  return (
    <div className="max-w-3xl space-y-6">
      <Section title="Adres">
        <Grid>
          <Field label="Ülke"><input className="form-input" value={kisi.ulke} onChange={(e) => onChange({ ulke: e.target.value })} /></Field>
          <Field label="İl">
            <select className="form-input" value={kisi.il} onChange={(e) => onChange({ il: e.target.value })}>
              {IL_LISTE.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="İlçe">
            <select className="form-input" value={kisi.ilce} onChange={(e) => onChange({ ilce: e.target.value })}>
              {ILCE_LISTE.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Adres satırı 1"><input className="form-input" value={kisi.adres1} onChange={(e) => onChange({ adres1: e.target.value })} /></Field>
          <Field label="Adres satırı 2"><input className="form-input" value={kisi.adres2} onChange={(e) => onChange({ adres2: e.target.value })} /></Field>
        </Grid>
      </Section>
      <Section title="İletişim">
        <Grid>
          <Field label="Cep telefonu"><input className="form-input" value={kisi.cepTel} onChange={(e) => onChange({ cepTel: e.target.value })} /></Field>
          <Field label="E-posta"><input type="email" className="form-input" value={kisi.email} onChange={(e) => onChange({ email: e.target.value })} /></Field>
        </Grid>
      </Section>
    </div>
  )
}

function FatcaCrsBlok({ kisi, onChange, baslik }) {
  return (
    <div>
      <Section title={baslik}>
        <Grid>
          <Field label="Vergi mükellefi olduğu ülke"><input className="form-input" value={kisi.fatcaVergiUlke} onChange={(e) => onChange({ fatcaVergiUlke: e.target.value })} /></Field>
          <Field label="Doğduğu ülke"><input className="form-input" value={kisi.fatcaDogumUlke} onChange={(e) => onChange({ fatcaDogumUlke: e.target.value })} /></Field>
          <Field label="ABD kalıcı ikamet?">
            <select className="form-input" value={kisi.fatcaAbdIkamat} onChange={(e) => onChange({ fatcaAbdIkamat: e.target.value })}><option>Hayır</option><option>Evet</option></select>
          </Field>
          <Field label="US Green Card?">
            <select className="form-input" value={kisi.fatcaGreenCard} onChange={(e) => onChange({ fatcaGreenCard: e.target.value })}><option>Hayır</option><option>Evet</option></select>
          </Field>
          <Field label="Mukim ülke var mı?">
            <select className="form-input" value={kisi.mukimUlkeVar} onChange={(e) => onChange({ mukimUlkeVar: e.target.value })}><option>Hayır</option><option>Evet</option></select>
          </Field>
          {kisi.mukimUlkeVar === 'Evet' && (
            <>
              <Field label="Vergi kimlik no (TIN)"><input className="form-input" value={kisi.mukimVergiKimlikNo || ''} onChange={(e) => onChange({ mukimVergiKimlikNo: e.target.value })} /></Field>
              <Field label="Mukim belgesi alındı mı?">
                <select className="form-input" value={kisi.mukimBelge} onChange={(e) => onChange({ mukimBelge: e.target.value })}><option>Hayır</option><option>Evet</option></select>
              </Field>
            </>
          )}
          <Field label="Açıklama" className="md:col-span-2">
            <textarea className="form-input min-h-[72px]" value={kisi.mukimAciklama || ''} onChange={(e) => onChange({ mukimAciklama: e.target.value })} />
          </Field>
        </Grid>
      </Section>
    </div>
  )
}

function LehdarToplam({ toplam, gecerli }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-md border ${gecerli ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
      {gecerli ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      Lehdar pay toplamı: %{toplam.toFixed(2)} {gecerli ? '(geçerli)' : '— %100 olmalıdır'}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 mb-6">
      <h3 className="text-sm font-bold text-slate-800 mb-3">{title}</h3>
      {children}
    </section>
  )
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
}

function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-slate-400 mt-0.5">{hint}</span>}
    </label>
  )
}

function Ozet({ k, v }) {
  return (
    <>
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-medium text-slate-800">{v}</dd>
    </>
  )
}
