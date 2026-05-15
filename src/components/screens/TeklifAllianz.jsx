import { useMemo, useState } from 'react'
import { allianzTeklifler } from '../../data/mockData'
import TeklifAllianzListe from './TeklifAllianzListe'
import TeklifAllianzIzle from './TeklifAllianzIzle'
import TeklifAllianzWizard from './TeklifAllianzWizard'

/** ekran: liste | yeni | izle */
export default function TeklifAllianz() {
  const [ekran, setEkran] = useState('liste')
  const [kayitlar, setKayitlar] = useState(() => [...allianzTeklifler])
  const [seciliId, setSeciliId] = useState(null)

  const seciliTeklif = useMemo(() => kayitlar.find((k) => k.id === seciliId) || null, [kayitlar, seciliId])

  if (ekran === 'yeni') {
    return (
      <TeklifAllianzWizard
        onVazgec={() => setEkran('liste')}
        onTamamla={(yeni) => {
          setKayitlar((prev) => [yeni, ...prev])
          setSeciliId(yeni.id)
          setEkran('izle')
        }}
      />
    )
  }

  if (ekran === 'izle' && seciliTeklif) {
    return (
      <TeklifAllianzIzle
        teklif={seciliTeklif}
        onGeri={() => {
          setSeciliId(null)
          setEkran('liste')
        }}
      />
    )
  }

  return (
    <TeklifAllianzListe
      kayitlar={kayitlar}
      onYeniEkle={() => setEkran('yeni')}
      onIzle={(id) => {
        setSeciliId(id)
        setEkran('izle')
      }}
    />
  )
}
