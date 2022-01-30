import { SimpleDriver } from '../classes';
import { EntryInfo, EntryData } from '../types';
import * as fs from 'fs';
import { SimpleClient } from '../index';
import { resolve } from 'path';

export default class JsonDriver extends SimpleDriver {
  public path: string;

  public constructor(path: string, client: SimpleClient) {
    super();

    this.path = resolve(client.client_path + client.path_injection + path);

    if (!fs.existsSync(this.path)) return client._folder_error(this.path, ' \r');
  }

  public add_entry(entry_info: EntryInfo): boolean {
    try {
      const file_path = this._get_file(entry_info.guild_id);
      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      file_json[entry_info.option.key] = entry_info.option.value;

      fs.writeFileSync(file_path, JSON.stringify(file_json, null, 2));
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }

    return true;
  }

  public get_entry(entry_info: EntryInfo): EntryData | undefined {
    try {
      const file_path = this._get_file(entry_info.guild_id);
      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      return file_json[entry_info.option.key];
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return undefined;
    }
  }

  public remove_entry(entry_info: EntryInfo): boolean {
    try {
      const file_path = this._get_file(entry_info.guild_id);
      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      delete file_json[entry_info.option.key];

      fs.writeFileSync(file_path, JSON.stringify(file_json, null, 2));
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }

    return true;
  }

  public update_entry(entry_info: EntryInfo): boolean {
    return this.add_entry(entry_info);
  }

  private _get_file(guild_id: string): string {
    const file_path = this.path + '/' + guild_id + '.json';

    if (!fs.existsSync(file_path)) {
      fs.writeFileSync(file_path, '{}');
    }

    return file_path;
  }
}
