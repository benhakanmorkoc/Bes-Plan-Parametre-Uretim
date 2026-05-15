import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import IkametgahAdresModal, { formatIkametgahOzet, ikametgahFromForm } from './IkametgahAdresModal'

const KIMLIK_TURLERI = [
  'NÜFUS CÜZDANI',
  'Ehliyet',
  'Evlilik Cüzdanı',
  'Nüfus Kayıt Örneği',
  'Pasaport',
  'Diğer',
]

const EGITIM_OPTIONS = ['İLKOKUL', 'ORTAOKUL', 'LİSE', 'ÜNİVERSİTE', 'YÜKSEK LİSANS', 'DOKTORA']
const GELIR_OPTIONS = ['0-150', '150-750', '750-1500', '1500+']
const MESLEK_OPTIONS = ['ACENTE', 'MÜHENDİS', 'DOKTOR', 'ÖĞRETMEN', 'MEMUR']
const ULKE_OPTIONS = ['TÜRKİYE', 'ALMANYA', 'ABD', 'İNGİLTERE']

function DetayBaslik({ children }) {
  return (
    <div className="bg-slate-100 border border-slate-200 border-b-0 px-4 py-2.5 mt-6 first:mt-0">
      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{children}</h4>
    </div>
  )
}

function DetayPanel({ children }) {
  return <div className="border border-slate-200 border-t-0 rounded-b-lg p-4 md:p-5 bg-white">{children}</div>
}

function ZorunluUyari() {
  return <p className="text-[11px] text-red-600 font-semibold mt-1">⚠ Zorunlu alan!</p>
}

function UnderlineField({ label, required, children, hint }) {
  return (
    <div className="space-y-1 min-w-0">
      <label className={`text-xs font-bold uppercase ${required ? 'text-red-600' : 'text-slate-600'}`}>{label}</label>
      {children}
      {hint}
    </div>
  )
}

function EvetHayirGroup({ label, name, value, onChange, required }) {
  return (
    <div className="space-y-1">
      <label className={`text-xs font-bold uppercase ${required ? 'text-red-600' : 'text-slate-600'}`}>{label}</label>
      <div className="flex gap-6 pt-1">
        {['Evet', 'Hayır'].map((v) => (
          <label key={v} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
            <input type="radio" name={name} checked={value === v} onChange={() => onChange(v)} className="w-4 h-4 text-blue-600" />
            {v}
          </label>
        ))}
      </div>
      {required && !value && <ZorunluUyari />}
    </div>
  )
}

function formatDogumTr(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('tr-TR')
}

