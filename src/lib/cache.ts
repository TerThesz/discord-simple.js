export default class SimpleCache {
  private _cache_data: {
    [key: string]: {
      [key: string]: any;
    };
  };
  public cache_timeout: number;

  public constructor(cache_timeout: number) {
    this._cache_data = {};
    this.cache_timeout = cache_timeout;
  }

  public add(guild_id: string, key: string, value: any): void {
    if (!this._cache_data[guild_id]) this._cache_data[guild_id] = {};
    this._cache_data[guild_id][key] = value;

    if (this.cache_timeout) {
      setTimeout(() => {
        delete this._cache_data[guild_id][key];

        if (Object.keys(this._cache_data[guild_id]).length === 0) delete this._cache_data[guild_id];
      }, this.cache_timeout * 1000);
    }
  }

  public get(guild_id: string, key: string): any {
    return this._cache_data[guild_id] ? this._cache_data[guild_id][key] : undefined;
  }

  public delete(guild_id: string, key: string): void {
    if (!this._cache_data[guild_id]) return;

    delete this._cache_data[guild_id][key];

    if (Object.keys(this._cache_data[guild_id]).length === 0) delete this._cache_data[guild_id];
  }

  public clear(): void {
    this._cache_data = {};
  }

  public find(guild_id: string, value: any): string | undefined {
    if (!this._cache_data[guild_id]) return;

    return Object.keys(this._cache_data[guild_id])[
      Object.values(this._cache_data[guild_id]).indexOf(
        Object.values(this._cache_data[guild_id]).find((cached_value: any) => value === cached_value)
      )
    ];
  }

  public has(guild_id: string, key: string): boolean {
    return !!this.get(guild_id, key);
  }
}
