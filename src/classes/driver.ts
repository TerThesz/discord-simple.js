import { EntryData, EntryInfo } from 'types';

export default abstract class Driver {
  public abstract add_entry(entry_info: EntryInfo): Promise<boolean> | boolean;

  public abstract get_entry(entry_info: EntryInfo): Promise<EntryData | undefined> | (EntryData | undefined);
  public abstract get_all_entries(entry_info: EntryInfo): Promise<EntryData[] | undefined> | (EntryData[] | undefined);

  public abstract remove_entry(entry_info: EntryInfo): Promise<boolean> | boolean;

  public abstract update_entry(entry_info: EntryInfo): Promise<boolean> | boolean;

  public abstract get_guild_owner_id(entry_info: EntryInfo): Promise<string | undefined> | (string | undefined);

  public abstract create_guild_entry(guild_id: string): Promise<boolean> | boolean;
  public abstract delete_guild_entry(guild_id: string): Promise<boolean> | boolean;
  public abstract guild_entry_exists(guild_id: string): Promise<boolean> | boolean;
}
