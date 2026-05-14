import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, CheckCircle2 } from 'lucide-react'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { tariffeListesi } from '../../data/mockData'

const STEPS = [
  { key: 'satis', title: 'Teklif ve satış', hint: 'Teklif tipi, acente, ürün tipi, dijital form, aracı ve tanzim (ODT: Teklif Bilgileri, Aracı, Ek Bilgiler).' },
  { key: 'katilimci', title: 'Katılımcı arama', hint: 'TCKN/VKN/YKN, doğum, baba adı; KPS/Müşteri Master sorgusu (ODT: Katılımcı → Arama Kriterleri).' },
  { key: 'kimlik', title: 'Kimlik ve KYC', hint: 'Kimlik alanları, eğitim/meslek, demografi (ODT: Kimlik, Eğitim/Meslek).' },
  { key: 'adres', title: 'Adres ve iletişim', hint: 'İkamet/iletişim, lokasyon, NVI uyumu (ODT: Adres, Lokasyon, İletişim).' },
  { key: 'uyum', title: 'FATCA / CRS', hint: 'Vergi mukimliği, ABD beyanları, mukim adresi (ODT: FATCA, Vergi Uyumu).' },
  { key: 'plan', title: 'Lehdar, plan ve fon', hint: 'Lehdar seçimi, plan, fon dağılımı ve özet (ODT: Lehdar, Plan Seçimi, Fon Yönetimi).' },
]

const IL_LISTE = ['İSTANBUL', 'ANKARA', 'İZMİR', 'BURSA']
const ILCE_LISTE = ['KADIKÖY', 'ÇANKAYA', 'KONAK', 'OSMANGAZİ']

const FON_SATIRLARI = [
  { kod: 'AUA', varlik: 'TL Sabit Getiri', yuzde: 31 },
  { kod: 'AUA', varlik: 'TL Hisse Senedi', yuzde: 23 },
  { kod: 'AUA', varlik: 'Eurobond', yuzde: 17 },
  { kod: 'AUA', varlik: 'Yabancı Hisse', yuzde: 18 },
  { kod: 'AUA', varlik: 'Altın', yuzde: 11 },
]

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
  mukimAciklama: '',
  lehdarVar: 'Hayır',
  lehdarTckn: '',
  planKod: '',
  fonSablon: 'onerilen',
})

