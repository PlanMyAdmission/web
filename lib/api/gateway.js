import 'server-only';

import { GatewayError } from '@/lib/api/errors.js';

const BASE_URL = process.env.GATEWAY_URL;

const buildUrl = (path, query) => {
  if (!BASE_URL) {
    throw new GatewayError({
      code: 'GATEWAY_URL_MISSING',
      message: 'GATEWAY_URL environment variable is not configured',
      status: 0,
    });
  }

  const url = new URL(path.startsWith('/') ? path : `/${path}`, BASE_URL);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

const parseEnvelope = async (res) => {
  const text = await res.text();
  if (!text) return { data: null, meta: undefined, error: null };

  try {
    return JSON.parse(text);
  } catch {
    return {
      data: null,
      meta: undefined,
      error: { code: 'INVALID_JSON', message: text.slice(0, 200) },
    };
  }
};

export const gatewayFetch = async (path, options = {}) => {
  const {
    query,
    revalidate,
    tags,
    cache,
    method = 'GET',
    headers,
    body,
    signal,
  } = options;

  const init = {
    method,
    headers: {
      accept: 'application/json',
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(headers || {}),
    },
    signal,
  };

  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  if (cache) {
    init.cache = cache;
  } else if (typeof revalidate === 'number' || tags) {
    init.next = {
      ...(typeof revalidate === 'number' ? { revalidate } : {}),
      ...(tags ? { tags } : {}),
    };
  }

  const url = buildUrl(path, query);
  const res = await fetch(url, init);
  const envelope = await parseEnvelope(res);

  if (!res.ok) {
    const err = envelope?.error || {};
    throw new GatewayError({
      code: err.code,
      message: err.message,
      status: res.status,
      rid: err.rid,
    });
  }

  return { data: envelope.data, meta: envelope.meta, rid: envelope.rid };
};

export const gatewayAssetUrl = (path) => buildUrl(path);
