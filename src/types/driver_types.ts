import { SimpleClient } from 'index';

type EntryData = {
  [key: string]: any;
};

type EntryInfo = {
  client: SimpleClient;
  guild_id: string;

  option: {
    key: string;
    value?: any;
  };
};

export { EntryData, EntryInfo };
