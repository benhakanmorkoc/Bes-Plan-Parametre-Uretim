# BES Plan Parametre Uretim

BES (Bireysel Emeklilik Sistemi) urun, plan, tarife, kesinti ve uretim parametrelerinin yonetimi icin React + Vite tabanli prototip.

## Calistirma

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Cikti `dist/` klasorune yazilir.

## Vercel Deploy

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `Bes-Plan-Parametre-Uretim` (eger monorepo icinde tutuluyorsa)

## Yapi

- `src/App.jsx` - Layout, sidebar menu, lazy ekran yonlendirme
- `src/components/screens/` - Tum ekranlar (lazy)
- `src/data/mockData.js` - Tum mock veriler
- `src/components/ui/Toolbar.jsx` - Ortak UI bilesenleri

Tum ekranlar `React.lazy` ile chunk'lanmistir; ana bundle ~50 kB gzip.
