import * as http from 'http';
import { SimpleClient } from 'index';
import { SimpleRequest } from 'interfaces';
import { AddressInfo } from 'net';
import option from './option';

export default class RestApi extends http.Server {
  public port: number;
  public client: SimpleClient;

  public server: http.Server;

  constructor(client: SimpleClient, port: number) {
    super();

    this.port = port;
    this.client = client;

    if (!this.client.dashboard?.enabled || !this.client.dashboard.enable_rest_api) return;

    this.on('request', this.handle_request);
  }

  handle_request(req: SimpleRequest, res: http.ServerResponse) {
    if (
      this.client.dashboard?.whitelist &&
      !this.client.dashboard.allowed_addresses?.find((addr) => addr === (req.socket.address() as AddressInfo).address)
    )
      return res.writeHead(403).end();

    if (!req.url) return res.writeHead(404).end();

    const url_parts = req.url.split('?');
    req.client = this.client;
    req.uri = url_parts[0];
    req.query = {};

    url_parts[1]?.split('&').forEach((query) => {
      const query_parts = query.split('=');

      req.query[query_parts[0]] = query_parts[1];
    });

    if (req.uri === '/option') option(req, res);

    return;
  }

  public start(cb: Function = () => {}) {
    this.listen(this.port, '0.0.0.0', cb());
  }
}
