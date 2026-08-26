import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

function base64UrlEncode(str) {
  return Buffer.from(str, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const UA = 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

// Follow redirect chain (headers only) until we reach a URL containing
// `resid=` on onedrive.live.com — the canonical share page.
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

// Follow the full redirect chain (headers only) until we leave the
// onedrive.live.com/login.live.com domain — i.e. reach the pre-signed CDN
// blob URL. Returns the blob URL, or null if the chain dead-ends on a
// login/HTML page (private or SPO-migrated share) or loops.
const KEEP_HOST = /onedrive\.live\.com|login\.live\.com|account\.live\.com|1drv\.ms/i;

async function followToFile(startUrl) {
  const trace = [];
  let current = startUrl;
  const seen = new Set();
  for (let i = 0; i < 15; i++) {
    if (seen.has(current)) return { trace: trace.concat(['loop']) };
    seen.add(current);
    let res;
    try {
      res = await fetch(current, { redirect: 'manual', headers: { 'user-agent': UA } });
    } catch (e) {
      return { trace: trace.concat(['fail:' + String(e).slice(0, 50)]) };
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) return { trace: trace.concat(['noloc']) };
      try {
        current = new URL(loc, current).toString();
      } catch {
        return { trace: trace.concat(['badloc']) };
      }
      if (!KEEP_HOST.test(current)) return { url: current, trace };
      continue;
    }
    if (!KEEP_HOST.test(current)) return { url: current, trace };
    const ct = res.headers.get('content-type') || '';
    if (/html/i.test(ct)) return { trace: trace.concat(['html']) };
    return { url: current, trace };
  }
  return { trace: trace.concat(['maxhops']) };
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

  // 3. Legacy direct-download endpoint — works for classic (non-migrated)
  // consumer OneDrive public shares: 302s to a pre-signed CDN blob.
  if (resid) {
    const params = new URLSearchParams();
    params.set('resid', resid);
    if (authkey) params.set('authkey', authkey);
    const downloadUrl = `https://onedrive.live.com/download?${params.toString()}`;
    const blob = await followToFile(downloadUrl);
    if (blob && blob.url) return blob.url;
  }

  // 4. Microsoft shares API — works only for genuinely anonymous shares
  // whose host account has NOT been migrated to the SharePoint backend.
  // SPO-migrated personal accounts return 401 here; the only working
  // download is the browser's JS-driven flow, so we fall back to the
  // original share URL (opens the OneDrive web page).
  const sharesApi = `https://api.onedrive.com/v1.0/shares/u!${base64UrlEncode(url)}/root/content`;
  const sharesBlob = await followToFile(sharesApi);
  if (sharesBlob && sharesBlob.url && sharesBlob.url !== sharesApi) return sharesBlob.url;
  return url;
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