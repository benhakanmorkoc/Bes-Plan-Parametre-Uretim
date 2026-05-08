import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { girisAidati } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

export default function GirisAidati() {
  const [search, setSearch] = useState('')
  const [tipFilter, setTipFilter] = useState('')
  const [selected, setSelected] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [actionInfo, setActionInfo] = useState(null)
  const [form, setForm] = useState({ gaKodu: '', versiyon: '1', tarih: '', doviz: 'TL', tip: 'Pesin', taksitTipi: 'Ardisik', taksitAdedi: '12', pesinat: '0', taksit: '0', erteleme: '0', toplam: '0' })

  const handleAction = (key, row) => {
    const labelMap = { view: 'Goruntule', edit: 'Duzenle', copy: 'Kopyala', version: 'Yeni Versiyon', history: 'Versiyon Gecmisi', delete: 'Sil' }
    setActionInfo({ key, label: labelMap[key] || key, row })
  }

  const filtered = useMemo(() => {
    return girisAidati.filter((row) => {
      const matchSearch = !search || row.gaKodu.toLowerCase().includes(search.toLowerCase())
      const matchTip = !tipFilter || row.tip === tipFilter
      return matchSearch && matchTip
    })
  }, [search, tipFilter])

  const allChecked = selected.length === filtered.length && filtered.length > 0
  const toggleAll = () => {
    if (allChecked) setSelected([])
    else setSelected(filtered.map((r) => r.id))
  }
  const toggleOne = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Giris Aidati Tanimlari"
        description="Katilimcidan sisteme giriste veya erken cikiste alinacak giris aidatinin tahsilat stratejisini belirler."
        right={
          <>
            <OutlineButton disabled={selected.length === 0} onClick={() => setLinkOpen(true)}>
              <LinkIcon className="w-4 h-4" /> Planlara Bagla {selected.length > 0 && <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full">{selected.length}</span>}
            </OutlineButton>
            <PrimaryButton onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
          </>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">GA Kodu</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input type="text" className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm" placeholder="Kod ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="w-56">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Giris Aidati Tipi</label>
          <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white" value={tipFilter} onChange={(e) => setTipFilter(e.target.value)}>
            <option value="">Tumu</option>
            <option value="Pesin">Pesin</option>
            <option value="Cikisa Ertelenmis">Cikisa Ertelenmis</option>
            <option value="Pesin+Cikisa Ert.">Pesin+Cikisa Ert.</option>
            <option value="Yok">Yok</option>
          </select>
        </div>
        <OutlineButton onClick={() => { setSearch(''); setTipFilter('') }}>Temizle</OutlineButton>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10"><input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} /></th>
              <th>GA Kodu</th>
              <th>Versiyon</th>
              <th>Tarih</th>
              <th>Doviz</th>
              <th>GA Tipi</th>
              <th>Taksit Tipi</th>
              <th>Taksit Adedi</th>
              <th>Pesinat</th>
              <th>Taksit</th>
              <th>Erteleme</th>
              <th>Toplam</th>
              <th className="w-12 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="rounded" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} /></td>
                <td className="font-mono text-xs">{row.gaKodu}</td>
                <td>{row.versiyon}</td>
                <td>{row.tarih}</td>
                <td>{row.doviz}</td>
                <td>{row.tip}</td>
                <td>{row.taksitTipi}</td>
                <td>{row.taksitAdedi}</td>
                <td>{row.pesinat}</td>
                <td>{row.taksit}</td>
                <td>{row.erteleme}</td>
                <td className="font-semibold text-slate-800">{row.toplam}</td>
                <td className="text-right"><RowActions row={row} onAction={handleAction} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={13} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Yeni Giris Aidati"
        size="lg"
        footer={<>
          <OutlineButton onClick={() => setCreateOpen(false)}>Vazgec</OutlineButton>
          <PrimaryButton onClick={() => { setCreateOpen(false); setActionInfo({ key: 'created', label: 'Yeni Giris Aidati Olusturuldu (mock)', row: form }) }}>Kaydet</PrimaryButton>
        </>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { k: 'gaKodu', l: 'GA Kodu' },{ k: 'versiyon', l: 'Versiyon' },{ k: 'tarih', l: 'Tarih' },
            { k: 'doviz', l: 'Doviz' },{ k: 'tip', l: 'GA Tipi' },{ k: 'taksitTipi', l: 'Taksit Tipi' },
            { k: 'taksitAdedi', l: 'Taksit Adedi' },{ k: 'pesinat', l: 'Pesinat' },{ k: 'taksit', l: 'Taksit' },
            { k: 'erteleme', l: 'Erteleme' },{ k: 'toplam', l: 'Toplam' },
          ].map((f) => (
            <label key={f.k} className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1">{f.l}</span>
              <input className="form-input" value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Planlara Bagla"
        description={`${selected.length} adet giris aidati secildi. Plan secimi mock prototip ekraninda yapilir.`}
        footer={<>
          <OutlineButton onClick={() => setLinkOpen(false)}>Vazgec</OutlineButton>
          <PrimaryButton onClick={() => { setLinkOpen(false); setActionInfo({ key: 'linked', label: 'Planlara Baglandi (mock)', row: { kayitlar: selected } }) }}>Bagla</PrimaryButton>
        </>}
      >
        <p className="text-sm text-slate-600">Bu islem mock'tur. Gercek ortamda urun-plan secim modali ile entegre olacaktir.</p>
      </Modal>

      <Modal
        open={!!actionInfo}
        onClose={() => setActionInfo(null)}
        title={actionInfo?.label}
        description="Mock prototip - bu islem henuz aktif degildir"
        footer={<PrimaryButton onClick={() => setActionInfo(null)}>Tamam</PrimaryButton>}
      >
        <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-3 overflow-auto">{JSON.stringify(actionInfo?.row || {}, null, 2)}</pre>
      </Modal>
    </div>
  )
}
