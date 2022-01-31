import { SimpleDriver } from '../classes';
import { EntryInfo, EntryData } from '../types';
import * as fs from 'fs';
import { SimpleClient } from '../index';
import { resolve } from 'path';
import SimpleCache from '../lib/cache';

// FIXME: poopy code :(

export default class JsonDriver extends SimpleDriver {
  public path: string;
  private _cache: SimpleCache;

  public constructor(path: string, client: SimpleClient) {
    super();

    this.path = resolve(client.client_path + client.path_injection + path);

    if (!fs.existsSync(this.path)) return client._folder_error(this.path, ' \r');

    this._cache = new SimpleCache(client.dashboard?.cache_timeout || 600);
  }

  public add_entry(entry_info: EntryInfo): boolean {
    try {
      const file_path = this._get_file(entry_info);
      if (!file_path) return false;

      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      file_json[entry_info.option?.key + ''] = entry_info.option?.value + '';

      fs.writeFileSync(file_path, JSON.stringify(file_json, null, 2));

      this._cache.add(entry_info.guild_id, entry_info.option?.key + '', entry_info.option?.value + '');
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }

    return true;
  }

  public get_entry(entry_info: EntryInfo): EntryData | undefined {
    const cached_value = this._cache.get(entry_info.guild_id, entry_info.option?.key + '');
    if (cached_value) return cached_value;

    try {
      const file_path = this._get_file(entry_info);
      if (!file_path) return;

      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      try {
        const output = JSON.parse(file_json[entry_info.option?.key + '']);
        if (output === undefined) throw new Error('🙄');

        return output;
      } catch (err: any) {
        return file_json[entry_info.option?.key + ''];
      }
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return undefined;
    }
  }

  public get_all_entries(entry_info: EntryInfo): EntryData[] | undefined {
    try {
      const file_path = this._get_file(entry_info);
      if (!file_path) return;

      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      return file_json;
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return undefined;
    }
  }

  public remove_entry(entry_info: EntryInfo): boolean {
    try {
      const file_path = this._get_file(entry_info);
      if (!file_path) return false;

      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      delete file_json[entry_info.option?.key + ''];

      fs.writeFileSync(file_path, JSON.stringify(file_json, null, 2));

      this._cache.delete(entry_info.guild_id, entry_info.option?.key + '');
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }

    return true;
  }

  public update_entry(entry_info: EntryInfo): boolean {
    return this.add_entry(entry_info);
  }

  private _get_file(entry_info: EntryInfo): string | undefined {
    const path = this.path + '/' + entry_info.guild_id + '.json';

    if (!this.guild_entry_exists(entry_info)) return;

    return path;
  }

  public create_guild_entry(entry_info: EntryInfo, guild_owner: string): boolean {
    try {
      fs.writeFileSync(this.path + '/' + entry_info.guild_id + '.json', '{}');

      return true;
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }
  }

  public delete_guild_entry(entry_info: EntryInfo): boolean {
    try {
      fs.unlinkSync(this.path + '/' + entry_info.guild_id + '.json');

      return true;
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }
  }

  public guild_entry_exists(entry_info: EntryInfo): boolean {
    try {
      return fs.existsSync(this.path + '/' + entry_info.guild_id + '.json');
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return false;
    }
  }

  public get_guild_owner_id(entry_info: EntryInfo): string | undefined {
    try {
      const file_path = this._get_file(entry_info);
      if (!file_path) return;

      const file_data = fs.readFileSync(file_path, 'utf8');
      const file_json = JSON.parse(file_data);

      return file_json.owner;
    } catch (err: any) {
      console.error('😭' + err + '\n');

      return undefined;
    }
  }
}
