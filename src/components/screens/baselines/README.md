# Allianz Teklif — baseline arşivi

Bu klasör **çalışan referans kopyaları** içerir. Uygulama her zaman üst dizindeki `TeklifAllianzWizard.jsx` dosyasını kullanır; buradaki dosyalar import edilmez.

## v1-digitall (2025-05-15)

- **Dosya:** `TeklifAllianzWizard.v1-digitall.jsx`
- **İçerik:** 6 adımlı DigitALL tasarımı, KPS mock (Ara), FATCA/CRS, plan fon kartı, ödeme özeti, onay ekranı.

### Geri yükleme (Windows PowerShell)

```powershell
Copy-Item "src\components\screens\baselines\TeklifAllianzWizard.v1-digitall.jsx" "src\components\screens\TeklifAllianzWizard.jsx" -Force
```

### Yeni özellik eklerken

1. `TeklifAllianzWizard.jsx` üzerinde geliştirin.
2. Büyük değişiklik öncesi/sonrası `npm run build` çalıştırın.
3. Milestone tamamlandığında yeni `TeklifAllianzWizard.v2-....jsx` kopyası oluşturup `MANIFEST.json` güncelleyin.

Git ile kalıcı saklamak için: `git add src/components/screens/baselines/` ve commit.