export default function TeklifAllianz() {
  const [adim, setAdim] = useState(0)
  const [f, setF] = useState(initialForm)
  const [kpsYuklendi, setKpsYuklendi] = useState(false)

  const planSecenekleri = useMemo(
    () => tariffeListesi.map((p) => ({ value: p.ad, label: `${p.id} — ${p.ad}` })),
    [],
  )

  const patch = (p) => setF((prev) => ({ ...prev, ...p }))

  const kpsAra = () => {
    if (!f.tckn || f.tckn.length < 10 || !f.dogumTarihi) {
      window.alert('TCKN ve doğum tarihi zorunludur (demo).')
      return
    }
    setKpsYuklendi(true)
    patch({
      kimlikSeri: 'A123456',
      cinsiyet: 'Erkek',
      soyad: 'ÖRNEK SOYAD',
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

  const sonraki = () => {
    if (adim === 1 && !kpsYuklendi) {
      window.alert('Önce “Müşteri sorgula” ile KPS sonucunu getirin (demo).')
      return
    }
    if (adim === 3) {
      if (!f.adres1.trim() || !f.cepTel.trim() || !f.email.trim()) {
        window.alert('Adres satırı 1, cep telefonu ve e-posta zorunludur.')
        return
      }
    }
    setAdim((x) => Math.min(STEPS.length - 1, x + 1))
  }

  const onceki = () => setAdim((x) => Math.max(0, x - 1))

  const sifirla = () => {
    setF(initialForm())
    setKpsYuklendi(false)
    setAdim(0)
  }

  const fonToplam = useMemo(() => FON_SATIRLARI.reduce((a, r) => a + r.yuzde, 0), [])

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Allianz Teklif"
        description="Allianz Başvuru / Teklif ekranları (ODT) ile hizalanmış çok adımlı prototip — veri ve servisler mock."
        right={<OutlineButton onClick={sifirla}>Yeni süreç</OutlineButton>}
      />

      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="flex flex-wrap gap-2 mb-3">
          {STEPS.map((s, i) => (
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
        <p className="text-xs text-slate-500 leading-snug">{STEPS[adim].hint}</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {adim === 0 && (
          <div className="max-w-3xl space-y-6">
            <Section title="Teklif bilgileri">
              <Grid>
                <Field label="Teklif tipi" hint="Satış kanalı (Banka, Acente, Çağrı Merkezi vb.)">
                  <input className="form-input" value={f.teklifTipi} onChange={(e) => patch({ teklifTipi: e.target.value })} />
                </Field>
                <Field label="Şirket" hint="Tüzel kişilik">
                  <input className="form-input bg-slate-50" readOnly value={f.sirket} />
                </Field>
                <Field label="Acente kodu">
                  <input className="form-input" value={f.acenteKod} onChange={(e) => patch({ acenteKod: e.target.value })} />
                </Field>
                <Field label="Acente adı" hint="Master veriden kodla eşleşir">
                  <input className="form-input" value={f.acenteAd} onChange={(e) => patch({ acenteAd: e.target.value })} />
                </Field>
                <Field label="Ürün tipi">
                  <select className="form-input" value={f.urunTipi} onChange={(e) => patch({ urunTipi: e.target.value })}>
                    <option>Bireysel Teklif Girişi</option>
                    <option>Gruba bağlı</option>
                    <option>Kurumsal</option>
                  </select>
                </Field>
                <Field label="Dijital form">
                  <select className="form-input" value={f.dijitalForm} onChange={(e) => patch({ dijitalForm: e.target.value })}>
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </Field>
                <Field label="Mesafeli satış mı?">
                  <select className="form-input" value={f.mesafeliSatis} onChange={(e) => patch({ mesafeliSatis: e.target.value })}>
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </Field>
              </Grid>
            </Section>
            <Section title="Aracı bilgileri">
              <Grid>
                <Field label="Aracı sicil" hint="SEGEM/BES lisanslı personel">
                  <input className="form-input" value={f.araciSicil} onChange={(e) => patch({ araciSicil: e.target.value })} />
                </Field>
              </Grid>
            </Section>
            <Section title="Ek bilgiler">
              <Grid>
                <Field label="Acente tanzim tarihi">
                  <input type="date" className="form-input" value={f.tanzimTarihi} onChange={(e) => patch({ tanzimTarihi: e.target.value })} />
                </Field>
                <Field label="Katılımcı ve katkı yapan aynı mı?">
                  <select className="form-input" value={f.katilimciKatkiciAyni} onChange={(e) => patch({ katilimciKatkiciAyni: e.target.value })}>
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </Field>
              </Grid>
            </Section>
          </div>
        )}

        {adim === 1 && (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-900">
              <strong>Teklif no:</strong> <span className="font-mono">{f.teklifNo}</span> — 1. adımda üretilen takip numarası (mock).
            </div>
            <Section title="Arama kriterleri">
              <Grid>
                <Field label="TCKN / VKN / YKN" hint="MERNIS-KPS">
                  <input className="form-input font-mono" maxLength={11} value={f.tckn} onChange={(e) => patch({ tckn: e.target.value.replace(/\D/g, '') })} />
                </Field>
                <Field label="Doğum tarihi" hint="Zorunlu">
                  <input type="date" className="form-input" value={f.dogumTarihi} onChange={(e) => patch({ dogumTarihi: e.target.value })} />
                </Field>
                <Field label="Baba adı" hint="Ek doğrulama">
                  <input className="form-input" value={f.babaAdiArama} onChange={(e) => patch({ babaAdiArama: e.target.value })} />
                </Field>
              </Grid>
              <div className="mt-4">
                <PrimaryButton onClick={kpsAra}>
                  <Search className="w-4 h-4" /> Müşteri sorgula (KPS demo)
                </PrimaryButton>
              </div>
            </Section>
            {kpsYuklendi && (
              <Section title="Sonuç paneli — katılımcı detay">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold mb-3">
                  <CheckCircle2 className="w-5 h-5" /> Sorgu başarılı (mock)
                </div>
                <Grid>
                  <Field label="Soyad"><input className="form-input bg-slate-50" readOnly value={f.soyad} /></Field>
                  <Field label="Cinsiyet"><input className="form-input bg-slate-50" readOnly value={f.cinsiyet} /></Field>
                  <Field label="Anne adı"><input className="form-input bg-slate-50" readOnly value={f.anneAdi} /></Field>
                  <Field label="Baba adı"><input className="form-input bg-slate-50" readOnly value={f.babaAdiArama} /></Field>
                </Grid>
              </Section>
            )}
          </div>
        )}

        {adim === 2 && (
          <div className="max-w-3xl space-y-6">
            <Section title="Kimlik">
              <Grid>
                <Field label="Kimlik türü">
                  <select className="form-input" value={f.kimlikTuru} onChange={(e) => patch({ kimlikTuru: e.target.value })}>
                    <option>NÜFUS CÜZDANI</option>
                    <option>Yeni T.C. Kimlik Kartı</option>
                    <option>Pasaport</option>
                  </select>
                </Field>
                <Field label="Kimlik seri no">
                  <input className="form-input" value={f.kimlikSeri} onChange={(e) => patch({ kimlikSeri: e.target.value })} />
                </Field>
              </Grid>
            </Section>
            <Section title="Eğitim / meslek">
              <Grid>
                <Field label="Eğitim durumu">
                  <input className="form-input" value={f.egitim} onChange={(e) => patch({ egitim: e.target.value })} />
                </Field>
                <Field label="Ortalama gelir">
                  <input className="form-input" value={f.ortalamaGelir} onChange={(e) => patch({ ortalamaGelir: e.target.value })} />
                </Field>
                <Field label="Meslek">
                  <input className="form-input" value={f.meslek} onChange={(e) => patch({ meslek: e.target.value })} />
                </Field>
                <Field label="İşyeri ünvanı">
                  <input className="form-input" value={f.isyeriUnvani} onChange={(e) => patch({ isyeriUnvani: e.target.value })} />
                </Field>
              </Grid>
            </Section>
          </div>
        )}

        {adim === 3 && (
          <div className="max-w-3xl space-y-6">
            <Section title="Adres">
              <Grid>
                <Field label="İletişim adresi ikamet ile aynı mı?">
                  <select className="form-input" value={f.ikametAyni} onChange={(e) => patch({ ikametAyni: e.target.value })}>
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </Field>
                <Field label="Mukim ülke var mı? (CRS)">
                  <select className="form-input" value={f.mukimUlkeVar} onChange={(e) => patch({ mukimUlkeVar: e.target.value })}>
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </Field>
              </Grid>
            </Section>
            <Section title="Lokasyon">
              <Grid>
                <Field label="Ülke">
                  <input className="form-input" value={f.ulke} onChange={(e) => patch({ ulke: e.target.value })} />
                </Field>
                <Field label="İl">
                  <select className="form-input" value={f.il} onChange={(e) => patch({ il: e.target.value })}>
                    {IL_LISTE.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="İlçe">
                  <select className="form-input" value={f.ilce} onChange={(e) => patch({ ilce: e.target.value })}>
                    {ILCE_LISTE.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Adres satırı 1" hint="Zorunlu">
                  <input className="form-input" value={f.adres1} onChange={(e) => patch({ adres1: e.target.value })} />
                </Field>
                <Field label="Adres satırı 2">
                  <input className="form-input" value={f.adres2} onChange={(e) => patch({ adres2: e.target.value })} />
                </Field>
                <Field label="Adres satırı 3">
                  <input className="form-input" value={f.adres3} onChange={(e) => patch({ adres3: e.target.value })} />
                </Field>
              </Grid>
            </Section>
            <Section title="İletişim">
              <Grid>
                <Field label="Ev/iş telefonu">
                  <input className="form-input" value={f.evTel} onChange={(e) => patch({ evTel: e.target.value })} />
                </Field>
                <Field label="Faks">
                  <input className="form-input" value={f.fax} onChange={(e) => patch({ fax: e.target.value })} />
                </Field>
                <Field label="Cep telefonu" hint="Zorunlu — SMS">
                  <input className="form-input" value={f.cepTel} onChange={(e) => patch({ cepTel: e.target.value })} />
                </Field>
                <Field label="E-posta" hint="Zorunlu">
                  <input type="email" className="form-input" value={f.email} onChange={(e) => patch({ email: e.target.value })} />
                </Field>
              </Grid>
            </Section>
          </div>
        )}

        {adim === 4 && (
          <div className="max-w-3xl space-y-6">
            <Section title="FATCA">
              <Grid>
                <Field label="Vergi mükellefi olduğu ülke">
                  <input className="form-input" value={f.fatcaVergiUlke} onChange={(e) => patch({ fatcaVergiUlke: e.target.value })} />
                </Field>
                <Field label="Doğduğu ülke">
                  <input className="form-input" value={f.fatcaDogumUlke} onChange={(e) => patch({ fatcaDogumUlke: e.target.value })} />
                </Field>
                <Field label="ABD'de kalıcı ikamet izni var mı?">
                  <select className="form-input" value={f.fatcaAbdIkamat} onChange={(e) => patch({ fatcaAbdIkamat: e.target.value })}>
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </Field>
                <Field label="US Green Card var mı?">
                  <select className="form-input" value={f.fatcaGreenCard} onChange={(e) => patch({ fatcaGreenCard: e.target.value })}>
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </Field>
              </Grid>
            </Section>
            <Section title="Vergi uyumu (CRS)">
              <Grid>
                <Field label="Mukim belgesi teslim alındı mı?">
                  <select className="form-input" value={f.mukimBelge} onChange={(e) => patch({ mukimBelge: e.target.value })}>
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </Field>
                <Field label="Açıklama" hint="Mukimlik / TIN ile ilgili not">
                  <textarea className="form-input min-h-[80px]" value={f.mukimAciklama} onChange={(e) => patch({ mukimAciklama: e.target.value })} />
                </Field>
              </Grid>
            </Section>
          </div>
        )}

        {adim === 5 && (
          <div className="max-w-4xl space-y-6">
            <Section title="Lehdar">
              <Grid>
                <Field label="Lehdar belirlenmiş mi?">
                  <select className="form-input" value={f.lehdarVar} onChange={(e) => patch({ lehdarVar: e.target.value })}>
                    <option>Hayır</option>
                    <option>Evet</option>
                  </select>
                </Field>
                {f.lehdarVar === 'Evet' && (
                  <Field label="Lehdar TCKN / VKN">
                    <input className="form-input font-mono" value={f.lehdarTckn} onChange={(e) => patch({ lehdarTckn: e.target.value })} />
                  </Field>
                )}
              </Grid>
            </Section>
            <Section title="Plan seçimi">
              <Field label="Plan">
                <select className="form-input max-w-xl" value={f.planKod} onChange={(e) => patch({ planKod: e.target.value })}>
                  <option value="">Seçiniz</option>
                  {planSecenekleri.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </Section>
            <Section title="Fon yönetimi — varlık dağılımı (örnek AUA sepeti)">
              <div className="flex flex-wrap gap-2 mb-3">
                <OutlineButton small onClick={() => patch({ fonSablon: 'tl' })}>Daha fazla TL</OutlineButton>
                <OutlineButton small onClick={() => patch({ fonSablon: 'doviz' })}>Daha fazla döviz</OutlineButton>
                <OutlineButton small onClick={() => patch({ fonSablon: 'onerilen' })}>Önerilene dön</OutlineButton>
              </div>
              <p className="text-xs text-slate-500 mb-2">Şablon: {f.fonSablon} (demo; yüzdeler ODT’deki örnekle sabit)</p>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left px-3 py-2">Fon kodu</th>
                      <th className="text-left px-3 py-2">Varlık tipi</th>
                      <th className="text-right px-3 py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FON_SATIRLARI.map((r, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono">{r.kod}</td>
                        <td className="px-3 py-2">{r.varlik}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-semibold">{r.yuzde}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                      <td className="px-3 py-2" colSpan={2}>
                        Toplam
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{fonToplam}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>
            <Section title="Özet">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border border-slate-200 rounded-lg p-4 bg-slate-50/60">
                <Ozet k="Teklif no" v={f.teklifNo} />
                <Ozet k="Acente" v={`${f.acenteKod} ${f.acenteAd}`} />
                <Ozet k="TCKN" v={f.tckn || '—'} />
                <Ozet k="Soyad" v={f.soyad || '—'} />
                <Ozet k="Plan" v={f.planKod || '—'} />
                <Ozet k="E-posta" v={f.email || '—'} />
              </dl>
              <div className="mt-4 flex gap-2">
                <PrimaryButton
                  onClick={() => {
                    if (!f.planKod) {
                      window.alert('Plan seçiniz.')
                      return
                    }
                    window.alert('Teklif oluşturuldu (demo). Liste ekranı entegrasyonu sonraya bırakıldı.')
                    sifirla()
                  }}
                >
                  Teklifi tamamla (demo)
                </PrimaryButton>
              </div>
            </Section>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap justify-between gap-3 bg-white">
        <OutlineButton onClick={onceki} disabled={adim <= 0}>
          <ChevronLeft className="w-4 h-4" /> Önceki
        </OutlineButton>
        {adim < STEPS.length - 1 ? (
          <PrimaryButton onClick={sonraki}>
            Sonraki <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        ) : (
          <span className="text-xs text-slate-500 self-center">Son adımda “Teklifi tamamla”yı kullanın.</span>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
      <h3 className="text-sm font-bold text-slate-800 mb-3">{title}</h3>
      {children}
    </section>
  )
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
}

function Field({ label, hint, children }) {
  return (
    <label className="block min-w-0">
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
      <dd className="font-medium text-slate-800 text-right sm:text-left break-words">{v}</dd>
    </>
  )
}
