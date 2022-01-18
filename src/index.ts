// TODO: configuration
import _SimpleClient from "./simple_client";
import { ClientInitOptions, CommandType } from "types";
import { Command } from "./interfaces";

// TODO: make it async

const SimpleClient = (
  token: string,
  client_id: string,
  options?: ClientInitOptions
): _SimpleClient => {
  return new _SimpleClient(token, client_id, options);
};

export { SimpleClient, CommandType, Command };
