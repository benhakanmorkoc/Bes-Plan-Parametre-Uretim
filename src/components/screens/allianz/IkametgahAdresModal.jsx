import { useEffect, useMemo, useState } from 'react'
import Modal from '../../ui/Modal'

const ULKE_LIST = ['TÜRKİYE', 'ALMANYA', 'ABD', 'İNGİLTERE', 'FRANSA']

const IL_ILCE = {
  ADANA: ['ÇUKUROVA', 'SEYHAN', 'YÜREĞİR', 'SARIÇAM'],
  ANKARA: ['ÇANKAYA', 'KEÇİÖREN', 'YENİMAHALLE', 'MAMAK'],
  İSTANBUL: ['KADIKÖY', 'BEŞİKTAŞ', 'ÜSKÜDAR', 'ŞİŞLİ', 'BAKIRKÖY'],
  İZMİR: ['KONAK', 'KARŞIYAKA', 'BORNOVA', 'BUCA'],
}

const emptyDraft = () => ({
  ulke: 'TÜRKİYE',
  il: '',
  ilce: '',
  adres1: '',
  adres2: '',
  adres3: '',
})

export function formatIkametgahOzet(d) {
  if (!d) return ''
  const parts = []
  if (d.adres1) parts.push(d.adres1)
  if (d.adres2) parts.push(d.adres2)
  if (d.adres3) parts.push(d.adres3)
  const lokasyon = [d.ilce, d.il].filter(Boolean).join(' / ')
  if (lokasyon) parts.push(lokasyon)
  if (d.ulke && d.ulke !== 'TÜRKİYE') parts.push(d.ulke)
  return parts.join(', ') || lokasyon
}

export function ikametgahFromForm(formData) {
  return {
    ulke: formData.ikametUlke || 'TÜRKİYE',
    il: formData.ikametIl || '',
    ilce: formData.ikametIlce || '',
    adres1: formData.ikametAdres1 || '',
    adres2: formData.ikametAdres2 || '',
    adres3: formData.ikametAdres3 || '',
  }
}

function ModalSection({ title, children }) {
  return (
    <section className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{title}</h4>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">{children}</div>
    </section>
  )
}

function Field({ label, required, className = '', children }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className={`text-xs font-bold uppercase ${required ? 'text-red-600' : 'text-slate-600'}`}>{label}</span>
      {children}
    </label>
  )
}

export default function IkametgahAdresModal({ open, onClose, initial, onSave }) {
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setDraft(initial?.il || initial?.adres1 ? { ...emptyDraft(), ...initial } : emptyDraft())
    setError('')
  }, [open, initial])

  const iller = useMemo(() => Object.keys(IL_ILCE).sort(), [])
  const ilceler = useMemo(() => {
    if (!draft.il) return []
    return IL_ILCE[draft.il] || []
  }, [draft.il])

  const set = (field, value) => {
    setDraft((p) => {
      const next = { ...p, [field]: value }
      if (field === 'il') next.ilce = ''
      if (field === 'ulke' && value !== 'TÜRKİYE') {
        next.il = ''
        next.ilce = ''
      }
      return next
    })
    setError('')
  }

  const handleEkle = () => {
    if (!draft.ulke.trim()) {
      setError('Ülke seçiniz.')
      return
    }
    if (draft.ulke === 'TÜRKİYE' && !draft.il) {
      setError('İl seçiniz.')
      return
    }
    if (draft.ulke === 'TÜRKİYE' && !draft.ilce) {
      setError('İlçe seçiniz.')
      return
    }
    if (!draft.adres1.trim()) {
      setError('Adres alanı 1 zorunludur.')
      return
    }
    onSave(draft)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="İkametgah Adresi"
      description="Mahalle, cadde ve il bilgilerini girin."
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleEkle}
            className="px-6 py-2 rounded-lg bg-blue-800 text-white text-sm font-bold hover:bg-blue-900 shadow-sm"
          >
            Ekle
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <ModalSection title="Lokasyon">
          <Field label="Ülke" required className="sm:col-span-2">
            <select
              className="w-full border border-slate-200 rounded p-2.5 text-sm font-semibold focus:border-blue-600 outline-none"
              value={draft.ulke}
              onChange={(e) => set('ulke', e.target.value)}
            >
              {ULKE_LIST.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </Field>
          <Field label="İl" required={draft.ulke === 'TÜRKİYE'}>
            <select
              className="w-full border border-slate-200 rounded p-2.5 text-sm font-semibold focus:border-blue-600 outline-none disabled:bg-slate-100"
              value={draft.il}
              disabled={draft.ulke !== 'TÜRKİYE'}
              onChange={(e) => set('il', e.target.value)}
            >
              <option value="">Seçiniz</option>
              {iller.map((il) => (
                <option key={il} value={il}>
                  {il}
                </option>
              ))}
            </select>
          </Field>
          <Field label="İlçe" required={draft.ulke === 'TÜRKİYE'}>
            <select
              className="w-full border border-slate-200 rounded p-2.5 text-sm font-semibold focus:border-blue-600 outline-none disabled:bg-slate-100"
              value={draft.ilce}
              disabled={!draft.il || draft.ulke !== 'TÜRKİYE'}
              onChange={(e) => set('ilce', e.target.value)}
            >
              <option value="">Seçiniz</option>
              {ilceler.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </Field>
        </ModalSection>

        <ModalSection title="Detay">
          <Field label="Adres Alanı 1" required className="sm:col-span-2">
            <input
              type="text"
              className="w-full border border-slate-200 rounded p-2.5 text-sm focus:border-blue-600 outline-none"
              placeholder="Mahalle, cadde, sokak"
              value={draft.adres1}
              onChange={(e) => set('adres1', e.target.value)}
            />
          </Field>
          <Field label="Adres Alanı 2">
            <input
              type="text"
              className="w-full border border-slate-200 rounded p-2.5 text-sm focus:border-blue-600 outline-none"
              placeholder="Apartman, blok no"
              value={draft.adres2}
              onChange={(e) => set('adres2', e.target.value)}
            />
          </Field>
          <Field label="Adres Alanı 3">
            <input
              type="text"
              className="w-full border border-slate-200 rounded p-2.5 text-sm focus:border-blue-600 outline-none"
              placeholder="Kapı no, daire no, site"
              value={draft.adres3}
              onChange={(e) => set('adres3', e.target.value)}
            />
          </Field>
        </ModalSection>

        {error && (
          <p className="text-sm text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>
    </Modal>
  )
}
