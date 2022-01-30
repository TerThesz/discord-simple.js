import * as http from 'http';
import { SimpleClient } from 'index';
import { AddressInfo } from 'net';

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

  handle_request(req: http.IncomingMessage, res: http.ServerResponse) {
    if (
      this.client.dashboard?.whitelist &&
      !this.client.dashboard.allowed_addresses?.find((addr) => addr === (req.socket.address() as AddressInfo).address)
    ) {
      res.writeHead(403);
      res.end();

      return;
    }

    res.write('hello!');
    res.end();
  }

  public start(cb: Function = () => {}) {
    this.listen(this.port, '0.0.0.0', cb());
  }
}
