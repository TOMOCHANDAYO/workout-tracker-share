# Workout Tracker

友達に一時共有しやすいように、単体 `jsx` をそのまま Web 公開向けの `Vite + React` アプリに移植した版です。

## 起動

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` ができたら、そのまま静的ホスティングに載せられます。

## 共有の最短手段

### Vercel

1. このフォルダを GitHub に push
2. Vercel でリポジトリを import
3. Framework Preset は `Vite`
4. Deploy

### Netlify

1. このフォルダを GitHub に push
2. Netlify でリポジトリを import
3. Build command は `npm run build`
4. Publish directory は `dist`
5. Deploy

## 補足

- データ保存は `window.storage` ではなくブラウザの `localStorage` を使います
- 写真もブラウザ内に保存されるため、別端末には同期されません
- まずは「1回だけ友達に見せる」用途に向いた構成です
