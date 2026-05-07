import { useMemo, useState } from 'react'

const fmtTl = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value || 0)

function DemoScreen() {
  const [form, setForm] = useState({
    aylikKatkiPayi: 2000,
    sureYil: 20,
    yillikFonGetirisi: 20,
    yillikEnflasyon: 15,
    devletKatkisiOrani: 30,
  })

  const summary = useMemo(() => {
    const aylikKatki = Number(form.aylikKatkiPayi) || 0
    const yil = Number(form.sureYil) || 0
    const ay = Math.max(0, yil * 12)
    const aylikGetiri = (Number(form.yillikFonGetirisi) || 0) / 12 / 100
    const devletKatkiOrani = (Number(form.devletKatkisiOrani) || 0) / 100
    const enflasyon = (Number(form.yillikEnflasyon) || 0) / 100

    const katilimciOdeme = aylikKatki * ay
    const devletKatkisi = katilimciOdeme * devletKatkiOrani
    const aylikToplamYatirim = aylikKatki * (1 + devletKatkiOrani)
    const nominalBirikim =
      aylikGetiri > 0
        ? aylikToplamYatirim * ((Math.pow(1 + aylikGetiri, ay) - 1) / aylikGetiri)
        : aylikToplamYatirim * ay
    const reelBirikim = nominalBirikim / Math.pow(1 + enflasyon, yil || 0)

    return { katilimciOdeme, devletKatkisi, nominalBirikim, reelBirikim }
  }, [form])

  const onNumberChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <section className="panel">
      <header className="panelHeader">
        <h2>Demo Ekrani</h2>
        <p>BES birikim simülasyonu (prototip)</p>
      </header>

      <div className="contentGrid">
        <div className="card">
          <h3>Girdiler</h3>
          <div className="fieldGrid">
            <label>
              Aylik Katki Payi (TL)
              <input type="number" min="0" value={form.aylikKatkiPayi} onChange={onNumberChange('aylikKatkiPayi')} />
            </label>
            <label>
              Sure (Yil)
              <input type="number" min="1" value={form.sureYil} onChange={onNumberChange('sureYil')} />
            </label>
            <label>
              Yillik Fon Getirisi (%)
              <input type="number" min="0" value={form.yillikFonGetirisi} onChange={onNumberChange('yillikFonGetirisi')} />
            </label>
            <label>
              Yillik Enflasyon (%)
              <input type="number" min="0" value={form.yillikEnflasyon} onChange={onNumberChange('yillikEnflasyon')} />
            </label>
            <label>
              Devlet Katkisi Orani (%)
              <input type="number" min="0" max="30" value={form.devletKatkisiOrani} onChange={onNumberChange('devletKatkisiOrani')} />
            </label>
          </div>
        </div>

        <div className="card resultCard">
          <h3>Ozet</h3>
          <div className="row"><span>Toplam Katilimci Odemesi</span><strong>{fmtTl(summary.katilimciOdeme)}</strong></div>
          <div className="row"><span>Toplam Devlet Katkisi</span><strong>{fmtTl(summary.devletKatkisi)}</strong></div>
          <div className="row"><span>Nominal Birikim</span><strong>{fmtTl(summary.nominalBirikim)}</strong></div>
          <div className="row"><span>Reel Birikim</span><strong>{fmtTl(summary.reelBirikim)}</strong></div>
        </div>
      </div>
    </section>
  )
}

export default DemoScreen
