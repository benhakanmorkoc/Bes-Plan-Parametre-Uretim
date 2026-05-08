import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { katkiPayiTemplateleri } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'
import RowActions from '../ui/RowActions'
import Modal from '../ui/Modal'

export default function KatkiPayiTemplateleri() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [actionInfo, setActionInfo] = useState(null)
  const [form, setForm] = useState({ kpTemplateKodu: '', adi: '', versiyon: '1', katkiPayiTutari: '', odemePeriyodu: 'Aylik', dovizKp: 'TL', gecerlilik: 'Aktif' })

  const handleAction = (key, row) => {
    const labelMap = { view: 'Goruntule', edit: 'Duzenle', copy: 'Kopyala', version: 'Yeni Versiyon', history: 'Versiyon Gecmisi', delete: 'Sil' }
    setActionInfo({ key, label: labelMap[key] || key, row })
  }

  const filtered = useMemo(() => {
    return katkiPayiTemplateleri.filter((row) => {
      const matchSearch = !search || row.kpTemplateKodu.toLowerCase().includes(search.toLowerCase()) || row.adi.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || row.gecerlilik === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const allChecked = selected.length === filtered.length && filtered.length > 0

  const toggleAll = () => {
    if (allChecked) setSelected([])
    else setSelected(filtered.map((r) => r.id))
  }

  const toggleOne = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Katki Payi Templateleri"
        description="KP template tanimlarinin listelendigi, filtrelenip siralandigi ekrandir."
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
          <label className="block text-xs font-semibold text-slate-600 mb-1">Template Ara</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
              placeholder="Kod veya ad ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Gecerlilik</label>
          <select className="w-full h-10 px-3 border border-slate-300 rounded-md text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tumu</option>
            <option value="Aktif">Aktif</option>
            <option value="Pasif">Pasif</option>
          </select>
        </div>
        <OutlineButton onClick={() => { setSearch(''); setStatusFilter('') }}>Temizle</OutlineButton>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table">
          <thead>
            <tr>
              <th className="w-10">
                <input type="checkbox" className="rounded" checked={allChecked} onChange={toggleAll} />
              </th>
              <th>KP Template Kodu</th>
              <th>Adi</th>
              <th>Versiyon</th>
              <th>Tutar</th>
              <th>Periyot</th>
              <th>Doviz</th>
              <th>Gecerlilik</th>
              <th>Olusturan</th>
              <th>Olusturulma</th>
              <th className="w-12 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" className="rounded" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} /></td>
                <td className="font-mono text-xs">{row.kpTemplateKodu}</td>
                <td className="font-semibold text-slate-800">{row.adi}</td>
                <td>{row.versiyon}</td>
                <td>{row.katkiPayiTutari}</td>
                <td>{row.odemePeriyodu}</td>
                <td>{row.dovizKp}</td>
                <td><StatusBadge value={row.gecerlilik} /></td>
                <td>{row.olusturan}</td>
                <td>{row.olusturulmaTarihi}</td>
                <td className="text-right"><RowActions row={row} onAction={handleAction} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Yeni Katki Payi Template"
        size="lg"
        footer={<>
          <OutlineButton onClick={() => setCreateOpen(false)}>Vazgec</OutlineButton>
          <PrimaryButton onClick={() => { setCreateOpen(false); setActionInfo({ key: 'created', label: 'Yeni Template Olusturuldu (mock)', row: form }) }}>Kaydet</PrimaryButton>
        </>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { k: 'kpTemplateKodu', l: 'Template Kodu' },{ k: 'adi', l: 'Adi' },{ k: 'versiyon', l: 'Versiyon' },
            { k: 'katkiPayiTutari', l: 'Tutar' },{ k: 'odemePeriyodu', l: 'Periyot' },{ k: 'dovizKp', l: 'Doviz' },
            { k: 'gecerlilik', l: 'Gecerlilik' },
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
        description={`${selected.length} adet template secildi.`}
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
