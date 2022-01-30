import { IncomingMessage } from 'http';
import { SimpleClient } from 'index';

interface Request extends IncomingMessage {
  client: SimpleClient;
  uri: string;
  query: {
    [key: string]: string;
  };
}

export default Request;
