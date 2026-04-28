export class GatewayError extends Error {
  constructor({ code, message, status, rid }) {
    super(message || code || 'Gateway request failed');
    this.name = 'GatewayError';
    this.code = code || 'GATEWAY_ERROR';
    this.status = status || 0;
    this.rid = rid || null;
  }

  get isNotFound() {
    return this.status === 404;
  }
}
