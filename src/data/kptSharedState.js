import {
  katkiPayiTemplateleri as seedTemplates,
  kptTemplateRevisions as seedRevisions,
  kptVersionHistory as seedVersionHistory,
  kptTemplateImpact as seedImpact,
  kptBagliPlanlarByKod as seedBagliPlanlar,
} from './mockData'

let templates = seedTemplates.map((r) => ({ ...r }))
let revisionsByKod = Object.fromEntries(
  Object.entries(seedRevisions).map(([k, list]) => [k, list.map((x) => ({ ...x, diff: x.diff?.map((d) => ({ ...d })) }))]),
)
let versionHistoryByKod = Object.fromEntries(
  Object.entries(seedVersionHistory).map(([k, list]) => [k, list.map((x) => ({ ...x }))]),
)
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribeKptStore(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getKptTemplates() {
  return templates
}

export function setKptTemplates(next) {
  templates = next
  notify()
}

export function getRevisions(kod) {
  return revisionsByKod[kod] || []
}

export function getAllRevisions() {
  return revisionsByKod
}

export function addRevision(kod, revision) {
  const list = [...(revisionsByKod[kod] || [])]
  list.unshift(revision)
  revisionsByKod = { ...revisionsByKod, [kod]: list }
  notify()
}

export function getVersionHistory(kod) {
  return versionHistoryByKod[kod] || []
}

export function getAllVersionHistory() {
  return versionHistoryByKod
}

export function setVersionHistory(kod, list) {
  versionHistoryByKod = { ...versionHistoryByKod, [kod]: list }
  notify()
}

export function getKptImpact(kod) {
  return seedImpact[kod] || { planCount: 0, teklifCount: 0, sozlesmeCount: 0, teklifler: [], sozlesmeler: [] }
}

export function getBagliPlanlar(kod) {
  return seedBagliPlanlar[kod] || []
}

export function isPlanBound(kod) {
  return getBagliPlanlar(kod).length > 0
}

export const KPT_IMPACT_SAMPLE_THRESHOLD = 10

export const KPT_FIELD_LABELS = {
  kpTemplateKodu: 'KP Template Kodu',
  adi: 'KP Template Adı',
  katkiPayiTutari: 'Katkı Payı Tutarı',
  katkiPayiTutariIges: 'Katkı Payı Tutarı (İGES)',
  azamiKp: 'Azami KP',
  gecerlilik: 'Geçerlilik',
  baslangicKapitali: 'Başlangıç Kapitali',
  girisFonBuyuklugu: 'Giriş Fon Büyüklüğü',
  dovizKp: 'Döviz Türü KP',
  odemePeriyodu: 'Ödeme Periyodu',
  dovizDiger: 'Döviz Türü (Diğer)',
  kpHesaplamaTuru: 'KP Hesaplama Türü',
  kpDonemGun: 'KP Dönem Gün',
  kpDonemAy: 'KP Dönem Ay',
  yuvarlama: 'Yuvarlama',
  yuvarlamaDegeri: 'Yuvarlama Değeri',
}

export function displayKptFieldValue(field, value) {
  if (field === 'odemePeriyodu') {
    const arr = Array.isArray(value) ? value : String(value || '').split(',').map((s) => s.trim()).filter(Boolean)
    return arr.length ? arr.join(', ') : '—'
  }
  return value == null || value === '' ? '—' : String(value)
}

export function computeKptDiff(before, after) {
  const diff = []
  Object.keys(KPT_FIELD_LABELS).forEach((field) => {
    const oldVal = displayKptFieldValue(field, before[field])
    const newVal = displayKptFieldValue(field, after[field])
    if (oldVal !== newVal) {
      diff.push({ field, fieldLabel: KPT_FIELD_LABELS[field], oldValue: oldVal, newValue: newVal })
    }
  })
  return diff
}

export function latestByTemplateCode(rows) {
  const m = new Map()
  rows.forEach((item) => {
    const key = item.kpTemplateKodu || ''
    const prev = m.get(key)
    if (!prev || Number(item.versiyon || 0) > Number(prev.versiyon || 0)) m.set(key, item)
  })
  return Array.from(m.values())
}
