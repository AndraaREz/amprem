# Zhinnx AMPrem — 永久 Premium 1 Tahun

Single page claim Alight Motion Premium 1 tahun gratis, redesign total pakai style China Generator buatan zhinnx sendiri.

**Repo:** https://github.com/zhinnx/zhinnx-amprem  
**Style Ref:** id-china (CN ID) — DM Sans + Noto Sans SC, background #f5f5f7, glass blur 24px, noise 0.025, doodles circle/line/star ✦, kinetic 永久

## Kenapa redesign?

Request user: web sebelumnya jelek, tidak responsif, terlalu AI, banyak bocor API URL & API key, butuh anti debug, dan hanya 1 page "/" saja (premium pindah ke home, langsung claim).

## Fix yang dilakukan

### 1. Satu page saja "/"
- Hapus Home.jsx + Premium.jsx + Nav + Footer lama
- Jadi Claim.jsx single page claim langsung di root, tidak ada routing lain

### 2. Style China Modern (ref index.html/style.css/script.js id-china)
- Page: `width: min(100% - 32px, 720px)` → mobile 16px margin each side, tidak tertekan. Desktop `min(100% - 80px, 760px)`
- Background #f5f5f7, surface rgba(255,255,255,0.78) blur, noise overlay, doodles
- Hero: eyebrow status-dot + "Alight Motion Premium System", title clamp 40px-78px bold -0.06em, kinetic-word 永久 dengan float 4s
- Card: radius 32px large, 20px medium, shadow soft 0 1px 2px + 0 16px 50px, backdrop blur, step indicator dot + line
- Input: height 56px, radius 20px, background 0.72, focus shadow 4px, hint dot ok/err
- Button: back 56px border, refresh black #1d1d1f, hover rotate 180deg, loading spin
- Info grid responsive 1 col mobile → 2 col desktop, no 3 equal cards monoton
- Video 16:9 rounded, toast bottom center pill black

### 3. Anti bocor API & API key
Sebelumnya frontend manggil langsung:
`https://restapidhan.vercel.app/api/am?action=send&apikey=freeapikeydhan26&email=...`
→ bocor di Network tab, semua orang bisa lihat key.

Sekarang:
- Frontend hanya: `/api/am?action=send&email=...` dan `/api/am?action=verif&email=&url=`
- Buat Vercel serverless `/api/am.js` yang baca `process.env.AM_API_KEY` dan `AM_API_BASE` server-side, lalu proxy ke upstream. Response tidak include apikey.
- `.env` di gitignore, hanya `.env.example`. Key asli set di Vercel Dashboard > Env Variables.
- Verifikasi input: gmail only di server juga, URL harus prefix alight-creative.firebaseapp.com

### 4. Anti debug / anti bajak
- Disable right click contextmenu → toast "右键已禁用"
- Block F12, Ctrl+Shift+I/J/C, Ctrl+U → toast + trigger block
- DevTools detect: cek outerWidth-innerWidth >160 dan outerHeight-innerHeight >160 + interval + resize listener
- Debugger trap: setInterval debugger, ukur performance.now diff >100 → devtools paused
- Jika terdeteksi: overlay full screen `.debug-block` hitam, clear email/url, minta refresh tanpa devtools
- Security headers di vercel.json: X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict

### 5. Responsive fix
- Page padding safe-area-inset, clamp font hero, actions grid auto 1fr → mobile 56px+1fr (back icon only), info-grid 1→2 col
- Input 56px touch target >44px, focus ring 2px
- No overflow-x, blueprint mini flex, result box grid
- Tested 320/375/414/768/1280

## Cara kerja (tetap sama flow kamu)
1. Input email Gmail → klik Kirim magic link → hit `/api/am?action=send`
2. Buka Gmail → Spam → salin link `https://alight-creative.firebaseapp.com/__/auth/links?link=...`
3. Tempel di textarea → Verifikasi & Aktifkan → hit `/api/am?action=verif` → response `valid true autoRenewing true expiry 1 tahun`

Jangan pakai URL contoh docs, sudah expired pasti gagal.

## Env
Set di Vercel:
```
AM_API_KEY=freeapikeydhan26
AM_API_BASE=https://restapidhan.vercel.app/api/am
VITE_YOUTUBE_VIDEO_ID=your_youtube_id
```

Local dev buat file `.env`:
```
AM_API_KEY=freeapikeydhan26
AM_API_BASE=https://restapidhan.vercel.app/api/am
VITE_YOUTUBE_VIDEO_ID=dQw4w9WgXcQ
```

## Run
```bash
npm install
npm run dev
# build
npm run build
```

## Vercel deploy
- Import github zhinnx/zhinnx-amprem
- Framework Vite
- Env vars AM_API_KEY, AM_API_BASE, VITE_YOUTUBE_VIDEO_ID
- Deploy, /api otomatis jadi serverless

## Design tokens (ref CN ID)
--background #f5f5f7, --surface 0.78, --text #1d1d1f, --border 0.07, --accent #ff3b30, --radius-large 32px
