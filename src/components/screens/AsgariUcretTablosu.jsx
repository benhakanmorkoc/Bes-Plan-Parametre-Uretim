import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Modal from '../ui/Modal'
import { ScreenHeader, PrimaryButton, OutlineButton } from '../ui/Toolbar'
import { asgariUcretDetaylari as seedDetaylar, asgariUcretTablosu as seedRows } from '../../data/mockData'

function emptyForm() {
  return {
    id: null,
    gecerlilikTarihi: '',
    asgariUcret: '',
    katkiPayiOrani: '',
    girisAidatiOrani: '',
  }
}

export default function AsgariUcretTablosu() {
  const [rows, setRows] = useState(() => seedRows.map((x) => ({ ...x })))
  const [detailMap, setDetailMap] = useState(() => ({ ...seedDetaylar }))
  const [selectedTarih, setSelectedTarih] = useState(seedRows[0]?.gecerlilikTarihi || '')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [formOpen, setFormOpen] = useState(false)
  const [infoModal, setInfoModal] = useState({ open: false, title: '', body: null })

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) =>
      `${r.gecerlilikTarihi} ${r.asgariUcret} ${r.katkiPayiOrani} ${r.girisAidatiOrani}`
        .toLowerCase()
        .includes(q),
    )
  }, [rows, search])

  const selectedRow =
    rows.find((r) => r.gecerlilikTarihi === selectedTarih) || filteredRows[0] || null
  const selectedDetails = selectedRow ? detailMap[selectedRow.gecerlilikTarihi] || [] : []

  const openCreate = () => {
    setForm(emptyForm())
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setForm({ ...row })
    setFormOpen(true)
    setMenuId(null)
  }

  const saveForm = () => {
    if (!form.gecerlilikTarihi.trim()) {
      alert('Geçerlilik Tarihi zorunludur.')
      return
    }
    if (!form.asgariUcret.trim()) {
      alert('Asgari Ücret zorunludur.')
      return
    }
    const payload = { ...form, id: form.id || Date.now() }

    const existsByDate = rows.some(
      (r) => r.gecerlilikTarihi === payload.gecerlilikTarihi && r.id !== payload.id,
    )
    if (existsByDate) {
      alert('Bu geçerlilik tarihinde kayıt mevcut.')
      return
    }

    const exists = rows.some((r) => r.id === payload.id)
    if (exists) {
      const old = rows.find((r) => r.id === payload.id)
      setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)))
      if (old && old.gecerlilikTarihi !== payload.gecerlilikTarihi) {
        setDetailMap((prev) => {
          const oldDetails = prev[old.gecerlilikTarihi] || []
          const { [old.gecerlilikTarihi]: _, ...rest } = prev
          return { ...rest, [payload.gecerlilikTarihi]: oldDetails }
        })
      }
    } else {
      setRows((prev) => [...prev, payload])
      setDetailMap((prev) => ({ ...prev, [payload.gecerlilikTarihi]: [] }))
    }

    setSelectedTarih(payload.gecerlilikTarihi)
    setFormOpen(false)
  }

  const openInspect = (row) => {
    setInfoModal({
      open: true,
      title: 'Asgari Ücret İncele',
      body: (
        <div className="space-y-1 text-sm">
          <p>
            <strong>Geçerlilik Tarihi:</strong> {row.gecerlilikTarihi}
          </p>
          <p>
            <strong>Asgari Ücret:</strong> {row.asgariUcret}
          </p>
          <p>
            <strong>Katkı Payı Oranı:</strong> {row.katkiPayiOrani}
          </p>
          <p>
            <strong>Giriş Aidatı Oranı:</strong> {row.girisAidatiOrani}
          </p>
        </div>
      ),
    })
    setMenuId(null)
  }

  const openVersions = (row) => {
    setInfoModal({
      open: true,
      title: 'Versiyonlar',
      body: (
        <ul className="list-disc pl-5 text-sm">
          <li>{row.gecerlilikTarihi} - Versiyon 1</li>
          <li>{row.gecerlilikTarihi} - Versiyon 2</li>
        </ul>
      ),
    })
    setMenuId(null)
  }

  const removeRow = (row) => {
    if (!window.confirm('Kayıt silinsin mi?')) return
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setDetailMap((prev) => {
      const { [row.gecerlilikTarihi]: _, ...rest } = prev
      return rest
    })
    if (selectedTarih === row.gecerlilikTarihi) {
      const next = rows.find((r) => r.id !== row.id)
      setSelectedTarih(next?.gecerlilikTarihi || '')
    }
    setMenuId(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Asgari Ücret Tablosu"
        description="Dönemsel asgari ücret ve oran tanımları ile alt kanal detayları"
        right={
          <PrimaryButton onClick={openCreate}>
            <Plus className="w-4 h-4" /> Yeni Ekle
          </PrimaryButton>
        }
      />

      <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-md text-sm"
            placeholder="Tarih / ücret / oran ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0">
        <div className="overflow-auto border-r border-slate-200">
          <table className="w-full grid-table">
            <thead>
              <tr>
                <th>Geçerlilik Tarihi</th>
                <th>Asgari Ücret</th>
                <th>Katkı Payı Oranı</th>
                <th>Giriş Aidatı Oranı</th>
                <th className="w-12 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className={selectedTarih === row.gecerlilikTarihi ? 'bg-blue-50/50' : ''}
                  onClick={() => setSelectedTarih(row.gecerlilikTarihi)}
                >
                  <td>{row.gecerlilikTarihi}</td>
                  <td>{row.asgariUcret}</td>
                  <td>{row.katkiPayiOrani}</td>
                  <td>{row.girisAidatiOrani}</td>
                  <td className="relative text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      onClick={() => setMenuId((prev) => (prev === row.id ? null : row.id))}
                    >
                      ...
                    </button>
                    {menuId === row.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 text-left text-sm">
                        <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openInspect(row)}>İncele</button>
                        <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openEdit(row)}>Güncelle</button>
                        <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-50" onClick={() => openVersions(row)}>Versiyonlar</button>
                        <button type="button" className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => removeRow(row)}>Sil</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-slate-500 text-center">Kayıt bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-auto">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">
              Alt Detay - {selectedRow ? selectedRow.gecerlilikTarihi : 'Kayıt seçin'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Kanal bazlı limit ve oran detayları</p>
          </div>
          <div className="p-4">
            <div className="overflow-auto border border-slate-200 rounded-md">
              <table className="w-full grid-table text-sm">
                <thead>
                  <tr>
                    <th>Kanal</th>
                    <th>Min. Katkı Payı</th>
                    <th>Max. Giriş Aidatı</th>
                    <th>Not</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDetails.map((d) => (
                    <tr key={d.id}>
                      <td>{d.kanal}</td>
                      <td>{d.minKatkiPayi}</td>
                      <td>{d.maxGirisAidati}</td>
                      <td>{d.not}</td>
                    </tr>
                  ))}
                  {!selectedDetails.length && (
                    <tr>
                      <td colSpan={4} className="py-6 text-sm text-slate-500 text-center">
                        Seçili kayda ait alt detay yok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Asgari Ücret Kaydı"
        footer={
          <>
            <OutlineButton onClick={() => setFormOpen(false)}>Vazgeç</OutlineButton>
            <PrimaryButton onClick={saveForm}>Kaydet</PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Geçerlilik Tarihi *</span>
            <input className="form-input" value={form.gecerlilikTarihi} onChange={(e) => setForm((f) => ({ ...f, gecerlilikTarihi: e.target.value }))} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Asgari Ücret *</span>
            <input className="form-input" value={form.asgariUcret} onChange={(e) => setForm((f) => ({ ...f, asgariUcret: e.target.value }))} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Katkı Payı Oranı</span>
            <input className="form-input" value={form.katkiPayiOrani} onChange={(e) => setForm((f) => ({ ...f, katkiPayiOrani: e.target.value }))} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-slate-600 mb-1">Giriş Aidatı Oranı</span>
            <input className="form-input" value={form.girisAidatiOrani} onChange={(e) => setForm((f) => ({ ...f, girisAidatiOrani: e.target.value }))} />
          </label>
        </div>
      </Modal>

      <Modal
        open={infoModal.open}
        onClose={() => setInfoModal({ open: false, title: '', body: null })}
        title={infoModal.title}
        footer={<PrimaryButton onClick={() => setInfoModal({ open: false, title: '', body: null })}>Tamam</PrimaryButton>}
      >
        {infoModal.body}
      </Modal>
    </div>
  )
}