export default function KatilimciStep({ formData, onChange, onSearch, isLoading }) {
  const set = (field, value) => onChange(field, value)
  const bulundu = Boolean(formData.ad)
  const [ikametModalOpen, setIkametModalOpen] = useState(false)

  const saveIkametgah = (draft) => {
    const lokasyon = [draft.ilce, draft.il].filter(Boolean).join(' / ')
    onChange({
      ikametUlke: draft.ulke,
      ikametIl: draft.il,
      ikametIlce: draft.ilce,
      ikametAdres1: draft.adres1,
      ikametAdres2: draft.adres2,
      ikametAdres3: draft.adres3,
      ikametgah: lokasyon,
      ikametgahAdres: formatIkametgahOzet(draft),
    })
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
        <h4 className="text-sm font-bold text-blue-900 mb-6 flex items-center gap-2">
          <Search size={16} /> Katılımcı Bilgileri Arama
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <UnderlineField label="TCKN/VKN/YKN" required>
            <input
              className="w-full border-b-2 border-slate-200 p-2 focus:border-blue-600 outline-none bg-transparent font-mono"
              placeholder="Zorunlu alan!"
              value={formData.tckn}
              onChange={(e) => set('tckn', e.target.value)}
            />
            {!formData.tckn.trim() && <ZorunluUyari />}
          </UnderlineField>
          <UnderlineField label="Doğum Tarihi" required>
            <input
              type="date"
              className="w-full border-b-2 border-slate-200 p-2 focus:border-blue-600 outline-none bg-transparent"
              value={formData.searchDogumTarihi}
              onChange={(e) => set('searchDogumTarihi', e.target.value)}
            />
            {!formData.searchDogumTarihi && <ZorunluUyari />}
          </UnderlineField>
          <button
            type="button"
            onClick={onSearch}
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2.5 rounded font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Search size={16} /> Ara
          </button>
        </div>
        <div className="mt-6 max-w-md">
          <label className="text-xs font-bold text-slate-600 uppercase">Baba Adı</label>
          <input
            type="text"
            className="w-full border-b-2 border-slate-200 p-2 mt-1 focus:border-blue-600 outline-none bg-transparent"
            value={formData.babaAdi}
            onChange={(e) => set('babaAdi', e.target.value)}
          />
        </div>
      </section>

      {bulundu && (
        <div className="space-y-0 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-white border-b border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Ad Soyad</label>
              <p className="font-bold text-lg text-slate-900 mt-1">
                {formData.ad} {formData.soyad}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Cinsiyet</label>
              <select
                className="w-full mt-1 border border-slate-200 rounded p-2 text-sm font-semibold"
                value={formData.cinsiyet}
                onChange={(e) => set('cinsiyet', e.target.value)}
              >
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Meslek</label>
              <select
                className="w-full mt-1 border border-slate-200 rounded p-2 text-sm font-semibold"
                value={formData.meslek}
                onChange={(e) => set('meslek', e.target.value)}
              >
                {MESLEK_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DetayBaslik>Kimlik Bilgileri</DetayBaslik>
          <DetayPanel>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Kimlik Türü</label>
                <select
                  size={6}
                  className="w-full border border-slate-200 rounded text-sm font-medium text-slate-800"
                  value={formData.kimlikTuru}
                  onChange={(e) => set('kimlikTuru', e.target.value)}
                >
                  {KIMLIK_TURLERI.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <UnderlineField label="Kimlik Seri No">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                    value={formData.kimlikSeriNo}
                    onChange={(e) => set('kimlikSeriNo', e.target.value)}
                  />
                </UnderlineField>
                <UnderlineField label="Doğum Tarihi">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm bg-slate-50"
                    readOnly
                    value={formatDogumTr(formData.searchDogumTarihi)}
                  />
                </UnderlineField>
                <UnderlineField label="Baba Adı">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                    value={formData.babaAdi}
                    onChange={(e) => set('babaAdi', e.target.value)}
                  />
                </UnderlineField>
                <UnderlineField label="Anne Adı">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                    value={formData.anneAdi}
                    onChange={(e) => set('anneAdi', e.target.value)}
                  />
                </UnderlineField>
                <UnderlineField label="Uyruk">
                  <select
                    className="w-full border border-slate-200 rounded p-2 text-sm"
                    value={formData.uyruk}
                    onChange={(e) => set('uyruk', e.target.value)}
                  >
                    {ULKE_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </UnderlineField>
                <UnderlineField label="Medeni Hal">
                  <select
                    className="w-full border border-slate-200 rounded p-2 text-sm"
                    value={formData.medeniHal}
                    onChange={(e) => set('medeniHal', e.target.value)}
                  >
                    <option value="Evli">Evli</option>
                    <option value="Bekar">Bekar</option>
                    <option value="Boşanmış">Boşanmış</option>
                  </select>
                </UnderlineField>
                <UnderlineField label="Vergi Kimlik Numarası">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                    value={formData.vergiKimlikNo}
                    onChange={(e) => set('vergiKimlikNo', e.target.value)}
                  />
                </UnderlineField>
                <UnderlineField label="Vergi Dairesi">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                    value={formData.vergiDairesi}
                    onChange={(e) => set('vergiDairesi', e.target.value)}
                  />
                </UnderlineField>
                <UnderlineField label="Çocuk Sayısı">
                  <input
                    className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                    value={formData.cocukSayisi}
                    onChange={(e) => set('cocukSayisi', e.target.value)}
                  />
                </UnderlineField>
                <UnderlineField label="Mavi Kart Veriliş T.">
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded p-2 text-sm"
                    value={formData.maviKartTarihi}
                    onChange={(e) => set('maviKartTarihi', e.target.value)}
                  />
                </UnderlineField>
              </div>
            </div>
          </DetayPanel>

          <DetayBaslik>Eğitim / Meslek Bilgileri</DetayBaslik>
          <DetayPanel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <UnderlineField label="Eğitim Durumu">
                <select
                  className="w-full border border-slate-200 rounded p-2 text-sm"
                  value={formData.egitimDurumu}
                  onChange={(e) => set('egitimDurumu', e.target.value)}
                >
                  {EGITIM_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </UnderlineField>
              <UnderlineField label="Aylık Ortalama Gelir (USD)">
                <select
                  className="w-full border border-slate-200 rounded p-2 text-sm"
                  value={formData.gelir}
                  onChange={(e) => set('gelir', e.target.value)}
                >
                  {GELIR_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </UnderlineField>
              <UnderlineField label="Meslek">
                <select
                  className="w-full border border-slate-200 rounded p-2 text-sm"
                  value={formData.meslekDetay || formData.meslek}
                  onChange={(e) => set('meslekDetay', e.target.value)}
                >
                  {MESLEK_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </UnderlineField>
              <UnderlineField label="Kurum Sicil No">
                <input
                  className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                  value={formData.kurumSicilNo}
                  onChange={(e) => set('kurumSicilNo', e.target.value)}
                />
              </UnderlineField>
              <UnderlineField label="İşyeri Ünvan Açıklaması">
                <input
                  className="w-full border-b border-slate-200 p-1.5 text-sm outline-none focus:border-blue-600"
                  value={formData.isyeriUnvani}
                  onChange={(e) => set('isyeriUnvani', e.target.value)}
                />
              </UnderlineField>
            </div>
          </DetayPanel>

          <DetayBaslik>Adres Bilgisi</DetayBaslik>
          <DetayPanel>
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Adres Bilgisi - İkametgah</label>
                  <input
                    className="w-full border-b border-slate-200 p-2 text-sm mt-1 outline-none focus:border-blue-600"
                    value={formData.ikametgahAdres}
                    onChange={(e) => set('ikametgahAdres', e.target.value)}
                  />
                  {!formData.ikametgahAdres && <ZorunluUyari />}
                </div>
                <button
                  type="button"
                  onClick={() => setIkametModalOpen(true)}
                  className="shrink-0 mt-5 sm:mt-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm"
                >
                  YENİ
                </button>
              </div>
              <EvetHayirGroup
                label="İkametgah Adresi ile İletişim Adresi Aynı mı?"
                name="iletisimAdresAyni"
                value={formData.iletisimAdresAyni}
                onChange={(v) => set('iletisimAdresAyni', v)}
                required
              />
              <EvetHayirGroup
                label="Mukim Ülke Var mı?"
                name="mukimUlkeVarmi"
                value={formData.mukimUlkeVarmi}
                onChange={(v) => set('mukimUlkeVarmi', v)}
              />
            </div>
          </DetayPanel>

          <DetayBaslik>İletişim Bilgisi</DetayBaslik>
          <DetayPanel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { key: 'evIsTel', label: 'Ev/İş Telefonu', zorunlu: false },
                { key: 'faks', label: 'Faks', zorunlu: false },
                { key: 'cepTel', label: 'Cep Telefonu', zorunlu: true },
                { key: 'email', label: 'E-Posta', zorunlu: true },
              ].map((f) => (
                <div key={f.key} className="flex gap-2 items-start">
                  <div className="flex-1 min-w-0">
                    <label className={`text-xs font-bold uppercase ${f.zorunlu ? 'text-red-600' : 'text-slate-600'}`}>{f.label}</label>
                    <input
                      className="w-full border-b border-slate-200 p-2 text-sm mt-1 outline-none focus:border-blue-600"
                      value={formData[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                    {f.zorunlu && !formData[f.key] && <ZorunluUyari />}
                  </div>
                  <button type="button" className="mt-6 text-blue-700 text-xs font-bold flex flex-col items-center gap-0.5 shrink-0">
                    <span className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold">+</span>
                    Yeni
                  </button>
                </div>
              ))}
            </div>
          </DetayPanel>

          <DetayBaslik>Fatca Bilgileri</DetayBaslik>
          <DetayPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UnderlineField label="Vergi Mükellefi Olduğu Ülke" required>
                <select
                  className="w-full border border-slate-200 rounded p-2 text-sm"
                  value={formData.vergiMukkellefUlke}
                  onChange={(e) => set('vergiMukkellefUlke', e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {ULKE_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {!formData.vergiMukkellefUlke && <ZorunluUyari />}
              </UnderlineField>
              <UnderlineField label="Doğduğu Ülke" required>
                <select
                  className="w-full border border-slate-200 rounded p-2 text-sm"
                  value={formData.dogduguUlke}
                  onChange={(e) => set('dogduguUlke', e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {ULKE_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {!formData.dogduguUlke && <ZorunluUyari />}
              </UnderlineField>
              <EvetHayirGroup
                label="Amerika'da Kalıcı İkamet İzni Var mı?"
                name="fatcaAbdIkamet"
                value={formData.fatcaAbdIkamet}
                onChange={(v) => set('fatcaAbdIkamet', v)}
              />
              <EvetHayirGroup
                label="US GreenCard var mı?"
                name="usGreenCard"
                value={formData.usGreenCard}
                onChange={(v) => set('usGreenCard', v)}
              />
            </div>
          </DetayPanel>
        </div>
      )}

      <IkametgahAdresModal
        open={ikametModalOpen}
        onClose={() => setIkametModalOpen(false)}
        initial={ikametgahFromForm(formData)}
        onSave={saveIkametgah}
      />
    </div>
  )
}
