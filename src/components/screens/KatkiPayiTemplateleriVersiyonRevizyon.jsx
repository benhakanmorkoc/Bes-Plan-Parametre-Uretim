import { useEffect, useMemo, useState } from 'react'
import { Eye, GitCompare, History, Layers } from 'lucide-react'
import {
  getKptTemplates,
  getRevisions,
  getVersionHistory,
  subscribeKptStore,
  latestByTemplateCode,
  KPT_FIELD_LABELS,
  displayKptFieldValue,
} from '../../data/kptSharedState'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const COMPARE_FIELDS = Object.keys(KPT_FIELD_LABELS)

function templateVersionsForKod(kod) {
  return getKptTemplates()
    .filter((t) => t.kpTemplateKodu === kod)
    .sort((a, b) => Number(b.versiyon || 0) - Number(a.versiyon || 0))
}

function versionDiffRows(vA, vB) {
  const rows = []
  COMPARE_FIELDS.forEach((field) => {
    const oldVal = displayKptFieldValue(field, vA?.[field])
    const newVal = displayKptFieldValue(field, vB?.[field])
    if (oldVal !== newVal) {
      rows.push({ field, fieldLabel: KPT_FIELD_LABELS[field], oldValue: oldVal, newValue: newVal })
    }
  })
  return rows
}

