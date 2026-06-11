import { useEffect, useMemo, useState } from 'react'

import { Plus, Search, Link as LinkIcon, ArrowLeft, Trash2, MoreVertical, Edit2, List, Eye } from 'lucide-react'

import { ygkMuafiyet as seedMuafiyet } from '../../data/mockData'

import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'

import Modal from '../ui/Modal'



const DOVIZ_OPTIONS = [

  { code: 'TL', label: 'Türk Lirası (TL)' },

  { code: 'USD', label: 'Amerikan Doları (USD)' },

  { code: 'EUR', label: 'Euro (EUR)' },

]



const LIST_COLUMNS = [

  { key: 'kod', label: 'YGK Muafiyet Kodu' },

  { key: 'ad', label: 'YGK Muafiyet Adı' },

  { key: 'versiyon', label: 'Versiyon' },

  { key: 'yil', label: 'Geçerli Olduğu Yıl' },

  { key: 'toplamKp', label: 'Toplam Ödenmiş KP' },

  { key: 'doviz', label: 'Döviz' },

  { key: 'oran', label: 'YGK Muafiyet Oranı', computed: 'oran' },

]



const VERSIONS_BY_KOD = {

  'YGKM-001': [

    { versiyon: '1', aciklama: 'YGK Muafiyet Kuralı', durum: 'Aktif', gecerlilik: '30.07.2024' },

    { versiyon: '0', aciklama: 'YGK Muafiyet Kuralı (önceki)', durum: 'Arşiv', gecerlilik: '01.01.2024' },

  ],

  'YGKM-002': [

    { versiyon: '2', aciklama: 'Alternatif Muafiyet', durum: 'Aktif', gecerlilik: '01.01.2025' },

    { versiyon: '1', aciklama: 'Alternatif Muafiyet', durum: 'Arşiv', gecerlilik: '01.07.2024' },

  ],

  'YGKM-000': [{ versiyon: '1', aciklama: 'Muafiyet Yok', durum: 'Aktif', gecerlilik: '01.01.2026' }],

}



function displayOranPercent(oran) {

  const n = Number(oran)

  if (Number.isNaN(n) || n === 0) return '0'

  const pct = n <= 1 ? n * 100 : n

  return `${pct % 1 === 0 ? pct : pct.toFixed(1)}%`

}



function emptyForm() {

  return {

    kod: '',

    ad: '',

    versiyon: '1',

    muafiyetTanimiYok: false,

    doviz: 'TL',

    gecerliYil: '',

    toplamOdenmisKp: '',

    muafiyetOrani: '',

  }

}



function rowToForm(row) {

  const muafiyetTanimiYok = row.kod === 'YGKM-000' || row.yil === '0'

  return {

    kod: row.kod || '',

    ad: row.ad || '',

    versiyon: String(row.versiyon || '1'),

    muafiyetTanimiYok,

    doviz: row.doviz === 'TRL' ? 'TL' : row.doviz || 'TL',

    gecerliYil: muafiyetTanimiYok ? '' : (row.yil || ''),

    toplamOdenmisKp: muafiyetTanimiYok ? '' : (row.toplamKp || ''),

    muafiyetOrani: muafiyetTanimiYok ? '' : (row.oran ? String(Number(row.oran) * 100) : ''),

  }

}



function renderListCell(row, col) {

  if (col.computed === 'oran') return displayOranPercent(row.oran)

  const val = row[col.key]

  return val === '' || val == null ? '—' : val

}



