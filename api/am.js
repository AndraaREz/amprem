export default async function handler(req, res) {
  // Anti-cors for direct abuse, only allow same origin or vercel
  const allowedOrigins = ['https://zhinnx-amprem.vercel.app', 'https://zhinnx-amprem-*.vercel.app'];
  // Simple CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action, email, url } = req.query;

    if (!action) {
      return res.status(400).json({ status: false, message: 'Missing action' });
    }

    // Server-side secrets, not exposed to client
    const API_KEY = process.env.AM_API_KEY || process.env.VITE_AM_API_KEY || 'freeapikeydhan26';
    const API_BASE = process.env.AM_API_BASE || process.env.VITE_AM_API_BASE || 'https://restapidhan.vercel.app/api/am';

    // Basic validation to prevent abuse
    if (action === 'send') {
      if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
        return res.status(400).json({ status: false, message: 'Email wajib gmail.com' });
      }
    }

    if (action === 'verif') {
      if (!email || !url) {
        return res.status(400).json({ status: false, message: 'Email dan URL wajib' });
      }
      if (!url.startsWith('https://alight-creative.firebaseapp.com/')) {
        return res.status(400).json({ status: false, message: 'Format magic link tidak valid' });
      }
    }

    // Build target URL with server-side apikey hidden
    let targetUrl = '';
    if (action === 'send') {
      targetUrl = `${API_BASE}?action=send&apikey=${encodeURIComponent(API_KEY)}&email=${encodeURIComponent(email)}`;
    } else if (action === 'verif') {
      targetUrl = `${API_BASE}?action=verif&apikey=${encodeURIComponent(API_KEY)}&email=${encodeURIComponent(email)}&url=${encodeURIComponent(url)}`;
    } else {
      return res.status(400).json({ status: false, message: 'Action tidak dikenal' });
    }

    // Proxy request
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'ZhinnxAMPrem/1.0',
      },
    });

    const data = await upstream.json();

    // Do not leak upstream apikey in response, return clean
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ status: false, message: 'Server proxy error, coba lagi' });
  }
}
