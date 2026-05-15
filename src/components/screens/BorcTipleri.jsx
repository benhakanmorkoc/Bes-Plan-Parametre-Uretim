import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ScreenHeader, PrimaryButton } from '../ui/Toolbar'
import { borcTipleri as seedRows } from '../../data/mockData'

const yesNo = (v) => (String(v).toLowerCase() === 'evet' ? 'Evet' : 'Hayır')

export default function BorcTipleri() {
  const [rows] = useState(() => seedRows.map((x) => ({ ...x })))

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Borç Tipleri"
        description="Sistemde kullanılacak borç tiplerinin tablosu."
        right={<PrimaryButton><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>}
      />

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm min-w-[1400px]">
          <thead>
            <tr>
              <th></th>
              <th>Borç Tipi Kodu</th>
              <th>Borç Tipi Adı</th>
              <th>BSMV</th>
              <th>Tahakkuk</th>
              <th>Tüm Borcu Öde</th>
              <th>Birikime Transfer</th>
              <th>Ödeme Planı</th>
              <th>Provizyon Listesine Çıksın</th>
              <th>OKS</th>
              <th>DK</th>
              <th>Pasif Plana Dağıtım</th>
              <th>Oluşturan Kullanıcı</th>
              <th className="text-right">Liste İşlemleri</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><input type="checkbox" /></td>
                <td className="font-semibold">{r.kod}</td>
                <td>{r.ad}</td>
                <td>{yesNo(r.bsmv)}</td>
                <td>{yesNo(r.tahakkuk)}</td>
                <td>{yesNo(r.tumBorcOde)}</td>
                <td>{yesNo(r.birikimeTransfer)}</td>
                <td>{r.kod === 'T' || r.kod === 'P' ? 'Evet' : 'Hayır'}</td>
                <td>{r.kod === 'P' ? 'Evet' : 'Hayır'}</td>
                <td>Hayır</td>
                <td>Hayır</td>
                <td>Hayır</td>
                <td>{r.kod === 'K' ? 'edemir' : 'uaktas'}</td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-3">
                    <button type="button" className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4" /></button>
                    <button type="button" className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Sayfa başına</span>
          <select className="h-8 border border-slate-300 rounded-md px-2">
            <option>10</option>
          </select>
        </div>
        <span>Toplam {rows.length} kayıt</span>
      </div>
    </div>
  )
}
