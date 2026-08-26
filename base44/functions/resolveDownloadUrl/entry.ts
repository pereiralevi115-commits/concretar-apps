import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

function base64UrlEncode(str) {
  // Buffer is available in the worker runtime
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function resolveOneDrivePersonal(url) {
  // For short links (1drv.ms) we need to follow redirects to reach the
  // canonical onedrive.live.com URL that carries resid + authkey.
  let target = url;
  if (/1drv\.ms/i.test(url)) {
    let current = url;
    for (let i = 0; i < 6; i++) {
      let res;
      try {
        res = await fetch(current, { redirect: 'manual' });
      } catch {
        break;
      }
      const loc = res.headers.get('location');
      if (!loc) break;
      current = loc;
      if (/resid=/i.test(current)) break;
    }
    target = current;
  }

  try {
    const u = new URL(target);
    const resid = u.searchParams.get('resid');
    const authkey = u.searchParams.get('authkey');
    if (resid) {
      const params = new URLSearchParams();
      params.set('resid', resid);
      if (authkey) params.set('authkey', authkey);
      // Legacy direct-download endpoint — redirects to the real file CDN.
      return `https://onedrive.live.com/download?${params.toString()}`;
    }
  } catch {
    // fall through to shares API
  }

  // Last resort: shares API (may be broken for new short-link formats).
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