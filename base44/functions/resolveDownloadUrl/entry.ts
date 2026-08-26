import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

function base64UrlEncode(str) {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const UA = 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

// Follow redirect chain (headers only, no body download) until we reach a
// URL containing `resid=` on onedrive.live.com — the canonical share page.
async function resolveShortLink(url) {
  let current = url;
  const seen = new Set();
  for (let i = 0; i < 10; i++) {
    if (seen.has(current)) break;
    seen.add(current);
    let res;
    try {
      res = await fetch(current, { redirect: 'manual', headers: { 'user-agent': UA } });
    } catch {
      break;
    }
    const loc = res.headers.get('location');
    if (!loc) break;
    current = loc;
    if (/onedrive\.live\.com/i.test(current) && /resid=/i.test(current)) break;
  }
  return current;
}

// Probe the legacy download endpoint. If the share is public, it 302-redirects
// straight to the pre-signed CDN blob URL — return that (one-click download,
// no OneDrive login needed). If it redirects to a login/account page or
// returns HTML (200), the link is private/broken → return null.
async function probeDownload(downloadUrl) {
  try {
    const res = await fetch(downloadUrl, { redirect: 'manual', headers: { 'user-agent': UA } });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (loc && !/login\.|account\.live\.com|signin\./i.test(loc)) {
        return loc;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function resolveOneDrivePersonal(url) {
  // 1. Resolve short links to the canonical onedrive.live.com URL.
  let target = url;
  if (/1drv\.ms/i.test(url)) {
    target = await resolveShortLink(url);
  }

  // 2. Extract resid + authkey (the `e` param on new-format links is the authkey).
  let resid = null;
  let authkey = null;
  try {
    const u = new URL(target);
    resid = u.searchParams.get('resid');
    authkey = u.searchParams.get('authkey') || u.searchParams.get('e');
  } catch {
    // not a URL
  }
  if (!authkey) {
    try {
      authkey = new URL(url).searchParams.get('e');
    } catch {
      // ignore
    }
  }

  // 3. Build the legacy direct-download endpoint and probe it for the real blob URL.
  if (resid) {
    const params = new URLSearchParams();
    params.set('resid', resid);
    if (authkey) params.set('authkey', authkey);
    const downloadUrl = `https://onedrive.live.com/download?${params.toString()}`;
    const blob = await probeDownload(downloadUrl);
    if (blob) return blob;
    // fall through to shares API fallback
  }

  // 4. Last resort: Microsoft shares API (base64url-encoded share link).
  return `https://api.onedrive.com/v1.0/shares/u!${base64UrlEncode(url)}/root/content`;
}

function resolveSharePoint(url) {
  try {
    const u = new URL(url);
    u.searchParams.set('download', '1');
    return u.toString();
  } catch {
    return url;
  }
}

function resolveGoogleDrive(url) {
  const m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  return url;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const url = body && body.url;
    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'url is required' }, { status: 400 });
    }

    let direct = url;
    if (/onedrive\.live\.com|1drv\.ms/i.test(url)) {
      direct = await resolveOneDrivePersonal(url);
    } else if (/sharepoint\.com|-my\.sharepoint\.com/i.test(url)) {
      direct = resolveSharePoint(url);
    } else if (/drive\.google\.com/i.test(url)) {
      direct = resolveGoogleDrive(url);
    }

    return Response.json({ url: direct });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}