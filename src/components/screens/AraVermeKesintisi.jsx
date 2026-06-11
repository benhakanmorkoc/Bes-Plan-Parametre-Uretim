import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon, ArrowLeft, Trash2, MoreVertical, Edit2, List, Eye } from 'lucide-react'
import { araverme as seedAraverme, kurallar as seedKurallar } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import Modal from '../ui/Modal'

const TIP_OPTIONS = ['Yıllık(EGM)', 'Aylık(Şirket)']

const LIST_COLUMNS = [
  { key: 'kod', label: 'AVK Kodu' },
  { key: 'ad', label: 'Ad' },
  { key: 'versiyon', label: 'V' },
  { key: 'tip', label: 'Tip' },
  { key: 'tutar', label: 'Tutar' },
  { key: 'hesaplama', label: 'Hesaplama Kuralı' },
  { key: 'onKosul', label: 'Ön Koşul' },
]

const VERSIONS_BY_KOD = {
  'AVK-001': [
    { versiyon: '1', aciklama: 'Ara Verme Standart', durum: 'Aktif', gecerlilik: '01.01.2026' },
    { versiyon: '0', aciklama: 'Ara Verme Standart (önceki)', durum: 'Arşiv', gecerlilik: '01.07.2025' },
  ],
  'AVK-002': [
    { versiyon: '1', aciklama: 'Ara Verme Esnek', durum: 'Aktif', gecerlilik: '15.06.2025' },
  ],
  'AVK-000': [{ versiyon: '1', aciklama: 'Ara Verme Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],
}

function emptyForm() {
  return {
    kod: '',
    ad: '',
    versiyon: '1',
    araVermeTanimiYok: false,
    tip: 'Yıllık(EGM)',
    tutar: '',
    hesaplamaKuralKodu: '',
    hesaplamaKuralAdi: '',
    onKosulKodu: '',
    onKosulAdi: '',
  }
}

function rowToForm(row) {
  return {
    kod: row.kod || '',
    ad: row.ad || '',
    versiyon: String(row.versiyon || '1'),
    araVermeTanimiYok: row.kod === 'AVK-000',
    tip: row.tip || 'Yıllık(EGM)',
    tutar: String(row.tutar || '').replace(/\s*TL$/i, ''),
    hesaplamaKuralKodu: row.hesaplamaKuralKodu || (row.hesaplama !== '-' ? row.hesaplama : '') || '',
    hesaplamaKuralAdi: row.hesaplamaKuralAdi || '',
    onKosulKodu: row.onKosulKodu || (row.onKosul !== '-' ? row.onKosul : '') || '',
    onKosulAdi: row.onKosulAdi || '',
  }
}

function KuralLookupModal({ open, onClose, onSelect, filterKategori }) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open) setSearch('')
  }, [open])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return seedKurallar.filter((k) => {
      const matchKategori = !filterKategori || k.kategori === filterKategori
      const matchSearch = !q || `${k.kod} ${k.ad} ${k.aciklama}`.toLowerCase().includes(q)
      return matchKategori && matchSearch
    })
  }, [search, filterKategori])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kurallar"
      description="Listeden bir kural seçin"
      size="lg"
      footer={<OutlineButton onClick={onClose}>Kapat</OutlineButton>}
    >
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
          placeholder="Kural kodu veya adı ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-80 overflow-auto border border-slate-200 rounded-lg">
        <table className="w-full grid-table text-sm">
          <thead>
            <tr>
              <th>Kural Kodu</th>
              <th>Kural Adı</th>
              <th>Kategori</th>
              <th className="w-24 text-center">Seç</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((k) => (
              <tr key={k.id}>
                <td className="font-mono text-xs font-semibold">{k.kod}</td>
                <td>{k.ad}</td>
                <td>{k.kategori}</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="text-xs px-2.5 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    onClick={() => onSelect(k)}
                  >
                    Seç
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="text-center py-6 text-slate-500">Kural bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}

function KuralLookupField({ label, kod, ad, disabled, onOpen }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          className={`form-input flex-1 ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-slate-50'}`}
          placeholder="Kural Kodu"
          readOnly
          disabled={disabled}
          value={kod ? `${kod}${ad ? ` — ${ad}` : ''}` : ''}
        />
        <OutlineButton disabled={disabled} onClick={onOpen}>Seç</OutlineButton>
      </div>
    </div>
  )
}

