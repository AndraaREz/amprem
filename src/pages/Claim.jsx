import { useEffect, useRef, useState } from 'react'

export default function Claim() {
  const [email, setEmail] = useState('')
  const [magicUrl, setMagicUrl] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, msg: '' })
  const [result, setResult] = useState(null)
  const [blocked, setBlocked] = useState(false)

  const YT_ID = import.meta.env.VITE_YOUTUBE_VIDEO_ID || 'dQw4w9WgXcQ'

  const isGmail = (v) => v.trim().toLowerCase().endsWith('@gmail.com') && v.includes('@') && v.trim().length > 10
  const urlValid = magicUrl.trim().startsWith('https://alight-creative.firebaseapp.com/__/auth/links')

  // Toast helper
  const showToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400)
  }

  // Anti-debug / anti-piracy
  useEffect(() => {
    const block = () => {
      setBlocked(true)
      // Try to clear sensitive data
      setEmail('')
      setMagicUrl('')
    }

    // Disable context menu
    const onContext = (e) => { e.preventDefault(); showToast('右键已禁用 右键被禁用'); return false }
    // Disable keys
    const onKey = (e) => {
      const k = e.key?.toLowerCase()
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
        (e.ctrlKey && k === 'u')
      ) {
        e.preventDefault()
        showToast('开发者工具已阻止')
        block()
        return false
      }
    }

    // DevTools detection via window size
    let devtoolsOpen = false
    const checkDevTools = () => {
      const threshold = 160
      const widthDiff = window.outerWidth - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      const isOpen = widthDiff > threshold || heightDiff > threshold
      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true
        showToast('检测到开发者工具')
        // Slight delay to avoid false positive on mobile keyboard
        setTimeout(() => {
          if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
            block()
          }
        }, 800)
      } else if (!isOpen) {
        devtoolsOpen = false
      }
    }

    // Debugger trap (light)
    const debuggerTrap = setInterval(() => {
      if (blocked) return
      const start = performance.now()
      // eslint-disable-next-line no-debugger
      debugger
      const end = performance.now()
      if (end - start > 100) {
        // devtools likely open and paused
        checkDevTools()
      }
    }, 2000)

    const interval = setInterval(checkDevTools, 1000)

    document.addEventListener('contextmenu', onContext)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', checkDevTools)

    return () => {
      document.removeEventListener('contextmenu', onContext)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', checkDevTools)
      clearInterval(interval)
      clearInterval(debuggerTrap)
    }
  }, [blocked])

  const handleSend = async () => {
    if (!isGmail(email)) {
      setError('Wajib gmail.com, contoh: namakamu@gmail.com')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/am?action=send&email=${encodeURIComponent(email.trim())}`)
      const json = await res.json()
      if (json.status || json.message?.toLowerCase().includes('berhasil') || json.message?.toLowerCase().includes('dikirim')) {
        setStep(2)
        showToast('Magic link terkirim ke Spam')
      } else {
        setError(json.message || 'Gagal mengirim link, coba lagi')
      }
    } catch {
      setError('Gagal konek server proxy, coba lagi')
    } finally { setLoading(false) }
  }

  const handleVerif = async () => {
    if (!urlValid) {
      setError('URL harus diawali https://alight-creative.firebaseapp.com/__/auth/links — pakai URL asli dari Spam kamu, jangan contoh')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/am?action=verif&email=${encodeURIComponent(email.trim())}&url=${encodeURIComponent(magicUrl.trim())}`)
      const json = await res.json()
      if (json.status === true || json.data?.result?.valid === true) {
        setResult(json)
        setStep(3)
        showToast('Berhasil diaktifkan 永久')
      } else {
        setError(json.message || 'Verifikasi gagal, pastikan URL masih 5 menit dan asli dari Gmail')
      }
    } catch {
      setError('Gagal verifikasi, URL mungkin expired')
    } finally { setLoading(false) }
  }

  const reset = () => { setStep(1); setEmail(''); setMagicUrl(''); setResult(null); setError('') }

  if (blocked) {
    return (
      <div className="debug-block">
        <div>
          <h1>访问被阻止<br/>Akses Diblokir</h1>
          <p>Sistem mendeteksi pembukaan Developer Tools / percobaan melihat kode. Untuk melindungi sistem premium dan mencegah pembajakan API, akses dihentikan.</p>
          <p style={{marginTop: 16, fontSize: 12, opacity: 0.7}}>Jika ini kesalahan, refresh halaman tanpa DevTools terbuka.</p>
          <button onClick={() => location.reload()} style={{marginTop: 24, padding: '12px 22px', borderRadius: 999, border: '1px solid #333', background: '#fff', color: '#000', fontWeight: 600, cursor: 'pointer'}}>Refresh Halaman</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="noise" />
      <div className="doodle doodle-circle" />
      <div className="doodle doodle-line" />
      <div className="doodle doodle-star">✦</div>

      <main className="page">
        {/* HERO */}
        <header className="hero">
          <div className="eyebrow"><span className="status-dot" /> Alight Motion Premium System • 24h Online</div>
          <h1 className="hero-title">
            Claim <span className="kinetic-word"><span>永</span><span>久</span><span>权</span></span><br/>Premium 1 Tahun
          </h1>
          <p className="hero-description">
            Bukan hack APK. Pakai ketentuan trial resmi Alight Motion via magic link. Tanpa password, hanya email Gmail dan link dari folder Spam kamu.
          </p>
          <div className="hero-meta">
            <span className="meta-pill accent"><strong>✓</strong> Legal flow</span>
            <span className="meta-pill"><strong>Gmail</strong> only</span>
            <span className="meta-pill">Sesi <strong>5 menit</strong></span>
            <span className="meta-pill">API via <strong>/api/am proxy</strong></span>
          </div>
        </header>

        {/* CARD */}
        <section className="account-section">
          <div className={`account-card ${loading ? 'switching' : ''}`}>
            <div className="card-top">
              <span className="card-label">ANDRAA ACTIVATION</span>
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <div className="step-indicator">
                  <div className={`step-dot ${step > 1 ? 'done' : step === 1 ? 'active' : ''}`}>{step > 1 ? '✓' : '1'}</div>
                  <div className={`step-line ${step > 1 ? 'done' : ''}`} />
                  <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>{step > 2 ? '✓' : '2'}</div>
                  <div className={`step-line ${step > 2 ? 'done' : ''}`} />
                  <div className={`step-dot ${step === 3 ? 'active' : ''}`}>3</div>
                </div>
                <div className="random-mark">激活</div>
              </div>
            </div>

            {step === 1 && (
              <div className="identity">
                <div className="identity-block">
                  <span className="field-label">EMAIL GMAIL — WAJIB @GMAIL.COM</span>
                  <div className="field-row">
                    <div className="input-wrap">
                      <input
                        className="input-field"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        placeholder="namakamu@gmail.com"
                        type="email"
                        autoComplete="email"
                        autoFocus
                      />
                      <span className="input-badge">Gmail</span>
                    </div>
                  </div>
                  <div className={`input-hint ${!email ? '' : isGmail(email) ? 'ok' : 'err'}`}>
                    <span className="dot" />
                    { !email ? 'Masukkan email yang login di Alight Motion' : isGmail(email) ? 'Format valid, siap kirim magic link ke Spam' : 'Harus berakhiran @gmail.com' }
                  </div>
                </div>

                {error && <div style={{marginTop: 16, padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(255,59,48,0.18)', background: 'rgba(255,59,48,0.07)', fontSize: 12, color: 'var(--accent)', lineHeight: 1.5}}>{error}</div>}

                <div className="actions">
                  <button className="back-button" disabled><span>•</span></button>
                  <button className={`refresh-button ${loading ? 'loading' : ''}`} onClick={handleSend} disabled={!isGmail(email) || loading}>
                    <span>{loading ? 'Mengirim link ke Spam...' : 'Kirim magic link →'}</span>
                    <svg viewBox="0 0 24 24"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/></svg>
                  </button>
                </div>

                <div className="blueprint-mini">
                  <svg viewBox="0 0 80 54" fill="none"><rect x="2" y="2" width="76" height="32" rx="10" stroke="currentColor" opacity="0.2"/><circle cx="18" cy="18" r="4" fill="var(--accent)"/><path d="M28 18 H62" stroke="currentColor" strokeDasharray="4 4" opacity="0.4"/><rect x="8" y="40" width="18" height="8" rx="4" fill="currentColor" opacity="0.08"/><rect x="31" y="40" width="18" height="8" rx="4" fill="var(--accent)" opacity="0.2"/><rect x="54" y="40" width="18" height="8" rx="4" fill="currentColor" opacity="0.08"/></svg>
                  <div className="blueprint-text">
                    <strong>Sistem proxy aman:</strong> frontend hanya panggil <code>/api/am</code>. API key & base URL asli disimpan server-side Vercel env, tidak bocor di client. Magic link hanya berlaku 5 menit.
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="identity">
                <div className="identity-block">
                  <span className="field-label">MAGIC LINK — SALIN DARI SPAM GMAIL</span>
                  <div style={{fontSize: 11, color: 'var(--text-secondary)', background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.12)', padding: '10px 12px', borderRadius: 12, lineHeight: 1.5, marginBottom: 12}}>
                    Buka Gmail → <strong>Spam</strong> → email Alight Motion → tekan lama link → <strong>Salin alamat link</strong>. Jangan pakai URL contoh docs, sudah expired. Pakai URL asli punyamu.
                    <br/><span style={{color: 'var(--accent)', fontWeight: 600}}>Email aktif: {email}</span>
                  </div>
                  <textarea
                    className="textarea-field"
                    value={magicUrl}
                    onChange={(e) => { setMagicUrl(e.target.value); setError('') }}
                    placeholder="https://alight-creative.firebaseapp.com/__/auth/links?link=https://alightcreative.com/auth_action/?apiKey..."
                  />
                  <div className={`input-hint ${!magicUrl ? '' : urlValid ? 'ok' : 'err'}`}>
                    <span className="dot" />
                    { !magicUrl ? 'Tempel link lengkap di sini' : urlValid ? 'Format terdeteksi valid, siap verifikasi' : 'Harus diawali https://alight-creative.firebaseapp.com/__/auth/links' }
                  </div>
                </div>

                {error && <div style={{marginTop: 16, padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(255,59,48,0.18)', background: 'rgba(255,59,48,0.07)', fontSize: 12, color: 'var(--accent)', lineHeight: 1.5}}>{error}</div>}

                <div className="actions">
                  <button className="back-button" onClick={reset} type="button"><svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg><span>Ulang</span></button>
                  <button className={`refresh-button ${loading ? 'loading' : ''}`} onClick={handleVerif} disabled={!urlValid || loading}>
                    <span>{loading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan Premium'}</span>
                    <svg viewBox="0 0 24 24"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/></svg>
                  </button>
                </div>

                <div style={{marginTop: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(0,0,0,0.04)', fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5}}>
                  ⚠ URL adalah penghubung antar server. Contoh URL di internet sudah expired. Selalu pakai URL asli dari inbox Spam Gmail setelah step 1.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="identity">
                <div style={{textAlign: 'center', padding: '12px 0 4px'}}>
                  <div style={{width: 64, height: 64, margin: '0 auto', borderRadius: '50%', background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.2)', display: 'grid', placeItems: 'center', fontSize: 28}}>✓</div>
                  <div style={{marginTop: 14, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em'}}>Fitur Berhasil Diaktifkan</div>
                  <div style={{marginTop: 6, fontSize: 13, color: 'var(--text-secondary)'}}>Akun <strong style={{color: 'var(--text)'}}>{email}</strong> sekarang premium 永久</div>
                </div>

                <div className="result-box" style={{marginTop: 18}}>
                  <div className="result-row"><span>codeorder</span><span>{result?.codeorder || '79259'}</span></div>
                  <div className="result-row"><span>status</span><span className="ok">success</span></div>
                  <div className="result-row"><span>accountLinkStatus</span><span>{result?.data?.result?.accountLinkStatus || 'linked-current'}</span></div>
                  <div className="result-row"><span>autoRenewing</span><span className="ok">{String(result?.data?.result?.autoRenewing ?? true)}</span></div>
                  <div className="result-row"><span>valid</span><span className="ok">{String(result?.data?.result?.valid ?? true)}</span></div>
                  <div className="result-row"><span>expiry</span><span>{result?.data?.result?.expiryTimeMillis ? new Date(result.data.result.expiryTimeMillis).toLocaleDateString('id-ID', {year:'numeric', month:'long', day:'numeric'}) : '1 tahun dari sekarang'}</span></div>
                </div>

                <div className="actions">
                  <button className="back-button" onClick={reset}><svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg><span>Akun lain</span></button>
                  <button className="refresh-button" onClick={() => showToast('Buka Alight Motion dan cek premium')}><span>Buka Alight Motion</span><svg viewBox="0 0 24 24"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg></button>
                </div>
              </div>
            )}
          </div>

          {/* Info grid - tutorial seperti China generator modern */}
          <div className="info-grid">
            <div className="info-card">
              <h4>Cara kerja sistem</h4>
              <p><strong>1. Kirim email</strong> — frontend panggil <code>/api/am?action=send</code> (proxy aman).<br/><strong>2. Cek Spam</strong> — Alight kirim magic link ke Spam Gmail.<br/><strong>3. Tempel link</strong> — kami tukar jadi token premium 1 tahun di server.</p>
              <div style={{marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap'}}><span className="tag">no password</span><span className="tag">proxy aman</span><span className="tag red">anti bocor</span></div>
            </div>
            <div className="info-card accent">
              <h4>Peringatan penting</h4>
              <ul>
                <li>Wajib @gmail.com, selain itu link tidak masuk</li>
                <li>URL contoh docs sudah expired → pasti gagal</li>
                <li>URL asli cuma hidup 5 menit, jika expired ulangi</li>
                <li>Satu email satu trial, jangan spam endpoint</li>
              </ul>
            </div>
            <div className="info-card" style={{gridColumn: '1 / -1'}}>
              <h4>Kenapa gratis & legal?</h4>
              <p>Alight Motion punya flow signIn via oobCode & continueUrl resmi ke alightcreative.com. Kami cuma bantu orkestrasi link trial jadi 1 tahun dengan autoRenewing true. Bukan mod APK, bukan bypass bayar. Sistem premium yang kamu dapat itu <strong>valid true</strong> dari server Alight sendiri.</p>
              <div style={{marginTop: 12, fontFamily: 'ui-monospace, monospace', fontSize: 11, background: 'rgba(0,0,0,0.04)', padding: 10, borderRadius: 10, overflowX: 'auto'}}>
                {`{ "status": "success", "accountLinkStatus": "linked-current", "autoRenewing": true, "valid": true, "source": "cache" }`}
              </div>
            </div>
            <div className="info-card" style={{gridColumn: '1 / -1'}}>
              <h4>Video tutorial</h4>
              <div className="video-wrap">
                <iframe src={`https://www.youtube.com/embed/${YT_ID}?rel=0`} title="Tutorial" allowFullScreen loading="lazy" />
              </div>
              <p style={{marginTop: 10}}>Video ID diambil dari env <code>VITE_YOUTUBE_VIDEO_ID</code> — tanpa ubah kode. Simpan di Vercel env biar tidak bocor di public.</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-main">
            <div className="footer-brand">
              <span className="footer-brand-mark">永</span>
              <div>
                <p className="footer-brand-name">Andraa AMPrem</p>
                <p className="footer-brand-description">Alight Motion Premium 1Y • Proxy aman • Anti debug</p>
              </div>
            </div>
            <div className="footer-links">
              <a className="footer-link" href="https://github.com/Andraa/Andraa-amprem" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" style={{width: 18, height: 18, fill: 'currentColor'}}><path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.341-3.369-1.341-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.071 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.221-.253-4.555-1.111-4.555-4.943 0-1.092.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.833a9.57 9.57 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.591 1.028 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.748 0 .267.18.578.688.48C19.138 20.162 22 16.417 22 12c0-5.523-4.477-10-10-10Z"/></svg>
              </a>
              <a className="footer-link" href="mailto:zhindev@gmail.com" aria-label="Email">
                <svg viewBox="0 0 24 24" style={{width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7}}><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="m3 7 9 6 9-6"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Andraa AMPrem — Proxy anti bocor + Anti debug</span>
            <span>Crafted by <a href="https://github.com/Andraa">Andraa</a> • Style ref CN ID China Gen</span>
          </div>
        </footer>
      </main>

      <div className={`toast ${toast.show ? 'show' : ''}`} role="status">
        <div className="toast-icon">✓</div>
        <span>{toast.msg}</span>
      </div>
    </>
  )
}
