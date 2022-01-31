import { SimpleClient } from 'index';

type EntryData = any;

type EntryInfo = {
  client: SimpleClient;
  guild_id: string;

  option?: {
    key: string;
    value?: any;
  };
};

export { EntryData, EntryInfo };
