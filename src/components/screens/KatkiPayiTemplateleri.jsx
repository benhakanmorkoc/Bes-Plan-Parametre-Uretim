import { useMemo, useState } from 'react'
import { Plus, Search, Link as LinkIcon } from 'lucide-react'
import { katkiPayiTemplateleri } from '../../data/mockData'
import { ScreenHeader, PrimaryButton, OutlineButton, StatusBadge } from '../ui/Toolbar'

export default function KatkiPayiTemplateleri() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState([])

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
            <OutlineButton disabled={selected.length === 0}>
              <LinkIcon className="w-4 h-4" /> Planlara Bagla
            </OutlineButton>
            <PrimaryButton><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>
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
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="text-center text-slate-500 py-6 text-sm">Sonuc bulunamadi</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