export default function KatkiPayiTemplateleriVersiyonRevizyon() {
  const [storeTick, bump] = useState(0)
  const [selectedKod, setSelectedKod] = useState('')
  const [activeTab, setActiveTab] = useState('versions')
  const [inspectVersion, setInspectVersion] = useState(null)
  const [inspectRevision, setInspectRevision] = useState(null)
  const [compareA, setCompareA] = useState('')
  const [compareB, setCompareB] = useState('')
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => subscribeKptStore(() => bump((n) => n + 1)), [])

  const templateCodes = useMemo(() => {
    const codes = [...new Set(getKptTemplates().map((t) => t.kpTemplateKodu).filter(Boolean))]
    return codes.sort()
  }, [storeTick])

  useEffect(() => {
    if (!selectedKod && templateCodes.length) setSelectedKod(templateCodes[0])
  }, [selectedKod, templateCodes])

  const versions = useMemo(() => {
    if (!selectedKod) return []
    const history = getVersionHistory(selectedKod)
    if (history.length) {
      return [...history].sort((a, b) => Number(b.versiyon || 0) - Number(a.versiyon || 0))
    }
    return templateVersionsForKod(selectedKod)
  }, [selectedKod, storeTick])

  const revisions = useMemo(() => {
    if (!selectedKod) return []
    return [...getRevisions(selectedKod)]
      .filter((r) => r.changeType !== 'VERSIYON')
      .sort((a, b) => (b.revisionNo || 0) - (a.revisionNo || 0))
  }, [selectedKod, storeTick])

  const versionSnapshots = useMemo(() => templateVersionsForKod(selectedKod), [selectedKod, storeTick])

  const compareLeft = versionSnapshots.find((v) => String(v.id) === compareA)
  const compareRight = versionSnapshots.find((v) => String(v.id) === compareB)
  const compareRows = compareLeft && compareRight ? versionDiffRows(compareLeft, compareRight) : []

  const latest = latestByTemplateCode(getKptTemplates()).find((t) => t.kpTemplateKodu === selectedKod)

  const openCompare = () => {
    if (versionSnapshots.length >= 2) {
      setCompareA(String(versionSnapshots[1].id))
      setCompareB(String(versionSnapshots[0].id))
    }
    setCompareOpen(true)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Katkı Payı Templateleri — Versiyon / Revizyon"
        description="Eski ve yeni versiyonları ile break-fix revizyon geçmişini inceleyin."
      />

      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-end gap-4">
        <label className="block min-w-[220px]">
          <span className="block text-xs font-semibold text-slate-700 mb-1">KP Template Kodu</span>
          <select className="form-input" value={selectedKod} onChange={(e) => setSelectedKod(e.target.value)}>
            {templateCodes.map((k) => (
              <option key={k} value={k}>{k} — {latestByTemplateCode(getKptTemplates()).find((t) => t.kpTemplateKodu === k)?.adi || k}</option>
            ))}
          </select>
        </label>
        {latest && (
          <div className="text-sm text-slate-600 pb-1">
            Güncel: <span className="font-semibold text-slate-800">v{latest.versiyon}</span>
            {latest.revisionNo > 0 && (
              <span className="ml-2 text-slate-500">(rev. {latest.revisionNo})</span>
            )}
          </div>
        )}
      </div>

      <div className="px-6 pt-3 flex gap-1 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab('versions')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px ${
            activeTab === 'versions'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Versiyonlar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('revisions')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px ${
            activeTab === 'revisions'
              ? 'border-violet-600 text-violet-700 bg-violet-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" /> Revizyonlar
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'versions' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                Aynı template kodu altındaki tüm versiyonlar. Güncel üretim son versiyonu kullanır.
              </p>
              {versionSnapshots.length >= 2 && (
                <OutlineButton onClick={openCompare}>
                  <GitCompare className="w-4 h-4" /> Versiyon Karşılaştır
                </OutlineButton>
              )}
            </div>
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Versiyon</th>
                  <th>Durum</th>
                  <th>Adı</th>
                  <th>Katkı Payı Tutarı</th>
                  <th>Azami KP</th>
                  <th>Oluşturulma</th>
                  <th className="text-center w-28">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => {
                  const snap = versionSnapshots.find((s) => String(s.versiyon) === String(v.versiyon)) || v
                  return (
                    <tr key={`${v.versiyon}-${v.id}`}>
                      <td className="font-semibold">v{v.versiyon}</td>
                      <td>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          v.aktif !== false ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {v.aktif !== false ? 'Güncel' : 'Arşiv'}
                        </span>
                      </td>
                      <td>{snap.adi || v.adi}</td>
                      <td>{snap.katkiPayiTutari || v.katkiPayiTutari}</td>
                      <td>{snap.azamiKp || '—'}</td>
                      <td>{v.olusturulmaTarihi || snap.olusturulmaTarihi}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                          onClick={() => setInspectVersion(snap)}
                        >
                          <Eye className="w-3.5 h-3.5" /> İncele
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {versions.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">Versiyon kaydı bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'revisions' && (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Break-fix güncellemeler (revisionNo). versionNo değişmez; audit kayıtları salt okunurdur.
            </p>
            <table className="w-full grid-table text-sm">
              <thead>
                <tr>
                  <th>Revizyon No</th>
                  <th>Versiyon</th>
                  <th>Gerekçe</th>
                  <th>Değişen Alan</th>
                  <th>Kullanıcı</th>
                  <th>Tarih</th>
                  <th className="text-center w-28">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((r) => (
                  <tr key={r.revisionId}>
                    <td className="font-semibold">{r.revisionNo}</td>
                    <td>v{r.versionNo}</td>
                    <td className="max-w-[240px] truncate" title={r.reason}>{r.reason}</td>
                    <td>{r.diff?.length || 0} alan</td>
                    <td>{r.changedBy}</td>
                    <td>{r.changedAt}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 text-xs font-medium"
                        onClick={() => setInspectRevision(r)}
                      >
                        <Eye className="w-3.5 h-3.5" /> İncele
                      </button>
                    </td>
                  </tr>
                ))}
                {revisions.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">Revizyon kaydı bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Modal
        open={!!inspectVersion}
        onClose={() => setInspectVersion(null)}
        title={inspectVersion ? `Versiyon İncele (v${inspectVersion.versiyon})` : ''}
        size="lg"
        footer={<PrimaryButton onClick={() => setInspectVersion(null)}>Kapat</PrimaryButton>}
      >
        {inspectVersion && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {COMPARE_FIELDS.map((field) => (
              <div key={field} className="border border-slate-100 rounded-md px-3 py-2">
                <div className="text-xs text-slate-500">{KPT_FIELD_LABELS[field]}</div>
                <div className="font-medium text-slate-800">{displayKptFieldValue(field, inspectVersion[field])}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        open={!!inspectRevision}
        onClose={() => setInspectRevision(null)}
        title={inspectRevision ? `Revizyon #${inspectRevision.revisionNo} (v${inspectRevision.versionNo})` : ''}
        size="lg"
        footer={<PrimaryButton onClick={() => setInspectRevision(null)}>Kapat</PrimaryButton>}
      >
        {inspectRevision && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Gerekçe:</span> <span className="font-medium">{inspectRevision.reason}</span></div>
              <div><span className="text-slate-500">Kullanıcı:</span> <span className="font-medium">{inspectRevision.changedBy}</span></div>
              <div><span className="text-slate-500">Tarih:</span> <span className="font-medium">{inspectRevision.changedAt}</span></div>
              <div>
                <span className="text-slate-500">Etki:</span>{' '}
                <span className="font-medium">
                  {inspectRevision.impact?.planCount ?? 0} plan, {inspectRevision.impact?.teklifCount ?? 0} teklif, {inspectRevision.impact?.sozlesmeCount ?? 0} sözleşme
                </span>
              </div>
            </div>
            <table className="w-full grid-table text-sm">
              <thead>
                <tr><th>Alan</th><th>Önceki</th><th>Sonraki</th></tr>
              </thead>
              <tbody>
                {(inspectRevision.diff || []).map((d) => (
                  <tr key={d.field}>
                    <td className="font-medium">{d.fieldLabel}</td>
                    <td className="text-red-700/80">{d.oldValue}</td>
                    <td className="text-green-700/80">{d.newValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        title="Versiyon Karşılaştırma"
        size="xl"
        footer={<PrimaryButton onClick={() => setCompareOpen(false)}>Kapat</PrimaryButton>}
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <label className="block flex-1 min-w-[180px]">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">Eski versiyon</span>
            <select className="form-input" value={compareA} onChange={(e) => setCompareA(e.target.value)}>
              {versionSnapshots.map((v) => (
                <option key={v.id} value={String(v.id)}>v{v.versiyon} — {v.katkiPayiTutari} TL</option>
              ))}
            </select>
          </label>
          <label className="block flex-1 min-w-[180px]">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">Yeni versiyon</span>
            <select className="form-input" value={compareB} onChange={(e) => setCompareB(e.target.value)}>
              {versionSnapshots.map((v) => (
                <option key={v.id} value={String(v.id)}>v{v.versiyon} — {v.katkiPayiTutari} TL</option>
              ))}
            </select>
          </label>
        </div>
        {compareRows.length > 0 ? (
          <table className="w-full grid-table text-sm">
            <thead>
              <tr><th>Alan</th><th>v{compareLeft?.versiyon}</th><th>v{compareRight?.versiyon}</th></tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.field}>
                  <td className="font-medium">{row.fieldLabel}</td>
                  <td className="text-red-700/80">{row.oldValue}</td>
                  <td className="text-green-700/80">{row.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">Seçilen versiyonlar arasında fark bulunamadı.</p>
        )}
      </Modal>
    </div>
  )
}
