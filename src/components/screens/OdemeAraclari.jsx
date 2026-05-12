import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ScreenHeader, PrimaryButton } from '../ui/Toolbar'
import { odemeAraclari as seedRows } from '../../data/mockData'

const yesNo = (v) => (String(v).toLowerCase() === 'evet' ? 'Evet' : 'Hayır')

export default function OdemeAraclari() {
  const [rows] = useState(() => seedRows.map((x) => ({ ...x })))

  return (
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        title="Ödeme Araçları"
        description="Sistemdeki ödeme araçları tablosu."
        right={<PrimaryButton><Plus className="w-4 h-4" /> Yeni Ekle</PrimaryButton>}
      />

      <div className="flex-1 overflow-auto">
        <table className="w-full grid-table text-sm min-w-[1450px]">
          <thead>
            <tr>
              <th></th>
              <th>Ödeme Tipi Kodu</th>
              <th>Ödeme Tipi Adı</th>
              <th>Makbuz Basılacak mı?</th>
              <th>BES Kurum Tahsilat Listesine Çıkacak mı?</th>
              <th>Hesap Zorunlu mu?</th>
              <th>Kredi Kartı Zorunlu mu?</th>
              <th>Oluşturan Kullanıcı</th>
              <th>Oluşturma Tarihi</th>
              <th>Güncelleyen Kul</th>
              <th className="text-right">Liste İşlemleri</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id}>
                <td><input type="checkbox" /></td>
                <td className="font-semibold">{r.kod}</td>
                <td>{r.ad}</td>
                <td>{yesNo(r.makbuzBasilacak)}</td>
                <td>{yesNo(r.besTahsilatListesi)}</td>
                <td>{yesNo(r.hesapZorunlu)}</td>
                <td>{yesNo(r.krediKartiZorunlu)}</td>
                <td>{r.olusturan || 'uaktas'}</td>
                <td>{`15.09.2025 14:${String(22 - idx * 3).padStart(2, '0')}`}</td>
                <td>uaktas</td>
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
