import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url));

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendNotFound(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

function resolvePublicPath(pathname) {
  try {
    const relativePath = decodeURIComponent(pathname.replace(/^\/public\//, ''));
    const filePath = path.resolve(PUBLIC_DIR, relativePath);

    // Bloqueia endereços como /public/../.env, que sairiam da pasta public.
    return filePath.startsWith(PUBLIC_DIR) ? filePath : null;
  } catch {
    return null;
  }
}

export async function serveStaticFile(request, response, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end();
  }

  const filePath = resolvePublicPath(pathname);
  const contentType = filePath && CONTENT_TYPES[path.extname(filePath).toLowerCase()];

  if (!contentType) {
    return sendNotFound(response);
  }

  try {
    const file = await stat(filePath);

    if (!file.isFile()) {
      return sendNotFound(response);
    }

    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': file.size,
      'Cache-Control': 'public, max-age=3600',
    });

    if (request.method === 'HEAD') {
      return response.end();
    }

    createReadStream(filePath).pipe(response);
  } catch {
    sendNotFound(response);
  }
}