export default function AraVermeKesintisi() {
  const [rows, setRows] = useState(() => seedAraverme.map((r) => ({ ...r })))
  const [viewMode, setViewMode] = useState('list')
  const [formMode, setFormMode] = useState('create')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [kuralLookup, setKuralLookup] = useState({ open: false, target: null })
  const [simpleModal, setSimpleModal] = useState({ open: false, title: '', body: null })

  const hasRules = !form.araVermeTanimiYok

  useEffect(() => {
    const close = () => setOpenMenuRowId(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => `${r.kod} ${r.ad}`.toLowerCase().includes(q))
  }, [rows, search])

  const allChecked = filtered.length > 0 && selected.length === filtered.length
  const toggleAll = () => setSelected(allChecked ? [] : filtered.map((r) => r.id))
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const openCreate = () => {
    setForm(emptyForm())
    setFormMode('create')
    setEditId(null)
    setViewMode('form')
  }

  const openUpdate = (row) => {
    setForm(rowToForm(row))
    setFormMode('update')
    setEditId(row.id)
    setViewMode('form')
    setOpenMenuRowId(null)
  }

  const openInspect = (row) => {
    setSimpleModal({
      open: true,
      title: 'Ara Verme Kesintisi İncele',
      body: (
        <div className="space-y-2 text-sm">
          <p><strong>Ara Verme Kodu:</strong> {row.kod}</p>
          <p><strong>Ara Verme Adı:</strong> {row.ad}</p>
          <p><strong>Versiyon:</strong> {row.versiyon}</p>
          <p><strong>Tip:</strong> {row.tip || '—'}</p>
          <p><strong>Tutar:</strong> {row.tutar || '—'}</p>
          <p><strong>Hesaplama Kuralı:</strong> {row.hesaplamaKuralKodu ? `${row.hesaplamaKuralKodu}${row.hesaplamaKuralAdi ? ` — ${row.hesaplamaKuralAdi}` : ''}` : '—'}</p>
          <p><strong>Ön Koşul:</strong> {row.onKosulKodu ? `${row.onKosulKodu}${row.onKosulAdi ? ` — ${row.onKosulAdi}` : ''}` : '—'}</p>
        </div>
      ),
    })
    setOpenMenuRowId(null)
  }

  const openLinkedPlans = (row) => {
    const mock = [
      { planNo: 'PLN-501', planAdi: 'Ferdi Avantaj Planı', versiyon: '6', durum: 'Yürürlükte' },
      { planNo: 'PLN-612', planAdi: 'Birikim Plus Plan', versiyon: '3', durum: 'Taslak' },
    ]
    setSimpleModal({
      open: true,
      title: `${row.kod} — Bağlı Planlar`,
      body: (
        <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Plan No</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Plan Adı</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Versiyon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Durum</th>
              </tr>
            </thead>
            <tbody>
              {mock.map((p) => (
                <tr key={p.planNo} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 font-mono text-xs">{p.planNo}</td>
                  <td className="px-3 py-1.5">{p.planAdi}</td>
                  <td className="px-3 py-1.5">{p.versiyon}</td>
                  <td className="px-3 py-1.5">{p.durum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    })
    setOpenMenuRowId(null)
  }

  const openVersions = (row) => {
    const history = VERSIONS_BY_KOD[row.kod] || []
    setSimpleModal({
      open: true,
      title: `${row.kod} — Versiyonlar`,
      body: history.length ? (
        <div className="table-wrap border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Versiyon</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Açıklama</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Durum</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Geçerlilik</th>
              </tr>
            </thead>
            <tbody>
              {history.map((v) => (
                <tr key={v.versiyon} className="border-t border-slate-100">
                  <td className="px-3 py-1.5">{v.versiyon}</td>
                  <td className="px-3 py-1.5">{v.aciklama}</td>
                  <td className="px-3 py-1.5">{v.durum}</td>
                  <td className="px-3 py-1.5">{v.gecerlilik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Versiyon geçmişi bulunamadı.</p>
      ),
    })
    setOpenMenuRowId(null)
  }

  const openKuralLookup = (target) => {
    setKuralLookup({ open: true, target })
  }

  const handleKuralSelect = (kural) => {
    if (kuralLookup.target === 'hesaplama') {
      setForm((f) => ({ ...f, hesaplamaKuralKodu: kural.kod, hesaplamaKuralAdi: kural.ad }))
    } else if (kuralLookup.target === 'onKosul') {
      setForm((f) => ({ ...f, onKosulKodu: kural.kod, onKosulAdi: kural.ad }))
    }
    setKuralLookup({ open: false, target: null })
  }

  const validateForm = () => {
    if (!form.kod.trim() || !form.ad.trim()) {
      alert('Ara Verme Kodu ve Ara Verme Adı zorunludur.')
      return false
    }
    if (formMode === 'create' && rows.some((r) => r.kod.toLowerCase() === form.kod.trim().toLowerCase())) {
      alert('Bu ara verme kodu sistemde mevcuttur.')
      return false
    }
    if (hasRules && !form.hesaplamaKuralKodu) {
      alert('Ara Verme Hesaplama Kuralı seçilmelidir.')
      return false
    }
    if (hasRules && !form.onKosulKodu) {
      alert('Ara Verme Kesintisi Ön Koşulu seçilmelidir.')
      return false
    }
    return true
  }

  const saveForm = () => {
    if (!validateForm()) return
    const today = new Date().toLocaleDateString('tr-TR')
    const payload = {
      kod: form.kod.trim(),
      ad: form.ad.trim(),
      versiyon: form.versiyon,
      tarih: today,
      tip: form.tip,
      tutar: hasRules ? form.tutar : '0',
      hesaplamaKuralKodu: hasRules ? form.hesaplamaKuralKodu : '',
      hesaplamaKuralAdi: hasRules ? form.hesaplamaKuralAdi : '',
      onKosulKodu: hasRules ? form.onKosulKodu : '',
      onKosulAdi: hasRules ? form.onKosulAdi : '',
      hesaplama: hasRules ? form.hesaplamaKuralKodu : '-',
      onKosul: hasRules ? form.onKosulKodu : '-',
    }
    if (formMode === 'update' && editId) {
      setRows((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)))
    } else {
      setRows((prev) => [...prev, { id: Date.now(), ...payload }])
    }
    setViewMode('list')
  }

  const removeRow = (row) => {
    if (!window.confirm(`${row.kod} kodlu kayıt silinsin mi?`)) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setSelected((prev) => prev.filter((id) => id !== row.id))
    setOpenMenuRowId(null)
  }

  if (viewMode === 'form') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100"
            aria-label="Geri"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">
            {formMode === 'create' ? 'Ara Verme Kesintisi Ekle' : `Ara Verme Kesintisi Güncelle (${form.kod})`}
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ara Verme Kodu <span className="text-red-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.kod}
                  disabled={formMode === 'update'}
                  onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ara Verme Adı <span className="text-red-500">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.ad}
                  onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</label>
                <input className="form-input bg-slate-100 text-slate-600 cursor-not-allowed" disabled readOnly value={form.versiyon} />
              </div>
              <div className="flex items-end pb-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                    checked={form.araVermeTanimiYok}
                    onChange={(e) => setForm((f) => ({ ...f, araVermeTanimiYok: e.target.checked }))}
                  />
                  Ara Verme Tanımı Yok
                </label>
              </div>
            </div>

            {hasRules && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tip</label>
                    <select
                      className="form-select"
                      value={form.tip}
                      onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))}
                    >
                      {TIP_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tutar (TL)</label>
                    <input
                      className="form-input"
                      placeholder="0.00"
                      value={form.tutar}
                      onChange={(e) => setForm((f) => ({ ...f, tutar: e.target.value.replace(/[^0-9.,]/g, '') }))}
                    />
                  </div>
                </div>

                <KuralLookupField
                  label="Ara Verme Hesaplama Kuralı"
                  kod={form.hesaplamaKuralKodu}
                  ad={form.hesaplamaKuralAdi}
                  disabled={!hasRules}
                  onOpen={() => openKuralLookup('hesaplama')}
                />

                <KuralLookupField
                  label="Ara Verme Kesintisi Ön Koşulu"
                  kod={form.onKosulKodu}
                  ad={form.onKosulAdi}
                  disabled={!hasRules}
                  onOpen={() => openKuralLookup('onKosul')}
                />
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <OutlineButton onClick={() => setViewMode('list')}>İptal</OutlineButton>
          <OutlineButton
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setForm(emptyForm())}
          >
            <Trash2 className="w-4 h-4" /> Temizle
          </OutlineButton>
          <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
        </div>

        <KuralLookupModal
          open={kuralLookup.open}
          onClose={() => setKuralLookup({ open: false, target: null })}
          onSelect={handleKuralSelect}
          filterKategori={kuralLookup.target === 'hesaplama' ? 'Hesaplama' : kuralLookup.target === 'onKosul' ? 'Ön Koşul' : null}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden relative">
      {openMenuRowId && (
        <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Menüyü kapat" onClick={() => setOpenMenuRowId(null)} />
      )}

      <ScreenHeader
        title="Ara Verme Kesintisi"
        description="Ara verme durumlarında uygulanacak kesinti"
        right={(
          <>
            <OutlineButton disabled={selected.length === 0}>
              <LinkIcon className="w-4 h-4" /> Planlara Bağla
              {selected.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full">
                  {selected.length}
                </span>
              )}
            </OutlineButton>
            <PrimaryButton onClick={openCreate}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        )}
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Kod / Ad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10">
                <input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} />
              </th>
              {LIST_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}
              <th className="w-12 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>
                  <input type="checkbox" className="rounded" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} />
                </td>
                {LIST_COLUMNS.map((c) => (
                  <td key={c.key} className={c.key === 'kod' ? 'font-semibold' : ''}>{row[c.key] ?? '—'}</td>
                ))}
                <td className="text-center relative">
                  <button
                    type="button"
                    className={`p-1.5 rounded-full ${openMenuRowId === row.id ? 'bg-slate-200' : 'hover:bg-slate-100 text-slate-500'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuRowId((prev) => (prev === row.id ? null : row.id))
                    }}
                    aria-label="Satır işlemleri"
                  >
                    <MoreVertical className="w-5 h-5 mx-auto" />
                  </button>
                  {openMenuRowId === row.id && (
                    <div
                      className="absolute right-8 top-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1.5 text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => openInspect(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4 mr-2 text-slate-500" /> İncele
                      </button>
                      <button
                        type="button"
                        onClick={() => openUpdate(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Güncelle
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Sil
                      </button>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={() => openLinkedPlans(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LinkIcon className="w-4 h-4 mr-2 text-slate-400" /> Bağlı Planlar
                      </button>
                      <button
                        type="button"
                        onClick={() => openVersions(row)}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <List className="w-4 h-4 mr-2 text-slate-400" /> Versiyonlar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={LIST_COLUMNS.length + 2} className="text-center text-slate-500 py-6 text-sm">
                  Sonuç bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={simpleModal.open}
        onClose={() => setSimpleModal({ open: false, title: '', body: null })}
        title={simpleModal.title}
        footer={<PrimaryButton onClick={() => setSimpleModal({ open: false, title: '', body: null })}>Kapat</PrimaryButton>}
      >
        {simpleModal.body}
      </Modal>
    </div>
  )
}