export default function YgkMuafiyet() {

  const [rows, setRows] = useState(() => seedMuafiyet.map((r) => ({ ...r })))

  const [viewMode, setViewMode] = useState('list')

  const [formMode, setFormMode] = useState('create')

  const [form, setForm] = useState(emptyForm)

  const [editId, setEditId] = useState(null)

  const [search, setSearch] = useState('')

  const [selected, setSelected] = useState([])

  const [openMenuRowId, setOpenMenuRowId] = useState(null)

  const [simpleModal, setSimpleModal] = useState({ open: false, title: '', body: null })



  const hasRules = !form.muafiyetTanimiYok



  useEffect(() => {

    const close = () => setOpenMenuRowId(null)

    window.addEventListener('click', close)

    return () => window.removeEventListener('click', close)

  }, [])



  const filtered = useMemo(() => {

    if (!search.trim()) return rows

    const q = search.toLowerCase()

    return rows.filter((r) => `${r.kod} ${r.ad} ${r.doviz}`.toLowerCase().includes(q))

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

      title: 'YGK Muafiyet İncele',

      body: (

        <div className="space-y-2 text-sm">

          <p><strong>YGK Muafiyet Kodu:</strong> {row.kod}</p>

          <p><strong>YGK Muafiyet Adı:</strong> {row.ad}</p>

          <p><strong>Versiyon:</strong> {row.versiyon}</p>

          <p><strong>Geçerli Olduğu Yıl:</strong> {row.yil || '—'}</p>

          <p><strong>Toplam Ödenmiş KP:</strong> {row.toplamKp || '—'}</p>

          <p><strong>Döviz:</strong> {row.doviz}</p>

          <p><strong>YGK Muafiyet Oranı:</strong> {displayOranPercent(row.oran)}</p>

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



  const validateForm = () => {

    if (!form.kod.trim() || !form.ad.trim()) {

      alert('YGK Muafiyet Kodu ve YGK Muafiyet Adı zorunludur.')

      return false

    }

    if (formMode === 'create' && rows.some((r) => r.kod.toLowerCase() === form.kod.trim().toLowerCase())) {

      alert('Bu muafiyet kodu sistemde mevcuttur.')

      return false

    }

    if (hasRules) {

      if (!String(form.gecerliYil ?? '').trim()) {

        alert('Geçerli Olduğu Yıl zorunludur.')

        return false

      }

      if (!String(form.toplamOdenmisKp || '').trim()) {

        alert('Toplam Ödenmiş KP Barajı zorunludur.')

        return false

      }

      if (!String(form.muafiyetOrani || '').trim()) {

        alert('YGK Muafiyet Oranı zorunludur.')

        return false

      }

    }

    return true

  }



  const saveForm = () => {

    if (!validateForm()) return

    const today = new Date().toLocaleDateString('tr-TR')

    const oranDecimal = hasRules

      ? String(parseFloat(String(form.muafiyetOrani).replace(',', '.')) / 100)

      : '0'

    const payload = {

      kod: form.kod.trim(),

      ad: form.ad.trim(),

      versiyon: form.versiyon,

      tarih: today,

      doviz: form.doviz === 'TL' ? 'TRL' : form.doviz,

      yil: hasRules ? String(form.gecerliYil) : '0',

      toplamKp: hasRules ? form.toplamOdenmisKp : '0',

      oran: hasRules ? oranDecimal : '0',

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

            {formMode === 'create' ? 'YGK Muafiyet Ekle' : `YGK Muafiyet Güncelle (${form.kod})`}

          </h2>

        </div>



        <div className="flex-1 overflow-auto p-6">

          <div className="max-w-3xl space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1">

                  YGK Muafiyet Kodu <span className="text-red-500">*</span>

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

                  YGK Muafiyet Adı <span className="text-red-500">*</span>

                </label>

                <input

                  className="form-input"

                  value={form.ad}

                  onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}

                />

              </div>

              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1">Versiyon</label>

                <input

                  className="form-input bg-slate-100 text-slate-600 cursor-not-allowed"

                  disabled

                  readOnly

                  value={form.versiyon}

                />

              </div>

              <div className="flex items-end pb-1">

                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">

                  <input

                    type="checkbox"

                    className="rounded border-slate-300"

                    checked={form.muafiyetTanimiYok}

                    onChange={(e) => setForm((f) => ({ ...f, muafiyetTanimiYok: e.target.checked }))}

                  />

                  YGK Muafiyet Tanımı Yok

                </label>

              </div>

            </div>



            <div className="border-t border-slate-200 pt-5">

              <h3 className="text-sm font-semibold text-slate-800 mb-4">Kural Başlangıç Bilgileri</h3>

              <div className="max-w-xs">

                <label className="block text-xs font-semibold text-slate-600 mb-1">Döviz</label>

                <select

                  className="form-select"

                  value={form.doviz}

                  onChange={(e) => setForm((f) => ({ ...f, doviz: e.target.value }))}

                >

                  {DOVIZ_OPTIONS.map((d) => (

                    <option key={d.code} value={d.code}>{d.label}</option>

                  ))}

                </select>

              </div>

            </div>



            {hasRules && (

              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">

                <h3 className="text-sm font-semibold text-slate-800">Sadakat İndirimi (Ödenmiş KP&apos;ye Göre)</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div>

                    <label className="block text-xs font-semibold text-slate-600 mb-1">Geçerli Olduğu Yıl</label>

                    <input

                      type="number"

                      min="0"

                      className="form-input"

                      value={form.gecerliYil}

                      onChange={(e) => setForm((f) => ({ ...f, gecerliYil: e.target.value }))}

                    />

                  </div>

                  <div>

                    <label className="block text-xs font-semibold text-slate-600 mb-1">Toplam Ödenmiş KP Barajı</label>

                    <input

                      className="form-input"

                      placeholder="Örn: 50000"

                      value={form.toplamOdenmisKp}

                      onChange={(e) => setForm((f) => ({ ...f, toplamOdenmisKp: e.target.value.replace(/[^0-9.,]/g, '') }))}

                    />

                  </div>

                  <div>

                    <label className="block text-xs font-semibold text-slate-600 mb-1">YGK Muafiyet Oranı (%)</label>

                    <input

                      className="form-input"

                      placeholder="%100"

                      value={form.muafiyetOrani}

                      onChange={(e) => setForm((f) => ({ ...f, muafiyetOrani: e.target.value.replace(/[^0-9.,]/g, '') }))}

                    />

                  </div>

                </div>

              </div>

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

      </div>

    )

  }



  return (

    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden relative">

      {openMenuRowId && (

        <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Menüyü kapat" onClick={() => setOpenMenuRowId(null)} />

      )}



      <ScreenHeader

        title="YGK Muafiyet Tanımları"

        description="YGK muafiyet koşulları"

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

        <table className="w-full grid-table min-w-[900px]">

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

                  <td key={c.key} className={c.key === 'kod' ? 'font-semibold' : ''}>

                    {renderListCell(row, c)}

                  </td>

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


